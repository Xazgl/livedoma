-- CreateTable
CREATE TABLE "ReviewLink" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "objectIds" TEXT[],

    CONSTRAINT "ReviewLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewLink_identifier_key" ON "ReviewLink"("identifier");
