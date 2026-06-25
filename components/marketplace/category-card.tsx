import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { ListingArt } from './listing-art';
import { CategoryIcon, categoryTint } from './category-icons';
import { itemImage } from '@/lib/items';

/** Large image category card (overgear-style) — full-bleed arcane art + per-category color. */
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
  const tint = categoryTint(slug);
  const itemSrc = itemImage({ categorySlug: slug });
  return (
    <Link
      href={`/catalog?category=${slug}`}
      className={cn(
        'group relative block overflow-hidden rounded-lg border border-border transition-all duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none',
        className,
      )}
      style={{ borderColor: `rgba(${tint},0.22)` }}
    >
      <ListingArt
        slug={slug}
        seed={`cat-${slug}`}
        itemSrc={itemSrc}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
        className="absolute inset-0 size-full"
      />
      {/* Lighter overlay so the category color/art stays visible. */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/88 via-background/25 to-transparent" />
      {/* Color wash on hover for extra pop. */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 90% at 50% 120%, rgba(${tint},0.22), transparent 60%)`,
        }}
      />
      <div className="relative flex h-full flex-col justify-end p-4">
        <span
          className="grid size-11 place-items-center rounded-lg backdrop-blur"
          style={{ background: `rgba(${tint},0.18)`, color: `rgb(${tint})` }}
        >
          <CategoryIcon slug={slug} className="size-5" />
        </span>
        <div className="mt-3 font-display text-lg leading-tight font-semibold">
          {name}
        </div>
        {countLabel && (
          <div className="text-xs text-muted-foreground">{countLabel}</div>
        )}
      </div>
    </Link>
  );
}
