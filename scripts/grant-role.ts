import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';

// Usage: npm run db:grant-admin -- you@example.com
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const email = process.argv[2];

async function main() {
  if (!email) {
    console.error('Usage: npm run db:grant-admin -- <email>');
    process.exit(1);
  }
  const user = await db.user.update({
    where: { email },
    data: { roles: { set: ['BUYER', 'SELLER', 'MODERATOR', 'ADMIN'] } },
  });
  console.log(`Granted MODERATOR + ADMIN to ${user.email}. Sign out and back in to refresh the session.`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
