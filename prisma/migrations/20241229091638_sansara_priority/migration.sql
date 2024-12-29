/*
  Warnings:

  - Added the required column `sansara_priority` to the `ActiveManagers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActiveManagers" ADD COLUMN     "sansara_priority" INTEGER NOT NULL;
