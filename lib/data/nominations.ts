'use server';

import { db } from '@/lib/db';
import { Nomination } from '@prisma/client';
import { getActiveCycle } from '@/lib/data/cycles';

const Status = {
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  MANUAL_REVIEW: 'MANUAL_REVIEW',
} as const;

export async function getNominationsByCycleId(cycleId: string) {
  return db.nomination.findMany({
    where: { cycleId },
    include: {
      communityConstituency: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllNominations() {
  return db.nomination.findMany({
    include: {
      communityConstituency: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getNominationsByStatus(status: 'PENDING' | 'APPROVED' | 'REJECTED') {
  return db.nomination.findMany({
    where: { status },
    include: {
      communityConstituency: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getNominationsByNuid(nuid: string) {
  const application = await db.application.findUnique({
    where: { nuid },
    select: { fullName: true },
  });

  if (!application) {
    throw new Error(`No application found for NUID ${nuid}`);
  }

  const count = await db.nomination.count({
    where: {
      nominee: application.fullName,
      status: Status.APPROVED,
    },
  });

  return count;
}

export async function getNominationsByName(name: string) {
  return db.nomination.count({
    where: {
      nominee: name,
      status: Status.APPROVED,
    },
  });
}

export async function getNominationsByEmail(email: string) {
  return db.nomination.findMany({
    where: { email },
  });
}

export async function getUniqueNominees() {
  const applicants = await db.application.findMany({
    select: { id: true, fullName: true },
    orderBy: { createdAt: 'desc' },
  });

  const uniqueNominees = new Map<string, string>();
  for (const applicant of applicants) {
    if (!uniqueNominees.has(applicant.fullName)) {
      uniqueNominees.set(applicant.fullName, applicant.fullName);
    }
  }

  return Array.from(uniqueNominees.values());
}

export async function getNomineesWithMinVotes(minVotes: number) {
  const nominations = await db.nomination.findMany({
    select: { nominee: true },
  });

  if (nominations.length === 0) {
    return [];
  }

  const voteCounts: Record<string, number> = {};

  for (const { nominee } of nominations) {
    if (!nominee) continue;
    if (!voteCounts[nominee]) {
      voteCounts[nominee] = 0;
    }
    voteCounts[nominee] += 1;
  }

  return Object.entries(voteCounts)
    .filter(([_, count]) => count >= minVotes)
    .map(([nominee, count]) => ({
      nominee,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function createNomination(data: Omit<Nomination, 'id' | 'createdAt' | 'status' | 'cycleId'>) {
  // Validate: Can't nominate yourself
  if (data.fullName === data.nominee) {
    throw new Error('You cannot nominate yourself for Senator');
  }

  // Validate: Nominee must exist
  const nomineeApp = await db.application.findFirst({
    where: { fullName: data.nominee },
    select: { constituency: true },
  });

  if (!nomineeApp) {
    throw new Error(`Nominee ${data.nominee} not found`);
  }

  // Check if already nominated
  const existing = await db.nomination.findFirst({
    where: {
      email: data.email,
      nominee: data.nominee,
    },
  });

  if (existing) {
    throw new Error(`This nominator has already nominated ${data.nominee}`);
  }

  const activeCycle = await getActiveCycle();

  // Create nomination
  return db.nomination.create({
    data: {
      ...data,
      status: Status.APPROVED,
      cycleId: activeCycle.id,
    },
  });
}

export async function updateNomination(id: string, data: Partial<Nomination>) {
  return db.nomination.update({
    where: { id },
    data,
  });
}

export async function deleteNominationsForNominee(nominee: string) {
  return db.nomination.deleteMany({
    where: { nominee },
  });
}
