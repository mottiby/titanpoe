import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PackageSearch } from 'lucide-react';
import {
  getCatalog,
  getCategories,
  type CatalogSort,
} from '@/lib/sellers/queries';
import { CategoryFilter } from '@/components/marketplace/category-filter';
import { CatalogControls } from '@/components/marketplace/catalog-controls';
import { ListingCard } from '@/components/marketplace/listing-card';
import { EmptyState } from '@/components/marketplace/empty-state';
import {
  categoryTint,
  categoryIcon,
} from '@/components/marketplace/category-icons';
import { Stagger, StaggerItem } from '@/components/motion/motion';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    platform?: string;
    leagueMode?: string;
    sort?: string;
  }>;
};

export default async function CatalogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, platform, leagueMode, sort } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('Catalog');
  const [listings, categories] = await Promise.all([
    getCatalog({
      category,
      platform,
      leagueMode,
      sort: (sort as CatalogSort) ?? 'newest',
    }),
    getCategories(),
  ]);

  const activeCat = category
    ? categories.find((c) => c.slug === category)
    : undefined;
  const ActiveIcon = activeCat ? categoryIcon(activeCat.slug) : null;
  const tint = activeCat ? categoryTint(activeCat.slug) : '';

  const cardLabels = { eta: t('eta'), hours: t('hours'), from: t('from') };
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('results', { count: listings.length })}
        </p>
      </div>

      {activeCat && ActiveIcon && (
        <div
          className="mt-4 flex items-center gap-3 overflow-hidden rounded-lg border border-border p-4"
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

      <div className="sticky top-14 z-30 -mx-4 mt-4 space-y-3 bg-background/85 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
        <CategoryFilter
          categories={categories}
          active={category}
          locale={locale}
          allLabel={t('all')}
        />
        <CatalogControls labels={controlLabels} />
      </div>

      {listings.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title={category || platform || leagueMode ? t('filteredEmpty') : t('empty')}
          className="mt-8"
        />
      ) : (
        <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <StaggerItem key={l.id}>
              <ListingCard
                listing={l}
                locale={locale}
                labels={cardLabels}
                badgeLabels={badgeLabels}
              />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </main>
  );
}
