import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export async function checkDatabaseConnection() {
  try {
    await db.$queryRaw`SELECT 1`;
    console.log('Database connection successful');
  } catch (error) {
    console.error('FATAL: Database connection failed. Cannot proceed with deployment.');
    console.error('Database error:', error);
    console.error('Please ensure the database is configured correctly and accessible.');
    throw error;
  }
}
