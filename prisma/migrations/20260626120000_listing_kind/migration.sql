-- CreateEnum
CREATE TYPE "ListingKind" AS ENUM ('SERVICE', 'BUNDLE');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "kind" "ListingKind" NOT NULL DEFAULT 'SERVICE';
