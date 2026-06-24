# Документ 3. Техническая архитектура

**Версия:** 0.1 (под кодогенерацию)
**Опирается на:** [PRD (Документ 2)](02-product-spec-prd.md) и зафиксированные решения.
**Главный принцип:** **managed-сервисы вместо своей инфраструктуры** — чтобы проект был посилен одному разработчику с ИИ. Монолит (один Next.js-проект), не микросервисы.

---

## 1. Технологический стек

| Слой | Выбор | Почему |
|---|---|---|
| Язык | **TypeScript** (strict) | Один язык фронт+бэк, отлично документирован, дружелюбен к кодогенерации |
| Фреймворк | **Next.js 15 (App Router)** | Full-stack в одном репо: SSR/SSG для SEO-лендингов + бэкенд в route handlers / server actions |
| UI | **React 19 + Tailwind CSS + shadcn/ui** | Быстрый продакшн-UI, готовые доступные компоненты |
| БД | **PostgreSQL** (managed: **Neon** или **Supabase**) | Реляционка под деньги/заказы/эскроу; serverless-friendly |
| ORM | **Prisma** | Типобезопасные модели + миграции |
| Аутентификация | **Auth.js (NextAuth v5)** *(дешевле/гибче)* или **Clerk** *(быстрее старт)* | Сессии, OAuth, 2FA |
| Платежи + эскроу + KYC | **Stripe Connect** + **Stripe Identity** | Эскроу через хранение средств на платформе + transfers; сплит комиссии; выплаты; KYC у того же вендора |
| Реал-тайм чат | **Pusher** или **Ably** (managed); альтернатива — Supabase Realtime | Без своего WebSocket-сервера |
| Файлы (пруфы) | **Cloudflare R2** или **UploadThing** (S3-совместимо) | Дёшево, без своей инфраструктуры |
| Фоновые задачи | **Inngest** (или Vercel Cron) | Авто-релиз эскроу (72ч), расписание выплат, напоминания |
| Почта | **Resend** + React Email | Транзакционные письма (EN/RU) |
| i18n | **next-intl** | EN + RU с первого дня |
| Поиск/фильтры | Postgres + индексы → **Meilisearch/Typesense** позже | Не усложнять MVP |
| Хостинг | **Vercel** (app) + managed Postgres | Ноль DevOps |
| Наблюдаемость | **Sentry** + Vercel Analytics | Ошибки и метрики |
| Rate limit / кэш | **Upstash Redis** | Защита auth/order-эндпоинтов |

## 2. Высокоуровневая архитектура

```
        ┌─────────────────────────────────────────────┐
        │  Браузер (Next.js / React, i18n EN/RU)       │
        └───────────────┬─────────────────────────────┘
                        │  HTTPS
        ┌───────────────▼─────────────────────────────┐
        │  Next.js server (route handlers / actions)   │
        │  ── бизнес-логика в lib/ (orders, escrow…) ── │
        └─┬───────┬────────┬───────┬───────┬───────┬───┘
          │       │        │       │       │       │
   PostgreSQL  Stripe   Stripe  Pusher/  R2/    Inngest
   (Prisma)   Connect  Identity  Ably   Upload  (cron/
              +webhook +webhook (чат)   Thing   queues)
                                        (пруфы)  │
                                              Resend (email)
                                              Sentry (logs)
```

Монолит осознанно: один деплой, одна БД, минимум движущихся частей.

## 3. Структура проекта

