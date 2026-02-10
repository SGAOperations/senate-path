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
import { Search, User, Vote, TrendingUp, Download, AlertCircle, X, Trash2 } from 'lucide-react';
import { Application, Nomination, Endorsement, CommunityConstituency } from '@prisma/client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { removeNominationFormPDF } from '@/lib/actions/applications';
import { toast } from 'sonner';
import { Settings } from '@/lib/data/settings';

type NominationWithCommunity = Nomination & {
  communityConstituency: { name: string } | null;
};

type ApplicationWithCount = Application & {
  nominationCount: number;
  endorsementCount: number;
  communityConstituency: { name: string } | null;
};

type ApplicationWithNominations = Application & {
  nominations: NominationWithCommunity[];
  endorsements: Endorsement[];
  nominationCount: number;
  communityConstituency: { name: string } | null;
};

interface AdminDashboardProps {
  applications: ApplicationWithCount[];
  getApplicationDetails: (id: string) => Promise<ApplicationWithNominations | null>;
  settings: Settings;
}

function getNominationBadgeColor(count: number, requiredNominations: number): "success" | "warning" | "info" | "default" {
  if (count >= requiredNominations) return "success";  // Green for meeting requirement
  if (count >= Math.floor(requiredNominations * 0.8)) return "warning";  // Yellow for 80%+
  if (count >= 2) return "info";      // Orange for 2+
  return "default";                   // Gray for 0-1
}

