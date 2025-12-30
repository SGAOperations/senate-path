-- Add nominationFormPdfUrl to applications table
ALTER TABLE "applications" ADD COLUMN "nominationFormPdfUrl" TEXT;

-- Remove nominationFormPdfUrl from nominations table
ALTER TABLE "nominations" DROP COLUMN IF EXISTS "nominationFormPdfUrl";
