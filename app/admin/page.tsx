import {
  getApplicationsWithNominationCounts,
  getApplicationWithNominations,
} from '@/lib/data/applications';
import { getSettings } from '@/lib/data/settings';
import { getActiveCycle } from '@/lib/data/cycles';
import AdminDashboard from '@/components/AdminDashboard';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [applications, settings, activeCycle] = await Promise.all([
    getApplicationsWithNominationCounts(),
    getSettings(),
    getActiveCycle(),
  ]);

  return (
    <div className="container max-w-[1600px] mx-auto py-3 sm:py-6 px-3 sm:px-4">
      <div className="mb-3 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeCycle.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/settings">
            <Button variant="default">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Link href="/admin/nominations">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Manage Nominations
            </Button>
          </Link>
          <Link href="/admin/community-constituencies">
            <Button variant="outline" className="w-full sm:w-auto">
              <Settings className="h-4 w-4 mr-2" />
              Manage Community Constituencies
            </Button>
          </Link>
        </div>
      </div>
      <AdminDashboard
        applications={applications}
        getApplicationDetails={getApplicationWithNominations}
        settings={settings}
      />
    </div>
  );
}
