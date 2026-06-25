import { cn } from '@/lib/utils';
import { RatingStars } from './rating-stars';

export function RatingSummary({
  avg,
  count,
  className,
}: {
  avg: number;
  count: number;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="text-3xl font-bold tabular-nums">{avg.toFixed(1)}</div>
      <div>
        <RatingStars value={avg} />
        <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">{count}</div>
      </div>
    </div>
  );
}

type ReviewItem = {
  id: string;
  rating: number;
  body: string;
  order: { buyer: { name: string | null; email: string } };
};

export function ReviewCard({ review }: { review: ReviewItem }) {
  const who =
    review.order.buyer.name || review.order.buyer.email.split('@')[0] || 'Player';
  const initials = who.trim().slice(0, 2).toUpperCase();
  return (
    <div className="card-sheen rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-secondary text-[0.7rem] font-semibold text-secondary-foreground">
            {initials}
          </span>
          <span className="text-sm font-medium">{who}</span>
        </span>
        <RatingStars value={review.rating} />
      </div>
      {review.body && (
        <p className="mt-2 text-sm text-muted-foreground">{review.body}</p>
      )}
    </div>
  );
}
