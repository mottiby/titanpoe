---
name: marketplace-conversion-ux
description: overgear-style trust & conversion patterns for a two-sided services marketplace — how to surface escrow/guarantees, ratings, verified sellers and prices to maximize trust and conversion without dark patterns. Use when designing the home/landing, catalog cards, listing/checkout flow, pricing display, CTAs, social proof, or any decision about what to emphasize to make buyers feel safe and act.
---

# Marketplace Conversion & UX

Domain patterns for converting cautious buyers on a high-stakes marketplace (real money + game accounts). Distilled from the overgear teardown: [01-overgear-teardown.md](../../../docs/01-overgear-teardown.md). Pair with **titanpoe2-page-patterns** for where each lands.

## The conversion thesis
Buyers hesitate because of **scam risk + price uncertainty**. Every screen must answer, fast: *Is this safe? What exactly do I get? What does it cost? What do I do next?* Trust signals are not decoration — they are the product's core value (they justify the 15% take rate).

## Trust signals — make them first-class, repeat them
- **Escrow / money-back** — say it where money is at risk (home hero, listing panel, checkout, order page). Microcopy: "Funds held in escrow. Pay only when you confirm."
- **Verified sellers** — badge-check on every seller surface (card, listing, profile). Verification is a feature, show it.
- **Ratings & reviews** — ⭐ avg + count on cards and listings; real review snippets on the listing page. Social proof beats claims.
- **Platform stats** — "5,000+ orders", "4.9★", response time — as StatPills on the landing.
- **In-order chat** — surfaced as a guarantee ("talk to your seller anytime"), not just a feature.

## Pricing
- **Price is loud.** Big, gold, tabular figures (PriceTag). Never hide or bury it; hidden prices kill trust.
- Show **ETA** next to price (clock) — "what + when + how much" together reduces back-and-forth.
- Use "from €X" only when honest; show per-unit for currency/items.

## CTA discipline
- **One primary CTA per screen**, phrased as the next concrete step ("Browse services", "Order", "Confirm & release"). Secondary actions stay quiet.
- Reduce checkout friction: signed-out → "Sign in to order" (don't dead-end); own listing → "This is your listing".
- Status-aware order CTAs: always emphasize the single action the user is expected to take next.

## Catalog scannability
- Cards are **scannable in 1 second**: title, category icon, league/platform meta, seller+rating, price, ETA, hover-lift, full-card click target.
- Category pills + filters that speak the niche's language (see **poe2-domain-glossary**), sticky so they persist while scrolling.
- Always handle empty/filtered-empty with a helpful EmptyState + CTA, never a blank grid.

## Seller side (supply matters too)
- Make "Become a seller" credible and low-friction; show the payout path (Stripe Connect status) clearly — an unconnected payout state is a clear nudge, not a hidden blocker.
- Sellers need to look credible: profile, rating, verification, clean listing form with a live card preview.

## Anti-patterns (never)
❌ Hidden/ambiguous prices · ❌ fake urgency / countdowns / fake scarcity · ❌ pre-checked upsells or sneaky fees · ❌ dead-end states (no next step) · ❌ burying escrow/guarantee in the footer · ❌ trust badges with no substance behind them.
