import { ManualPaymentProvider } from './manual-provider';
import { StripePaymentProvider } from './stripe-provider';
import type { PaymentProvider } from './provider';

// RMT gate: Stripe prohibits third-party game-currency / item sales (docs/03 §13),
// so those categories stay on the manual rail until a gaming-friendly PSP is added.
const RMT_CATEGORIES = new Set(['currency', 'items']);

/**
 * Whether an order should be charged via Stripe: a key is configured, the seller
 * has a connected account, and the category isn't RMT-gated. Used at checkout
 * time to decide the rail.
 */
export function isStripeRail(
  stripeAcctId: string | null | undefined,
  categorySlug?: string,
): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !stripeAcctId) return false;
  if (categorySlug && RMT_CATEGORIES.has(categorySlug)) return false;
  return true;
}

/**
 * Pick the payment provider for a new order. Stripe when {@link isStripeRail},
 * otherwise the manual stub (sellers without Stripe, RMT categories, or dev).
 */
export function providerForSeller(
  stripeAcctId: string | null | undefined,
  categorySlug?: string,
): PaymentProvider {
  return isStripeRail(stripeAcctId, categorySlug)
    ? new StripePaymentProvider(process.env.STRIPE_SECRET_KEY as string)
    : new ManualPaymentProvider();
}

/** Stripe provider for hosted checkout (cart batch). Throws if no key. */
export function stripeCheckoutProvider(): StripePaymentProvider {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new StripePaymentProvider(key);
}

/**
 * Pick the provider for releasing/refunding an existing order from the rail the
 * hold actually used — Stripe PaymentIntent refs start with `pi_`; the manual
 * stub uses `manual_*`. Deriving from the recorded ref (not re-deriving from the
 * seller/category) keeps release/refund on the same rail as the original charge.
 */
export function providerForHoldRef(
  holdRef: string | null | undefined,
): PaymentProvider {
  const key = process.env.STRIPE_SECRET_KEY;
  if (key && holdRef && holdRef.startsWith('pi_')) {
    return new StripePaymentProvider(key);
  }
  return new ManualPaymentProvider();
}
