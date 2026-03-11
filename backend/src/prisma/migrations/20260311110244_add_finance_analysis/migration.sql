-- CreateTable
CREATE TABLE "FinanceAnalysis" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "categories" JSONB NOT NULL,
    "tips" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinanceAnalysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FinanceAnalysis" ADD CONSTRAINT "FinanceAnalysis_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
