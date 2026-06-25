---
name: poe2-domain-glossary
description: Path of Exile 2 domain vocabulary (EN/RU) and the marketplace's service taxonomy — categories, fulfillment types, leagues/modes, platforms, currencies, endgame and boss terms — so UI copy, sample/preview data, category labels and i18n strings are game-native and correct. Use when writing user-facing copy, seed/sample listings, category or filter labels, i18n keys, or any text a PoE2 player would read.
---

# PoE2 Domain Glossary

Speak the game's language correctly (EN + RU). Getting this right is what makes the site feel like a *specialist guild*, not a generic shop. Source of truth for live data: `prisma/seed.ts` and the league reference — **don't hardcode a current league name**, it rotates.

## Service categories (stable slugs ↔ labels — match `prisma/seed.ts`)
| slug | EN | RU | what it sells |
|---|---|---|---|
| `currency` | Currency | Валюта | Exalted / Divine / Chaos Orbs etc. |
| `items` | Items & Gear | Предметы и гир | uniques, rares, crafted gear |
| `leveling` | Power Leveling | Прокачка | character to target level / acts |
| `carries` | Boss Carries | Карри боссов | kill a boss for/with the buyer |
| `atlas` | Atlas & Maps | Атлас и карты | endgame Atlas progression, Waystones |
| `challenges` | Challenge Completion | Челленджи | league challenge / reward grinds |
| `crafting` | Crafting | Крафт | craft a specific item to spec |
| `coaching` | Coaching | Коучинг | 1:1 teaching sessions |

## Fulfillment (Prisma `Fulfillment`) — how delivery happens
- `PARTY_PLAY` — booster joins the buyer's party / map (EN "Party play", RU "Игра в пати").
- `TRADE` — in-game trade hand-off, e.g. currency/items (EN "In-game trade", RU "Игровой трейд").
- `SESSION` — live coaching session (EN "Live session", RU "Живая сессия").
- `PILOTING` — account sharing / piloting — **post-MVP, higher-risk**; don't promote it as default.

## Leagues & modes
- `LeagueMode`: `SOFTCORE` (Софткор), `HARDCORE` (Хардкор / death = move to standard), `SSF_SOFTCORE` & `SSF_HARDCORE` — **SSF = Solo Self-Found** (Соло без торговли). Show mode as a meta chip; it changes what services are even possible (no trade in SSF).
- **League** is a free string referencing the current temporary/permanent league. PoE2 has **Standard** + rotating challenge leagues (early-access era). Treat the active league as data — read it, don't bake it into copy/components.

## Platforms (`Platform`)
`PC`, `PS5`, `XBOX`. Cross-play/cross-progression matters to buyers — surface platform as a clear chip; a PC seller can't always fulfil a console order.

## Currency & economy (for `currency`/`items` copy & samples)
- Main orbs: **Exalted Orb** (Эксальт), **Divine Orb** (Дивайн/Божественная), **Chaos Orb** (Хаос). In PoE2 the economy leans on **Exalted** (upgrade currency) and **Divine** (high-value); use these in realistic samples.
- Display marketplace **prices in EUR (€)** (the platform's money) — never conflate € price with in-game orb amounts. Orb quantities are part of the listing's *what you get*, the € is the *cost*.

## Endgame / boss vocabulary (for `carries`/`atlas`/`challenges`)
- **Atlas** — endgame map system; **Waystones** are the map items that open endgame areas.
- **Pinnacle / endgame bosses** — the high-end kills players pay to be carried through.
- **Ascendancy** — subclass, unlocked via **Trials** (Trial of the Sekhemas, Trial of Chaos) — common carry/coaching topics.
- **Acts & Cruel** — campaign Acts then "Cruel" difficulty — relevant to `leveling` listings.

## Copy & tone (see brand brief)
- **Player-to-player, confident, concise, expert.** Use correct terms in both languages; never machine-translate game jargon literally (e.g. keep "Divine Orb", localize the sentence around it).
- Reassure at risk moments (payment, sharing details, disputes): "Escrow-protected. Pay only when you confirm." / «Защита escrow. Платите только после подтверждения.»
- All copy lives in `messages/en.json` & `messages/ru.json` — write keys, not literals, and keep EN/RU in parity.

## Realistic sample data (for previews/seeds)
Use believable listings, e.g.: "Arbiter of Ash carry — SC PC", "1000× Exalted Orb — trade", "Power leveling 1→90 (Cruel done)", "Trial of the Sekhemas — Ascendancy carry", "Mapping coach — Atlas strategy session". Avoid placeholder "Lorem ipsum" or PoE1-only terms.
