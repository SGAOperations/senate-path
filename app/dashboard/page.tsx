'use client';

import { Container, Typography, Paper, Box } from '@mui/material';

export default function DashboardPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Dashboard
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph>
            User dashboard will be migrated here from the old frontend.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page is under construction and will show nomination statistics and user data.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
