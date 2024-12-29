-- AlterTable
ALTER TABLE "ActiveManagers" ALTER COLUMN "company_JDD_active" SET DEFAULT false,
ALTER COLUMN "company_Sansara_active" SET DEFAULT false,
ALTER COLUMN "sansara_priority" DROP NOT NULL;
