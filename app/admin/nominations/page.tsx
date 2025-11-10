import { getAllNominations } from '@/lib/data/nominations';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import NominationsManager from '@/components/NominationsManager';

export default async function NominationsAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const nominations = await getAllNominations();

  return (
    <div className="container max-w-[1600px] mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">Manage Nominations</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve or reject nominations submitted by constituents.
        </p>
      </div>
      <NominationsManager nominations={nominations} />
    </div>
  );
}
