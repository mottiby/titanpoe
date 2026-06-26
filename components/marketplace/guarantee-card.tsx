import { cn } from '@/lib/utils';

type IconType = React.ComponentType<{ className?: string }>;

/** A single trust guarantee (escrow / refund / verified / dispute). Presentational. */
export function GuaranteeCard({
  icon: Icon,
  title,
  desc,
  className,
}: {
  icon: IconType;
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <div className={cn('card-sheen h-full rounded-lg border border-border bg-card p-5', className)}>
      <span className="grid size-9 place-items-center rounded-md bg-primary/12 text-primary">
        <Icon className="size-4" />
      </span>
      <h3 className="mt-3 font-medium">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}
