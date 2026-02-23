'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createCycleAndSetActive, setActiveCycle } from '@/lib/actions/cycles';
import { toast } from 'sonner';
import { Loader2, Plus, CheckCircle, AlertCircle } from 'lucide-react';

interface Cycle {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
}

interface CyclesManagerProps {
  cycles: Cycle[];
}

export default function CyclesManager({ cycles }: CyclesManagerProps) {
  const router = useRouter();
  const [newCycleName, setNewCycleName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newCycleName.trim()) {
      setError('Cycle name is required');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const result = await createCycleAndSetActive(newCycleName.trim());

      if (result.success) {
        toast.success('Cycle created and set as active!');
        setNewCycleName('');
        router.refresh();
      } else {
        setError(result.error || 'Failed to create cycle');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSetActive = async (cycleId: string) => {
    setActivatingId(cycleId);
    setError(null);

    try {
      const result = await setActiveCycle(cycleId);

      if (result.success) {
        toast.success('Cycle set as active!');
        router.refresh();
      } else {
        setError(result.error || 'Failed to set active cycle');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Create New Cycle */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Cycle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cycleName">Cycle Name</Label>
            <div className="flex gap-3">
              <Input
                id="cycleName"
                placeholder="e.g. Spring 2025"
                value={newCycleName}
                onChange={(e) => setNewCycleName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                }}
                disabled={isCreating}
                className="max-w-sm"
              />
              <Button onClick={handleCreate} disabled={isCreating || !newCycleName.trim()}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create & Set Active
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Creating a new cycle will set it as the active cycle and create default settings.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Existing Cycles */}
      <Card>
        <CardHeader>
          <CardTitle>All Cycles</CardTitle>
        </CardHeader>
        <CardContent>
          {cycles.length === 0 ? (
            <p className="text-muted-foreground">No cycles found. Create one above.</p>
          ) : (
            <div className="space-y-3">
              {cycles.map((cycle) => (
                <div
                  key={cycle.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {cycle.isActive && (
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">{cycle.name}</span>
                        {cycle.isActive && (
                          <Badge variant="success" className="text-xs">Active</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(cycle.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!cycle.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetActive(cycle.id)}
                        disabled={activatingId === cycle.id}
                      >
                        {activatingId === cycle.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Activating...
                          </>
                        ) : (
                          'Set Active'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
