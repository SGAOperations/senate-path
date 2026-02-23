'use server';

import { db } from '@/lib/db';
import { getActiveCycle } from '@/lib/data/cycles';

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
  cycleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getSettingsByCycleId(cycleId: string): Promise<Settings | null> {
  return db.settings.findUnique({
    where: { cycleId },
  });
}

export async function getSettings(): Promise<Settings> {
  const activeCycle = await getActiveCycle();

  // Use upsert to atomically get or create settings for the active cycle
  const settings = await db.settings.upsert({
    where: { cycleId: activeCycle.id },
    update: {},
    create: {
      requiredNominations: 15,
      maxCommunityNominations: 7,
      endorsementRequired: false,
      endorsementsOpen: true,
      applicationDeadline: null,
      applicationsOpen: true,
      nominationsOpen: true,
      customMessage: null,
      cycleId: activeCycle.id,
    },
  });

  return settings;
}

export async function getSettingsByCycleId(cycleId: string): Promise<Settings | null> {
  return db.settings.findUnique({
    where: { cycleId },
  });
}
