'use server';

import { getApplications } from '@/lib/data/applications';

export async function exportApplicantsToCSV() {
  try {
    const applications = await getApplications();

    // Define CSV headers based on Application model fields
    const headers = [
      'NUID',
      'Full Name',
      'Preferred Full Name',
      'Nickname',
      'Phonetic Pronunciation',
      'Pronouns',
      'Email',
      'Phone Number',
      'College',
      'Major',
      'Minors',
      'Year',
      'Semester',
      'Constituency',
      'Created At'
    ];

    // Convert applications to CSV rows
    const rows = applications.map(app => [
      app.nuid || '',
      app.fullName || '',
      app.preferredFullName || '',
      app.nickname || '',
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
      app.createdAt?.toISOString() || ''
    ]);

    // Escape CSV fields (handle commas and quotes)
    const escapeCSVField = (field: string | null | undefined): string => {
      const str = field?.toString() || '';
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Build CSV content
    const csvContent = [
      headers.map(escapeCSVField).join(','),
      ...rows.map(row => row.map(escapeCSVField).join(','))
    ].join('\n');

    return {
      success: true,
      data: csvContent,
      filename: `applicants_${new Date().toISOString().split('T')[0]}.csv`
    };
  } catch (error) {
    console.error('Error exporting applicants to CSV:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export applicants'
    };
  }
}
