'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getLocale } from 'next-intl/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import * as orders from '@/lib/orders/service';
import { configuredAmountCents } from '@/lib/orders/pricing';
import {
  providerForSeller,
  isStripeRail,
  stripeCheckoutProvider,
} from '@/lib/payments/select';
import type { CheckoutLine } from '@/lib/payments/provider';
import { notifyNewOrder } from '@/lib/orders/notify';
import { getOrigin } from '@/lib/base-url';

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');
  return session.user.id;
}

const AddInput = z.object({
  listingId: z.string(),
  tierId: z.string().optional(),
  quantity: z.coerce.number().int().min(1).max(20).default(1),
  addonIds: z.array(z.string()).default([]),
});

/** Add a configured selection to the cart (validates tier belongs to listing). */
export async function addToCart(formData: FormData) {
  const userId = await requireUserId();
  const input = AddInput.parse({
    listingId: formData.get('listingId'),
    tierId: formData.get('tierId') || undefined,
    quantity: formData.get('quantity') ?? 1,
    addonIds: formData.getAll('addon').map(String),
  });

  const listing = await db.listing.findUniqueOrThrow({
    where: { id: input.listingId },
    include: { seller: true, tiers: true },
  });
  if (listing.seller.userId === userId) redirect(`/catalog/${input.listingId}`);
  if (input.tierId && !listing.tiers.some((t) => t.id === input.tierId)) {
    redirect(`/catalog/${input.listingId}`);
  }

  await db.cartItem.create({
    data: {
      userId,
      listingId: input.listingId,
      tierId: input.tierId ?? null,
      quantity: input.quantity,
      addonIds: input.addonIds,
    },
  });
  revalidatePath('/', 'layout'); // refresh header cart count
  redirect(`/catalog/${input.listingId}?flash=addedToCart`);
}

export async function removeCartItem(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get('id'));
  await db.cartItem.deleteMany({ where: { id, userId } });
  revalidatePath('/', 'layout');
}

/**
 * Check out the whole cart: one escrow Order per item (price recomputed from DB).
 * Stripe-rail items are batched into a single hosted Checkout (one charge to the
 * platform, transfers per order on release); manual-rail items (RMT categories or
 * sellers without Stripe) are held instantly. With any Stripe lines the buyer is
 * redirected to Checkout and those orders become PAID via the webhook.
 */
export async function checkoutCart() {
  const userId = await requireUserId();
  const items = await db.cartItem.findMany({
    where: { userId },
    include: {
      listing: { include: { seller: true, tiers: true, addons: true, category: true } },
    },
  });
  if (items.length === 0) redirect('/cart');

  const locale = await getLocale();
  const origin = await getOrigin();
  const stripeLines: CheckoutLine[] = [];

  for (const it of items) {
    if (it.listing.seller.userId === userId) continue; // never buy own listing
    const amountCents = configuredAmountCents(it.listing, {
      tierId: it.tierId ?? undefined,
      quantity: it.quantity,
      addonIds: it.addonIds,
    });
    const order = await orders.createOrder({
      buyerId: userId,
      listingId: it.listingId,
      amountCents,
    });

    if (isStripeRail(it.listing.seller.stripeAcctId, it.listing.category.slug)) {
      stripeLines.push({
        orderId: order.id,
        amount: { amountCents, currency: 'eur' },
        name: it.listing.titleEn,
      });
    } else {
      // Manual rail: instant hold (order -> PAID) and notify the seller.
      await orders.payOrder(
        order.id,
        providerForSeller(it.listing.seller.stripeAcctId, it.listing.category.slug),
      );
      await notifyNewOrder(order.id);
    }
  }

  await db.cartItem.deleteMany({ where: { userId } });
  revalidatePath('/', 'layout');

  if (stripeLines.length > 0) {
    const checkout = await stripeCheckoutProvider().createCheckout({
      lines: stripeLines,
      successUrl: `${origin}/${locale}/orders?flash=ordersPlaced`,
      cancelUrl: `${origin}/${locale}/cart`,
    });
    if (checkout.url) redirect(checkout.url); // hosted checkout for Stripe items
  }

  redirect('/orders?flash=ordersPlaced');
}
