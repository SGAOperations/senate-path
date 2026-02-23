-- CreateTable
CREATE TABLE "cycles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "cycles_pkey" PRIMARY KEY ("id")
);

-- Insert default active cycle
INSERT INTO "cycles" ("id", "name", "isActive", "updatedAt")
VALUES ('default-cycle', 'Current Cycle', true, CURRENT_TIMESTAMP);

-- AlterTable: add nullable cycleId to applications first
ALTER TABLE "applications" ADD COLUMN "cycleId" TEXT;

-- Migrate existing applications to default cycle
UPDATE "applications" SET "cycleId" = 'default-cycle';

-- Make cycleId NOT NULL
ALTER TABLE "applications" ALTER COLUMN "cycleId" SET NOT NULL;

-- AlterTable: add nullable cycleId to nominations first
ALTER TABLE "nominations" ADD COLUMN "cycleId" TEXT;

-- Migrate existing nominations to default cycle
UPDATE "nominations" SET "cycleId" = 'default-cycle';

-- Make cycleId NOT NULL
ALTER TABLE "nominations" ALTER COLUMN "cycleId" SET NOT NULL;

-- AlterTable: add nullable cycleId to endorsements first
ALTER TABLE "endorsements" ADD COLUMN "cycleId" TEXT;

-- Migrate existing endorsements to default cycle
UPDATE "endorsements" SET "cycleId" = 'default-cycle';

-- Make cycleId NOT NULL
ALTER TABLE "endorsements" ALTER COLUMN "cycleId" SET NOT NULL;

-- AlterTable: add nullable cycleId to settings first
ALTER TABLE "settings" ADD COLUMN "cycleId" TEXT;

-- Migrate existing settings record to default cycle
UPDATE "settings" SET "cycleId" = 'default-cycle';

-- Make cycleId NOT NULL and add unique constraint
ALTER TABLE "settings" ALTER COLUMN "cycleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nominations" ADD CONSTRAINT "nominations_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endorsements" ADD CONSTRAINT "endorsements_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "settings_cycleId_key" ON "settings"("cycleId");
