'use server';

import { db } from '@/lib/db';

export interface Settings {
  id: string;
  requiredNominations: number;
  maxCommunityNominations: number;
  endorsementRequired: boolean;
  endorsementsOpen: boolean;
  applicationDeadline: Date | null;
  applicationsOpen: boolean;
  nominationsOpen: boolean;
  customMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get the application settings. If no settings exist, create default settings.
 * 
 * Note: This implementation uses findFirst() and assumes a single settings record.
 * While the database schema allows multiple records, the application logic ensures
 * only one record is created and used. If needed, a unique constraint could be added
 * to enforce this at the database level, or we could use a fixed ID.
 */
export async function getSettings(): Promise<Settings> {
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
          endorsementsOpen: true,
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
      endorsementsOpen: true,
      applicationDeadline: null,
      applicationsOpen: true,
      nominationsOpen: true,
      customMessage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
