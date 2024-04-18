/*
  Warnings:

  - You are about to drop the column `intrumId` on the `Tilda` table. All the data in the column will be lost.
  - You are about to drop the column `intrumUrl` on the `Tilda` table. All the data in the column will be lost.
  - You are about to drop the column `ok_cz` on the `Tilda` table. All the data in the column will be lost.
  - You are about to drop the column `ok_manager` on the `Tilda` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Tilda` table. All the data in the column will be lost.
  - You are about to drop the column `timeCall` on the `Tilda` table. All the data in the column will be lost.
  - You are about to drop the column `timeManager` on the `Tilda` table. All the data in the column will be lost.
  - You are about to drop the column `intrumId` on the `Wazzup` table. All the data in the column will be lost.
  - You are about to drop the column `intrumUrl` on the `Wazzup` table. All the data in the column will be lost.
  - You are about to drop the column `ok_cz` on the `Wazzup` table. All the data in the column will be lost.
  - You are about to drop the column `ok_manager` on the `Wazzup` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Wazzup` table. All the data in the column will be lost.
  - You are about to drop the column `timeCall` on the `Wazzup` table. All the data in the column will be lost.
  - You are about to drop the column `timeManager` on the `Wazzup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tilda" DROP COLUMN "intrumId",
DROP COLUMN "intrumUrl",
DROP COLUMN "ok_cz",
DROP COLUMN "ok_manager",
DROP COLUMN "status",
DROP COLUMN "timeCall",
DROP COLUMN "timeManager";

-- AlterTable
ALTER TABLE "Wazzup" DROP COLUMN "intrumId",
DROP COLUMN "intrumUrl",
DROP COLUMN "ok_cz",
DROP COLUMN "ok_manager",
DROP COLUMN "status",
DROP COLUMN "timeCall",
DROP COLUMN "timeManager";
