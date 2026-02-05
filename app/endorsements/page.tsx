import { getSettings } from '@/lib/data/settings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import EndorsementFormClient from './endorsement-form';

export default async function EndorsementsPage() {
  const settings = await getSettings();
  
  // Check if endorsements are closed (endorsementsOpen = false)
  if (!settings.endorsementsOpen) {
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
  
  // Check if endorsements are not required - form should NOT be accessible
  if (!settings.endorsementRequired) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Endorsements Not Required:</strong> Endorsements are not required for this election cycle and the form is not available.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return <EndorsementFormClient />;
}
