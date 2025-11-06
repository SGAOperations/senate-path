'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { submitApplication } from '@/lib/actions/applications';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

const applicationSchema = z.object({
  nuid: z.string().min(9, 'NUID must be 9 digits').max(9, 'NUID must be 9 digits'),
  fullName: z.string().min(1, 'Full name is required'),
  preferredFullName: z.string().optional(),
  nickname: z.string().optional(),
  phoneticPronunciation: z.string().optional(),
  pronouns: z.string().optional(),
  email: z.string().email('Valid email is required').refine((email) => email.endsWith('@northeastern.edu'), {
    message: 'Email must be a Northeastern email (@northeastern.edu)',
  }),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  college: z.array(z.string()).min(1, 'Please select at least one college'),
  major: z.string().min(1, 'Major is required'),
  minors: z.string().optional(),
  year: z.string().min(1, 'Please select your year'),
  constituency: z.string().min(1, 'Please select your constituency'),
}).refine((data) => data.college.includes(data.constituency), {
  message: 'Constituency must be one of the selected colleges',
  path: ['constituency'],
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function ApplicationsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [colleges, setColleges] = useState<string[]>([]);
  const [year, setYear] = useState('');
  const [constituency, setConstituency] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      nuid: '',
      fullName: '',
      preferredFullName: '',
      nickname: '',
      phoneticPronunciation: '',
      pronouns: '',
      email: '',
      phoneNumber: '',
      college: [],
      major: '',
      minors: '',
      year: '',
      constituency: '',
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'college') {
          // Store colleges as comma-separated string
          formData.append(key, (value as string[]).join(', '));
        } else {
          formData.append(key, value?.toString() || '');
        }
      });

      const result = await submitApplication(formData);

      if (result.success) {
        setSubmitSuccess(true);
        reset();
        setColleges([]);
        setYear('');
        setConstituency('');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setSubmitError(result.error || 'Failed to submit application');
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
            <CardTitle className="text-3xl font-bold">Senator Application</CardTitle>
            <p className="text-muted-foreground mt-2">
              Thank you for your interest in becoming a Senator! Please fill out all fields below.
            </p>
          </CardHeader>
          <CardContent>
          {submitSuccess && (
            <Alert variant="success" className="mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Application submitted successfully! Redirecting to home page...
              </AlertDescription>
            </Alert>
          )}

          {submitError && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4 p-6 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nuid">NUID</Label>
                  <Input
                    id="nuid"
                    placeholder="000000000"
                    {...register('nuid')}
                  />
                  {errors.nuid && (
                    <p className="text-sm text-destructive">{errors.nuid.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@northeastern.edu"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name (as it appears on official documents)</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredFullName">Preferred Full Name <span className="text-muted-foreground">(optional)</span></Label>
                  <Input
                    id="preferredFullName"
                    placeholder="Enter your preferred name"
                    {...register('preferredFullName')}
                  />
                  {errors.preferredFullName && (
                    <p className="text-sm text-destructive">{errors.preferredFullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname <span className="text-muted-foreground">(optional)</span></Label>
                  <Input
                    id="nickname"
                    placeholder="Enter your nickname"
                    {...register('nickname')}
                  />
                  {errors.nickname && (
                    <p className="text-sm text-destructive">{errors.nickname.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneticPronunciation">Phonetic Pronunciation <span className="text-muted-foreground">(optional)</span></Label>
                  <Input
                    id="phoneticPronunciation"
                    placeholder="How to pronounce your name"
                    {...register('phoneticPronunciation')}
                  />
                  {errors.phoneticPronunciation && (
                    <p className="text-sm text-destructive">{errors.phoneticPronunciation.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pronouns">Pronouns <span className="text-muted-foreground">(optional)</span></Label>
                  <Input
                    id="pronouns"
                    placeholder="e.g., he/him, she/her, they/them"
                    {...register('pronouns')}
                  />
                  {errors.pronouns && (
                    <p className="text-sm text-destructive">{errors.pronouns.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="(XXX) XXX-XXXX"
                    {...register('phoneNumber')}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4 p-6 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">Academic Information</h3>
              
              <div className="space-y-2">
                <Label>College <span className="text-sm text-muted-foreground">(Select all that apply)</span></Label>
                <div className="space-y-2 p-4 rounded-md border border-input bg-white">
                  {[
                    'College of Arts, Media and Design',
                    "D'Amore-McKim School of Business",
                    'Khoury College of Computer Sciences',
                    'College of Engineering',
                    'Bouvé College of Health Sciences',
                    'College of Science',
                    'College of Social Sciences and Humanities',
                    'Explore Program',
                  ].map((collegeName) => (
                    <div key={collegeName} className="flex items-center space-x-2">
                      <Checkbox
                        id={`college-${collegeName}`}
                        checked={colleges.includes(collegeName)}
                        onCheckedChange={(checked) => {
                          const newColleges = checked
                            ? [...colleges, collegeName]
                            : colleges.filter((c) => c !== collegeName);
                          setColleges(newColleges);
                          setValue('college', newColleges, { shouldValidate: true });
                          // Reset constituency if it's no longer in the selected colleges
                          if (!newColleges.includes(constituency)) {
                            setConstituency('');
                            setValue('constituency', '', { shouldValidate: true });
                          }
                        }}
                      />
                      <Label
                        htmlFor={`college-${collegeName}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {collegeName}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.college && (
                  <p className="text-sm text-destructive">{errors.college.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Input
                    id="major"
                    placeholder="Enter your major"
                    {...register('major')}
                  />
                  {errors.major && (
                    <p className="text-sm text-destructive">{errors.major.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minors">Minors <span className="text-muted-foreground">(optional)</span></Label>
                  <Input
                    id="minors"
                    placeholder="Leave blank if none"
                    {...register('minors')}
                  />
                  {errors.minors && (
                    <p className="text-sm text-destructive">{errors.minors.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={year}
                  onValueChange={(value) => {
                    setYear(value);
                    setValue('year', value, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Freshman">Freshman</SelectItem>
                    <SelectItem value="Sophomore">Sophomore</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
                {errors.year && (
                  <p className="text-sm text-destructive">{errors.year.message}</p>
                )}
              </div>
            </div>

            {/* Constituency */}
            <div className="space-y-4 p-6 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">Constituency</h3>
              
              <div className="space-y-2">
                <Label htmlFor="constituency">
                  Constituency 
                  <span id="constituency-helper" className="block text-sm text-muted-foreground font-normal mt-1">
                    Students in double or combined majors may select either college
                  </span>
                </Label>
                <Select
                  value={constituency}
                  onValueChange={(value) => {
                    setConstituency(value);
                    setValue('constituency', value, { shouldValidate: true });
                  }}
                  disabled={colleges.length === 0}
                >
                  <SelectTrigger aria-describedby="constituency-helper">
                    <SelectValue placeholder={colleges.length === 0 ? "Please select college(s) first" : "Select constituency"} />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((collegeName) => (
                      <SelectItem key={collegeName} value={collegeName}>
                        {collegeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.constituency && (
                  <p className="text-sm text-destructive">{errors.constituency.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-bold text-lg shadow-md hover:shadow-lg transition-shadow"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

