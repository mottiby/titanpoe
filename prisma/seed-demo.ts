import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';

// Idempotent demo data so the rich UI (cards, configurator, reviews, testimonials)
// renders against realistic PoE2 content. Safe to re-run: all rows use stable ids.
// Run: npm run db:seed-demo  (requires categories from `npm run db:seed` first).

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const LEAGUE = 'Return of the Ancients';
// Titanpoe lists ~10% under the market (overgear). Applied to every price
// (base, compare-at, tiers, add-ons) since they all go through euro().
const PRICE_FACTOR = 0.9;
const euro = (n: number) => Math.round(n * 100 * PRICE_FACTOR);
const fee = (cents: number) => Math.round(cents * 0.15);

type SellerSeed = {
  key: string;
  email: string;
  displayName: string;
  type: 'BOOSTER' | 'SUPPLIER' | 'COACH' | 'TEAM';
  ratingAvg: number;
  ratingCount: number;
};

const sellers: SellerSeed[] = [
  { key: 'vault', email: 'demo.vault@titanpoe2.local', displayName: 'Wraeclast Vault', type: 'SUPPLIER', ratingAvg: 4.9, ratingCount: 2143 },
  { key: 'squad', email: 'demo.squad@titanpoe2.local', displayName: 'Pinnacle Squad', type: 'TEAM', ratingAvg: 4.8, ratingCount: 1389 },
  { key: 'coach', email: 'demo.coach@titanpoe2.local', displayName: 'Ascend Coaching', type: 'COACH', ratingAvg: 5.0, ratingCount: 276 },
  { key: 'forge', email: 'demo.forge@titanpoe2.local', displayName: 'Exile Forge', type: 'BOOSTER', ratingAvg: 4.7, ratingCount: 928 },
];

type TierSeed = { nameEn: string; nameRu: string; price: number; etaHours: number };
type AddonSeed = { nameEn: string; nameRu: string; price: number };

type ListingSeed = {
  key: string;
  seller: string;
  categorySlug: string;
  titleEn: string;
  titleRu: string;
  descriptionEn: string;
  descriptionRu: string;
  price: number;
  compareAt?: number;
  etaHours: number;
  fulfillment: 'PARTY_PLAY' | 'TRADE' | 'SESSION';
  platform: 'PC' | 'PS5' | 'XBOX';
  leagueMode: 'SOFTCORE' | 'HARDCORE' | 'SSF_SOFTCORE' | 'SSF_HARDCORE';
  badge?: 'HOT' | 'SALE' | 'NEW' | 'BEST_VALUE';
  highlightsEn: string[];
  highlightsRu: string[];
  tiers?: TierSeed[];
  addons?: AddonSeed[];
  review?: { rating: number; bodyEn: string };
};

