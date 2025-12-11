-- DropForeignKey
ALTER TABLE "Settlement" DROP CONSTRAINT "Settlement_treasurerId_fkey";

-- AlterTable
ALTER TABLE "AccessCode" ADD COLUMN     "customerMobile" TEXT,
ADD COLUMN     "paymentMode" TEXT,
ADD COLUMN     "transferId" INTEGER;

-- AlterTable
ALTER TABLE "Settlement" ADD COLUMN     "proofImage" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
ALTER COLUMN "treasurerId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TicketTransfer" (
    "id" SERIAL NOT NULL,
    "fromAgentId" TEXT NOT NULL,
    "toAgentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketTransfer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccessCode" ADD CONSTRAINT "AccessCode_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "TicketTransfer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_treasurerId_fkey" FOREIGN KEY ("treasurerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransfer" ADD CONSTRAINT "TicketTransfer_fromAgentId_fkey" FOREIGN KEY ("fromAgentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransfer" ADD CONSTRAINT "TicketTransfer_toAgentId_fkey" FOREIGN KEY ("toAgentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
