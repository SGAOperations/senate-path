import { z } from 'zod';

export const COMMUNITY_CONSTITUENCY_MAX_LENGTH = 100;

// Free-text community constituency. Admins review these by hand, so this only
// guards against empty and oversized input.
export const communityConstituencyNameSchema = z
  .string()
  .trim()
  .min(1, 'Please enter your community constituency')
  .max(
    COMMUNITY_CONSTITUENCY_MAX_LENGTH,
    `Community constituency must be ${COMMUNITY_CONSTITUENCY_MAX_LENGTH} characters or fewer`,
  );

export function getCommunityConstituencyName(record: {
  communityConstituencyName?: string | null;
  communityConstituency?: { name: string } | null;
}) {
  // Legacy records link to a preset constituency instead of storing a name
  return record.communityConstituencyName || record.communityConstituency?.name || null;
}
