import { getSettings } from '@/lib/data/settings';
import { getActiveCycleOrNull } from '@/lib/data/cycles';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import NominationsPageClient from './nominations-form';

export default async function NominationsPage() {
  const activeCycle = await getActiveCycleOrNull();

  if (!activeCycle) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>No Active Cycle:</strong> There is no active election cycle configured. Please contact an administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const settings = await getSettings();
  
  return <NominationsPageClient nominationsOpen={settings.nominationsOpen} />;
}
