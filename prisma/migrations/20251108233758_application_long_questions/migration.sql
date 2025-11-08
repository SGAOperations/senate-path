/*
  Warnings:

  - Added the required column `conflictSituationLongAnswer` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constituencyIssueLongAnswer` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diversityEquityInclusionLongAnswer` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whySenateLongAnswer` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "conflictSituationLongAnswer" TEXT NOT NULL,
ADD COLUMN     "constituencyIssueLongAnswer" TEXT NOT NULL,
ADD COLUMN     "diversityEquityInclusionLongAnswer" TEXT NOT NULL,
ADD COLUMN     "whySenateLongAnswer" TEXT NOT NULL;
