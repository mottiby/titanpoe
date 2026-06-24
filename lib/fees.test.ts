import { describe, it, expect } from 'vitest';
import { platformFeeCents, sellerPayoutCents, PLATFORM_FEE_RATE } from './fees';

describe('platform fees', () => {
  it('takes a 15% commission', () => {
    expect(PLATFORM_FEE_RATE).toBe(0.15);
    expect(platformFeeCents(2000)).toBe(300); // $20.00 -> $3.00
  });

  it('rounds to the nearest cent', () => {
    expect(platformFeeCents(1999)).toBe(300); // 299.85 -> 300
  });

  it('splits the amount between fee and seller payout', () => {
    expect(sellerPayoutCents(2000)).toBe(1700);
    expect(platformFeeCents(2000) + sellerPayoutCents(2000)).toBe(2000);
  });
});
