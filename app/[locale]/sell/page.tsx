import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { getSellerProfile, getMyListings } from '@/lib/sellers/queries';
import { BecomeSellerForm } from '@/components/sellers/become-seller-form';
import { startStripeOnboarding } from '@/lib/sellers/actions';
import { Link } from '@/i18n/navigation';

type Props = { params: Promise<{ locale: string }> };

export default async function SellPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/signin`);

  const t = await getTranslations('Seller');
  const profile = await getSellerProfile(session.user.id);

  if (!profile) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-3xl font-bold">{t('becomeTitle')}</h1>
        <p className="mt-2 text-muted-foreground">{t('becomeSubtitle')}</p>
        <BecomeSellerForm />
      </main>
    );
  }

  const listings = await getMyListings(profile.id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{profile.displayName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('type')}: {profile.type}
          </p>
        </div>
        <Link
          href="/sell/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {t('newListing')}
        </Link>
      </div>

      <div className="mt-4">
        {profile.stripeAcctId ? (
          <p className="text-sm text-muted-foreground">{t('stripeConnected')}</p>
        ) : (
          <form action={startStripeOnboarding}>
            <button
              type="submit"
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              {t('connectStripe')}
            </button>
          </form>
        )}
      </div>

      <ul className="mt-8 divide-y">
        {listings.length === 0 && (
          <p className="text-muted-foreground">{t('noListings')}</p>
        )}
        {listings.map((l) => (
          <li key={l.id} className="py-3">
            <Link href={`/catalog/${l.id}`} className="font-medium hover:underline">
              {locale === 'ru' ? l.titleRu : l.titleEn}
            </Link>
            <span className="ml-2 text-sm text-muted-foreground">
              €{(l.priceCents / 100).toFixed(2)} · {locale === 'ru' ? l.category.nameRu : l.category.nameEn}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
