'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { Application, Nomination } from '@prisma/client';

type ApplicationWithCount = Application & {
  nominationCount: number;
};

type ApplicationWithNominations = Application & {
  nominations: Nomination[];
  nominationCount: number;
};

interface AdminDashboardProps {
  applications: ApplicationWithCount[];
}

export default function AdminDashboard({ applications }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicationWithCount | null>(null);
  const [applicantDetails, setApplicantDetails] = useState<ApplicationWithNominations | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredApplications = applications.filter(
    (app) =>
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.nuid.includes(searchTerm) ||
      app.constituency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectApplicant = async (app: ApplicationWithCount) => {
    setSelectedApplicant(app);
    setLoading(true);
    
    try {
      // Fetch full details with nominations
      const response = await fetch(`/api/applications/${app.id}`);
      const data = await response.json();
      setApplicantDetails(data);
    } catch (error) {
      console.error('Error fetching applicant details:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalApplications = applications.length;
  const totalNominations = applications.reduce((sum, app) => sum + app.nominationCount, 0);
  const avgNominationsPerApplicant = totalApplications > 0 
    ? (totalNominations / totalApplications).toFixed(1) 
    : 0;

  return (
    <Box>
      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Applications</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {totalApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HowToVoteIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Nominations</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {totalNominations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Avg Nominations
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {avgNominationsPerApplicant}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search by name, email, NUID, or constituency..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {/* Applicants List */}
        <Grid item xs={12} md={selectedApplicant ? 5 : 12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Applicants ({filteredApplications.length})
            </Typography>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Constituency</strong></TableCell>
                    <TableCell align="center"><strong>Nominations</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow
                      key={app.id}
                      hover
                      onClick={() => handleSelectApplicant(app)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: selectedApplicant?.id === app.id ? 'action.selected' : 'inherit',
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {app.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {app.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={app.constituency} size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={app.nominationCount}
                          color={app.nominationCount >= 5 ? 'success' : app.nominationCount >= 2 ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Applicant Details */}
        {selectedApplicant && (
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                {selectedApplicant.fullName}
              </Typography>
              <Chip
                label={`${selectedApplicant.nominationCount} Nominations`}
                color={selectedApplicant.nominationCount >= 5 ? 'success' : selectedApplicant.nominationCount >= 2 ? 'warning' : 'default'}
                sx={{ mb: 3 }}
              />

              <Divider sx={{ my: 2 }} />

              {/* Personal Information */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Personal Information
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">NUID</Typography>
                  <Typography variant="body1">{selectedApplicant.nuid}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{selectedApplicant.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Preferred Name</Typography>
                  <Typography variant="body1">{selectedApplicant.preferredFullName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Nickname</Typography>
                  <Typography variant="body1">{selectedApplicant.nickname}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Pronouns</Typography>
                  <Typography variant="body1">{selectedApplicant.pronouns}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{selectedApplicant.phoneNumber}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Academic Information */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Academic Information
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">College</Typography>
                  <Typography variant="body1">{selectedApplicant.college}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Major</Typography>
                  <Typography variant="body1">{selectedApplicant.major}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Minors</Typography>
                  <Typography variant="body1">{selectedApplicant.minors || 'None'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Year</Typography>
                  <Typography variant="body1">{selectedApplicant.year}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Semester</Typography>
                  <Typography variant="body1">{selectedApplicant.semester}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Constituency</Typography>
                  <Chip label={selectedApplicant.constituency} size="small" />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Nominations */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Nominations Received ({selectedApplicant.nominationCount})
              </Typography>

              {loading ? (
                <Typography>Loading nominations...</Typography>
              ) : applicantDetails && applicantDetails.nominations.length > 0 ? (
                <List>
                  {applicantDetails.nominations.map((nomination, index) => (
                    <ListItem
                      key={nomination.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {nomination.fullName || 'Anonymous'}
                            </Typography>
                            <Chip
                              label={nomination.status}
                              size="small"
                              color={nomination.status === 'APPROVED' ? 'success' : 'default'}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Email: {nomination.email || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              College: {nomination.college || 'N/A'} | Major: {nomination.major || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Submitted: {new Date(nomination.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">No nominations received yet.</Alert>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
