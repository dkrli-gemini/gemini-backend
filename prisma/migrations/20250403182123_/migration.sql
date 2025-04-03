/*
  Warnings:

  - Added the required column `state` to the `VirtualMachineModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VirtualMachineModel" ADD COLUMN     "state" TEXT NOT NULL;
