import { cn } from '@/lib/utils';
import { RatingStars } from './rating-stars';

/** Trustpilot-style trust score widget driven by real review aggregates. */
export function TrustScore({
  score,
  label,
  basedOn,
  className,
}: {
  score: number;
  label: string;
  basedOn: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'card-sheen inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3',
        className,
      )}
    >
      <div className="flex flex-col">
        <span className="text-[0.7rem] font-semibold tracking-wide text-success uppercase">
          {label}
        </span>
        <span className="mt-0.5 inline-flex items-center gap-2">
          <RatingStars value={score} />
          <span className="text-sm font-bold tabular-nums">{score.toFixed(1)}</span>
        </span>
      </div>
      <span className="max-w-[11rem] text-xs leading-tight text-muted-foreground">
        {basedOn}
      </span>
    </div>
  );
}
