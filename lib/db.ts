import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

/**
 * Check database connection health. Throws an error if connection fails.
 * This should be called during application startup to fail fast if database is unavailable.
 */
export async function checkDatabaseConnection() {
  try {
    await db.$connect();
    await db.$queryRaw`SELECT 1`;
    console.log('Database connection successful');
  } catch (error) {
    console.error('FATAL: Database connection failed. Cannot proceed with deployment.');
    console.error('Database error:', error);
    console.error('Please ensure the database is configured correctly and accessible.');
    throw error;
  }
}
