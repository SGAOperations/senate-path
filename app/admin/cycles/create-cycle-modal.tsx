'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createCycle, isActionError } from '@/lib/actions/cycles';

const createCycleSchema = z.object({
  name: z.string().min(1, 'Cycle name is required'),
});

type CreateCycleFormData = z.infer<typeof createCycleSchema>;

interface CreateCycleModalProps {
  onClose: () => void;
}

export function CreateCycleModal({ onClose }: CreateCycleModalProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateCycleFormData>({
    resolver: zodResolver(createCycleSchema),
  });

  const handleCreate = (setActive: boolean) =>
    handleSubmit(async (data) => {
      const result = await createCycle(data.name, setActive);
      if (isActionError(result)) {
        setError('root', { message: result.error });
      } else {
        toast.success(
          setActive
            ? `Cycle "${data.name}" created and set as active`
            : `Cycle "${data.name}" created`
        );
        onClose();
      }
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Create New Cycle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {errors.root && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="cycle-name">Cycle Name</Label>
            <Input
              id="cycle-name"
              {...register('name')}
              placeholder="e.g. Fall 2025"
              disabled={isSubmitting}
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCreate(false)}
              disabled={isSubmitting}
            >
              Create as Inactive
            </Button>
            <Button type="button" onClick={handleCreate(true)} disabled={isSubmitting}>
              Create & Set Active
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
