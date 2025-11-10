-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "communityConstituencyId" TEXT,
ALTER COLUMN "pronunciationAudioUrl" DROP DEFAULT;

-- CreateTable
CREATE TABLE "community_constituencies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_constituencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "community_constituencies_name_key" ON "community_constituencies"("name");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_communityConstituencyId_fkey" FOREIGN KEY ("communityConstituencyId") REFERENCES "community_constituencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
