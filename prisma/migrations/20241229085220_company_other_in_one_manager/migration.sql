/*
  Warnings:

  - You are about to drop the column `company` on the `ActiveManagers` table. All the data in the column will be lost.
  - Added the required column `company_JDD` to the `ActiveManagers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_Sansara` to the `ActiveManagers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActiveManagers" DROP COLUMN "company",
ADD COLUMN     "company_JDD" BOOLEAN NOT NULL,
ADD COLUMN     "company_Sansara" BOOLEAN NOT NULL;
