'use server';

import { db } from '@/lib/db';

export async function getActiveCycle() {
  const cycle = await db.cycle.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  if (cycle) {
    return cycle;
  }

  // Create a default cycle if none exists
  return db.cycle.create({
    data: { name: 'Current Cycle', isActive: true },
  });
}

export async function getCycles() {
  return db.cycle.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCyclesWithCounts() {
  const cycles = await db.cycle.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          applications: true,
          nominations: true,
          endorsements: true,
        },
      },
    },
  });
  return cycles;
}
