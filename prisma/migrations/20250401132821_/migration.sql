-- AlterTable
ALTER TABLE "DomainModel" ADD COLUMN     "vpcId" UUID;

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
ALTER TABLE "DomainModel" ADD CONSTRAINT "DomainModel_vpcId_fkey" FOREIGN KEY ("vpcId") REFERENCES "VPCModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
