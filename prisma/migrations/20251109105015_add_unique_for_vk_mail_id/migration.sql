/*
  Warnings:

  - A unique constraint covering the columns `[vkMailId]` on the table `VkApplication` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VkApplication_vkMailId_key" ON "VkApplication"("vkMailId");
