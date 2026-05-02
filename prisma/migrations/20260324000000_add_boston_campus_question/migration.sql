-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "bostonCampus" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "applications" ADD COLUMN     "bostonCampusExplanation" TEXT;
