-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ClaimStatus" ADD VALUE 'UNDER_REVIEW';
ALTER TYPE "ClaimStatus" ADD VALUE 'APPROVED';
ALTER TYPE "ClaimStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "claimNumber" TEXT,
ADD COLUMN     "insuranceNotes" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" TEXT,
ADD COLUMN     "settlementAmount" INTEGER,
ADD COLUMN     "settlementDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "insuranceCompany" TEXT,
ADD COLUMN     "insuranceExpiry" TIMESTAMP(3),
ADD COLUMN     "insuranceStatus" TEXT DEFAULT 'Active',
ADD COLUMN     "policyNumber" TEXT;
