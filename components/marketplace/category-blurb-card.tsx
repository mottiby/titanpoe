import { Link } from '@/i18n/navigation';
import { CategoryIcon } from './category-icons';
import { PriceTag } from './price-tag';

/**
 * "What we cover" SEO/intro card: category icon + name + one-line blurb + a
 * "from €X" anchor price. Whole card links to the filtered catalog.
 */
export function CategoryBlurbCard({
  slug,
  name,
  blurb,
  fromCents,
  fromLabel,
  locale,
  className,
}: {
  slug: string;
  name: string;
  blurb: string;
  fromCents?: number;
  fromLabel: string;
  locale: string;
  className?: string;
}) {
  return (
    <Link
      href={`/catalog?category=${slug}`}
      className={
        'card-sheen group block h-full rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none ' +
        (className ?? '')
      }
    >
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/12 text-primary">
          <CategoryIcon slug={slug} className="size-4" />
        </span>
        <h3 className="font-medium group-hover:text-primary">{name}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{blurb}</p>
      {fromCents != null && (
        <div className="mt-3">
          <PriceTag cents={fromCents} locale={locale} size="sm" prefix={fromLabel} />
        </div>
      )}
    </Link>
  );
}
