import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Receipt } from 'lucide-react';
import { auth } from '@/auth';
import { getMyOrders, getSellerOrders } from '@/lib/orders/queries';
import { getSellerProfile } from '@/lib/sellers/queries';
import { Link } from '@/i18n/navigation';
import { PriceTag } from '@/components/marketplace/price-tag';
import { OrderStatusBadge } from '@/components/marketplace/order-status-badge';
import { EmptyState } from '@/components/marketplace/empty-state';

type Props = { params: Promise<{ locale: string }> };

type OrderRow = {
  id: string;
  status: string;
  amountCents: number;
  listing: { titleEn: string; titleRu: string };
};

export default async function OrdersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/signin`);

  const t = await getTranslations('Orders');
  const purchases = await getMyOrders(session.user.id);
  const profile = await getSellerProfile(session.user.id);
  const sales = profile ? await getSellerOrders(profile.id) : [];

  const row = (o: OrderRow) => (
    <Link
      key={o.id}
      href={`/orders/${o.id}`}
      className="card-sheen flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-[color-mix(in_oklab,var(--border),white_22%)] focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
    >
      <span className="truncate font-medium">
        {locale === 'ru' ? o.listing.titleRu : o.listing.titleEn}
      </span>
      <span className="flex shrink-0 items-center gap-3">
        <PriceTag cents={o.amountCents} locale={locale} size="sm" />
        <OrderStatusBadge status={o.status} label={t(`status.${o.status}`)} />
      </span>
    </Link>
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">{t('title')}</h1>

      <h2 className="mt-8 text-lg font-semibold">{t('purchases')}</h2>
      {purchases.length === 0 ? (
        <EmptyState icon={Receipt} title={t('none')} className="mt-3" />
      ) : (
        <div className="mt-3 flex flex-col gap-2">{purchases.map(row)}</div>
      )}

      {profile && (
        <>
          <h2 className="mt-10 text-lg font-semibold">{t('sales')}</h2>
          {sales.length === 0 ? (
            <EmptyState icon={Receipt} title={t('none')} className="mt-3" />
          ) : (
            <div className="mt-3 flex flex-col gap-2">{sales.map(row)}</div>
          )}
        </>
      )}
    </main>
  );
}
