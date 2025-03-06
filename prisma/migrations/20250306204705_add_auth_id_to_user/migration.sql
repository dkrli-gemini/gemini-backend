/*
  Warnings:

  - Added the required column `authId` to the `UserModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserModel" ADD COLUMN     "authId" TEXT NOT NULL;
