import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';

async function orderParties(orderId: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      buyer: true,
      listing: { include: { seller: { include: { user: true } } } },
    },
  });
  if (!order) return null;
  return {
    buyerEmail: order.buyer.email,
    sellerEmail: order.listing.seller.user.email,
    title: order.listing.titleEn,
  };
}

export async function notifyNewOrder(orderId: string): Promise<void> {
  const p = await orderParties(orderId);
  if (!p) return;
  await sendEmail(
    p.sellerEmail,
    `New order: ${p.title}`,
    `<p>You have a new order for "<strong>${p.title}</strong>". Open your seller dashboard to start work.</p>`,
  );
}

export async function notifyDelivered(orderId: string): Promise<void> {
  const p = await orderParties(orderId);
  if (!p) return;
  await sendEmail(
    p.buyerEmail,
    `Order delivered: ${p.title}`,
    `<p>Your order "<strong>${p.title}</strong>" was marked delivered. Please confirm to release the payment.</p>`,
  );
}

export async function notifyCompleted(orderId: string): Promise<void> {
  const p = await orderParties(orderId);
  if (!p) return;
  await sendEmail(
    p.sellerEmail,
    `Payment released: ${p.title}`,
    `<p>Order "<strong>${p.title}</strong>" is complete and the payment has been released to you.</p>`,
  );
}
