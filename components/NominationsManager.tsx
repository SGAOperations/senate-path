'use client';

import { useState, useMemo, useEffect, useRef, useOptimistic } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, CheckCircle, XCircle, AlertCircle, Clock, Users } from 'lucide-react';
import { Nomination, CommunityConstituency, NominationStatus } from '@prisma/client';
import { approveNomination, rejectNomination, bulkApproveNominations, bulkRejectNominations } from '@/lib/actions/nominations';
import { toast } from 'sonner';
import { MAX_COMMUNITY_NOMINATIONS } from '@/lib/config/requirements';

type NominationWithCommunity = Nomination & {
  communityConstituency: { name: string } | null;
};

interface NominationsManagerProps {
  nominations: NominationWithCommunity[];
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'APPROVED':
      return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Approved</Badge>;
    case 'REJECTED':
      return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
    case 'PENDING':
      return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getConstituencyBadge(nom: NominationWithCommunity) {
  if (nom.constituencyType === 'community' && nom.communityConstituency) {
    return <Badge variant="secondary" className="text-xs border border-gray-400 dark:border-gray-500">Community: {nom.communityConstituency.name}</Badge>;
  } else if (nom.constituencyType === 'academic') {
    return <Badge variant="outline" className="text-xs border-gray-400 dark:border-gray-500">Academic: {nom.college}</Badge>;
  }
  // Fallback for old nominations without constituencyType
  return <Badge variant="outline" className="text-xs border-gray-400 dark:border-gray-500">{nom.college}</Badge>;
}

export default function NominationsManager({ nominations: initialNominations }: NominationsManagerProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isInitialMount = useRef(false);
  
  // Use optimistic updates for nominations
  const [optimisticNominations, updateOptimisticNominations] = useOptimistic(
    initialNominations,
    (state, { id, status, ids }: { id?: string; status?: NominationStatus; ids?: string[] }) => {
      if (ids && status) {
        // Bulk update
        return state.map(nom => 
          ids.includes(nom.id) ? { ...nom, status } : nom
        );
      } else if (id && status) {
        // Single update
        return state.map(nom => 
          nom.id === id ? { ...nom, status } : nom
        );
      }
      return state;
    }
  );
  
  // Initialize state from URL parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [nomineeFilter, setNomineeFilter] = useState<string>(searchParams.get('nominee') || 'all');
  const [sortBy, setSortBy] = useState<'date' | 'nominee' | 'status'>((searchParams.get('sort') as 'date' | 'nominee' | 'status') || 'date');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync state with URL parameters
  useEffect(() => {
    // Skip URL update on initial mount to prevent redundant history operations
    if (!isInitialMount.current) {
      isInitialMount.current = true;
      return;
    }
    
    const params = new URLSearchParams(searchParams);
    
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    
    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    } else {
      params.delete('status');
    }
    
    if (nomineeFilter !== 'all') {
      params.set('nominee', nomineeFilter);
    } else {
      params.delete('nominee');
    }
    
    if (sortBy !== 'date') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    window.history.replaceState(null, '', newUrl);
  }, [searchTerm, statusFilter, nomineeFilter, sortBy, pathname]);

  // Get unique nominees for filter
  const uniqueNominees = useMemo(() => {
    const nominees = new Set(optimisticNominations.map(n => n.nominee));
    return Array.from(nominees).sort();
  }, [optimisticNominations]);

  // Compute stats
  const stats = useMemo(() => {
    const total = optimisticNominations.length;
    const pending = optimisticNominations.filter(n => n.status === 'PENDING').length;
    const approved = optimisticNominations.filter(n => n.status === 'APPROVED').length;
    const rejected = optimisticNominations.filter(n => n.status === 'REJECTED').length;
    const communityApproved = optimisticNominations.filter(n => n.status === 'APPROVED' && n.constituencyType === 'community').length;
    
    // Count unique nominees
    const uniqueNomineesCount = new Set(optimisticNominations.map(n => n.nominee)).size;

    return { total, pending, approved, rejected, communityApproved, uniqueNominees: uniqueNomineesCount };
  }, [optimisticNominations]);

