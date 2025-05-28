/*
  Warnings:

  - You are about to drop the column `cloudstackTemplateId` on the `VirtualMachineModel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VirtualMachineModel" DROP COLUMN "cloudstackTemplateId",
ADD COLUMN     "templateId" UUID;

-- CreateTable
CREATE TABLE "TemplateOfferModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "cloudstackId" TEXT NOT NULL,
    "url" TEXT,

    CONSTRAINT "TemplateOfferModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VirtualMachineModel" ADD CONSTRAINT "VirtualMachineModel_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "TemplateOfferModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
