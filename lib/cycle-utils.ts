import { db } from '@/lib/db';

export async function getActiveCycle() {
  return db.cycle.findFirst({
    where: { isActive: true, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });
}
