-- CreateTable
CREATE TABLE "ManagerRansomQueue" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "url" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManagerRansomQueue_pkey" PRIMARY KEY ("id")
);
