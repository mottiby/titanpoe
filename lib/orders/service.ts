import { db } from '@/lib/db';
import { platformFeeCents } from '@/lib/fees';
import { assertTransition, type OrderStatus } from '@/lib/orders/state-machine';
import { ManualPaymentProvider } from '@/lib/payments/manual-provider';
import type { Money, PaymentProvider } from '@/lib/payments/provider';

// Default provider is the manual stub until a real PSP is wired per category
// (Stripe for services, gaming PSP for currency/items — see docs/03 §13).
const defaultProvider: PaymentProvider = new ManualPaymentProvider();

function money(order: { amountCents: number }): Money {
  return { amountCents: order.amountCents, currency: 'eur' };
}

/** Create a CREATED order for a listing, pricing it and computing the platform fee. */
export async function createOrder(input: { buyerId: string; listingId: string }) {
  const listing = await db.listing.findUniqueOrThrow({ where: { id: input.listingId } });
  return db.order.create({
    data: {
      listingId: listing.id,
      buyerId: input.buyerId,
      amountCents: listing.priceCents,
      feeCents: platformFeeCents(listing.priceCents),
      status: 'CREATED',
    },
  });
}

async function loadOrder(orderId: string) {
  return db.order.findUniqueOrThrow({ where: { id: orderId } });
}

/** Buyer pays — funds are held in escrow. CREATED -> PAID. */
export async function payOrder(orderId: string, provider: PaymentProvider = defaultProvider) {
  const order = await loadOrder(orderId);
  assertTransition(order.status as OrderStatus, 'PAID');

  const hold = await provider.hold({ orderId, amount: money(order) });

  return db.order.update({
    where: { id: orderId },
    data: {
      status: 'PAID',
      escrow: { create: { stripePaymentId: hold.providerRef, heldCents: order.amountCents } },
    },
    include: { escrow: true },
  });
}

/** Seller starts work. PAID -> IN_PROGRESS. */
export async function startWork(orderId: string) {
  const order = await loadOrder(orderId);
  assertTransition(order.status as OrderStatus, 'IN_PROGRESS');
  return db.order.update({ where: { id: orderId }, data: { status: 'IN_PROGRESS' } });
}

/** Seller delivers with proof — starts the 72h auto-release timer. IN_PROGRESS -> DELIVERED. */
export async function deliverOrder(orderId: string) {
  const order = await loadOrder(orderId);
  assertTransition(order.status as OrderStatus, 'DELIVERED');
  return db.order.update({
    where: { id: orderId },
    data: { status: 'DELIVERED', deliveredAt: new Date() },
  });
}

/** Buyer confirms (or 72h auto) — release escrow to the seller minus the fee. DELIVERED -> COMPLETED. */
export async function confirmCompletion(orderId: string, provider: PaymentProvider = defaultProvider) {
  const order = await db.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { listing: { include: { seller: true } }, escrow: true },
  });
  assertTransition(order.status as OrderStatus, 'COMPLETED');

  const sellerRef = order.listing.seller.stripeAcctId ?? order.listing.seller.id;
  const release = await provider.release({
    orderId,
    sellerRef,
    amount: money(order),
    feeCents: order.feeCents,
    holdRef: order.escrow?.stripePaymentId ?? '',
  });

  return db.order.update({
    where: { id: orderId },
    data: {
      status: 'COMPLETED',
      escrow: { update: { releasedAt: new Date(), stripeTransferId: release.providerRef } },
    },
    include: { escrow: true },
  });
}

/** Cancel an order; refunds the buyer if funds were already held. -> CANCELLED. */
export async function cancelOrder(orderId: string, provider: PaymentProvider = defaultProvider) {
  const order = await db.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { escrow: true },
  });
  assertTransition(order.status as OrderStatus, 'CANCELLED');

  if (order.status === 'PAID' && order.escrow) {
    await provider.refund({
      orderId,
      amount: money(order),
      holdRef: order.escrow.stripePaymentId,
    });
    await db.escrowTxn.update({ where: { orderId }, data: { refundedAt: new Date() } });
  }
  return db.order.update({ where: { id: orderId }, data: { status: 'CANCELLED' } });
}

/** Buyer opens a dispute. IN_PROGRESS | DELIVERED -> DISPUTED. */
export async function openDispute(orderId: string, reason: string) {
  const order = await loadOrder(orderId);
  assertTransition(order.status as OrderStatus, 'DISPUTED');
  return db.order.update({
    where: { id: orderId },
    data: { status: 'DISPUTED', dispute: { create: { reason } } },
    include: { dispute: true },
  });
}

/** Moderator resolves a dispute by refunding the buyer or releasing to the seller. */
export async function resolveDispute(
  orderId: string,
  outcome: 'REFUND' | 'RELEASE',
  provider: PaymentProvider = defaultProvider,
) {
  const order = await db.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { listing: { include: { seller: true } }, escrow: true },
  });
  const target: OrderStatus = outcome === 'REFUND' ? 'REFUNDED' : 'COMPLETED';
  assertTransition(order.status as OrderStatus, target);

  const holdRef = order.escrow?.stripePaymentId ?? '';

  if (outcome === 'REFUND') {
    await provider.refund({ orderId, amount: money(order), holdRef });
    await db.escrowTxn.update({ where: { orderId }, data: { refundedAt: new Date() } });
    await db.dispute.update({ where: { orderId }, data: { state: 'RESOLVED_REFUND' } });
  } else {
    const sellerRef = order.listing.seller.stripeAcctId ?? order.listing.seller.id;
    const release = await provider.release({
      orderId,
      sellerRef,
      amount: money(order),
      feeCents: order.feeCents,
      holdRef,
    });
    await db.escrowTxn.update({
      where: { orderId },
      data: { releasedAt: new Date(), stripeTransferId: release.providerRef },
    });
    await db.dispute.update({ where: { orderId }, data: { state: 'RESOLVED_RELEASE' } });
  }
  return db.order.update({ where: { id: orderId }, data: { status: target } });
}
