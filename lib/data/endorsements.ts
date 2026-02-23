'use server';

import { db } from '@/lib/db';
import { Endorsement } from '@prisma/client';
import { getActiveCycle } from '@/lib/data/cycles';

export async function getEndorsements() {
  return db.endorsement.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getEndorsementsByApplicant(applicantName: string) {
  return db.endorsement.findMany({
    where: { applicantName },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getEndorsementsByEmail(email: string) {
  return db.endorsement.findMany({
    where: { endorserEmail: email },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createEndorsement(data: Omit<Endorsement, 'id' | 'createdAt' | 'cycleId'>) {
  // Validate: Applicant must exist
  const applicant = await db.application.findFirst({
    where: { fullName: data.applicantName },
  });

  if (!applicant) {
    throw new Error(`Applicant ${data.applicantName} not found`);
  }

  // Check if this endorser has already endorsed this applicant
  const existing = await db.endorsement.findFirst({
    where: {
      endorserEmail: data.endorserEmail,
      applicantName: data.applicantName,
    },
  });

  if (existing) {
    throw new Error(`You have already endorsed ${data.applicantName}`);
  }

  const activeCycle = await getActiveCycle();

  // Create endorsement
  return db.endorsement.create({
    data: { ...data, cycleId: activeCycle.id },
  });
}

export async function updateEndorsement(id: string, data: Partial<Endorsement>) {
  return db.endorsement.update({ where: { id }, data });
}

export async function deleteEndorsement(id: string) {
  return db.endorsement.delete({ where: { id } });
}
