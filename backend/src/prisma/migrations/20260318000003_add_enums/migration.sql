-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "Subscription" AS ENUM ('BASIC', 'PRO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Drop default, cast to enum, re-add default
ALTER TABLE "Organization" ALTER COLUMN "patronage" DROP DEFAULT;
ALTER TABLE "Organization" ALTER COLUMN "patronage" TYPE "Subscription" USING "patronage"::"Subscription";
ALTER TABLE "Organization" ALTER COLUMN "patronage" SET DEFAULT 'BASIC'::"Subscription";
