/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Invoice` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageThumbnail` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `veryfiId` on the `Invoice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "fileUrl",
ADD COLUMN     "currencyCode" TEXT,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "imageThumbnail" TEXT NOT NULL,
ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "subtotal" DOUBLE PRECISION,
ADD COLUMN     "tax" DOUBLE PRECISION,
ADD COLUMN     "vendorCategory" TEXT,
ADD COLUMN     "vendorLogo" TEXT,
ADD COLUMN     "vendorName" TEXT,
ADD COLUMN     "vendorType" TEXT,
DROP COLUMN "veryfiId",
ADD COLUMN     "veryfiId" INTEGER NOT NULL,
ALTER COLUMN "total" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_veryfiId_key" ON "Invoice"("veryfiId");
