DO $$
BEGIN
    ALTER TYPE "JobStatusEnum" ADD VALUE 'FAILED';
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
