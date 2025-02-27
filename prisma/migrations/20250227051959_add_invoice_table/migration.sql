-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "veryfiId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "vendor" TEXT,
    "total" DOUBLE PRECISION NOT NULL,
    "currency" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_veryfiId_key" ON "Invoice"("veryfiId");
