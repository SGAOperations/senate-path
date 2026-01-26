import { getSettings } from '@/lib/data/settings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import EndorsementFormClient from './endorsement-form';

export default async function EndorsementsPage() {
  const settings = await getSettings();
  
  // Check if endorsements are required/enabled
  if (!settings.endorsementRequired) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Endorsements Not Required:</strong> Endorsements are not currently required for this election cycle.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return <EndorsementFormClient />;
}
