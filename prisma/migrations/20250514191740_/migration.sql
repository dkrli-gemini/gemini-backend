-- CreateEnum
CREATE TYPE "DomainTypeModel" AS ENUM ('ROOT', 'PARTNER', 'CLIENT');

-- AlterTable
ALTER TABLE "DomainModel" ADD COLUMN     "type" "DomainTypeModel" NOT NULL DEFAULT 'ROOT';
