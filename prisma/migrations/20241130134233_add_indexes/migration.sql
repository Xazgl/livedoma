-- DropIndex
DROP INDEX "ObjectIntrum_thubmnail_idx";

-- CreateIndex
CREATE INDEX "ObjectIntrum_thubmnail_createdAt_active_idx" ON "ObjectIntrum"("thubmnail", "createdAt", "active");

-- CreateIndex
CREATE INDEX "ObjectIntrum_category_city_rooms_street_district_companyNam_idx" ON "ObjectIntrum"("category", "city", "rooms", "street", "district", "companyName", "renovation", "floors", "price", "createdAt");
