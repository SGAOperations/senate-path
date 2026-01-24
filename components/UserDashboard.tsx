'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, User, Vote, TrendingDown, AlertCircle, X, Upload, FileText, Download } from 'lucide-react';
import { Application, Nomination, CommunityConstituency } from '@prisma/client';
import { uploadNominationFormPDF, removeNominationFormPDF } from '@/lib/actions/applications';
import { toast } from 'sonner';
import { REQUIRED_NOMINATIONS, MAX_COMMUNITY_NOMINATIONS } from '@/lib/config/requirements';

type NominationWithCommunity = Nomination & {
  communityConstituency: { name: string } | null;
};

type ApplicationWithNominations = Application & {
  nominations: NominationWithCommunity[];
  nominationCount: number;
  communityConstituency: { name: string } | null;
};

interface UserDashboardProps {
  getApplicationByNuid: (nuid: string) => Promise<ApplicationWithNominations | null>;
}

// TEMPORARY: Updated thresholds for Issue #148 - Original was 30/25 for success/warning
function getNominationBadgeColor(count: number): "success" | "warning" | "info" | "default" {
  if (count >= REQUIRED_NOMINATIONS) return "success";  // Green for meeting requirement
  if (count >= Math.floor(REQUIRED_NOMINATIONS * 0.8)) return "warning";  // Yellow for 80%+
  if (count >= 2) return "info";      // Orange for 2+
  return "default";                   // Gray for 0-1
}

