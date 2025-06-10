-- AlterTable
ALTER TABLE "AclListModel" ADD COLUMN     "vpcId" UUID;

-- AlterTable
ALTER TABLE "PublicIPModel" ADD COLUMN     "vpcId" UUID;

-- AddForeignKey
ALTER TABLE "AclListModel" ADD CONSTRAINT "AclListModel_vpcId_fkey" FOREIGN KEY ("vpcId") REFERENCES "VPCModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicIPModel" ADD CONSTRAINT "PublicIPModel_vpcId_fkey" FOREIGN KEY ("vpcId") REFERENCES "VPCModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
