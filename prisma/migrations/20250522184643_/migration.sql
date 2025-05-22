-- AlterTable
ALTER TABLE "VirtualMachineModel" ADD COLUMN     "instanceId" UUID;

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

-- AddForeignKey
ALTER TABLE "VirtualMachineModel" ADD CONSTRAINT "VirtualMachineModel_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "InstanceModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
