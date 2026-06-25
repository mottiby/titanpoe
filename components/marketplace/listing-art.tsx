import { cn } from '@/lib/utils';
import { categoryIcon, categoryTint } from './category-icons';

// Fully-owned "arcane" art (no external/game assets): a layered mesh gradient,
// a faint per-listing geometric sigil, the category glyph, grain and a top sheen.
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
}: {
  slug: string;
  seed?: string;
  className?: string;
}) {
  const Icon = categoryIcon(slug);
  const h = hash(seed || slug);
  const tint = categoryTint(slug);
  const x = 18 + (h % 64);
  const y = 18 + ((h >> 3) % 54);
  const x2 = 12 + ((h >> 5) % 70);
  const rot = (h % 50) - 25;

  return (
    <div
      aria-hidden
      className={cn('relative isolate overflow-hidden bg-card', className)}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 80% at ${x}% ${y}%, rgba(${tint},0.34), transparent 60%), radial-gradient(55% 70% at ${100 - x}% ${100 - y}%, rgba(123,97,255,0.20), transparent 60%), radial-gradient(45% 60% at ${x2}% 112%, rgba(96,165,250,0.12), transparent 60%), linear-gradient(160deg,#0e1016,#14161c 70%)`,
        }}
      />
      <span style={{ color: `rgb(${tint})` }}>
        <Sigil style={{ transform: `translate(-50%,-50%) rotate(${rot}deg)` }} />
      </span>
      <span
        className="absolute -right-5 -bottom-5 opacity-[0.13]"
        style={{ transform: `rotate(${rot / 2}deg)`, color: `rgb(${tint})` }}
      >
        <Icon className="size-28" />
      </span>
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.05) 0.5px, transparent 0.5px)',
          backgroundSize: '4px 4px',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
    </div>
  );
}
