'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import * as orders from '@/lib/orders/service';
import { configuredAmountCents } from '@/lib/orders/pricing';
import { providerForSeller } from '@/lib/payments/select';
import { notifyNewOrder, notifyDelivered, notifyCompleted } from '@/lib/orders/notify';

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');
  return session.user.id;
}

/** Buyer places an order from a listing and pays into escrow. */
export async function placeOrder(formData: FormData) {
  const userId = await requireUserId();
  const listingId = String(formData.get('listingId'));

  const listing = await db.listing.findUniqueOrThrow({
    where: { id: listingId },
    include: { seller: true },
  });
  if (listing.seller.userId === userId) redirect(`/catalog/${listingId}`); // can't buy own listing

  const order = await orders.createOrder({ buyerId: userId, listingId });
  await orders.payOrder(order.id, providerForSeller(listing.seller.stripeAcctId));
  await notifyNewOrder(order.id);
  redirect(`/orders/${order.id}?flash=orderPlaced`);
}

const ConfigInput = z.object({
  listingId: z.string(),
  tierId: z.string().optional(),
  quantity: z.coerce.number().int().min(1).max(20).default(1),
  addonIds: z.array(z.string()).default([]),
});

/**
 * Buyer places a configured order (tier × quantity + add-ons).
 * The total is recomputed from authoritative DB rows — client totals are never trusted.
 */
export async function placeConfiguredOrder(formData: FormData) {
  const userId = await requireUserId();
  const input = ConfigInput.parse({
    listingId: formData.get('listingId'),
    tierId: formData.get('tierId') || undefined,
    quantity: formData.get('quantity') ?? 1,
    addonIds: formData.getAll('addon').map(String),
  });

  const listing = await db.listing.findUniqueOrThrow({
    where: { id: input.listingId },
    include: { seller: true, tiers: true, addons: true },
  });
  if (listing.seller.userId === userId) redirect(`/catalog/${input.listingId}`);

  if (input.tierId && !listing.tiers.some((t) => t.id === input.tierId)) {
    redirect(`/catalog/${input.listingId}`);
  }

  const amountCents = configuredAmountCents(listing, {
    tierId: input.tierId,
    quantity: input.quantity,
    addonIds: input.addonIds,
  });

  const order = await orders.createOrder({
    buyerId: userId,
    listingId: listing.id,
    amountCents,
  });
  await orders.payOrder(order.id, providerForSeller(listing.seller.stripeAcctId));
  await notifyNewOrder(order.id);
  redirect(`/orders/${order.id}?flash=orderPlaced`);
}

async function authorize(orderId: string, role: 'buyer' | 'seller' | 'party') {
  const userId = await requireUserId();
  const order = await db.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { listing: { include: { seller: true } } },
  });
  const isBuyer = order.buyerId === userId;
  const isSeller = order.listing.seller.userId === userId;
  const ok =
    role === 'buyer' ? isBuyer : role === 'seller' ? isSeller : isBuyer || isSeller;
  if (!ok) redirect(`/orders/${orderId}`);
  return order;
}

export async function sellerStartWork(formData: FormData) {
  const orderId = String(formData.get('orderId'));
  await authorize(orderId, 'seller');
  await orders.startWork(orderId);
}

export async function sellerDeliver(formData: FormData) {
  const orderId = String(formData.get('orderId'));
  await authorize(orderId, 'seller');
  await orders.deliverOrder(orderId);
  await notifyDelivered(orderId);
}

export async function buyerConfirm(formData: FormData) {
  const orderId = String(formData.get('orderId'));
  const order = await authorize(orderId, 'buyer');
  await orders.confirmCompletion(orderId, providerForSeller(order.listing.seller.stripeAcctId));
  await notifyCompleted(orderId);
}

export async function buyerCancel(formData: FormData) {
  const orderId = String(formData.get('orderId'));
  const order = await authorize(orderId, 'buyer');
  await orders.cancelOrder(orderId, providerForSeller(order.listing.seller.stripeAcctId));
}

export async function buyerDispute(formData: FormData) {
  const orderId = String(formData.get('orderId'));
  const reason = String(formData.get('reason') ?? '').trim() || 'No reason provided';
  await authorize(orderId, 'buyer');
  await orders.openDispute(orderId, reason);
}

const ReviewInput = z.object({
  orderId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().max(1000).default(''),
});

/** Buyer leaves a review on a completed order; recomputes the seller's rating. */
export async function leaveReview(formData: FormData) {
  const userId = await requireUserId();
  const input = ReviewInput.parse({
    orderId: formData.get('orderId'),
    rating: formData.get('rating'),
    body: formData.get('body') ?? '',
  });

  const order = await db.order.findUniqueOrThrow({
    where: { id: input.orderId },
    include: { listing: { include: { seller: true } } },
  });
  if (order.buyerId !== userId || order.status !== 'COMPLETED') {
    redirect(`/orders/${input.orderId}`);
  }

  await db.review.upsert({
    where: { orderId: input.orderId },
    create: { orderId: input.orderId, rating: input.rating, body: input.body },
    update: { rating: input.rating, body: input.body },
  });

  // Recompute the seller's aggregate rating from all reviews of their listings.
  const sellerId = order.listing.sellerId;
  const agg = await db.review.aggregate({
    where: { order: { listing: { sellerId } } },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await db.sellerProfile.update({
    where: { id: sellerId },
    data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count.rating },
  });

  revalidatePath(`/orders/${input.orderId}`);
}
