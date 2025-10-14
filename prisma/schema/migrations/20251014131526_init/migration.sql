-- CreateEnum
CREATE TYPE "NetworkProtocolModel" AS ENUM ('TCP', 'UDP');

-- CreateEnum
CREATE TYPE "AclTrafficType" AS ENUM ('ingress', 'egress');

-- CreateEnum
CREATE TYPE "AclActionModel" AS ENUM ('allow', 'deny');

-- CreateEnum
CREATE TYPE "ProjectRoleModel" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "DomainTypeModel" AS ENUM ('ROOT', 'PARTNER', 'CLIENT');

-- CreateEnum
CREATE TYPE "JobStatusEnum" AS ENUM ('PENDING', 'DONE');

-- CreateEnum
CREATE TYPE "JobTypeEnum" AS ENUM ('StartVM', 'StopVM', 'CreateVM', 'AttachVolume');

-- CreateEnum
CREATE TYPE "ProjectTypeModel" AS ENUM ('ROOT', 'MEMBER');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('INSTANCES', 'CPU', 'MEMORY', 'VOLUMES', 'PUBLICIP', 'NETWORK');

-- CreateEnum
CREATE TYPE "ChargeType" AS ENUM ('MONTHLY', 'HOURLY', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "ValuableTag" AS ENUM ('VirtualMachineOffer', 'VirtualMachineVolume', 'PublicIP');

-- CreateTable
CREATE TABLE "AclListModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "vpcId" UUID,

    CONSTRAINT "AclListModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AclRuleModel" (
    "id" UUID NOT NULL,
    "aclId" UUID NOT NULL,
    "cidrList" TEXT[],
    "action" "AclActionModel" NOT NULL,
    "startPort" TEXT NOT NULL,
    "endPort" TEXT NOT NULL,
    "trafficType" "AclTrafficType" NOT NULL,
    "description" TEXT,
    "protocol" "NetworkProtocolModel" NOT NULL,

    CONSTRAINT "AclRuleModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiskOfferModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "DiskOfferModel_pkey" PRIMARY KEY ("id")
);

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
    "cloudstackAccountId" TEXT,
    "vpcId" UUID,

    CONSTRAINT "DomainModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstanceModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "memory" TEXT NOT NULL,
    "disk" TEXT NOT NULL,
    "cpu" TEXT NOT NULL,

    CONSTRAINT "InstanceModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobModel" (
    "id" UUID NOT NULL,
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
CREATE TABLE "PublicIPModel" (
    "id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "vpcId" UUID,

    CONSTRAINT "PublicIPModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortForwardRuleModel" (
    "id" UUID NOT NULL,
    "privatePortStart" TEXT NOT NULL,
    "privatePortEnd" TEXT NOT NULL,
    "publicPortStart" TEXT NOT NULL,
    "publicPortEnd" TEXT NOT NULL,
    "protocol" "NetworkProtocolModel" NOT NULL,
    "sourceCidrs" TEXT[],
    "virtualMachineId" TEXT NOT NULL,
    "publicIpId" UUID,

    CONSTRAINT "PortForwardRuleModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceLimitModel" (
    "id" UUID NOT NULL,
    "type" "ResourceType" NOT NULL,
    "limit" INTEGER NOT NULL,
    "used" INTEGER NOT NULL,
    "domainId" UUID NOT NULL,

    CONSTRAINT "ResourceLimitModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateOfferModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,

    CONSTRAINT "TemplateOfferModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValuableObjectModel" (
    "id" UUID NOT NULL,
    "chargeType" "ChargeType",
    "costInCents" INTEGER NOT NULL,
    "alternativeCostInCents" INTEGER,
    "entityId" TEXT,
    "tag" "ValuableTag",

    CONSTRAINT "ValuableObjectModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "objectId" UUID,

    CONSTRAINT "TransactionModel_pkey" PRIMARY KEY ("id")
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
    "name" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "instanceId" UUID,
    "projectId" UUID,
    "templateId" UUID,

    CONSTRAINT "VirtualMachineModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolumeModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "offerId" UUID,
    "machineId" UUID,

    CONSTRAINT "VolumeModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VPCModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "cidr" TEXT NOT NULL,
    "dns1" TEXT NOT NULL,
    "dns2" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "VPCModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AclListModel" ADD CONSTRAINT "AclListModel_vpcId_fkey" FOREIGN KEY ("vpcId") REFERENCES "VPCModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AclRuleModel" ADD CONSTRAINT "AclRuleModel_aclId_fkey" FOREIGN KEY ("aclId") REFERENCES "AclListModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainMemberModel" ADD CONSTRAINT "DomainMemberModel_projectModelId_fkey" FOREIGN KEY ("projectModelId") REFERENCES "ProjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainMemberModel" ADD CONSTRAINT "DomainMemberModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainModel" ADD CONSTRAINT "DomainModel_rootId_fkey" FOREIGN KEY ("rootId") REFERENCES "DomainModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainModel" ADD CONSTRAINT "DomainModel_vpcId_fkey" FOREIGN KEY ("vpcId") REFERENCES "VPCModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkModel" ADD CONSTRAINT "NetworkModel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectModel" ADD CONSTRAINT "ProjectModel_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "DomainModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicIPModel" ADD CONSTRAINT "PublicIPModel_vpcId_fkey" FOREIGN KEY ("vpcId") REFERENCES "VPCModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortForwardRuleModel" ADD CONSTRAINT "PortForwardRuleModel_publicIpId_fkey" FOREIGN KEY ("publicIpId") REFERENCES "PublicIPModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceLimitModel" ADD CONSTRAINT "ResourceLimitModel_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "DomainModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionModel" ADD CONSTRAINT "TransactionModel_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ValuableObjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualMachineModel" ADD CONSTRAINT "VirtualMachineModel_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "InstanceModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualMachineModel" ADD CONSTRAINT "VirtualMachineModel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualMachineModel" ADD CONSTRAINT "VirtualMachineModel_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "TemplateOfferModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolumeModel" ADD CONSTRAINT "VolumeModel_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "VirtualMachineModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolumeModel" ADD CONSTRAINT "VolumeModel_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "DiskOfferModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
