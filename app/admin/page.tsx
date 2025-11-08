import { getApplicationsWithNominationCounts, getApplicationWithNominations } from '@/lib/data/applications';
import AdminDashboard from '@/components/AdminDashboard';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const applications = await getApplicationsWithNominationCounts();

  return (
    <div className="container max-w-[1600px] mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/users">
          <Button variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Manage Users
          </Button>
        </Link>
      </div>
      <AdminDashboard 
        applications={applications} 
        getApplicationDetails={getApplicationWithNominations}
      />
    </div>
  );
}
