import { ChevronDown } from 'lucide-react';

// CSS-only accordion (native <details>) — no client JS, keyboard-accessible.
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
      {items.map((it, i) => (
        <details key={i} className="group bg-card/40 px-4 open:bg-card/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 font-medium [&::-webkit-details-marker]:hidden">
            {it.q}
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
