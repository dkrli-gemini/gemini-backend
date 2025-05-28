-- CreateTable
CREATE TABLE "DiskOfferModel" (
    "id" UUID NOT NULL,
    "cloudstackId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "DiskOfferModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolumeModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "offerId" UUID,
    "machineId" UUID,

    CONSTRAINT "VolumeModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VolumeModel" ADD CONSTRAINT "VolumeModel_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "DiskOfferModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolumeModel" ADD CONSTRAINT "VolumeModel_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "VirtualMachineModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
