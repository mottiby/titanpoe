import { describe, it, expect, beforeAll } from 'vitest';
import Stripe from 'stripe';
import { StripePaymentProvider } from '@/lib/payments/stripe-provider';

// Hits the live Stripe TEST API. Runs locally when STRIPE_SECRET_KEY is set; skips in CI.
const runStripe = !!process.env.STRIPE_SECRET_KEY && process.env.CI !== 'true';

describe.skipIf(!runStripe)('StripePaymentProvider (live Stripe test API)', () => {
  let stripe: Stripe;
  let provider: StripePaymentProvider;
  let sellerAcct: string;
  let currency: string;

  beforeAll(async () => {
    // Construct here (not in the describe body) so a skipped suite never touches Stripe.
    const key = process.env.STRIPE_SECRET_KEY as string;
    stripe = new Stripe(key);
    provider = new StripePaymentProvider(key);

    // Connected account in the platform's own country/currency (no cross-border).
    // dob 1902-01-01 = immediate test-mode identity verification.
    const platform = await stripe.accounts.retrieve(null);
    const country = platform.country ?? 'DE';
    currency = platform.default_currency ?? 'eur';
    const stamp = Date.now();
    const account = await stripe.accounts.create({
      type: 'custom',
      country,
      email: `seller_${stamp}@test.local`,
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
      business_type: 'individual',
      business_profile: { url: 'https://accessible.stripe.com', mcc: '5734' },
      individual: {
        first_name: 'Test',
        last_name: 'Seller',
        email: `seller_${stamp}@test.local`,
        phone: '+37060000000',
        dob: { day: 1, month: 1, year: 1902 },
        address: { line1: 'Gedimino pr. 1', city: 'Vilnius', postal_code: '01103', country },
      },
      external_account: {
        object: 'bank_account',
        country,
        currency,
        account_number: 'LT121000011101001000',
      },
      tos_acceptance: { date: Math.floor(Date.now() / 1000), ip: '8.8.8.8' },
    });
    sellerAcct = account.id;
  }, 30000);

  it('hold charges the buyer and returns a PaymentIntent id', async () => {
    const ref = await provider.hold({
      orderId: `t_hold_${Date.now()}`,
      amount: { amountCents: 2000, currency },
    });
    expect(ref.providerRef).toMatch(/^pi_/);
  });

  it('release transfers funds (minus the fee) to the connected account', async () => {
    const orderId = `t_rel_${Date.now()}`;
    const hold = await provider.hold({ orderId, amount: { amountCents: 2000, currency } });
    const ref = await provider.release({
      orderId,
      sellerRef: sellerAcct,
      amount: { amountCents: 2000, currency },
      feeCents: 300,
      holdRef: hold.providerRef,
    });
    expect(ref.providerRef).toMatch(/^tr_/);
  });

  it('refund returns a refund id', async () => {
    const orderId = `t_ref_${Date.now()}`;
    const hold = await provider.hold({ orderId, amount: { amountCents: 2000, currency } });
    const ref = await provider.refund({
      orderId,
      amount: { amountCents: 2000, currency },
      holdRef: hold.providerRef,
    });
    expect(ref.providerRef).toMatch(/^re_/);
  });
});
