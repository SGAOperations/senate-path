'use client';

import { Container, Typography, Paper, Box, TextField, Button, Grid, MenuItem, Alert, FormControlLabel, Checkbox } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { submitNomination } from '@/lib/actions/nominations';
import { useRouter } from 'next/navigation';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NominationFormData>({
    resolver: zodResolver(nominationSchema),
    defaultValues: {
      receiveSenatorInfo: false,
    },
  });

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Nominate a Senator
        </Typography>

        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Know someone who would make a great senator? Nominate them here! Please ensure they have submitted their application before nominating them.
        </Typography>

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Nomination submitted successfully! Redirecting to home page...
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {/* Nominator Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Your Information (Nominator)
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Your Full Name"
                {...register('fullName')}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Your Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                placeholder="your.email@northeastern.edu"
              />
            </Grid>

            {/* Nominee Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Nominee Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nominee Full Name"
                {...register('nominee')}
                error={!!errors.nominee}
                helperText={errors.nominee?.message}
                placeholder="Enter the name of the person you're nominating"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Nominee's College"
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
                label="Nominee's Major"
                {...register('major')}
                error={!!errors.major}
                helperText={errors.major?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nominee's Graduation Year"
                type="number"
                {...register('graduationYear', { valueAsNumber: true })}
                error={!!errors.graduationYear}
                helperText={errors.graduationYear?.message}
                placeholder="2025"
              />
            </Grid>

            <Grid item xs={12} md={6}>
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

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...register('receiveSenatorInfo')}
                    defaultChecked={false}
                  />
                }
                label="I would like to receive information about becoming a senator"
              />
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
                {isSubmitting ? 'Submitting...' : 'Submit Nomination'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

