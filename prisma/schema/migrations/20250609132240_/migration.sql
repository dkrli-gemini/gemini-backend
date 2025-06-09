-- CreateEnum
CREATE TYPE "NetworkProtocolModel" AS ENUM ('TCP', 'UDP');

-- CreateEnum
CREATE TYPE "AclTrafficType" AS ENUM ('INGRESS', 'EGRESS');

-- CreateEnum
CREATE TYPE "AclActionModel" AS ENUM ('ALLOW', 'DENY');

-- CreateTable
CREATE TABLE "AclListModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

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
    "protcol" "NetworkProtocolModel" NOT NULL,
    "description" TEXT,

    CONSTRAINT "AclRuleModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicIPModel" (
    "id" UUID NOT NULL,
    "address" TEXT NOT NULL,

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

-- AddForeignKey
ALTER TABLE "AclRuleModel" ADD CONSTRAINT "AclRuleModel_aclId_fkey" FOREIGN KEY ("aclId") REFERENCES "AclListModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortForwardRuleModel" ADD CONSTRAINT "PortForwardRuleModel_publicIpId_fkey" FOREIGN KEY ("publicIpId") REFERENCES "PublicIPModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
