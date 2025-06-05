/*
  Warnings:

  - You are about to drop the column `cloudstackId` on the `InstanceModel` table. All the data in the column will be lost.
  - You are about to drop the column `cloudstackId` on the `TemplateOfferModel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InstanceModel" DROP COLUMN "cloudstackId";

-- AlterTable
ALTER TABLE "TemplateOfferModel" DROP COLUMN "cloudstackId";
