-- CreateTable
CREATE TABLE "Sales" (
    "id" TEXT NOT NULL,
    "idSalesIntrum" TEXT NOT NULL,
    "responsibleMain" TEXT NOT NULL,
    "partCommissionSeller" TEXT NOT NULL,
    "sumCommissionBuyer" TEXT NOT NULL,
    "agentSellerName" TEXT,
    "agentSellerCommission" TEXT,
    "lawyerName" TEXT,
    "lawyerCommission" TEXT,
    "agentBuyerName" TEXT,
    "agentBuyerCommission" TEXT,
    "lawyerName2" TEXT,
    "lawyerCommission2" TEXT,
    "adress" TEXT,
    "dateStage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sales_idSalesIntrum_key" ON "Sales"("idSalesIntrum");
