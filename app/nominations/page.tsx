'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { submitNomination } from '@/lib/actions/nominations';
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
import { CheckCircle2, XCircle } from 'lucide-react';

const nominationSchema = z.object({
  fullName: z.string().min(1, 'Your full name is required'),
  email: z.string().min(1, 'Email is required').email('Valid email is required').refine(
    (email) => email.endsWith('@northeastern.edu'),
    'Email must be a @northeastern.edu address'
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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [college, setCollege] = useState('');
  const [nominee, setNominee] = useState('');
  const [nominees, setNominees] = useState<Array<{ fullName: string; email: string }>>([]);
  const [nomineesLoadError, setNomineesLoadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<NominationFormData>({
    resolver: zodResolver(nominationSchema),
  });

  useEffect(() => {
    async function fetchNominees() {
      try {
        const data = await getNominationFormData();
        setNominees(data.nominees);
        setNomineesLoadError(null);
      } catch (error) {
        console.error('Failed to fetch nominees:', error);
        setNomineesLoadError('Failed to load nominee list. Please refresh the page.');
      }
    }
    fetchNominees();
  }, []);

  const onSubmit = async (data: NominationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const result = await submitNomination(formData);

      if (result.success) {
        setSubmitSuccess(true);
        reset();
        setTimeout(() => {
          router.push('/');
        }, 2000);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
            <CardTitle className="text-3xl font-bold">Nominate a Senator</CardTitle>
            <p className="text-muted-foreground mt-2">
              Nominate students to become senators. Senators must have submitted an application in order to be nominated.
            </p>
          </CardHeader>
          <CardContent>
          {submitSuccess && (
            <Alert variant="success" className="mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Nomination submitted successfully! Redirecting to home page...
              </AlertDescription>
            </Alert>
          )}

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
            <div className="space-y-4 p-6 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">Your Information (Nominator)</h3>              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Your Full Name</Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@northeastern.edu"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="college">Home College</Label>
                  <Select
                    value={college}
                    onValueChange={(value) => {
                      setCollege(value);
                      setValue('college', value, { shouldValidate: true });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select college" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="College of Arts, Media and Design">College of Arts, Media and Design</SelectItem>
                      <SelectItem value="D'Amore-McKim School of Business">D'Amore-McKim School of Business</SelectItem>
                      <SelectItem value="Khoury College of Computer Sciences">Khoury College of Computer Sciences</SelectItem>
                      <SelectItem value="College of Engineering">College of Engineering</SelectItem>
                      <SelectItem value="Bouvé College of Health Sciences">Bouvé College of Health Sciences</SelectItem>
                      <SelectItem value="College of Science">College of Science</SelectItem>
                      <SelectItem value="College of Social Sciences and Humanities">College of Social Sciences and Humanities</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Your home college should be the same college that your advisor is housed under
                  </p>
                  {errors.college && (
                    <p className="text-sm text-destructive">{errors.college.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major">Your Major</Label>
                  <Input
                    id="major"
                    {...register('major')}
                  />
                  {errors.major && (
                    <p className="text-sm text-destructive">{errors.major.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Nominee Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Nominee Information</h3>
              
              <div className="space-y-2">
                <Select
                  value={nominee}
                  onValueChange={(value) => {
                    setNominee(value);
                    setValue('nominee', value, { shouldValidate: true });
                  }}
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
                {errors.nominee && (
                  <p className="text-sm text-destructive">{errors.nominee.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-bold text-lg shadow-md hover:shadow-lg transition-shadow"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Nomination'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
