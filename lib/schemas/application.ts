import { z } from 'zod';
import { communityConstituencyNameSchema } from './community-constituency';

export const applicationSchema = z
  .object({
    nuid: z
      .string()
      .min(9, 'NUID must be 9 digits')
      .max(9, 'NUID must be 9 digits'),
    fullName: z.string().min(1, 'Full name is required'),
    preferredFullName: z.string().optional(),
    phoneticPronunciation: z
      .string()
      .min(1, 'Phonetic pronunciation of last name is required'),
    pronunciationAudioUrl: z.string().optional(),
    pronouns: z.string().min(1, 'Pronouns are required'),
    email: z
      .string()
      .email('Please enter a valid email address')
      .refine((email) => email.endsWith('@northeastern.edu'), {
        message: 'Email must be a Northeastern email (@northeastern.edu)',
      }),
    phoneNumber: z.string().min(10, 'Valid phone number is required'),
    college: z.array(z.string()).min(1, 'Please select at least one college'),
    major: z.string().min(1, 'Major is required'),
    minors: z.string().optional(),
    year: z.string().min(1, 'Please select your year'),
    constituency: z.string().min(1, 'Please select your constituency'),
    communityConstituencyName: communityConstituencyNameSchema,
    whySenateLongAnswer: z
      .string()
      .min(50, 'Please provide a detailed response (at least 50 characters)'),
    constituencyIssueLongAnswer: z
      .string()
      .min(50, 'Please provide a detailed response (at least 50 characters)'),
    diversityEquityInclusionLongAnswer: z
      .string()
      .min(50, 'Please provide a detailed response (at least 50 characters)'),
    conflictSituationLongAnswer: z
      .string()
      .min(50, 'Please provide a detailed response (at least 50 characters)'),
    campaignBlurb: z
      .string()
      .min(50, 'Please provide a detailed response (at least 50 characters)'),
  })
  .refine(
    (data) => {
      // Constituency must be one of the selected colleges
      return data.college.includes(data.constituency);
    },
    {
      message: 'Constituency must be one of the selected colleges',
      path: ['constituency'],
    },
  );

export type ApplicationFormData = z.infer<typeof applicationSchema>;
