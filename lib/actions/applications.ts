'use server';

import { revalidatePath } from 'next/cache';
import { createOrUpdateApplication } from '@/lib/data/applications';

type ApplicationData = {
  nuid: string;
  fullName: string;
  preferredFullName?: string;
  nickname?: string;
  phoneticPronunciation: string;
  pronunciationAudioUrl: string;
  pronouns: string;
  email: string;
  phoneNumber: string;
  college: string[];
  major: string;
  minors?: string;
  year: string;
  constituency: string;
  whySenateLongAnswer: string;
  constituencyIssueLongAnswer: string;
  diversityEquityInclusionLongAnswer: string;
  conflictSituationLongAnswer: string;
};

export async function submitApplication(formData: ApplicationData) {
  try {
    // Map year names to numbers for database storage
    const yearMap: { [key: string]: number } = {
      '1st year': 1,
      '2nd year': 2,
      '3rd year': 3,
      '4th year': 4,
      '5th+ year': 5,
    };
    
    if (!(formData.year in yearMap)) {
      throw new Error('Invalid year value');
    }
    
    const year = yearMap[formData.year];
    
    const data = {
      nuid: formData.nuid,
      fullName: formData.fullName,
      preferredFullName: formData.preferredFullName || '',
      nickname: formData.nickname || '',
      phoneticPronunciation: formData.phoneticPronunciation,
      pronunciationAudioUrl: formData.pronunciationAudioUrl,
      pronouns: formData.pronouns,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      college: formData.college.join(', '),
      major: formData.major,
      minors: formData.minors || '',
      year,
      semester: '',
      constituency: formData.constituency,
      whySenateLongAnswer: formData.whySenateLongAnswer,
      constituencyIssueLongAnswer: formData.constituencyIssueLongAnswer,
      diversityEquityInclusionLongAnswer: formData.diversityEquityInclusionLongAnswer,
      conflictSituationLongAnswer: formData.conflictSituationLongAnswer,
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
