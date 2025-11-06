'use server';

import { revalidatePath } from 'next/cache';
import { createOrUpdateApplication } from '@/lib/data/applications';

export async function submitApplication(formData: FormData) {
  try {
    const yearValue = formData.get('year') as string;
    // Map year names to numbers for database storage
    const yearMap: { [key: string]: number } = {
      '1st year': 1,
      '2nd year': 2,
      '3rd year': 3,
      '4th year': 4,
      '5th+ year': 5,
    };
    
    if (!(yearValue in yearMap)) {
      throw new Error('Invalid year value');
    }
    
    const year = yearMap[yearValue];
    
    const data = {
      nuid: formData.get('nuid') as string,
      fullName: formData.get('fullName') as string,
      preferredFullName: (formData.get('preferredFullName') as string) || '',
      nickname: (formData.get('nickname') as string) || '',
      phoneticPronunciation: (formData.get('phoneticPronunciation') as string) || '',
      pronouns: (formData.get('pronouns') as string) || '',
      email: formData.get('email') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      college: formData.get('college') as string,
      major: formData.get('major') as string,
      minors: (formData.get('minors') as string) || '',
      year,
      semester: '',
      constituency: formData.get('constituency') as string,
    };

    await createOrUpdateApplication(data);
    revalidatePath('/applications');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting application:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit application' 
    };
  }
}
