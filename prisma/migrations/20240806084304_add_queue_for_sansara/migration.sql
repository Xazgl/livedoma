-- CreateTable
CREATE TABLE "ManagerSansaraQueue" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "url" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManagerSansaraQueue_pkey" PRIMARY KEY ("id")
);
