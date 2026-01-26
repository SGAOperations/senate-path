'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface UpdateSettingsData {
  requiredNominations: number;
  maxCommunityNominations: number;
  endorsementRequired: boolean;
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

    // Get or create settings
    let settings = await db.settings.findFirst();
    
    if (!settings) {
      // Create new settings
      settings = await db.settings.create({
        data: {
          requiredNominations: data.requiredNominations,
          maxCommunityNominations: data.maxCommunityNominations,
          endorsementRequired: data.endorsementRequired,
          applicationDeadline: data.applicationDeadline,
          applicationsOpen: data.applicationsOpen,
          nominationsOpen: data.nominationsOpen,
          customMessage: data.customMessage,
        },
      });
    } else {
      // Update existing settings
      settings = await db.settings.update({
        where: { id: settings.id },
        data: {
          requiredNominations: data.requiredNominations,
          maxCommunityNominations: data.maxCommunityNominations,
          endorsementRequired: data.endorsementRequired,
          applicationDeadline: data.applicationDeadline,
          applicationsOpen: data.applicationsOpen,
          nominationsOpen: data.nominationsOpen,
          customMessage: data.customMessage,
        },
      });
    }

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
