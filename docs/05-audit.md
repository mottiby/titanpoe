# 05 · Status Audit — current state of the build

> Snapshot of **what actually exists in the repo today** (branch `feat/design-overhaul`), how it looks,
> what is verified, and what remains. Supersedes the "Phase 0" framing in the older docs/README.
> Audited against the real source tree; file paths are clickable references.

## TL;DR
A **near-complete, polished, bilingual (EN/RU) services marketplace for Path of Exile 2**, modeled on
overgear. It builds clean, has **36 passing tests**, real **Stripe** escrow verified on the test API, a
full **dark "arcane" design system** applied across every page, and an **overgear-grade catalog/listing
UX** (configurator, tiers/add-ons, cart, reviews, item art). The real Stripe **buyer checkout + webhooks
are now coded** (hosted Checkout → PAID via signed webhook); what's left is mostly **live-verifying them
(needs the webhook secret + an onboarded seller), wiring schedulers/integrations that need accounts, and polish.**

Verification at audit time: `npm run build` → **0** (24 routes) · `npm test` → **33 passed / 3 skipped**
(Stripe suite skips without a key) · live dev server renders home + catalog correctly.

## Stack & infrastructure
| Area | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router, RSC + server actions) | TypeScript, `app/[locale]/…` |
| UI | **Tailwind v4 + shadcn/ui**, **framer-motion**, lucide, @base-ui/react | dark-first design system |
| DB | **PostgreSQL (Neon)** + **Prisma 7** (driver adapter `@prisma/adapter-pg`) | client in `lib/generated/prisma` |
| Auth | **Auth.js v5** (Credentials, JWT) + roles | `auth.ts`, `lib/auth/actions.ts` |
| Payments | **Stripe Connect** (separate charges & transfers) | `lib/payments/*`, verified on test API |
| Email | **Resend** (env-gated) | `lib/email.ts`, `lib/orders/notify.ts` |
| i18n | **next-intl** EN/RU | `messages/en.json`, `messages/ru.json` |
| Tests | **Vitest** (unit + DB-integration, gated) | 36 tests |
| Build/CI | `npm run build` = `prisma generate && next build`; GitHub Actions; **Vercel-ready** | [docs/deploy-vercel.md](deploy-vercel.md) |

## Data model ([prisma/schema.prisma](../prisma/schema.prisma))
`User` (+ wallet `balanceCents`, `cartItems`) · `SellerProfile` (`stripeAcctId`, `ratingAvg/Count`,
`kycStatus`) · `Category` · `Listing` (`tiers`, `addons`, `badge`, `highlightsEn/Ru`, `compareAtCents`,
`heroImageUrl`) · `CartItem` · `ListingTier` · `ListingAddon` · `Order` · `EscrowTxn` · `Conversation` ·
`Message` (`attachmentUrl`, `system`) · `Review` · `Dispute` · `AdminAction`.
**5 migrations applied:** `init` → `add_user_auth` → `currency_eur` → `listing_configurator_and_promo` →
`cart_and_wallet`.

## Routes (all under `app/[locale]/`)
| Route | What it is | Status |
|---|---|---|
| `/` | Landing: hero, trust strip, activity ticker, category cards (item art), featured, FAQ | ✅ |
| `/catalog` | Sidebar + filter pills, platform/mode/sort, search, feature banners, card grid | ✅ |
| `/catalog/[id]` | Listing: art, highlights, meta, seller + reviews, **configurator**, sticky buy bar, related | ✅ |
| `/cart` | Cart of configured selections | ✅ (checkout path: see gaps) |
| `/orders`, `/orders/[id]` | Order list; order detail = **EscrowStepper** + role actions + **live chat** + review | ✅ |
| `/sell`, `/sell/new` | Seller dashboard (+ Stripe Connect onboarding) and create-listing | ✅ |
| `/signin`, `/signup`, `/account` | Auth + account | ✅ |
| `/moderate` | Dispute resolution (MODERATOR/ADMIN) | ✅ |
| `/api/auth/[...nextauth]`, `/api/orders/[id]/messages`, `/api/cron/auto-release` | Auth, chat, cron | ✅ |
Plus `loading.tsx` skeletons, `error.tsx`, `not-found.tsx`.

## Features — what works (verified by build + tests + live render)
- **Auth & roles** — email/password, JWT, roles BUYER/SELLER/MODERATOR/ADMIN; `db:grant-admin` script.
- **Seller flow** — become-seller, create listing (category, tiers, add-ons, league/mode/platform,
  highlights, badge), **Stripe Connect onboarding** (`lib/sellers/actions.ts → startStripeOnboarding`).
