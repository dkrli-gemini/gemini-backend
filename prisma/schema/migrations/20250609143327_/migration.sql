/*
  Warnings:

  - The values [ALLOW,DENY] on the enum `AclActionModel` will be removed. If these variants are still used in the database, this will fail.
  - The values [INGRESS,EGRESS] on the enum `AclTrafficType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AclActionModel_new" AS ENUM ('allow', 'deny');
ALTER TABLE "AclRuleModel" ALTER COLUMN "action" TYPE "AclActionModel_new" USING ("action"::text::"AclActionModel_new");
ALTER TYPE "AclActionModel" RENAME TO "AclActionModel_old";
ALTER TYPE "AclActionModel_new" RENAME TO "AclActionModel";
DROP TYPE "AclActionModel_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "AclTrafficType_new" AS ENUM ('ingress', 'egress');
ALTER TABLE "AclRuleModel" ALTER COLUMN "trafficType" TYPE "AclTrafficType_new" USING ("trafficType"::text::"AclTrafficType_new");
ALTER TYPE "AclTrafficType" RENAME TO "AclTrafficType_old";
ALTER TYPE "AclTrafficType_new" RENAME TO "AclTrafficType";
DROP TYPE "AclTrafficType_old";
COMMIT;
