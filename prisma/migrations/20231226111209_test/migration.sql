-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "id_intrum" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "operationType" TEXT NOT NULL,
    "state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Test_id_intrum_key" ON "Test"("id_intrum");
