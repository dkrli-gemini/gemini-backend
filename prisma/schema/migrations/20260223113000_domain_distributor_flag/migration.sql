ALTER TABLE "DomainModel"
ADD COLUMN IF NOT EXISTS "isDistributor" BOOLEAN NOT NULL DEFAULT false;

UPDATE "DomainModel"
SET "isDistributor" = true
WHERE "type" IN ('ROOT', 'PARTNER');
