import { cn } from "@/lib/utils";

/** Landing stat: big number + label. */
export function StatPill({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card-sheen rounded-lg border border-border bg-card px-5 py-4 text-center",
        className
      )}
    >
      <div className="text-2xl font-bold tracking-tight tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
