'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { createNomination } from '@/lib/actions/nominations';
import { getNominationFormData } from '@/lib/data/applications';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, Loader2 } from 'lucide-react';
import { useUnsavedChangesWarning } from '@/lib/hooks/useUnsavedChangesWarning';
import { toast } from 'sonner';

const nominationSchema = z.object({
  fullName: z.string().min(1, 'Your full name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Valid email is required')
    .refine(
      (email) => email.endsWith('@northeastern.edu'),
      'Email must be a @northeastern.edu address',
    ),
  nominee: z.string().min(1, 'Please select a nominee'),
  college: z.string().min(1, 'Please select your home college'),
  major: z.string().min(1, 'Major is required'),
});

type NominationFormData = z.infer<typeof nominationSchema>;

export default function NominationsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [nominees, setNominees] = useState<
    Array<{ fullName: string; email: string }>
  >([]);
  const [nomineesLoadError, setNomineesLoadError] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
  } = useForm<NominationFormData>({
    resolver: zodResolver(nominationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      nominee: '',
      college: '',
      major: '',
    },
  });

  // Warn user about unsaved changes before leaving the page
  const hasUnsavedChanges = isDirty && !isSubmitting;
  useUnsavedChangesWarning(hasUnsavedChanges);

  useEffect(() => {
    async function fetchNominees() {
      try {
        const data = await getNominationFormData();
        setNominees(data.nominees);
        setNomineesLoadError(null);
      } catch (error) {
        console.error('Failed to fetch nominees:', error);
        setNomineesLoadError(
          'Failed to load nominee list. Please refresh the page.',
        );
      }
    }
    fetchNominees();
  }, []);

  const onSubmit = async (data: NominationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createNomination(data);

      if (result.success) {
        toast.success('Nomination submitted successfully!');
        reset();
        router.push('/');
      } else {
        setSubmitError(result.error || 'Failed to submit nomination');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="container max-w-4xl mx-auto py-3 sm:py-6 lg:py-8 px-3 sm:px-4">
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Nominate a Senator
            </CardTitle>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Nominate a student to become a Senator in SGA's Senate and represent you. Nominations are an indication that you support your Nominee running to represent you; it is not a vote. You may nominate more than one person. You may only nominate students if you're their potential constituent.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {submitError && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {nomineesLoadError && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{nomineesLoadError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Nominator Information */}
              <Card className="border">
                <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-6">
                  <h3 className="text-xl font-bold border-b pb-2 mb-4">
                    Your Information (Nominator)
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Your Full Name</Label>
                        <Input
                          id="fullName"
                          {...register('fullName')}
                          disabled={isSubmitting}
                        />
                        {errors.fullName && (
                          <p className="text-sm text-destructive">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Your Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@northeastern.edu"
                          {...register('email')}
                          disabled={isSubmitting}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="college">Your Home College</Label>
                        <Controller
                          name="college"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select college" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="College of Arts, Media and Design">
                                  College of Arts, Media and Design
                                </SelectItem>
                                <SelectItem value="D'Amore-McKim School of Business">
                                  D'Amore-McKim School of Business
                                </SelectItem>
                                <SelectItem value="Khoury College of Computer Sciences">
                                  Khoury College of Computer Sciences
                                </SelectItem>
                                <SelectItem value="College of Engineering">
                                  College of Engineering
                                </SelectItem>
                                <SelectItem value="Bouvé College of Health Sciences">
                                  Bouvé College of Health Sciences
                                </SelectItem>
                                <SelectItem value="College of Science">
                                  College of Science
                                </SelectItem>
                                <SelectItem value="College of Social Sciences and Humanities">
                                  College of Social Sciences and Humanities
                                </SelectItem>
                                <SelectItem value="Explore Program">
                                  Explore Program
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <p className="text-sm text-muted-foreground">
                          Your home college is the college that your advisor is housed under.
                        </p>
                        {errors.college && (
                          <p className="text-sm text-destructive">
                            {errors.college.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="major">Your Major</Label>
                        <Input id="major" {...register('major')} />
                        {errors.major && (
                          <p className="text-sm text-destructive">
                            {errors.major.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nominee Information */}
              <Card className="border">
                <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-6">
                  <h3 className="text-xl font-bold border-b pb-2 mb-4">
                    Nominee Information
                  </h3>
                  <div className="space-y-2">
                    <Controller
                      name="nominee"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select the person you're nominating" />
                          </SelectTrigger>
                          <SelectContent>
                            {nominees.map((n) => (
                              <SelectItem key={n.email} value={n.fullName}>
                                {n.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.nominee && (
                      <p className="text-sm text-destructive">
                        {errors.nominee.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full h-12 font-bold text-lg shadow-md hover:shadow-lg transition-shadow"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Nomination'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
