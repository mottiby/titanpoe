# Deploy to Vercel (test over the internet)

Get a permanent public URL you can open on any device. The app is already
deploy-ready: `prisma generate` runs on install (`postinstall`), Auth.js
`trustHost` is on, and the Neon DB is migrated **and seeded** (demo listings show
up automatically — no extra setup).

## What you need
- A **Vercel** account (free): https://vercel.com — sign in with GitHub.
- The repo on GitHub (this branch pushed) — see "Push" below.
- Two secret values from your local **`.env`**: `DATABASE_URL` and `AUTH_SECRET`.

## Required environment variables (set in Vercel)
| Variable | Value | Needed for |
|---|---|---|
| `DATABASE_URL` | copy from local `.env` (Neon URL) | **required** — data |
| `AUTH_SECRET` | copy from local `.env` | **required** — login/sessions |

Optional (only if you want those flows live while testing):
| Variable | Value | Enables |
|---|---|---|
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | from `.env` | real Stripe seller payouts/checkout |
| `RESEND_API_KEY` | from `.env` | order emails |
| `CRON_SECRET` | from `.env` | the auto-release cron endpoint |

> Cart / orders / checkout work **without** Stripe — demo sellers use the manual
> escrow provider, so the buy flow is fully testable with just the two required vars.

## Steps (Git import — recommended)
1. Push the branch to GitHub (done for you if you asked, else `git push -u origin feat/design-overhaul`).
2. Vercel → **Add New… → Project → Import** the GitHub repo.
3. Framework preset auto-detects **Next.js**. Leave Build/Output defaults
   (build runs `prisma generate` then `next build`). Node **20+**.
4. **Environment Variables** → add `DATABASE_URL` and `AUTH_SECRET` (Production +
   Preview). Paste the values from your local `.env`.
5. **Deploy**. After ~1–2 min you get a URL like `https://titanpoe.vercel.app` —
   open it on your phone / another device.

To deploy this branch specifically: in **Project → Settings → Git** set the
Production Branch to `feat/design-overhaul`, or merge it to `main` first.

## Alternative (Vercel CLI)
```bash
npm i -g vercel
vercel login
vercel link
vercel env add DATABASE_URL production   # paste value
vercel env add AUTH_SECRET production     # paste value
vercel --prod
```

## After deploy — quick smoke test on the other device
- Home, Catalog (sidebar + banners + search), open a listing.
- Sign up → header shows balance chip + cart; add to cart → checkout → order in escrow.
- Switch EN/RU.

## Notes
- The deploy shares your Neon DB (test data) and uses Stripe **test** mode if you
  add Stripe keys — never put live keys here.
- Every push to the deployed branch auto-redeploys.
