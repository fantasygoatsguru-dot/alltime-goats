# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working agreements (must follow)

- **Never commit or push.** Do not run `git commit`, `git push`, or otherwise create commits. Stage or leave changes in the working tree and let the user commit them.
- **Database changes go through migration files only.** For any schema change, write a new SQL file in `supabase/migrations/` (follow the existing `YYYYMMDDHHMMSS_description.sql` naming). Do **not** apply it — no `supabase db push`, no `apply_migration` via MCP, no direct DDL against the remote DB. The user runs the push themselves.

## What this is

**Fantasy Goats Guru** (production domain `fantasygoats.guru`) — a fantasy-basketball analytics SPA plus an all-time NBA stats browser. Despite the repo folder name `alltime-goats` and the `package.json` name `vite_playground`, the product is Fantasy Goats Guru. React 19 + Vite 6 front end, Supabase (Postgres + Deno Edge Functions) back end, Yahoo Fantasy OAuth, and a Sanity-backed blog. Deployed on Netlify.

## Commands

```bash
npm run dev          # Vite dev server on :5173 (HTTPS auto-enabled if certs/cert.pem + certs/key.pem exist)
npm run build        # vite build THEN node scripts/prerender.js — this is what Netlify runs
npm run build:only   # vite build with no prerender
npm run prerender    # run the prerender step alone against an existing dist/
npm run lint         # eslint (flat config, eslint.config.js)
npm run preview      # preview the built dist/
```

There is **no test suite** and no test runner configured — do not assume one exists.

Supabase Edge Functions are deployed separately from the front end via `supabase/deploy.sh` (Yahoo functions) and `supabase/deploy-nba-stats.sh` (stats pipeline). Both require the Supabase CLI, login, and `supabase link --project-ref <ref>`. Note `deploy-nba-stats.sh` references functions (`retrieve-nba-stats`, `calculate-player-averages`, `update-nba-stats`) that live only on the remote project, not in this repo.

## Architecture — the non-obvious parts

### Routing is dual-registered (easy to get wrong)
`src/App.jsx` declares ~20 `<Route>`s that **all render the same `<AlltimeLayout />` component**. `AlltimeLayout` (`src/components/AlltimeLayout.jsx`) is a single large component that draws the header/nav/footer and then dispatches the page body itself through a `renderContent()` function that switches on `location.pathname`.

**To add a page you must touch three places:** (1) add a `<Route>` in `App.jsx`, (2) add a `path === '...'` branch in `AlltimeLayout.renderContent()`, and (3) add the nav entry to the relevant submenu array (`leagueSubmenu`, `rankingsSubmenu`, `scheduleSubmenu`, `alltimeSubmenu`) near the top of `AlltimeLayout`. Missing any one silently breaks navigation or rendering.

