-- AlterTable
ALTER TABLE "nominations" ADD COLUMN "constituencyType" TEXT,
ADD COLUMN "communityConstituencyId" TEXT,
ADD CONSTRAINT "nominations_communityConstituencyId_fkey" FOREIGN KEY ("communityConstituencyId") REFERENCES "community_constituencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "nominations_communityConstituencyId_idx" ON "nominations"("communityConstituencyId");
