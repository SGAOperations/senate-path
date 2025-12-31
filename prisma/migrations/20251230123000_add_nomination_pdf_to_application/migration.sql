-- AlterTable
-- Add nominationFormPdfUrl to applications table to allow nominees to upload PDF with 30 signatures
ALTER TABLE "applications" ADD COLUMN "nominationFormPdfUrl" TEXT;
