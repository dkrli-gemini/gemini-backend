/*
  Warnings:

  - You are about to drop the column `domainModelId` on the `NetworkModel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NetworkModel" DROP CONSTRAINT "NetworkModel_domainModelId_fkey";

-- AlterTable
ALTER TABLE "NetworkModel" DROP COLUMN "domainModelId",
ADD COLUMN     "projectId" UUID;

-- AddForeignKey
ALTER TABLE "NetworkModel" ADD CONSTRAINT "NetworkModel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
