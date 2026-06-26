# План: недостающие overgear-карточки для Titanpoe2

> Источник: анализ `overgear.com/games/poe-2` + [docs/01-overgear-teardown.md](../docs/01-overgear-teardown.md) +
> инвентарь `components/**`. Л인за — конверсия/доверие (skill `marketplace-conversion-ux`).
> Правила реализации — skill `titanpoe2-components` + `titanpoe2-design-system` (токены), i18n EN/RU.

## Контракты (не ломать)
- Роуты / Prisma-данные / server-actions / i18n-ключи — не ломаем (см. [docs/05-audit.md](../docs/05-audit.md)).
- Тонкий компонент, логика в `lib/`, копирайт — только из `next-intl` (EN/RU), токены — из дизайн-системы.
- Каждая карточка: rest/hover/focus + empty/skeleton где применимо. A11y: focus-ring, иконка+текст (не только цвет).
- Изображения — только через `lib/items.ts → itemImage()` + `<ListingArt>` (золотой glow запечён в PNG). Битых картинок не плодим (fallback на генеративный арт).
- После каждой карточки: `npm run lint` + `typecheck` + `test` + `build` зелёные; скрин EN/RU.

## Стиль карточек (взято с главной)
- Контейнер: `card-sheen rounded-lg border border-border bg-card p-5`.
- Иконка: `grid size-9 place-items-center rounded-md bg-primary/12 text-primary` + lucide 16px.
- Заголовок `font-medium`, текст `text-sm text-muted-foreground`.
- Секции: `SectionHeading` (kicker/title/sub/action) + `Reveal`/`Stagger`/`StaggerItem`.

## Матрица (overgear → наш статус)
Есть: ListingCard, CategoryCard, FeatureBanner, TrustStrip, TrustScore, Reviews, StatPill+CountUp,
ActivityTicker, FAQ, escrow how-it-works, payment-row, Footer-nav.
Нет/частично: **бандлы**, **top-sellers showcase**, **fulfillment-method cards**, **guarantees cards+страница**,
**«services include» SEO-блоки**, game/league info (частично), support/help CTA.

## Фазы

### Фаза 1 (без схемы)
- **① FulfillmentMethodCard** — «Как проходит доставка» (party-play / trade / coaching / piloting + safety-нота).
  `lib/fulfillment.ts` (иконка + safety-флаг по `Fulfillment` enum), `components/marketplace/fulfillment-card.tsx`,
  i18n namespace `Delivery`. Секция на главной (после escrow) + блок на листинге под конфигуратором.
- **② Guarantees** — `components/marketplace/guarantee-card.tsx` (escrow/money-back/verified/dispute), грид 2×2,
  страница `app/[locale]/guarantees/page.tsx`, линк из футера. i18n namespace `Guarantees`.
- **④ CategoryBlurb** — `components/marketplace/category-blurb-card.tsx` (CategoryIcon + заголовок + 2-3 строки +
  «from €X» + CTA). Описания в i18n `Categories.<slug>`, min-цена через `getCategoryFromPrices()` в
  `lib/sellers/queries.ts`. Низ главной + верх `/catalog?category=`.
- **③ TopSellers / SellerShowcase** — `getTopSellers()` (только VERIFIED, sort rating×count + orders),
  `components/marketplace/seller-showcase-card.tsx`. Секция на главной. Empty → секцию скрыть.

### Фаза 3 (мелкое)
- **⑥ Game/League info cards** — апгрейд league-context в структурные карточки (контент из i18n).
- **⑦ Support/Help CTA** — блок «нужна помощь» → чат/контакт.

### Фаза 2 (нужна схема — ЗАБЛОКИРОВАНО до выбора модели)
- **⑤ Bundle / BundleCard.** Модель на выбор:
  - **A (лёгкая):** `Listing.kind` enum (`SERVICE|BUNDLE`) + `compareAtCents` для «экономии пакета».
  - **B (честная):** новая модель `Bundle` (состав из N листингов/тиров, цена пакета < суммы).
  `createCheckout(lines[])` уже поддерживает мульти-позиции — бандл ляжет одной сессией/заказом.

## Сознательно НЕ делаем
Таймеры/фейк-дефицит (анти-паттерн), account-sales (ToS-риск), blog/guides (отдельная инициатива).

## Прогресс
- [ ] ① FulfillmentMethodCard
- [ ] ② Guarantees + /guarantees
- [ ] ④ CategoryBlurb
- [ ] ③ TopSellers showcase
- [ ] ⑥ Game/League cards
- [ ] ⑦ Support CTA
- [ ] ⑤ Bundles (после выбора A/B)
