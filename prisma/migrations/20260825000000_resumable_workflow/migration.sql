ALTER TABLE "CandidateProfile"
ADD COLUMN "workExperience" JSONB,
ADD COLUMN "education" JSONB,
ADD COLUMN "jobPreferences" JSONB;

ALTER TABLE "BrowserSession"
ADD COLUMN "profileId" TEXT,
ADD COLUMN "expiresAt" TIMESTAMP(3),
ADD COLUMN "lastUsedAt" TIMESTAMP(3);

ALTER TABLE "Application"
ADD COLUMN "profileId" TEXT,
ADD COLUMN "currentStep" TEXT,
ADD COLUMN "manualAction" TEXT,
ADD COLUMN "attemptCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastAttemptAt" TIMESTAMP(3);

-- This test project has no production data yet. If you already inserted rows,
-- backfill profileId before applying the NOT NULL statements below.
ALTER TABLE "BrowserSession" ALTER COLUMN "profileId" SET NOT NULL;
ALTER TABLE "Application" ALTER COLUMN "profileId" SET NOT NULL;

CREATE UNIQUE INDEX "BrowserSession_provider_profileId_key"
ON "BrowserSession"("provider", "profileId");
CREATE UNIQUE INDEX "Application_jobId_profileId_key"
ON "Application"("jobId", "profileId");

ALTER TABLE "BrowserSession" ADD CONSTRAINT "BrowserSession_profileId_fkey"
FOREIGN KEY ("profileId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Application" ADD CONSTRAINT "Application_profileId_fkey"
FOREIGN KEY ("profileId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
