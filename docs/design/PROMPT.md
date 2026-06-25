# Master Prompt — PoE2 Marketplace Visual Design

> Paste this into Claude (a fresh session) together with the four brief files in this folder
> (`01-brand-mood.md`, `02-tokens.md`, `03-components.md`, `04-pages.md`). It produces a complete,
> production-ready visual design for the existing codebase.

---

You are a **senior product designer and front-end engineer**. Design and implement the complete
visual layer for **PoE2 Marketplace** — a curated, escrow-protected services marketplace for
**Path of Exile 2**, modeled on **overgear.com** but focused on a single game. Buyers order boosting,
currency, items, crafting and coaching; sellers fulfil them; the platform holds funds in escrow,
takes a 15% commission, and resolves disputes.

## The codebase you are designing for (do not break these contracts)
- **Stack:** Next.js 16 (App Router, server components + server actions), **TypeScript**, **Tailwind CSS v4**,
  **shadcn/ui** (already initialized, preset base-nova), **next-intl** (bilingual **EN/RU**, every string
  comes from `messages/en.json` & `messages/ru.json`).
- **Theme system:** colors live as CSS variables in `app/globals.css` (shadcn convention:
  `--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--border`, `--ring`,
  `--destructive`, …). Tailwind utilities reference them (`bg-background`, `text-muted-foreground`, …).
- **Existing routes (all under `app/[locale]/`):** `/` (home), `/catalog`, `/catalog/[id]` (listing),
  `/orders`, `/orders/[id]` (order + live chat), `/sell`, `/sell/new`, `/signin`, `/signup`, `/account`,
  `/moderate` (dispute resolution, MODERATOR/ADMIN only).
- **Data shapes (Prisma):** Listing { titleEn/Ru, priceCents, currency 'eur', etaHours, fulfillment,
  platform (PC/PS5/XBOX), league, leagueMode (SOFTCORE/HARDCORE/SSF_*), category, seller { displayName,
  ratingAvg, ratingCount } }. Order { status: CREATED→PAID→IN_PROGRESS→DELIVERED→COMPLETED |
  DISPUTED→REFUNDED, amountCents, feeCents }. Prices display in **EUR (€)**.
- The current UI is functional but plain (default neutral shadcn). Your job is to elevate it to a
  premium, trustworthy, conversion-focused gaming marketplace **without** changing routes, data shapes,
  server actions, or i18n keys.

## Design direction (full detail in the brief files)
- **Mood:** dark, premium, "arcane gaming" — the world of Path of Exile 2 (gritty dark fantasy) meets a
  modern, high-trust marketplace (overgear's clarity & conversion). See `01-brand-mood.md`.
- **Tokens:** dark-first palette, violet primary + amber/gold "value" accent, semantic colors, type scale,
  spacing, radii, elevation, motion. Ready-to-paste `globals.css` variables in `02-tokens.md`.
- **Components:** restyle shadcn primitives + build domain components (ListingCard, PriceTag,
  OrderStatusBadge, EscrowStepper, SellerBadge, RatingStars, CategoryFilter, ChatThread, Navbar, Footer).
  Full inventory + states in `03-components.md`.
- **Pages:** section-by-section layout, hierarchy, responsive and empty/loading/error states for every
  route in `04-pages.md`.

## Deliverables (produce all, in this order)
1. **Design system** — the complete `app/globals.css` token block (`:root` + dark) implementing
   `02-tokens.md`, plus a short "how to use" note (which Tailwind utility maps to which token).
2. **Restyled shadcn components** — updated `components/ui/*` (Button variants, Card, Badge, Input, Select,
   Tabs, etc.) matching the system.
3. **Domain components** — the components in `03-components.md` as typed React + Tailwind, accepting the
   data shapes above (use realistic PoE2 sample data in previews: Divine Orbs, boss carries, leagues).
4. **Pages** — each route from `04-pages.md` as a polished, responsive React/Tailwind composition.
   Keep server/client boundaries sane (forms/interactivity as client components).
5. **One landing hero** rendered as a standalone artifact/preview so the direction can be judged at a glance.

## Hard constraints
- **Dark-first**, accessible: text contrast ≥ WCAG AA, visible focus rings, keyboard-navigable,
  respects `prefers-reduced-motion`.
- **Bilingual-ready:** never hardcode user-facing copy — assume strings come from i18n; design must not
  break with longer Russian strings (allow text to wrap; avoid fixed-width labels).
- **Responsive:** mobile-first; define behavior at sm / md / lg. Catalog is a responsive grid; nav collapses.
- **Trust & conversion (overgear DNA):** make escrow/guarantee, ratings, verified-seller and the price
  prominent; clear primary CTA per page; reduce friction in the order flow.
- **On-brand, not generic:** avoid the "default AI dashboard" look. Use the arcane/dark identity,
  subtle texture/gradients, tasteful motion — but keep it fast and legible.
- **Implementable in our stack** — Tailwind v4 + shadcn only; no new heavy UI libraries.

## Working method
Work iteratively: first lock the **tokens + 3 core components** (Button, ListingCard, OrderStatusBadge)
and show them; then the **catalog** and **listing** pages; then the **order** flow; then the rest.
After each step, briefly note the key decisions and any trade-offs. Ask before introducing anything that
would change a route, data shape, or i18n contract.
