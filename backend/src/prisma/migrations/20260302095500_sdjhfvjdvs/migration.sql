-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('TECH', 'FINANCE', 'HEALTHCARE', 'EDUCATION', 'RETAIL', 'MANUFACTURING');

-- CreateEnum
CREATE TYPE "MemberAccessType" AS ENUM ('EXECUTIVE', 'MANAGEMENT', 'MEMBER');

-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('БАРАА_МАТЕРИАЛ', 'ТЭЭВЭР', 'УРСГАЛ_ЗАРДАЛ', 'ЦАЛИН');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "industry" "Industry" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "role" "MemberAccessType" NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finance" (
    "orgId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "revenue" INTEGER NOT NULL,
    "expense" INTEGER NOT NULL,
    "netProfit" INTEGER NOT NULL,
    "margin" INTEGER NOT NULL,

    CONSTRAINT "Finance_pkey" PRIMARY KEY ("orgId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_id_key" ON "Organization"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_key" ON "Client"("id");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finance" ADD CONSTRAINT "Finance_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
