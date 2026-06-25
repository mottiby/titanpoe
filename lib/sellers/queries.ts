import { db } from '@/lib/db';
import type {
  Platform,
  LeagueMode,
  ListingBadge,
} from '@/lib/generated/prisma/client';

export function getSellerProfile(userId: string) {
  return db.sellerProfile.findUnique({ where: { userId } });
}

export function getCategories() {
  return db.category.findMany({ orderBy: { slug: 'asc' } });
}

export type CatalogSort = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'eta';
export type CatalogOpts = {
  category?: string;
  platform?: string;
  leagueMode?: string;
  sort?: CatalogSort;
};

export function getCatalog(opts: CatalogOpts = {}) {
  const { category, platform, leagueMode, sort = 'newest' } = opts;

  const orderBy =
    sort === 'price_asc'
      ? { priceCents: 'asc' as const }
      : sort === 'price_desc'
        ? { priceCents: 'desc' as const }
        : sort === 'rating'
          ? { seller: { ratingAvg: 'desc' as const } }
          : sort === 'eta'
            ? { etaHours: 'asc' as const }
            : { createdAt: 'desc' as const };

  return db.listing.findMany({
    where: {
      active: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(platform ? { platform: platform as Platform } : {}),
      ...(leagueMode ? { leagueMode: leagueMode as LeagueMode } : {}),
    },
    include: {
      category: true,
      seller: true,
      tiers: { select: { priceCents: true } },
    },
    orderBy,
  });
}

export function getListing(id: string) {
  return db.listing.findUnique({
    where: { id },
    include: {
      category: true,
      seller: true,
      tiers: { orderBy: { position: 'asc' } },
      addons: true,
    },
  });
}

/** Listings flagged HOT or SALE — for the home "Hot offers" section. */
export function getHotOffers(take = 4) {
  return db.listing.findMany({
    where: { active: true, badge: { in: ['HOT', 'SALE'] as ListingBadge[] } },
    include: { category: true, seller: true, tiers: { select: { priceCents: true } } },
    orderBy: { createdAt: 'desc' },
    take,
  });
}

export function getRelatedListings(categoryId: string, excludeId: string, take = 3) {
  return db.listing.findMany({
    where: { active: true, categoryId, id: { not: excludeId } },
    include: { category: true, seller: true, tiers: { select: { priceCents: true } } },
    orderBy: { createdAt: 'desc' },
    take,
  });
}

export function getMyListings(sellerId: string) {
  return db.listing.findMany({
    where: { sellerId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
}

/** Reviews for a specific listing (via its orders). */
export function getListingReviews(listingId: string, take = 8) {
  return db.review.findMany({
    where: { order: { listingId }, body: { not: '' } },
    include: { order: { include: { buyer: { select: { name: true, email: true } } } } },
    orderBy: { createdAt: 'desc' },
    take,
  });
}

/** Aggregate review stats for the marketplace-wide trust score. */
export async function getReviewStats() {
  const agg = await db.review.aggregate({
    _avg: { rating: true },
    _count: { rating: true },
  });
  return { avg: agg._avg.rating ?? 0, count: agg._count.rating };
}

/** High-rated reviews across the marketplace, for the home testimonials. */
export function getFeaturedReviews(take = 6) {
  return db.review.findMany({
    where: { rating: { gte: 4 }, body: { not: '' } },
    include: {
      order: {
        include: {
          buyer: { select: { name: true, email: true } },
          listing: { include: { seller: { select: { displayName: true } } } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take,
  });
}
