'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

const Status = {
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  MANUAL_REVIEW: 'MANUAL_REVIEW',
} as const;

type NominationData = {
  fullName: string;
  email: string;
  nominee: string;
  college: string;
  major: string;
};

export async function createNomination(data: NominationData) {
  try {
    // Map college to constituency
    const collegeToConstituency: Record<string, string> = {
      'College of Arts, Media and Design': 'CAMD',
      "D'Amore-McKim School of Business": 'DMSB',
      'Khoury College of Computer Sciences': 'Khoury',
      'College of Engineering': 'COE',
      'Bouvé College of Health Sciences': 'Bouve',
      'College of Science': 'COS',
      'College of Social Sciences and Humanities': 'CSSH',
    };

    const nominatorConstituency = data.college ? collegeToConstituency[data.college] : undefined;

    // Validate: Can't nominate yourself
    if (data.fullName === data.nominee) {
      throw new Error('You cannot nominate yourself for Senator');
    }

    // Validate: Nominee must exist and be in same constituency
    const nomineeApp = await db.application.findFirst({
      where: { fullName: data.nominee },
      select: { constituency: true },
    });

    if (!nomineeApp) {
      throw new Error(`Nominee ${data.nominee} not found`);
    }

    if (nominatorConstituency && nomineeApp.constituency !== nominatorConstituency) {
      throw new Error('The nominator must belong to the same constituency as the nominee');
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

    // Create nomination
    await db.nomination.create({
      data: {
        ...data,
        status: Status.APPROVED,
      },
    });

    revalidatePath('/nominations');
    revalidatePath('/admin');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error creating nomination:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create nomination'
    };
  }
}
