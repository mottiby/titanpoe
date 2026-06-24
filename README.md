# PoE2 Marketplace

A curated services marketplace for **Path of Exile 2** — buyers order boosting, currency, items, crafting and coaching; sellers fulfil them; the platform holds funds in escrow and takes a commission. Modeled on overgear.com, focused on a single game. Bilingual (**EN / RU**).

> **Status: Phase 0 (foundation).** Working: i18n, auth (email + password), Postgres schema, seller onboarding, listings, public catalog. Not yet: payments / escrow / orders (Stripe), real-time chat, external integrations. See [docs/04-roadmap.md](docs/04-roadmap.md).

## Stack
- **Next.js 16** (App Router) · React 19 · TypeScript
- **Tailwind CSS v4** + shadcn/ui
- **Prisma 7** + PostgreSQL (Neon)
- **Auth.js v5** (Credentials / JWT)
- **next-intl** (EN / RU)
- **Vitest** (unit tests)

## Prerequisites
- Node.js **22+** (developed on 24)
- A PostgreSQL database — e.g. a free [Neon](https://neon.tech) project

## Setup
```bash
npm install
cp .env.example .env             # fill DATABASE_URL; generate AUTH_SECRET via `npx auth secret`
npx prisma migrate dev           # create tables
npm run db:seed                  # seed service categories
npm run dev                      # http://localhost:3000
```

> **Windows / PowerShell:** if `npm` is blocked with _"running scripts is disabled on this system"_, run once (no admin needed):
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

## Commands
| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests |
| `npm run db:seed` | Seed categories |
| `npx prisma migrate dev` | Apply migrations |
| `npx prisma studio` | Browse the database |

## Structure
```
app/[locale]/   Localized routes (home, catalog, sell, account, auth)
app/api/        Route handlers (Auth.js)
components/     UI (shadcn-based)
lib/            Business logic (db, auth, sellers, fees)
prisma/         Schema, migrations, seed
messages/       i18n dictionaries (en, ru)
docs/           Specs: teardown, PRD, architecture, roadmap
```

## Environment
All keys are documented in [.env.example](.env.example). Phase 0 needs only `DATABASE_URL` and `AUTH_SECRET`.

## Docs
- [01 — overgear teardown](docs/01-overgear-teardown.md)
- [02 — product spec (PRD)](docs/02-product-spec-prd.md)
- [03 — technical architecture](docs/03-technical-architecture.md)
- [04 — roadmap](docs/04-roadmap.md)

## CI
[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint, typecheck, tests and build on every push to `main` and on pull requests.
