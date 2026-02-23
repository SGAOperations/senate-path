'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import type { Cycle } from '@prisma/client';
import type { ActionError } from '@/lib/actions/utils';

/**
 * Create a new cycle. If setActive is true, deactivate all other cycles.
 */
export async function createCycle(
  name: string,
  setActive: boolean
): Promise<{ cycle: Cycle } | ActionError> {
  try {
    if (setActive) {
      await db.cycle.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const cycle = await db.cycle.create({
      data: { name: name.trim(), isActive: setActive },
    });

    if (setActive) {
      // Create default settings for the new active cycle if none exist
      await db.settings.upsert({
        where: { cycleId: cycle.id },
        update: {},
        create: { cycleId: cycle.id },
      });
    }

    revalidatePath('/admin');

    return { cycle };
  } catch {
    return { error: 'Failed to create cycle' };
  }
}

/**
 * Set a cycle as active, deactivating all others.
 * Creates default Settings for the cycle if none exist.
 */
export async function setActiveCycle(id: string): Promise<Record<string, never> | ActionError> {
  try {
    await db.cycle.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    await db.cycle.update({
      where: { id },
      data: { isActive: true },
    });

    // Create default settings for the newly active cycle if none exist
    await db.settings.upsert({
      where: { cycleId: id },
      update: {},
      create: { cycleId: id },
    });

    revalidatePath('/admin');

    return {};
  } catch {
    return { error: 'Failed to set active cycle' };
  }
}

/**
 * Soft-delete an inactive cycle. Only allowed if the cycle has no data.
 */
export async function deleteCycle(id: string): Promise<Record<string, never> | ActionError> {
  try {
    const cycle = await db.cycle.findUnique({
      where: { id },
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

    if (!cycle) {
      return { error: 'Cycle not found' };
    }

    if (cycle.isActive) {
      return { error: 'Cannot delete the active cycle' };
    }

    const total =
      cycle._count.applications + cycle._count.nominations + cycle._count.endorsements;
    if (total > 0) {
      return {
        error: 'Cannot delete a cycle that has applications, nominations, or endorsements',
      };
    }

    await db.cycle.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath('/admin');

    return {};
  } catch {
    return { error: 'Failed to delete cycle' };
  }
}

