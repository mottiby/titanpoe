// Pure, authoritative price computation for the product configurator.
// Server actions recompute totals from DB rows using this — client totals are display-only.

export type PricingListing = {
  priceCents: number;
  tiers: { id: string; priceCents: number }[];
  addons: { id: string; priceCents: number }[];
};

export type Selection = {
  tierId?: string;
  quantity: number;
  addonIds: string[];
};

/** total = (selected tier or base price) × quantity + sum(selected add-ons). */
export function configuredAmountCents(
  listing: PricingListing,
  selection: Selection,
): number {
  const tier = selection.tierId
    ? listing.tiers.find((t) => t.id === selection.tierId)
    : undefined;
  const unitCents = tier ? tier.priceCents : listing.priceCents;
  const addonCents = listing.addons
    .filter((a) => selection.addonIds.includes(a.id))
    .reduce((sum, a) => sum + a.priceCents, 0);
  const qty = Math.max(1, Math.floor(selection.quantity));
  return unitCents * qty + addonCents;
}
