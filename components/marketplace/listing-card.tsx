import { Clock, Gamepad2, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { leagueModeLabel, formatPrice } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "./price-tag";
import { SellerBadge } from "./seller-badge";
import { ListingArt } from "./listing-art";
import { categoryIcon } from "./category-icons";

export type ListingCardData = {
  id: string;
  titleEn: string;
  titleRu: string;
  priceCents: number;
  compareAtCents?: number | null;
  etaHours: number;
  league: string;
  leagueMode: string;
  platform: string;
  badge?: string | null;
  highlightsEn?: string[];
  highlightsRu?: string[];
  category: { slug: string; nameEn: string; nameRu: string };
  seller?: {
    displayName: string;
    ratingAvg: number;
    ratingCount: number;
    kycStatus: string;
  } | null;
  tiers?: { priceCents: number }[];
};

type Labels = { eta: string; hours: string; from?: string };

const badgeVariant: Record<
  string,
  "warning" | "destructive" | "info" | "primary"
> = {
  HOT: "warning",
  SALE: "destructive",
  NEW: "info",
  BEST_VALUE: "primary",
};

export function ListingCard({
  listing,
  locale,
  labels,
  badgeLabels,
  compact = false,
}: {
  listing: ListingCardData;
  locale: string;
  labels: Labels;
  badgeLabels?: Record<string, string>;
  compact?: boolean;
}) {
  const Icon = categoryIcon(listing.category.slug);
  const title = locale === "ru" ? listing.titleRu : listing.titleEn;
  const cat = locale === "ru" ? listing.category.nameRu : listing.category.nameEn;
  const highlights =
    (locale === "ru" ? listing.highlightsRu : listing.highlightsEn) ?? [];

  const tierPrices = listing.tiers?.map((t) => t.priceCents) ?? [];
  const fromCents = tierPrices.length ? Math.min(...tierPrices) : listing.priceCents;
  const tiered = tierPrices.length > 1;
  const onSale =
    listing.compareAtCents != null && listing.compareAtCents > fromCents;

  if (compact) {
    return (
      <Link
        href={`/catalog/${listing.id}`}
        className="card-sheen flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-[color-mix(in_oklab,var(--border),white_22%)] focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Icon className="size-4 shrink-0 text-primary" />
          <span className="truncate font-medium">{title}</span>
          <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
            {cat}
          </span>
        </span>
        <PriceTag cents={listing.priceCents} locale={locale} size="sm" />
      </Link>
    );
  }

  return (
    <Card
      interactive
      className="group flex h-full flex-col overflow-hidden focus-within:-translate-y-0.5 focus-within:border-primary/40"
    >
      <Link
        href={`/catalog/${listing.id}`}
        className="flex h-full flex-col focus-visible:outline-none"
      >
        <div className="relative overflow-hidden border-b border-border">
          <ListingArt
            slug={listing.category.slug}
            seed={listing.id}
            className="aspect-[16/9] transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-[1.05]"
          />
          {listing.badge && (
            <span className="absolute top-2 left-2">
              <Badge variant={badgeVariant[listing.badge] ?? "neutral"}>
                {badgeLabels?.[listing.badge] ?? listing.badge}
              </Badge>
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon className="size-4 text-primary" />
            <span>{cat}</span>
          </div>

          <h3 className="mt-1.5 line-clamp-2 font-medium leading-snug">{title}</h3>

          {highlights.length > 0 && (
            <ul className="mt-2 space-y-1">
              {highlights.slice(0, 2).map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground"
                >
                  <Check className="mt-0.5 size-3 shrink-0 text-success" />
                  <span className="line-clamp-1">{h}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant="outline">{listing.league}</Badge>
            <Badge variant="outline">{leagueModeLabel(listing.leagueMode)}</Badge>
            <Badge variant="outline" className="gap-1">
              <Gamepad2 className="size-3" />
              {listing.platform}
            </Badge>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/60 pt-3">
            {listing.seller ? (
              <SellerBadge
                name={listing.seller.displayName}
                ratingAvg={listing.seller.ratingAvg}
                ratingCount={listing.seller.ratingCount}
                verified={listing.seller.kycStatus === "VERIFIED"}
              />
            ) : (
              <span />
            )}
            <div className="text-right">
              {onSale && (
                <div className="text-xs text-muted-foreground line-through">
                  {formatPrice(listing.compareAtCents!, locale)}
                </div>
              )}
              <PriceTag
                cents={fromCents}
                locale={locale}
                size="md"
                prefix={tiered ? labels.from : undefined}
              />
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {labels.eta} {listing.etaHours}
            {labels.hours}
          </div>
        </div>
      </Link>
    </Card>
  );
}
