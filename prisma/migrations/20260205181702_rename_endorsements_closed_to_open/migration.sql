-- AlterTable: Rename column and invert the boolean logic
ALTER TABLE "settings" RENAME COLUMN "endorsementsClosed" TO "endorsementsOpen";

-- Update existing values to invert the logic (closed=false becomes open=true, closed=true becomes open=false)
UPDATE "settings" SET "endorsementsOpen" = NOT "endorsementsOpen";