  // Filter and sort nominations
  const filteredNominations = useMemo(() => {
    let filtered = optimisticNominations.filter((nom) => {
      const matchesSearch = 
        nom.nominee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nom.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nom.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nom.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nom.major.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || nom.status === statusFilter;
      const matchesNominee = nomineeFilter === 'all' || nom.nominee === nomineeFilter;

      return matchesSearch && matchesStatus && matchesNominee;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nominee':
          return a.nominee.localeCompare(b.nominee);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [optimisticNominations, searchTerm, statusFilter, nomineeFilter, sortBy]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredNominations.map(n => n.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    // Optimistically update the UI
    updateOptimisticNominations({ id, status: NominationStatus.APPROVED });
    
    const result = await approveNomination(id);
    setIsProcessing(false);
    
    if (result.success) {
      toast.success('Nomination approved successfully');
      // Server action already called revalidatePath, no need to refresh
    } else {
      toast.error(result.error || 'Failed to approve nomination');
    }
  };

  const handleReject = async (id: string) => {
    setIsProcessing(true);
    // Optimistically update the UI
    updateOptimisticNominations({ id, status: NominationStatus.REJECTED });
    
    const result = await rejectNomination(id);
    setIsProcessing(false);
    
    if (result.success) {
      toast.success('Nomination rejected successfully');
      // Server action already called revalidatePath, no need to refresh
    } else {
      toast.error(result.error || 'Failed to reject nomination');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;
    
    setIsProcessing(true);
    const ids = Array.from(selectedIds);
    // Optimistically update the UI
    updateOptimisticNominations({ ids, status: NominationStatus.APPROVED });
    
    const result = await bulkApproveNominations(ids);
    setIsProcessing(false);
    
    if (result.success) {
      toast.success(`${selectedIds.size} nomination(s) approved successfully`);
      setSelectedIds(new Set());
      // Server action already called revalidatePath, no need to refresh
    } else {
      toast.error(result.error || 'Failed to approve nominations');
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) return;
    
    setIsProcessing(true);
    const ids = Array.from(selectedIds);
    // Optimistically update the UI
    updateOptimisticNominations({ ids, status: NominationStatus.REJECTED });
    
    const result = await bulkRejectNominations(ids);
    setIsProcessing(false);
    
    if (result.success) {
      toast.success(`${selectedIds.size} nomination(s) rejected successfully`);
      setSelectedIds(new Set());
      // Server action already called revalidatePath, no need to refresh
    } else {
      toast.error(result.error || 'Failed to reject nominations');
    }
  };

  const allSelected = filteredNominations.length > 0 && selectedIds.size === filteredNominations.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < filteredNominations.length;

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-sm font-semibold">Total</h3>
            </div>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 mr-2 text-yellow-600" />
              <h3 className="text-sm font-semibold">Pending</h3>
            </div>
            <p className="text-3xl font-bold">{stats.pending}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 mr-2 text-success" />
              <h3 className="text-sm font-semibold">Approved</h3>
            </div>
            <p className="text-3xl font-bold">{stats.approved}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <XCircle className="h-5 w-5 mr-2 text-error" />
              <h3 className="text-sm font-semibold">Rejected</h3>
            </div>
            <p className="text-3xl font-bold">{stats.rejected}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-sm font-semibold">Nominees</h3>
            </div>
            <p className="text-3xl font-bold">{stats.uniqueNominees}</p>
          </CardContent>
        </Card>
      </div>

      {/* Warning about community nominations limit - TEMPORARY: Updated for Issue #148 */}
      {stats.communityApproved > MAX_COMMUNITY_NOMINATIONS && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> There are {stats.communityApproved} approved community constituency nominations. Only {MAX_COMMUNITY_NOMINATIONS} nominations may come from the community constituencies.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Bulk Actions */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by nominee, nominator, email, college, or major..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={nomineeFilter} onValueChange={setNomineeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by nominee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Nominees</SelectItem>
            {uniqueNominees.map((nominee) => (
              <SelectItem key={nominee} value={nominee}>
                {nominee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'nominee' | 'status')}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date (Newest)</SelectItem>
            <SelectItem value="nominee">Nominee A-Z</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>

        {selectedIds.size > 0 && (
          <div className="flex gap-2">
            <Button 
              onClick={handleBulkApprove}
              disabled={isProcessing}
              variant="default"
              className="bg-success hover:bg-success/90"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve ({selectedIds.size})
            </Button>
            <Button 
              onClick={handleBulkReject}
              disabled={isProcessing}
              variant="destructive"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject ({selectedIds.size})
            </Button>
          </div>
        )}
      </div>

      {/* Nominations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nominations ({filteredNominations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                      className={someSelected ? "data-[state=checked]:bg-primary" : ""}
                    />
                  </TableHead>
                  <TableHead>Nominee</TableHead>
                  <TableHead>Nominator</TableHead>
                  <TableHead>Constituency</TableHead>
                  <TableHead>Major(s)</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNominations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No nominations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNominations.map((nom) => (
                    <TableRow key={nom.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(nom.id)}
                          onCheckedChange={(checked) => handleSelectOne(nom.id, checked as boolean)}
                          aria-label={`Select ${nom.nominee}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{nom.nominee}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{nom.fullName}</div>
                          <div className="text-xs text-muted-foreground">{nom.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getConstituencyBadge(nom)}
                      </TableCell>
                      <TableCell className="text-sm">{nom.major}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(nom.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(nom.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {nom.status !== 'APPROVED' && (
                            <Button
                              size="sm"
                              onClick={() => handleApprove(nom.id)}
                              disabled={isProcessing}
                              variant="outline"
                              className="border-success text-success hover:bg-success-muted"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                          )}
                          {nom.status !== 'REJECTED' && (
                            <Button
                              size="sm"
                              onClick={() => handleReject(nom.id)}
                              disabled={isProcessing}
                              variant="outline"
                              className="border-error text-error hover:bg-error-muted"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
