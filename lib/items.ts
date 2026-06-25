// Resolves a listing/category to its curated transparent item art under
// /public/items. These PNGs ship with a baked-in warm gold rim-glow, so the
// card art layers a matching gold glow beneath them (see listing-art.tsx).
//
// Returns undefined when nothing matches so callers fall back to the generative
// <ListingArt> with no broken images. Image files live in public/items/.

// Demo listings (prisma/seed-demo.ts) keyed by their stable id → item slug.
const byListingId: Record<string, string> = {
  'demo-listing-exalted': 'exalted-orb',
  'demo-listing-divine': 'divine-orbs',
  'demo-listing-arbiter': 'arbiter-of-ash',
  'demo-listing-leveling': 'power-leveling',
  'demo-listing-sekhemas': 'trial-of-the-sekhemas',
  'demo-listing-atlas': 'atlas-boost',
  'demo-listing-craft': 'gear-crafting',
  'demo-listing-coaching': 'coaching',
  'demo-listing-unique': 'headhunter',
};

// Category fallback (also used by category cards / banners) → item slug.
const byCategory: Record<string, string> = {
  currency: 'exalted-orb',
  items: 'headhunter',
  leveling: 'power-leveling',
  carries: 'arbiter-of-ash',
  atlas: 'atlas-boost',
  challenges: 'ascension-trials',
  crafting: 'gear-crafting',
  coaching: 'coaching',
};

/**
 * Picks the best item image for a card.
 * @returns a public path like `/items/exalted-orb.png`, or `undefined`.
 */
export function itemImage(opts: { id?: string; categorySlug?: string }): string | undefined {
  const slug =
    (opts.id && byListingId[opts.id]) ||
    (opts.categorySlug && byCategory[opts.categorySlug]) ||
    undefined;
  return slug ? `/items/${slug}.png` : undefined;
}
