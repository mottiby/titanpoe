import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '@/lib/db';
import { createOrder, payOrder, startWork, deliverOrder } from '@/lib/orders/service';
import { autoReleaseDueOrders, AUTO_RELEASE_HOURS } from '@/lib/orders/auto-release';

const runIntegration = !!process.env.DATABASE_URL && process.env.CI !== 'true';

describe.skipIf(!runIntegration)('auto-release (integration, live DB)', () => {
  let buyerId: string;
  let sellerUserId: string;
  let sellerProfileId: string;
  let listingId: string;
  const orderIds: string[] = [];

  beforeAll(async () => {
    const stamp = Date.now();
    const buyer = await db.user.create({ data: { email: `ar_buyer_${stamp}@test.local` } });
    const sellerUser = await db.user.create({
      data: { email: `ar_seller_${stamp}@test.local`, roles: ['BUYER', 'SELLER'] },
    });
    const profile = await db.sellerProfile.create({
      data: { userId: sellerUser.id, displayName: 'AR Shop', type: 'BOOSTER' },
    });
    const cat = await db.category.findFirstOrThrow({ where: { slug: 'leveling' } });
    const listing = await db.listing.create({
      data: {
        sellerId: profile.id,
        categoryId: cat.id,
        titleEn: 'AR boost',
        titleRu: 'AR прокачка',
        priceCents: 1000,
        etaHours: 1,
        fulfillment: 'PARTY_PLAY',
        platform: 'PC',
        league: 'Standard',
        leagueMode: 'SOFTCORE',
      },
    });
    buyerId = buyer.id;
    sellerUserId = sellerUser.id;
    sellerProfileId = profile.id;
    listingId = listing.id;
  });

  afterAll(async () => {
    for (const id of orderIds) await db.order.delete({ where: { id } }).catch(() => {});
    await db.listing.delete({ where: { id: listingId } }).catch(() => {});
    await db.sellerProfile.delete({ where: { id: sellerProfileId } }).catch(() => {});
    await db.user.delete({ where: { id: sellerUserId } }).catch(() => {});
    await db.user.delete({ where: { id: buyerId } }).catch(() => {});
    await db.$disconnect();
  });

  async function deliveredOrder(deliveredAt: Date) {
    const order = await createOrder({ buyerId, listingId });
    orderIds.push(order.id);
    await payOrder(order.id);
    await startWork(order.id);
    await deliverOrder(order.id);
    await db.order.update({ where: { id: order.id }, data: { deliveredAt } });
    return order.id;
  }

  it('releases an order delivered more than 72h ago', async () => {
    const past = new Date(Date.now() - (AUTO_RELEASE_HOURS + 1) * 60 * 60 * 1000);
    const id = await deliveredOrder(past);

    const released = await autoReleaseDueOrders();

    expect(released).toContain(id);
    const order = await db.order.findUniqueOrThrow({ where: { id }, include: { escrow: true } });
    expect(order.status).toBe('COMPLETED');
    expect(order.escrow?.releasedAt).toBeInstanceOf(Date);
  });

  it('does not release an order delivered recently', async () => {
    const recent = new Date(Date.now() - 60 * 60 * 1000); // 1h ago
    const id = await deliveredOrder(recent);

    const released = await autoReleaseDueOrders();

    expect(released).not.toContain(id);
    const order = await db.order.findUniqueOrThrow({ where: { id } });
    expect(order.status).toBe('DELIVERED');
  });
});
