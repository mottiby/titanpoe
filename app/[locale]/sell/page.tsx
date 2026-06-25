import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BadgeCheck, Plus, Store } from 'lucide-react';
import { auth } from '@/auth';
import { getSellerProfile, getMyListings } from '@/lib/sellers/queries';
import { BecomeSellerForm } from '@/components/sellers/become-seller-form';
import { startStripeOnboarding } from '@/lib/sellers/actions';
import { Link } from '@/i18n/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListingCard } from '@/components/marketplace/listing-card';
import { EmptyState } from '@/components/marketplace/empty-state';

type Props = { params: Promise<{ locale: string }> };

export default async function SellPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/signin`);

  const t = await getTranslations('Seller');
  const tc = await getTranslations('Catalog');
  const profile = await getSellerProfile(session.user.id);

  if (!profile) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {t('becomeTitle')}
        </h1>
        <p className="mt-2 text-muted-foreground">{t('becomeSubtitle')}</p>
        <Card className="mt-6 p-5">
          <BecomeSellerForm />
        </Card>
      </main>
    );
  }

  const listings = await getMyListings(profile.id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {profile.displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('type')}: {profile.type}
          </p>
        </div>
        <Link href="/sell/new" className={buttonVariants({})}>
          <Plus className="size-4" />
          {t('newListing')}
        </Link>
      </div>

      {/* Payouts */}
      <Card className="mt-6 p-5">
        <div className="text-sm font-semibold">{t('payoutsTitle')}</div>
        {profile.stripeAcctId ? (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-success">
            <BadgeCheck className="size-4" />
            {t('stripeConnected')}
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted-foreground">{t('payoutsHint')}</p>
            <form action={startStripeOnboarding} className="mt-3">
              <Button variant="outline">{t('connectStripe')}</Button>
            </form>
          </>
        )}
      </Card>

      {/* Listings */}
      <h2 className="mt-10 text-lg font-semibold">{t('myListings')}</h2>
      {listings.length === 0 ? (
        <EmptyState
          icon={Store}
          title={t('noListings')}
          action={
            <Link href="/sell/new" className={buttonVariants({})}>
              <Plus className="size-4" />
              {t('newListing')}
            </Link>
          }
          className="mt-3"
        />
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {listings.map((l) => (
            <ListingCard
              key={l.id}
              listing={l}
              locale={locale}
              labels={{ eta: tc('eta'), hours: tc('hours') }}
              compact
            />
          ))}
        </div>
      )}
    </main>
  );
}
