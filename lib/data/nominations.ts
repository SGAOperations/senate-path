'use server';

import { db } from '@/lib/db';
import { Nomination } from '@prisma/client';

const Status = {
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  MANUAL_REVIEW: 'MANUAL_REVIEW',
} as const;

export async function getNominations() {
  return db.nomination.findMany();
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
    select: { nominee: true, constituency: true },
  });

  if (nominations.length === 0) {
    return [];
  }

  const voteCounts: Record<string, { count: number; constituency: string | null }> = {};
  
  for (const { nominee, constituency } of nominations) {
    if (!nominee) continue;
    if (!voteCounts[nominee]) {
      voteCounts[nominee] = { count: 0, constituency };
    }
    voteCounts[nominee].count += 1;
  }

  return Object.entries(voteCounts)
    .filter(([_, { count }]) => count >= minVotes)
    .map(([nominee, { count, constituency }]) => ({
      nominee,
      constituency,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function createNomination(data: Omit<Nomination, 'id' | 'createdAt' | 'status'>) {
  // Validate: Can't nominate yourself
  if (data.fullName === data.nominee) {
    throw new Error('You cannot nominate yourself for Senator');
  }

  // Validate: Nominee must exist and be in same constituency
  const nomineeApp = await db.application.findFirst({
    where: { fullName: data.nominee || undefined },
    select: { constituency: true },
  });

  if (!nomineeApp) {
    throw new Error(`Nominee ${data.nominee} not found`);
  }

  if (nomineeApp.constituency !== data.constituency) {
    throw new Error('The nominator must belong to the same constituency as the nominee');
  }

  // Check if already nominated
  const existing = await db.nomination.findFirst({
    where: {
      email: data.email || undefined,
      nominee: data.nominee,
    },
  });

  if (existing) {
    throw new Error(`This nominator has already nominated ${data.nominee}`);
  }

  // Create nomination
  return db.nomination.create({
    data: {
      ...data,
      status: Status.APPROVED,
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
