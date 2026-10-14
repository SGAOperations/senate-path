import { z } from 'zod';
import {
  COMMUNITY_CONSTITUENCY_MAX_LENGTH,
  communityConstituencyNameSchema,
} from './community-constituency';

export const nominationSchema = z.object({
  fullName: z.string().min(1, 'Your full name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Valid email is required')
    .refine(
      (email) => email.endsWith('@northeastern.edu'),
      'Email must be a @northeastern.edu address',
    ),
  nominee: z.string().min(1, 'Please select a nominee'),
  college: z.string().min(1, 'Please select your home college'),
  major: z.string().min(1, 'Major is required'),
  constituencyType: z.enum(['academic', 'community']).refine(
    (val) => val === 'academic' || val === 'community',
    { message: 'Please select a constituency type' }
  ),
  communityConstituencyName: z.string().optional(),
}).refine(
  (data) => {
    // If constituency type is community, community constituency must be entered
    if (data.constituencyType === 'community') {
      return communityConstituencyNameSchema.safeParse(
        data.communityConstituencyName ?? '',
      ).success;
    }
    return true;
  },
  {
    message: `Please enter your community constituency (${COMMUNITY_CONSTITUENCY_MAX_LENGTH} characters or fewer)`,
    path: ['communityConstituencyName'],
  }
);

export type NominationFormData = z.infer<typeof nominationSchema>;
