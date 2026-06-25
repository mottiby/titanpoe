import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { getMyOrders, getSellerOrders } from '@/lib/orders/queries';
import { getSellerProfile } from '@/lib/sellers/queries';
import { Link } from '@/i18n/navigation';

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
    <li key={o.id} className="py-3">
      <Link
        href={`/orders/${o.id}`}
        className="flex items-center justify-between hover:underline"
      >
        <span>{locale === 'ru' ? o.listing.titleRu : o.listing.titleEn}</span>
        <span className="text-sm text-muted-foreground">
          €{(o.amountCents / 100).toFixed(2)} · {t(`status.${o.status}`)}
        </span>
      </Link>
    </li>
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">{t('title')}</h1>

      <h2 className="mt-8 text-lg font-semibold">{t('purchases')}</h2>
      <ul className="divide-y">
        {purchases.length === 0 ? (
          <p className="py-3 text-muted-foreground">{t('none')}</p>
        ) : (
          purchases.map(row)
        )}
      </ul>

      {profile && (
        <>
          <h2 className="mt-10 text-lg font-semibold">{t('sales')}</h2>
          <ul className="divide-y">
            {sales.length === 0 ? (
              <p className="py-3 text-muted-foreground">{t('none')}</p>
            ) : (
              sales.map(row)
            )}
          </ul>
        </>
      )}
    </main>
  );
}
