---
name: writing-fantasy-guides
description: Use when creating, editing, re-ranking or reviewing Fantasy Goats Guru draft content — the Top 150 board, punt guides, sleepers/busts, injury watchlist, round targets or any guide prose that cites ranks, rounds, games played or injuries (src/config/top-150-*.js, punt-guides-*.js, guides-content.js, sleepers-busts-*.js).
---

# Writing fantasy guides

## Overview

Every number a reader sees must survive the question "what happens to this player's *games* this season?" Last season's per-game line is evidence, never a projection. And every sentence that describes the site's own tables must describe what the code actually does.

Published misses this skill exists to prevent:
- Jimmy Butler (out until early 2027) ranked **12th** on the punt-blocks live board, under copy saying "recommendations account for role and availability".
- Donte DiVincenzo (Achilles, mid-to-late-season return at best) ranked **56th** on the same board.
- A reader's verdict: "pure extrapolation of last season average stats and near zero accountability of verified lost games."

## Availability contract (every player, every surface)

A player with a **known absence** (surgery, a tear, "no return timetable", an announced re-evaluation, a missed season) must be in exactly one of these states:

| State | When | Requirement |
|---|---|---|
| Ranked, discounted | Has a timetable, or is good enough that a partial season still beats the healthy players at that price | In `PLAYERS` at the rank the missed games justify, with `availability` + `status`. The note names the absence, the date of the update, and why that rank prices it (e.g. Butler at 118: early-2027 target, about half a season of a strong line). |
| Unranked | Returns late in the season, or the outlook is very uncertain and the player is not good enough to stash | In `UNRANKED_INJURIES` (never rendered) with a dated source, `availability` and `status`, so the live punt tables still discount them. |

There is no separate injury section on the Top 150. A ranked injured player's card shows an `INJURY · status` badge.

`availability` (0–1) is the share of a healthy season's value we expect, including the cost of holding the roster spot while the player is out. The live punt tables multiply positive Value by it and tag the row `INJ ×factor`. On a punt table, injured players stay ranked, just lower: never drop them from a table, and never leave them undiscounted. Calibrate against the board. For example, Porziņģis (no timetable, 0.35) lands past #100 on punt assists, Butler (early 2027, 0.3) around #80 on punt blocks, and DiVincenzo (late-season at best, 0.1) near the bottom. When an update arrives, change the factor, the status and the note together, and move the player between ranked and unranked if the timeline changed.

A small 2025-26 sample (under ~50 GP) gets the same treatment: the note says how many games it was, and the rank does not just copy the per-game value forward.

Bare-name lists (`others`) can carry no caveat, so they may only contain healthy Top 150 players.

## Copy must match code

Before writing or keeping any sentence that describes a board, a table, the radar or the draft builder, open the component (`RankingTable.jsx`, `DraftBuilder.jsx`, `ProjectionList.jsx`) and confirm it does that. If you change a component's behaviour, grep the configs for sentences that describe it and update them in the same change.

## Re-rank checklist

After any rank move, update every place that hardcodes a rank or round:
1. "No. N" and "pick N" inside notes (`grep -n "No\. [0-9]" src/config/top-150-*.js`).
2. Round words ("third round", "round five") in the player's own note.
3. `boardRank` and `tag` in `sleepers-busts-*.js`. These are hardcoded, so diff them against `PLAYERS`.
4. Round prose in the punt guides and `guides-content.js` that names the player. Prefer `{{rank}}` / `{{rank:Name}}` tokens over literal numbers.
5. A moved player's note explains the new price (why this round, compared with ADP or pre-rank) in the board's existing voice.

## Round targets: `others`

Each `roundTargets[i]` may have `others: [names]`, a few extra names for the same buying range with no write-up. They are generated, then curated by hand:
- Pool: Top 150 players whose board rank falls within that round ±6 picks, excluding the guide's written targets and names already used in `others`.
- Order by 2025-26 z-value with the punted category removed, minus any positive z in it.
- Drop **anti-fits**: a punted-category z above +1.5 (the build discards their value). Players with no stat row skip this check, so judge them by hand.
- Drop anyone with a current injury note, even a minor one.
- 2–4 names per round.

`syncPuntGuide` throws if an `other` is off the Top 150, injury-discounted, an unranked injury, a written target, or duplicated.

## Pre-publish audit (run, don't eyeball)

1. Load each punt guide's live board as the code computes it (2025-26 rows, `minGames`, punt removed, `availability` applied). For the top 60, flag GP under 50 and any name with an injury mention in the Top 150 notes. Each flag needs a stated reason it stays.
2. Compare the Top 150 with an external consensus (e.g. the FantasyPros overall ranks). Every gap of 10+ in the top 60 needs a sentence in that player's note that justifies it.
3. Import every config module (`node -e "import('./src/config/guides-content.js')"`) so the `syncPuntGuide` checks run, then `npm run lint` and the full `npm run build`, never `build:only`. `scripts/prerender.js` imports the same config exports, so renaming or removing one breaks the Netlify build only at the prerender step.

## Red flags

- "Their per-game line was elite" with no games-played clause.
- A rank or round that changed while the note still argues for the old one.
- Copy promising behaviour ("accounts for availability", "projected") that no code implements.
- An injured player appearing anywhere without a caveat or discount next to the name.
- An injured player removed from a board instead of discounted.
