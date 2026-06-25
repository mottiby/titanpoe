import { buttonVariants } from '@/components/ui/button';
import { PriceTag } from './price-tag';

/** Mobile-only sticky bar that scrolls to the purchase panel (#buy). */
export function StickyBuyBar({
  cents,
  locale,
  label,
  fromLabel,
}: {
  cents: number;
  locale: string;
  label: string;
  fromLabel?: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
      <a href="#buy" className="flex items-center justify-between gap-3">
        <PriceTag cents={cents} locale={locale} size="md" prefix={fromLabel} />
        <span className={buttonVariants({})}>{label}</span>
      </a>
    </div>
  );
}
