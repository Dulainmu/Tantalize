/*
  Warnings:

  - The values [KING,QUEEN] on the enum `VoteCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `customerName` on the `AccessCode` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `AccessCode` table. All the data in the column will be lost.
  - You are about to drop the column `magicLink` on the `AccessCode` table. All the data in the column will be lost.
  - You are about to drop the column `soldAt` on the `AccessCode` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `kingId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `queenId` on the `Vote` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VoteCategory_new" AS ENUM ('BAND', 'SOLO_SINGING', 'GROUP_SINGING', 'SOLO_DANCING', 'GROUP_DANCING');
ALTER TABLE "Candidate" ALTER COLUMN "category" TYPE "VoteCategory_new" USING ("category"::text::"VoteCategory_new");
ALTER TYPE "VoteCategory" RENAME TO "VoteCategory_old";
ALTER TYPE "VoteCategory_new" RENAME TO "VoteCategory";
DROP TYPE "public"."VoteCategory_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_kingId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_queenId_fkey";

-- DropIndex
DROP INDEX "AccessCode_magicLink_key";

-- AlterTable
ALTER TABLE "AccessCode" DROP COLUMN "customerName",
DROP COLUMN "customerPhone",
DROP COLUMN "magicLink",
DROP COLUMN "soldAt",
ADD COLUMN     "ownerEmail" TEXT,
ADD COLUMN     "ownerName" TEXT,
ADD COLUMN     "settlementId" INTEGER,
ALTER COLUMN "serialNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "number",
ADD COLUMN     "institute" TEXT;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "kingId",
DROP COLUMN "queenId",
ADD COLUMN     "bandId" INTEGER,
ADD COLUMN     "groupDancingId" INTEGER,
ADD COLUMN     "groupSingingId" INTEGER,
ADD COLUMN     "soloDancingId" INTEGER,
ADD COLUMN     "soloSingingId" INTEGER;

-- CreateTable
CREATE TABLE "Settlement" (
    "id" SERIAL NOT NULL,
    "agentId" TEXT NOT NULL,
    "treasurerId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "recordedById" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccessCode" ADD CONSTRAINT "AccessCode_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_soloSingingId_fkey" FOREIGN KEY ("soloSingingId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_groupSingingId_fkey" FOREIGN KEY ("groupSingingId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_soloDancingId_fkey" FOREIGN KEY ("soloDancingId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_groupDancingId_fkey" FOREIGN KEY ("groupDancingId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_treasurerId_fkey" FOREIGN KEY ("treasurerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
