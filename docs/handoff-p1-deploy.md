# Хэндофф-промт для нового чата Claude Code — Titanpoe2: фиксы → коммит доков → P1 (реальный checkout) → деплой в main

> Вставь всё, что ниже (от «Ты — Claude Code…»), в новую сессию Claude Code, открытую в `D:\POE2`.

---

Ты — Claude Code в проекте **Titanpoe2** (`D:\POE2`): курируемый эскроу-маркетплейс услуг по **Path of Exile 2** (аналог overgear). Стек: **Next.js 16** (App Router, RSC + server actions) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · framer-motion · **Prisma 7** (PostgreSQL/Neon) · **Auth.js v5** (Credentials/JWT) · **Stripe Connect** · Resend · next-intl (**EN/RU**) · Vitest. Ветка `feat/design-overhaul`, GitHub `mottiby/titanpoe` (origin), задеплоен на Vercel.

## 0. Окружение (критично — иначе споткнёшься)
- Windows. Терминалы: PowerShell (основной) + Git Bash.
- **Node v24 в `C:\Program Files\nodejs`, НЕ на PATH у Git Bash.** В каждой PowerShell-команде с node/npm/npx препендить: `$env:Path = 'C:\Program Files\nodejs;' + $env:Path`.
- База-проверка: `$env:Path='C:\Program Files\nodejs;'+$env:Path; $env:DATABASE_URL='<строка из .env>'; npm run build; npm test`. Stripe-интеграционный тест идёт только при заданном `$env:STRIPE_SECRET_KEY`, иначе корректно скипается.
- Prisma 7: клиент в `lib/generated/prisma` (gitignore); **`prisma migrate dev` НЕ вызывает generate** — после правок схемы звать `npx prisma generate`. `npm run build` = `prisma generate && next build`.
- `.env` уже содержит `DATABASE_URL` (Neon), `AUTH_SECRET`, `STRIPE_SECRET_KEY` (sk_test), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test). **Валюта = EUR** (Stripe-сэндбокс евровый, страна LT). **RMT-гейт:** Stripe НЕ обрабатывает продажу игровой валюты/предметов → для currency/items нужен gaming-PSP; Stripe = только услуги (бусты/коучинг).
- ⚠️ Гоча base-ui: `<Button>` по умолчанию `type="button"` — в формах ВСЕГДА ставь `type="submit"`.
- ⚠️ Если dev отдаёт stale CSS после build — `rm -rf .next` перед `npm run dev`.
- Секреты только в `.env`/Vercel — НЕ в чат и НЕ в git. Перед коммитом всегда `git -C "D:/POE2" check-ignore .env`.

## 1. Онбординг (ОБЯЗАТЕЛЬНО до кода)
- **Скиллы проекта** (авто-активируются; знай и применяй для UI, бренд-токены не подменяй): `titanpoe2-design-system`, `titanpoe2-components`, `titanpoe2-page-patterns`, `marketplace-conversion-ux`, `poe2-domain-glossary`, `ui-ux-pro-max` (советник).
- **Доки по порядку:** `docs/05-audit.md` (АВТОРИТЕТНЫЙ снимок состояния + что осталось P1–P4) → `README.md` → `docs/03-technical-architecture.md` → `docs/design/PROMPT.md` (+ `02-tokens`, `03-components`, `04-pages`).
- **Код, который тронешь:** `prisma/schema.prisma`; платежи `lib/payments/*` (`provider.ts` интерфейс, `stripe-provider.ts`, `connect.ts`, `select.ts`, `manual-provider.ts`); заказы `lib/orders/*` (`service.ts`, `actions.ts`, `state-machine.ts`, `pricing.ts`); `lib/cart/*`; `components/marketplace/product-configurator.tsx`.
- Для Stripe применяй **source-driven-development**: тяни актуальную доку Stripe (Checkout, Connect, webhooks) — не пиши API по памяти.
- Прогони базовый `build`+`test` — убедись, что зелёно (24 роута; 33 passed/3 skipped) ДО изменений.

## 2. Задачи — строго по порядку, верификация после каждой

### A. Фиксы
1. `eslint.config.mjs` → в `ignores` добавь `.venv/**`, `img/**`, `img2/**`, `**/.venv/**`, `lib/generated/**`. Цель: `npm run lint` проходит локально (сейчас сканит Playwright в `.venv` → падает).
2. `.gitattributes` в корень: `* text=auto eol=lf` (+ `*.png binary` и пр.) — убрать CRLF-варнинги.
3. В `.env`: к `DATABASE_URL` добавь `&uselibpqcompat=true` — убрать pg sslmode deprecation-варнинг («1 Issue»). (В Vercel env обновишь на шаге D.)
- Верификация: `npm run lint` чисто, `npm run build` зелёный.

