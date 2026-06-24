import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { getSellerProfile, getCategories } from '@/lib/sellers/queries';
import { CreateListingForm } from '@/components/sellers/create-listing-form';

type Props = { params: Promise<{ locale: string }> };

export default async function NewListingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/signin`);

  const profile = await getSellerProfile(session.user.id);
  if (!profile) redirect(`/${locale}/sell`);

  const t = await getTranslations('Seller');
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-3xl font-bold">{t('createListingTitle')}</h1>
      <CreateListingForm categories={categories} />
    </main>
  );
}
