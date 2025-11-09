import { getActiveCommunityConstituencies } from '@/lib/data/community-constituencies';
import ApplicationForm from './application-form';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
  const communityConstituencies = await getActiveCommunityConstituencies();

  return <ApplicationForm communityConstituencies={communityConstituencies} />;
}
