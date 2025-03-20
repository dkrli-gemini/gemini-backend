/*
  Warnings:

  - You are about to drop the `ProjectUserModel` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProjectTypeModel" AS ENUM ('ROOT', 'MEMBER');

-- CreateEnum
CREATE TYPE "ProjectRoleModel" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "ProjectUserModel" DROP CONSTRAINT "ProjectUserModel_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectUserModel" DROP CONSTRAINT "ProjectUserModel_userId_fkey";

-- AlterTable
ALTER TABLE "ProjectModel" ADD COLUMN     "type" "ProjectTypeModel";

-- DropTable
DROP TABLE "ProjectUserModel";

-- DropEnum
DROP TYPE "RoleModel";

-- CreateTable
CREATE TABLE "DomainMemberModel" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "domainId" UUID,
    "projectModelId" UUID,
    "role" "ProjectRoleModel" NOT NULL,

    CONSTRAINT "DomainMemberModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "cloudstackDomainId" TEXT NOT NULL,
    "cloudstackAccountId" TEXT,
    "rootProjectId" UUID,

    CONSTRAINT "DomainModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DomainMemberModel" ADD CONSTRAINT "DomainMemberModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainMemberModel" ADD CONSTRAINT "DomainMemberModel_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "DomainModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainMemberModel" ADD CONSTRAINT "DomainMemberModel_projectModelId_fkey" FOREIGN KEY ("projectModelId") REFERENCES "ProjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainModel" ADD CONSTRAINT "DomainModel_rootProjectId_fkey" FOREIGN KEY ("rootProjectId") REFERENCES "ProjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
