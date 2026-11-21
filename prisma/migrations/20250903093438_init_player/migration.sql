
-- CreateTable
CREATE TABLE "public"."Player" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_playerId_key"
ON "public"."Player"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key"
ON "public"."Player"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionId_key"
ON "public"."Transaction"("transactionId");

-- AddForeignKey
ALTER TABLE "public"."Transaction"
ADD CONSTRAINT "Transaction_playerId_fkey"
FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
