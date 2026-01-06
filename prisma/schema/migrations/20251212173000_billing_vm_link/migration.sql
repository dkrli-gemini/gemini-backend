-- Link billing entries and resource usage events to virtual machines
ALTER TABLE "BillingEntryModel"
ADD COLUMN "virtualMachineId" UUID;

ALTER TABLE "ResourceUsageEventModel"
ADD COLUMN "virtualMachineId" UUID;

ALTER TABLE "BillingEntryModel"
ADD CONSTRAINT "BillingEntryModel_virtualMachineId_fkey"
FOREIGN KEY ("virtualMachineId") REFERENCES "VirtualMachineModel"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "ResourceUsageEventModel"
ADD CONSTRAINT "ResourceUsageEventModel_virtualMachineId_fkey"
FOREIGN KEY ("virtualMachineId") REFERENCES "VirtualMachineModel"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
