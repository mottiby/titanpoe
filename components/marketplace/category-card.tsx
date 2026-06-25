import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { ListingArt } from './listing-art';
import { categoryIcon } from './category-icons';

/** Large image category card (overgear-style) — full-bleed arcane art + glyph + name + count. */
export function CategoryCard({
  slug,
  name,
  countLabel,
  className,
}: {
  slug: string;
  name: string;
  countLabel?: string;
  className?: string;
}) {
  const Icon = categoryIcon(slug);
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
        seed={`cat-${slug}`}
        className="absolute inset-0 size-full transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-4">
        <span className="grid size-9 place-items-center rounded-md bg-primary/15 text-primary backdrop-blur">
          <Icon className="size-4" />
        </span>
        <div className="mt-3 font-display text-lg font-semibold">{name}</div>
        {countLabel && (
          <div className="text-xs text-muted-foreground">{countLabel}</div>
        )}
      </div>
    </Link>
  );
}
