import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fulfillmentMeta, type FulfillmentKey } from '@/lib/fulfillment';

/**
 * Explains one delivery method (party-play / trade / coaching). Copy comes from
 * the caller (i18n). Account-safe methods get a reassuring badge — the safety
 * note is a trust signal, not decoration.
 */
export function FulfillmentCard({
  method,
  name,
  desc,
  safeBadge,
  className,
}: {
  method: FulfillmentKey;
  name: string;
  desc: string;
  safeBadge: string;
  className?: string;
}) {
  const meta = fulfillmentMeta[method];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <div className={cn('card-sheen rounded-lg border border-border bg-card p-5', className)}>
      <span className="grid size-9 place-items-center rounded-md bg-primary/12 text-primary">
        <Icon className="size-4" />
      </span>
      <h3 className="mt-3 font-medium">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      {meta.safe && (
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[0.7rem] font-medium text-success">
          <ShieldCheck className="size-3" />
          {safeBadge}
        </span>
      )}
    </div>
  );
}
