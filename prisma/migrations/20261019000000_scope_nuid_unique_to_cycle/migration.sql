-- DropIndex
DROP INDEX "public"."applications_nuid_key";

-- CreateIndex
CREATE UNIQUE INDEX "applications_nuid_cycleId_key" ON "applications"("nuid", "cycleId");
