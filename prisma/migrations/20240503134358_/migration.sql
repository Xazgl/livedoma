-- AlterTable
ALTER TABLE "Sales" ALTER COLUMN "responsibleMain" DROP NOT NULL,
ALTER COLUMN "partCommissionSeller" DROP NOT NULL,
ALTER COLUMN "sumCommissionBuyer" DROP NOT NULL;
