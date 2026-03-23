-- CreateTable
CREATE TABLE "MarketinAIUsage" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketinAIUsage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MarketinAIUsage" ADD CONSTRAINT "MarketinAIUsage_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketinAIUsage" ADD CONSTRAINT "MarketinAIUsage_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
