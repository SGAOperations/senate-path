'use server';

import { db } from '@/lib/db';
import { Application } from '@prisma/client';

export async function getApplications() {
  return db.application.findMany();
}

export async function getApplicationByNuid(nuid: string) {
  return db.application.findUnique({
    where: { nuid },
  });
}

export async function getApplicationByNuidWithNominations(nuid: string) {
  const application = await db.application.findUnique({
    where: { nuid },
    include: {
      communityConstituency: {
        select: { name: true },
      },
    },
  });

  if (!application) {
    return null;
  }

  const nominations = await db.nomination.findMany({
    where: { nominee: application.fullName },
    include: {
      communityConstituency: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const nominationCount = nominations.filter(
    (n) => n.status === 'APPROVED' || n.status === 'PENDING',
  ).length;

  return {
    ...application,
    nominations,
    nominationCount,
  };
}

export async function getApplicationWithNominations(id: string) {
  const application = await db.application.findUnique({
    where: { id },
    include: {
      communityConstituency: {
        select: { name: true },
      },
    },
  });

  if (!application) {
    return null;
  }

  const nominations = await db.nomination.findMany({
    where: { nominee: application.fullName },
    include: {
      communityConstituency: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const endorsements = await db.endorsement.findMany({
    where: { applicantName: application.fullName },
    orderBy: { createdAt: 'desc' },
  });

  const nominationCount = nominations.filter(
    (n) => n.status === 'APPROVED' || n.status === 'PENDING',
  ).length;

  return {
    ...application,
    nominations,
    endorsements,
    nominationCount,
  };
}

export async function getApplicationsWithNominationCounts() {
  const applications = await db.application.findMany({
    include: {
      communityConstituency: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const applicationsWithCounts = await Promise.all(
    applications.map(async (app) => {
      const nominationCount = await db.nomination.count({
        where: {
          nominee: app.fullName,
          status: {
            in: ['APPROVED', 'PENDING'],
          },
        },
      });

      const endorsementCount = await db.endorsement.count({
        where: {
          applicantName: app.fullName,
        },
      });

      return {
        ...app,
        nominationCount,
        endorsementCount,
      };
    }),
  );

  return applicationsWithCounts;
}

export async function getNominationFormData() {
  // Get all nominees (applications)
  const allNominees = await db.application.findMany({
    select: { 
      fullName: true, 
      email: true,
      nominationFormPdfUrl: true 
    },
  });

  // Filter out nominees who have uploaded a paper nomination form
  const nominees = allNominees
    .filter(nominee => !nominee.nominationFormPdfUrl)
    .map(({ fullName, email }) => ({ fullName, email }));

  const constituencies = await db.application.findMany({
    select: { constituency: true },
    distinct: ['constituency'],
  });

  const communityConstituencies = await db.communityConstituency.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return {
    nominees,
    constituencies: constituencies.map((c) => c.constituency),
    communityConstituencies,
  };
}

export async function createOrUpdateApplication(
  data: Omit<Application, 'id' | 'createdAt' | 'nominationFormPdfUrl' | 'cycleId'>,
) {
  const activeCycle = await db.cycle.findFirst({ where: { isActive: true } });
  if (!activeCycle) {
    throw new Error('No active cycle found');
  }

  const existing = await db.application.findUnique({
    where: { nuid: data.nuid },
  });

  if (existing) {
    // Update existing application
    const updated = await db.application.update({
      where: { nuid: data.nuid },
      data,
    });

    // Delete nominations for this applicant when updated
    await db.nomination.deleteMany({
      where: { nominee: data.fullName },
    });

    return updated;
  }

  // Create new application
  return db.application.create({
    data: { ...data, cycleId: activeCycle.id },
  });
}

export async function updateApplication(
  id: string,
  data: Partial<Application>,
) {
  return db.application.update({
    where: { id },
    data,
  });
}
