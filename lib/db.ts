import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

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
  pgPool: Pool | undefined;
};

// Create PostgreSQL connection pool
const pool = globalForPrisma.pgPool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== 'production') globalForPrisma.pgPool = pool;

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma Client with adapter
export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
