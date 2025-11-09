import { getCommunityConstituencies } from '@/lib/data/community-constituencies';
import CommunityConstituencyManager from '@/components/CommunityConstituencyManager';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function CommunityConstituenciesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const constituencies = await getCommunityConstituencies();

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">Community Constituencies</h1>
        <p className="text-muted-foreground mt-2">
          Manage community constituency options for the application form
        </p>
      </div>
      <CommunityConstituencyManager constituencies={constituencies} />
    </div>
  );
}
