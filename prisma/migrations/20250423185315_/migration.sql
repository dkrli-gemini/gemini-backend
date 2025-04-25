/*
  Warnings:

  - Added the required column `cloudstackId` to the `VirtualMachineModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VirtualMachineModel" ADD COLUMN     "cloudstackId" TEXT NOT NULL;
