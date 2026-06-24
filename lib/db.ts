// Prisma client singleton — avoids exhausting DB connections during dev hot-reload.
// Prisma 7 requires a driver adapter; @prisma/adapter-pg connects to Postgres (Neon).
// Constructor pattern per the generated client (lib/generated/prisma/client.ts).
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/lib/generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
