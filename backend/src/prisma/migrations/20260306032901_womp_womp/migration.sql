/*
  Warnings:

  - Added the required column `name` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "role" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Finance" ALTER COLUMN "balance" DROP NOT NULL,
ALTER COLUMN "revenue" DROP NOT NULL,
ALTER COLUMN "expense" DROP NOT NULL,
ALTER COLUMN "netProfit" DROP NOT NULL,
ALTER COLUMN "margin" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
