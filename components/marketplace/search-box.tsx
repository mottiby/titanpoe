'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Header search → navigates to /<locale>/catalog?q=… (locale-prefixed). */
export function SearchBox({
  locale,
  placeholder,
  className,
}: {
  locale: string;
  placeholder: string;
  className?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(
      `/${locale}/catalog${term ? `?q=${encodeURIComponent(term)}` : ''}`,
    );
  }

  return (
    <form onSubmit={submit} className={cn('relative', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-full rounded-full border border-input bg-popover/40 pr-3 pl-9 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
      />
    </form>
  );
}
