-- AlterTable
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "patronage" TEXT NOT NULL DEFAULT 'BASIC';

-- Add Post content column if missing
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "content" TEXT NOT NULL DEFAULT '';
