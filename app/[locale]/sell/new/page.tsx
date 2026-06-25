import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { getSellerProfile, getCategories } from '@/lib/sellers/queries';
import { CreateListingForm } from '@/components/sellers/create-listing-form';
import { Card } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';

type Props = { params: Promise<{ locale: string }> };

export default async function NewListingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/signin`);

  const profile = await getSellerProfile(session.user.id);
  if (!profile) redirect(`/${locale}/sell`);

  const t = await getTranslations('Seller');
  const tNav = await getTranslations('Nav');
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <Link href="/sell" className="text-sm text-muted-foreground hover:text-foreground">
        ← {tNav('sell')}
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
        {t('createListingTitle')}
      </h1>
      <Card className="mt-6 p-5 sm:p-6">
        <CreateListingForm categories={categories} />
      </Card>
    </main>
  );
}
