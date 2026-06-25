---
name: titanpoe2-page-patterns
description: Per-route page layout recipes for the Titanpoe2 PoE2 marketplace — the goal, section order, key components, primary CTA, and required loading/empty/error/responsive states for each route (/, /catalog, /catalog/[id], /orders, /orders/[id], /sell, /sell/new, /signin, /signup, /account, /moderate). Use when building or restructuring any page under app/[locale]/, laying out a route, or deciding a page's hierarchy and states.
---

# Titanpoe2 Page Patterns

How each route is composed. Full spec: [04-pages.md](../../../docs/design/04-pages.md). Build with **titanpoe2-design-system** tokens and **titanpoe2-components**.

## Global rules for every page
- **Dark, responsive (mobile-first sm/md/lg), bilingual (RU text wraps).**
- **Exactly one primary CTA per page.** Everything else is secondary/quiet.
- **Always design 4 states:** loading (skeletons), empty (EmptyState), error, disabled/submitting.
- **Shell:** sticky translucent Navbar (hairline border) + content (max-w ~1120px, gutters 16/24) + Footer (with TrustStrip). Subtle grain background; optional violet glow behind heroes.
- **Mobile collapse:** nav→sheet · multi-column→single · sticky panels→inline · filter bars→sheet.
- Never break route paths, Prisma data shapes, server actions, or i18n keys to fit a layout.

## Routes (goal → primary CTA → layout)
- **`/` Home** → *Browse services.* Hero (arcane backdrop + violet glow, H1 value prop, escrow/15%/verified subtext, primary CTA + "Become a seller", inline TrustStrip) → Category showcase (8 tiles) → How-it-works escrow 4-steps ("Pay only when you confirm") → Why-us/trust StatPills → Featured ListingCards → Seller CTA band → Footer. Conversion + trust showcase (overgear DNA, PoE2 skin).
- **`/catalog`** → *open a listing (per card).* Header (title + result count + sort) → sticky CategoryFilter pills (+ optional league/platform/mode/price filters; sheet on mobile) → responsive ListingCard grid 1/2/3 col (sm/md/lg), hover-lift. States: skeleton cards, empty ("be the first"), filtered-empty.
- **`/catalog/[id]` Listing detail** → *Order.* Two-column on lg (content + sticky purchase panel), stacked on mobile. Left: breadcrumb, H1, meta chips (category/league/mode/platform), description, fulfillment explainer, SellerBadge + reviews. Right sticky: big gold PriceTag, ETA, TrustStrip, **Order** → escrow checkout. Microcopy: "Funds held in escrow. Pay only when you confirm." States: not-found, owner view ("This is your listing"), signed-out ("Sign in to order").
- **`/orders/[id]` Order** → *status-dependent CTA.* The trust centerpiece. Header (title + PriceTag + OrderStatusBadge) → **EscrowStepper** (current step) → **OrderActions** (role/status-aware; emphasize expected action, destructive quiet) → **ChatThread** (live polling, proof messages). States per status; dispute-open shows reason; empty chat.
- **`/orders` Orders list** → *open an order.* Tabs: My purchases / Sales. Row: title + PriceTag + OrderStatusBadge + date → link. EmptyState when none.
- **`/sell` Seller dashboard** → *New listing.* Header (displayName + type + New listing) → **Payouts card** (Stripe Connect status — "Connect payouts" nudge OR "Payouts connected ✓") → My listings (compact rows + empty). If no SellerProfile → show **BecomeSellerForm** instead.
- **`/sell/new` Create listing** → *Publish listing.* Focused form: category, EN+RU titles, € price, ETA hours, fulfillment, platform, league, league mode. Inline validation; a live ListingCard preview is a plus.
- **`/signin` & `/signup`** → *Sign in / Sign up.* Centered card on dark arcane backdrop, minimal (email + password, +name on signup), error slot, link to the other, brand mark + one-line trust note.
- **`/account`** → quiet settings page: email, roles, sign-out.
- **`/moderate` (MODERATOR/ADMIN)** → *resolve.* List of DISPUTED orders, each: title + PriceTag + buyer + dispute reason + two actions — **Refund buyer** (destructive/outline) and **Release to seller** (primary). EmptyState "No open disputes." Guarded; redirect non-moderators.

## Checklist before "done"
Primary CTA unmistakable? · loading/empty/error/submitting all designed? · longest RU strings wrap without truncating critical labels? · mobile collapse correct? · trust signals (escrow/rating/verified/price) prominent? · contrast AA + visible focus?
