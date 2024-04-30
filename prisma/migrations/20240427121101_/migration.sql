/*
  Warnings:

  - A unique constraint covering the columns `[idApplicationIntrum]` on the table `constructionApplications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idApplicationIntrum` to the `constructionApplications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "constructionApplications" ADD COLUMN     "idApplicationIntrum" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "constructionApplications_idApplicationIntrum_key" ON "constructionApplications"("idApplicationIntrum");
