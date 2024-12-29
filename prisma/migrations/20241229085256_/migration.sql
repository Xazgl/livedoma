/*
  Warnings:

  - You are about to drop the column `active` on the `ActiveManagers` table. All the data in the column will be lost.
  - You are about to drop the column `company_JDD` on the `ActiveManagers` table. All the data in the column will be lost.
  - You are about to drop the column `company_Sansara` on the `ActiveManagers` table. All the data in the column will be lost.
  - Added the required column `company_JDD_active` to the `ActiveManagers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_Sansara_active` to the `ActiveManagers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActiveManagers" DROP COLUMN "active",
DROP COLUMN "company_JDD",
DROP COLUMN "company_Sansara",
ADD COLUMN     "company_JDD_active" BOOLEAN NOT NULL,
ADD COLUMN     "company_Sansara_active" BOOLEAN NOT NULL;
