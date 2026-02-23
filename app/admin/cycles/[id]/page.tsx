import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCycleById } from '@/lib/data/cycles';
import {
  getApplicationsWithNominationCountsByCycleId,
  getApplicationWithNominationsByCycleId,
} from '@/lib/data/applications';
import { getNominationsByCycleId } from '@/lib/data/nominations';
import { getEndorsementsByCycleId } from '@/lib/data/endorsements';
import { getSettingsByCycleId } from '@/lib/data/settings';
import { CycleDashboard } from './cycle-dashboard';

interface CyclePageProps {
  params: Promise<{ id: string }>;
}

export default async function CyclePage({ params }: CyclePageProps) {
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
    notFound();
  }

  const [applications, nominations, endorsements, settings] = await Promise.all([
    getApplicationsWithNominationCountsByCycleId(id),
    getNominationsByCycleId(id),
    getEndorsementsByCycleId(id),
    getSettingsByCycleId(id),
  ]);

  return (
    <CycleDashboard
      cycle={cycle}
      applications={applications}
      getApplicationDetails={getApplicationWithNominationsByCycleId.bind(null, id)}
      nominations={nominations}
      endorsements={endorsements}
      settings={settings}
    />
  );
}
