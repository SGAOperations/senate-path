'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { submitEndorsement } from '@/lib/actions/endorsements';
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
import { XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const endorsementSchema = z.object({
  endorserName: z.string().min(1, 'Your name is required'),
  endorserEmail: z.string().email('Valid email is required'),
  applicantName: z.string().min(1, 'Please select an applicant to endorse'),
  definingTraits: z.string().min(50, 'Please provide at least 50 characters'),
  leadershipQualities: z.string().min(50, 'Please provide at least 50 characters'),
  areasForDevelopment: z.string().min(50, 'Please provide at least 50 characters'),
  currentPage: z.number().optional(),
});

type EndorsementFormData = z.infer<typeof endorsementSchema>;

export default function EndorsementsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Array<{ fullName: string; email: string }>>([]);
  const [applicantsLoadError, setApplicantsLoadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
    watch,
  } = useForm<EndorsementFormData>({
    resolver: zodResolver(endorsementSchema),
    mode: 'onBlur',
    defaultValues: {
      endorserName: '',
      endorserEmail: '',
      applicantName: '',
      definingTraits: '',
      leadershipQualities: '',
      areasForDevelopment: '',
      currentPage: 1,
    },
  });

  const currentPage = watch('currentPage') ?? 1;
  const applicantName = watch('applicantName');

  useEffect(() => {
    async function fetchApplicants() {
      try {
        const data = await getNominationFormData();
        setApplicants(data.nominees);
        setApplicantsLoadError(null);
      } catch (error) {
        console.error('Failed to fetch applicants:', error);
        setApplicantsLoadError('Failed to load applicant list. Please refresh the page.');
      }
    }
    fetchApplicants();
  }, []);

  const onSubmit = async (data: EndorsementFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitEndorsement({
        endorserName: data.endorserName,
        endorserEmail: data.endorserEmail,
        applicantName: data.applicantName,
        definingTraits: data.definingTraits,
        leadershipQualities: data.leadershipQualities,
        areasForDevelopment: data.areasForDevelopment,
      });

      if (result.success) {
        toast.success('Endorsement submitted successfully!');
        reset();
        router.push('/');
      } else {
        setSubmitError(result.error || 'Failed to submit endorsement');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextPage = async () => {
    // Validate page 1 fields before moving to page 2
    const fieldsToValidate: (keyof EndorsementFormData)[] = ['endorserName', 'endorserEmail', 'applicantName'];
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setValue('currentPage', 2);
    }
  };

  const handlePreviousPage = () => {
    setValue('currentPage', 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
            <CardTitle className="text-3xl font-bold">Endorse an Applicant</CardTitle>
            <p className="text-muted-foreground mt-2">
              Support a candidate by providing an endorsement. Your endorsement will help us understand the applicant's strengths and potential.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className={`h-2 flex-1 rounded ${currentPage >= 1 ? 'bg-primary' : 'bg-gray-200'}`} />
              <div className={`h-2 flex-1 rounded ${currentPage >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentPage} of 2
            </p>
          </CardHeader>
          <CardContent className="pt-8">
            {submitError && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {applicantsLoadError && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{applicantsLoadError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Page 1: Endorser Information */}
              {currentPage === 1 && (
                <div className="space-y-6">
                  <div className="space-y-4 p-6 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800">Your Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Please provide your contact information
                    </p>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endorserName">Your Full Name</Label>
                      <Input
                        id="endorserName"
                        {...register('endorserName')}
                      />
                      {errors.endorserName && (
                        <p className="text-sm text-destructive">{errors.endorserName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endorserEmail">Your Email</Label>
                      <Input
                        id="endorserEmail"
                        type="email"
                        placeholder="your.email@northeastern.edu"
                        {...register('endorserEmail')}
                      />
                      {errors.endorserEmail && (
                        <p className="text-sm text-destructive">{errors.endorserEmail.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 p-6 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800">Applicant Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="applicantName">Who are you endorsing?</Label>
                      <Select
                        value={applicantName}
                        onValueChange={(value) => {
                          setValue('applicantName', value, { shouldValidate: true });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select the applicant you're endorsing" />
                        </SelectTrigger>
                        <SelectContent>
                          {applicants.map((applicant) => (
                            <SelectItem key={applicant.email} value={applicant.fullName}>
                              {applicant.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.applicantName && (
                        <p className="text-sm text-destructive">{errors.applicantName.message}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleNextPage}
                    className="w-full h-12 font-bold text-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    Next <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* Page 2: Endorsement Questions */}
              {currentPage === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4 p-6 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800">Endorsement Questions</h3>
                    <p className="text-sm text-muted-foreground">
                      Please answer the following questions about the applicant
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="definingTraits">
                        When describing this applicant, what do you believe are some of their defining traits or qualities?
                      </Label>
                      <textarea
                        id="definingTraits"
                        className="w-full min-h-[120px] px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        placeholder="Please provide a detailed response (minimum 50 characters)"
                        {...register('definingTraits')}
                      />
                      {errors.definingTraits && (
                        <p className="text-sm text-destructive">{errors.definingTraits.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="leadershipQualities">
                        Of the applicant's qualities you just described, which of them do you believe will serve them best in a leadership position and why?
                      </Label>
                      <textarea
                        id="leadershipQualities"
                        className="w-full min-h-[120px] px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        placeholder="Please provide a detailed response (minimum 50 characters)"
                        {...register('leadershipQualities')}
                      />
                      {errors.leadershipQualities && (
                        <p className="text-sm text-destructive">{errors.leadershipQualities.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="areasForDevelopment">
                        One of the benefits of leadership positions is that they allow for students to grow and develop skills vital for their personal, academic, and professional journeys. What are some areas or skills that you think would be most beneficial for this applicant to develop in order to become a more effective leader?
                      </Label>
                      <textarea
                        id="areasForDevelopment"
                        className="w-full min-h-[120px] px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        placeholder="Please provide a detailed response (minimum 50 characters)"
                        {...register('areasForDevelopment')}
                      />
                      {errors.areasForDevelopment && (
                        <p className="text-sm text-destructive">{errors.areasForDevelopment.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreviousPage}
                      className="flex-1 h-12 font-bold text-lg"
                    >
                      <ChevronLeft className="mr-2 h-5 w-5" /> Previous
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-12 font-bold text-lg shadow-md hover:shadow-lg transition-shadow"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Endorsement'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
