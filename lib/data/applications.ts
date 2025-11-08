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
  });

  if (!application) {
    return null;
  }

  const nominations = await db.nomination.findMany({
    where: { nominee: application.fullName },
    orderBy: { createdAt: 'desc' },
  });

  const nominationCount = nominations.filter(n => n.status === 'APPROVED').length;

  return {
    ...application,
    nominations,
    nominationCount,
  };
}

export async function getApplicationWithNominations(id: string) {
  const application = await db.application.findUnique({
    where: { id },
  });

  if (!application) {
    return null;
  }

  const nominations = await db.nomination.findMany({
    where: { nominee: application.fullName },
    orderBy: { createdAt: 'desc' },
  });

  const nominationCount = nominations.filter(n => n.status === 'APPROVED').length;

  return {
    ...application,
    nominations,
    nominationCount,
  };
}

export async function getApplicationsWithNominationCounts() {
  const applications = await db.application.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const applicationsWithCounts = await Promise.all(
    applications.map(async (app) => {
      const nominationCount = await db.nomination.count({
        where: {
          nominee: app.fullName,
          status: 'APPROVED',
        },
      });

      return {
        ...app,
        nominationCount,
      };
    })
  );

  return applicationsWithCounts;
}

export async function getNominationFormData() {
  const nominees = await db.application.findMany({
    select: { fullName: true, email: true },
  });

  const constituencies = await db.application.findMany({
    select: { constituency: true },
    distinct: ['constituency'],
  });

  return {
    nominees,
    constituencies: constituencies.map((c) => c.constituency),
  };
}

export async function createOrUpdateApplication(data: Omit<Application, 'id' | 'createdAt'>) {
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
    data,
  });
}

export async function updateApplication(id: string, data: Partial<Application>) {
  return db.application.update({
    where: { id },
    data,
  });
}
