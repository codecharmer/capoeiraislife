// Server-only: generates full mockup sets (front, back, etc.) for sync products
// via Printful's Mockup Generator API, since the sync-product API only exposes
// ONE preview image per variant (the extra mockups chosen in the dashboard are
// not available through the API).
//
// Non-blocking state machine, advanced on each ISR render:
//   miss/stale  -> POST create-task, store {status:'pending', task_key}
//   pending     -> GET task once; if completed store {status:'done', urls}
//   done+fresh  -> return cached urls
// Cache lives in the secure dir (outside webroot) so rsync deploys keep it.
import fs from 'fs';
import path from 'path';

const PRINTFUL_API = 'https://api.printful.com';
const TTL_MS = 48 * 60 * 60 * 1000; // regenerate every 48h (mockup URLs are temporary)
const CACHE_FILE = '.printful-mockups-cache-v2.json';

function cachePath() {
  const dir = process.env.SECURE_DIR || path.join(process.cwd(), '..');
  return path.join(dir, CACHE_FILE);
}

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(cachePath(), 'utf8')) || {};
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    fs.writeFileSync(cachePath(), JSON.stringify(cache));
  } catch {}
}

function headers(token, storeId) {
  const h = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  if (storeId) h['X-PF-Store-Id'] = String(storeId);
  return h;
}

// Fetch the available mockup style option groups for a catalog product, so we
// can request ALL styles (Flat, Lifestyle, On-model...) instead of the default.
async function fetchOptionGroups(catalogProductId, token, storeId) {
  try {
    const res = await fetch(
      `${PRINTFUL_API}/mockup-generator/printfiles/${catalogProductId}`,
      { headers: headers(token, storeId), cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.result?.option_groups || [];
  } catch {
    return [];
  }
}

// Build the create-task payload from a sync product detail response.
function buildTask(detail) {
  const variants = (detail.sync_variants || []).filter((v) => !v.is_ignored);
  if (!variants.length) return null;

  const catalogProductId = variants[0].product?.product_id;
  if (!catalogProductId) return null;

  const variantIds = Array.from(
    new Set(variants.map((v) => v.product?.variant_id).filter(Boolean))
  );

  // Use the stored print files (everything except the generated 'preview').
  // Position is required: the stored print files are already fully composed,
  // so place them full-bleed using their own dimensions.
  const files = (variants[0].files || [])
    .filter((f) => f.type !== 'preview' && f.preview_url && f.width && f.height)
    .map((f) => ({
      placement: f.type,
      image_url: f.preview_url,
      position: {
        area_width: f.width,
        area_height: f.height,
        width: f.width,
        height: f.height,
        top: 0,
        left: 0,
      },
    }));

  if (!variantIds.length || !files.length) return null;
  return { catalogProductId, body: { variant_ids: variantIds, format: 'jpg', files } };
}

async function createTask(detail, token, storeId) {
  const task = buildTask(detail);
  if (!task) return null;
  // Ask for every mockup style group so front/back/flat/lifestyle all come back.
  const groups = await fetchOptionGroups(task.catalogProductId, token, storeId);
  if (groups.length) task.body.option_groups = groups;
  const res = await fetch(
    `${PRINTFUL_API}/mockup-generator/create-task/${task.catalogProductId}`,
    { method: 'POST', headers: headers(token, storeId), body: JSON.stringify(task.body), cache: 'no-store' }
  );
  if (!res.ok) return null; // rate limited or bad payload -> retry on a later pass
  const json = await res.json();
  return json?.result?.task_key || null;
}

async function fetchTask(taskKey, token, storeId) {
  const res = await fetch(
    `${PRINTFUL_API}/mockup-generator/task?task_key=${encodeURIComponent(taskKey)}`,
    { headers: headers(token, storeId), cache: 'no-store' }
  );
  if (!res.ok) return { state: 'failed' };
  const json = await res.json();
  const r = json?.result;
  if (!r) return { state: 'failed' };
  if (r.status === 'completed') {
    const urls = [];
    for (const m of r.mockups || []) {
      if (m.mockup_url && !urls.includes(m.mockup_url)) urls.push(m.mockup_url);
      for (const e of m.extra || []) {
        if (e.url && !urls.includes(e.url)) urls.push(e.url);
      }
    }
    return { state: 'done', urls };
  }
  if (r.status === 'failed') return { state: 'failed' };
  return { state: 'pending' };
}

// Returns extra mockup URLs for each sync product id: { [syncProductId]: string[] }.
// Never blocks on generation; missing entries fill in on subsequent ISR passes.
export async function getExtraMockups(details, token, storeId) {
  const cache = loadCache();
  const out = {};
  let dirty = false;
  let created = 0;

  for (const detail of details) {
    const id = detail?.sync_product?.id;
    if (!id) continue;
    const entry = cache[id];

    if (entry?.status === 'done' && Date.now() - entry.ts < TTL_MS) {
      out[id] = entry.urls;
      continue;
    }

    try {
      if (entry?.status === 'pending' && entry.task_key) {
        const r = await fetchTask(entry.task_key, token, storeId);
        if (r.state === 'done') {
          cache[id] = { status: 'done', urls: r.urls, ts: Date.now() };
          out[id] = r.urls;
          dirty = true;
        } else if (r.state === 'failed') {
          delete cache[id]; // recreate on next pass
          dirty = true;
        }
        // still pending -> leave as is
        continue;
      }

      // No entry or stale 'done': keep serving stale urls, and refresh.
      if (entry?.status === 'done') out[id] = entry.urls;

      // Throttle task creation to respect Mockup Generator rate limits.
      if (created >= 4) continue;
      const taskKey = await createTask(detail, token, storeId);
      if (taskKey) {
        cache[id] = { status: 'pending', task_key: taskKey, ts: Date.now() };
        created += 1;
        dirty = true;
      }
    } catch {
      // Network hiccup: try again on the next ISR pass.
    }
  }

  if (dirty) saveCache(cache);
  return out;
}
