import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Gamepad2, Check } from 'lucide-react';
import { auth } from '@/auth';
import {
  getListing,
  getListingReviews,
  getRelatedListings,
} from '@/lib/sellers/queries';
import { leagueModeLabel } from '@/lib/format';
import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriceTag } from '@/components/marketplace/price-tag';
import { SellerBadge } from '@/components/marketplace/seller-badge';
import { TrustStrip } from '@/components/marketplace/trust-strip';
import { ListingArt } from '@/components/marketplace/listing-art';
import { ListingCard } from '@/components/marketplace/listing-card';
import { ProductConfigurator } from '@/components/marketplace/product-configurator';
import { RatingSummary, ReviewCard } from '@/components/marketplace/reviews';
import { StickyBuyBar } from '@/components/marketplace/sticky-buy-bar';
import { Breadcrumbs } from '@/components/marketplace/breadcrumbs';
import { categoryIcon } from '@/components/marketplace/category-icons';
import { itemImage } from '@/lib/items';

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function ListingPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Catalog');
  const ts = await getTranslations('Seller');
  const tr = await getTranslations('Trust');
  const tCommon = await getTranslations('Common');

  const listing = await getListing(id);
  if (!listing || !listing.active) notFound();

  const session = await auth();
  const isOwner = session?.user?.id === listing.seller.userId;

  const [reviews, related] = await Promise.all([
    getListingReviews(id),
    getRelatedListings(listing.categoryId, id),
  ]);

  const Icon = categoryIcon(listing.category.slug);
  const title = locale === 'ru' ? listing.titleRu : listing.titleEn;
  const cat = locale === 'ru' ? listing.category.nameRu : listing.category.nameEn;
  const description = locale === 'ru' ? listing.descriptionRu : listing.descriptionEn;
  const highlights =
    (locale === 'ru' ? listing.highlightsRu : listing.highlightsEn) ?? [];

  const tierPrices = listing.tiers.map((tier) => tier.priceCents);
  const fromCents = tierPrices.length ? Math.min(...tierPrices) : listing.priceCents;
  const tiered = tierPrices.length > 1;

  const fulfillmentLabel =
    (
      {
        PARTY_PLAY: ts('fulfillmentPartyPlay'),
        TRADE: ts('fulfillmentTrade'),
        SESSION: ts('fulfillmentSession'),
      } as Record<string, string>
    )[listing.fulfillment] ?? listing.fulfillment;

  const trust = {
    escrow: tr('escrow'),
    moneyBack: tr('moneyBack'),
    verified: tr('verified'),
    chat: tr('chat'),
  };
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

  const meta = (label: string, value: string) => (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 pb-24 sm:px-6 lg:pb-10">
      <Breadcrumbs
        items={[
          { label: tCommon('home'), href: '/' },
          { label: t('title'), href: '/catalog' },
          { label: cat, href: `/catalog?category=${listing.category.slug}` },
          { label: title },
        ]}
      />

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left: content */}
        <div>
          <ListingArt
            slug={listing.category.slug}
            seed={listing.id}
            itemSrc={itemImage({ id: listing.id, categorySlug: listing.category.slug })}
            priority
            sizes="(max-width: 1024px) 100vw, 760px"
            className="aspect-[21/9] rounded-lg border border-border"
          />

          <div className="mt-5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Icon className="size-4 text-primary" />
            {cat}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{title}</h1>

          <div className="mt-3 flex flex-wrap gap-2">
            {listing.badge && (
              <Badge variant="primary">
                {badgeLabels[listing.badge] ?? listing.badge}
              </Badge>
            )}
            <Badge variant="outline">{listing.league}</Badge>
            <Badge variant="outline">{leagueModeLabel(listing.leagueMode)}</Badge>
            <Badge variant="outline" className="gap-1">
              <Gamepad2 className="size-3" />
              {listing.platform}
            </Badge>
          </div>

          {highlights.length > 0 && (
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {h}
                </li>
              ))}
            </ul>
          )}

          {description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">{t('description')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          )}

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {meta(t('league'), listing.league)}
            {meta(t('mode'), leagueModeLabel(listing.leagueMode))}
            {meta(t('platform'), listing.platform)}
            {meta(t('fulfillment'), fulfillmentLabel)}
            {meta(t('eta'), `${listing.etaHours}${t('hours')}`)}
          </dl>

          <div className="mt-8 border-t border-border pt-6">
            <h2 className="text-lg font-semibold">{t('aboutSeller')}</h2>
            <div className="mt-3">
              <SellerBadge
                name={listing.seller.displayName}
                ratingAvg={listing.seller.ratingAvg}
                ratingCount={listing.seller.ratingCount}
                verified={listing.seller.kycStatus === 'VERIFIED'}
              />
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{t('reviews')}</h2>
              {listing.seller.ratingCount > 0 && (
                <RatingSummary
                  avg={listing.seller.ratingAvg}
                  count={listing.seller.ratingCount}
                />
              )}
            </div>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">{t('noReviews')}</p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: sticky purchase panel */}
        <aside id="buy" className="lg:sticky lg:top-20 lg:self-start">
          <Card glass className="p-5">
            {!session?.user ? (
              <>
                <PriceTag
                  cents={fromCents}
                  locale={locale}
                  size="lg"
                  prefix={tiered ? t('from') : undefined}
                />
                <Link
                  href="/signin"
                  className={buttonVariants({ size: 'lg', className: 'mt-5 w-full' })}
                >
                  {t('signInToOrder')}
                </Link>
              </>
            ) : isOwner ? (
              <>
                <PriceTag
                  cents={fromCents}
                  locale={locale}
                  size="lg"
                  prefix={tiered ? t('from') : undefined}
                />
                <p className="mt-4 rounded-md border border-border bg-muted/40 px-3 py-2 text-center text-sm text-muted-foreground">
                  {t('yourListing')}
                </p>
              </>
            ) : (
              <ProductConfigurator
                listingId={listing.id}
                basePriceCents={listing.priceCents}
                locale={locale}
                tiers={listing.tiers}
                addons={listing.addons}
                labels={{
                  option: t('option'),
                  quantity: t('quantity'),
                  extras: t('extras'),
                  total: t('total'),
                  order: t('orderNow'),
                  addToCart: t('addToCart'),
                }}
              />
            )}

            <p className="mt-3 text-center text-xs text-muted-foreground">
              {t('escrowNote')}
            </p>
            <div className="mt-5 border-t border-border pt-4">
              <TrustStrip labels={trust} className="flex-col items-start gap-2 text-xs" />
            </div>
          </Card>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">{t('related')}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                locale={locale}
                labels={cardLabels}
                badgeLabels={badgeLabels}
              />
            ))}
          </div>
        </section>
      )}

      {session?.user && !isOwner && (
        <StickyBuyBar
          cents={fromCents}
          locale={locale}
          label={t('orderNow')}
          fromLabel={tiered ? t('from') : undefined}
        />
      )}
    </main>
  );
}
