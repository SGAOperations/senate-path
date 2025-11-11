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
      'College of Arts, Media and Design': 'College of Arts, Media and Design',
      "D'Amore-McKim School of Business": "D'Amore-McKim School of Business",
      'Khoury College of Computer Sciences': 'Khoury College of Computer Sciences',
      'College of Engineering': 'College of Engineering',
      'Bouvé College of Health Sciences': 'Bouvé College of Health Sciences',
      'College of Science': 'College of Science',
      'College of Social Sciences and Humanities': 'College of Social Sciences and Humanities',
      'Explore Program': 'Explore Program',
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

    // Create nomination with PENDING status
    await db.nomination.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });

    revalidatePath('/nominations');
    revalidatePath('/admin');
    revalidatePath('/admin/nominations');
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

export async function approveNomination(id: string) {
  try {
    await db.nomination.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/nominations');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error approving nomination:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to approve nomination'
    };
  }
}

export async function rejectNomination(id: string) {
  try {
    await db.nomination.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/nominations');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error rejecting nomination:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reject nomination'
    };
  }
}

export async function bulkApproveNominations(ids: string[]) {
  try {
    await db.nomination.updateMany({
      where: { id: { in: ids } },
      data: { status: 'APPROVED' },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/nominations');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error bulk approving nominations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to approve nominations'
    };
  }
}

export async function bulkRejectNominations(ids: string[]) {
  try {
    await db.nomination.updateMany({
      where: { id: { in: ids } },
      data: { status: 'REJECTED' },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/nominations');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error bulk rejecting nominations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reject nominations'
    };
  }
}
