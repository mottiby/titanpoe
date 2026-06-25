-- CreateEnum
CREATE TYPE "ListingBadge" AS ENUM ('HOT', 'SALE', 'NEW', 'BEST_VALUE');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "badge" "ListingBadge",
ADD COLUMN     "compareAtCents" INTEGER,
ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "highlightsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "highlightsRu" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "ListingTier" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "etaHours" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ListingTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingAddon" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,

    CONSTRAINT "ListingAddon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListingTier_listingId_idx" ON "ListingTier"("listingId");

-- CreateIndex
CREATE INDEX "ListingAddon_listingId_idx" ON "ListingAddon"("listingId");

-- AddForeignKey
ALTER TABLE "ListingTier" ADD CONSTRAINT "ListingTier_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingAddon" ADD CONSTRAINT "ListingAddon_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
