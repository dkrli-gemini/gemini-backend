/*
  Warnings:

  - Added the required column `cloudstackId` to the `NetworkModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NetworkModel" ADD COLUMN     "cloudstackId" TEXT NOT NULL;
