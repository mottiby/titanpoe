# 04 · Pages

Per route: goal, layout (top→bottom), key components, and required states. All pages are dark, responsive
(mobile-first: sm/md/lg), and bilingual (text wraps for RU). Every page has exactly one primary CTA.

## Global shell
**Navbar** (sticky, translucent, hairline border) + page content (max-w ~1120px, gutters 16/24px) +
**Footer** (with TrustStrip). Subtle grain on the background; optional violet glow behind page heroes.

## `/` — Home / Landing  (primary CTA: **Browse services**)
The conversion + trust showcase (overgear DNA, PoE2 skin).
1. **Hero:** dark arcane backdrop + violet glow. H1 value prop ("Path of Exile 2 services — bought safely"),
   subtext (escrow, 15%, verified sellers), primary CTA **Browse services** + secondary "Become a seller".
   Inline **TrustStrip**.
2. **Category showcase:** tiles for the 8 categories (icon + name + short blurb) → link to filtered catalog.
3. **How it works (escrow):** 4 steps with the **EscrowStepper** language — Browse → Pay into escrow →
   Seller delivers → Confirm & release. Reassure: "Pay only when you confirm."
4. **Why us / trust:** ratings/Trustpilot, money-back guarantee, verified sellers, in-order chat (StatPills).
5. **Featured listings:** a strip of **ListingCard**s.
6. **Seller CTA band** + **Footer**.
States: all static; ensure hero text legible over any glow/texture.

## `/catalog` — Catalog  (primary CTA per card: open listing)
1. **Header:** "Catalog" title + result count + sort control.
2. **CategoryFilter** pills (sticky); optional secondary filters (league, platform, mode, price) as a
   filter bar / sheet on mobile.
3. **Grid of ListingCards** — responsive: 1 col (sm) · 2 (md) · 3 (lg). Hover-lift.
States: **loading** (skeleton cards), **empty** (EmptyState: "No listings yet — be the first"), filtered-empty.

## `/catalog/[id]` — Listing detail  (primary CTA: **Order**)
Two-column on lg (content + sticky purchase panel), stacked on mobile.
- **Left:** breadcrumb/back, H1 title, category + league + mode + platform meta chips, description,
  fulfillment explainer (party-play/trade/coaching), seller block (**SellerBadge** + rating/reviews).
- **Right (sticky panel):** big **PriceTag** (€, gold), ETA, **TrustStrip** (escrow/guarantee),
  primary **Order** button → escrow checkout. If not signed in → "Sign in to order"; if own listing →
  "This is your listing". Microcopy: "Funds held in escrow. Pay only when you confirm."
States: not-found, owner view, signed-out view.

## `/orders/[id]` — Order  (primary CTA: status-dependent)
The trust centerpiece.
1. **Header:** title + **PriceTag** + **OrderStatusBadge**.
2. **EscrowStepper** — current lifecycle step highlighted.
3. **OrderActions** — role/status-aware (seller: Start work → Mark delivered; buyer: Confirm & release /
   Cancel / Open dispute). Emphasize the one expected action; keep destructive ones quiet (outline).
4. **ChatThread** — live (polling) buyer↔seller chat with proof messages.
States per status (CREATED…CANCELLED); dispute open (reason shown); empty chat.

## `/orders` — Orders list  (primary CTA: open an order)
Tabs/sections: **My purchases** and **Sales** (sellers). Each row: title, **PriceTag**, **OrderStatusBadge**,
date → link to order. **EmptyState** when none.

## `/sell` — Seller dashboard  (primary CTA: **New listing**)
- Header: seller displayName + type + **New listing** button.
- **Payouts card:** Stripe Connect status — "Connect Stripe payouts" button OR "Payouts connected ✓"
  (this gates real payouts; make the unconnected state a clear nudge).
- **My listings** list (compact ListingCard rows) with empty state.
- If the user has no SellerProfile → **BecomeSellerForm** (display name + seller type) instead.

## `/sell/new` — Create listing  (primary CTA: **Publish listing**)
A focused form: category select, EN + RU titles, **price (€)**, ETA (hours), fulfillment, platform,
league, league mode. Inline validation; preview of the resulting ListingCard would be a plus.

## `/signin` & `/signup` — Auth  (primary CTA: Sign in / Sign up)
Centered card on the dark arcane backdrop. Minimal: email + password (+ name on signup), error message
slot, link to the other page. Brand mark + a one-line trust note.

## `/account` — Account
Email, roles, sign-out. Simple settings-style page; quiet.

## `/moderate` — Dispute resolution (MODERATOR/ADMIN)  (primary CTA: resolve)
List of DISPUTED orders: each shows title, **PriceTag**, buyer, dispute reason, and two clear actions —
**Refund buyer** (destructive/outline) and **Release to seller** (primary). EmptyState: "No open disputes."
Guarded; non-moderators are redirected.

## Responsive & states checklist (apply to all)
- Mobile: nav → sheet; multi-column → single; sticky panels → inline; filter bars → sheet.
- Always design: **loading** (skeletons), **empty** (EmptyState), **error**, **disabled/submitting**.
- Long-text/RU: never truncate critical labels; allow wrapping; test the longest RU strings.
