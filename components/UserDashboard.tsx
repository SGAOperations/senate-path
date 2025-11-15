'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, User, Vote, TrendingDown, AlertCircle, X } from 'lucide-react';
import { Application, Nomination } from '@prisma/client';

type ApplicationWithNominations = Application & {
  nominations: Nomination[];
  nominationCount: number;
};

interface UserDashboardProps {
  getApplicationByNuid: (nuid: string) => Promise<ApplicationWithNominations | null>;
}

function getNominationBadgeColor(count: number): "success" | "warning" | "info" | "default" {
  if (count >= 30) return "success";  // Green for 30+
  if (count >= 25) return "warning";  // Yellow for 25-30
  if (count >= 2) return "info";      // Orange for 2-24
  return "default";                   // Gray for 0-1
}

export default function UserDashboard({ getApplicationByNuid }: UserDashboardProps) {
  const [nuid, setNuid] = useState('');
  const [applicantDetails, setApplicantDetails] = useState<ApplicationWithNominations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuid || nuid.length !== 9) {
      setError('Please enter a valid 9-digit NUID');
      return;
    }

    setLoading(true);
    setError(null);
    setApplicantDetails(null);

    try {
      const data = await getApplicationByNuid(nuid);
      if (!data) {
        setError('No application found for this NUID. Please make sure you have submitted an application.');
      } else {
        setApplicantDetails(data);
      }
    } catch (error) {
      console.error('Error fetching applicant details:', error);
      setError('Failed to load your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const missingNominations = applicantDetails 
    ? Math.max(0, 30 - applicantDetails.nominationCount)
    : 0;

  return (
    <div>
      {/* Search Form */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl">Enter Your NUID</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter your 9-digit NUID..."
                value={nuid}
                onChange={(e) => setNuid(e.target.value)}
                maxLength={9}
                pattern="[0-9]*"
                disabled={loading}
                className="h-12 text-base"
              />
            </div>
            <Button type="submit" disabled={loading} className="h-12 text-base w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'View My Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>

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

      {/* Overview Stats */}
      {applicantDetails && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-base sm:text-lg font-semibold">Your Application</h3>
                </div>
                <p className="text-xl sm:text-2xl font-bold truncate">{applicantDetails.fullName}</p>
                <p className="text-sm text-muted-foreground truncate">{applicantDetails.constituency}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center mb-2">
                  <Vote className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-base sm:text-lg font-semibold">Total Nominations</h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold">{applicantDetails.nominationCount}</p>
                <p className="text-sm text-muted-foreground">approved nominations</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center mb-2">
                  <TrendingDown className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-base sm:text-lg font-semibold">Missing Nominations</h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold">{missingNominations}</p>
                <p className="text-sm text-muted-foreground">needed to reach 30</p>
              </CardContent>
            </Card>
          </div>

          {/* Application Details */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Your Information</CardTitle>
                <Badge variant={getNominationBadgeColor(applicantDetails.nominationCount)} className="text-sm">
                  {applicantDetails.nominationCount} Nominations
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">NUID</p>
                      <p className="font-medium break-all">{applicantDetails.nuid}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium break-all">{applicantDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Preferred Name</p>
                      <p className="font-medium">{applicantDetails.preferredFullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pronouns</p>
                      <p className="font-medium">{applicantDetails.pronouns}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium break-all">{applicantDetails.phoneNumber}</p>
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Name Pronunciation</p>
                      <p className="font-medium mb-2">{applicantDetails.phoneticPronunciation}</p>
                      {applicantDetails.pronunciationAudioUrl && (
                        <div className="flex items-center gap-2">
                          <audio 
                            controls 
                            className="h-10 w-full max-w-md"
                            preload="none"
                          >
                            <source src={applicantDetails.pronunciationAudioUrl} type="audio/webm" />
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
                      <p className="text-sm text-muted-foreground">College</p>
                      <p className="font-medium">{applicantDetails.college}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Major</p>
                      <p className="font-medium">{applicantDetails.major}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Minors</p>
                      <p className="font-medium">{applicantDetails.minors || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-medium">{applicantDetails.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Constituency</p>
                      <p className="font-medium">{applicantDetails.constituency}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nominations */}
          {applicantDetails.nominations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Your Nominations ({applicantDetails.nominations.length} total)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {applicantDetails.nominations.map((nomination) => (
                    <Card key={nomination.id}>
                      <CardContent className="pt-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{nomination.fullName}</p>
                            <p className="text-sm text-muted-foreground truncate">{nomination.email}</p>
                          </div>
                          <Badge variant="outline" className="self-start">{nomination.status}</Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mt-2">
                          <div>
                            <span className="text-muted-foreground">College:</span> {nomination.college}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Major:</span> {nomination.major}
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-muted-foreground">Submitted:</span>{' '}
                            {new Date(nomination.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {applicantDetails.nominations.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You haven't received any nominations yet. Share your candidacy with your constituents!
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}
