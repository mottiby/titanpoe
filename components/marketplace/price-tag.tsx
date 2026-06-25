import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

const sizeMap = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
} as const;

/** The € amount in gold, tabular figures. Gold (accent) is reserved for value. */
export function PriceTag({
  cents,
  locale = "en",
  size = "md",
  prefix,
  className,
}: {
  cents: number;
  locale?: string;
  size?: keyof typeof sizeMap;
  prefix?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-baseline gap-1", className)}>
      {prefix && (
        <span className="text-[0.7em] font-medium tracking-wide text-muted-foreground">
          {prefix}
        </span>
      )}
      <span
        className={cn(
          "price font-bold tracking-tight text-accent",
          sizeMap[size]
        )}
      >
        {formatPrice(cents, locale)}
      </span>
    </span>
  );
}
