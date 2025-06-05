/*
  Warnings:

  - You are about to drop the column `cloudstackDomainId` on the `DomainModel` table. All the data in the column will be lost.
  - You are about to drop the column `cloudstackId` on the `VPCModel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DomainModel" DROP COLUMN "cloudstackDomainId";

-- AlterTable
ALTER TABLE "VPCModel" DROP COLUMN "cloudstackId";
