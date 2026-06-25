import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CategoryIcon, categoryTint } from './category-icons';

// Fully-owned "arcane" art (no external/game assets): a layered mesh gradient,
// a faint per-listing geometric sigil, the category glyph, grain and a top sheen.
//
// When `itemSrc` is set we additionally compose, back-to-front:
//   (a) the mesh/sigil background, slightly dimmed so the item reads as hero;
//   (b) a soft ember-gold glow pooled center-bottom, matching the gold rim-glow
//       baked into the item PNGs (brand: gold = value/price — used here only as
//       art light behind the product, never as a UI accent);
//   (c) the transparent item image, object-contain, grounded with a drop + a
//       contact shadow. On hover (any ancestor `group`) the item lifts and
//       scales a touch while the glow blooms — all disabled under reduced motion.
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function Sigil({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute top-1/2 left-1/2 size-[125%] opacity-[0.07]"
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      <polygon points="50,5 89,27 89,73 50,95 11,73 11,27" />
      <polygon points="50,21 75,35 75,65 50,79 25,65 25,35" />
      <circle cx="50" cy="50" r="13" />
      <path d="M50 5V21M89 27L75 35M89 73L75 65M50 95V79M11 73L25 65M11 27L25 35" />
    </svg>
  );
}

export function ListingArt({
  slug,
  seed,
  className,
  itemSrc,
  alt = '',
  priority = false,
  sizes = '(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px',
}: {
  slug: string;
  seed?: string;
  className?: string;
  /** Transparent item PNG (see lib/items.ts). Falls back to generative art. */
  itemSrc?: string;
  /** Decorative by default ('') since cards carry the title next to the art. */
  alt?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const h = hash(seed || slug);
  const tint = categoryTint(slug);
  const x = 18 + (h % 64);
  const y = 18 + ((h >> 3) % 54);
  const x2 = 12 + ((h >> 5) % 70);
  const rot = (h % 50) - 25;
  const hasItem = Boolean(itemSrc);

  return (
    <div
      aria-hidden={alt ? undefined : true}
      className={cn('relative isolate overflow-hidden bg-card', className)}
    >
      {/* (a) Mesh background — subtle parallax zoom on hover; dimmed under item. */}
      <div
        className={cn(
          'absolute inset-0 transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
          hasItem && 'opacity-[0.72]',
        )}
        style={{
          background: `radial-gradient(60% 80% at ${x}% ${y}%, rgba(${tint},0.34), transparent 60%), radial-gradient(55% 70% at ${100 - x}% ${100 - y}%, rgba(123,97,255,0.20), transparent 60%), radial-gradient(45% 60% at ${x2}% 112%, rgba(96,165,250,0.12), transparent 60%), linear-gradient(160deg,#0e1016,#14161c 70%)`,
        }}
      />
      <span style={{ color: `rgb(${tint})` }}>
        <Sigil style={{ transform: `translate(-50%,-50%) rotate(${rot}deg)` }} />
      </span>
      {/* Corner glyph — hidden behind an item so it doesn't clutter the product. */}
      {!hasItem && (
        <span
          className="absolute -right-5 -bottom-5 opacity-[0.13]"
          style={{ transform: `rotate(${rot / 2}deg)`, color: `rgb(${tint})` }}
        >
          <CategoryIcon slug={slug} className="size-28" />
        </span>
      )}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.05) 0.5px, transparent 0.5px)',
          backgroundSize: '4px 4px',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

      {hasItem && (
        <>
          {/* (b) Ember-gold glow pooled center-bottom; blooms on hover. */}
          <div
            className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-500 ease-[var(--ease-out)] group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(50% 44% at 50% 74%, rgba(245,181,68,0.42), rgba(245,181,68,0.12) 46%, transparent 72%)',
            }}
          />
          {/* Contact shadow for "weight"; widens slightly on hover. */}
          <div className="pointer-events-none absolute bottom-[12%] left-1/2 h-2.5 w-1/3 -translate-x-1/2 rounded-[100%] bg-black/45 blur-md transition-all duration-500 ease-[var(--ease-out)] group-hover:w-[38%] group-hover:bg-black/55 motion-reduce:transition-none" />
          {/* (c) The item — lifts + scales a touch on hover. */}
          <div className="absolute inset-0 flex items-center justify-center p-[7%] transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1.5 group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100">
            <div className="relative size-full">
              <Image
                src={itemSrc!}
                alt={alt}
                fill
                sizes={sizes}
                priority={priority}
                className="object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
