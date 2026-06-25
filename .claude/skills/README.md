# Titanpoe2 — Claude Design skills base

Project skills that auto-activate while building the marketplace UI. Each lives in its own folder as
`SKILL.md` (YAML frontmatter `name` + `description`, then the playbook). Claude Code discovers them
automatically and loads one when a task matches its `description`.

These distill the design brief in [`docs/design/`](../../docs/design/) (brand, tokens, components, pages)
into **operational, auto-triggered guidance** — the docs stay the full spec; the skills are the "when/how".

## The set

| Skill | Triggers on | Covers |
|---|---|---|
| **titanpoe2-design-system** | styling, theming, `globals.css`, colors/fonts/motion, restyling shadcn | brand essence, dark "arcane" tokens (paste-ready), type/spacing/radii/elevation/motion, a11y + bilingual rules, anti-goals |
| **titanpoe2-components** | building/editing any React component | restyle shadcn primitives + build domain components (ListingCard, PriceTag, OrderStatusBadge, EscrowStepper, TrustStrip, ChatThread, Navbar…), required states |
| **titanpoe2-page-patterns** | building/restructuring a route under `app/[locale]/` | per-route goal, section order, primary CTA, loading/empty/error/responsive states |
| **marketplace-conversion-ux** | landing, catalog, checkout, pricing, CTAs, social proof | overgear-style trust & conversion patterns; anti-patterns (no dark patterns) |
| **poe2-domain-glossary** | writing copy, sample data, category/filter labels, i18n keys | PoE2 vocabulary EN/RU, service taxonomy, leagues/modes/platforms/currency/endgame terms |

## How this maps to the "design skill" landscape
The general capabilities others install as separate skills are **already built into this Claude Code**:
- *Frontend design / production UI* → the built-in **frontend-ui-engineering** skill.
- *ShadCN/UI & component conventions* → encoded in **titanpoe2-components** (project uses shadcn v4, preset `base-nova`).
- *Methodical workflow (plan → test → build), à la "Superpowers"* → built-in **planning-and-task-breakdown**,
  **incremental-implementation**, **test-driven-development**, **spec-driven-development**.
- *Creating/編 editing skills (skill-creator)* → built-in **anthropic-skills:skill-creator**.

So this folder adds only the **project-specific** layer those generic skills can't know: the Titanpoe2
brand, tokens, component contracts, page recipes, marketplace UX, and PoE2 domain language.

## Third-party skill: `ui-ux-pro-max`
[`ui-ux-pro-max/`](ui-ux-pro-max/) is the open-source **UI/UX Pro Max** design-intelligence skill
([github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), MIT),
vendored here (SKILL.md + `data/` CSVs + `scripts/`). It's a BM25 search over a database of 161 color
palettes, 57 font pairings, 50+ styles, 99 UX guidelines and 25 chart types. Query it from `.claude/`:
```
python skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <color|typography|style|ux|chart|...> [-n N]
```
**Requires Python 3** on PATH (stdlib only — no pip installs). Use it for *generic* design lookups and
accessibility checks (contrast, focus, ARIA).

> **Precedence for THIS project:** the **titanpoe2-*** skills + [`docs/design/`](../../docs/design/) are
> authoritative. Treat ui-ux-pro-max as an *advisor* — use its palettes/fonts/UX rules as inspiration and
> sanity checks, but do **not** swap the established dark-arcane tokens, violet-primary / gold-value system,
> or routes/contracts to match a generic suggestion. Brand consistency wins.

Animation: **framer-motion** (`framer-motion`) is installed for tasteful motion. Honor the brand's
"calm motion" principle — subtle, purposeful, and always gated by `prefers-reduced-motion`.

## Conventions
- Keep `SKILL.md` focused and high-signal; link to `docs/design/*` for the full spec rather than duplicating it.
- One skill = one concern. If a skill's `description` stops matching when it should fire, tighten the triggers.
- Never let a skill contradict `docs/design/` — update both together.