### Two data-access modules with different scopes
- `src/utils/supabase.js` — creates and exports the shared `supabase` client, and handles **current-season** data (`player_period_averages`, `player_game_logs`). Hardcodes `CURRENT_SEASON = "2025-26"` and anchors fantasy-week math to `2025-10-20`. Update these each season.
- `src/api.js` — **all-time historical** data (`alltime_player_info`, `alltime_player_season_averages`, `alltime_player_game_logs`), plus affiliate links/clicks and blog comments/likes. Uses a recurring **two-step query pattern**: filter demographics in `alltime_player_info` to get `player_id`s, then filter the stats table by those IDs (PostgREST can't join arbitrarily here).

The core domain concept throughout is **9-category z-score fantasy analysis** (points, 3pt, rebounds, assists, steals, blocks, FG%, FT%, turnovers). Team strength = summing per-player z-scores per category.

### Auth: two independent layers (account vs. Yahoo integration)
`src/contexts/AuthContext.jsx` owns both, and they are deliberately separate — do not conflate them:

- **Supabase Auth = the account ("who you are").** Google + email magic link. This is the identity that will own entitlements (future premium/guides) and works with zero Yahoo. Exposed as `authUser` / `isSignedIn` / `signInWithGoogle` / `signInWithEmail` / `signOutAccount`. The sign-in UI is `src/components/AuthModal.jsx`, opened from the header "Sign In" button. The Supabase client uses **`flowType: 'implicit'`** (`src/utils/supabase.js`) on purpose: Yahoo owns the `?code=` query param, so Supabase auth must return on the URL `#hash` to avoid a collision.
- **Yahoo = a per-tool data-source integration ("connect your league"), NOT a login.** Legacy identity keyed by the Yahoo `sub`. Exposed as `user` / `isAuthenticated` / `login` / `logout` / `ensureValidToken`. **⚠️ Naming trap: `isAuthenticated` means "Yahoo is connected", not "signed in".** Stored in `localStorage` (`yahoo_user_data`) with proactive token refresh ~5 min before expiry; all token ops go through the `yahoo-oauth` edge function; the `?code=` callback is handled globally in `AlltimeLayout` (and `Matchup.jsx`). `src/contexts/LeagueContext.jsx` fans league/team/matchup state down the tree, fetched via `yahoo-fantasy-api`.

**Linking the two:** `yahoo_tokens` and `user_profiles` have an `auth_user_id` column. A DB trigger (`link_legacy_identities_by_email`, migration `20260721120000`) auto-links legacy Yahoo rows to a Supabase account by matching email on first sign-in; the `yahoo-oauth` callback also stamps `auth_user_id` from the caller's JWT when connecting while signed in.

**Yahoo is never a header login.** It surfaces contextually per tool via the shared `src/components/YahooConnect.jsx` (hook: `src/hooks/useYahooConnect.js`), which is the single source of truth for every connect prompt with three variants: `button` (inline in an open tool's controls row), `nudge` (standalone bar), `gate` (empty-state for tools that require Yahoo). Tools split into: **public** (no Yahoo), **enhanced** (usable without; inline `button` — Rankings, Top Games, Matchup, My Team), and **required** (`gate` — Matchup Projection, Head-to-Head, Category Breakdown, Team Playoff/Season Strength). Yahoo-required nav items stay **navigable** (they show the gate); only `requiresPremium` disables a nav item.

### Edge Functions (Deno) — `supabase/functions/`
Called from the front end with `supabase.functions.invoke('<name>', { body: { action, ... } })`. They use an **action-dispatch** convention (`body.action` selects behavior) and read secrets from `Deno.env` (`OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `YAHOO_*`, etc.):
- `yahoo-oauth` — authorize / callback / refresh
- `yahoo-fantasy-api` — getUserLeagues / getAllTeamsInLeague / getLeagueSettings / getCurrentMatchup / …
- `fantasy-chat` — OpenAI-backed assistant with RAG over the `knowledge` table (pgvector)
- `weekly-matchup-projection`, `final-day-matchup-projection`, `yesterday-top-performers`, `promotion-email` — scheduled email jobs; each carries its own `deno.json`, `email-template.html`, and (where scheduled) `schedule.json`

### SEO + prerendering pipeline
`src/config/` is the single source of truth: `seo-routes.js` (titles/descriptions/priority per route, `requiresAuth` marks routes excluded from sitemap/prerender), `seo-content.js` (crawlable body copy), `structured-data.js` (JSON-LD + FAQ). After `vite build`, `scripts/prerender.js` reads `dist/index.html` as a template and writes a per-route `dist/<path>/index.html` with baked title/meta/canonical/OG/Twitter tags, an offscreen crawlable SEO block, a `<noscript>` fallback, and JSON-LD. The runtime React components `SEOHead`, `SEOContent`, and `StructuredData` mirror the same config on client navigation using matching element ids, so they replace rather than duplicate the prerendered tags. **Adding a public route means updating `seo-routes.js` (and usually the other two config files) or it won't be prerendered or in the sitemap.**

### Blog
Sanity CMS (`src/sanity/client.js`, projectId `vstfgax7`, dataset `production`) supplies posts for `/posts` and `/post/:slug`; comments and likes are stored in Supabase (`post_comments`, `post_likes`) via `src/api.js`.

## Environment & external services

- Front-end env vars are Vite `VITE_`-prefixed (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in `.env`. The Supabase project for this app is ref **`fqrnmcnvrrujiutstkgb`** — this ref is hardcoded in many storage URLs (menu icons, avatars, favicon in `index.html`). If you use the Supabase MCP, make sure it is authenticated to the account that owns that project (a separate `performingartsatlas` project exists under a different account and is easy to hit by mistake).
- `.env` and `client_secret.json` hold live secrets (Supabase service-role key, OpenAI, Gemini, Yahoo, Resend, AWS SES); both are gitignored. The service-role key in `.env` is for local/edge use — never expose it to front-end bundles (front end must use only the anon key).

## Deployment

- **Front end:** Netlify — `netlify.toml` runs `npm run build` and publishes `dist/`.
- **Edge Functions / migrations:** Supabase CLI via the `supabase/deploy*.sh` scripts. Migrations live in `supabase/migrations/`.
- `npm run relocate` exists to move `dist/` into a Spring Boot `../src/main/resources/static` directory — only relevant if embedding the build in a separate Java host; ignore otherwise.
