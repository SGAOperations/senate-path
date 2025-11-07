-- Enable UUID extension (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- AlterTable: Change users.id from SERIAL to UUID
ALTER TABLE "users" DROP CONSTRAINT "users_pkey";
ALTER TABLE "users" DROP COLUMN "id";
ALTER TABLE "users" ADD COLUMN "id" UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AlterTable: Change applications.id from SERIAL to UUID
ALTER TABLE "applications" DROP CONSTRAINT "applications_pkey";
ALTER TABLE "applications" DROP COLUMN "id";
ALTER TABLE "applications" ADD COLUMN "id" UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE "applications" ADD CONSTRAINT "applications_pkey" PRIMARY KEY ("id");

-- AlterTable: Change nominations.id from SERIAL to UUID
ALTER TABLE "nominations" DROP CONSTRAINT "nominations_pkey";
ALTER TABLE "nominations" DROP COLUMN "id";
ALTER TABLE "nominations" ADD COLUMN "id" UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE "nominations" ADD CONSTRAINT "nominations_pkey" PRIMARY KEY ("id");
