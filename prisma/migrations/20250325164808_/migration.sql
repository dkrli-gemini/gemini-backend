/*
  Warnings:

  - You are about to drop the column `domainId` on the `DomainMemberModel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DomainMemberModel" DROP CONSTRAINT "DomainMemberModel_domainId_fkey";

-- AlterTable
ALTER TABLE "DomainMemberModel" DROP COLUMN "domainId";
