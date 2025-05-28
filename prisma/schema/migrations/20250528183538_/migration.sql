-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('INSTANCES', 'CPU', 'MEMORY', 'VOLUMES', 'PUBLICIP', 'NETWORK');

-- CreateTable
CREATE TABLE "ResourceLimitModel" (
    "id" UUID NOT NULL,
    "type" "ResourceType" NOT NULL,
    "limit" INTEGER NOT NULL,
    "used" INTEGER NOT NULL,
    "domainId" UUID NOT NULL,

    CONSTRAINT "ResourceLimitModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResourceLimitModel" ADD CONSTRAINT "ResourceLimitModel_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "DomainModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
