import { getApplicationsWithNominationCounts, getApplicationWithNominations } from '@/lib/data/applications';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const applications = await getApplicationsWithNominationCounts();

  return (
    <div className="container max-w-[1600px] mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      </div>
      <AdminDashboard 
        applications={applications} 
        getApplicationDetails={getApplicationWithNominations}
      />
    </div>
  );
}
