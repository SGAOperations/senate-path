'use server';

import { revalidatePath } from 'next/cache';
import {
  createCommunityConstituency,
  updateCommunityConstituency,
  deleteCommunityConstituency,
} from '@/lib/data/community-constituencies';

type CommunityConstituencyFormData = {
  name: string;
  isActive?: boolean;
};

/**
 * Create a new community constituency
 */
export async function addCommunityConstituency(formData: CommunityConstituencyFormData) {
  try {
    await createCommunityConstituency({
      name: formData.name.trim(),
      isActive: formData.isActive ?? true,
    });

    revalidatePath('/admin/community-constituencies');
    revalidatePath('/applications');

    return { success: true };
  } catch (error) {
    console.error('Error creating community constituency:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create community constituency',
    };
  }
}

/**
 * Update an existing community constituency
 */
export async function editCommunityConstituency(
  id: string,
  formData: CommunityConstituencyFormData
) {
  try {
    await updateCommunityConstituency(id, {
      name: formData.name.trim(),
      isActive: formData.isActive,
    });

    revalidatePath('/admin/community-constituencies');
    revalidatePath('/applications');

    return { success: true };
  } catch (error) {
    console.error('Error updating community constituency:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update community constituency',
    };
  }
}

/**
 * Toggle active status of a community constituency
 */
export async function toggleCommunityConstituencyStatus(id: string, isActive: boolean) {
  try {
    await updateCommunityConstituency(id, { isActive });

    revalidatePath('/admin/community-constituencies');
    revalidatePath('/applications');

    return { success: true };
  } catch (error) {
    console.error('Error toggling community constituency status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle status',
    };
  }
}

/**
 * Delete a community constituency
 */
export async function removeCommunityConstituency(id: string) {
  try {
    await deleteCommunityConstituency(id);

    revalidatePath('/admin/community-constituencies');
    revalidatePath('/applications');

    return { success: true };
  } catch (error) {
    console.error('Error deleting community constituency:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete community constituency',
    };
  }
}
