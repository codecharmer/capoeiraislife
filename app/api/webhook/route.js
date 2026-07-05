import Stripe from 'stripe';
import { readSecret } from '@/lib/secrets';

// Stripe requires the raw, unparsed body to verify the signature.
export const dynamic = 'force-dynamic';

const PRINTFUL_API = 'https://api.printful.com';

function mapRecipient(session) {
  const ship = session.shipping_details || session.customer_details || {};
  const addr = ship.address || {};
  return {
    name: ship.name || session.customer_details?.name || 'Customer',
    email: session.customer_details?.email || undefined,
    phone: session.customer_details?.phone || undefined,
    address1: addr.line1 || '',
    address2: addr.line2 || '',
    city: addr.city || '',
    state_code: addr.state || undefined,
    country_code: addr.country || '',
    zip: addr.postal_code || '',
  };
}

async function createPrintfulOrder(session) {
  const token = readSecret('.printful-token', 'PRINTFUL_TOKEN');
  if (!token) return;

  let fulfillment = [];
  try {
    fulfillment = JSON.parse(session.metadata?.printful_items || '[]');
  } catch {
    fulfillment = [];
  }
  const items = fulfillment
    .filter((i) => i && i.v)
    .map((i) => ({ sync_variant_id: Number(i.v), quantity: Math.max(1, Number(i.q) || 1) }));
  if (!items.length) return;

  const storeId = readSecret('.printful-store-id', 'PRINTFUL_STORE_ID');
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  if (storeId) headers['X-PF-Store-Id'] = String(storeId);

  const res = await fetch(`${PRINTFUL_API}/orders`, {
    method: 'POST',
    headers,
    // confirm:false leaves the order as a draft for manual review before charging.
    // Set to true (or call /orders/{id}/confirm) to auto-submit for fulfilment.
    body: JSON.stringify({
      confirm: false,
      external_id: session.id,
      recipient: mapRecipient(session),
      items,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('Printful order failed', res.status, text);
  }
}

export async function POST(request) {
  const secretKey = readSecret('.stripe-secret', 'STRIPE_SECRET_KEY');
  const webhookSecret = readSecret('.stripe-webhook-secret', 'STRIPE_WEBHOOK_SECRET');
  if (!secretKey || !webhookSecret) {
    return Response.json({ error: 'Webhook not configured.' }, { status: 503 });
  }

  const stripe = new Stripe(secretKey);
  const sig = request.headers.get('stripe-signature');
  const raw = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (e) {
    return Response.json({ error: `Invalid signature: ${e.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // With a shared Stripe account, every endpoint receives every event.
    // Only fulfill sessions this site created (tagged in metadata.site).
    let ownHost = '';
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      try { ownHost = new URL(process.env.NEXT_PUBLIC_BASE_URL).host; } catch { ownHost = ''; }
    }
    // Behind the Apache reverse proxy the raw Host may be 127.0.0.1:3001,
    // so prefer the forwarded host set by the proxy.
    if (!ownHost) ownHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
    const sessionSite = session.metadata?.site || '';
    if (sessionSite && ownHost && sessionSite !== ownHost) {
      return Response.json({ received: true, skipped: 'other-site' });
    }
    try {
      await createPrintfulOrder(session);
    } catch (e) {
      console.error('Fulfillment error', e);
      // Return 200 so Stripe does not retry indefinitely; error is logged.
    }
  }

  return Response.json({ received: true });
}
