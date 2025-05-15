-- AlterTable
ALTER TABLE "DomainModel" ADD COLUMN     "rootId" UUID;

-- AddForeignKey
ALTER TABLE "DomainModel" ADD CONSTRAINT "DomainModel_rootId_fkey" FOREIGN KEY ("rootId") REFERENCES "DomainModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
