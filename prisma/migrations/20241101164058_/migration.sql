/*
  Warnings:

  - Made the column `mangoUtm` on table `constructionApplications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "constructionApplications" ALTER COLUMN "mangoUtm" SET NOT NULL;
