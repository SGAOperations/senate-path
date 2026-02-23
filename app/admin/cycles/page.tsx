import { getCycles } from '@/lib/data/cycles';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CyclesManager from './cycles-manager';

export default async function CyclesAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const cycles = await getCycles();

  return (
    <div className="container max-w-4xl mx-auto py-3 sm:py-6 px-3 sm:px-4">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Manage Cycles</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage election cycles. Each cycle has its own settings.
        </p>
      </div>
      <CyclesManager cycles={cycles} />
    </div>
  );
}
