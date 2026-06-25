---
name: titanpoe2-components
description: Component library spec for the Titanpoe2 PoE2 marketplace — how to restyle shadcn primitives and build the domain components (ListingCard, PriceTag, OrderStatusBadge, EscrowStepper, SellerBadge, RatingStars, CategoryFilter, TrustStrip, ChatThread, Navbar, Footer). Use when creating or editing any React component under components/ or app/, when a screen needs one of these building blocks, or when deciding props, variants, and required states.
---

# Titanpoe2 Components

How to build the UI building blocks. Full inventory + states: [03-components.md](../../../docs/design/03-components.md). Always apply **titanpoe2-design-system** tokens.

## Rules for every component
- **shadcn/ui + Tailwind v4 only** — no new heavy UI libs. Restyle existing `components/ui/*` to tokens; don't fork.
- **Thin components, logic in `lib/`.** Components accept the project's Prisma data shapes + i18n strings — **never hardcode user-facing copy** (it comes from `next-intl`).
- **Design every state.** A component isn't done until rest/hover/active/focus/disabled/loading/empty/error that apply to it are handled.
- **Server vs client:** keep interactivity (forms, chat, filters, anything with state/handlers) in client components (`"use client"`); keep display components as server components where possible.
- **A11y:** visible focus ring, hit target ≥ 40px, label associated with input, `aria-live` for async (chat, toasts), color paired with text/icon.
- Icons: **lucide** (ships with shadcn), 1.5px stroke, 16–20px inline — shield/lock (escrow), badge-check (verified), star (rating), clock (ETA), gamepad/monitor (platform), coins (currency), message (chat), swords (carries).

## Primitives to restyle (variants → states)
- **Button** — `primary` (violet+glow), `secondary` (surface), `outline`, `ghost`, `destructive`, `gold` (value CTA) · default/hover/active/focus-ring/disabled/loading(spinner).
- **Input/Textarea** — rest/focus(violet ring)/error(destructive border+message)/disabled.
- **Select/Combobox** — open/selected/keyboard-nav. **Badge/Chip** — neutral/primary/success/warning/destructive/outline, pill radius.
- **Card** — flat / interactive(hover-lift) · rest/hover/focus-within. **Tabs/Segmented**, **Avatar** (image+initials fallback), **Dialog/Sheet**, **Tooltip/Popover**, **Skeleton** (static under reduced-motion), **Toast**.

## Domain components (the product)
- **PriceTag** — € amount in `accent` gold, tabular figures, optional "from"/per-unit; sizes sm/md/lg. The most-reused trust/value element.
- **ListingCard** — catalog workhorse: category icon + name, EN/RU title, league+mode+platform meta, seller (name · ⭐rating · count · verified), **PriceTag**, ETA (clock), hover-lift, full-card link. Variants: grid (default), compact (dashboard row).
- **OrderStatusBadge** — maps `OrderStatus` → label + hue (CREATED→muted, PAID→primary, IN_PROGRESS→warning, DELIVERED→info, COMPLETED→success, DISPUTED→destructive, REFUNDED/CANCELLED→muted). Pill + small dot; never hue alone.
- **EscrowStepper** — *the signature trust element.* Horizontal/vertical stepper: Paid (in escrow) → In progress → Delivered → Completed, current step highlighted, branch chip for Disputed/Refunded/Cancelled.
- **SellerBadge** — avatar + displayName + ⭐ratingAvg (ratingCount) + optional Verified (badge-check). **RatingStars** — 0–5 half-step + count, tiny + standard.
- **CategoryFilter** — horizontal scrollable pills (All, Currency, Items, Leveling, Carries, Atlas, Challenges, Crafting, Coaching); active = primary tint; sticky under catalog header.
- **TrustStrip** — icon row: 🛡 Escrow-protected · ↩ 100% money-back · ✓ Verified sellers · 💬 In-order chat. Used on home, listing, checkout.
- **OrderActions** — role/status-aware buttons (seller: Start work, Mark delivered; buyer: Confirm & release, Cancel, Open dispute). Emphasize the one expected action; keep destructive ones quiet (outline).
- **ChatThread** — order chat: mine=right primary-tinted, other=left surface, role label ("Seller (you)"), input+send, auto-scroll, near-real-time (polling), distinct system messages (proof uploaded), empty state.
- **Navbar** — arcane wordmark, links (Catalog/Sell/Orders/Moderate*), EN/RU switcher, auth state; sticky, translucent dark, hairline border; collapses to sheet on mobile. *Moderate only for MODERATOR/ADMIN.
- **Footer** — brand line + trust strip + legal + language. **ListingForm/BecomeSellerForm** — grouped fields, selects, € prefix price, inline validation. **StatPill**, **EmptyState** (icon+headline+subtext+CTA).

## Workflow
Lock **tokens + Button + ListingCard + OrderStatusBadge** first and show them; then build outward. Use realistic PoE2 sample data in previews (Divine Orbs, boss carries, league names) — see **poe2-domain-glossary**. Never change routes, Prisma data shapes, server actions, or i18n keys to fit a component.
