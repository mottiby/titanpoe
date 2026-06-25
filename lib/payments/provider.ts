// Provider-agnostic payment abstraction. A real PSP (Stripe Connect, a
// gaming-friendly processor, crypto, ...) or a manual provider implements this.
// Escrow orchestration depends only on this interface — never on a specific PSP.

export interface Money {
  amountCents: number;
  currency: string;
}

export interface PaymentRef {
  /** Opaque identifier from the provider (e.g. a PaymentIntent / transfer id). */
  providerRef: string;
}

export interface PaymentProvider {
  /** Charge the buyer and hold the funds in escrow (not yet the seller's). */
  hold(input: { orderId: string; amount: Money }): Promise<PaymentRef>;

  /** Release escrowed funds to the seller, minus the platform fee. */
  release(input: {
    orderId: string;
    sellerRef: string;
    amount: Money;
    feeCents: number;
    holdRef: string; // the hold's providerRef (e.g. PaymentIntent id)
  }): Promise<PaymentRef>;

  /** Refund escrowed funds to the buyer (full or partial). */
  refund(input: {
    orderId: string;
    amount: Money;
    holdRef: string; // the hold's providerRef (e.g. PaymentIntent id)
  }): Promise<PaymentRef>;
}
