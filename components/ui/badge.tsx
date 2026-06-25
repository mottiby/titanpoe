import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "border-border bg-muted text-muted-foreground",
        primary: "border-primary/30 bg-primary/12 text-primary",
        success: "border-success/30 bg-success/12 text-success",
        warning: "border-warning/30 bg-warning/12 text-warning",
        info: "border-info/30 bg-info/12 text-info",
        destructive: "border-destructive/30 bg-destructive/12 text-destructive",
        outline: "border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
)

function Badge({
  className,
  variant,
  dot,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { dot?: boolean }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {props.children}
    </span>
  )
}

export { Badge, badgeVariants }
