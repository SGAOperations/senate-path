'use client';

import { Container, Typography, Paper, Box } from '@mui/material';

export default function NominationsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Nominate a Senator
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph>
            Nomination form will be migrated here from the old frontend.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page is under construction and will include the full nomination form.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
