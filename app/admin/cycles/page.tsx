import { getCycles } from '@/lib/data/cycles';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function CyclesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const cycles = await getCycles();

  return (
    <div className="container max-w-[1600px] mx-auto py-3 sm:py-6 px-3 sm:px-4">
      <div className="mb-3 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">All Cycles</h1>
        <Link href="/admin">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <div className="grid gap-4">
        {cycles.length === 0 ? (
          <p className="text-muted-foreground">No cycles found.</p>
        ) : (
          cycles.map((cycle: Awaited<ReturnType<typeof getCycles>>[number]) => (
            <Card key={cycle.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">{cycle.name}</CardTitle>
                  {cycle.isActive && (
                    <Badge variant="success">Active</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(cycle.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
