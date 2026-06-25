import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { ListingArt } from './listing-art';

/** Large promotional banner (overgear "Ascendancy Points / BiS Items" style). */
export function FeatureBanner({
  slug,
  title,
  ctaLabel,
  className,
}: {
  slug: string;
  title: string;
  ctaLabel: string;
  className?: string;
}) {
  return (
    <Link
      href={`/catalog?category=${slug}`}
      className={cn(
        'group relative block overflow-hidden rounded-lg border border-border transition-all duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--border),white_22%)] focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none',
        className,
      )}
    >
      <ListingArt
        slug={slug}
        seed={`banner-${slug}`}
        className="absolute inset-0 size-full transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/45 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-5">
        <div className="font-display text-xl leading-tight font-bold tracking-tight">
          {title}
        </div>
        <span className="mt-1 inline-flex items-center gap-1 text-sm text-primary">
          {ctaLabel}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
