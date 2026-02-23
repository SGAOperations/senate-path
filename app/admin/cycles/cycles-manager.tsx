'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { deleteCycle } from '@/lib/actions/cycles';
import { isActionError } from '@/lib/actions/utils';
import { CreateCycleModal } from './create-cycle-modal';
import { SetActiveModal } from './set-active-modal';

export interface CycleWithCounts {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  _count: {
    applications: number;
    nominations: number;
    endorsements: number;
  };
}

interface CyclesManagerProps {
  cycles: CycleWithCounts[];
}

export function CyclesManager({ cycles }: CyclesManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeCycleToSet, setActiveCycleToSet] = useState<CycleWithCounts | null>(null);

  const handleDelete = async (cycle: CycleWithCounts) => {
    if (!confirm(`Are you sure you want to delete cycle "${cycle.name}"?`)) return;

    const result = await deleteCycle(cycle.id);
    if (isActionError(result)) {
      toast.error(result.error);
    } else {
      toast.success(`Cycle "${cycle.name}" deleted`);
    }
  };

  const isEmpty = (cycle: CycleWithCounts) =>
    cycle._count.applications === 0 &&
    cycle._count.nominations === 0 &&
    cycle._count.endorsements === 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Cycle
        </Button>
      </div>

      {showCreateModal && <CreateCycleModal onClose={() => setShowCreateModal(false)} />}

      {activeCycleToSet && (
        <SetActiveModal cycle={activeCycleToSet} onClose={() => setActiveCycleToSet(null)} />
      )}

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
                        {!cycle.isActive && (
                          <Link href={`/admin/cycles/${cycle.id}`}>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        )}
                        {!cycle.isActive && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => setActiveCycleToSet(cycle)}
                          >
                            Set Active
                          </Button>
                        )}
                        {!cycle.isActive && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(cycle)}
                            disabled={!isEmpty(cycle)}
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

