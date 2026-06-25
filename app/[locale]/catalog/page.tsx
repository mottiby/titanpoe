import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PackageSearch } from 'lucide-react';
import {
  getCatalog,
  getCategories,
  getCategoryCounts,
  type CatalogSort,
} from '@/lib/sellers/queries';
import { CategoryFilter } from '@/components/marketplace/category-filter';
import { CategorySidebar } from '@/components/marketplace/category-sidebar';
import { CatalogControls } from '@/components/marketplace/catalog-controls';
import { FeatureBanner } from '@/components/marketplace/feature-banner';
import { ListingCard } from '@/components/marketplace/listing-card';
import { EmptyState } from '@/components/marketplace/empty-state';
import { categoryTint, categoryIcon } from '@/components/marketplace/category-icons';
import { Stagger, StaggerItem } from '@/components/motion/motion';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    platform?: string;
    leagueMode?: string;
    sort?: string;
    q?: string;
  }>;
};

const BANNER_SLUGS = ['carries', 'currency', 'leveling'];

export default async function CatalogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, platform, leagueMode, sort, q } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('Catalog');
  const [listings, categories, counts] = await Promise.all([
    getCatalog({
      category,
      platform,
      leagueMode,
      sort: (sort as CatalogSort) ?? 'newest',
      q,
    }),
    getCategories(),
    getCategoryCounts(),
  ]);

  const activeCat = category
    ? categories.find((c) => c.slug === category)
    : undefined;
  const ActiveIcon = activeCat ? categoryIcon(activeCat.slug) : null;
  const tint = activeCat ? categoryTint(activeCat.slug) : '';

  const cardLabels = {
    eta: t('eta'),
    hours: t('hours'),
    from: t('from'),
    view: t('view'),
    limited: t('limited'),
  };
  const badgeLabels = {
    HOT: t('badgeHot'),
    SALE: t('badgeSale'),
    NEW: t('badgeNew'),
    BEST_VALUE: t('badgeBest'),
  };
  const controlLabels = {
    platformAll: t('platformAll'),
    modeAll: t('modeAll'),
    sort: t('sort'),
    sortNewest: t('sortNewest'),
    sortPriceAsc: t('sortPriceAsc'),
    sortPriceDesc: t('sortPriceDesc'),
    sortRating: t('sortRating'),
    sortEta: t('sortEta'),
  };

  const showBanners = !category && !q;
  const banners = BANNER_SLUGS.map((s) => categories.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({ slug: c.slug, title: locale === 'ru' ? c.nameRu : c.nameEn }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {q ? t('resultsFor', { q }) : t('title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('results', { count: listings.length })}
        </p>
      </div>

      {showBanners && banners.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {banners.map((b) => (
            <FeatureBanner
              key={b.slug}
              slug={b.slug}
              title={b.title}
              ctaLabel={t('view')}
              className="h-32"
            />
          ))}
        </div>
      )}

      {activeCat && ActiveIcon && (
        <div
          className="mt-6 flex items-center gap-3 overflow-hidden rounded-lg border border-border p-4"
          style={{
            background: `linear-gradient(120deg, rgba(${tint},0.14), transparent 65%)`,
          }}
        >
          <span
            className="grid size-10 shrink-0 place-items-center rounded-md"
            style={{ background: `rgba(${tint},0.16)`, color: `rgb(${tint})` }}
          >
            <ActiveIcon className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold">
            {locale === 'ru' ? activeCat.nameRu : activeCat.nameEn}
          </span>
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <CategorySidebar
              categories={categories}
              counts={counts}
              active={category}
              locale={locale}
              allLabel={t('allCategories')}
            />
          </div>
        </aside>

        <div>
          <div className="lg:hidden">
            <CategoryFilter
              categories={categories}
              active={category}
              locale={locale}
              allLabel={t('all')}
            />
          </div>
          <div className="mt-3 lg:mt-0">
            <CatalogControls labels={controlLabels} />
          </div>

          {listings.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title={
                q || category || platform || leagueMode
                  ? t('filteredEmpty')
                  : t('empty')
              }
              className="mt-6"
            />
          ) : (
            <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((l, i) => (
                <StaggerItem key={l.id}>
                  <ListingCard
                    listing={l}
                    locale={locale}
                    labels={cardLabels}
                    badgeLabels={badgeLabels}
                    priority={i === 0}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </div>
    </main>
  );
}
