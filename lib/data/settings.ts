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

export async function getSettings(): Promise<Settings> {
  let settings = await db.settings.findFirst();

  if (!settings) {
    settings = await db.settings.create({
      data: {
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
  }

  return settings;
}
