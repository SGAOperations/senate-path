'use server';

import { revalidatePath } from 'next/cache';
import { createNomination } from '@/lib/data/nominations';

export async function submitNomination(formData: FormData) {
  try {
    const data = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      nominee: formData.get('nominee') as string,
      college: formData.get('college') as string,
      major: formData.get('major') as string,
      graduationYear: null,
      constituency: null,
      receiveSenatorInfo: null,
    };

    await createNomination(data);
    revalidatePath('/nominations');
    revalidatePath('/admin');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting nomination:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit nomination' 
    };
  }
}
