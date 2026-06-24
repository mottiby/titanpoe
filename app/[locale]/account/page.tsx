import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { logout } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';

type Props = { params: Promise<{ locale: string }> };

export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/signin`);
  }

  const t = await getTranslations('Account');

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="mt-2 text-muted-foreground">{session.user.email}</p>
      <p className="mt-1 text-sm">
        {t('roles')}: {session.user.roles.join(', ') || '—'}
      </p>
      <form action={logout} className="mt-6">
        <Button type="submit" variant="outline">
          {t('signOut')}
        </Button>
      </form>
    </main>
  );
}
