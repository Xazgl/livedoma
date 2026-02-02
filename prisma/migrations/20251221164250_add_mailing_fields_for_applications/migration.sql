-- AlterTable
ALTER TABLE "constructionApplications" ADD COLUMN     "mailing" BOOLEAN DEFAULT false,
ADD COLUMN     "mailingCreatedAtCrm" TEXT;
