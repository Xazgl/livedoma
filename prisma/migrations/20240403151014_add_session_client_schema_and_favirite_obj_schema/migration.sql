-- CreateTable
CREATE TABLE "SessionClient" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteObjectsToObj" (
    "sessionId" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,

    CONSTRAINT "FavoriteObjectsToObj_pkey" PRIMARY KEY ("sessionId","objectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionClient_sessionToken_key" ON "SessionClient"("sessionToken");

-- AddForeignKey
ALTER TABLE "FavoriteObjectsToObj" ADD CONSTRAINT "FavoriteObjectsToObj_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SessionClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteObjectsToObj" ADD CONSTRAINT "FavoriteObjectsToObj_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ObjectIntrum"("id") ON DELETE CASCADE ON UPDATE CASCADE;
