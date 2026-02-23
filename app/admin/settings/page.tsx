import { getSettings } from '@/lib/data/settings';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsForm from './settings-form';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const settings = await getSettings();

  return (
    <div className="container max-w-4xl mx-auto py-3 sm:py-6 px-3 sm:px-4">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Application Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure the application and nomination process settings
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
