-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('IN_QUEUE', 'PROCESSING', 'PROCESSED');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "status" "InvoiceStatus" NOT NULL DEFAULT 'IN_QUEUE';
