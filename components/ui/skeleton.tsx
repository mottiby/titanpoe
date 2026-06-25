import { cn } from "@/lib/utils"

// animate-pulse is disabled automatically under prefers-reduced-motion (globals.css).
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted/60", className)}
    />
  )
}

export { Skeleton }
