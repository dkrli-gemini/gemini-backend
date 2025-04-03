-- CreateTable
CREATE TABLE "NetworkModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "cloudstackOfferId" TEXT NOT NULL,
    "cloudstackAclId" TEXT NOT NULL,
    "gateway" TEXT NOT NULL,
    "netmask" TEXT NOT NULL,
    "domainModelId" UUID,

    CONSTRAINT "NetworkModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NetworkModel" ADD CONSTRAINT "NetworkModel_domainModelId_fkey" FOREIGN KEY ("domainModelId") REFERENCES "DomainModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
