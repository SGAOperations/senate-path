import { getActiveApplicationByNuidWithNominations } from '@/lib/data/applications';
import { getSettings } from '@/lib/data/settings';
import UserDashboard from '@/components/UserDashboard';

export default async function DashboardPage() {
  const settings = await getSettings();

  return (
    <div className="container max-w-[1600px] mx-auto py-3 sm:py-6 px-3 sm:px-4">
      <div className="mb-3 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          User Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          View your application status and nomination count
        </p>
      </div>
      <UserDashboard
        getApplicationByNuid={getActiveApplicationByNuidWithNominations}
        settings={settings}
      />
    </div>
  );
}
