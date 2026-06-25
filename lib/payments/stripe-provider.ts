import Stripe from 'stripe';
import type {
  CheckoutInput,
  CheckoutResult,
  Money,
  PaymentProvider,
  PaymentRef,
} from './provider';

// Stripe Connect implementation using the "separate charges and transfers" model.
// Source: https://docs.stripe.com/connect/separate-charges-and-transfers
//   checkout -> hosted Checkout Session; the buyer enters their own card
//   hold     -> charge the buyer to the platform (PaymentIntent, transfer_group)
//   release  -> Transfer to the seller's connected account (amount - platform fee)
//   refund   -> Refund the PaymentIntent
export class StripePaymentProvider implements PaymentProvider {
  private readonly stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey);
  }

  // Hosted Checkout the buyer completes themselves. One charge to the platform
  // (transfer_group = order id) covers every line; on completion the webhook
  // marks the order(s) PAID. Funds reach sellers later via release() transfers.
  // Source: https://docs.stripe.com/payments/checkout
  async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    const orderIds = input.lines.map((l) => l.orderId);
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: input.lines.map((l) => ({
        quantity: 1,
        price_data: {
          currency: l.amount.currency,
          unit_amount: l.amount.amountCents,
          product_data: { name: l.name },
        },
      })),
      payment_intent_data: {
        transfer_group: orderIds[0],
        metadata: { orderIds: orderIds.join(',') },
      },
      metadata: { orderIds: orderIds.join(',') },
      client_reference_id: orderIds[0],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    });
    return { url: session.url };
  }

  async hold(input: { orderId: string; amount: Money }): Promise<PaymentRef> {
    const pi = await this.stripe.paymentIntents.create({
      amount: input.amount.amountCents,
      currency: input.amount.currency,
      confirm: true,
      payment_method: 'pm_card_visa', // test payment method; real flow uses Elements
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      transfer_group: input.orderId,
      metadata: { orderId: input.orderId },
    });
    return { providerRef: pi.id };
  }

  async release(input: {
    orderId: string;
    sellerRef: string;
    amount: Money;
    feeCents: number;
    holdRef: string;
  }): Promise<PaymentRef> {
    // source_transaction ties the transfer to the original charge so funds are
    // available even before the platform balance settles.
    const pi = await this.stripe.paymentIntents.retrieve(input.holdRef);
    const chargeId =
      typeof pi.latest_charge === 'string' ? pi.latest_charge : pi.latest_charge?.id;

    const transfer = await this.stripe.transfers.create({
      amount: input.amount.amountCents - input.feeCents,
      currency: input.amount.currency,
      destination: input.sellerRef, // connected account id (acct_...)
      transfer_group: input.orderId,
      ...(chargeId ? { source_transaction: chargeId } : {}),
      metadata: { orderId: input.orderId },
    });
    return { providerRef: transfer.id };
  }

  async refund(input: {
    orderId: string;
    amount: Money;
    holdRef: string;
  }): Promise<PaymentRef> {
    const refund = await this.stripe.refunds.create({ payment_intent: input.holdRef });
    return { providerRef: refund.id };
  }
}
