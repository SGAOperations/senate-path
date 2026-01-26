'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updateSettings, UpdateSettingsData } from '@/lib/actions/settings';
import { Settings } from '@/lib/data/settings';
import { toast } from 'sonner';
import { Loader2, Save, AlertCircle } from 'lucide-react';

const settingsSchema = z.object({
  requiredNominations: z.number().min(1).max(100),
  maxCommunityNominations: z.number().min(0).max(100),
  endorsementRequired: z.boolean(),
  applicationDeadline: z.string().optional(),
  applicationsOpen: z.boolean(),
  nominationsOpen: z.boolean(),
  customMessage: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  settings: Settings;
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      requiredNominations: settings.requiredNominations,
      maxCommunityNominations: settings.maxCommunityNominations,
      endorsementRequired: settings.endorsementRequired,
      applicationDeadline: settings.applicationDeadline
        ? new Date(settings.applicationDeadline).toISOString().slice(0, 16)
        : '',
      applicationsOpen: settings.applicationsOpen,
      nominationsOpen: settings.nominationsOpen,
      customMessage: settings.customMessage || '',
    },
  });

  const endorsementRequired = watch('endorsementRequired');
  const applicationsOpen = watch('applicationsOpen');
  const nominationsOpen = watch('nominationsOpen');

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const updateData: UpdateSettingsData = {
        requiredNominations: data.requiredNominations,
        maxCommunityNominations: data.maxCommunityNominations,
        endorsementRequired: data.endorsementRequired,
        applicationDeadline: data.applicationDeadline
          ? new Date(data.applicationDeadline)
          : null,
        applicationsOpen: data.applicationsOpen,
        nominationsOpen: data.nominationsOpen,
        customMessage: data.customMessage || null,
      };

      const result = await updateSettings(updateData);

      if (result.success) {
        toast.success('Settings updated successfully!');
      } else {
        setError(result.error || 'Failed to update settings');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Nomination Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Nomination Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requiredNominations">
                Required Number of Nominations
              </Label>
              <Input
                id="requiredNominations"
                type="number"
                min="1"
                max="100"
                {...register('requiredNominations', { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              {errors.requiredNominations && (
                <p className="text-sm text-destructive">
                  {errors.requiredNominations.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Total number of nominations required for an application
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxCommunityNominations">
                Max Community Constituency Nominations
              </Label>
              <Input
                id="maxCommunityNominations"
                type="number"
                min="0"
                max="100"
                {...register('maxCommunityNominations', { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              {errors.maxCommunityNominations && (
                <p className="text-sm text-destructive">
                  {errors.maxCommunityNominations.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Maximum number of nominations that can come from community constituencies
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="endorsementRequired"
              checked={endorsementRequired}
              onCheckedChange={(checked) =>
                setValue('endorsementRequired', checked === true, {
                  shouldDirty: true,
                })
              }
              disabled={isSubmitting}
            />
            <div className="space-y-1">
              <Label
                htmlFor="endorsementRequired"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Require Endorsement
              </Label>
              <p className="text-sm text-muted-foreground">
                When enabled, applicants must receive an endorsement to complete their application
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Application Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="applicationDeadline">Application Deadline</Label>
            <Input
              id="applicationDeadline"
              type="datetime-local"
              {...register('applicationDeadline')}
              disabled={isSubmitting}
            />
            {errors.applicationDeadline && (
              <p className="text-sm text-destructive">
                {errors.applicationDeadline.message}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Deadline for applications to be submitted (leave empty for no deadline)
            </p>
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="applicationsOpen"
              checked={applicationsOpen}
              onCheckedChange={(checked) =>
                setValue('applicationsOpen', checked === true, {
                  shouldDirty: true,
                })
              }
              disabled={isSubmitting}
            />
            <div className="space-y-1">
              <Label
                htmlFor="applicationsOpen"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Applications Open
              </Label>
              <p className="text-sm text-muted-foreground">
                When disabled, the application form will be closed and links will be hidden
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="nominationsOpen"
              checked={nominationsOpen}
              onCheckedChange={(checked) =>
                setValue('nominationsOpen', checked === true, {
                  shouldDirty: true,
                })
              }
              disabled={isSubmitting}
            />
            <div className="space-y-1">
              <Label
                htmlFor="nominationsOpen"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Nominations Open
              </Label>
              <p className="text-sm text-muted-foreground">
                When disabled, the nomination form will be closed for people who have already applied
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Message */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customMessage">
              Custom Message for Applicants
            </Label>
            <Textarea
              id="customMessage"
              rows={4}
              placeholder="Enter a custom message to display to applicants..."
              {...register('customMessage')}
              disabled={isSubmitting}
            />
            {errors.customMessage && (
              <p className="text-sm text-destructive">
                {errors.customMessage.message}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              This message will be displayed on the home page and application forms
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          size="lg"
          className="min-w-[150px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
