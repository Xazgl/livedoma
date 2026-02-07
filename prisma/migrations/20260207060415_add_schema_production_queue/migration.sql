-- CreateTable
CREATE TABLE "ManagerProductionQueue" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "url" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManagerProductionQueue_pkey" PRIMARY KEY ("id")
);
