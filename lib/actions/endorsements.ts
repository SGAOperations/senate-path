'use server';

import { revalidatePath } from 'next/cache';
import { createEndorsement } from '@/lib/data/endorsements';

export async function submitEndorsement(formData: FormData) {
  try {
    const data = {
      endorserName: formData.get('endorserName') as string,
      endorserEmail: formData.get('endorserEmail') as string,
      applicantName: formData.get('applicantName') as string,
      definingTraits: formData.get('definingTraits') as string,
      leadershipQualities: formData.get('leadershipQualities') as string,
      areasForDevelopment: formData.get('areasForDevelopment') as string,
    };

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
