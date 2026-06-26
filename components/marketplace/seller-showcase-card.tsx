import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RatingStars } from './rating-stars';

/**
 * Featured verified seller — supply-side trust proof for the home page.
 * Display-only (no per-seller page yet); the section CTA points to top-rated services.
 */
export function SellerShowcaseCard({
  name,
  typeLabel,
  ratingAvg,
  ratingCount,
  verified,
  servicesCount,
  servicesLabel,
  className,
}: {
  name: string;
  typeLabel: string;
  ratingAvg: number;
  ratingCount: number;
  verified: boolean;
  servicesCount: number;
  servicesLabel: string;
  className?: string;
}) {
  const initials = name.trim().slice(0, 2).toUpperCase();
  return (
    <div className={cn('card-sheen h-full rounded-lg border border-border bg-card p-5', className)}>
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
          {initials}
        </span>
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1 font-medium">
            <span className="truncate">{name}</span>
            {verified && (
              <BadgeCheck className="size-3.5 shrink-0 text-primary" aria-label="Verified" />
            )}
          </div>
          <div className="text-xs text-muted-foreground">{typeLabel}</div>
        </div>
      </div>
      {ratingCount > 0 ? (
        <div className="mt-3">
          <RatingStars value={ratingAvg} count={ratingCount} />
        </div>
      ) : (
        <div className="mt-3 h-[1.125rem]" aria-hidden />
      )}
      <div className="mt-2 text-xs text-muted-foreground">
        {servicesCount} {servicesLabel}
      </div>
    </div>
  );
}
