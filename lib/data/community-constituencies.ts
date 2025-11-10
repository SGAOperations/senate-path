'use server';

import { db } from '@/lib/db';
import { CommunityConstituency } from '@prisma/client';

/**
 * Get all community constituencies
 */
export async function getCommunityConstituencies() {
  return db.communityConstituency.findMany({
    orderBy: { name: 'asc' },
  });
}

/**
 * Get all active community constituencies (for dropdown)
 */
export async function getActiveCommunityConstituencies() {
  return db.communityConstituency.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
}

/**
 * Get a single community constituency by ID
 */
export async function getCommunityConstituencyById(id: string) {
  return db.communityConstituency.findUnique({
    where: { id },
  });
}

/**
 * Create a new community constituency
 */
export async function createCommunityConstituency(
  data: Omit<CommunityConstituency, 'id' | 'createdAt' | 'updatedAt'>
) {
  return db.communityConstituency.create({
    data,
  });
}

/**
 * Update a community constituency
 */
export async function updateCommunityConstituency(
  id: string,
  data: Partial<Omit<CommunityConstituency, 'id' | 'createdAt' | 'updatedAt'>>
) {
  return db.communityConstituency.update({
    where: { id },
    data,
  });
}

/**
 * Delete a community constituency
 */
export async function deleteCommunityConstituency(id: string) {
  return db.communityConstituency.delete({
    where: { id },
  });
}
