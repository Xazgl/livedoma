-- CreateIndex
CREATE INDEX "ObjectIntrum_active_idx" ON "ObjectIntrum"("active");

-- CreateIndex
CREATE INDEX "ObjectIntrum_createdAt_idx" ON "ObjectIntrum"("createdAt");

-- CreateIndex
CREATE INDEX "ObjectIntrum_category_price_idx" ON "ObjectIntrum"("category", "price");
