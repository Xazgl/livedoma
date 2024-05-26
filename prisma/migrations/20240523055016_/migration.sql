/*
  Warnings:

  - You are about to drop the column `adress` on the `InparseObjects` table. All the data in the column will be lost.
  - Added the required column `address` to the `InparseObjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InparseObjects" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT NOT NULL;
