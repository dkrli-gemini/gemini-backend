DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'BillingTypeModel'
    ) THEN
        CREATE TYPE "BillingTypeModel" AS ENUM ('POOL', 'PAYG');
    END IF;
END $$;

ALTER TABLE "DomainModel"
    ADD COLUMN IF NOT EXISTS "billingType" "BillingTypeModel" NOT NULL DEFAULT 'POOL';

ALTER TABLE "ResourceLimitModel"
    ADD CONSTRAINT "ResourceLimitModel_domainId_type_key" UNIQUE ("domainId", "type");

CREATE TABLE IF NOT EXISTS "ResourceUsageEventModel" (
    "id" UUID NOT NULL,
    "domainId" UUID NOT NULL,
    "projectId" UUID,
    "resourceId" TEXT NOT NULL,
    "resourceType" "ResourceType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ResourceUsageEventModel_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "DomainModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ResourceUsageEventModel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ResourceUsageEventModel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BillingEntryModel" (
    "id" UUID NOT NULL,
    "domainId" UUID NOT NULL,
    "projectId" UUID,
    "resourceId" TEXT NOT NULL,
    "resourceType" "ResourceType" NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPriceInCents" INTEGER NOT NULL DEFAULT 0,
    "totalInCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BillingEntryModel_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "DomainModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BillingEntryModel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BillingEntryModel_pkey" PRIMARY KEY ("id")
);
