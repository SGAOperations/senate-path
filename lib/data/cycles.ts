'use server';

import { db } from '@/lib/db';

export async function getActiveCycle() {
  return db.cycle.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCycles() {
  return db.cycle.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });
}
