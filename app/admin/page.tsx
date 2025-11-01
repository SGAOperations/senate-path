import { Container, Typography, Paper, Box } from '@mui/material';
import { getApplicationsWithNominationCounts, getApplicationWithNominations } from '@/lib/data/applications';
import AdminDashboard from '@/components/AdminDashboard';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const applications = await getApplicationsWithNominationCounts();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Admin Dashboard
        </Typography>
        <AdminDashboard applications={applications} />
      </Paper>
    </Container>
  );
}
