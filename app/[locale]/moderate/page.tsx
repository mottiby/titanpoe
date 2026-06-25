import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ShieldCheck } from 'lucide-react';
import { auth } from '@/auth';
import { getDisputedOrders } from '@/lib/moderation/queries';
import { resolveDisputeAction } from '@/lib/moderation/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PriceTag } from '@/components/marketplace/price-tag';
import { EmptyState } from '@/components/marketplace/empty-state';

type Props = { params: Promise<{ locale: string }> };

export default async function ModeratePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  const roles = session?.user?.roles ?? [];
  if (!roles.includes('MODERATOR') && !roles.includes('ADMIN')) {
    redirect(`/${locale}`);
  }

  const t = await getTranslations('Moderate');
  const disputes = await getDisputedOrders();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">{t('title')}</h1>

      {disputes.length === 0 ? (
        <EmptyState icon={ShieldCheck} title={t('none')} className="mt-6" />
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {disputes.map((o) => (
            <Card key={o.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="font-medium">
                  {locale === 'ru' ? o.listing.titleRu : o.listing.titleEn}
                </div>
                <PriceTag cents={o.amountCents} locale={locale} size="sm" />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {t('buyer')}: {o.buyer.email}
              </div>
              <div className="mt-1 text-sm">
                <span className="text-muted-foreground">{t('reason')}:</span>{' '}
                {o.dispute?.reason}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <form action={resolveDisputeAction}>
                  <input type="hidden" name="orderId" value={o.id} />
                  <input type="hidden" name="outcome" value="REFUND" />
                  <Button type="submit" variant="outline">{t('refundBuyer')}</Button>
                </form>
                <form action={resolveDisputeAction}>
                  <input type="hidden" name="orderId" value={o.id} />
                  <input type="hidden" name="outcome" value="RELEASE" />
                  <Button type="submit">{t('releaseSeller')}</Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
