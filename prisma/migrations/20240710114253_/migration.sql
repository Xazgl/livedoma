-- AlterTable
ALTER TABLE "InparseObjects" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SmartAgentObjects" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT[],
ADD COLUMN     "source_url" TEXT;
