-- Store custom billing prices per client domain and resource type
CREATE TABLE "DomainResourcePriceModel" (
  "id" UUID NOT NULL,
  "domainId" UUID NOT NULL,
  "type" "ResourceType" NOT NULL,
  "unitPriceInCents" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DomainResourcePriceModel_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DomainResourcePriceModel_domainId_type_key"
ON "DomainResourcePriceModel"("domainId", "type");

CREATE INDEX "DomainResourcePriceModel_domainId_idx"
ON "DomainResourcePriceModel"("domainId");

ALTER TABLE "DomainResourcePriceModel"
ADD CONSTRAINT "DomainResourcePriceModel_domainId_fkey"
FOREIGN KEY ("domainId") REFERENCES "DomainModel"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
