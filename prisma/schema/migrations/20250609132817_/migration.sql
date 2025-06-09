/*
  Warnings:

  - You are about to drop the column `protcol` on the `AclRuleModel` table. All the data in the column will be lost.
  - Added the required column `protocol` to the `AclRuleModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AclRuleModel" DROP COLUMN "protcol",
ADD COLUMN     "protocol" "NetworkProtocolModel" NOT NULL;
