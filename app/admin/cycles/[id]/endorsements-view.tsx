'use client';

import { Endorsement } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface EndorsementsViewProps {
  endorsements: Endorsement[];
}

export function EndorsementsView({ endorsements }: EndorsementsViewProps) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Endorsements ({endorsements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {endorsements.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No endorsements for this cycle.
            </p>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Endorser</TableHead>
                    <TableHead>Endorser Email</TableHead>
                    <TableHead>Defining Traits</TableHead>
                    <TableHead>Leadership Qualities</TableHead>
                    <TableHead>Areas for Development</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {endorsements.map((endorsement) => (
                    <TableRow key={endorsement.id}>
                      <TableCell className="font-medium">
                        {endorsement.applicantName}
                      </TableCell>
                      <TableCell>{endorsement.endorserName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {endorsement.endorserEmail}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {endorsement.definingTraits}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {endorsement.leadershipQualities}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {endorsement.areasForDevelopment}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(endorsement.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
