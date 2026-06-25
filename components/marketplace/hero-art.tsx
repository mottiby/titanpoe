import { cn } from '@/lib/utils';

// Owned cinematic backdrop for the home hero — animated violet/blue/gold arcane
// glow blobs + grain. CSS-only; the drift animation is disabled under
// prefers-reduced-motion (globals.css).
export function HeroArt({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
        className,
      )}
    >
      {/* centered top blob (wrapper centers, inner drifts) */}
      <div className="absolute top-[-14%] left-1/2 -translate-x-1/2">
        <div
          className="float-a h-[520px] w-[920px] max-w-[130vw] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(123,97,255,0.28), transparent 70%)',
          }}
        />
      </div>
      <div
        className="float-b absolute top-[14%] right-[2%] h-[340px] w-[340px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(96,165,250,0.14), transparent 70%)',
        }}
      />
      <div
        className="float-a absolute top-[42%] left-[4%] h-[260px] w-[260px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(245,181,68,0.07), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.6) 0.5px, transparent 0.5px)',
          backgroundSize: '5px 5px',
        }}
      />
    </div>
  );
}
