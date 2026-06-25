import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { logout } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Props = { params: Promise<{ locale: string }> };

export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/signin`);
  }

  const t = await getTranslations('Account');
  const roles = session.user.roles ?? [];

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">{t('title')}</h1>

      <Card className="mt-6 p-5">
        <p className="text-sm text-muted-foreground">{session.user.email}</p>
        <div className="mt-4">
          <div className="text-xs text-muted-foreground">{t('roles')}</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {roles.length > 0 ? (
              roles.map((r) => (
                <Badge key={r} variant="primary">
                  {r}
                </Badge>
              ))
            ) : (
              <span className="text-sm">—</span>
            )}
          </div>
        </div>
        <form action={logout} className="mt-6">
          <Button type="submit" variant="outline">
            {t('signOut')}
          </Button>
        </form>
      </Card>
    </main>
  );
}
