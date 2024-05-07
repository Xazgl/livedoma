-- AlterTable
ALTER TABLE "Sales" ADD COLUMN     "agentBuyerFormul" TEXT,
ADD COLUMN     "agentBuyerSalaryDone" TEXT,
ADD COLUMN     "agentSellerFormula" TEXT,
ADD COLUMN     "agentSellerSalaryDone" TEXT,
ADD COLUMN     "lawyerFormula" TEXT,
ADD COLUMN     "lawyerSalary" TEXT,
ADD COLUMN     "lawyerSalaryDone" TEXT,
ADD COLUMN     "lawyerSumm" TEXT,
ADD COLUMN     "lawyerSumm1" TEXT,
ADD COLUMN     "mortageFormula" TEXT,
ADD COLUMN     "mortageSumm1" TEXT;

-- CreateTable
CREATE TABLE "TransactionSellingInsurance" (
    "id" TEXT NOT NULL,
    "idIntrum" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "agreement" TEXT,
    "titleBorrower" TEXT,
    "profession" TEXT,
    "bank" TEXT,
    "insuranceCompany" TEXT,
    "insuranceSum" TEXT,
    "mortageSum" TEXT,
    "commission" TEXT,
    "lawler" TEXT,
    "dateNextClientContact" TIMESTAMP(3),
    "stageWorkWithClient" TEXT,
    "nextAction" TEXT,
    "dateBirthday" TIMESTAMP(3),
    "address" TEXT,
    "clientInform" TEXT,
    "insuranceCalc" TEXT,
    "titleBorrowerPhone" TEXT,
    "extractInsurance" TEXT,
    "idTransitionSaleObject" TEXT,
    "numberCadastral" TEXT,
    "extract" TEXT,
    "dateTheStatusChanged" TIMESTAMP(3),
    "source" TEXT,
    "theBuyerIMMEDIATELYRefusedInsurance" TEXT,
    "transactionStageInTheTransactionSALE" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionSellingInsurance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionSellingInsurance_idIntrum_key" ON "TransactionSellingInsurance"("idIntrum");
