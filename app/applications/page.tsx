import { getActiveCommunityConstituencies } from '@/lib/data/community-constituencies';
import { getSettings } from '@/lib/data/settings';
import { redirect } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import ApplicationForm from './application-form';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
  const settings = await getSettings();
  const communityConstituencies = await getActiveCommunityConstituencies();

  // Check if applications are closed
  const now = new Date();
  const deadlinePassed = settings.applicationDeadline && new Date(settings.applicationDeadline) < now;
  
  if (!settings.applicationsOpen || deadlinePassed) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Applications Closed:</strong>{' '}
            {deadlinePassed
              ? 'The application deadline has passed. Applications are no longer being accepted.'
              : 'Applications are currently closed. Please check back later.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <ApplicationForm communityConstituencies={communityConstituencies} />;
}