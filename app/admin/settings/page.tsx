import { getSettings, getSettingsByCycleId } from '@/lib/data/settings';
import { getCycleById } from '@/lib/data/cycles';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsForm from './settings-form';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ cycleId?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { cycleId } = await searchParams;

  let settings;
  let isReadOnly = false;

  if (cycleId) {
    const cycle = await getCycleById(cycleId);
    if (!cycle) {
      redirect('/admin/settings');
    }
    isReadOnly = !cycle.isActive;
    settings = await getSettingsByCycleId(cycleId);
    if (!settings) {
      // Inactive cycle with no settings - redirect back to avoid confusion
      redirect('/admin/settings');
    }
  } else {
    settings = await getSettings();
  }

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
      <SettingsForm settings={settings} isReadOnly={isReadOnly} />
    </div>
  );
}
