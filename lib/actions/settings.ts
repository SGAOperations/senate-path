'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getActiveCycle } from '@/lib/data/cycles';

export interface UpdateSettingsData {
  requiredNominations: number;
  maxCommunityNominations: number;
  endorsementRequired: boolean;
  endorsementsOpen: boolean;
  applicationDeadline: Date | null;
  applicationsOpen: boolean;
  nominationsOpen: boolean;
  customMessage: string | null;
}

export async function updateSettings(data: UpdateSettingsData) {
  try {
    // Check if user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const activeCycle = await getActiveCycle();

    if (!activeCycle.isActive) {
      return { success: false, error: 'Cannot update settings for an inactive cycle' };
    }

    // Prepare settings data
    const settingsData = {
      requiredNominations: data.requiredNominations,
      maxCommunityNominations: data.maxCommunityNominations,
      endorsementRequired: data.endorsementRequired,
      endorsementsOpen: data.endorsementsOpen,
      applicationDeadline: data.applicationDeadline,
      applicationsOpen: data.applicationsOpen,
      nominationsOpen: data.nominationsOpen,
      customMessage: data.customMessage,
    };

    // Only update settings that belong to the active cycle
    const settings = await db.settings.update({
      where: { cycleId: activeCycle.id },
      data: settingsData,
    });

    // Revalidate all pages that might use settings
    revalidatePath('/');
    revalidatePath('/applications');
    revalidatePath('/nominations');
    revalidatePath('/endorsements');
    revalidatePath('/dashboard');
    revalidatePath('/admin');
    revalidatePath('/admin/settings');

    return { success: true, settings };
  } catch (error) {
    console.error('Error updating settings:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}
