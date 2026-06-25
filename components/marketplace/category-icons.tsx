import {
  Coins,
  Package,
  TrendingUp,
  Swords,
  Map,
  Trophy,
  Hammer,
  GraduationCap,
} from "lucide-react";

type IconType = React.ComponentType<{ className?: string }>;

/** Maps a category slug (see prisma/seed.ts) to a lucide icon. */
export const categoryIcons: Record<string, IconType> = {
  currency: Coins,
  items: Package,
  leveling: TrendingUp,
  carries: Swords,
  atlas: Map,
  challenges: Trophy,
  crafting: Hammer,
  coaching: GraduationCap,
};

export function categoryIcon(slug: string): IconType {
  return categoryIcons[slug] ?? Package;
}

/**
 * Renders the lucide icon for a category slug. Use this in JSX instead of
 * aliasing `categoryIcon()` to a local PascalCase const — selecting a component
 * from a static registry during render trips `react-hooks/static-components`.
 */
export function CategoryIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Icon = categoryIcons[slug] ?? Package;
  return <Icon className={className} />;
}

// rgb triplet per category (gold reserved for currency = value). Used for art
// tints and subtle category-colored accents on category pages.
const tints: Record<string, string> = {
  currency: "245,181,68",
  items: "167,139,250",
  leveling: "52,211,153",
  carries: "242,109,109",
  atlas: "96,165,250",
  challenges: "251,191,36",
  crafting: "139,124,255",
  coaching: "52,211,153",
};

export function categoryTint(slug: string): string {
  return tints[slug] ?? "123,97,255";
}
