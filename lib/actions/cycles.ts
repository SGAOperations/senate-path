'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

/**
 * Create a new cycle. If setActive is true, deactivate all other cycles.
 */
export async function createCycle(name: string, setActive: boolean) {
  if (!name.trim()) {
    return { success: false, error: 'Cycle name is required' };
  }

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
      await db.settings.upsert({
        where: { cycleId: cycle.id },
        update: {},
        create: { cycleId: cycle.id },
      });
    }

    revalidatePath('/admin/cycles');
    revalidatePath('/admin');

    return { success: true, cycle };
  } catch (error) {
    console.error('Error creating cycle:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create cycle',
    };
  }
}

/**
 * Set a cycle as active, deactivating all others.
 * Creates default Settings for the cycle if none exist.
 */
export async function setActiveCycle(id: string) {
  try {
    await db.cycle.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    await db.cycle.update({
      where: { id },
      data: { isActive: true },
    });

    await db.settings.upsert({
      where: { cycleId: id },
      update: {},
      create: { cycleId: id },
    });

    revalidatePath('/admin/cycles');
    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    console.error('Error setting active cycle:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set active cycle',
    };
  }
}

/**
 * Soft-delete an inactive cycle. Only allowed if the cycle has no data.
 */
export async function deleteCycle(id: string) {
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
      return { success: false, error: 'Cycle not found' };
    }

    if (cycle.isActive) {
      return { success: false, error: 'Cannot delete the active cycle' };
    }

    const total =
      cycle._count.applications + cycle._count.nominations + cycle._count.endorsements;
    if (total > 0) {
      return {
        success: false,
        error: 'Cannot delete a cycle that has applications, nominations, or endorsements',
      };
    }

    await db.cycle.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath('/admin/cycles');
    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    console.error('Error deleting cycle:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete cycle',
    };
  }
}
