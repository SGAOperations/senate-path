-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "requiredNominations" INTEGER NOT NULL DEFAULT 15,
    "maxCommunityNominations" INTEGER NOT NULL DEFAULT 7,
    "endorsementRequired" BOOLEAN NOT NULL DEFAULT false,
    "applicationDeadline" TIMESTAMP(3),
    "applicationsOpen" BOOLEAN NOT NULL DEFAULT true,
    "nominationsOpen" BOOLEAN NOT NULL DEFAULT true,
    "customMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
