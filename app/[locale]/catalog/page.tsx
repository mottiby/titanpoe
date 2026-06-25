import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCatalog, getCategories } from '@/lib/sellers/queries';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export default async function CatalogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('Catalog');
  const [listings, categories] = await Promise.all([getCatalog(category), getCategories()]);

  const tab = (active: boolean) =>
    active ? 'font-semibold underline' : 'text-muted-foreground hover:text-foreground';

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">{t('title')}</h1>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link href="/catalog" className={tab(!category)}>
          {t('all')}
        </Link>
        {categories.map((c) => (
          <Link key={c.id} href={`/catalog?category=${c.slug}`} className={tab(category === c.slug)}>
            {locale === 'ru' ? c.nameRu : c.nameEn}
          </Link>
        ))}
      </div>

      {listings.length === 0 ? (
        <p className="mt-10 text-muted-foreground">{t('empty')}</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {listings.map((l) => (
            <li key={l.id} className="rounded-lg border p-4 transition-colors hover:bg-muted/40">
              <Link href={`/catalog/${l.id}`} className="block">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{locale === 'ru' ? l.titleRu : l.titleEn}</span>
                  <span className="font-semibold">€{(l.priceCents / 100).toFixed(2)}</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {locale === 'ru' ? l.category.nameRu : l.category.nameEn} · {l.league} · {l.platform}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {t('by')} {l.seller.displayName} · {t('eta')} {l.etaHours}
                  {t('hours')}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
