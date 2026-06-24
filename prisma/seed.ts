import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

// MVP service categories (EN/RU). Slugs are stable; names are display labels.
const categories = [
  { slug: 'currency', nameEn: 'Currency', nameRu: 'Валюта' },
  { slug: 'items', nameEn: 'Items & Gear', nameRu: 'Предметы и гир' },
  { slug: 'leveling', nameEn: 'Power Leveling', nameRu: 'Прокачка' },
  { slug: 'carries', nameEn: 'Boss Carries', nameRu: 'Карри боссов' },
  { slug: 'atlas', nameEn: 'Atlas & Maps', nameRu: 'Атлас и карты' },
  { slug: 'challenges', nameEn: 'Challenge Completion', nameRu: 'Челленджи' },
  { slug: 'crafting', nameEn: 'Crafting', nameRu: 'Крафт' },
  { slug: 'coaching', nameEn: 'Coaching', nameRu: 'Коучинг' },
];

async function main() {
  for (const c of categories) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: { nameEn: c.nameEn, nameRu: c.nameRu },
      create: c,
    });
  }
  console.log(`Seeded ${categories.length} categories.`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
