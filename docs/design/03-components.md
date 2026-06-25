# 03 · Component Inventory

Restyle shadcn primitives to the tokens, then build the domain components. All accept the project's data
shapes and i18n strings (no hardcoded copy). States listed must all be designed.

## Primitives (restyle shadcn)
| Component | Variants | States |
|---|---|---|
| **Button** | `primary` (violet, glow), `secondary` (surface), `outline`, `ghost`, `destructive`, `gold` (value CTA) | default, hover, active, focus-ring, disabled, loading (spinner) |
| **Input / Textarea** | default | rest, focus (violet ring), error (destructive border + message), disabled |
| **Select / Combobox** | default | open, selected, keyboard nav |
| **Badge / Chip** | `neutral`, `primary`, `success`, `warning`, `destructive`, `outline` | static; `pill` radius |
| **Card** | `flat`, `interactive` (hover lift) | rest, hover, focus-within |
| **Tabs / Segmented** | underline / pill | active, hover |
| **Avatar** | seller/user | image, initials fallback |
| **Dialog / Sheet** | center / side | open/close, backdrop |
| **Tooltip / Popover** | — | hover/focus |
| **Skeleton** | line, card | shimmer (reduced-motion: static) |
| **Toast** | success/error/info | enter/exit |

## Domain components
- **Navbar** — logo (arcane wordmark), links (Catalog, Sell, Orders, Moderate*), locale switcher EN/RU,
  auth state (Sign in ▸ or user email + avatar). Sticky, translucent dark, hairline bottom border;
  collapses to a sheet menu on mobile. *Moderate visible only for MODERATOR/ADMIN.
- **Footer** — brand line, trust strip (escrow / money-back / verified sellers), legal links, language.
- **PriceTag** — the € amount in `accent` (gold), tabular figures, optional "from"/per-unit; sizes sm/md/lg.
- **CategoryFilter** — horizontal scrollable pills (All, Currency, Items, Leveling, Carries, Atlas,
  Challenges, Crafting, Coaching); active pill = primary tint; sticky under catalog header.
- **ListingCard** — the catalog workhorse: category icon + name, EN/RU title, league + mode + platform meta,
  seller (name · ⭐ rating · count · verified badge), **PriceTag**, ETA (clock), hover-lift, full-card link.
  Variants: grid (default), compact (dashboard list row).
- **SellerBadge** — avatar + displayName + ⭐ ratingAvg (ratingCount) + optional "Verified" (badge-check).
- **RatingStars** — 0–5, half-step, with count; tiny + standard sizes.
- **TrustStrip** — row of reassurance items with icons: 🛡 Escrow-protected · ↩ 100% money-back ·
  ✓ Verified sellers · 💬 In-order chat. Used on home, listing, checkout.
- **OrderStatusBadge** — maps OrderStatus → label + hue (see tokens): CREATED/PAID/IN_PROGRESS/DELIVERED/
  COMPLETED/DISPUTED/REFUNDED/CANCELLED. Pill, with a small dot.
- **EscrowStepper** — horizontal/vertical stepper visualizing the escrow lifecycle:
  Paid (in escrow) → In progress → Delivered → Completed, with the current step highlighted and a
  branch chip for Disputed/Refunded/Cancelled. The product's signature trust element.
- **OrderActions** — the role/status-aware action buttons (seller: Start work, Mark delivered;
  buyer: Confirm & release, Cancel, Open dispute). Primary action emphasized; destructive ones outline.
- **ChatThread** — order chat: message bubbles (mine = right, aligned, primary-tinted; other = left,
  surface), sender role label ("Seller (you)"), input + send; auto-scrolls; near-real-time (polling).
  Empty state ("No messages yet"). System messages (proof uploaded) styled distinctly.
- **ListingForm / BecomeSellerForm** — the create-listing & onboarding forms: grouped fields, selects for
  category/fulfillment/platform/leagueMode, price field with € prefix, inline validation.
- **StatPill / Marketing** — landing stats (e.g., "5,000+ orders", "4.9★ Trustpilot"), feature cards,
  category showcase tiles.
- **EmptyState** — icon + headline + subtext + CTA (used for empty catalog/orders/disputes).

## Accessibility for every component
- Visible focus ring (`ring` token), not just color to convey state.
- Hit targets ≥ 40px; labels associated with inputs; `aria-live` for async (chat, toasts).
- Color is never the only signal (status badges pair hue with a label + dot/icon).
