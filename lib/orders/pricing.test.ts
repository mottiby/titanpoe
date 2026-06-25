import { describe, it, expect } from 'vitest';
import { configuredAmountCents, type PricingListing } from '@/lib/orders/pricing';

const listing: PricingListing = {
  priceCents: 1499,
  tiers: [
    { id: 't1', priceCents: 1499 },
    { id: 't2', priceCents: 2799 },
  ],
  addons: [
    { id: 'a1', priceCents: 799 },
    { id: 'a2', priceCents: 499 },
  ],
};

describe('configuredAmountCents', () => {
  it('falls back to base price with no tier', () => {
    expect(configuredAmountCents(listing, { quantity: 1, addonIds: [] })).toBe(1499);
  });

  it('uses the selected tier price', () => {
    expect(
      configuredAmountCents(listing, { tierId: 't2', quantity: 1, addonIds: [] }),
    ).toBe(2799);
  });

  it('multiplies by quantity and adds selected add-ons', () => {
    // tier t2 (2799) × 2 + a1 (799) + a2 (499) = 5598 + 1298 = 6896
    expect(
      configuredAmountCents(listing, {
        tierId: 't2',
        quantity: 2,
        addonIds: ['a1', 'a2'],
      }),
    ).toBe(6896);
  });

  it('ignores unknown add-on ids', () => {
    expect(
      configuredAmountCents(listing, {
        quantity: 1,
        addonIds: ['nope'],
      }),
    ).toBe(1499);
  });

  it('clamps quantity to at least 1', () => {
    expect(configuredAmountCents(listing, { quantity: 0, addonIds: [] })).toBe(1499);
  });
});
