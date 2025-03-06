/*
  Warnings:

  - Changed the type of `role` on the `ProjectUserModel` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RoleModel" AS ENUM ('OWNER');

-- AlterTable
ALTER TABLE "ProjectUserModel" DROP COLUMN "role",
ADD COLUMN     "role" "RoleModel" NOT NULL;

-- DropEnum
DROP TYPE "Role";
