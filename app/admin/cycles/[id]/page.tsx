import { getCycleById } from '@/lib/data/cycles';
import { getSettingsByCycleId } from '@/lib/data/settings';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SettingsForm from '@/app/admin/settings/settings-form';

export default async function CycleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { id } = await params;

  const cycle = await getCycleById(id);
  if (!cycle) {
    redirect('/admin/cycles');
  }

  const settings = await getSettingsByCycleId(id);
  if (!settings) {
    throw new Error(`Settings not found for cycle ${id}. All cycles should have a settings record.`);
  }

  const isReadOnly = !cycle.isActive;

  return (
    <div className="container max-w-4xl mx-auto py-3 sm:py-6 px-3 sm:px-4">
      <div className="mb-6">
        <Link href="/admin/cycles">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cycles
          </Button>
        </Link>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{cycle.name}</h1>
        <p className="text-muted-foreground mt-2">
          {isReadOnly
            ? 'Viewing settings for this inactive cycle.'
            : 'Configure the application and nomination process settings for this cycle.'}
        </p>
      </div>
      <SettingsForm settings={settings} isReadOnly={isReadOnly} />
    </div>
  );
}
