import { db } from '@/lib/db';

export function getDisputedOrders() {
  return db.order.findMany({
    where: { status: 'DISPUTED' },
    include: {
      listing: { include: { seller: true } },
      buyer: true,
      dispute: true,
    },
    orderBy: { createdAt: 'asc' },
  });
}
