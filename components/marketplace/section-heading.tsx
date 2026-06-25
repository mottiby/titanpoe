import { cn } from '@/lib/utils';

/** Editorial section header: kicker/eyebrow + oversized title + optional sub & action. */
export function SectionHeading({
  kicker,
  title,
  sub,
  center,
  action,
  className,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  center?: boolean;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-end justify-between gap-4',
        center && 'flex-col items-center text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', center && 'mx-auto')}>
        {kicker && (
          <div className="text-xs font-semibold tracking-[0.22em] text-primary/80 uppercase">
            {kicker}
          </div>
        )}
        <h2 className="mt-2 font-display text-section leading-[1.1] font-bold tracking-tight">
          {title}
        </h2>
        {sub && <p className="mt-2 text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
