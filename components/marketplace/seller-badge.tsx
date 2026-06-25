import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { RatingStars } from "./rating-stars";

/** Avatar (initials) + name + rating + optional verified badge. */
export function SellerBadge({
  name,
  ratingAvg = 0,
  ratingCount = 0,
  verified = false,
  className,
}: {
  name: string;
  ratingAvg?: number;
  ratingCount?: number;
  verified?: boolean;
  className?: string;
}) {
  const initials = name.trim().slice(0, 2).toUpperCase();
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-[0.7rem] font-semibold text-secondary-foreground">
        {initials}
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="inline-flex items-center gap-1 truncate text-sm font-medium">
          {name}
          {verified && (
            <BadgeCheck className="size-3.5 shrink-0 text-primary" aria-label="Verified" />
          )}
        </span>
        {ratingCount > 0 && <RatingStars value={ratingAvg} count={ratingCount} />}
      </span>
    </span>
  );
}
