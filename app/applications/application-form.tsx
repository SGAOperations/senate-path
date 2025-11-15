'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
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
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useUnsavedChangesWarning } from '@/lib/hooks/useUnsavedChangesWarning';
import { toast } from 'sonner';
import { CommunityConstituency } from '@prisma/client';
import { VoiceRecorder } from '@/components/ui/voice-recorder';

const applicationSchema = z
  .object({
    nuid: z
      .string()
      .min(9, 'NUID must be 9 digits')
      .max(9, 'NUID must be 9 digits'),
    fullName: z.string().min(1, 'Full name is required'),
    preferredFullName: z.string().optional(),
    nickname: z.string().optional(),
    phoneticPronunciation: z
      .string()
      .min(1, 'Phonetic pronunciation of last name is required'),
    pronunciationAudioUrl: z
      .string()
      .min(1, 'Audio recording of last name pronunciation is required'),
    pronouns: z.string().min(1, 'Pronouns are required'),
    email: z
      .string()
      .email('Please enter a valid email address')
      .refine((email) => email.endsWith('@northeastern.edu'), {
        message: 'Email must be a Northeastern email (@northeastern.edu)',
      }),
    phoneNumber: z.string().min(10, 'Valid phone number is required'),
    college: z.array(z.string()).min(1, 'Please select at least one college'),
    major: z.string().min(1, 'Major is required'),
    minors: z.string().optional(),
    year: z.string().min(1, 'Please select your year'),
    constituency: z.string().min(1, 'Please select your constituency'),
    communityConstituencyId: z
      .string()
      .min(1, 'Please select your community constituency'),
    whySenateLongAnswer: z
      .string()
      .min(50, 'Please provide a detailed response (at least 50 characters)'),
    constituencyIssueLongAnswer: z
      .string()
      .min(50, 'Please provide a detailed response (at least 50 characters)'),
    diversityEquityInclusionLongAnswer: z
      .string()
      .min(50, 'Please provide a detailed response (at least 50 characters)'),
    conflictSituationLongAnswer: z
      .string()
      .min(50, 'Please provide a detailed response (at least 50 characters)'),
  })
  .refine(
    (data) => {
      // Constituency must be one of the selected colleges
      return data.college.includes(data.constituency);
    },
    {
      message: 'Constituency must be one of the selected colleges',
      path: ['constituency'],
    },
  );

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  communityConstituencies: CommunityConstituency[];
}

