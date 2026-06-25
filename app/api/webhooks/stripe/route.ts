import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { markOrderPaid, syncRefundForPaymentIntent } from '@/lib/orders/service';
import { notifyNewOrder } from '@/lib/orders/notify';

// Stripe webhook receiver. Lives under /api (outside the next-intl proxy matcher)
// and runs on Node so the signature can be verified against the raw body.
// Source: https://docs.stripe.com/webhooks
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function stripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key);
}

function orderIdsFromMetadata(meta: Stripe.Metadata | null | undefined): string[] {
  return (meta?.orderIds ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Mark each order PAID (idempotent) and notify the seller once, on first apply. */
async function applyPaid(orderIds: string[], holdRef: string): Promise<void> {
  for (const orderId of orderIds) {
    const { applied } = await markOrderPaid(orderId, holdRef);
    if (!applied) continue;
    // A failed notification must never fail the webhook (Stripe would retry).
    try {
      await notifyNewOrder(orderId);
    } catch {
      /* ignore email errors */
    }
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET is not configured' },
      { status: 500 },
    );
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const body = await req.text(); // raw body — required for signature verification

  let event: Stripe.Event;
  try {
    event = stripeClient().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    // Buyer finished hosted checkout — the canonical "paid" signal.
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const piId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id;
      const orderIds = orderIdsFromMetadata(session.metadata);
      if (piId && orderIds.length) await applyPaid(orderIds, piId);
      break;
    }
    // Belt-and-braces: also acts on the PaymentIntent (idempotent with the above).
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderIds = orderIdsFromMetadata(pi.metadata);
      if (orderIds.length) await applyPaid(orderIds, pi.id);
      break;
    }
    // Connected-account onboarding progress -> seller KYC status.
    case 'account.updated': {
      const account = event.data.object as Stripe.Account;
      const ready = account.capabilities?.transfers === 'active';
      const submitted = account.details_submitted ?? false;
      await db.sellerProfile.updateMany({
        where: { stripeAcctId: account.id },
        data: { kycStatus: ready ? 'VERIFIED' : submitted ? 'PENDING' : 'NONE' },
      });
      break;
    }
    // Keep escrow in sync with out-of-band (dashboard) refunds.
    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const piId =
        typeof charge.payment_intent === 'string'
          ? charge.payment_intent
          : charge.payment_intent?.id;
      if (piId) await syncRefundForPaymentIntent(piId);
      break;
    }
    default:
      break; // acknowledge unhandled types so Stripe stops retrying
  }

  return NextResponse.json({ received: true });
}
