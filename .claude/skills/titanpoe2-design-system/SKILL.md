---
name: titanpoe2-design-system
description: The visual foundation for the Titanpoe2 PoE2 services marketplace — dark "arcane gaming" brand, color/typography/spacing/motion tokens, and the paste-ready globals.css. Use whenever styling or theming any UI: editing app/globals.css, choosing colors, fonts, radii, shadows, focus rings, or motion, restyling shadcn primitives, or making a screen feel on-brand instead of "default AI dashboard".
---

# Titanpoe2 Design System

Single source of truth for *how things look*. Full spec: [01-brand-mood.md](../../../docs/design/01-brand-mood.md) and [02-tokens.md](../../../docs/design/02-tokens.md). This skill is the operational playbook — read it before touching styles.

## The one-line brief
A **premium, high-trust marketplace for Path of Exile 2 services**. overgear.com's clarity & conversion + PoE2's dark fantasy. It must feel like a **specialist guild**, not a generic shop. Dark, but always legible.

## Non-negotiable principles
1. **Dark, but legible.** Deep near-black canvas, high-contrast text. Contrast ≥ WCAG AA, always.
2. **Trust is visual.** Escrow, guarantee, ratings, verification, price are first-class UI — never footnotes.
3. **One job per screen.** Exactly one unmistakable primary action; everything else is quiet/secondary.
4. **Value glows.** Money/price/currency use the warm gold "value" accent — the eye finds it instantly.
5. **Game-native, restrained.** Arcane mood via color, depth, a touch of grain — never fantasy kitsch.
6. **Calm motion.** Subtle, purposeful; always honor `prefers-reduced-motion`.
7. **Bilingual by construction.** Layouts breathe so longer RU strings wrap; no fixed-width labels.

## Tokens (paste-ready, dark default)
Drop into `app/globals.css` `:root, .dark` (project uses shadcn v4 CSS-variable convention; map via `@theme inline { --color-background: var(--background); … }`):

```css
:root, .dark {
  --background: #0B0C10;            /* app canvas, near-black, cool */
  --foreground: #ECEDF1;            /* primary text */
  --card: #14161C;                  /* cards, panels */
  --card-foreground: #ECEDF1;
  --popover: #1A1D25;               /* menus, dialogs */
  --popover-foreground: #ECEDF1;
  --primary: #7B61FF;               /* arcane violet — CTAs, links, active */
  --primary-foreground: #FFFFFF;
  --secondary: #1F232C;             /* secondary buttons / chips */
  --secondary-foreground: #ECEDF1;
  --muted: #1A1D25;
  --muted-foreground: #9CA0AC;      /* meta, secondary text */
  --accent: #F5B544;                /* ember GOLD — prices/value ONLY */
  --accent-foreground: #1A1206;
  --destructive: #F26D6D;           /* cancel, dispute, errors */
  --destructive-foreground: #2A0A0A;
  --border: #262A33;
  --input: #262A33;
  --ring: #7B61FF;                  /* violet focus glow */
  --radius: 0.625rem;
}
```
Extra semantic hues (add as needed): `success #34D399`, `warning #FBBF24`, `info #60A5FA`.

**Gold rule:** `--accent` (gold) is reserved for monetary value — prices, currency, payout amounts. Do NOT use it for generic accents/decoration; that dilutes the "value glows" cue. For interactive accent use `--primary` (violet).

## Typography
- **UI/body:** Geist Sans (already loaded). **Display/headings:** optional Space Grotesk / Sora, fall back to Geist; tighten tracking `-0.02em` on big titles.
- **Prices/numbers:** `font-variant-numeric: tabular-nums` so amounts align.
- Scale: display 40–56/1.05·700 · h1 30/1.15·700 · h2 22/1.2·600 · h3 18/1.3·600 · body 15–16/1.55·400 · small 13/1.45 · price 18–28·700 tabular in `accent`.

## Spacing · radii · elevation · motion
- **Spacing:** 4px base — 4·8·12·16·24·32·48·64. Content max-width 1120px (`max-w-5xl`–`6xl`); gutters 16 mobile / 24 desktop. Card padding 16–20; grid gap 16–24.
- **Radii:** sm 6 · **md 10 (default)** · lg 14 · pill 9999 (badges/chips).
- **Elevation (on dark prefer 1px border + subtle glow over heavy shadows):**
  - card: `border border-border` + `shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]`
  - hover: lift 2px + `0 8px 24px -12px rgba(0,0,0,0.6)`
  - primary CTA glow: `0 0 0 1px rgba(123,97,255,.4), 0 6px 20px -8px rgba(123,97,255,.5)`
- **Motion:** 120ms hover/press · 200ms enter · 280ms overlay; easing `cubic-bezier(.2,.8,.2,1)`. Cards lift 2px + border brightens on hover; status badge cross-fades on change. `prefers-reduced-motion: reduce` → drop transforms, keep opacity.

## Texture & depth (sparingly)
Near-invisible grain (2–4% opacity) on page background; radial violet→transparent glow behind page heroes. Never put large fantasy imagery behind text — protect contrast.

## Cross-cutting must-haves
- **A11y:** visible `ring` focus on every interactive element (not color alone); hit targets ≥ 40px; color never the only signal (pair hue with label + dot/icon).
- **Bilingual:** never hardcode copy — all strings from `messages/en.json` & `messages/ru.json`. Design for the longest RU string; allow wrap; avoid fixed-width labels/buttons.
- Keep `<html className="dark">` (or default tokens to dark as above).

## Anti-goals (reject on sight)
❌ Default light "AI SaaS dashboard" look · ❌ bright/flat/cartoonish or rainbow gradients · ❌ fantasy kitsch (dragons, parchment, scrolls everywhere) · ❌ cramped cards, tiny low-contrast text, hidden prices, dark patterns · ❌ gold used as a generic accent.

When building actual components, pair this with **titanpoe2-components**; for full-page layout use **titanpoe2-page-patterns**.
