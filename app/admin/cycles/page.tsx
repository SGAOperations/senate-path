import { getCyclesWithCounts } from '@/lib/data/cycles';
import CyclesManager from '@/components/CyclesManager';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function CyclesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const cycles = await getCyclesWithCounts();

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">Cycle Management</h1>
        <p className="text-muted-foreground mt-2">
          View all cycles, create new cycles, and set which cycle is active
        </p>
      </div>
      <CyclesManager cycles={cycles} />
    </div>
  );
}
