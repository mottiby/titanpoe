'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { auth } from '@/auth';

export type SellerActionState = { error?: string } | undefined;

const becomeSellerSchema = z.object({
  displayName: z.string().trim().min(2).max(50),
  type: z.enum(['BOOSTER', 'SUPPLIER', 'COACH', 'TEAM']),
});

export async function becomeSeller(
  _prev: SellerActionState,
  formData: FormData,
): Promise<SellerActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Not authenticated.' };

  const parsed = becomeSellerSchema.safeParse({
    displayName: formData.get('displayName'),
    type: formData.get('type'),
  });
  if (!parsed.success) return { error: 'Invalid input.' };

  const existing = await db.sellerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!existing) {
    await db.sellerProfile.create({
      data: {
        userId: session.user.id,
        displayName: parsed.data.displayName,
        type: parsed.data.type,
      },
    });
    await db.user.update({
      where: { id: session.user.id },
      data: { roles: { set: ['BUYER', 'SELLER'] } },
    });
  }
  redirect('/sell');
}

const createListingSchema = z.object({
  categoryId: z.string().min(1),
  titleEn: z.string().trim().min(3).max(100),
  titleRu: z.string().trim().min(3).max(100),
  price: z.coerce.number().positive().max(100000),
  etaHours: z.coerce.number().int().positive().max(2160),
  fulfillment: z.enum(['PARTY_PLAY', 'TRADE', 'SESSION']),
  platform: z.enum(['PC', 'PS5', 'XBOX']),
  league: z.string().trim().min(1).max(40),
  leagueMode: z.enum(['SOFTCORE', 'HARDCORE', 'SSF_SOFTCORE', 'SSF_HARDCORE']),
});

export async function createListing(
  _prev: SellerActionState,
  formData: FormData,
): Promise<SellerActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Not authenticated.' };

  const seller = await db.sellerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!seller) return { error: 'Become a seller first.' };

  const parsed = createListingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'Invalid input.' };
  const d = parsed.data;

  const listing = await db.listing.create({
    data: {
      sellerId: seller.id,
      categoryId: d.categoryId,
      titleEn: d.titleEn,
      titleRu: d.titleRu,
      priceCents: Math.round(d.price * 100),
      etaHours: d.etaHours,
      fulfillment: d.fulfillment,
      platform: d.platform,
      league: d.league,
      leagueMode: d.leagueMode,
    },
  });

  revalidatePath('/catalog');
  redirect(`/catalog/${listing.id}`);
}
