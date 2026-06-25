'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import * as orders from '@/lib/orders/service';

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');
  return session.user.id;
}

/** Buyer places an order from a listing and pays into escrow (manual provider for now). */
export async function placeOrder(formData: FormData) {
  const userId = await requireUserId();
  const listingId = String(formData.get('listingId'));

  const listing = await db.listing.findUniqueOrThrow({
    where: { id: listingId },
    include: { seller: true },
  });
  if (listing.seller.userId === userId) redirect(`/catalog/${listingId}`); // can't buy own listing

  const order = await orders.createOrder({ buyerId: userId, listingId });
  await orders.payOrder(order.id); // manual escrow hold — real PSP checkout replaces this
  redirect(`/orders/${order.id}`);
}

async function authorize(orderId: string, role: 'buyer' | 'seller') {
  const userId = await requireUserId();
  const order = await db.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { listing: { include: { seller: true } } },
  });
  const ok =
    role === 'buyer'
      ? order.buyerId === userId
      : order.listing.seller.userId === userId;
  if (!ok) redirect(`/orders/${orderId}`);
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
}

export async function buyerConfirm(formData: FormData) {
  const orderId = String(formData.get('orderId'));
  await authorize(orderId, 'buyer');
  await orders.confirmCompletion(orderId);
}

export async function buyerCancel(formData: FormData) {
  const orderId = String(formData.get('orderId'));
  await authorize(orderId, 'buyer');
  await orders.cancelOrder(orderId);
}

export async function buyerDispute(formData: FormData) {
  const orderId = String(formData.get('orderId'));
  const reason = String(formData.get('reason') ?? '').trim() || 'No reason provided';
  await authorize(orderId, 'buyer');
  await orders.openDispute(orderId, reason);
}
