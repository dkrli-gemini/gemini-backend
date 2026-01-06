-- AlterTable
ALTER TABLE "VirtualMachineModel" 
  ADD COLUMN "cpuNumber" INTEGER,
  ADD COLUMN "cpuSpeedMhz" INTEGER,
  ADD COLUMN "memoryInMb" INTEGER,
  ADD COLUMN "rootDiskSizeInGb" INTEGER;

-- AlterTable
ALTER TABLE "VolumeModel" 
  ADD COLUMN "sizeInGb" INTEGER;
