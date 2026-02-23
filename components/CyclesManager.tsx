'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { createCycle, setActiveCycle, deleteCycle } from '@/lib/actions/cycles';

type CycleWithCounts = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  _count: {
    applications: number;
    nominations: number;
    endorsements: number;
  };
};

interface CyclesManagerProps {
  cycles: CycleWithCounts[];
}

export default function CyclesManager({ cycles }: CyclesManagerProps) {
  const router = useRouter();

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCycleName, setNewCycleName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Set active confirmation state
  const [confirmActiveCycle, setConfirmActiveCycle] = useState<CycleWithCounts | null>(null);
  const [isSettingActive, setIsSettingActive] = useState(false);

  const handleCreate = async (setActive: boolean) => {
    if (!newCycleName.trim()) {
      setCreateError('Cycle name is required');
      return;
    }
    setIsCreating(true);
    setCreateError(null);

    const result = await createCycle(newCycleName, setActive);

    if (result.success) {
      toast.success(
        setActive
          ? `Cycle "${newCycleName}" created and set as active`
          : `Cycle "${newCycleName}" created`
      );
      setNewCycleName('');
      setShowCreateModal(false);
      router.refresh();
    } else {
      setCreateError(result.error || 'Failed to create cycle');
    }
    setIsCreating(false);
  };

  const handleSetActive = async () => {
    if (!confirmActiveCycle) return;
    setIsSettingActive(true);

    const result = await setActiveCycle(confirmActiveCycle.id);

    if (result.success) {
      toast.success(`"${confirmActiveCycle.name}" is now the active cycle`);
      setConfirmActiveCycle(null);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to set active cycle');
    }
    setIsSettingActive(false);
  };

  const handleDelete = async (cycle: CycleWithCounts) => {
    if (!confirm(`Are you sure you want to delete cycle "${cycle.name}"?`)) return;

    const result = await deleteCycle(cycle.id);

    if (result.success) {
      toast.success(`Cycle "${cycle.name}" deleted`);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete cycle');
    }
  };

  const isEmpty = (cycle: CycleWithCounts) =>
    cycle._count.applications === 0 &&
    cycle._count.nominations === 0 &&
    cycle._count.endorsements === 0;

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setCreateError(null);
    setNewCycleName('');
  };

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex justify-end">
        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Cycle
        </Button>
      </div>

      {/* Create Cycle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create New Cycle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {createError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{createError}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="cycle-name">Cycle Name</Label>
                <Input
                  id="cycle-name"
                  value={newCycleName}
                  onChange={(e) => setNewCycleName(e.target.value)}
                  placeholder="e.g. Fall 2025"
                  disabled={isCreating}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowCreateModal(false);
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCreate(false)}
                  disabled={isCreating || !newCycleName.trim()}
                >
                  Create as Inactive
                </Button>
                <Button
                  onClick={() => handleCreate(true)}
                  disabled={isCreating || !newCycleName.trim()}
                >
                  Create & Set Active
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Set Active Confirmation Modal */}
      {confirmActiveCycle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Set Active Cycle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will make <strong>{confirmActiveCycle.name}</strong> the active cycle. All new
                applications will go to this cycle. Continue?
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setConfirmActiveCycle(null)}
                  disabled={isSettingActive}
                >
                  Cancel
                </Button>
                <Button onClick={handleSetActive} disabled={isSettingActive}>
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cycles Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Cycles ({cycles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {cycles.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No cycles found. Create one above to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Applications</TableHead>
                  <TableHead className="text-right">Nominations</TableHead>
                  <TableHead className="text-right">Endorsements</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cycles.map((cycle) => (
                  <TableRow
                    key={cycle.id}
                    className={cycle.isActive ? 'bg-success/10' : undefined}
                  >
                    <TableCell className="font-medium">{cycle.name}</TableCell>
                    <TableCell>
                      <Badge variant={cycle.isActive ? 'success' : 'secondary'}>
                        {cycle.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{cycle._count.applications}</TableCell>
                    <TableCell className="text-right">{cycle._count.nominations}</TableCell>
                    <TableCell className="text-right">{cycle._count.endorsements}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(cycle.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/cycles/${cycle.id}`}>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        {!cycle.isActive && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => setConfirmActiveCycle(cycle)}
                          >
                            Set Active
                          </Button>
                        )}
                        {!cycle.isActive && isEmpty(cycle) && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(cycle)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
