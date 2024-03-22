/*
  Warnings:

  - Added the required column `sendCrm` to the `Wazzup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wazzup" ADD COLUMN     "sendCrm" BOOLEAN NOT NULL;
