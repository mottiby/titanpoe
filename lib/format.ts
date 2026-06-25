/** Display helpers. Marketplace money is stored in cents and shown in EUR (€). */

export function formatPrice(cents: number, locale: string = "en"): string {
  const amount = new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
  return `€${amount}`;
}

/** Short, community-standard league-mode labels (kept language-neutral). */
export function leagueModeLabel(mode: string): string {
  switch (mode) {
    case "SOFTCORE":
      return "Softcore";
    case "HARDCORE":
      return "Hardcore";
    case "SSF_SOFTCORE":
      return "SSF Softcore";
    case "SSF_HARDCORE":
      return "SSF Hardcore";
    default:
      return mode;
  }
}
