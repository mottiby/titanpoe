'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { leagueModeLabel } from '@/lib/format';
import { selectClassName } from '@/components/ui/input';

export type ControlLabels = {
  platformAll: string;
  modeAll: string;
  sort: string;
  sortNewest: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortRating: string;
  sortEta: string;
};

const MODES = ['SOFTCORE', 'HARDCORE', 'SSF_SOFTCORE', 'SSF_HARDCORE'];

export function CatalogControls({ labels }: { labels: ControlLabels }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function set(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const platform = sp.get('platform') ?? '';
  const leagueMode = sp.get('leagueMode') ?? '';
  const sort = sp.get('sort') ?? 'newest';
  const sel = cn(selectClassName, 'h-9 w-auto min-w-[8.5rem]');

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
        <SlidersHorizontal className="size-4" />
      </span>
      <select
        aria-label={labels.platformAll}
        className={sel}
        value={platform}
        onChange={(e) => set('platform', e.target.value)}
      >
        <option value="">{labels.platformAll}</option>
        <option value="PC">PC</option>
        <option value="PS5">PS5</option>
        <option value="XBOX">Xbox</option>
      </select>
      <select
        aria-label={labels.modeAll}
        className={sel}
        value={leagueMode}
        onChange={(e) => set('leagueMode', e.target.value)}
      >
        <option value="">{labels.modeAll}</option>
        {MODES.map((m) => (
          <option key={m} value={m}>
            {leagueModeLabel(m)}
          </option>
        ))}
      </select>
      <span className="ml-auto inline-flex items-center gap-1.5">
        <ArrowUpDown className="size-4 text-muted-foreground" />
        <select
          aria-label={labels.sort}
          className={sel}
          value={sort}
          onChange={(e) => set('sort', e.target.value)}
        >
          <option value="newest">{labels.sortNewest}</option>
          <option value="price_asc">{labels.sortPriceAsc}</option>
          <option value="price_desc">{labels.sortPriceDesc}</option>
          <option value="rating">{labels.sortRating}</option>
          <option value="eta">{labels.sortEta}</option>
        </select>
      </span>
    </div>
  );
}
