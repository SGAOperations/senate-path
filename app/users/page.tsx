import { getUsers } from '@/lib/actions/users';
import UserManagement from '@/components/UserManagement';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { users, error } = await getUsers();

  if (error) {
    return (
      <div className="container max-w-[1600px] mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold">User Management</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading users: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-[1600px] mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage authentication accounts for the admin dashboard
        </p>
      </div>
      <UserManagement initialUsers={users} />
    </div>
  );
}
