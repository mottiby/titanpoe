import { ShieldCheck, RotateCcw, BadgeCheck, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type TrustLabels = {
  escrow: string;
  moneyBack: string;
  verified: string;
  chat: string;
};

/** Row of reassurance items. Copy comes from i18n (Trust.*). */
export function TrustStrip({
  labels,
  className,
}: {
  labels: TrustLabels;
  className?: string;
}) {
  const items = [
    { icon: ShieldCheck, label: labels.escrow },
    { icon: RotateCcw, label: labels.moneyBack },
    { icon: BadgeCheck, label: labels.verified },
    { icon: MessageCircle, label: labels.chat },
  ];
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground",
        className
      )}
    >
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="inline-flex items-center gap-1.5">
          <Icon className="size-4 text-primary" />
          {label}
        </li>
      ))}
    </ul>
  );
}
