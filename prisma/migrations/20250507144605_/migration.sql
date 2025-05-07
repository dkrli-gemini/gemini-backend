/*
  Warnings:

  - Added the required column `type` to the `JobModel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobTypeEnum" AS ENUM ('StartVM', 'StopVM');

-- AlterTable
ALTER TABLE "JobModel" ADD COLUMN     "error" TEXT,
ADD COLUMN     "type" "JobTypeEnum" NOT NULL;
