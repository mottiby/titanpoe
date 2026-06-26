import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { TrustStrip } from "@/components/marketplace/trust-strip";

export async function Footer() {
  const t = await getTranslations("Footer");
  const tr = await getTranslations("Trust");
  const tg = await getTranslations("Guarantees");
  const tn = await getTranslations("Nav");

  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <TrustStrip
          labels={{
            escrow: tr("escrow"),
            moneyBack: tr("moneyBack"),
            verified: tr("verified"),
            chat: tr("chat"),
          }}
        />

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-6">
          <span className="text-xs text-muted-foreground">{t("payments")}:</span>
          {["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay", "Stripe"].map(
            (p) => (
              <span
                key={p}
                className="rounded-md border border-border bg-card px-2 py-1 text-[0.7rem] font-medium text-muted-foreground"
              >
                {p}
              </span>
            ),
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-6 text-sm">
          <Link
            href="/guarantees"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {tg("link")}
          </Link>
          <Link
            href="/catalog"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {tn("catalog")}
          </Link>
          <Link
            href="/sell"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {tn("sell")}
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-base font-semibold tracking-tight text-foreground">
            Titan<span className="text-primary">poe2</span>
          </span>
          <span>{t("tagline")}</span>
          <span className="tabular-nums">{t("rights")}</span>
        </div>
      </div>
    </footer>
  );
}
