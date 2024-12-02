-- CreateIndex
CREATE INDEX "ObjectIntrum_category_idx" ON "ObjectIntrum"("category");

-- CreateIndex
CREATE INDEX "ObjectIntrum_city_idx" ON "ObjectIntrum"("city");

-- CreateIndex
CREATE INDEX "ObjectIntrum_rooms_idx" ON "ObjectIntrum"("rooms");

-- CreateIndex
CREATE INDEX "ObjectIntrum_district_idx" ON "ObjectIntrum"("district");

-- CreateIndex
CREATE INDEX "ObjectIntrum_street_idx" ON "ObjectIntrum"("street");

-- CreateIndex
CREATE INDEX "ObjectIntrum_companyName_idx" ON "ObjectIntrum"("companyName");

-- CreateIndex
CREATE INDEX "ObjectIntrum_renovation_idx" ON "ObjectIntrum"("renovation");

-- CreateIndex
CREATE INDEX "ObjectIntrum_floor_idx" ON "ObjectIntrum"("floor");

-- CreateIndex
CREATE INDEX "ObjectIntrum_floors_idx" ON "ObjectIntrum"("floors");

-- CreateIndex
CREATE INDEX "ObjectIntrum_price_idx" ON "ObjectIntrum"("price");

-- CreateIndex
CREATE INDEX "ObjectIntrum_city_street_idx" ON "ObjectIntrum"("city", "street");
