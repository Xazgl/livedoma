-- CreateTable
CREATE TABLE "constructionApplications" (
    "id" TEXT NOT NULL,
    "translator" TEXT NOT NULL,
    "responsibleMain" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "postMeetingStage" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "typeApplication" TEXT NOT NULL,
    "contactedClient" TEXT NOT NULL,
    "campaignUtm" TEXT,
    "termUtm" TEXT,
    "nextAction" TEXT,
    "rejection" TEXT,
    "errorReejctionDone" BOOLEAN,
    "datecallCenter" TEXT,
    "timecallCenter" TEXT,
    "timesaletCenter" TEXT,
    "dateFirstContact" TEXT,
    "phone" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "constructionApplications_pkey" PRIMARY KEY ("id")
);
