-- CreateTable
CREATE TABLE "VkApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "typeSend" TEXT,
    "timeForClientCall" TEXT DEFAULT '',
    "formid" INTEGER,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_content" TEXT,
    "utm_term" TEXT,
    "sendCrm" BOOLEAN NOT NULL,
    "answers" TEXT,
    "managerId" TEXT,
    "prodinfo" TEXT,
    "intrumId" TEXT,
    "intrumUrl" TEXT,
    "timeCall" TEXT,
    "ok_cz" BOOLEAN DEFAULT false,
    "timeManager" TEXT,
    "ok_manager" BOOLEAN DEFAULT false,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VkApplication_pkey" PRIMARY KEY ("id")
);
