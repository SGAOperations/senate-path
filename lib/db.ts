import { PrismaClient } from '@prisma/client';

// Validate that required environment variables are set
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Please ensure you have a .env or .env.local file with DATABASE_URL defined.\n' +
    'For local development, run:\n' +
    '  cp .env.example .env.local\n' +
    '  npm run db:start\n' +
    'See README.md "Local Development Database" section for details.'
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
