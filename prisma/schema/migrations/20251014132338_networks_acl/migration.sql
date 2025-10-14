-- AlterEnum
ALTER TYPE "NetworkProtocolModel" ADD VALUE 'ALL';

-- AlterTable
ALTER TABLE "NetworkModel" ADD COLUMN     "aclName" TEXT;