export default function AdminDashboard({ applications, getApplicationDetails, settings }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicationWithCount | null>(null);
  const [applicantDetails, setApplicantDetails] = useState<ApplicationWithNominations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRemovingPdf, setIsRemovingPdf] = useState(false);

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

  const handleRemovePdf = async () => {
    if (!selectedApplicant) return;

    if (!confirm('Are you sure you want to remove this paper nomination PDF? The nominee will be able to upload a new form or collect online nominations.')) {
      return;
    }

    setIsRemovingPdf(true);
    setError(null);

    try {
      const result = await removeNominationFormPDF(selectedApplicant.nuid);

      if (result.success) {
        toast.success('Paper nomination PDF removed successfully');
        // Refresh the applicant details
        const refreshed = await getApplicationDetails(selectedApplicant.id);
        setApplicantDetails(refreshed);
        // Also update selectedApplicant to remove the PDF URL
        setSelectedApplicant({ ...selectedApplicant, nominationFormPdfUrl: null });
      } else {
        setError(result.error || 'Failed to remove PDF');
        toast.error(result.error || 'Failed to remove PDF');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setIsRemovingPdf(false);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-base sm:text-lg font-semibold">Total Applications</h3>
            </div>
            <p className="text-3xl sm:text-4xl font-bold">{totalApplications}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center mb-2">
              <Vote className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-base sm:text-lg font-semibold">Total Nominations</h3>
            </div>
            <p className="text-3xl sm:text-4xl font-bold">{totalNominations}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-base sm:text-lg font-semibold">Avg Nominations</h3>
            </div>
            <p className="text-3xl sm:text-4xl font-bold">{avgNominationsPerApplicant}</p>
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
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, NUID, or constituency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        <Link
          href="/api/export"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "flex items-center justify-center gap-2 cursor-pointer h-12 text-base w-full sm:w-auto",
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
              <CardTitle className="text-xl sm:text-2xl">Applicants ({filteredApplications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-auto">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[180px]">Name</TableHead>
                        <TableHead className="min-w-[150px]">Constituency</TableHead>
                        <TableHead className="text-center min-w-[100px]">Nominations</TableHead>
                        <TableHead className="text-center min-w-[100px]">Endorsed</TableHead>
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
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">{app.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="whitespace-nowrap">{app.constituency}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {app.nominationFormPdfUrl ? (
                              <Badge variant="info" className="text-xs">
                                Paper Form
                              </Badge>
                            ) : app.nominationCount > 0 ? (
                              <Badge variant={getNominationBadgeColor(app.nominationCount, settings.requiredNominations)}>
                                {app.nominationCount}
                              </Badge>
                            ) : (
                              <Badge variant="default">0</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {app.endorsementCount > 0 ? (
                              <Badge variant="success">✓</Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applicant Details */}
        {selectedApplicant && (
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-xl sm:text-2xl truncate">{selectedApplicant.fullName}</CardTitle>
                  {selectedApplicant.nominationFormPdfUrl ? (
                    <Badge variant="info" className="text-sm self-start sm:self-auto">
                      Paper Form Uploaded
                    </Badge>
                  ) : (
                    <Badge variant={getNominationBadgeColor(selectedApplicant.nominationCount, settings.requiredNominations)} className="text-sm self-start sm:self-auto">
                      {selectedApplicant.nominationCount} Nominations
                    </Badge>
                  )}
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">NUID</p>
                          <p className="font-medium break-all">{selectedApplicant.nuid}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium break-all">{selectedApplicant.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Preferred Name</p>
                          <p className="font-medium">{selectedApplicant.preferredFullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Pronouns</p>
                          <p className="font-medium">{selectedApplicant.pronouns}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium break-all">{selectedApplicant.phoneNumber}</p>
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                          <p className="text-sm text-muted-foreground mb-1">Name Pronunciation</p>
                          <p className="font-medium mb-2">{selectedApplicant.phoneticPronunciation}</p>
                          {selectedApplicant.pronunciationAudioUrl && (
                            <div className="flex items-center gap-2">
                              <audio 
                                controls 
                                className="h-10 w-full max-w-md"
                                preload="none"
                              >
                                <source src={selectedApplicant.pronunciationAudioUrl} type="audio/webm" />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4" />

                    {/* Academic Information */}
                    <div>
                      <h3 className="text-lg font-bold mb-3">Academic Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">College(s)</p>
                          <p className="font-medium">{selectedApplicant.college}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Major(s)</p>
                          <p className="font-medium">{selectedApplicant.major}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Minor(s)</p>
                          <p className="font-medium">{selectedApplicant.minors || 'None'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Year</p>
                          <p className="font-medium">{selectedApplicant.year}</p>
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                          <p className="text-sm text-muted-foreground">Academic Constituency</p>
                          <p className="font-medium">{selectedApplicant.constituency}</p>
                        </div>
                        {selectedApplicant.communityConstituency && (
                          <div className="col-span-1 sm:col-span-2">
                            <p className="text-sm text-muted-foreground">Community Constituency</p>
                            <p className="font-medium">{selectedApplicant.communityConstituency.name}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4" />

                    {/* Application Questions */}
                    <div>
                      <h3 className="text-lg font-bold mb-3">Application Questions</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Why Senate?</p>
                          <p className="text-sm">{selectedApplicant.whySenateLongAnswer}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Constituency Issue</p>
                          <p className="text-sm">{selectedApplicant.constituencyIssueLongAnswer}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Diversity, Equity, & Inclusion</p>
                          <p className="text-sm">{selectedApplicant.diversityEquityInclusionLongAnswer}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Conflict Situation</p>
                          <p className="text-sm">{selectedApplicant.conflictSituationLongAnswer}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Campaign Blurb</p>
                          <p className="text-sm">{selectedApplicant.campaignBlurb}</p>
                        </div>
                      </div>
                    </div>

                    {/* Paper Nomination Form */}
                    {selectedApplicant.nominationFormPdfUrl && (
                      <>
                        <div className="border-t pt-4" />
                        <div>
                          <h3 className="text-lg font-bold mb-3">Paper Nomination Form</h3>
                          <div className="space-y-4">
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                <div className="space-y-3">
                                  <div>
                                    <p className="font-semibold">Paper nomination form uploaded</p>
                                    <p className="text-sm mt-1">This nominee submitted their {settings.requiredNominations} nomination signatures via PDF instead of online nominations.</p>
                                  </div>
                                  <div className="flex gap-2 flex-wrap">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(selectedApplicant.nominationFormPdfUrl!, '_blank', 'noopener,noreferrer')}
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      View PDF
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={handleRemovePdf}
                                      disabled={isRemovingPdf}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      {isRemovingPdf ? 'Removing...' : 'Remove PDF'}
                                    </Button>
                                  </div>
                                </div>
                              </AlertDescription>
                            </Alert>
                            
                            <div className="bg-muted p-4 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                To reject this paper nomination, click "Remove PDF" above. The nominee will then be able to collect online nominations or upload a new paper form.
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

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
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium truncate">{nomination.fullName}</p>
                                      <p className="text-sm text-muted-foreground truncate">{nomination.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Badge variant="outline" className="self-start">{nomination.status}</Badge>
                                      {nomination.constituencyType === 'community' && nomination.communityConstituency ? (
                                        <Badge variant="secondary" className="self-start text-xs border border-gray-400 dark:border-gray-500">Community</Badge>
                                      ) : nomination.constituencyType === 'academic' ? (
                                        <Badge variant="outline" className="self-start text-xs border-gray-400 dark:border-gray-500">Academic</Badge>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mt-2">
                                    {nomination.constituencyType === 'community' && nomination.communityConstituency ? (
                                      <>
                                        <div>
                                          <span className="text-muted-foreground">Community Constituency:</span> {nomination.communityConstituency.name}
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Major(s):</span> {nomination.major}
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div>
                                          <span className="text-muted-foreground">College(s):</span> {nomination.college}
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Major(s):</span> {nomination.major}
                                        </div>
                                      </>
                                    )}
                                    <div className="sm:col-span-2">
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

                    {/* Endorsements */}
                    {applicantDetails && applicantDetails.endorsements.length > 0 && (
                      <>
                        <div className="border-t pt-4" />
                        <div>
                          <h3 className="text-lg font-bold mb-3">
                            Endorsements
                          </h3>
                          <div className="space-y-3">
                            {applicantDetails.endorsements.map((endorsement) => (
                              <Card key={endorsement.id}>
                                <CardContent className="pt-4">
                                  <div className="mb-3">
                                    <p className="font-medium">{endorsement.endorserName}</p>
                                    <p className="text-sm text-muted-foreground">{endorsement.endorserEmail}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Submitted: {new Date(endorsement.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="space-y-3 text-sm">
                                    <div>
                                      <p className="font-semibold text-muted-foreground mb-1">Defining Traits:</p>
                                      <p className="text-foreground">{endorsement.definingTraits}</p>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-muted-foreground mb-1">Leadership Qualities:</p>
                                      <p className="text-foreground">{endorsement.leadershipQualities}</p>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-muted-foreground mb-1">Areas for Development:</p>
                                      <p className="text-foreground">{endorsement.areasForDevelopment}</p>
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