```
poe2-marketplace/
├─ app/
│  ├─ [locale]/                # i18n-сегмент (en | ru)
│  │  ├─ (marketing)/          # лендинги, гайды (SEO — наш дифференциатор)
│  │  ├─ (shop)/               # каталог, категории, страница услуги
│  │  ├─ (account)/            # кабинет: покупатель / продавец
│  │  ├─ orders/[id]/          # заказ, чат, спор
│  │  └─ admin/                # модерация, арбитраж, настройки
│  └─ api/
│     ├─ webhooks/stripe/      # платежи + connect events
│     ├─ webhooks/identity/    # KYC-статусы
│     └─ inngest/              # фоновые задачи
├─ components/                 # UI на shadcn/ui
├─ lib/
│  ├─ orders/                  # машина состояний заказа
│  ├─ escrow/                  # удержание/релиз/возврат
│  ├─ payments/                # Stripe Connect клиент + fee calc
│  ├─ kyc/ chat/ notifications/ auth/ db.ts
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts                  # категории, справочник лиг PoE2
├─ messages/                   # en.json, ru.json
├─ emails/                     # React Email шаблоны
├─ tests/                      # Vitest (unit/integration)
└─ e2e/                        # Playwright
```

## 4. Модель данных (Prisma — конкретно)

```prisma
enum Role        { BUYER SELLER MODERATOR ADMIN }
enum SellerType  { BOOSTER SUPPLIER COACH TEAM }
enum KycStatus   { NONE PENDING VERIFIED REJECTED }
enum Fulfillment { PARTY_PLAY TRADE SESSION PILOTING } // PILOTING — пост-MVP
enum LeagueMode  { SOFTCORE HARDCORE SSF_SOFTCORE SSF_HARDCORE }
enum Platform    { PC PS5 XBOX }
enum OrderStatus { CREATED PAID IN_PROGRESS DELIVERED COMPLETED DISPUTED REFUNDED CANCELLED }
enum DisputeState{ OPEN RESOLVED_REFUND RESOLVED_RELEASE RESOLVED_PARTIAL }

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  roles         Role[]   @default([BUYER])
  locale        String   @default("en")
  twoFactor     Boolean  @default(false)
  sellerProfile SellerProfile?
  ordersBought  Order[]  @relation("buyer")
  createdAt     DateTime @default(now())
}

model SellerProfile {
  id           String     @id @default(cuid())
  userId       String     @unique
  user         User       @relation(fields: [userId], references: [id])
  type         SellerType
  displayName  String
  kycStatus    KycStatus  @default(NONE)
  kycRef       String?    // токен провайдера, НЕ документы
  stripeAcctId String?    // Stripe Connect account
  ratingAvg    Float      @default(0)
  ratingCount  Int        @default(0)
  listings     Listing[]
}

model Category {
  id       String    @id @default(cuid())
  slug     String    @unique         // currency, items, leveling, carries, atlas, challenges, crafting, coaching
  nameEn   String
  nameRu   String
  listings Listing[]
}

model Listing {
  id          String      @id @default(cuid())
  sellerId    String
  seller      SellerProfile @relation(fields: [sellerId], references: [id])
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  titleEn     String
  titleRu     String
  priceCents  Int
  currency    String      @default("usd")
  etaHours    Int
  fulfillment Fulfillment
  platform    Platform
  league      String                     // ref на текущую лигу
  leagueMode  LeagueMode
  active      Boolean     @default(true)
  orders      Order[]
}

model Order {
  id           String       @id @default(cuid())
  listingId    String
  listing      Listing      @relation(fields: [listingId], references: [id])
  buyerId      String
  buyer        User         @relation("buyer", fields: [buyerId], references: [id])
  status       OrderStatus  @default(CREATED)
  amountCents  Int
  feeCents     Int                        // 15% флэт
  escrow       EscrowTxn?
  conversation Conversation?
  review       Review?
  dispute      Dispute?
  deliveredAt  DateTime?                  // старт таймера авто-релиза (72ч)
  createdAt    DateTime     @default(now())
}

model EscrowTxn {
  id              String   @id @default(cuid())
  orderId         String   @unique
  order           Order    @relation(fields: [orderId], references: [id])
  stripePaymentId String                   // PaymentIntent
  stripeTransferId String?                 // перевод продавцу при релизе
  heldCents       Int
  releasedAt      DateTime?
  refundedAt      DateTime?
}

model Conversation { id String @id @default(cuid()) orderId String @unique messages Message[] }
model Message {
  id      String   @id @default(cuid())
  convId  String
  conv    Conversation @relation(fields: [convId], references: [id])
  senderId String
  body    String
  attachmentUrl String?
  system  Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Review  { id String @id @default(cuid()) orderId String @unique rating Int body String createdAt DateTime @default(now()) }
model Dispute { id String @id @default(cuid()) orderId String @unique state DisputeState @default(OPEN) reason String resolutionNote String? createdAt DateTime @default(now()) }
model AdminAction { id String @id @default(cuid()) actorId String action String targetId String meta Json createdAt DateTime @default(now()) }
```

