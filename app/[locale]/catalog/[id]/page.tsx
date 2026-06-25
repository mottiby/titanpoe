import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { getListing } from '@/lib/sellers/queries';
import { placeOrder } from '@/lib/orders/actions';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function ListingPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Catalog');
  const listing = await getListing(id);
  if (!listing || !listing.active) notFound();

  const session = await auth();
  const isOwner = session?.user?.id === listing.seller.userId;

  const row = (label: string, value: string) => (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/catalog" className="text-sm text-muted-foreground hover:underline">
        {t('back')}
      </Link>
      <h1 className="mt-4 text-3xl font-bold">
        {locale === 'ru' ? listing.titleRu : listing.titleEn}
      </h1>
      <p className="mt-2 text-2xl font-semibold">${(listing.priceCents / 100).toFixed(2)}</p>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        {row('Category', locale === 'ru' ? listing.category.nameRu : listing.category.nameEn)}
        {row('Seller', listing.seller.displayName)}
        {row('League', `${listing.league} (${listing.leagueMode})`)}
        {row('Platform', listing.platform)}
        {row(t('eta'), `${listing.etaHours}${t('hours')}`)}
        {row('Fulfillment', listing.fulfillment)}
      </dl>

      <div className="mt-8">
        {!session?.user ? (
          <Link
            href="/signin"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            {t('signInToOrder')}
          </Link>
        ) : isOwner ? (
          <p className="text-sm text-muted-foreground">{t('yourListing')}</p>
        ) : (
          <form action={placeOrder}>
            <input type="hidden" name="listingId" value={listing.id} />
            <Button>{t('order')}</Button>
          </form>
        )}
      </div>
    </main>
  );
}
