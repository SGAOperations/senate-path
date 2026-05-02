import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Application } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const applications = await db.application.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Define CSV headers based on Application model fields
    const headers = [
      'NUID',
      'Full Name',
      'Preferred Full Name',
      'Phonetic Pronunciation',
      'Pronouns',
      'Email',
      'Phone Number',
      'College(s)',
      'Major(s)',
      'Minor(s)',
      'Year',
      'Semester',
      'Constituency',
      'Why Senate?',
      'Constituency Issue',
      'Diversity, Equity, & Inclusion',
      'Conflict Situation',
      'Campaign Blurb',
      'Boston Campus Full Term',
      'Boston Campus Explanation',
      'Created At'
    ];

    // Convert applications to CSV rows
    const rows = applications.map((app: Application) => [
      app.nuid || '',
      app.fullName || '',
      app.preferredFullName || '',
      app.phoneticPronunciation || '',
      app.pronouns || '',
      app.email || '',
      app.phoneNumber || '',
      app.college || '',
      app.major || '',
      app.minors || '',
      app.year?.toString() || '',
      app.semester || '',
      app.constituency || '',
      app.whySenateLongAnswer || '',
      app.constituencyIssueLongAnswer || '',
      app.diversityEquityInclusionLongAnswer || '',
      app.conflictSituationLongAnswer || '',
      app.campaignBlurb || '',
      app.bostonCampus ? 'Yes' : 'No',
      app.bostonCampusExplanation || '',
      app.createdAt?.toISOString() || ''
    ]);

    // Escape CSV fields (handle commas, quotes, newlines, and carriage returns)
    const escapeCSVField = (field: string | null | undefined): string => {
      const str = field?.toString() || '';
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Build CSV content
    const csvContent = [
      headers.map(escapeCSVField).join(','),
      ...rows.map((row: (string | null | undefined)[]) =>
        row.map(escapeCSVField).join(',')
      )
    ].join('\n');

    const filename = `applicants_${new Date().toISOString().split('T')[0]}.csv`;

    // Return CSV as downloadable file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting applicants to CSV:', error);
    return NextResponse.json(
      { error: 'Failed to export applicants' },
      { status: 500 }
    );
  }
}
