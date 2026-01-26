'use server';

import { db } from '@/lib/db';
import { cache } from 'react';

export interface Settings {
  id: string;
  requiredNominations: number;
  maxCommunityNominations: number;
  endorsementRequired: boolean;
  applicationDeadline: Date | null;
  applicationsOpen: boolean;
  nominationsOpen: boolean;
  customMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get the application settings. If no settings exist, create default settings.
 * This is cached to reduce database queries.
 */
export const getSettings = cache(async (): Promise<Settings> => {
  try {
    // Try to get the first settings record
    let settings = await db.settings.findFirst();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await db.settings.create({
        data: {
          requiredNominations: 15,
          maxCommunityNominations: 7,
          endorsementRequired: false,
          applicationsOpen: true,
          nominationsOpen: true,
        },
      });
    }
    
    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Return default settings if database query fails
    return {
      id: 'default',
      requiredNominations: 15,
      maxCommunityNominations: 7,
      endorsementRequired: false,
      applicationDeadline: null,
      applicationsOpen: true,
      nominationsOpen: true,
      customMessage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
});
