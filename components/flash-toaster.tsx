'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';

/**
 * Reads a `?flash=<key>` param (set by server-action redirects) and shows a
 * transient toast, then strips the param. Mounted (in Suspense) in the layout.
 */
export function FlashToaster() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Orders');
  const [msg, setMsg] = useState<string | null>(null);
  const flash = sp.get('flash');

  useEffect(() => {
    if (!flash) return;
    const map: Record<string, string> = {
      orderPlaced: t('orderPlaced'),
      addedToCart: t('addedToCart'),
      ordersPlaced: t('ordersPlaced'),
    };
    const m = map[flash];
    if (!m) return;

    setMsg(m);
    const params = new URLSearchParams(sp.toString());
    params.delete('flash');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });

    const timer = setTimeout(() => setMsg(null), 4000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flash]);

  if (!msg) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 px-4"
    >
      <div className="glass flex items-center gap-2 rounded-lg px-4 py-3 text-sm shadow-[0_8px_24px_-12px_rgba(0,0,0,0.7)]">
        <CheckCircle2 className="size-4 shrink-0 text-success" />
        {msg}
      </div>
    </div>
  );
}
