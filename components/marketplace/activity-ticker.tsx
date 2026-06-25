'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/** Subtle "someone just ordered X" live-activity ticker. Privacy-safe (no buyer data). */
export function ActivityTicker({
  items,
  liveLabel,
  orderedLabel,
  className,
}: {
  items: string[];
  liveLabel: string;
  orderedLabel: string;
  className?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % items.length), 3500);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        'inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs',
        className,
      )}
    >
      <span className="inline-flex shrink-0 items-center gap-1 font-medium text-success">
        <span className="size-1.5 animate-pulse rounded-full bg-success" />
        {liveLabel}
      </span>
      <span key={i} className="truncate text-muted-foreground">
        <span className="text-foreground">{orderedLabel}</span> «{items[i]}»
      </span>
    </div>
  );
}
