import { ManualPaymentProvider } from './manual-provider';
import { StripePaymentProvider } from './stripe-provider';
import type { PaymentProvider } from './provider';

// Pick the payment provider for an order: Stripe when the seller has a connected
// account and a key is configured, otherwise the manual stub. Currency/items stay
// on the manual rail until a gaming-friendly PSP is added (docs/03 §13).
export function providerForSeller(
  stripeAcctId: string | null | undefined,
): PaymentProvider {
  const key = process.env.STRIPE_SECRET_KEY;
  if (key && stripeAcctId) return new StripePaymentProvider(key);
  return new ManualPaymentProvider();
}
