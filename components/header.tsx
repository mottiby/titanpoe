import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { auth } from '@/auth';

export async function Header() {
  const active = await getLocale();
  const t = await getTranslations('Nav');
  const session = await auth();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold">
          PoE2 Marketplace
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/catalog" className="hover:underline">
            {t('catalog')}
          </Link>
          <Link href="/sell" className="hover:underline">
            {t('sell')}
          </Link>
          {session?.user ? (
            <Link href="/account" className="hover:underline">
              {session.user.email}
            </Link>
          ) : (
            <Link href="/signin" className="hover:underline">
              {t('signIn')}
            </Link>
          )}
          <span className="flex items-center gap-2">
            {routing.locales.map((l) => (
              <Link
                key={l}
                href="/"
                locale={l}
                className={
                  l === active
                    ? 'font-semibold underline underline-offset-4'
                    : 'text-muted-foreground hover:text-foreground'
                }
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </span>
        </nav>
      </div>
    </header>
  );
}
