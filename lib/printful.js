// Server-only Printful integration. Fetches synced products from the Printful
// store and maps them into the shape the storefront components expect.
//
// Auth: reads the Printful API token from PRINTFUL_TOKEN env or the
// `.printful-token` file in the secure dir (see lib/secrets.js).
// For account-level tokens you must also set PRINTFUL_STORE_ID.
import { readSecret, readSecretNumber } from './secrets';
import { getExtraMockups } from './printful-mockups';

const PRINTFUL_API = 'https://api.printful.com';

// Map common Printful product-type keywords to the store's collection slugs.
const CATEGORY_RULES = [
  [/hoodie|sweatshirt|crewneck/i, 'hoodies'],
  [/tank/i, 'tank-tops'],
  [/hat|cap|beanie/i, 'hats'],
  [/tee|t-shirt|shirt|long ?sleeve/i, 't-shirts'],
  [/tote|bag|mug|sticker|poster|accessor/i, 'accessories'],
];

// Best-effort color name -> hex for swatches. Falls back to a neutral grey.
const COLOR_HEX = {
  black: '#141414', white: '#F5F5F5', bone: '#E8E0CE', natural: '#E8E0CE',
  navy: '#1B2A4A', 'navy blue': '#1B2A4A', olive: '#46523B', 'military green': '#46523B',
  charcoal: '#2B2B2B', 'dark grey': '#3A3A3A', 'dark heather': '#3A3A3A', grey: '#8A8A8A',
  gray: '#8A8A8A', 'heather grey': '#B0B0B0', red: '#B3261E', maroon: '#5E1414',
  green: '#2E7D32', blue: '#1E63B3', royal: '#1E63B3', 'royal blue': '#1E63B3',
  sand: '#D8C7A6', tan: '#D8C7A6', brown: '#5A3B22', pink: '#E6A0B5', purple: '#5E3B7E',
  yellow: '#E6C34A', orange: '#E07B2A',
};

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'product';
}

function categoryFor(name) {
  for (const [re, slug] of CATEGORY_RULES) {
    if (re.test(name)) return slug;
  }
  return 'accessories';
}

function colorHex(name) {
  if (!name) return '#8A8A8A';
  return COLOR_HEX[name.trim().toLowerCase()] || '#8A8A8A';
}

// Sync variant names look like "Product Name - Color / Size" or "Product - Size".
function parseVariant(name) {
  const dash = name.lastIndexOf(' - ');
  const tail = dash >= 0 ? name.slice(dash + 3) : name;
  const parts = tail.split('/').map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return { color: parts[0], size: parts[1] };
  if (parts.length === 1) return { color: null, size: parts[0] };
  return { color: null, size: 'One Size' };
}

function authHeaders(token, storeId) {
  const headers = { Authorization: `Bearer ${token}` };
  if (storeId) headers['X-PF-Store-Id'] = String(storeId);
  return headers;
}

async function pf(path, token, storeId) {
  const res = await fetch(`${PRINTFUL_API}${path}`, {
    headers: authHeaders(token, storeId),
    // Product data is cached at build/ISR level, so no per-request caching needed.
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Printful ${path} -> ${res.status}`);
  }
  const json = await res.json();
  return json.result;
}

function mapProduct(detail, multiplier) {
  const sp = detail.sync_product || {};
  const variants = (detail.sync_variants || []).filter((v) => !v.is_ignored);
  if (!variants.length) return null;

  const colorsMap = new Map();
  const sizesSet = new Set();
  const images = [];
  const variantIndex = {}; // "color|size" -> sync_variant_id

  let minPrice = Infinity;

  for (const v of variants) {
    const parsed = parseVariant(v.name || '');
    const color = parsed.color || 'Default';
    const size = parsed.size || 'One Size';
    sizesSet.add(size);
    if (!colorsMap.has(color)) colorsMap.set(color, { name: color, hex: colorHex(color) });
    variantIndex[`${color}|${size}`] = v.id;

    const price = Number(v.retail_price) * multiplier;
    if (Number.isFinite(price) && price < minPrice) minPrice = price;

    // Collect every mockup Printful generated for this variant (front, back,
    // sleeve, lifestyle, etc.), not just the first, so the gallery is fuller.
    // NOTE: v.product.image is deliberately excluded — it's Printful's blank
    // catalog photo without the design.
    for (const f of v.files || []) {
      if (f.type === 'preview' && f.preview_url && !images.includes(f.preview_url)) {
        images.push(f.preview_url);
      }
    }
  }

  if (sp.thumbnail_url && !images.includes(sp.thumbnail_url)) images.unshift(sp.thumbnail_url);
  // Last resort only: bare catalog photo if no mockups exist at all.
  if (!images.length) {
    const bare = variants.find((v) => v.product?.image)?.product.image;
    if (bare) images.push(bare);
  }
  if (!images.length) return null;

  const title = sp.name || 'Product';
  const price = Number.isFinite(minPrice) ? Math.round(minPrice * 100) / 100 : 0;

  return {
    id: `pf-${sp.id}`,
    printfulId: sp.id,
    slug: slugify(title),
    catSlug: categoryFor(title),
    title,
    price,
    compareAt: null,
    rating: 5,
    reviews: 0,
    badge: null,
    colors: Array.from(colorsMap.values()),
    sizes: Array.from(sizesSet),
    images: images.slice(0, 12),
    variantIndex,
    description: sp.name || title,
    source: 'printful',
  };
}

// Returns { products, collections } mapped from Printful, or null on any failure
// so callers can fall back to the static demo catalog.
export async function getPrintfulCatalog() {
  const token = readSecret('.printful-token', 'PRINTFUL_TOKEN');
  if (!token) return null;
  const storeId = readSecret('.printful-store-id', 'PRINTFUL_STORE_ID');
  const multiplier = readSecretNumber('.price-multiplier', 'PRICE_MULTIPLIER', 1) || 1;

  try {
    const list = await pf('/store/products', token, storeId);
    if (!Array.isArray(list) || !list.length) return null;

    const details = await Promise.all(
      list.map((p) => pf(`/store/products/${p.id}`, token, storeId).catch(() => null))
    );

    // The sync-product API exposes only ONE mockup per variant; generate the
    // rest (front/back/etc.) via the Mockup Generator API (cached, non-blocking).
    const valid = details.filter(Boolean);
    let extra = {};
    try {
      extra = await getExtraMockups(valid, token, storeId);
    } catch {
      extra = {};
    }

    const products = valid
      .map((d) => mapProduct(d, multiplier))
      .filter(Boolean)
      .map((p) => {
        const urls = extra[p.printfulId] || [];
        const merged = [...p.images];
        for (const u of urls) if (!merged.includes(u)) merged.push(u);
        return { ...p, images: merged.slice(0, 12) };
      });

    if (!products.length) return null;

    const collSlugs = Array.from(new Set(products.map((p) => p.catSlug)));
    const collections = collSlugs.map((slug) => ({
      slug,
      image: (products.find((p) => p.catSlug === slug)?.images[0]) || products[0].images[0],
    }));

    return { products, collections };
  } catch {
    return null;
  }
}

// Look up a Printful sync_variant_id for a product + chosen color/size.
export function resolveVariantId(product, color, size) {
  if (!product?.variantIndex) return null;
  const c = color || product.colors?.[0]?.name || 'Default';
  const s = size || product.sizes?.[0] || 'One Size';
  return (
    product.variantIndex[`${c}|${s}`] ||
    product.variantIndex[`${c}|One Size`] ||
    Object.values(product.variantIndex)[0] ||
    null
  );
}
