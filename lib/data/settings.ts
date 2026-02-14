'use server';

import { db } from '@/lib/db';
import { cache } from 'react';
import { 
  PrismaClientInitializationError,
} from '@prisma/client/runtime/library';

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
 * Default settings values used when creating initial settings
 */
const DEFAULT_SETTINGS_VALUES = {
  requiredNominations: 15,
  maxCommunityNominations: 7,
  endorsementRequired: false,
  endorsementsOpen: true,
  applicationDeadline: null,
  applicationsOpen: true,
  nominationsOpen: true,
  customMessage: null,
} as const;

/**
 * Get the application settings. If no settings exist, create default settings.
 * This is cached to reduce database queries.
 * 
 * If the database connection fails, this function will throw an error to prevent
 * deployment with an improperly configured database.
 * 
 * Note: This implementation uses findFirst() and assumes a single settings record.
 * While the database schema allows multiple records, the application logic ensures
 * only one record is created and used. If needed, a unique constraint could be added
 * to enforce this at the database level, or we could use a fixed ID.
 */
export const getSettings = cache(async (): Promise<Settings> => {
  try {
    // Try to get the first settings record
    let settings = await db.settings.findFirst();
    
    // If no settings exist, create default settings
    if (!settings) {
      console.log('No settings found in database, creating default settings...');
      settings = await db.settings.create({
        data: DEFAULT_SETTINGS_VALUES,
      });
      console.log('Default settings created successfully');
    }
    
    return settings;
  } catch (error) {
    // Check if this is a database connection error
    const isDatabaseConnectionError = 
      error instanceof PrismaClientInitializationError ||
      (error && typeof error === 'object' && 'name' in error && error.name === 'PrismaClientInitializationError');
    
    if (isDatabaseConnectionError) {
      console.error('FATAL: Database connection failed. Cannot proceed with deployment.');
      console.error('Database error:', (error as Error).message);
      console.error('Please ensure the database is configured correctly and accessible.');
      // Re-throw the error to fail the deployment
      throw error;
    }
    
    // For other errors, log and re-throw
    console.error('Error fetching settings:', error);
    throw error;
  }
});
