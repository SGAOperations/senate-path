'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AdminDashboard from '@/components/AdminDashboard';
import NominationsManager from '@/components/NominationsManager';
import SettingsForm from '@/app/admin/settings/settings-form';
import { EndorsementsView } from './endorsements-view';
import { Settings } from '@/lib/data/settings';
import { Endorsement, Nomination, Application } from '@prisma/client';

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

interface CycleDashboardCycle {
  id: string;
  name: string;
  isActive: boolean;
}

interface CycleDashboardProps {
  cycle: CycleDashboardCycle;
  applications: ApplicationWithCount[];
  getApplicationDetails: (id: string) => Promise<ApplicationWithNominations | null>;
  nominations: NominationWithCommunity[];
  endorsements: Endorsement[];
  settings: Settings | null;
}

export function CycleDashboard({
  cycle,
  applications,
  getApplicationDetails,
  nominations,
  endorsements,
  settings,
}: CycleDashboardProps) {
  const defaultSettings: Settings = settings ?? {
    id: '',
    requiredNominations: 15,
    maxCommunityNominations: 7,
    endorsementRequired: false,
    endorsementsOpen: true,
    applicationDeadline: null,
    applicationsOpen: true,
    nominationsOpen: true,
    customMessage: null,
    cycleId: cycle.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div className="container max-w-[1600px] mx-auto py-3 sm:py-6 px-3 sm:px-4">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/cycles"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Cycle Archive
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{cycle.name}</h1>
          <Badge variant={cycle.isActive ? 'success' : 'secondary'}>
            {cycle.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="applications">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="nominations">Nominations</TabsTrigger>
          <TabsTrigger value="endorsements">Endorsements</TabsTrigger>
          {settings !== null && (
            <TabsTrigger value="settings">Settings</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="applications">
          <AdminDashboard
            applications={applications}
            getApplicationDetails={getApplicationDetails}
            settings={defaultSettings}
            readOnly={!cycle.isActive}
          />
        </TabsContent>

        <TabsContent value="nominations">
          <NominationsManager
            nominations={nominations}
            settings={defaultSettings}
            readOnly={!cycle.isActive}
          />
        </TabsContent>

        <TabsContent value="endorsements">
          <EndorsementsView endorsements={endorsements} />
        </TabsContent>

        {settings !== null && (
          <TabsContent value="settings">
            <SettingsForm settings={settings} readOnly />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