export default function UserDashboard({ getApplicationByNuid }: UserDashboardProps) {
  const [nuid, setNuid] = useState('');
  const [applicantDetails, setApplicantDetails] = useState<ApplicationWithNominations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // TEMPORARY: Updated for Issue #148 - Original was 30
  const missingNominations = applicantDetails 
    ? Math.max(0, REQUIRED_NOMINATIONS - applicantDetails.nominationCount)
    : 0;

  const communityNominationCount = applicantDetails
    ? applicantDetails.nominations.filter(n => n.status === 'APPROVED' && n.constituencyType === 'community').length
    : 0;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        setPdfFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('File size must be less than 10MB');
        setPdfFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setPdfFile(file);
      setError(null);
    }
  };

  const handlePdfUpload = async () => {
    if (!pdfFile || !applicantDetails) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('nuid', applicantDetails.nuid);

      const result = await uploadNominationFormPDF(formData);

      if (result.success) {
        toast.success('Nomination form PDF uploaded successfully!');
        // Refresh the application data
        const refreshed = await getApplicationByNuid(applicantDetails.nuid);
        if (refreshed) {
          setApplicantDetails(refreshed);
        }
        setPdfFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setError(result.error || 'Failed to upload PDF');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePdf = async () => {
    if (!applicantDetails) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await removeNominationFormPDF(applicantDetails.nuid);

      if (result.success) {
        toast.success('Nomination form PDF removed successfully!');
        // Refresh the application data
        const refreshed = await getApplicationByNuid(applicantDetails.nuid);
        if (refreshed) {
          setApplicantDetails(refreshed);
        }
      } else {
        setError(result.error || 'Failed to remove PDF');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

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
                  <h3 className="text-base sm:text-lg font-semibold">
                    {applicantDetails.nominationFormPdfUrl ? 'Nomination Status' : 'Total Nominations'}
                  </h3>
                </div>
                {applicantDetails.nominationFormPdfUrl ? (
                  <>
                    <p className="text-xl sm:text-2xl font-bold text-info">Paper Form</p>
                    <p className="text-sm text-muted-foreground">uploaded successfully</p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl sm:text-4xl font-bold">{applicantDetails.nominationCount}</p>
                    <p className="text-sm text-muted-foreground">submitted nominations</p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center mb-2">
                  <TrendingDown className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-base sm:text-lg font-semibold">
                    {applicantDetails.nominationFormPdfUrl ? 'Nomination Method' : 'Missing Nominations'}
                  </h3>
                </div>
                {applicantDetails.nominationFormPdfUrl ? (
                  <>
                    <p className="text-xl sm:text-2xl font-bold">Paper</p>
                    {/* TEMPORARY: Updated for Issue #148 - Original was "30 signatures" */}
                    <p className="text-sm text-muted-foreground">{REQUIRED_NOMINATIONS} signatures in PDF</p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl sm:text-4xl font-bold">{missingNominations}</p>
                    {/* TEMPORARY: Updated for Issue #148 - Original was "needed to reach 30" */}
                    <p className="text-sm text-muted-foreground">needed to reach {REQUIRED_NOMINATIONS}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Warning about community nominations limit - TEMPORARY: Updated for Issue #148 */}
          {communityNominationCount > MAX_COMMUNITY_NOMINATIONS && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> You have {communityNominationCount} approved community constituency nominations. Only {MAX_COMMUNITY_NOMINATIONS} nominations may come from community constituencies.
              </AlertDescription>
            </Alert>
          )}

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
                      <p className="text-sm text-muted-foreground">College(s)</p>
                      <p className="font-medium">{applicantDetails.college}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Major(s)</p>
                      <p className="font-medium">{applicantDetails.major}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Minor(s)</p>
                      <p className="font-medium">{applicantDetails.minors || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-medium">{applicantDetails.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Academic Constituency</p>
                      <p className="font-medium">{applicantDetails.constituency}</p>
                    </div>
                    {applicantDetails.communityConstituency && (
                      <div>
                        <p className="text-sm text-muted-foreground">Community Constituency</p>
                        <p className="font-medium">{applicantDetails.communityConstituency.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paper Nomination Form Upload */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Paper Nomination Form</CardTitle>
              {/* TEMPORARY: Updated for Issue #148 - Original was "all 30 nomination signatures" */}
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Alternative to online nominations:</strong> Upload a single PDF containing all {REQUIRED_NOMINATIONS} nomination signatures you collected from constituents.
              </p>
            </CardHeader>
            <CardContent>
              {(() => {
                const hasOnlineNominations = applicantDetails.nominations.some(
                  n => n.status === 'APPROVED' || n.status === 'PENDING'
                );
                
                if (hasOnlineNominations && !applicantDetails.nominationFormPdfUrl) {
                  return (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Paper nomination upload is disabled.</strong>
                        <p className="mt-2">You have existing online nominations (pending or approved). You must choose either online nominations OR paper upload, not both.</p>
                        <p className="mt-2">If you want to use paper nominations instead, all online nominations must be removed first.</p>
                      </AlertDescription>
                    </Alert>
                  );
                }

                if (applicantDetails.nominationFormPdfUrl) {
                  return (
                    <div className="space-y-4">
                      <Alert>
                        <FileText className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-center justify-between">
                            <span>Your nomination form PDF has been uploaded.</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(applicantDetails.nominationFormPdfUrl!, '_blank', 'noopener,noreferrer')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              View PDF
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                      <Button
                        variant="destructive"
                        onClick={handleRemovePdf}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Removing...' : 'Remove PDF'}
                      </Button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <p className="font-semibold mb-2">Instructions:</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Download the paper nomination form from the{' '}
                            <a 
                              href="https://northeasternsga.com/senate-election" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              SGA website (Senate Elections page)
                            </a>
                          </li>
                          {/* TEMPORARY: Updated for Issue #148 - Original was "Collect 30 nomination signatures" */}
                          <li>Collect {REQUIRED_NOMINATIONS} nomination signatures from your constituents on the paper form</li>
                          <li>Scan the completed form as a PDF</li>
                          <li>Upload the PDF below (max 10MB)</li>
                        </ol>
                        <p className="mt-2 text-sm">
                          <strong>Note:</strong> This is an alternative to having constituents submit nominations online. Choose either paper OR online nominations, not both.
                        </p>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <label htmlFor="pdfFile" className="text-sm font-medium">
                        Nomination Form PDF (Max 10MB)
                      </label>
                      <Input
                        id="pdfFile"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        disabled={isUploading}
                      />
                      {pdfFile && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handlePdfUpload}
                      disabled={!pdfFile || isUploading}
                      className="w-full sm:w-auto"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Nomination Form'}
                    </Button>
                  </div>
                );
              })()}
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
