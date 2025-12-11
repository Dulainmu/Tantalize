-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'AGENT', 'GATEKEEPER', 'TREASURER');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('NORMAL', 'VIP');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('IN_STOCK', 'ASSIGNED', 'SOLD', 'SCANNED', 'BANNED', 'INVALID');

-- CreateEnum
CREATE TYPE "VoteCategory" AS ENUM ('KING', 'QUEEN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'AGENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "magicLink" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "type" "TicketType" NOT NULL DEFAULT 'NORMAL',
    "status" "TicketStatus" NOT NULL DEFAULT 'IN_STOCK',
    "assignedToId" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "paymentSettled" BOOLEAN NOT NULL DEFAULT false,
    "soldAt" TIMESTAMP(3),
    "scannedAt" TIMESTAMP(3),
    "votedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "image" TEXT,
    "category" "VoteCategory" NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "accessCodeId" TEXT NOT NULL,
    "kingId" INTEGER NOT NULL,
    "queenId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "details" TEXT,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "isSystemLockdown" BOOLEAN NOT NULL DEFAULT false,
    "isVotingOpen" BOOLEAN NOT NULL DEFAULT false,
    "isResultsPublic" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AccessCode_code_key" ON "AccessCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AccessCode_magicLink_key" ON "AccessCode"("magicLink");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_accessCodeId_key" ON "Vote"("accessCodeId");

-- AddForeignKey
ALTER TABLE "AccessCode" ADD CONSTRAINT "AccessCode_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_accessCodeId_fkey" FOREIGN KEY ("accessCodeId") REFERENCES "AccessCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_kingId_fkey" FOREIGN KEY ("kingId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_queenId_fkey" FOREIGN KEY ("queenId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
