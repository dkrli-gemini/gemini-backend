-- CreateEnum
CREATE TYPE "ProjectRoleModel" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "DomainTypeModel" AS ENUM ('ROOT', 'PARTNER', 'CLIENT');

-- CreateEnum
CREATE TYPE "JobStatusEnum" AS ENUM ('PENDING', 'DONE');

-- CreateEnum
CREATE TYPE "JobTypeEnum" AS ENUM ('StartVM', 'StopVM', 'CreateVM');

-- CreateEnum
CREATE TYPE "ProjectTypeModel" AS ENUM ('ROOT', 'MEMBER');

-- CreateTable
CREATE TABLE "DomainMemberModel" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "projectModelId" UUID,
    "role" "ProjectRoleModel" NOT NULL,

    CONSTRAINT "DomainMemberModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DomainTypeModel" NOT NULL DEFAULT 'ROOT',
    "rootId" UUID,
    "cloudstackDomainId" TEXT NOT NULL,
    "cloudstackAccountId" TEXT,
    "vpcId" UUID,

    CONSTRAINT "DomainModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstanceModel" (
    "id" UUID NOT NULL,
    "cloudstackId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "memory" TEXT NOT NULL,
    "disk" TEXT NOT NULL,
    "cpu" TEXT NOT NULL,

    CONSTRAINT "InstanceModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobModel" (
    "id" UUID NOT NULL,
    "cloudstackJobId" TEXT NOT NULL,
    "status" "JobStatusEnum" NOT NULL,
    "type" "JobTypeEnum" NOT NULL,
    "entityId" TEXT,
    "error" TEXT,

    CONSTRAINT "JobModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "cloudstackId" TEXT NOT NULL,
    "cloudstackOfferId" TEXT NOT NULL,
    "cloudstackAclId" TEXT NOT NULL,
    "gateway" TEXT NOT NULL,
    "netmask" TEXT NOT NULL,
    "projectId" UUID,

    CONSTRAINT "NetworkModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ProjectTypeModel",
    "domainId" UUID NOT NULL,

    CONSTRAINT "ProjectModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "UserModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualMachineModel" (
    "id" UUID NOT NULL,
    "cloudstackId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "cloudstackTemplateId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "instanceId" UUID,
    "projectId" UUID,

    CONSTRAINT "VirtualMachineModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VPCModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "cloudstackId" TEXT NOT NULL,
    "cidr" TEXT NOT NULL,
    "dns1" TEXT NOT NULL,
    "dns2" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "VPCModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DomainMemberModel" ADD CONSTRAINT "DomainMemberModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainMemberModel" ADD CONSTRAINT "DomainMemberModel_projectModelId_fkey" FOREIGN KEY ("projectModelId") REFERENCES "ProjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainModel" ADD CONSTRAINT "DomainModel_rootId_fkey" FOREIGN KEY ("rootId") REFERENCES "DomainModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainModel" ADD CONSTRAINT "DomainModel_vpcId_fkey" FOREIGN KEY ("vpcId") REFERENCES "VPCModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkModel" ADD CONSTRAINT "NetworkModel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectModel" ADD CONSTRAINT "ProjectModel_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "DomainModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualMachineModel" ADD CONSTRAINT "VirtualMachineModel_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "InstanceModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualMachineModel" ADD CONSTRAINT "VirtualMachineModel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
