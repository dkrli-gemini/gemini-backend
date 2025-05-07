-- CreateEnum
CREATE TYPE "JobStatusEnum" AS ENUM ('PENDING', 'DONE');

-- CreateTable
CREATE TABLE "JobModel" (
    "id" UUID NOT NULL,
    "cloudstackJobId" TEXT NOT NULL,
    "status" "JobStatusEnum" NOT NULL,

    CONSTRAINT "JobModel_pkey" PRIMARY KEY ("id")
);
