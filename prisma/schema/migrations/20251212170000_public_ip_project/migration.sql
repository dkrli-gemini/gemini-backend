-- Add project relation to Public IPs
ALTER TABLE "PublicIPModel"
ADD COLUMN "projectId" UUID;

ALTER TABLE "PublicIPModel"
ADD CONSTRAINT "PublicIPModel_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "ProjectModel"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
