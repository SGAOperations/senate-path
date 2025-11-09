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

/**
 * Bulk upload community constituencies from CSV
 */
export async function uploadConstituenciesFromCSV(csvContent: string) {
  try {
    // Parse CSV content
    const lines = csvContent.trim().split('\n');
    
    if (lines.length === 0) {
      return {
        success: false,
        error: 'CSV file is empty',
      };
    }

    // Skip header if it exists
    const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;
    const constituencies = lines.slice(startIndex);

    if (constituencies.length === 0) {
      return {
        success: false,
        error: 'No constituencies found in CSV file',
      };
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < constituencies.length; i++) {
      const line = constituencies[i].trim();
      
      // Skip empty lines
      if (!line) continue;

      // Parse CSV line (handle quoted values)
      const name = line.replace(/^["']|["']$/g, '').trim();

      if (!name) {
        errorCount++;
        errors.push(`Line ${i + startIndex + 1}: Empty constituency name`);
        continue;
      }

      try {
        await createCommunityConstituency({
          name,
          isActive: true,
        });
        successCount++;
      } catch (error) {
        errorCount++;
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Line ${i + startIndex + 1} ("${name}"): ${errorMsg}`);
      }
    }

    revalidatePath('/admin/community-constituencies');
    revalidatePath('/applications');

    if (errorCount > 0) {
      return {
        success: false,
        error: `Uploaded ${successCount} constituencies. ${errorCount} failed:\n${errors.join('\n')}`,
        partialSuccess: successCount > 0,
      };
    }

    return {
      success: true,
      message: `Successfully uploaded ${successCount} constituencies`,
    };
  } catch (error) {
    console.error('Error uploading CSV:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload CSV',
    };
  }
}
