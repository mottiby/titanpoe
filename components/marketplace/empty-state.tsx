import { cn } from "@/lib/utils";

type IconType = React.ComponentType<{ className?: string }>;

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: IconType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/40 px-6 py-16 text-center",
        className
      )}
    >
      {Icon && <Icon className="size-8 text-muted-foreground" />}
      <p className="mt-3 font-medium">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
