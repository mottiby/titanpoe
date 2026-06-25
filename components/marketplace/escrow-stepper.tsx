import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["PAID", "IN_PROGRESS", "DELIVERED", "COMPLETED"] as const;
const ORDER = ["CREATED", ...STEPS];
const BRANCH = ["DISPUTED", "REFUNDED", "CANCELLED"];

/**
 * The signature trust element: visualizes the escrow lifecycle
 * Paid (in escrow) → In progress → Delivered → Completed.
 * `labels` maps each status code to a localized label (Orders.status.*).
 */
export function EscrowStepper({
  status,
  labels,
  className,
}: {
  status: string;
  labels: Record<string, string>;
  className?: string;
}) {
  const isBranch = BRANCH.includes(status);
  const currentRank = ORDER.indexOf(status);

  return (
    <div className={className}>
      <ol className="flex items-start">
        {STEPS.map((step, i) => {
          const rank = ORDER.indexOf(step);
          const reached = !isBranch && currentRank >= rank;
          const done = !isBranch && currentRank > rank;
          const active = reached && !done;
          const isFirst = i === 0;
          const isLast = i === STEPS.length - 1;
          return (
            <li key={step} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <span
                  className={cn(
                    "h-px flex-1",
                    isFirst ? "opacity-0" : reached ? "bg-primary" : "bg-border"
                  )}
                />
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors",
                    done && "border-primary bg-primary text-primary-foreground",
                    active && "glow-primary border-primary bg-primary/15 text-primary",
                    !reached && "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {done ? <Check className="size-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "h-px flex-1",
                    isLast ? "opacity-0" : done ? "bg-primary" : "bg-border"
                  )}
                />
              </div>
              <span
                className={cn(
                  "mt-1.5 max-w-[7rem] text-center text-[11px] leading-tight",
                  active ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {labels[step]}
              </span>
            </li>
          );
        })}
      </ol>

      {isBranch && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
          {labels[status]}
        </p>
      )}
    </div>
  );
}
