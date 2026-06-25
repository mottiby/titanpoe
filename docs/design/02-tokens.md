# 02 · Design Tokens

Dark-first system. Values are tuned for the arcane/PoE2 mood and AA contrast. Drop the block below into
`app/globals.css` (it follows the shadcn v4 variable convention the project already uses).

## Color — semantic roles
| Role | Hex | Use |
|---|---|---|
| `background` | `#0B0C10` | app canvas (near-black, slightly cool) |
| `foreground` | `#ECEDF1` | primary text |
| `card` | `#14161C` | cards, panels |
| `card-foreground` | `#ECEDF1` | text on cards |
| `popover` | `#1A1D25` | menus, dialogs, dropdowns |
| `muted` | `#1A1D25` | quiet surfaces |
| `muted-foreground` | `#9CA0AC` | secondary text, meta |
| `border` | `#262A33` | hairlines, dividers, inputs |
| `input` | `#262A33` | input borders |
| `ring` | `#7B61FF` | focus ring (violet glow) |
| **`primary`** | `#7B61FF` | primary CTAs, links, active states (arcane violet) |
| `primary-foreground` | `#FFFFFF` | text on primary |
| **`accent` / value** | `#F5B544` | **prices, currency, value highlights** (ember gold) |
| `accent-foreground` | `#1A1206` | text on gold |
| `secondary` | `#1F232C` | secondary buttons / chips |
| `secondary-foreground` | `#ECEDF1` | text on secondary |
| `success` | `#34D399` | completed/paid, positive |
| `warning` | `#FBBF24` | in-progress, attention |
| `destructive` | `#F26D6D` | cancel, dispute, errors |
| `destructive-foreground` | `#2A0A0A` | text on destructive |

Status hues (orders): CREATED → muted; PAID → primary; IN_PROGRESS → warning; DELIVERED → info `#60A5FA`;
COMPLETED → success; DISPUTED → destructive; REFUNDED → muted; CANCELLED → muted.

## globals.css (paste-ready, dark default)
```css
:root, .dark {
  --background: #0B0C10;
  --foreground: #ECEDF1;
  --card: #14161C;
  --card-foreground: #ECEDF1;
  --popover: #1A1D25;
  --popover-foreground: #ECEDF1;
  --primary: #7B61FF;
  --primary-foreground: #FFFFFF;
  --secondary: #1F232C;
  --secondary-foreground: #ECEDF1;
  --muted: #1A1D25;
  --muted-foreground: #9CA0AC;
  --accent: #F5B544;
  --accent-foreground: #1A1206;
  --destructive: #F26D6D;
  --destructive-foreground: #2A0A0A;
  --border: #262A33;
  --input: #262A33;
  --ring: #7B61FF;
  --radius: 0.625rem;
}
```
> Map to Tailwind as the project already does (`@theme inline { --color-background: var(--background); … }`).
> Keep the page in dark mode by setting `<html className="dark">` (or default the tokens as above).

## Typography
- **UI / body:** `Geist Sans` (already loaded) or Inter — clean, legible at small sizes.
- **Display / headings (optional, adds character):** a geometric/grotesk like **Space Grotesk** or **Sora**;
  fall back to Geist. Use tighter tracking (`-0.02em`) and heavier weight for big titles.
- **Numeric / prices:** tabular figures (`font-variant-numeric: tabular-nums`) so prices align.

| Token | Size / line | Weight | Use |
|---|---|---|---|
| display | 40–56px / 1.05 | 700 | landing hero |
| h1 | 30px / 1.15 | 700 | page titles |
| h2 | 22px / 1.2 | 600 | section titles |
| h3 | 18px / 1.3 | 600 | card titles |
| body | 15–16px / 1.55 | 400 | text |
| small | 13px / 1.45 | 400–500 | meta, labels |
| price | 18–28px | 700, tabular | the € amount, in `accent` |

## Spacing & layout
- 4px base scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64.
- Content max-width: 1120px (`max-w-5xl`–`6xl`); page gutters: 16px mobile / 24px desktop.
- Card padding: 16–20px. Grid gap: 16–24px.

## Radii
- sm 6px · **md 10px (default, `--radius`)** · lg 14px · pill 9999px (badges/chips).

## Elevation (shadows + borders on dark)
On dark, prefer **1px borders + subtle inner/colored glow** over heavy drop shadows.
- card: `border border-border` + `shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]`
- raised/hover: lift 2px + soft shadow `0 8px 24px -12px rgba(0,0,0,0.6)`
- primary CTA: faint violet glow `0 0 0 1px rgba(123,97,255,.4), 0 6px 20px -8px rgba(123,97,255,.5)`

## Texture & depth (use sparingly)
- A near-invisible noise/grain overlay (2–4% opacity) on the page background for "crafted" feel.
- Section hero: a radial/linear violet→transparent gradient glow behind the headline.
- Avoid large fantasy imagery behind text; keep contrast.

## Motion
- Durations: 120ms (hover/press), 200ms (enter), 280ms (overlay). Easing: `cubic-bezier(.2,.8,.2,1)`.
- Hover: cards lift 2px + border brightens; buttons brighten + faint glow.
- Status change: brief color cross-fade on the status badge.
- Respect `prefers-reduced-motion: reduce` → disable transforms, keep opacity only.

## Iconography
- Line icons (lucide, ships with shadcn): shield/lock (escrow), badge-check (verified), star (rating),
  clock (ETA), gamepad/monitor (platform), swords (carries), coins (currency), message (chat).
- 1.5px stroke; size 16–20px inline.
