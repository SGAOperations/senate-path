'use client';

import { Container, Typography, Paper, Box } from '@mui/material';

export default function ApplicationsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Submit Your Application
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph>
            Application form will be migrated here from the old frontend.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page is under construction and will include the full application form with all fields.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
