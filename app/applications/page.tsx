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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const applicationSchema = z.object({
  nuid: z.string().min(9, 'NUID must be 9 digits').max(9, 'NUID must be 9 digits'),
  fullName: z.string().min(1, 'Full name is required'),
  preferredFullName: z.string().min(1, 'Preferred full name is required'),
  nickname: z.string().min(1, 'Nickname is required'),
  phoneticPronunciation: z.string().min(1, 'Phonetic pronunciation is required'),
  pronouns: z.string().min(1, 'Pronouns are required'),
  email: z.string().email('Valid email is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  college: z.string().min(1, 'College is required'),
  major: z.string().min(1, 'Major is required'),
  minors: z.string(),
  year: z.number().min(1, 'Year is required').max(6, 'Year must be between 1-6'),
  semester: z.string().min(1, 'Semester is required'),
  constituency: z.string().min(1, 'Constituency is required'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function ApplicationsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [constituency, setConstituency] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'year') {
          formData.append(key, Number(value).toString());
        } else {
          formData.append(key, value.toString());
        }
      });

      const result = await submitApplication(formData);

      if (result.success) {
        toast.success('Application submitted successfully!');
        router.push('/');
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                  {...register('fullName')}
                  disabled={isSubmitting}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredFullName">Preferred Full Name</Label>
                  <Input
                    id="preferredFullName"
                    {...register('preferredFullName')}
                    disabled={isSubmitting}
                  />
                  {errors.preferredFullName && (
                    <p className="text-sm text-destructive">{errors.preferredFullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    {...register('nickname')}
                    disabled={isSubmitting}
                  />
                  {errors.nickname && (
                    <p className="text-sm text-destructive">{errors.nickname.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneticPronunciation">Phonetic Pronunciation</Label>
                  <Input
                    id="phoneticPronunciation"
                    placeholder="How to pronounce your name"
                    {...register('phoneticPronunciation')}
                    disabled={isSubmitting}
                  />
                  {errors.phoneticPronunciation && (
                    <p className="text-sm text-destructive">{errors.phoneticPronunciation.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pronouns">Pronouns</Label>
                  <Input
                    id="pronouns"
                    placeholder="e.g., he/him, she/her, they/them"
                    {...register('pronouns')}
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="college">College</Label>
                  <Select
                    value={college}
                    onValueChange={(value) => {
                      setCollege(value);
                      setValue('college', value, { shouldValidate: true });
                    }}
                    disabled={isSubmitting}
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
                  <Label htmlFor="major">Major</Label>
                  <Input
                    id="major"
                    {...register('major')}
                    disabled={isSubmitting}
                  />
                  {errors.major && (
                    <p className="text-sm text-destructive">{errors.major.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minors">Minors (if any)</Label>
                  <Input
                    id="minors"
                    placeholder="Leave blank if none"
                    {...register('minors')}
                    disabled={isSubmitting}
                  />
                  {errors.minors && (
                    <p className="text-sm text-destructive">{errors.minors.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select
                    value={year}
                    onValueChange={(value) => {
                      setYear(value);
                      setValue('year', parseInt(value), { shouldValidate: true });
                    }}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 (Freshman)</SelectItem>
                      <SelectItem value="2">2 (Sophomore)</SelectItem>
                      <SelectItem value="3">3 (Middler)</SelectItem>
                      <SelectItem value="4">4 (Junior)</SelectItem>
                      <SelectItem value="5">5 (Senior)</SelectItem>
                      <SelectItem value="6">6+ (Graduate)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.year && (
                    <p className="text-sm text-destructive">{errors.year.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester Applying For</Label>
                  <Select
                    value={semester}
                    onValueChange={(value) => {
                      setSemester(value);
                      setValue('semester', value, { shouldValidate: true });
                    }}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                      <SelectItem value="Spring 2026">Spring 2026</SelectItem>
                      <SelectItem value="Fall 2026">Fall 2026</SelectItem>
                      <SelectItem value="Spring 2027">Spring 2027</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.semester && (
                    <p className="text-sm text-destructive">{errors.semester.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Constituency */}
            <div className="space-y-4 p-6 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">Constituency</h3>
              
              <div className="space-y-2">
                <Label htmlFor="constituency">Constituency</Label>
                <Select
                  value={constituency}
                  onValueChange={(value) => {
                    setConstituency(value);
                    setValue('constituency', value, { shouldValidate: true });
                  }}
                  disabled={isSubmitting}
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
                'Submit Application'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

