'use client';

import { Container, Typography, Paper, Box, TextField, Button, Grid, MenuItem, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { submitApplication } from '@/lib/actions/applications';
import { useRouter } from 'next/navigation';

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
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

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
        setSubmitSuccess(true);
        reset();
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Senator Application
        </Typography>

        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Thank you for your interest in becoming a Senator! Please fill out all fields below.
        </Typography>

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Application submitted successfully! Redirecting to home page...
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Personal Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="NUID"
                {...register('nuid')}
                error={!!errors.nuid}
                helperText={errors.nuid?.message}
                placeholder="000000000"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                placeholder="student@northeastern.edu"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name (as it appears on official documents)"
                {...register('fullName')}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Preferred Full Name"
                {...register('preferredFullName')}
                error={!!errors.preferredFullName}
                helperText={errors.preferredFullName?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nickname"
                {...register('nickname')}
                error={!!errors.nickname}
                helperText={errors.nickname?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phonetic Pronunciation"
                {...register('phoneticPronunciation')}
                error={!!errors.phoneticPronunciation}
                helperText={errors.phoneticPronunciation?.message}
                placeholder="How to pronounce your name"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Pronouns"
                {...register('pronouns')}
                error={!!errors.pronouns}
                helperText={errors.pronouns?.message}
                placeholder="e.g., he/him, she/her, they/them"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                {...register('phoneNumber')}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                placeholder="(XXX) XXX-XXXX"
              />
            </Grid>

            {/* Academic Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Academic Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="College"
                {...register('college')}
                error={!!errors.college}
                helperText={errors.college?.message}
                defaultValue=""
              >
                <MenuItem value="College of Arts, Media and Design">College of Arts, Media and Design</MenuItem>
                <MenuItem value="D'Amore-McKim School of Business">D'Amore-McKim School of Business</MenuItem>
                <MenuItem value="Khoury College of Computer Sciences">Khoury College of Computer Sciences</MenuItem>
                <MenuItem value="College of Engineering">College of Engineering</MenuItem>
                <MenuItem value="Bouvé College of Health Sciences">Bouvé College of Health Sciences</MenuItem>
                <MenuItem value="College of Science">College of Science</MenuItem>
                <MenuItem value="College of Social Sciences and Humanities">College of Social Sciences and Humanities</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Major"
                {...register('major')}
                error={!!errors.major}
                helperText={errors.major?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minors (if any)"
                {...register('minors')}
                error={!!errors.minors}
                helperText={errors.minors?.message}
                placeholder="Leave blank if none"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Year"
                {...register('year', { valueAsNumber: true })}
                error={!!errors.year}
                helperText={errors.year?.message}
                defaultValue=""
              >
                <MenuItem value={1}>1 (Freshman)</MenuItem>
                <MenuItem value={2}>2 (Sophomore)</MenuItem>
                <MenuItem value={3}>3 (Middler)</MenuItem>
                <MenuItem value={4}>4 (Junior)</MenuItem>
                <MenuItem value={5}>5 (Senior)</MenuItem>
                <MenuItem value={6}>6+ (Graduate)</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Semester Applying For"
                {...register('semester')}
                error={!!errors.semester}
                helperText={errors.semester?.message}
                defaultValue=""
              >
                <MenuItem value="Fall 2025">Fall 2025</MenuItem>
                <MenuItem value="Spring 2026">Spring 2026</MenuItem>
                <MenuItem value="Fall 2026">Fall 2026</MenuItem>
                <MenuItem value="Spring 2027">Spring 2027</MenuItem>
              </TextField>
            </Grid>

            {/* Constituency */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Constituency
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Constituency"
                {...register('constituency')}
                error={!!errors.constituency}
                helperText={errors.constituency?.message}
                defaultValue=""
              >
                <MenuItem value="CAMD">College of Arts, Media and Design</MenuItem>
                <MenuItem value="DMSB">D'Amore-McKim School of Business</MenuItem>
                <MenuItem value="Khoury">Khoury College of Computer Sciences</MenuItem>
                <MenuItem value="COE">College of Engineering</MenuItem>
                <MenuItem value="Bouve">Bouvé College of Health Sciences</MenuItem>
                <MenuItem value="COS">College of Science</MenuItem>
                <MenuItem value="CSSH">College of Social Sciences and Humanities</MenuItem>
                <MenuItem value="Explore">Explore (Undeclared)</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{ py: 1.5, fontWeight: 'bold' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

