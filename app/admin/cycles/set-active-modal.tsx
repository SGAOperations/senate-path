'use client';

import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { setActiveCycle } from '@/lib/actions/cycles';
import { isActionError } from '@/lib/actions/utils';
import type { CycleWithCounts } from './cycles-manager';

interface SetActiveModalProps {
  cycle: CycleWithCounts;
  onClose: () => void;
}

export function SetActiveModal({ cycle, onClose }: SetActiveModalProps) {
  const handleConfirm = async () => {
    const result = await setActiveCycle(cycle.id);
    if (isActionError(result)) {
      toast.error(result.error);
    } else {
      toast.success(`"${cycle.name}" is now the active cycle`);
      onClose();
    }
  };

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Set Active Cycle</AlertDialogTitle>
          <AlertDialogDescription>
            This will make <strong>{cycle.name}</strong> the active cycle. All new applications
            will go to this cycle. Continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

