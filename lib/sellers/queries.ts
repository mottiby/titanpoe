import { db } from '@/lib/db';

export function getSellerProfile(userId: string) {
  return db.sellerProfile.findUnique({ where: { userId } });
}

export function getCategories() {
  return db.category.findMany({ orderBy: { slug: 'asc' } });
}

export function getCatalog(categorySlug?: string) {
  return db.listing.findMany({
    where: {
      active: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: { category: true, seller: true },
    orderBy: { createdAt: 'desc' },
  });
}

export function getListing(id: string) {
  return db.listing.findUnique({
    where: { id },
    include: { category: true, seller: true },
  });
}

export function getMyListings(sellerId: string) {
  return db.listing.findMany({
    where: { sellerId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
}
