-- AlterTable
ALTER TABLE "Tilda" ADD COLUMN     "intrumId" TEXT,
ADD COLUMN     "intrumUrl" TEXT,
ADD COLUMN     "ok_cz" BOOLEAN DEFAULT false,
ADD COLUMN     "ok_manager" BOOLEAN DEFAULT false,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "timeCall" TEXT,
ADD COLUMN     "timeManager" TEXT;

-- AlterTable
ALTER TABLE "Wazzup" ADD COLUMN     "intrumId" TEXT,
ADD COLUMN     "intrumUrl" TEXT,
ADD COLUMN     "ok_cz" BOOLEAN DEFAULT false,
ADD COLUMN     "ok_manager" BOOLEAN DEFAULT false,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "timeCall" TEXT,
ADD COLUMN     "timeManager" TEXT;
