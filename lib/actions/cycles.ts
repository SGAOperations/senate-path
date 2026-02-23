'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const DEFAULT_SETTINGS = {
  requiredNominations: 15,
  maxCommunityNominations: 7,
  endorsementRequired: false,
  endorsementsOpen: true,
  applicationDeadline: null,
  applicationsOpen: true,
  nominationsOpen: true,
  customMessage: null,
};

export async function createCycleAndSetActive(name: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      return { success: false, error: 'Cycle name is required' };
    }

    // Deactivate all existing cycles
    await db.cycle.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create new cycle as active
    const newCycle = await db.cycle.create({
      data: { name: trimmedName, isActive: true },
    });

    // Create default settings for the new cycle
    await db.settings.create({
      data: { ...DEFAULT_SETTINGS, cycleId: newCycle.id },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/cycles');
    revalidatePath('/admin/settings');

    return { success: true, cycle: newCycle };
  } catch (error) {
    console.error('Error creating cycle:', error);
    return { success: false, error: 'Failed to create cycle' };
  }
}

export async function setActiveCycle(cycleId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Deactivate all existing cycles
    await db.cycle.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Activate the target cycle
    const cycle = await db.cycle.update({
      where: { id: cycleId },
      data: { isActive: true },
    });

    // Create default settings if none exist
    await db.settings.upsert({
      where: { cycleId },
      update: {},
      create: { ...DEFAULT_SETTINGS, cycleId },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/cycles');
    revalidatePath('/admin/settings');

    return { success: true, cycle };
  } catch (error) {
    console.error('Error setting active cycle:', error);
    return { success: false, error: 'Failed to set active cycle' };
  }
}
