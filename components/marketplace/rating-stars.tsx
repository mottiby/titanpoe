import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** 0–5 rating with half-step fill + optional count. */
export function RatingStars({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  const pct = (Math.max(0, Math.min(5, value)) / 5) * 100;
  const stars = (filled: boolean) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={cn("size-3.5", filled && "fill-current")} />
    ));

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative inline-flex" aria-hidden>
        <span className="inline-flex text-muted-foreground/40">{stars(false)}</span>
        <span
          className="absolute inset-0 inline-flex overflow-hidden text-accent"
          style={{ width: `${pct}%` }}
        >
          {stars(true)}
        </span>
      </span>
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground tabular-nums">
          {value.toFixed(1)} ({count})
        </span>
      )}
    </span>
  );
}
