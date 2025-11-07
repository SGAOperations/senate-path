-- CreateTable
CREATE TABLE "endorsements" (
    "id" SERIAL NOT NULL,
    "endorserName" TEXT NOT NULL,
    "endorserEmail" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "definingTraits" TEXT NOT NULL,
    "leadershipQualities" TEXT NOT NULL,
    "areasForDevelopment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "endorsements_pkey" PRIMARY KEY ("id")
);
