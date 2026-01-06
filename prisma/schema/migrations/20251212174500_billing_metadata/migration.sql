-- Add metadata column to billing entries to persist resource details
ALTER TABLE "BillingEntryModel"
ADD COLUMN "metadata" JSONB;
