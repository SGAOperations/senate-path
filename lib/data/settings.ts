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

// Fixed ID for the singleton settings record
const SETTINGS_ID = 'default';

export async function getSettings(): Promise<Settings> {
  // Use upsert to atomically get or create settings
  const settings = await db.settings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: {
      id: SETTINGS_ID,
      requiredNominations: 15,
      maxCommunityNominations: 7,
      endorsementRequired: false,
      endorsementsOpen: true,
      applicationDeadline: null,
      applicationsOpen: true,
      nominationsOpen: true,
      customMessage: null,
    },
  });

  return settings;
}
