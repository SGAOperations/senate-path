-- CreateTable
CREATE TABLE "endorsements" (
    "id" TEXT NOT NULL,
    "endorserName" TEXT NOT NULL,
    "endorserEmail" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "definingTraits" TEXT NOT NULL,
    "leadershipQualities" TEXT NOT NULL,
    "areasForDevelopment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "endorsements_pkey" PRIMARY KEY ("id")
);
