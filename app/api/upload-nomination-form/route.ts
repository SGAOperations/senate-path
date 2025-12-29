import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Constants
const UPLOAD_FOLDER = 'nomination-forms';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    // Note: This endpoint uses anonymous Supabase key for public uploads.
    // Security is enforced through:
    // 1. File type validation (PDF only)
    // 2. File size limits (10MB max)
    // 3. Supabase Storage RLS policies (should be configured to allow INSERT on 'applications' bucket)
    // 4. Rate limiting should be configured at the infrastructure level
    // Use anon key directly for public uploads without cookies
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const formData = await request.formData();
    const file = formData.get('pdf') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Generate a unique filename using timestamp and cryptographically secure random UUID
    const timestamp = Date.now();
    const uuid = randomUUID();
    const fileName = `${UPLOAD_FOLDER}/${timestamp}-${uuid}.pdf`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('applications')
      .upload(fileName, file, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      
      // Provide more specific error message for RLS policy issues
      if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
        return NextResponse.json(
          { 
            error: 'Storage bucket not configured correctly. Check that RLS policies allow anonymous INSERT on the "applications" bucket.',
            details: error.message 
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to upload file', details: error.message },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('applications')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
