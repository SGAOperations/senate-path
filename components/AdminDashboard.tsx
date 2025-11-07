'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, User, Vote, TrendingUp, Download, AlertCircle, X } from 'lucide-react';
import { Application, Nomination } from '@prisma/client';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type ApplicationWithCount = Application & {
  nominationCount: number;
};

type ApplicationWithNominations = Application & {
  nominations: Nomination[];
  nominationCount: number;
};

interface AdminDashboardProps {
  applications: ApplicationWithCount[];
  getApplicationDetails: (id: number) => Promise<ApplicationWithNominations | null>;
}

function getNominationBadgeColor(count: number): "success" | "warning" | "info" | "default" {
  if (count >= 30) return "success";  // Green for 30+
  if (count >= 25) return "warning";  // Yellow for 25-30
  if (count >= 2) return "info";      // Orange for 2-24
  return "default";                   // Gray for 0-1
}

export default function AdminDashboard({ applications, getApplicationDetails }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicationWithCount | null>(null);
  const [applicantDetails, setApplicantDetails] = useState<ApplicationWithNominations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const data = await getApplicationDetails(app.id);
      setApplicantDetails(data);
    } catch (error) {
      console.error('Error fetching applicant details:', error);
      setError('Failed to load applicant details. Please try again.');
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
    <div>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold">Total Applications</h3>
            </div>
            <p className="text-4xl font-bold">{totalApplications}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <Vote className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold">Total Nominations</h3>
            </div>
            <p className="text-4xl font-bold">{totalNominations}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold">Avg Nominations</h3>
            </div>
            <p className="text-4xl font-bold">{avgNominationsPerApplicant}</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Toast */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 hover:opacity-70"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Export */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, NUID, or constituency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Link
          href="/api/export"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "flex items-center gap-2 cursor-pointer",
            applications.length === 0 && "pointer-events-none opacity-50"
          )}
          aria-disabled={applications.length === 0}
        >
          <Download className="h-4 w-4" />
          Export to CSV
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Applicants List */}
        <div className={selectedApplicant ? "lg:col-span-5" : "lg:col-span-12"}>
          <Card>
            <CardHeader>
              <CardTitle>Applicants ({filteredApplications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Constituency</TableHead>
                      <TableHead className="text-center">Nominations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow
                        key={app.id}
                        onClick={() => handleSelectApplicant(app)}
                        className={`cursor-pointer ${selectedApplicant?.id === app.id ? 'bg-muted' : ''}`}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{app.fullName}</div>
                            <div className="text-sm text-muted-foreground">{app.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{app.constituency}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getNominationBadgeColor(app.nominationCount)}>
                            {app.nominationCount}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applicant Details */}
        {selectedApplicant && (
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{selectedApplicant.fullName}</CardTitle>
                  <Badge variant={getNominationBadgeColor(selectedApplicant.nominationCount)} className="text-sm">
                    {selectedApplicant.nominationCount} Nominations
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading details...</p>
                ) : (
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-bold mb-3">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">NUID</p>
                          <p className="font-medium">{selectedApplicant.nuid}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{selectedApplicant.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Preferred Name</p>
                          <p className="font-medium">{selectedApplicant.preferredFullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Nickname</p>
                          <p className="font-medium">{selectedApplicant.nickname}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Pronouns</p>
                          <p className="font-medium">{selectedApplicant.pronouns}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{selectedApplicant.phoneNumber}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4" />

                    {/* Academic Information */}
                    <div>
                      <h3 className="text-lg font-bold mb-3">Academic Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">College</p>
                          <p className="font-medium">{selectedApplicant.college}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Major</p>
                          <p className="font-medium">{selectedApplicant.major}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Minors</p>
                          <p className="font-medium">{selectedApplicant.minors || 'None'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Year</p>
                          <p className="font-medium">{selectedApplicant.year}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Semester</p>
                          <p className="font-medium">{selectedApplicant.semester}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Constituency</p>
                          <p className="font-medium">{selectedApplicant.constituency}</p>
                        </div>
                      </div>
                    </div>

                    {/* Nominations */}
                    {applicantDetails && applicantDetails.nominations.length > 0 && (
                      <>
                        <div className="border-t pt-4" />
                        <div>
                          <h3 className="text-lg font-bold mb-3">
                            Nominations ({applicantDetails.nominations.length})
                          </h3>
                          <div className="space-y-3">
                            {applicantDetails.nominations.map((nomination) => (
                              <Card key={nomination.id}>
                                <CardContent className="pt-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="font-medium">{nomination.fullName}</p>
                                      <p className="text-sm text-muted-foreground">{nomination.email}</p>
                                    </div>
                                    <Badge variant="outline">{nomination.status}</Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                    <div>
                                      <span className="text-muted-foreground">College:</span> {nomination.college}
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Major:</span> {nomination.major}
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Submitted:</span>{' '}
                                      {new Date(nomination.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
