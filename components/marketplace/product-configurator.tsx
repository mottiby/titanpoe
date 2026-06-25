'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { PriceTag } from './price-tag';
import { placeConfiguredOrder } from '@/lib/orders/actions';

type Tier = { id: string; nameEn: string; nameRu: string; priceCents: number };
type Addon = { id: string; nameEn: string; nameRu: string; priceCents: number };

export type ConfiguratorLabels = {
  option: string;
  quantity: string;
  extras: string;
  total: string;
  order: string;
};

export function ProductConfigurator({
  listingId,
  basePriceCents,
  locale,
  tiers,
  addons,
  labels,
}: {
  listingId: string;
  basePriceCents: number;
  locale: string;
  tiers: Tier[];
  addons: Addon[];
  labels: ConfiguratorLabels;
}) {
  const [tierId, setTierId] = useState<string | undefined>(tiers[0]?.id);
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const name = (o: { nameEn: string; nameRu: string }) =>
    locale === 'ru' ? o.nameRu : o.nameEn;
  const tier = tiers.find((t) => t.id === tierId);
  const unit = tier ? tier.priceCents : basePriceCents;
  const addonsTotal = addons
    .filter((a) => selected.includes(a.id))
    .reduce((s, a) => s + a.priceCents, 0);
  const total = unit * qty + addonsTotal;

  return (
    <form action={placeConfiguredOrder} className="space-y-4">
      <input type="hidden" name="listingId" value={listingId} />
      {tier && <input type="hidden" name="tierId" value={tierId} />}
      <input type="hidden" name="quantity" value={qty} />

      {tiers.length > 0 && (
        <div>
          <div className="mb-1.5 text-xs font-medium text-muted-foreground">
            {labels.option}
          </div>
          <div className="grid gap-2">
            {tiers.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setTierId(t.id)}
                aria-pressed={t.id === tierId}
                className={cn(
                  'flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none',
                  t.id === tierId
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                <span>{name(t)}</span>
                <span className="font-medium tabular-nums text-foreground">
                  {formatPrice(t.priceCents, locale)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {labels.quantity}
        </span>
        <div className="inline-flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="−"
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="w-8 text-center tabular-nums">{qty}</span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            aria-label="+"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      {addons.length > 0 && (
        <div>
          <div className="mb-1.5 text-xs font-medium text-muted-foreground">
            {labels.extras}
          </div>
          <div className="space-y-1.5">
            {addons.map((a) => (
              <label
                key={a.id}
                className="flex cursor-pointer items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="addon"
                    value={a.id}
                    checked={selected.includes(a.id)}
                    onChange={(e) =>
                      setSelected((s) =>
                        e.target.checked ? [...s, a.id] : s.filter((x) => x !== a.id),
                      )
                    }
                    className="size-4 accent-primary"
                  />
                  {name(a)}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  +{formatPrice(a.priceCents, locale)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm text-muted-foreground">{labels.total}</span>
        <PriceTag cents={total} locale={locale} size="lg" />
      </div>

      <Button type="submit" size="lg" className="w-full">
        {labels.order}
      </Button>
    </form>
  );
}
