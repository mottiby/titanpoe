import { db } from '@/lib/db';

export function getOrder(id: string) {
  return db.order.findUnique({
    where: { id },
    include: {
      listing: { include: { category: true, seller: true } },
      escrow: true,
      dispute: true,
    },
  });
}

export function getMyOrders(buyerId: string) {
  return db.order.findMany({
    where: { buyerId },
    include: { listing: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export function getSellerOrders(sellerProfileId: string) {
  return db.order.findMany({
    where: { listing: { sellerId: sellerProfileId } },
    include: { listing: { include: { category: true } }, buyer: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrderMessages(orderId: string) {
  const convo = await db.conversation.findUnique({
    where: { orderId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  return convo?.messages ?? [];
}
