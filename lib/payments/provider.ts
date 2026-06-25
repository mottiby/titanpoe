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

/** One order to be paid for within a single hosted checkout (cart = many lines). */
export interface CheckoutLine {
  orderId: string;
  amount: Money;
  /** Product name shown to the buyer at checkout. */
  name: string;
}

export interface CheckoutInput {
  /** One line per order; a single payment can cover several orders (cart). */
  lines: CheckoutLine[];
  /** Absolute URLs the PSP redirects the buyer back to. */
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  /**
   * Where to redirect the buyer to enter payment. `null` means the provider has
   * no hosted checkout (manual rail) — the caller should fall back to an instant
   * {@link PaymentProvider.hold}.
   */
  url: string | null;
}

export interface PaymentProvider {
  /**
   * Start a hosted checkout the buyer completes themselves (enters their card).
   * The order becomes PAID only once the PSP confirms payment (e.g. via webhook).
   * Returns `{ url: null }` for providers without a hosted flow (manual rail).
   */
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;

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
