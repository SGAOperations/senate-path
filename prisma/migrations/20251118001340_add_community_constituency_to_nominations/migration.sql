-- AlterTable
ALTER TABLE "nominations" ADD COLUMN     "communityConstituencyId" TEXT,
ADD COLUMN     "constituencyType" TEXT;

-- AddForeignKey
ALTER TABLE "nominations" ADD CONSTRAINT "nominations_communityConstituencyId_fkey" FOREIGN KEY ("communityConstituencyId") REFERENCES "community_constituencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
