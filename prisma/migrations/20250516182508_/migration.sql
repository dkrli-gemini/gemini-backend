/*
  Warnings:

  - You are about to drop the column `rootProjectId` on the `DomainModel` table. All the data in the column will be lost.
  - Added the required column `domainId` to the `ProjectModel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DomainModel" DROP CONSTRAINT "DomainModel_rootProjectId_fkey";

-- AlterTable
ALTER TABLE "DomainModel" DROP COLUMN "rootProjectId";

-- AlterTable
ALTER TABLE "ProjectModel" ADD COLUMN     "domainId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectModel" ADD CONSTRAINT "ProjectModel_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "DomainModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
