import { getSettings } from '@/lib/data/settings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import EndorsementFormClient from './endorsement-form';

export default async function EndorsementsPage() {
  const settings = await getSettings();
  
  // Check if endorsements are closed or not required
  if (settings.endorsementStatus === 'CLOSED') {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Endorsements Closed:</strong> Endorsements are no longer being accepted for this election cycle.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (settings.endorsementStatus === 'NOT_REQUIRED') {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/30">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            <strong>Endorsements Not Required:</strong> Endorsements are not required for this election cycle, but you may still submit one if you wish.
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <EndorsementFormClient />
        </div>
      </div>
    );
  }
  
  return <EndorsementFormClient />;
}
