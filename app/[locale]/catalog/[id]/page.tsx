import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getListing } from '@/lib/sellers/queries';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function ListingPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Catalog');
  const listing = await getListing(id);
  if (!listing || !listing.active) notFound();

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

      {/* Checkout + escrow arrive with the Stripe task */}
      <Button className="mt-8" disabled>
        Order (coming soon)
      </Button>
    </main>
  );
}
