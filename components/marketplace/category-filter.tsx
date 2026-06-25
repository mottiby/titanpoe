import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { categoryIcon } from "./category-icons";

type Category = { id: string; slug: string; nameEn: string; nameRu: string };

const pill = (active: boolean) =>
  cn(
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
    active
      ? "border-primary/40 bg-primary/12 text-primary"
      : "border-border text-muted-foreground hover:border-[color-mix(in_oklab,var(--border),white_22%)] hover:text-foreground"
  );

/** Horizontal, scrollable category pills. Active = primary tint. */
export function CategoryFilter({
  categories,
  active,
  locale,
  allLabel,
  className,
}: {
  categories: Category[];
  active?: string;
  locale: string;
  allLabel: string;
  className?: string;
}) {
  return (
    <div className={cn("-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0", className)}>
      <div className="flex gap-2 pb-1">
        <Link href="/catalog" className={pill(!active)}>
          {allLabel}
        </Link>
        {categories.map((c) => {
          const Icon = categoryIcon(c.slug);
          return (
            <Link
              key={c.id}
              href={`/catalog?category=${c.slug}`}
              className={pill(active === c.slug)}
            >
              <Icon className="size-3.5" />
              {locale === "ru" ? c.nameRu : c.nameEn}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
