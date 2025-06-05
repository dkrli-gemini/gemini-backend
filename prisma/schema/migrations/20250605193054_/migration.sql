/*
  Warnings:

  - You are about to drop the column `cloudstackId` on the `DiskOfferModel` table. All the data in the column will be lost.
  - You are about to drop the column `cloudstackJobId` on the `JobModel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DiskOfferModel" DROP COLUMN "cloudstackId";

-- AlterTable
ALTER TABLE "JobModel" DROP COLUMN "cloudstackJobId";
