-- CreateEnum
CREATE TYPE "EndorsementStatus" AS ENUM ('REQUIRED', 'NOT_REQUIRED', 'CLOSED');

-- AlterTable: Add new column with default, migrate data, then drop old column
ALTER TABLE "settings" ADD COLUMN "endorsementStatus" "EndorsementStatus" NOT NULL DEFAULT 'NOT_REQUIRED';

-- Migrate existing data: true -> REQUIRED, false -> NOT_REQUIRED
UPDATE "settings" SET "endorsementStatus" = CASE 
  WHEN "endorsementRequired" = true THEN 'REQUIRED'::"EndorsementStatus"
  ELSE 'NOT_REQUIRED'::"EndorsementStatus"
END;

-- Drop old column
ALTER TABLE "settings" DROP COLUMN "endorsementRequired";