- **Catalog** — `lib/sellers/queries.ts → getCatalog` with category/platform/leagueMode/sort/**search**;
  category sidebar + counts, feature banners, item art.
- **Listing + configurator** — tiers × quantity + add-ons; **server recomputes price** authoritatively
  in [lib/orders/pricing.ts](../lib/orders/pricing.ts) (client total is display only).
- **Cart + wallet (display)** — `lib/cart/*`; `User.balanceCents` shown in nav (not yet a payment method).
- **Orders & escrow** — provider-agnostic state machine ([lib/orders/state-machine.ts](../lib/orders/state-machine.ts))
  + service ([lib/orders/service.ts](../lib/orders/service.ts)); **real Stripe** hold→release→refund
  ([lib/payments/stripe-provider.ts](../lib/payments/stripe-provider.ts), verified on test API); provider
  chosen per-seller ([lib/payments/select.ts](../lib/payments/select.ts)).
- **72h auto-release** — `lib/orders/auto-release.ts` + `/api/cron/auto-release` (scheduler not yet wired).
- **Live chat** — polling-based (`/api/orders/[id]/messages` + `components/orders/order-chat.tsx`),
  supports system messages + `attachmentUrl` rendering.
- **Reviews** — `leaveReview` recomputes seller `ratingAvg/Count`; shown on listing + order.
- **Disputes & moderation** — open dispute; `/moderate` refund/release.
- **Email notifications** — Resend, env-gated (new order / delivered / completed).
- **Design system** — full arcane dark theme in [app/globals.css](../app/globals.css) (violet primary,
  gold price accent, glass, glow, grain, reduced-motion); ~30 components in `components/marketplace/*`
  + `components/ui/*`; generated **item art**.

## Design — how it looks now
Premium dark "arcane gaming" marketplace, on-brand with the design brief and beyond it:
- **Home:** gradient `Titanpoe2` wordmark; wallet/cart in nav; Unbounded display hero ("Услуги по Path of
  Exile 2 — покупайте безопасно"); violet CTA; trust strip; live "just ordered" ticker; category cards
  with **item art on gold glow**.
- **Catalog:** "9 services"; feature banners; icon filter pills; platform/mode/sort; rich **ListingCards**
  (item art, category chip, green-check highlights, league/mode/platform chips, verified **SellerBadge** +
  ⭐ rating, **gold PriceTag**, ETA).
Matches docs/design + `.claude/skills/titanpoe2-design-system`.

## Known issues / tech debt
1. **README is stale** — still says "Phase 0… payments not yet." Reality is far ahead (updated alongside this audit).
2. **Local `npm run lint` is broken** — ESLint scans local Python venvs (`.venv`, `img/.venv`, `img2/.venv`
   for the Playwright art pipeline), producing ~300 MB of output. CI is fine (those are git-ignored).
   **Fix:** add `.venv/**`, `img/**`, `img2/**` to `ignores` in `eslint.config.mjs`.
3. **pg `sslmode=require` deprecation warning** — printed on every server render (the dev overlay "1 Issue").
   Harmless; silence by switching the connection string to `uselibpqcompat=true&sslmode=require`.
4. **`vite-tsconfig-paths` advisory** — Vitest now supports `resolve.tsconfigPaths` natively (minor cleanup).
5. **LF→CRLF** git warnings on Windows — add a `.gitattributes` (`* text=auto eol=lf`).

## What's left to do (prioritized, referencing current code)
### P1 — productionize payments
- **Real buyer checkout — DONE (code).** `PaymentProvider.createCheckout()` added; `StripePaymentProvider`
  opens a hosted **Stripe Checkout Session** (EUR, `transfer_group`/metadata = order id) and the buyer
  enters their own card. `placeOrder`/`placeConfiguredOrder`/`checkoutCart` create a CREATED order and
  **redirect to Checkout**; `ManualPaymentProvider` keeps the instant-hold fallback. The old server-side
  `pm_card_visa` `hold()` remains only as the manual/dev rail.
- **Stripe webhooks — DONE (code).** New route `app/api/webhooks/stripe/route.ts` (Node runtime, raw-body
  signature check via `STRIPE_WEBHOOK_SECRET`): `checkout.session.completed`/`payment_intent.succeeded`
  → Order **PAID** + `EscrowTxn` (idempotent via a status-guarded `CREATED→PAID` `updateMany`),
  `account.updated` → seller `kycStatus`, `charge.refunded` → escrow `refundedAt`.
- **RMT rail for currency/items — DONE (code).** `isStripeRail()` keeps `currency`/`items` on the manual
  rail (`lib/payments/select.ts`); release/refund pick the rail from the recorded hold ref
  (`pi_…` = Stripe). A gaming-friendly PSP can still slot in beside Stripe.
- **Payout readiness guard — DONE (code).** `confirmCompletion` blocks a Stripe-rail release until the
  seller's connected account has `transfers` active (`lib/payments/connect.ts → isPayoutReady`).
- **Pending live verification (needs accounts/secret):** set `STRIPE_WEBHOOK_SECRET` (local:
  `stripe listen --forward-to localhost:3000/api/webhooks/stripe`), then run a `4242…` checkout end-to-end
  (Order→PAID via webhook) with an onboarded seller, through deliver → confirm → transfer.

### P2 — wire the deferred services (need accounts)
- **Scheduler → `/api/cron/auto-release`** (Vercel Cron or Inngest) so 72h release actually fires.
- **Resend key** in `.env` to send real emails (verify a domain for non-owner recipients).
- **File uploads for proofs** — `Message.attachmentUrl` is rendered but there's **no upload** path yet
  (Cloudflare R2 / UploadThing). Lets sellers attach delivery screenshots; strengthens disputes.
- **Sentry** (errors) / observability; **Pusher** to replace chat polling with true real-time.
- **KYC** — `SellerProfile.kycStatus` exists but no flow (Stripe Identity / Sumsub).

### P3 — finish in-app flows
- **Cart checkout** — confirm `/cart` creates orders for each configured item (and clears the cart).
- **Wallet** — `balanceCents` is display-only; decide top-up/credit semantics or remove.
- **Dispute UX** — moderator notes, partial refunds (`DisputeState.RESOLVED_PARTIAL` exists, no UI).
- **Seller listing management** — edit/deactivate listings; manage tiers/add-ons after creation.
- **Notifications** — in-app notifications + more email events (dispute opened/resolved, new message).

### P4 — quality & launch
- Fix the lint/`.gitattributes`/sslmode items above; add **integration tests** for the order actions
  and a small **E2E** (Playwright) for the buy flow; accessibility pass; legal pages (ToS/refund/privacy);
  analytics; production env + domain on Vercel.
