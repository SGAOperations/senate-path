'use server';

import { revalidatePath } from 'next/cache';
import { createEndorsement } from '@/lib/data/endorsements';

type EndorsementData = {
  endorserName: string;
  endorserEmail: string;
  applicantName: string;
  definingTraits: string;
  leadershipQualities: string;
  areasForDevelopment: string;
};

export async function submitEndorsement(data: EndorsementData) {
  try {
    await createEndorsement(data);
    revalidatePath('/endorsements');
    revalidatePath('/admin');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting endorsement:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit endorsement' 
    };
  }
}