## 5. Эскроу на Stripe Connect (ключевой механизм)

**Онбординг продавца:** Stripe Connect **Express**-аккаунт; KYC (Stripe Identity) проходит сам продавец → `stripeAcctId` сохраняется.

**Поток денег (separate charges & transfers):**
1. Покупатель платит → `PaymentIntent` на **аккаунт платформы** (деньги «зависают» = эскроу).
2. Заказ: `PAID → IN_PROGRESS → DELIVERED` (продавец грузит пруф, ставится `deliveredAt`).
3. **Релиз:** покупатель подтверждает **или** Inngest по таймеру (72ч после `deliveredAt`) → `Transfer` продавцу на `amount − 15%`; платформа удерживает комиссию.
4. **Спор:** вместо трансфера — `Refund` (полный/частичный) по решению модератора.

**Машина состояний заказа:**
```
CREATED → PAID → IN_PROGRESS → DELIVERED → COMPLETED
                          │            │
                          └─→ DISPUTED ─┴─→ REFUNDED | (RELEASE → COMPLETED)
CREATED → CANCELLED
```
Правила: смена статуса только через сервис `lib/orders`; **идемпотентные** вебхуки; релиз/возврат — только из валидного состояния.

> ⚠️ **Критичный риск (проверить ДО кода):** Stripe относит продажу игровой валюты/предметов (RMT) к ограниченным/запрещённым категориям. overgear показывает Stripe в логотипах, но мог использовать его лишь под часть потоков. **Нужно подтвердить у Stripe допустимость**, иначе для trade-категорий понадобится **gaming/RMT-friendly PSP** (с резервами под чарджбеки). См. §13.

## 6. API / эндпоинты (по модулям)

Серверная логика — через **server actions** (мутации из UI) + **route handlers** (вебхуки, публичные GET):

| Модуль | Операции |
|---|---|
| Каталог | `GET /catalog` (фильтры), `GET /listing/:id` |
| Продавец | `applySeller`, `submitKyc`, `createListing`, `updateListing` |
| Заказ | `createOrder` → PaymentIntent, `confirmCompletion`, `cancelOrder` |
| Чат | `sendMessage` (+Pusher event), `uploadProof` |
| Спор | `openDispute`, `resolveDispute` (admin) |
| Отзыв | `leaveReview` |
| Выплаты | `requestPayout`, баланс продавца |
| Админ | `verifySeller`, `moderateListing`, `updateSettings` |
| Вебхуки | `POST /api/webhooks/stripe`, `/identity`, `/api/inngest` |

## 7. Аутентификация, роли, безопасность

- **Auth.js**: email + OAuth (Google/Discord — Discord уместен для геймеров) + **2FA (TOTP)**.
- **RBAC**: `guest / buyer / seller / moderator / admin`; guard в `middleware.ts` и в server actions.
- **Целостность эскроу**: проверка состояния перед каждой сменой; идемпотентность по `event.id`; верификация подписи вебхуков Stripe.
- **Антифрод**: лимиты для новых продавцов, velocity-проверки, ручная очередь модерации, флаг рискованных категорий.
- **PII**: храним только `kycStatus` + `kycRef`, **не документы**; GDPR-готовность; право на удаление.
- **Секреты**: только env, никогда не в репозиторий.
- **Rate limiting** (Upstash) на auth/order/chat.
- **Аудит**: таблица `AdminAction` на действия модерации/денег.

