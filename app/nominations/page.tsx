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
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

const nominationSchema = z.object({
  fullName: z.string().min(1, 'Your full name is required'),
  email: z.string().email('Valid email is required'),
  nominee: z.string().min(1, 'Nominee name is required'),
  college: z.string().min(1, 'College is required'),
  major: z.string().min(1, 'Major is required'),
  graduationYear: z.number().min(2024, 'Valid graduation year required').max(2030, 'Graduation year must be by 2030'),
  constituency: z.string().min(1, 'Constituency is required'),
  receiveSenatorInfo: z.boolean(),
});

type NominationFormData = z.infer<typeof nominationSchema>;

export default function NominationsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [college, setCollege] = useState('');
  const [constituency, setConstituency] = useState('');
  const [receiveSenatorInfo, setReceiveSenatorInfo] = useState(false);
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
    defaultValues: {
      receiveSenatorInfo: false,
    },
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
        if (key === 'graduationYear') {
          formData.append(key, Number(value).toString());
        } else {
          formData.append(key, value.toString());
        }
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
              Know someone who would make a great senator? Nominate them here! Please ensure they have submitted their application before nominating them.
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
              <p className="text-sm text-muted-foreground">
                Please ensure you have the same constituency as the person you're nominating.
              </p>              
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
                  <Label htmlFor="college">Your College</Label>
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

              <div className="space-y-2">
                <Label htmlFor="constituency">Your Constituency</Label>
                <Select
                  value={constituency}
                  onValueChange={(value) => {
                    setConstituency(value);
                    setValue('constituency', value, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select constituency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAMD">College of Arts, Media and Design</SelectItem>
                    <SelectItem value="DMSB">D'Amore-McKim School of Business</SelectItem>
                    <SelectItem value="Khoury">Khoury College of Computer Sciences</SelectItem>
                    <SelectItem value="COE">College of Engineering</SelectItem>
                    <SelectItem value="Bouve">Bouvé College of Health Sciences</SelectItem>
                    <SelectItem value="COS">College of Science</SelectItem>
                    <SelectItem value="CSSH">College of Social Sciences and Humanities</SelectItem>
                    <SelectItem value="Explore">Explore (Undeclared)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.constituency && (
                  <p className="text-sm text-destructive">{errors.constituency.message}</p>
                )}
              </div>
            </div>

            {/* Nominee Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Nominee Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="nominee">Nominee Full Name</Label>
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

              <div className="space-y-2">
                <Label htmlFor="graduationYear">Nominee's Graduation Year</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  placeholder="2025"
                  {...register('graduationYear', { valueAsNumber: true })}
                />
                {errors.graduationYear && (
                  <p className="text-sm text-destructive">{errors.graduationYear.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="receiveSenatorInfo"
                  checked={receiveSenatorInfo}
                  onCheckedChange={(checked) => {
                    setReceiveSenatorInfo(checked as boolean);
                    setValue('receiveSenatorInfo', checked as boolean);
                  }}
                />
                <Label
                  htmlFor="receiveSenatorInfo"
                  className="text-sm font-normal cursor-pointer"
                >
                  I would like to receive information about becoming a senator
                </Label>
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
