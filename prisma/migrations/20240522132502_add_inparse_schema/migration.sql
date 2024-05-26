-- CreateTable
CREATE TABLE "InparseObjects" (
    "id" TEXT NOT NULL,
    "idInparse" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "typeAd" TEXT,
    "sectionId" TEXT,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "adress" TEXT NOT NULL,
    "floor" TEXT,
    "floors" TEXT,
    "sq" TEXT,
    "sqLand" TEXT,
    "price" TEXT,
    "description" TEXT,
    "images" TEXT[],
    "lat" TEXT NOT NULL,
    "lng" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phones" TEXT[],
    "url" TEXT NOT NULL,
    "agent" TEXT,
    "source" TEXT,
    "sourceId" TEXT,

    CONSTRAINT "InparseObjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InparseObjects_idInparse_key" ON "InparseObjects"("idInparse");
