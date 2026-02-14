'use server';

import { db } from '@/lib/db';
import { cache } from 'react';
import { 
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientValidationError
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
 * Default settings to use when database is unavailable or settings don't exist yet
 */
const DEFAULT_SETTINGS: Omit<Settings, 'id' | 'createdAt' | 'updatedAt'> = {
  requiredNominations: 15,
  maxCommunityNominations: 7,
  endorsementRequired: false,
  endorsementsOpen: true,
  applicationDeadline: null,
  applicationsOpen: true,
  nominationsOpen: true,
  customMessage: null,
};

/**
 * Get the application settings. If no settings exist, create default settings.
 * This is cached to reduce database queries.
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
      try {
        settings = await db.settings.create({
          data: DEFAULT_SETTINGS,
        });
        console.log('Default settings created successfully');
      } catch (createError) {
        // If we can't create settings (e.g., database issue during creation),
        // log the error but continue with in-memory defaults
        console.error('Error creating default settings:', createError);
        console.warn('Falling back to in-memory default settings');
        return {
          id: 'default',
          ...DEFAULT_SETTINGS,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }
    
    return settings;
  } catch (error) {
    // Handle different types of Prisma errors
    if (error instanceof PrismaClientInitializationError) {
      console.error('Database connection error:', error.message);
      console.warn('Database is not available. Using in-memory default settings.');
    } else if (error instanceof PrismaClientKnownRequestError) {
      console.error('Database request error:', error.message, error.code);
    } else if (error instanceof PrismaClientValidationError) {
      console.error('Database validation error:', error.message);
    } else {
      console.error('Unexpected error fetching settings:', error);
    }
    
    // Return default settings if database query fails
    return {
      id: 'default',
      ...DEFAULT_SETTINGS,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
});
