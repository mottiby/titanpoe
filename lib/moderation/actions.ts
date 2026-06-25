'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { resolveDispute } from '@/lib/orders/service';
import { providerForSeller } from '@/lib/payments/select';

export async function isModerator(): Promise<boolean> {
  const session = await auth();
  const roles = session?.user?.roles ?? [];
  return roles.includes('MODERATOR') || roles.includes('ADMIN');
}

export async function resolveDisputeAction(formData: FormData) {
  if (!(await isModerator())) redirect('/');

  const orderId = String(formData.get('orderId'));
  const outcome = formData.get('outcome') === 'REFUND' ? 'REFUND' : 'RELEASE';

  const order = await db.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { listing: { include: { seller: true } } },
  });
  await resolveDispute(orderId, outcome, providerForSeller(order.listing.seller.stripeAcctId));
}
