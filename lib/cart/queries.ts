import { db } from '@/lib/db';

/** Cart items with everything needed to price + render them. */
export function getCartItems(userId: string) {
  return db.cartItem.findMany({
    where: { userId },
    include: {
      listing: {
        include: { category: true, seller: true, tiers: true, addons: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export function getCartCount(userId: string) {
  return db.cartItem.count({ where: { userId } });
}

/** Wallet balance (cents) for the header chip / account. */
export async function getUserBalance(userId: string): Promise<number> {
  const u = await db.user.findUnique({
    where: { id: userId },
    select: { balanceCents: true },
  });
  return u?.balanceCents ?? 0;
}
