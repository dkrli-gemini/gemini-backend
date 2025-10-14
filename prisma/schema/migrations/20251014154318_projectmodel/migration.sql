-- AlterTable
ALTER TABLE "PortForwardRuleModel" ADD COLUMN     "projectId" UUID;

-- AddForeignKey
ALTER TABLE "PortForwardRuleModel" ADD CONSTRAINT "PortForwardRuleModel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
