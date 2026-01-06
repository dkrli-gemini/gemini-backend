-- AlterTable
ALTER TABLE "InstanceModel"
  ADD COLUMN "sku" TEXT,
  ADD COLUMN "family" TEXT,
  ADD COLUMN "profile" TEXT,
  ADD COLUMN "diskTier" TEXT;
