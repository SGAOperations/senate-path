'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { setActiveCycle } from '@/lib/actions/cycles';
import type { CycleWithCounts } from './cycles-manager';

interface SetActiveModalProps {
  cycle: CycleWithCounts;
  onClose: () => void;
}

export function SetActiveModal({ cycle, onClose }: SetActiveModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const result = await setActiveCycle(cycle.id);
    if (result.success) {
      toast.success(`"${cycle.name}" is now the active cycle`);
      onClose();
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to set active cycle');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Set Active Cycle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will make <strong>{cycle.name}</strong> the active cycle. All new applications
            will go to this cycle. Continue?
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isSubmitting}>
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
