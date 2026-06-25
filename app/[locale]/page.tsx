import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  Lock,
} from 'lucide-react';
import {
  getCatalog,
  getCategories,
  getFeaturedReviews,
  getReviewStats,
} from '@/lib/sellers/queries';
import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/components/ui/button';
import { TrustStrip } from '@/components/marketplace/trust-strip';
import { TrustScore } from '@/components/marketplace/trust-score';
import { ActivityTicker } from '@/components/marketplace/activity-ticker';
import { ListingCard } from '@/components/marketplace/listing-card';
import { ReviewCard } from '@/components/marketplace/reviews';
import { Faq } from '@/components/marketplace/faq';
import { HeroArt } from '@/components/marketplace/hero-art';
import { categoryIcon } from '@/components/marketplace/category-icons';
import { FadeIn, Reveal, Stagger, StaggerItem, CountUp } from '@/components/motion/motion';

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('HomePage');
  const tr = await getTranslations('Trust');
  const tc = await getTranslations('Catalog');

  const [categories, listings, reviews, reviewStats] = await Promise.all([
    getCategories(),
    getCatalog(),
    getFeaturedReviews(6),
    getReviewStats(),
  ]);
  const featured = listings.slice(0, 6);
  const tickerItems = listings
    .slice(0, 8)
    .map((l) => (locale === 'ru' ? l.titleRu : l.titleEn));

  const trust = {
    escrow: tr('escrow'),
    moneyBack: tr('moneyBack'),
    verified: tr('verified'),
    chat: tr('chat'),
  };
  const cardLabels = { eta: tc('eta'), hours: tc('hours'), from: tc('from') };
  const badgeLabels = {
    HOT: tc('badgeHot'),
    SALE: tc('badgeSale'),
    NEW: tc('badgeNew'),
    BEST_VALUE: tc('badgeBest'),
  };
  const steps = [1, 2, 3, 4].map((n) => ({
    title: t(`step${n}Title`),
    desc: t(`step${n}Desc`),
  }));
  const guards = [
    { icon: ShieldCheck, title: t('guardEscrowTitle'), desc: t('guardEscrowDesc') },
    { icon: RotateCcw, title: t('guardMoneyTitle'), desc: t('guardMoneyDesc') },
    { icon: BadgeCheck, title: t('guardVerifiedTitle'), desc: t('guardVerifiedDesc') },
    { icon: Lock, title: t('guardSecureTitle'), desc: t('guardSecureDesc') },
  ];
  const stats: { node: React.ReactNode; label: string }[] = [
    { node: <CountUp to={5000} suffix="+" />, label: t('statOrders') },
    { node: <CountUp to={4.9} decimals={1} suffix="★" />, label: t('statRating') },
    { node: <CountUp to={1200} suffix="+" />, label: t('statSellers') },
    { node: '24/7', label: t('statSupport') },
  ];
  const faq = [1, 2, 3, 4, 5].map((n) => ({ q: t(`faqQ${n}`), a: t(`faqA${n}`) }));

  return (
    <main>
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden">
        <HeroArt />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div className="text-center lg:text-left">
            <FadeIn>
              <h1 className="mx-auto max-w-2xl font-display text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl lg:mx-0">
                {t('heroTitle')}
              </h1>
            </FadeIn>
            <FadeIn delay={0.06}>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground lg:mx-0">
                {t('heroSubtitle')}
              </p>
            </FadeIn>
            <FadeIn delay={0.12}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link href="/catalog" className={buttonVariants({ size: 'lg' })}>
                  {t('cta')}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/sell"
                  className={buttonVariants({ variant: 'outline', size: 'lg' })}
                >
                  {t('secondaryCta')}
                </Link>
              </div>
              <TrustStrip
                labels={trust}
                className="mt-8 justify-center lg:justify-start"
              />
              {tickerItems.length > 0 && (
                <div className="mt-5 flex justify-center lg:justify-start">
                  <ActivityTicker
                    items={tickerItems}
                    liveLabel={t('activityLive')}
                    orderedLabel={t('activityOrdered')}
                  />
                </div>
              )}
            </FadeIn>
          </div>

          {/* Live product showcase */}
          {featured[0] && (
            <FadeIn delay={0.18} className="hidden lg:block">
              <div className="relative mx-auto max-w-sm">
                <ListingCard
                  listing={featured[0]}
                  locale={locale}
                  labels={cardLabels}
                  badgeLabels={badgeLabels}
                />
                <div className="glass absolute -top-3 -left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-[0_8px_24px_-12px_rgba(0,0,0,0.7)]">
                  <ShieldCheck className="size-3.5 text-primary" />
                  {trust.escrow}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Category showcase */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">{t('categoriesTitle')}</h2>
          <p className="mt-1 text-muted-foreground">{t('categoriesSubtitle')}</p>
        </Reveal>
        <Stagger className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((c) => {
            const Icon = categoryIcon(c.slug);
            return (
              <StaggerItem key={c.id}>
                <Link
                  href={`/catalog?category=${c.slug}`}
                  className="card-sheen group flex h-full items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--border),white_22%)] focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/12 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium">
                    {locale === 'ru' ? c.nameRu : c.nameEn}
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* How escrow works */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Reveal className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">{t('howTitle')}</h2>
            <p className="mt-1 text-muted-foreground">{t('howSubtitle')}</p>
          </Reveal>
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <StaggerItem
                key={i}
                className="card-sheen rounded-lg border border-border bg-card p-5"
              >
                <span className="grid size-8 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-medium">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{t('guardTitle')}</h2>
            <p className="mt-1 text-muted-foreground">{t('guardSubtitle')}</p>
          </div>
          {reviewStats.count > 0 && (
            <TrustScore
              score={reviewStats.avg}
              label={t('trustScore')}
              basedOn={t('trustBasedOn', { count: reviewStats.count })}
            />
          )}
        </Reveal>
        <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guards.map(({ icon: Icon, title, desc }) => (
            <StaggerItem
              key={title}
              className="card-sheen rounded-lg border border-border bg-card p-5"
            >
              <span className="grid size-9 place-items-center rounded-md bg-primary/12 text-primary">
                <Icon className="size-4" />
              </span>
              <h3 className="mt-3 font-medium">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Stats */}
        <Stagger className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s, i) => (
            <StaggerItem
              key={i}
              className="card-sheen rounded-lg border border-border bg-card px-5 py-4 text-center"
            >
              <div className="text-2xl font-bold tracking-tight tabular-nums">
                {s.node}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Featured listings */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
          <Reveal className="flex items-end justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('featuredTitle')}
            </h2>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              {tc('title')}
              <ArrowRight className="size-3.5" />
            </Link>
          </Reveal>
          <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((l) => (
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
        </section>
      )}

      {/* Testimonials */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('testimonialsTitle')}
            </h2>
          </Reveal>
          <div className="-mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {reviews.map((r) => (
              <div key={r.id} className="w-[300px] shrink-0 snap-start">
                <ReviewCard review={r} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Expert CTA + League context */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight">{t('expertTitle')}</h2>
            <p className="mt-2 text-muted-foreground">{t('expertText')}</p>
            <Link
              href="/catalog"
              className={buttonVariants({ className: 'mt-5' })}
            >
              {t('expertCta')}
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight">{t('leagueTitle')}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{t('leagueBody')}</p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">{t('faqTitle')}</h2>
          <div className="mt-6">
            <Faq items={faq} />
          </div>
        </Reveal>
      </section>

      {/* Seller CTA band */}
      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('sellerBandTitle')}
            </h2>
            <p className="mt-1 text-muted-foreground">{t('sellerBandSubtitle')}</p>
          </div>
          <Link
            href="/sell"
            className={buttonVariants({ size: 'lg', className: 'shrink-0' })}
          >
            {t('sellerBandCta')}
          </Link>
        </div>
      </section>
    </main>
  );
}
