import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex flex-wrap items-center gap-1 text-sm text-muted-foreground',
        className,
      )}
    >
      {items.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden />}
          {c.href ? (
            <Link href={c.href} className="rounded hover:text-foreground">
              {c.label}
            </Link>
          ) : (
            <span className="text-foreground" aria-current="page">
              {c.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
