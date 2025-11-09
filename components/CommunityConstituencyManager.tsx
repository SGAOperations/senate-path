'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit2, Trash2, Check, X, AlertCircle, Upload, Info } from 'lucide-react';
import { CommunityConstituency } from '@prisma/client';
import {
  addCommunityConstituency,
  editCommunityConstituency,
  toggleCommunityConstituencyStatus,
  removeCommunityConstituency,
  uploadConstituenciesFromCSV,
} from '@/lib/actions/community-constituencies';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CommunityConstituencyManagerProps {
  constituencies: CommunityConstituency[];
}

export default function CommunityConstituencyManager({
  constituencies,
}: CommunityConstituencyManagerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim()) {
      setError('Name is required');
      return;
    }

    setIsAdding(true);
    setError(null);

    const result = await addCommunityConstituency({
      name: newName,
      isActive: true,
    });

    if (result.success) {
      toast.success('Community constituency added successfully');
      setNewName('');
      router.refresh();
    } else {
      setError(result.error || 'Failed to add community constituency');
    }

    setIsAdding(false);
  };

  const handleEdit = async (id: string) => {
    if (!editingName.trim()) {
      setError('Name is required');
      return;
    }

    setError(null);

    const result = await editCommunityConstituency(id, {
      name: editingName,
    });

    if (result.success) {
      toast.success('Community constituency updated successfully');
      setEditingId(null);
      setEditingName('');
      router.refresh();
    } else {
      setError(result.error || 'Failed to update community constituency');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleCommunityConstituencyStatus(id, !currentStatus);

    if (result.success) {
      toast.success(
        `Community constituency ${!currentStatus ? 'enabled' : 'disabled'} successfully`
      );
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this community constituency?')) {
      return;
    }

    const result = await removeCommunityConstituency(id);

    if (result.success) {
      toast.success('Community constituency deleted successfully');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete community constituency');
    }
  };

  const startEdit = (constituency: CommunityConstituency) => {
    setEditingId(constituency.id);
    setEditingName(constituency.name);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setError(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const text = await file.text();
      const result = await uploadConstituenciesFromCSV(text);

      if (result.success) {
        toast.success(result.message || 'CSV uploaded successfully');
        router.refresh();
      } else {
        if (result.partialSuccess) {
          toast.warning('Partial upload completed. Check details below.');
        }
        setError(result.error || 'Failed to upload CSV');
      }
    } catch (error) {
      setError('Error reading CSV file');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Constituency */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Community Constituency</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="whitespace-pre-wrap">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {/* Manual Add */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="new-name">Constituency Name</Label>
                <Input
                  id="new-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter constituency name"
                  disabled={isAdding}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAdd();
                    }
                  }}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAdd} disabled={isAdding || !newName.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Constituency
                </Button>
              </div>
            </div>

            {/* CSV Upload */}
            <div className="border-t pt-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Label htmlFor="csv-upload">Or Upload CSV File</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="csv-upload"
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="cursor-pointer"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowInstructions(!showInstructions)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {showInstructions && (
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">CSV Format Instructions:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>One constituency name per line</li>
                        <li>Optional header row with "name" or "Name" (will be skipped)</li>
                        <li>Names can be quoted or unquoted</li>
                        <li>Empty lines will be ignored</li>
                      </ul>
                      <p className="font-semibold mt-3">Example CSV:</p>
                      <pre className="bg-muted p-2 rounded text-xs mt-1">
{`name
Asian Students
Black Students
LGBTQ+ Community
International Students`}
                      </pre>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Constituencies List */}
      <Card>
        <CardHeader>
          <CardTitle>Constituencies ({constituencies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {constituencies.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No community constituencies added yet. Add one above to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {constituencies.map((constituency) => (
                  <TableRow key={constituency.id}>
                    <TableCell>
                      {editingId === constituency.id ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleEdit(constituency.id);
                            } else if (e.key === 'Escape') {
                              cancelEdit();
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium">{constituency.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={constituency.isActive ? 'success' : 'default'}>
                        {constituency.isActive ? 'Active' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(constituency.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {editingId === constituency.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleEdit(constituency.id)}
                              disabled={!editingName.trim()}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(constituency)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={constituency.isActive ? 'outline' : 'default'}
                              onClick={() =>
                                handleToggleStatus(constituency.id, constituency.isActive)
                              }
                            >
                              {constituency.isActive ? 'Disable' : 'Enable'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(constituency.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
