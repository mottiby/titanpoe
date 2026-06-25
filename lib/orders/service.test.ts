import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '@/lib/db';
import {
  createOrder,
  payOrder,
  startWork,
  deliverOrder,
  confirmCompletion,
  cancelOrder,
  openDispute,
  resolveDispute,
} from '@/lib/orders/service';
import { InvalidTransitionError } from '@/lib/orders/state-machine';

// Integration test — hits the real DB. Runs locally (DATABASE_URL set), skips in CI.
const runIntegration = !!process.env.DATABASE_URL && process.env.CI !== 'true';

describe.skipIf(!runIntegration)('order service (integration, live DB)', () => {
  let buyerId: string;
  let sellerUserId: string;
  let sellerProfileId: string;
  let listingId: string;
  const orderIds: string[] = [];

  beforeAll(async () => {
    const stamp = Date.now();
    const buyer = await db.user.create({ data: { email: `svc_buyer_${stamp}@test.local` } });
    const sellerUser = await db.user.create({
      data: { email: `svc_seller_${stamp}@test.local`, roles: ['BUYER', 'SELLER'] },
    });
    const profile = await db.sellerProfile.create({
      data: { userId: sellerUser.id, displayName: 'SvcShop', type: 'BOOSTER' },
    });
    const cat = await db.category.findFirstOrThrow({ where: { slug: 'leveling' } });
    const listing = await db.listing.create({
      data: {
        sellerId: profile.id,
        categoryId: cat.id,
        titleEn: 'Level boost',
        titleRu: 'Прокачка',
        priceCents: 2000,
        etaHours: 24,
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

  async function freshOrder() {
    const order = await createOrder({ buyerId, listingId });
    orderIds.push(order.id);
    return order;
  }

  it('createOrder prices the listing and computes the 15% fee', async () => {
    const order = await freshOrder();
    expect(order.status).toBe('CREATED');
    expect(order.amountCents).toBe(2000);
    expect(order.feeCents).toBe(300);
  });

  it('runs the happy path to COMPLETED and releases escrow', async () => {
    const order = await freshOrder();

    const paid = await payOrder(order.id);
    expect(paid.status).toBe('PAID');
    expect(paid.escrow?.heldCents).toBe(2000);

    await startWork(order.id);
    const delivered = await deliverOrder(order.id);
    expect(delivered.status).toBe('DELIVERED');
    expect(delivered.deliveredAt).toBeInstanceOf(Date);

    const completed = await confirmCompletion(order.id);
    expect(completed.status).toBe('COMPLETED');
    expect(completed.escrow?.releasedAt).toBeInstanceOf(Date);
  });

  it('refunds the buyer when a paid order is cancelled', async () => {
    const order = await freshOrder();
    await payOrder(order.id);

    const cancelled = await cancelOrder(order.id);
    expect(cancelled.status).toBe('CANCELLED');

    const escrow = await db.escrowTxn.findUnique({ where: { orderId: order.id } });
    expect(escrow?.refundedAt).toBeInstanceOf(Date);
  });

  it('resolves a dispute by releasing to the seller', async () => {
    const order = await freshOrder();
    await payOrder(order.id);
    await startWork(order.id);
    await deliverOrder(order.id);
    await openDispute(order.id, 'item not delivered as described');

    const resolved = await resolveDispute(order.id, 'RELEASE');
    expect(resolved.status).toBe('COMPLETED');
  });

  it('rejects an illegal transition (confirm before delivery)', async () => {
    const order = await freshOrder();
    await expect(confirmCompletion(order.id)).rejects.toBeInstanceOf(InvalidTransitionError);
  });
});
