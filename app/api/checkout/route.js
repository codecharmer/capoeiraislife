import Stripe from 'stripe';
import { readSecret } from '@/lib/secrets';

// Dedicated route (NOT the Mongo catch-all) so checkout never needs a database.
export const dynamic = 'force-dynamic';

function baseUrl(request) {
  const env = process.env.NEXT_PUBLIC_BASE_URL;
  if (env) return env.replace(/\/$/, '');
  const origin = request.headers.get('origin');
  if (origin) return origin.replace(/\/$/, '');
  const host = request.headers.get('host');
  return host ? `https://${host}` : 'https://capoeirais.life';
}

export async function POST(request) {
  const secretKey = readSecret('.stripe-secret', 'STRIPE_SECRET_KEY');
  if (!secretKey) {
    return Response.json({ error: 'Payments are not configured.' }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const items = Array.isArray(body?.items) ? body.items : [];
  if (!items.length) {
    return Response.json({ error: 'Cart is empty.' }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const site = baseUrl(request);
  let siteHost = '';
  try { siteHost = new URL(site).host; } catch { siteHost = ''; }

  const line_items = items.map((i) => {
    const cents = Math.max(0, Math.round(Number(i.price) * 100));
    const name = [i.title, [i.color, i.size].filter(Boolean).join(' / ')]
      .filter(Boolean)
      .join(' — ');
    return {
      quantity: Math.max(1, Number(i.qty) || 1),
      price_data: {
        currency: 'usd',
        unit_amount: cents,
        product_data: {
          name: name || 'Product',
          images: i.image ? [i.image] : undefined,
        },
      },
    };
  });

  // Compact map of what to fulfil through Printful, kept small for Stripe metadata.
  const fulfillment = items
    .filter((i) => i.variantId)
    .map((i) => ({ v: Number(i.variantId), q: Math.max(1, Number(i.qty) || 1) }));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'BR', 'PT', 'ES', 'FR', 'DE', 'NL', 'IT'],
      },
      phone_number_collection: { enabled: true },
      success_url: `${site}/?checkout=success`,
      cancel_url: `${site}/?checkout=cancel`,
      metadata: {
        // Tag which site created this session so a shared Stripe account's
        // webhook only fulfills orders that belong to it.
        site: siteHost,
        printful_items: JSON.stringify(fulfillment).slice(0, 500),
      },
    });
    return Response.json({ url: session.url });
  } catch (e) {
    return Response.json({ error: 'Could not start checkout.' }, { status: 500 });
  }
}
