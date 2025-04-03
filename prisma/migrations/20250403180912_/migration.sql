-- CreateTable
CREATE TABLE "VirtualMachineModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "cloudstackTemplateId" TEXT NOT NULL,
    "cloudstackOfferId" TEXT NOT NULL,
    "projectId" UUID,

    CONSTRAINT "VirtualMachineModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VirtualMachineModel" ADD CONSTRAINT "VirtualMachineModel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
