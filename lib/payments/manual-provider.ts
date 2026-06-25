import type { Money, PaymentProvider, PaymentRef } from './provider';

// Placeholder provider used until a real PSP is wired. Per docs/03 §13, Stripe
// won't process third-party game RMT, so the currency/items rail will need a
// gaming-friendly PSP. This stub records intent and returns synthetic refs; it
// moves no real money. It lets the order/escrow flow be built end-to-end first.
export class ManualPaymentProvider implements PaymentProvider {
  async hold(input: { orderId: string; amount: Money }): Promise<PaymentRef> {
    return { providerRef: `manual_hold_${input.orderId}` };
  }

  async release(input: {
    orderId: string;
    sellerRef: string;
    amount: Money;
    feeCents: number;
  }): Promise<PaymentRef> {
    return { providerRef: `manual_release_${input.orderId}` };
  }

  async refund(input: { orderId: string; amount: Money }): Promise<PaymentRef> {
    return { providerRef: `manual_refund_${input.orderId}` };
  }
}
