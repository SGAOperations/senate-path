'use server';

import { db } from '@/lib/db';

export { getActiveCycle } from '@/lib/cycle-utils';

export async function getCycles() {
  return db.cycle.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });
}
