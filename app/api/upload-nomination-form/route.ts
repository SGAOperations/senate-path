import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
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

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Generate a unique filename using timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `nomination-forms/${timestamp}-${randomString}.pdf`;

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
