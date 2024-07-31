-- CreateTable
CREATE TABLE "ObjectIntrum" (
    "id" TEXT NOT NULL,
    "id_intrum" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "operationType" TEXT NOT NULL,
    "state" TEXT,
    "city" TEXT,
    "district" TEXT,
    "street" TEXT,
    "price" DOUBLE PRECISION,
    "companyName" TEXT NOT NULL,
    "managerName" TEXT,
    "description" TEXT,
    "balconyOrLoggia" TEXT,
    "passengerElevator" TEXT,
    "freightElevator" TEXT,
    "ceilingHeight" TEXT,
    "renovation" TEXT,
    "bathroomMulti" TEXT,
    "dealType" TEXT,
    "roomType" TEXT[],
    "saleOptions" TEXT[],
    "phone" TEXT,
    "imgUrl" TEXT[],
    "img" TEXT[],
    "thubmnail" TEXT[],
    "rooms" TEXT,
    "square" TEXT,
    "landArea" TEXT,
    "floors" TEXT,
    "floor" TEXT,
    "wallsType" TEXT,
    "propertyRights" TEXT,
    "transactionType" TEXT,
    "objectType" TEXT,
    "houseServices" TEXT[],
    "cadastralNumber" TEXT,
    "parkingType" TEXT,
    "rentalType" TEXT,
    "decoration" TEXT,
    "leaseCommissionSize" TEXT,
    "leaseDeposit" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ObjectIntrum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionClient" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteObjectsToObj" (
    "sessionId" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,

    CONSTRAINT "FavoriteObjectsToObj_pkey" PRIMARY KEY ("sessionId","objectId")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "nominal" TEXT NOT NULL,
    "charCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerQueue" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "url" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManagerQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wazzup" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "text" TEXT,
    "typeSend" TEXT,
    "sendCrm" BOOLEAN NOT NULL,
    "managerId" TEXT,
    "intrumId" TEXT,
    "intrumUrl" TEXT,
    "timeCall" TEXT,
    "ok_cz" BOOLEAN DEFAULT false,
    "timeManager" TEXT,
    "ok_manager" BOOLEAN DEFAULT false,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wazzup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tilda" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "typeSend" TEXT,
    "timeForClientCall" TEXT DEFAULT '',
    "formid" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_content" TEXT,
    "utm_term" TEXT,
    "sendCrm" BOOLEAN NOT NULL,
    "answers" TEXT,
    "managerId" TEXT,
    "intrumId" TEXT,
    "intrumUrl" TEXT,
    "timeCall" TEXT,
    "ok_cz" BOOLEAN DEFAULT false,
    "timeManager" TEXT,
    "ok_manager" BOOLEAN DEFAULT false,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tilda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sales" (
    "id" TEXT NOT NULL,
    "idSalesIntrum" TEXT NOT NULL,
    "responsibleMain" TEXT,
    "partCommissionSeller" TEXT,
    "sumCommissionBuyer" TEXT,
    "agentSellerName" TEXT,
    "agentSellerFormula" TEXT,
    "agentSellerCommission" TEXT,
    "agentSellerSalaryDone" TEXT,
    "lawyerName" TEXT,
    "lawyerCommission" TEXT,
    "agentBuyerName" TEXT,
    "agentBuyerFormul" TEXT,
    "agentBuyerCommission" TEXT,
    "agentBuyerSalaryDone" TEXT,
    "lawyerCommission2" TEXT,
    "lawyerSalary" TEXT,
    "lawyerFormula" TEXT,
    "lawyerSumm" TEXT,
    "lawyerSumm1" TEXT,
    "lawyerSalaryDone" TEXT,
    "mortageFormula" TEXT,
    "mortageSumm1" TEXT,
    "mortageOtdel" TEXT,
    "adress" TEXT,
    "dateStage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionSellingInsurance" (
    "id" TEXT NOT NULL,
    "idIntrum" TEXT NOT NULL,
    "responsibleMain" TEXT,
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
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TransactionSellingInsurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constructionApplications" (
    "id" TEXT NOT NULL,
    "idApplicationIntrum" TEXT NOT NULL,
    "translator" TEXT,
    "responsibleMain" TEXT NOT NULL,
    "status" TEXT,
    "postMeetingStage" TEXT,
    "desc" TEXT,
    "typeApplication" TEXT,
    "contactedClient" TEXT,
    "campaignUtm" TEXT,
    "termUtm" TEXT,
    "nextAction" TEXT,
    "rejection" TEXT,
    "errorReejctionDone" BOOLEAN,
    "datecallCenter" TEXT,
    "timecallCenter" TEXT,
    "timesaletCenter" TEXT,
    "dateFirstContact" TEXT,
    "phone" TEXT,
    "url" TEXT,
    "comment" TEXT[],
    "createdAtCrm" TEXT,
    "typeApplicationCrm" TEXT NOT NULL DEFAULT 'ЖДД',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "constructionApplications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InparseObjects" (
    "id" TEXT NOT NULL,
    "idInparse" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "typeAd" TEXT,
    "sectionId" TEXT,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "floor" TEXT,
    "floors" TEXT,
    "sq" TEXT,
    "sqLand" TEXT,
    "price" TEXT,
    "description" TEXT,
    "images" TEXT[],
    "lat" TEXT NOT NULL,
    "lng" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phones" TEXT[],
    "url" TEXT NOT NULL,
    "agent" TEXT,
    "source" TEXT,
    "sourceId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "InparseObjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmartAgentObjects" (
    "id" TEXT NOT NULL,
    "idSmartAgent" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "hierarchy_top_level" TEXT,
    "full_hierarchy" TEXT,
    "street_ids" TEXT,
    "street_cache" TEXT,
    "metro_ids" TEXT,
    "metro_cache" TEXT,
    "deal_type" TEXT,
    "holding_period_in_years" TEXT,
    "rooms" TEXT,
    "price" TEXT,
    "agent_commission" TEXT,
    "client_commission" TEXT,
    "floor" TEXT,
    "floors" TEXT,
    "distance" TEXT,
    "transport" TEXT,
    "period" TEXT,
    "building" TEXT,
    "corpus" TEXT,
    "hometype" TEXT,
    "total_area" TEXT,
    "living_area" TEXT,
    "kitchen_area" TEXT,
    "land_area" TEXT,
    "remont" TEXT,
    "fridge" TEXT,
    "washer" TEXT,
    "sell_balcony" TEXT,
    "tv" TEXT,
    "slavs" TEXT,
    "rf" TEXT,
    "children" TEXT,
    "pets" TEXT,
    "furniture" TEXT,
    "isolated" TEXT,
    "view_from_windows" TEXT,
    "wc" TEXT,
    "checked_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    "user_id_who_created" TEXT,
    "order_for_user_id" TEXT,
    "name" TEXT,
    "note" TEXT,
    "owner" TEXT,
    "lon" TEXT,
    "lat" TEXT,
    "alternatives" TEXT,
    "edit_hash" TEXT,
    "new_building" TEXT,
    "feed_export_enabled" TEXT,
    "images_source" TEXT[],
    "images" TEXT[],
    "images_ids" TEXT[],
    "phone" TEXT[],
    "source_url" TEXT,
    "note_generated" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SmartAgentObjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ObjectIntrum_id_intrum_key" ON "ObjectIntrum"("id_intrum");

-- CreateIndex
CREATE UNIQUE INDEX "SessionClient_sessionToken_key" ON "SessionClient"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Sales_idSalesIntrum_key" ON "Sales"("idSalesIntrum");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionSellingInsurance_idIntrum_key" ON "TransactionSellingInsurance"("idIntrum");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_login_key" ON "Admin"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "constructionApplications_idApplicationIntrum_key" ON "constructionApplications"("idApplicationIntrum");

-- CreateIndex
CREATE UNIQUE INDEX "InparseObjects_idInparse_key" ON "InparseObjects"("idInparse");

-- CreateIndex
CREATE UNIQUE INDEX "SmartAgentObjects_idSmartAgent_key" ON "SmartAgentObjects"("idSmartAgent");

-- AddForeignKey
ALTER TABLE "FavoriteObjectsToObj" ADD CONSTRAINT "FavoriteObjectsToObj_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SessionClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteObjectsToObj" ADD CONSTRAINT "FavoriteObjectsToObj_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ObjectIntrum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