export default function ApplicationForm({
  communityConstituencies,
}: ApplicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      nuid: '',
      fullName: '',
      preferredFullName: '',
      nickname: '',
      phoneticPronunciation: '',
      pronunciationAudioUrl: '',
      pronouns: '',
      email: '',
      phoneNumber: '',
      college: [],
      major: '',
      minors: '',
      year: '',
      constituency: '',
      communityConstituencyId: '',
      whySenateLongAnswer: '',
      constituencyIssueLongAnswer: '',
      diversityEquityInclusionLongAnswer: '',
      conflictSituationLongAnswer: '',
    },
  });

  const colleges = watch('college');
  const constituency = watch('constituency');

  // Auto-select constituency if only one college is selected, clear if invalid
  useEffect(() => {
    if (colleges.length === 1 && colleges[0] !== constituency) {
      setValue('constituency', colleges[0], { shouldValidate: true });
    } else if (constituency && !colleges.includes(constituency)) {
      // Clear constituency only when it's no longer in the list of selected colleges
      setValue('constituency', '', { shouldValidate: false });
    }
  }, [colleges, constituency, setValue]);

  // Warn user about unsaved changes before leaving the page
  const hasUnsavedChanges = isDirty && !isSubmitting;
  useUnsavedChangesWarning(hasUnsavedChanges);

  const handleAudioRecordingComplete = async (
    audioBlob: Blob,
    audioUrl: string,
  ) => {
    setIsUploadingAudio(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'pronunciation.webm');

      const response = await fetch('/api/upload-pronunciation', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload audio');
      }

      const { url } = await response.json();
      setValue('pronunciationAudioUrl', url, { shouldDirty: true });
      toast.success('Audio recording uploaded successfully!');
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast.error('Failed to upload audio recording. Please try again.');
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const handleAudioRecordingDelete = () => {
    setValue('pronunciationAudioUrl', '', { shouldDirty: true });
    toast.success('Audio recording deleted');
  };

  const handleNextPage = async () => {
    // Validate all fields on page 1 before proceeding
    const fieldsToValidate: (keyof ApplicationFormData)[] = [
      'nuid',
      'fullName',
      'email',
      'phoneNumber',
      'college',
      'major',
      'year',
      'constituency',
      'communityConstituencyId',
    ];

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentPage(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitApplication({
        ...data,
        pronunciationAudioUrl: data.pronunciationAudioUrl || '',
      });

      if (result.success) {
        toast.success('Application submitted successfully!');
        reset();
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
    <div className="bg-muted-background">
      <div className="container max-w-4xl mx-auto py-3 sm:py-6 lg:py-8 px-3 sm:px-4">
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Senator Application
            </CardTitle>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Thank you for your interest in becoming a Senator!{' '}
              {currentPage === 1
                ? 'Please fill out all fields below.'
                : 'Please answer the following questions.'}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div
                className={`h-2 flex-1 rounded ${currentPage >= 1 ? 'bg-primary' : 'bg-gray-200'}`}
              />
              <div
                className={`h-2 flex-1 rounded ${currentPage >= 2 ? 'bg-primary' : 'bg-gray-200'}`}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentPage} of 2
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {submitError && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {currentPage === 1 && (
                <>
                  {/* Personal Information */}
                  <div className="space-y-4 p-3 sm:p-6 rounded-lg border">
                    <h3 className="text-xl font-bold">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nuid">NUID</Label>
                        <Input
                          id="nuid"
                          {...register('nuid')}
                          disabled={isSubmitting}
                        />
                        {errors.nuid && (
                          <p className="text-sm text-destructive">
                            {errors.nuid.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          disabled={isSubmitting}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          placeholder="(XXX) XXX-XXXX"
                          {...register('phoneNumber')}
                        />
                        {errors.phoneNumber && (
                          <p className="text-sm text-destructive">
                            {errors.phoneNumber.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fullName">
                          Full Name (as it appears on official documents)
                        </Label>
                        <Input id="fullName" {...register('fullName')} />
                        {errors.fullName && (
                          <p className="text-sm text-destructive">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preferredFullName">
                          Preferred Full Name{' '}
                          <span className="text-muted-foreground">
                            (optional)
                          </span>
                        </Label>
                        <Input
                          id="preferredFullName"
                          {...register('preferredFullName')}
                          disabled={isSubmitting}
                        />
                        {errors.preferredFullName && (
                          <p className="text-sm text-destructive">
                            {errors.preferredFullName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nickname">
                          Nickname{' '}
                          <span className="text-muted-foreground">
                            (optional)
                          </span>
                        </Label>
                        <Input
                          id="nickname"
                          {...register('nickname')}
                          disabled={isSubmitting}
                        />
                        {errors.nickname && (
                          <p className="text-sm text-destructive">
                            {errors.nickname.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneticPronunciation">
                          Phonetic Pronunciation
                        </Label>
                        <Input
                          id="phoneticPronunciation"
                          {...register('phoneticPronunciation')}
                          disabled={isSubmitting}
                        />
                        {errors.phoneticPronunciation && (
                          <p className="text-sm text-destructive">
                            {errors.phoneticPronunciation.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pronouns">Pronouns</Label>
                        <Input
                          id="pronouns"
                          {...register('pronouns')}
                          disabled={isSubmitting}
                        />
                        {errors.pronouns && (
                          <p className="text-sm text-destructive">
                            {errors.pronouns.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Audio Recording</Label>
                        <VoiceRecorder
                          onRecordingComplete={handleAudioRecordingComplete}
                          onRecordingDelete={handleAudioRecordingDelete}
                          disabled={isSubmitting || isUploadingAudio}
                          maxDuration={30}
                        />
                        {isUploadingAudio && (
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Uploading audio...
                          </p>
                        )}
                        {errors.pronunciationAudioUrl && (
                          <p className="text-sm text-destructive">
                            {errors.pronunciationAudioUrl.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 col-span-1 md:col-span-2">
                        <p className="text-sm text-muted-foreground">
                          Please provide the phonetic pronunciation and audio
                          recording of your <strong>last name</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4 p-3 sm:p-6 rounded-lg border">
                    <h3 className="text-xl font-bold">Academic Information</h3>

                    <div className="space-y-2">
                      <Label>
                        College{' '}
                        <span className="text-sm text-muted-foreground">
                          (Select all that apply)
                        </span>
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2 sm:p-4 rounded-md border">
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
                          <div
                            key={collegeName}
                            className="flex items-center space-x-3 py-1"
                          >
                            <Checkbox
                              id={`college-${collegeName}`}
                              checked={colleges.includes(collegeName)}
                              onCheckedChange={(checked) => {
                                const newColleges = checked
                                  ? [...colleges, collegeName]
                                  : colleges.filter((c) => c !== collegeName);
                                setValue('college', newColleges, {
                                  shouldValidate: true,
                                });
                                // Reset constituency if it's no longer in the selected colleges
                                if (!newColleges.includes(constituency)) {
                                  setValue('constituency', '', {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                            <Label
                              htmlFor={`college-${collegeName}`}
                              className="text-sm font-normal cursor-pointer leading-snug"
                            >
                              {collegeName}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.college && (
                        <p className="text-sm text-destructive">
                          {errors.college.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="major">Major</Label>
                        <Input
                          id="major"
                          {...register('major')}
                          disabled={isSubmitting}
                        />
                        {errors.major && (
                          <p className="text-sm text-destructive">
                            {errors.major.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minors">
                          Minors{' '}
                          <span className="text-muted-foreground">
                            (optional)
                          </span>
                        </Label>
                        <Input
                          id="minors"
                          {...register('minors')}
                          disabled={isSubmitting}
                        />
                        {errors.minors && (
                          <p className="text-sm text-destructive">
                            {errors.minors.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select
                        value={watch('year')}
                        onValueChange={(value) => {
                          setValue('year', value, { shouldValidate: true });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st year">1st year</SelectItem>
                          <SelectItem value="2nd year">2nd year</SelectItem>
                          <SelectItem value="3rd year">3rd year</SelectItem>
                          <SelectItem value="4th year">4th year</SelectItem>
                          <SelectItem value="5th+ year">5th+ year</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.year && (
                        <p className="text-sm text-destructive">
                          {errors.year.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Constituency */}
                  <div className="space-y-4 p-3 sm:p-6 rounded-lg border">
                    <h3 className="text-xl font-bold">Constituency</h3>

                    <div className="space-y-2">
                      <Label htmlFor="constituency">
                        Academic Constituency
                        <span className="block text-sm text-muted-foreground font-normal mt-1">
                          Students in double or combined majors may select
                          either college
                        </span>
                      </Label>
                      <Select
                        value={constituency}
                        onValueChange={(value) => {
                          setValue('constituency', value, {
                            shouldValidate: true,
                          });
                        }}
                        disabled={colleges.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              colleges.length === 0
                                ? 'Please select college(s) first'
                                : 'Select constituency'
                            }
                          />
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
                        <p className="text-sm text-destructive">
                          {errors.constituency.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="communityConstituency">
                        Community Constituency
                        <span className="block text-sm text-muted-foreground font-normal mt-1">
                          Select the community constituency you identify with
                        </span>
                      </Label>
                      <SearchableSelect
                        value={watch('communityConstituencyId')}
                        onValueChange={(value) => {
                          setValue('communityConstituencyId', value, {
                            shouldValidate: true,
                          });
                        }}
                        options={communityConstituencies.map((c) => ({
                          value: c.id,
                          label: c.name,
                        }))}
                        placeholder="Search and select community constituency"
                        disabled={communityConstituencies.length === 0}
                      />
                      {errors.communityConstituencyId && (
                        <p className="text-sm text-destructive">
                          {errors.communityConstituencyId.message}
                        </p>
                      )}
                      {communityConstituencies.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No community constituencies available
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        If you wish to represent a community constituency that
                        isn't listed, please contact the Speaker of the Senate
                        at{' '}
                        <a
                          href="mailto:sgasenatespeaker@northeastern.edu"
                          className="text-primary hover:underline"
                        >
                          sgaSenateSpeaker@northeastern.edu
                        </a>
                        .
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleNextPage}
                    className="w-full h-12 font-bold text-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    Next <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              )}

              {currentPage === 2 && (
                <>
                  {/* Long Answer Questions */}
                  <div className="space-y-6">
                    <div className="space-y-4 p-3 sm:p-6 rounded-lg border">
                      <h3 className="text-xl font-bold">
                        Application Questions
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Please answer the following questions about your
                        interest in Senate
                      </p>

                      <div className="space-y-2">
                        <Label htmlFor="whySenateLongAnswer">
                          The Student Government Association (SGA) has several
                          committees, boards, and working groups spanning
                          different areas of the student experience. Talk about
                          why you're choosing to become part of Senate – what
                          makes this opportunity stand out and what specific
                          aspects of Senate motivated you to apply.
                        </Label>
                        <textarea
                          id="whySenateLongAnswer"
                          className="w-full min-h-[120px] px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Please provide a detailed response (minimum 50 characters)"
                          {...register('whySenateLongAnswer')}
                        />
                        {errors.whySenateLongAnswer && (
                          <p className="text-sm text-destructive">
                            {errors.whySenateLongAnswer.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="constituencyIssueLongAnswer">
                          As a Senator, you'll be representing your community
                          and academic constituency in addition to serving as an
                          advocate for all students of Northeastern University.
                          Describe an issue facing both your academic
                          constituency and your community constituency. How will
                          you equitably advocate on behalf of all of these
                          parties while in the Senate Chambers?
                        </Label>
                        <textarea
                          id="constituencyIssueLongAnswer"
                          className="w-full min-h-[120px] px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Please provide a detailed response (minimum 50 characters)"
                          {...register('constituencyIssueLongAnswer')}
                        />
                        {errors.constituencyIssueLongAnswer && (
                          <p className="text-sm text-destructive">
                            {errors.constituencyIssueLongAnswer.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="diversityEquityInclusionLongAnswer">
                          Now more than ever principles of diversity, equity,
                          and inclusion need to be purposefully implemented and
                          considered in all aspects of the Association's
                          activities. Your fellow Huskies may not be aware of
                          the different perspectives within underrepresented
                          communities on campus. In your own words, define
                          diversity, equity, and inclusion and describe what
                          these terms mean to you. Additionally, explain how you
                          will embody principles of diversity, equity, and
                          inclusion during your time in Senate? How will you
                          contribute to our efforts to ensure the voices and
                          needs of Northeastern's diverse populations are heard?
                        </Label>
                        <textarea
                          id="diversityEquityInclusionLongAnswer"
                          className="w-full min-h-[120px] px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Please provide a detailed response (minimum 50 characters)"
                          {...register('diversityEquityInclusionLongAnswer')}
                        />
                        {errors.diversityEquityInclusionLongAnswer && (
                          <p className="text-sm text-destructive">
                            {errors.diversityEquityInclusionLongAnswer.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="conflictSituationLongAnswer">
                          Talk about a time you were faced with a conflict or
                          difficult situation. How did you handle it – and how
                          has it impacted the person you are today?
                        </Label>
                        <textarea
                          id="conflictSituationLongAnswer"
                          className="w-full min-h-[120px] px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Please provide a detailed response (minimum 50 characters)"
                          {...register('conflictSituationLongAnswer')}
                        />
                        {errors.conflictSituationLongAnswer && (
                          <p className="text-sm text-destructive">
                            {errors.conflictSituationLongAnswer.message}
                          </p>
                        )}
                      </div>
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
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
