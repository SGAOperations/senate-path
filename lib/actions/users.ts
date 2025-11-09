'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type User = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
};

// Get all users
export async function getUsers(): Promise<{ users: User[]; error: string | null }> {
  try {
    // Check if current user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { users: [], error: 'Unauthorized' };
    }

    const adminClient = createAdminClient();
    const { data, error } = await adminClient.auth.admin.listUsers();

    if (error) {
      console.error('Error fetching users:', error);
      return { users: [], error: error.message };
    }

    const users: User[] = data.users.map((user) => ({
      id: user.id,
      email: user.email || '',
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at || null,
    }));

    return { users, error: null };
  } catch (error) {
    console.error('Error in getUsers:', error);
    return { users: [], error: 'Failed to fetch users' };
  }
}

// Create a new user
export async function createUser(email: string, password: string): Promise<{ success: boolean; error: string | null }> {
  try {
    // Check if current user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const adminClient = createAdminClient();
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (error) {
      console.error('Error creating user:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/users');
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in createUser:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

// Delete a user
export async function deleteUser(userId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    // Check if current user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Prevent users from deleting themselves
    if (user.id === userId) {
      return { success: false, error: 'Cannot delete your own account' };
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/users');
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}
