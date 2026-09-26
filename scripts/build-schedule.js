#!/usr/bin/env node
/**
 * Builds the three static schedule files the grid pages read:
 *
 *   public/data/schedule.json   { "YYYY-MM-DD": ["ATL", "BOS", …] }  (teams playing that day)
 *   public/data/weeks.json      { weeks: { "1": { start, end, label } … } }  Mon–Sun fantasy weeks
 *   public/data/playoffs.json   the same shape, limited to the fantasy playoff weeks
 *
 * Source is ESPN's public team-schedule endpoint, one request per team, because
 * NBA.com's CDN blocks non-browser clients. Each team contributes its own game
 * dates, so no opponent parsing (and no double counting) is needed.
 *
 * Dates are the US Eastern calendar date of tip-off, which is what the pages
 * compare against — a 10pm PT tip is "yesterday" in UTC and must not roll back.
 *
 * Usage:
 *   node scripts/build-schedule.js                # 2026-27 season
 *   node scripts/build-schedule.js --season 2028  # ESPN season year = end year
 *   node scripts/build-schedule.js --from-existing # reindex local schedule.json
 *   node scripts/build-schedule.js --dry-run      # print the summary, write nothing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public/data');

// ESPN season year is the year the season ENDS: 2027 === the 2026-27 season.
const args = process.argv.slice(2);
const seasonArg = args.indexOf('--season');
const SEASON_YEAR = seasonArg !== -1 ? Number(args[seasonArg + 1]) : 2027;
const DRY_RUN = args.includes('--dry-run');
const FROM_EXISTING = args.includes('--from-existing');

// Yahoo's official game-week calendar, not gaps in the NBA game schedule,
// determines the fantasy week numbers. Both the NBA Cup and All-Star period
// are two-week matchups in 2026-27. Update this from Yahoo's /nba/gamedates
// before building a different season rather than guessing from empty dates.
const YAHOO_TWO_WEEK_STARTS = {
  2027: ['2026-11-30', '2027-02-15'],
};

// ESPN team id → the tricode used everywhere else in this app. ESPN spells six
// of them differently (NY, GS, SA, NO, UTAH, WSH), so this is not a passthrough.
const TEAMS = {
  1: 'ATL', 2: 'BOS', 17: 'BKN', 30: 'CHA', 4: 'CHI', 5: 'CLE', 6: 'DAL', 7: 'DEN',
  8: 'DET', 9: 'GSW', 10: 'HOU', 11: 'IND', 12: 'LAC', 13: 'LAL', 29: 'MEM', 14: 'MIA',
  15: 'MIL', 16: 'MIN', 3: 'NOP', 18: 'NYK', 25: 'OKC', 19: 'ORL', 20: 'PHI', 21: 'PHX',
  22: 'POR', 23: 'SAC', 24: 'SAS', 28: 'TOR', 26: 'UTA', 27: 'WAS',
};

const REGULAR_SEASON = 2; // ESPN seasontype
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// playoffs.json must contain every week the playoff pages can look up, not just
// the "real" championship weeks. NBAPlayoffs / LeaguePlayoffs / MyLeaguePlayoffs
// offer playoff start weeks from the Yahoo calendar (or take one from the
// user's league settings). A missing week must not silently shorten the view.
//
// The final six weeks cover playoff starts from Week 18 onward. Week 17 is
// Yahoo's All-Star matchup and belongs in the full schedule, not this view.
const PLAYOFF_WINDOW_WEEKS = 6;

const easternDate = (iso) => {
  // en-CA gives YYYY-MM-DD directly.
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(new Date(iso));
};

const easternHour = (iso) =>
  Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      hour12: false,
    }).format(new Date(iso))
  );

// Date-only helpers. Everything is handled as a UTC-midnight Date built from a
// YYYY-MM-DD string, so no timezone can shift a calendar day.
const toDate = (ymd) => new Date(`${ymd}T00:00:00Z`);
const toYmd = (d) => d.toISOString().slice(0, 10);
const addDays = (ymd, n) => {
  const d = toDate(ymd);
  d.setUTCDate(d.getUTCDate() + n);
  return toYmd(d);
};
// Monday of the week containing `ymd`.
const mondayOf = (ymd) => {
  const day = toDate(ymd).getUTCDay(); // 0 = Sunday
  return addDays(ymd, day === 0 ? -6 : 1 - day);
};
const label = (startYmd, endYmd) => {
  const fmt = (ymd) => {
    const d = toDate(ymd);
    return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
  };
  return `${fmt(startYmd)} - ${fmt(endYmd)}`;
};

async function fetchTeam(espnId, tricode) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${espnId}/schedule?season=${SEASON_YEAR}&seasontype=${REGULAR_SEASON}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${tricode}: HTTP ${res.status}`);
  const data = await res.json();
  const events = data.events || [];
  return events
    .filter((e) => (e.seasonType?.type ?? REGULAR_SEASON) === REGULAR_SEASON)
    .map((e) => ({ date: easternDate(e.date), hour: easternHour(e.date), name: e.shortName }));
}

async function main() {
  const seasonLabel = `${SEASON_YEAR - 1}-${String(SEASON_YEAR).slice(2)}`;
  const twoWeekStarts = YAHOO_TWO_WEEK_STARTS[SEASON_YEAR];
  if (!twoWeekStarts) {
    throw new Error(`Yahoo game-week boundaries for ${seasonLabel} are not configured; check Yahoo /nba/gamedates`);
  }
  console.log(`Building NBA ${seasonLabel} schedule from ${FROM_EXISTING ? 'local schedule.json' : 'ESPN'}…\n`);

  const byDate = new Map(); // date → Set(tricode)
  const perTeam = {};
  const oddTipoffs = [];

  if (FROM_EXISTING) {
    const existing = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'schedule.json'), 'utf8'));
    for (const [date, teams] of Object.entries(existing)) {
      byDate.set(date, new Set(teams));
      for (const team of teams) perTeam[team] = (perTeam[team] || 0) + 1;
    }
  } else {
    for (const [espnId, tricode] of Object.entries(TEAMS)) {
      const games = await fetchTeam(espnId, tricode);
      perTeam[tricode] = games.length;
      for (const g of games) {
        if (!byDate.has(g.date)) byDate.set(g.date, new Set());
        byDate.get(g.date).add(tricode);
        // A tip before noon Eastern means ESPN has a placeholder time, which is
        // the one case where the calendar date could be wrong.
        if (g.hour < 12) oddTipoffs.push(`${g.date} ${g.name}`);
      }
      process.stdout.write(`  ${tricode} ${String(games.length).padStart(2)} games\r`);
      await new Promise((r) => setTimeout(r, 120)); // be polite
    }
  }

  const dates = [...byDate.keys()].sort();
  if (!dates.length) throw new Error('No games returned — has the schedule been released?');

  const schedule = {};
  for (const d of dates) schedule[d] = [...byDate.get(d)].sort();

  // Fantasy weeks: Monday–Sunday, from the week containing opening night to the
  // week containing the final game.
  const firstMonday = mondayOf(dates[0]);
  const lastMonday = mondayOf(dates[dates.length - 1]);
  const rawWeeks = [];
  for (let start = firstMonday; start <= lastMonday; start = addDays(start, 7)) {
    rawWeeks.push({ start, end: addDays(start, 6) });
  }

  for (const start of twoWeekStarts) {
    const i = rawWeeks.findIndex((wk) => wk.start === start);
    if (i < 0 || !rawWeeks[i + 1] || rawWeeks[i + 1].start !== addDays(start, 7)) {
      throw new Error(`Cannot merge Yahoo's two-week period beginning ${start}`);
    }
    rawWeeks[i].end = rawWeeks[i + 1].end;
    rawWeeks.splice(i + 1, 1);
  }
  // Yahoo starts Week 1 on opening night, not on the preceding Monday.
  rawWeeks[0].start = dates[0];

  const weeks = {};
  rawWeeks.forEach((wk, i) => {
    weeks[i + 1] = { start: wk.start, end: wk.end, label: label(wk.start, wk.end) };
  });

  const lastWeek = rawWeeks.length;
  const playoffStart = Math.max(1, lastWeek - PLAYOFF_WINDOW_WEEKS + 1);
  const playoffWeeks = {};
  for (let w = playoffStart; w <= lastWeek; w += 1) playoffWeeks[w] = weeks[w];

  // ── summary ───────────────────────────────────────────────────────
  const totalGames = Object.values(perTeam).reduce((a, b) => a + b, 0) / 2;
  const counts = [...new Set(Object.values(perTeam))].sort((a, b) => a - b);
  console.log(`  ${Object.keys(TEAMS).length} teams, ${totalGames} games          `);
  console.log(`  games per team: ${counts.join(' / ')}`);
  console.log(`  season: ${dates[0]} → ${dates[dates.length - 1]} (${dates.length} game days)`);
  console.log(`  weeks:  ${lastWeek} (${weeks[1].start} → ${weeks[lastWeek].end})`);
  console.log(`  Yahoo two-week periods: ${twoWeekStarts.map((start) => {
    const week = Object.entries(weeks).find(([, value]) => value.start === start);
    return `W${week[0]} ${week[1].label}`;
  }).join('; ')}`);
  console.log(`  playoff-eligible weeks in playoffs.json: ${playoffStart}–${lastWeek}`);

  if (counts.some((c) => c !== 82)) {
    console.log(
      `\n  NOTE: teams are short of 82 games. The NBA leaves each team's two\n` +
        `  in-season-tournament dates unassigned until the Cup bracket is set in\n` +
        `  December — rerun this script then to fill them in.`
    );
  }
  if (oddTipoffs.length) {
    console.log(`\n  ${oddTipoffs.length} game(s) with a pre-noon ET tip (placeholder times — check the date):`);
    oddTipoffs.slice(0, 5).forEach((g) => console.log(`    ${g}`));
  }

  if (DRY_RUN) {
    console.log('\nDry run — nothing written.');
    return;
  }

  fs.writeFileSync(path.join(OUT_DIR, 'schedule.json'), `${JSON.stringify(schedule, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, 'weeks.json'), `${JSON.stringify({ weeks }, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, 'playoffs.json'), `${JSON.stringify({ weeks: playoffWeeks }, null, 2)}\n`);
  console.log(`\nWrote schedule.json, weeks.json and playoffs.json to ${path.relative(process.cwd(), OUT_DIR)}/`);
}

main().catch((e) => {
  console.error(`\nFailed: ${e.message}`);
  process.exit(1);
});