### B. Коммит обновлённых доков
В рабочем дереве уже лежат незакоммиченные `docs/05-audit.md` (новый, исчерпывающий аудит) + обновлённый `README.md` (исправлен устаревший «Phase 0»). Закоммить их вместе с фиксами из A. `check-ignore .env` → push в origin.

### C. P1 — реальный buyer-checkout (Stripe Checkout + webhooks) — ГЛАВНЫЙ ХВОСТ
Проблема: `StripePaymentProvider.hold()` сейчас подтверждает PaymentIntent тест-картой `pm_card_visa` server-side — **покупатель не вводит карту**. Сделай настоящий чекаут, provider-agnostic, по доке Stripe:
1. Расширь `PaymentProvider` методом чекаута, напр. `createCheckout({ orderId, amountCents, currency, sellerRef, successUrl, cancelUrl })` → URL для редиректа. `StripePaymentProvider` реализует через **Stripe Checkout Session** (mode `payment`, EUR, line_item на сумму, `payment_intent_data.transfer_group = orderId`, metadata `orderId`). `ManualPaymentProvider` сохраняет мгновенный hold (фолбэк для продавцов без Stripe / dev).
2. Поток оформления (`lib/orders/actions.ts` `placeOrder`/`placeConfiguredOrder`, `lib/cart/actions.ts` `checkoutCart`): создаёт Order (CREATED) и **редиректит на Checkout** (если провайдер Stripe). Order → **PAID** только по вебхуку.
3. **Webhook** `app/api/webhooks/stripe/route.ts` (`/api` вне i18n-middleware): верификация подписи `STRIPE_WEBHOOK_SECRET` по **raw body**; обработать `checkout.session.completed`/`payment_intent.succeeded` → Order PAID + `EscrowTxn` (через order-service, **идемпотентно**: гард по статусу заказа и/или `event.id`), `account.updated` → онбординг-статус, `charge.refunded` → синхронизация. Идемпотентность обязательна.
4. EUR; провайдер по `seller.stripeAcctId` (`providerForSeller`); RMT-гейт: currency/items оставить на manual-рельсе (или явный TODO на gaming-PSP). Перед release — гард `isPayoutReady` (`lib/payments/connect.ts`).
5. UI: `successUrl = /<locale>/orders/{id}?paid=1`, `cancelUrl = /<locale>/catalog/{listingId}`; флеш-тост. Не ломать i18n/роуты/контракты.
- **Попроси у юзера:** создать webhook-эндпоинт в Stripe Dashboard (test) и дать `STRIPE_WEBHOOK_SECRET` (в `.env`); для локального теста — `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
- Верификация: `build`+`test` зелёные; локально прогнать чекаут картой `4242 4242 4242 4242`, убедиться Order→PAID по вебхуку + EscrowTxn создан; затем seller deliver → buyer confirm → реальный transfer. Закоммитить + push.

### D. Деплой в main + Vercel
1. Слить `feat/design-overhaul` → `main` (ff-merge или мердж PR), `git push origin main`.
2. Vercel: Production Branch = `main`; Production env: `DATABASE_URL` (с `uselibpqcompat=true`), `AUTH_SECRET`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, **`STRIPE_WEBHOOK_SECRET`** (прод-эндпоинт), опц. `RESEND_API_KEY`.
3. Stripe: webhook-эндпоинт на прод-URL `/api/webhooks/stripe`.
4. Проверить задеплоенный сайт: каталог рендерится, чекаут проходит тест-картой, Order→PAID.
- **Попроси у юзера:** подтверждение мерджа в `main`; настройку Vercel env + Stripe prod-webhook (секреты вставляет он сам, не в чат).

## Метод и контракты
- Не ломать роуты / Prisma-данные / server-actions / i18n-ключи (контракты — в `docs/05-audit.md` и `docs/design/PROMPT.md`).
- После КАЖДОГО шага — `npm run build` + `npm test` зелёные.
- Коммить на вехах, пушить. Где нужен внешний аккаунт/секрет/подтверждение (webhook secret, merge в main, Vercel env) — явно проси юзера, ничего не выдумывай.
- Веди задачи через TaskCreate/TaskUpdate; в конце дай краткий отчёт: что сделано, что проверено, что осталось.
