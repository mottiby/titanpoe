import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { getDisputedOrders } from '@/lib/moderation/queries';
import { resolveDisputeAction } from '@/lib/moderation/actions';
import { Button } from '@/components/ui/button';

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
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">{t('title')}</h1>

      {disputes.length === 0 ? (
        <p className="mt-6 text-muted-foreground">{t('none')}</p>
      ) : (
        <ul className="mt-6 divide-y">
          {disputes.map((o) => (
            <li key={o.id} className="py-4">
              <div className="font-medium">
                {locale === 'ru' ? o.listing.titleRu : o.listing.titleEn} — €
                {(o.amountCents / 100).toFixed(2)}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t('buyer')}: {o.buyer.email} · {t('reason')}: {o.dispute?.reason}
              </div>
              <div className="mt-3 flex gap-2">
                <form action={resolveDisputeAction}>
                  <input type="hidden" name="orderId" value={o.id} />
                  <input type="hidden" name="outcome" value="REFUND" />
                  <Button variant="outline">{t('refundBuyer')}</Button>
                </form>
                <form action={resolveDisputeAction}>
                  <input type="hidden" name="orderId" value={o.id} />
                  <input type="hidden" name="outcome" value="RELEASE" />
                  <Button>{t('releaseSeller')}</Button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
