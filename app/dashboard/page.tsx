import { getApplicationByNuidWithNominations } from '@/lib/data/applications';
import UserDashboard from '@/components/UserDashboard';

export default function DashboardPage() {
  return (
    <div className="container max-w-[1600px] mx-auto py-4 sm:py-6 px-4">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">User Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">View your application status and nomination count</p>
      </div>
      <UserDashboard getApplicationByNuid={getApplicationByNuidWithNominations} />
    </div>
  );
}
