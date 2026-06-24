// Platform commission (take rate). See docs/02-product-spec-prd.md §10.
export const PLATFORM_FEE_RATE = 0.15;

/** Platform fee in integer cents for a given gross amount (cents). */
export function platformFeeCents(amountCents: number): number {
  return Math.round(amountCents * PLATFORM_FEE_RATE);
}

/** What the seller receives after the platform fee (cents). */
export function sellerPayoutCents(amountCents: number): number {
  return amountCents - platformFeeCents(amountCents);
}
