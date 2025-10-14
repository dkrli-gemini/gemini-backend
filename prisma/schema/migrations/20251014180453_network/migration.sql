-- AlterTable
ALTER TABLE "VirtualMachineModel" ADD COLUMN     "networkId" UUID;

-- AddForeignKey
ALTER TABLE "VirtualMachineModel" ADD CONSTRAINT "VirtualMachineModel_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "NetworkModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
