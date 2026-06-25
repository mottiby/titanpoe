# Titanpoe2 — PoE2 Services Marketplace

A curated, escrow-protected services marketplace for **Path of Exile 2** — buyers order boosting,
currency, items, crafting and coaching; sellers fulfil them; the platform holds funds in escrow and takes
a 15% commission. Modeled on overgear.com, focused on a single game. Bilingual (**EN / RU**).

> **Status: feature-complete MVP, productionizing.** Working end-to-end: auth & roles, seller onboarding
> (Stripe Connect), listings with a tier/add-on **configurator**, cart, catalog with filters/sort/search,
> order lifecycle with **real Stripe escrow** (hold → release → refund, verified on the test API), 72h
> auto-release, live order chat, reviews, disputes & moderation, email notifications — all under a full
> dark "arcane" design system. **See [docs/05-audit.md](docs/05-audit.md) for the exhaustive current-state
> audit and the remaining work.**

## Stack
- **Next.js 16** (App Router, RSC + server actions) · React 19 · TypeScript
- **Tailwind v4** + **shadcn/ui** + **framer-motion** + lucide
- **Prisma 7** + PostgreSQL (Neon)
- **Auth.js v5** (Credentials / JWT, roles)
- **Stripe Connect** (escrow: separate charges & transfers) · **Resend** (email)
- **next-intl** (EN / RU) · **Vitest** (unit + DB-integration tests)

## Setup
```bash
npm install
cp .env.example .env             # fill DATABASE_URL; generate AUTH_SECRET via `npx auth secret`
npx prisma migrate dev           # apply the 5 migrations
npm run db:seed                  # seed service categories
npm run db:seed-demo             # (optional) seed demo sellers + listings for a populated catalog
npm run dev                      # http://localhost:3000
```
Optional keys (the app degrades gracefully without them): `STRIPE_SECRET_KEY` (real payments),
`RESEND_API_KEY` (emails). All keys are documented in [.env.example](.env.example).

> **Windows / PowerShell:** if `npm` is blocked ("running scripts is disabled"), run once (no admin):
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

## Commands
| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate && next build` (Vercel-ready) |
| `npm run lint` / `npm run typecheck` | ESLint / `tsc --noEmit` |
| `npm test` | Vitest (DB/Stripe integration suites auto-skip without env) |
| `npm run db:seed` / `db:seed-demo` | Seed categories / demo listings |
| `npm run db:grant-admin -- <email>` | Grant MODERATOR+ADMIN (re-login to refresh session) |
| `npx prisma migrate dev` / `prisma studio` | Migrate / browse DB |

## Structure
```
app/[locale]/        Localized routes (home, catalog, listing, cart, orders, sell, auth, account, moderate)
app/api/             Route handlers (auth, order chat, cron/auto-release)
components/marketplace/  Domain UI (ListingCard, PriceTag, EscrowStepper, configurator, reviews, …)
components/ui/        shadcn primitives (restyled)
lib/orders/          Order service, state machine, pricing, auto-release, actions, notify
lib/payments/        Provider abstraction + Stripe Connect (provider, stripe-provider, connect, select)
lib/cart, lib/sellers, lib/moderation, lib/email, lib/items, lib/format
prisma/              schema, 5 migrations, seed + seed-demo
messages/            i18n dictionaries (en, ru)
docs/                01–04 specs · 05-audit (current state) · deploy-vercel · design/ (brief)
```

## Payments (test mode)
`StripePaymentProvider` implements hold/release/refund via Stripe Connect; per-seller selection falls back
to a manual no-op provider when a seller hasn't onboarded. **Note:** buyer checkout currently uses a Stripe
test card server-side — a real card-entry (Checkout/Elements) flow + webhooks are the top productionization
item (see [docs/05-audit.md](docs/05-audit.md) §P1).

## Docs
- [01 — overgear teardown](docs/01-overgear-teardown.md) · [02 — PRD](docs/02-product-spec-prd.md) ·
  [03 — architecture](docs/03-technical-architecture.md) · [04 — roadmap](docs/04-roadmap.md)
- **[05 — status audit (current state + what's left)](docs/05-audit.md)** ← start here
- [Deploy to Vercel](docs/deploy-vercel.md) · [Design brief](docs/design/PROMPT.md)

## CI
[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint, typecheck, tests and build on push/PR.
