'use client';

import { Container, Typography, Paper, Box } from '@mui/material';

export default function AdminPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph>
            Admin interface will be migrated here from the old frontend.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page is under construction and will include tables for managing applications and nominations.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