## 8. Окружения и деплой

- **Среды:** local → preview (Vercel PR-деплои) → production.
- **БД-миграции:** Prisma migrate; `seed.ts` для категорий и справочника лиг.
- **CI:** GitHub Actions — `lint` + `typecheck` + `test`; затем Vercel-деплой.
- **Фоновые задачи:** Inngest (cloud) — авто-релиз 72ч, payout-расписание, напоминания.
- **Stripe:** test-mode в dev/preview, live в prod; вебхуки на каждый env.

## 9. Команды

```bash
npm run dev            # локальная разработка
npm run build          # прод-сборка
npm run start          # запуск прод-сборки
npm run lint           # ESLint --fix
npm run typecheck      # tsc --noEmit
npm run test           # Vitest (unit + integration)
npm run test:e2e       # Playwright
npx prisma migrate dev # миграции БД
npx prisma studio      # просмотр данных
npm run seed           # сиды категорий/лиг
```

## 10. Код-стайл

- **TypeScript strict**, ESLint + Prettier.
- Именование: `camelCase` (переменные/функции), `PascalCase` (компоненты/типы), `kebab-case` (файлы; компоненты — PascalCase).
- **Zod** валидирует все границы: формы, server actions, вебхуки.
- Бизнес-логика в `lib/`; компоненты «тонкие».
- Деньги — всегда в **центах (Int)**, не во float.

```ts
// lib/orders/create-order.ts
const Input = z.object({ listingId: z.string().cuid() });

export async function createOrder(raw: unknown, userId: string) {
  const { listingId } = Input.parse(raw);
  const listing = await db.listing.findUniqueOrThrow({ where: { id: listingId } });
  const feeCents = Math.round(listing.priceCents * 0.15); // 15% флэт
  return db.order.create({
    data: { listingId, buyerId: userId, amountCents: listing.priceCents, feeCents, status: "CREATED" },
  });
}
```

## 11. Тест-стратегия

- **Unit (Vitest):** расчёт комиссии, машина состояний заказа, логика эскроу/релиза/возврата.
- **Integration:** server actions + Prisma на тестовой БД; вебхуки Stripe на фикстурах.
- **E2E (Playwright):** критические флоу — покупка → эскроу → подтверждение → релиз; открытие спора.
- **Приоритет покрытия:** всё, что трогает **деньги и статусы заказов**. «Кажется работает» ≠ готово.

## 12. Boundaries (Always / Ask first / Never)

- **Always:** Zod на границах; проверять состояние заказа перед сменой; идемпотентные вебхуки; миграции через Prisma; тесты на денежную логику.
- **Ask first:** изменение схемы БД, новые зависимости, смена платёжной/эскроу-логики, изменение комиссии.
- **Never:** коммитить секреты; релизить эскроу в обход подтверждения/таймера; хранить KYC-документы у себя; править суммы в БД в обход Stripe.

## 13. Открытые тех-вопросы (нужно решение/проверка)

1. ⚠️ **PSP для RMT-категорий** — подтвердить у Stripe допустимость продажи игровой валюты/предметов; иначе подобрать gaming-friendly провайдер. **Самый важный — проверить до старта кода.**
2. **Auth.js vs Clerk** — гибкость/цена vs скорость старта.
3. **Pusher vs Ably vs Supabase Realtime** для чата.
4. **Регион/валюты** и налоговая обвязка платежей.

---

## Критерий готовности документа
- [x] Стек с обоснованием
- [x] Структура проекта
- [x] Конкретная Prisma-схема (ядро)
- [x] Механизм эскроу на Stripe Connect + машина состояний
- [x] Список API/эндпоинтов
- [x] Безопасность, окружения, команды, код-стайл, тесты, boundaries
- [ ] **Согласовано владельцем** ← ждёт ревью (особенно п.13.1 про PSP)
