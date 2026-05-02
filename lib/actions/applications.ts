'use server';

import { revalidatePath } from 'next/cache';
import { createOrUpdateApplication } from '@/lib/data/applications';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { db } from '@/lib/db';

// Constants
const UPLOAD_FOLDER = 'nomination-forms';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type ApplicationData = {
  nuid: string;
  fullName: string;
  preferredFullName?: string;
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
  communityConstituencyId?: string;
  whySenateLongAnswer: string;
  constituencyIssueLongAnswer: string;
  diversityEquityInclusionLongAnswer: string;
  conflictSituationLongAnswer: string;
  campaignBlurb: string;
  bostonCampus: boolean;
  bostonCampusExplanation?: string;
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
      communityConstituencyId: formData.communityConstituencyId || null,
      whySenateLongAnswer: formData.whySenateLongAnswer,
      constituencyIssueLongAnswer: formData.constituencyIssueLongAnswer,
      diversityEquityInclusionLongAnswer: formData.diversityEquityInclusionLongAnswer,
      conflictSituationLongAnswer: formData.conflictSituationLongAnswer,
      campaignBlurb: formData.campaignBlurb,
      bostonCampus: formData.bostonCampus,
      bostonCampusExplanation: formData.bostonCampusExplanation || null,
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

/**
 * Server action to upload a nomination form PDF and associate it with an application
 * This allows nominees to upload a single PDF containing all required nomination signatures
 */
export async function uploadNominationFormPDF(formData: FormData) {
  try {
    const file = formData.get('pdf') as File;
    const nuid = formData.get('nuid') as string;
    
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    if (!nuid) {
      return {
        success: false,
        error: 'NUID is required'
      };
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return {
        success: false,
        error: 'Only PDF files are allowed'
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File size must be less than 10MB'
      };
    }

    // Verify the application exists
    const application = await db.application.findUnique({
      where: { nuid },
    });

    if (!application) {
      return {
        success: false,
        error: 'No application found for this NUID'
      };
    }

    // Upload to Supabase Storage
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const timestamp = Date.now();
    const uuid = randomUUID();
    const fileName = `${UPLOAD_FOLDER}/${timestamp}-${uuid}.pdf`;

    const { data, error } = await supabase.storage
      .from('applications')
      .upload(fileName, file, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: 'Failed to upload file to storage'
      };
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('applications')
      .getPublicUrl(fileName);

    // Update the application with the PDF URL
    await db.application.update({
      where: { nuid },
      data: { nominationFormPdfUrl: publicUrl },
    });

    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return {
      success: true,
      url: publicUrl
    };
  } catch (error) {
    console.error('Error uploading nomination form PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload nomination form'
    };
  }
}

/**
 * Server action to remove a nomination form PDF from an application
 */
export async function removeNominationFormPDF(nuid: string) {
  try {
    const application = await db.application.findUnique({
      where: { nuid },
      select: { nominationFormPdfUrl: true },
    });

    if (!application) {
      return {
        success: false,
        error: 'No application found for this NUID'
      };
    }

    // Update the application to remove the PDF URL
    await db.application.update({
      where: { nuid },
      data: { nominationFormPdfUrl: null },
    });

    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    console.error('Error removing nomination form PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove nomination form'
    };
  }
}
