import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { categoryIcon } from './category-icons';

type Category = { id: string; slug: string; nameEn: string; nameRu: string };

/** Persistent left category list for the catalog (overgear-style). */
export function CategorySidebar({
  categories,
  counts,
  active,
  locale,
  allLabel,
  className,
}: {
  categories: Category[];
  counts: Record<string, number>;
  active?: string;
  locale: string;
  allLabel: string;
  className?: string;
}) {
  const item = (isActive: boolean) =>
    cn(
      'flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40',
      isActive
        ? 'bg-primary/12 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    );
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <nav aria-label="Categories" className={cn('space-y-0.5', className)}>
      <Link href="/catalog" className={item(!active)}>
        <span>{allLabel}</span>
        <span className="text-xs tabular-nums opacity-70">{total}</span>
      </Link>
      {categories.map((c) => {
        const Icon = categoryIcon(c.slug);
        return (
          <Link
            key={c.id}
            href={`/catalog?category=${c.slug}`}
            className={item(active === c.slug)}
          >
            <span className="inline-flex min-w-0 items-center gap-2">
              <Icon className="size-4 shrink-0" />
              <span className="truncate">
                {locale === 'ru' ? c.nameRu : c.nameEn}
              </span>
            </span>
            <span className="text-xs tabular-nums opacity-70">
              {counts[c.id] ?? 0}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