const listings: ListingSeed[] = [
  {
    key: 'exalted', seller: 'vault', categorySlug: 'currency',
    titleEn: 'Exalted Orbs — bulk pack', titleRu: 'Эксальты — оптом',
    descriptionEn: 'Stack up on Exalted Orbs for crafting and upgrades. Delivered by in-game trade, fast and safe via escrow.',
    descriptionRu: 'Запас Эксальтов для крафта и апгрейдов. Доставка игровым трейдом — быстро и безопасно через эскроу.',
    price: 14.99, compareAt: 19.99, etaHours: 1, fulfillment: 'TRADE', platform: 'PC', leagueMode: 'SOFTCORE', badge: 'SALE',
    highlightsEn: ['Delivered in ≤15 min', 'In-game trade hand-off', '100% hand-farmed'],
    highlightsRu: ['Доставка за ≤15 мин', 'Передача через игровой трейд', '100% ручной фарм'],
    tiers: [
      { nameEn: '500× Exalted', nameRu: '500× Эксальт', price: 14.99, etaHours: 1 },
      { nameEn: '1,000× Exalted', nameRu: '1 000× Эксальт', price: 27.99, etaHours: 1 },
      { nameEn: '2,500× Exalted', nameRu: '2 500× Эксальт', price: 64.99, etaHours: 2 },
    ],
    review: { rating: 5, bodyEn: 'Lightning fast delivery, exactly as described. My go-to supplier.' },
  },
  {
    key: 'divine', seller: 'vault', categorySlug: 'currency',
    titleEn: 'Divine Orb pack', titleRu: 'Пак Дивайнов',
    descriptionEn: 'High-value Divine Orbs for endgame crafting. Bonus orbs included with larger packs.',
    descriptionRu: 'Дивайны для эндгейм-крафта. В больших паках — бонусные орбы.',
    price: 39.99, etaHours: 1, fulfillment: 'TRADE', platform: 'PC', leagueMode: 'SOFTCORE', badge: 'HOT',
    highlightsEn: ['Bonus orbs on big packs', 'Secure trade delivery', 'Live stock'],
    highlightsRu: ['Бонусные орбы в больших паках', 'Безопасная доставка трейдом', 'Товар в наличии'],
    tiers: [
      { nameEn: '20× Divine', nameRu: '20× Дивайн', price: 39.99, etaHours: 1 },
      { nameEn: '50× Divine (+3 free)', nameRu: '50× Дивайн (+3 бесплатно)', price: 94.99, etaHours: 1 },
    ],
    review: { rating: 5, bodyEn: 'Got the bonus divines as promised. Smooth trade.' },
  },
  {
    key: 'arbiter', seller: 'squad', categorySlug: 'carries',
    titleEn: 'Arbiter of Ash — boss carry', titleRu: 'Карри Arbiter of Ash',
    descriptionEn: 'Our team clears the Arbiter of Ash and you keep every drop. Party-play, 100% hand-played, no account sharing.',
    descriptionRu: 'Команда убивает Arbiter of Ash, весь лут — ваш. Совместная игра, 100% вручную, без передачи аккаунта.',
    price: 24.99, etaHours: 3, fulfillment: 'PARTY_PLAY', platform: 'PC', leagueMode: 'SOFTCORE', badge: 'HOT',
    highlightsEn: ['Keep all loot', 'Party-play (no account sharing)', 'Pinnacle specialists'],
    highlightsRu: ['Весь лут ваш', 'Совместная игра (без доступа к аккаунту)', 'Специалисты по пинаклам'],
    tiers: [
      { nameEn: '1 run', nameRu: '1 заход', price: 24.99, etaHours: 3 },
      { nameEn: '3 runs', nameRu: '3 захода', price: 64.99, etaHours: 6 },
      { nameEn: '5 runs', nameRu: '5 заходов', price: 99.99, etaHours: 8 },
    ],
    addons: [
      { nameEn: 'Express start (≤30 min)', nameRu: 'Срочный старт (≤30 мин)', price: 7.99 },
      { nameEn: 'Private livestream', nameRu: 'Приватный стрим', price: 4.99 },
    ],
    review: { rating: 5, bodyEn: 'Killed it first try and I kept all the loot. Super friendly team.' },
  },
  {
    key: 'leveling', seller: 'forge', categorySlug: 'leveling',
    titleEn: 'Power leveling 1 → 90 (Cruel done)', titleRu: 'Прокачка 1 → 90 (Cruel пройден)',
    descriptionEn: 'Skip the grind — we level your character to 90 with the campaign and Cruel difficulty completed. Endgame ready.',
    descriptionRu: 'Без гринда — прокачаем персонажа до 90 с пройденной кампанией и Cruel. Готов к эндгейму.',
    price: 49.99, compareAt: 59.99, etaHours: 24, fulfillment: 'PARTY_PLAY', platform: 'PC', leagueMode: 'SOFTCORE', badge: 'BEST_VALUE',
    highlightsEn: ['Endgame ready', 'Campaign + Cruel cleared', 'Daily progress updates'],
    highlightsRu: ['Готов к эндгейму', 'Кампания + Cruel пройдены', 'Ежедневные отчёты о прогрессе'],
    tiers: [
      { nameEn: 'To level 70', nameRu: 'До 70 уровня', price: 34.99, etaHours: 14 },
      { nameEn: 'To level 90', nameRu: 'До 90 уровня', price: 49.99, etaHours: 24 },
      { nameEn: 'To level 95', nameRu: 'До 95 уровня', price: 79.99, etaHours: 40 },
    ],
    review: { rating: 5, bodyEn: 'Hit 90 overnight, perfect for my schedule.' },
  },
  {
    key: 'sekhemas', seller: 'squad', categorySlug: 'challenges',
    titleEn: 'Trial of the Sekhemas — Ascendancy', titleRu: 'Trial of the Sekhemas — Аскенденси',
    descriptionEn: 'We complete the Trial of the Sekhemas and unlock your Ascendancy points. Party-play, stress-free.',
    descriptionRu: 'Проходим Trial of the Sekhemas и открываем очки Аскенденси. Совместная игра, без стресса.',
    price: 17.99, etaHours: 2, fulfillment: 'PARTY_PLAY', platform: 'PC', leagueMode: 'SOFTCORE', badge: 'NEW',
    highlightsEn: ['All Ascendancy points', 'Party-play', 'Any class'],
    highlightsRu: ['Все очки Аскенденси', 'Совместная игра', 'Любой класс'],
  },
  {
    key: 'atlas', seller: 'forge', categorySlug: 'atlas',
    titleEn: 'Atlas progression & Waystone farm', titleRu: 'Прокачка Атласа и фарм Waystone',
    descriptionEn: 'Open up your endgame Atlas and stock you with high-tier Waystones to keep mapping.',
    descriptionRu: 'Откроем ваш эндгейм-Атлас и обеспечим Waystone высокого тира для дальнейшего маппинга.',
    price: 29.99, etaHours: 8, fulfillment: 'PARTY_PLAY', platform: 'PC', leagueMode: 'SOFTCORE',
    highlightsEn: ['Atlas opened up', 'Waystone stockpile', 'Keep all drops'],
    highlightsRu: ['Атлас открыт', 'Запас Waystone', 'Весь лут ваш'],
  },
  {
    key: 'craft', seller: 'vault', categorySlug: 'crafting',
    titleEn: 'Custom craft to spec', titleRu: 'Крафт на заказ по спецификации',
    descriptionEn: 'Tell us the affixes you need — we craft the item to your build spec and deliver via trade.',
    descriptionRu: 'Скажите нужные аффиксы — скрафтим предмет под ваш билд и доставим через трейд.',
    price: 34.99, etaHours: 12, fulfillment: 'TRADE', platform: 'PC', leagueMode: 'SOFTCORE',
    highlightsEn: ['Built to your spec', 'Trade delivery', 'Crafting experts'],
    highlightsRu: ['Под вашу спецификацию', 'Доставка трейдом', 'Эксперты крафта'],
  },
  {
    key: 'coaching', seller: 'coach', categorySlug: 'coaching',
    titleEn: 'Mapping & Atlas strategy session', titleRu: 'Сессия по маппингу и стратегии Атласа',
    descriptionEn: 'Live 1:1 coaching: Atlas strategy, juicing maps, and efficient currency farming for your build.',
    descriptionRu: 'Живой коучинг 1:1: стратегия Атласа, «джус» карт и эффективный фарм валюты под ваш билд.',
    price: 19.99, etaHours: 1, fulfillment: 'SESSION', platform: 'PC', leagueMode: 'SOFTCORE',
    highlightsEn: ['Live 1:1 session', 'Build-specific advice', 'No account access'],
    highlightsRu: ['Живая сессия 1:1', 'Советы под ваш билд', 'Без доступа к аккаунту'],
    tiers: [
      { nameEn: '1 hour', nameRu: '1 час', price: 19.99, etaHours: 1 },
      { nameEn: '3 hours', nameRu: '3 часа', price: 49.99, etaHours: 3 },
    ],
    review: { rating: 5, bodyEn: 'Doubled my currency per hour after one session. Worth every euro.' },
  },
  {
    key: 'unique', seller: 'vault', categorySlug: 'items',
    titleEn: 'Build-enabling unique items', titleRu: 'Уникальные предметы под билд',
    descriptionEn: 'Grab the chase uniques your build needs. In-stock and delivered by trade within the hour.',
    descriptionRu: 'Возьмите ключевые уникумы для вашего билда. В наличии, доставка трейдом в течение часа.',
    price: 22.99, etaHours: 1, fulfillment: 'TRADE', platform: 'PC', leagueMode: 'SOFTCORE',
    highlightsEn: ['In stock now', 'Trade delivery ≤1h', 'Build-enabling chase items'],
    highlightsRu: ['В наличии', 'Доставка трейдом ≤1ч', 'Ключевые предметы под билд'],
    review: { rating: 4, bodyEn: 'Had the unique I needed in stock. Quick and easy.' },
  },
];

