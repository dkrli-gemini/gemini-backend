-- CreateEnum
CREATE TYPE "ChargeType" AS ENUM ('MONTHLY', 'HOURLY', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "ValuableTag" AS ENUM ('VirtualMachineOffer', 'VirtualMachineVolume', 'PublicIP');

-- CreateTable
CREATE TABLE "ValuableObjectModel" (
    "id" UUID NOT NULL,
    "chargeType" "ChargeType",
    "costInCents" INTEGER NOT NULL,
    "alternativeCostInCents" INTEGER,
    "entityId" TEXT,

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

-- AddForeignKey
ALTER TABLE "TransactionModel" ADD CONSTRAINT "TransactionModel_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ValuableObjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
