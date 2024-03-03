/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ObjectIntrum" ALTER COLUMN "leaseCommissionSize" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Test";