async function main() {
  const categories = await db.category.findMany();
  const catBySlug = new Map(categories.map((c) => [c.slug, c.id]));
  if (catBySlug.size === 0) throw new Error('No categories — run `npm run db:seed` first.');

  // Sellers (User + SellerProfile)
  const profileIdByKey = new Map<string, string>();
  for (const s of sellers) {
    const user = await db.user.upsert({
      where: { email: s.email },
      update: { name: s.displayName },
      create: { email: s.email, name: s.displayName, roles: ['BUYER', 'SELLER'], locale: 'en' },
    });
    const profile = await db.sellerProfile.upsert({
      where: { userId: user.id },
      update: { displayName: s.displayName, type: s.type, kycStatus: 'VERIFIED', ratingAvg: s.ratingAvg, ratingCount: s.ratingCount },
      create: { userId: user.id, displayName: s.displayName, type: s.type, kycStatus: 'VERIFIED', ratingAvg: s.ratingAvg, ratingCount: s.ratingCount },
    });
    profileIdByKey.set(s.key, profile.id);
  }

  // Demo buyer (for completed orders + reviews)
  const buyer = await db.user.upsert({
    where: { email: 'demo.buyer@titanpoe2.local' },
    update: { balanceCents: 4250 },
    create: {
      email: 'demo.buyer@titanpoe2.local',
      name: 'Demo Buyer',
      roles: ['BUYER'],
      locale: 'en',
      balanceCents: 4250,
    },
  });

  // Listings (+ tiers, addons, optional completed order + review)
  for (const l of listings) {
    const id = `demo-listing-${l.key}`;
    const sellerId = profileIdByKey.get(l.seller)!;
    const categoryId = catBySlug.get(l.categorySlug)!;
    const data = {
      sellerId, categoryId,
      titleEn: l.titleEn, titleRu: l.titleRu,
      descriptionEn: l.descriptionEn, descriptionRu: l.descriptionRu,
      priceCents: euro(l.price),
      compareAtCents: l.compareAt ? euro(l.compareAt) : null,
      currency: 'eur', etaHours: l.etaHours,
      fulfillment: l.fulfillment, platform: l.platform, league: LEAGUE, leagueMode: l.leagueMode,
      badge: l.badge ?? null,
      highlightsEn: l.highlightsEn, highlightsRu: l.highlightsRu,
      active: true,
    };
    await db.listing.upsert({ where: { id }, update: data, create: { id, ...data } });

    // Replace children deterministically.
    await db.listingTier.deleteMany({ where: { listingId: id } });
    if (l.tiers) {
      await db.listingTier.createMany({
        data: l.tiers.map((t, i) => ({
          id: `demo-tier-${l.key}-${i}`, listingId: id,
          nameEn: t.nameEn, nameRu: t.nameRu, priceCents: euro(t.price), etaHours: t.etaHours, position: i,
        })),
      });
    }
    await db.listingAddon.deleteMany({ where: { listingId: id } });
    if (l.addons) {
      await db.listingAddon.createMany({
        data: l.addons.map((a, i) => ({
          id: `demo-addon-${l.key}-${i}`, listingId: id,
          nameEn: a.nameEn, nameRu: a.nameRu, priceCents: euro(a.price),
        })),
      });
    }

    if (l.review) {
      const orderId = `demo-order-${l.key}`;
      const amountCents = euro(l.price);
      await db.order.upsert({
        where: { id: orderId },
        update: { status: 'COMPLETED' },
        create: {
          id: orderId, listingId: id, buyerId: buyer.id, status: 'COMPLETED',
          amountCents, feeCents: fee(amountCents), deliveredAt: new Date(),
        },
      });
      await db.review.upsert({
        where: { orderId },
        update: { rating: l.review.rating, body: l.review.bodyEn },
        create: { id: `demo-review-${l.key}`, orderId, rating: l.review.rating, body: l.review.bodyEn },
      });
    }
  }

  console.log(`Seeded ${sellers.length} sellers, ${listings.length} listings with tiers/add-ons + demo reviews.`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
