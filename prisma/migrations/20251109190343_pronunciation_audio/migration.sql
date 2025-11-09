/*
  Warnings:

  - Added the required column `pronunciationAudioUrl` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "pronunciationAudioUrl" TEXT NOT NULL;
