import { getLocale, getTranslations } from 'next-intl/server';
import { Menu, ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { auth } from '@/auth';
import { getCategories } from '@/lib/sellers/queries';
import { categoryIcon } from '@/components/marketplace/category-icons';

export async function Header() {
  const active = await getLocale();
  const t = await getTranslations('Nav');
  const tc = await getTranslations('Catalog');
  const session = await auth();
  const categories = await getCategories();
  const roles = session?.user?.roles ?? [];
  const isModerator = roles.includes('MODERATOR') || roles.includes('ADMIN');

  const links = [
    { href: '/sell', label: t('sell') },
    ...(session?.user ? [{ href: '/orders', label: t('orders') }] : []),
    ...(isModerator ? [{ href: '/moderate', label: t('moderate') }] : []),
  ];

  const navLink = 'text-sm text-muted-foreground transition-colors hover:text-foreground';
  const localeLink = (l: string) =>
    l === active
      ? 'rounded px-1.5 py-0.5 text-xs font-semibold text-foreground'
      : 'rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground';

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          Titan<span className="text-primary">poe2</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {/* Catalog mega-menu */}
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
              {t('catalog')}
              <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="absolute left-0 z-50 mt-3 w-64 rounded-lg glass p-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.7)]">
              <Link
                href="/catalog"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {tc('all')}
              </Link>
              <div className="my-1 border-t border-border" />
              {categories.map((c) => {
                const Icon = categoryIcon(c.slug);
                return (
                  <Link
                    key={c.id}
                    href={`/catalog?category=${c.slug}`}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    <Icon className="size-4 text-primary" />
                    {active === 'ru' ? c.nameRu : c.nameEn}
                  </Link>
                );
              })}
            </div>
          </details>

          {links.map((l) => (
            <Link key={l.href} href={l.href} className={navLink}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1 sm:flex">
            {routing.locales.map((l) => (
              <Link key={l} href="/" locale={l} className={localeLink(l)}>
                {l.toUpperCase()}
              </Link>
            ))}
          </span>

          {session?.user ? (
            <Link
              href="/account"
              className="hidden max-w-[12rem] truncate text-sm text-muted-foreground hover:text-foreground sm:inline"
            >
              {session.user.email}
            </Link>
          ) : (
            <Link
              href="/signin"
              className="hidden text-sm font-medium text-primary hover:underline sm:inline"
            >
              {t('signIn')}
            </Link>
          )}

          {/* Mobile menu (CSS-only, no client JS) */}
          <details className="relative md:hidden">
            <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-md border border-border [&::-webkit-details-marker]:hidden">
              <Menu className="size-4" />
              <span className="sr-only">Menu</span>
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg glass p-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.7)]">
              <Link
                href="/catalog"
                className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                {t('catalog')}
              </Link>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  {l.label}
                </Link>
              ))}
              <div className="my-1 border-t border-border" />
              {session?.user ? (
                <Link
                  href="/account"
                  className="block truncate rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  {session.user.email}
                </Link>
              ) : (
                <Link
                  href="/signin"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-muted"
                >
                  {t('signIn')}
                </Link>
              )}
              <div className="flex gap-2 px-3 py-2">
                {routing.locales.map((l) => (
                  <Link key={l} href="/" locale={l} className={localeLink(l)}>
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
