'use client';

import { Container, Typography, Paper, Box } from '@mui/material';

export default function LoginPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Login
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph textAlign="center">
            Login form will be migrated here from the old frontend.
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            This page is under construction.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
