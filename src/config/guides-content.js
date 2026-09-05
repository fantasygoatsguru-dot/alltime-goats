// Explicit .js extension: scripts/prerender.js reaches this file under plain
// Node ESM (via structured-data.js), which does not resolve extensionless paths.
import { CONTENT_SEASON } from './season.js';
import { PUNT_GUIDES } from './punt-guides-2026-27.js';

// Editorial content for the Guides section.
// The STATS are never authored here — they come live from the z-score engine
// (player_period_averages) via <RankingTable> / <TeamRadar> / <DraftBuilder>.
// This file holds only the prose, structure, and human judgement around a build.
//
// Adding a guide = add an entry here. The template (Guide.jsx) and the hub
// (Guides.jsx) render everything off this config. No database, no CMS.

// The nine fantasy categories, with a fixed colour identity used across the
// whole Guides section. `zKey` maps to the column in player_period_averages.
export const CATEGORIES = [
  { key: 'pts', zKey: 'points_z',         label: 'PTS', name: 'Points',       color: '#f2711c' },
  { key: '3pm', zKey: 'three_pointers_z', label: '3PM', name: 'Threes',       color: '#8e44ad' },
  { key: 'reb', zKey: 'rebounds_z',       label: 'REB', name: 'Rebounds',     color: '#16a085' },
  { key: 'ast', zKey: 'assists_z',        label: 'AST', name: 'Assists',      color: '#2f80ed' },
  { key: 'stl', zKey: 'steals_z',         label: 'STL', name: 'Steals',       color: '#27ae60' },
  { key: 'blk', zKey: 'blocks_z',         label: 'BLK', name: 'Blocks',       color: '#c0392b' },
  { key: 'fg',  zKey: 'fg_percentage_z',  label: 'FG%', name: 'Field Goal %', color: '#b8860b' },
  { key: 'ft',  zKey: 'ft_percentage_z',  label: 'FT%', name: 'Free Throw %', color: '#c2185b' },
  { key: 'to',  zKey: 'turnovers_z',      label: 'TO',  name: 'Turnovers',    color: '#546e7a' },
];

export const categoryByKey = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

// The season the guides are written for. Editorial only — the live boards read
// their numbers from STATS_SEASON, which lags this until the new season's data
// lands. See config/season.js for why the two flip separately.
export const CURRENT_GUIDE_SEASON = CONTENT_SEASON;

// ---------------------------------------------------------------------------
// GUIDES
// ---------------------------------------------------------------------------
// The four rankings/reference guides are written out below. `punt-blocks` is
// the free, indexable punt build and doubles as the shape every other punt
// guide follows; the written premium builds live in punt-guides-2026-27.js and
// are spread in at the foot of the array. Builds not yet written are in
// PLANNED_GUIDES and deliberately render nowhere.

export const guides = [
  {
    slug: 'punt-blocks',
    type: 'punt',
    puntKey: 'blk',
    title: 'Punt Blocks',
    season: CURRENT_GUIDE_SEASON,
    difficulty: 'Advanced',
    isPremium: false, // free & indexable — the SEO teaser build
    tagline:
      'Concede the rarest category on the board and out-build the field everywhere else.',
    strengths: ['ast', 'stl', '3pm', 'ft'],
    weaknesses: ['blk', 'reb', 'fg'],

    // The live re-ranked board, ungated like the rest of this guide. minGames
    // overrides the component default of 0, which lets a player ride twenty hot
    // games into the top 50 — on the guide that has to prove the board works at
    // all, that noise is the whole impression. freeLimit null means every row
    // renders, so the Free badge on this page is the literal truth.
    board: { minGames: 30, freeLimit: null, previewRows: 4 },

    sections: [
      {
        id: 'strategy',
        heading: 'The strategy',
        body: [
          "Punting blocks isn't the flashiest build, but it might be the most durable one in the modern NBA. As the league has drifted perimeter-ward, quality shot-blocking has concentrated into a tiny group of centers — and those centers tend to be the same players who wreck your free-throw percentage and turnovers. Walking away from blocks lets you skip that whole aisle of the draft.",
          "The payoff is roster flexibility. Freed from chasing swats, you can load up on skilled wings and guards who quietly win assists, steals, threes and free-throw percentage — four categories that travel well together. You're not building a weird team; you're building a very good team that happens to ignore one column.",
        ],
      },
      {
        id: 'correlation',
        heading: 'Natural strengths & weaknesses',
        body: [
          "Dropping blocks pulls your center-heavy categories down with it. Expect to run light on rebounds and field-goal percentage — the bigs who supply those are usually the ones you're passing on. That's the trade, and it's a fair one.",
          "In return, the guard-and-wing archetype you end up with is a natural fit for assists, steals, threes and free-throw percentage. The build practically assembles itself once you commit: every value pick you take reinforces the same four or five winning columns.",
        ],
      },
      {
        id: 'draft',
        heading: 'Where the value sits in the draft',
        body: [
          "Because you're ignoring the scarcest category, your board gets deeper, not shallower. Elite blockers slide down your personal rankings while high-usage guards and do-everything wings climb. The live table below re-ranks every player in the league with blocks removed from the math — sort it, and you're looking at your actual draft board for this build.",
        ],
      },
    ],

    buildingBlocks: [
      { name: 'Elite point guards', note: 'Assists + steals + threes in one slot. The spine of the build.' },
      { name: 'Two-way wings', note: 'Steals and threes without dragging your percentages down.' },
      { name: 'Efficient scoring forwards', note: 'Points and FG% to offset the guard-heavy build.' },
    ],

    exampleTeams: [
      {
        name: 'Guard-heavy blueprint',
        color: '#2e9e53',
        note: 'Ball-dominant guards stacked for assists, threes and free-throw percentage — the frontcourt gets streamed.',
        roster: ['Luka Dončić', 'Tyrese Maxey', 'James Harden', 'Jamal Murray', 'Stephen Curry', 'Austin Reaves', 'Cade Cunningham', 'Keyonte George'],
      },
      {
        name: 'Balanced punt-blocks',
        color: '#ff6f61',
        note: 'Two-way wings and one stretch big for rebounds, keeping steals and percentages strong without chasing swats.',
        roster: ['Shai Gilgeous-Alexander', 'Donovan Mitchell', 'Trey Murphy III', 'Kawhi Leonard', 'Anthony Edwards', 'Jalen Johnson', 'Jimmy Butler III', 'Lauri Markkanen'],
      },
    ],

    // Round-by-round draft targets. Each candidate carries a full scouting
    // paragraph (grounded in this season's per-game line). Names match the
    // live board, so picking one also feeds the draft-builder radar.
    roundTargets: [
      {
        round: 1,
        candidates: [
          { name: 'Nikola Jokić', note: "The best possible starting point. Jokić posts 29.0 points, 12.5 rebounds and 10.5 assists a night on a video-game 57.6% from the floor, and because only 0.8 of his value comes from blocks, punting them costs you nothing. He single-handedly patches the build's two soft spots — rebounds and field-goal percentage — while stuffing every guard column. The only tax is 3.8 turnovers, so pair him with low-usage, ball-secure pieces later." },
          { name: 'Shai Gilgeous-Alexander', note: "The cleanest non-Jokić anchor. SGA scores 32.0 a game on 55.1% shooting with 89.7% free throws and just 2.0 turnovers — elite, low-risk production across points, steals, assists and both percentages. His block total (0.8) is meaningless to this build, so you capture all of that value for free. Rebounds (4.5) are the lone gap, easily covered by a mid-round big." },
          { name: 'Luka Dončić', note: "A one-man category sweep: 32.4 points, 3.8 threes, 7.8 boards and 8.4 dimes, with a negligible 0.5 blocks. He even eases the build's rebound problem from the guard slot. The catch is a league-leading 4.0 turnovers — draft him and you're committing to chasing low-turnover role players the rest of the way." },
        ],
      },
      {
        round: 2,
        candidates: [
          { name: 'Stephen Curry', note: "Still a build-defining source of the columns punt blocks wants to win. Curry drills 4.5 threes a night, hits 93.1% from the line and adds 4.8 assists, none of it dependent on blocks (0.4). His rebounding (3.5) and steals (1.1) are light, so lean big-and-steal-heavy around him." },
          { name: 'James Harden', note: "A counting-stat machine who never needed blocks. Harden pumps out 8.1 assists, 3.0 threes and 88.7% free throws with steals on top — exactly the guard profile this build stacks. The 3.6 turnovers and 42.4% field goal are the costs; fine here since you're punting neither, but don't double down on both." },
          { name: 'Anthony Edwards', note: "Elite points-and-threes scoring (29.3 and 3.5) with real steals, and his 0.8 blocks are irrelevant to the plan. Ant wins you the two categories that dry up fastest. His assists (3.7) are modest for a first option, so prioritize a playmaker early if you pair him with other score-first wings." },
        ],
      },
      {
        round: 3,
        candidates: [
          { name: 'Austin Reaves', note: "A no-holes line at a discount: 23.2 points, 5.4 assists, 2.4 threes and 87.0% free throws with zero block dependency (0.4). Plug-and-play value in every column this build targets. Watch the 3.0 turnovers, but nothing else here needs managing." },
          { name: 'Karl-Anthony Towns', note: "Your ideal rebounding-and-percentage anchor. KAT grabs 12.0 boards, shoots 85.6% from the line for a big and adds threes — all while barely blocking (0.6), which turns his one 'weakness' into a perfect fit. Start with him and rebounds, the build's natural hole, is largely solved." },
          { name: 'Jimmy Butler III', note: "A stability pick: 52.0% shooting, 86.2% free throws, 1.4 steals and just 1.6 turnovers, with a rock-bottom 0.2 blocks that fit the build cleanly. He won't wow you in any single column but props up efficiency and steals with almost no downside." },
        ],
      },
      {
        round: 4,
        candidates: [
          { name: 'Devin Booker', note: "Points, assists and free-throw percentage from the guard slot (24.9 / 6.1 / 86.9%) with no block value wasted (0.3) — a strong source of the fast-drying early categories. The 3.2 turnovers and light steals (0.9) are the soft spots." },
          { name: 'Jaylen Brown', note: "Big scoring (28.3) with useful boards (7.0) and steals, and only 0.4 blocks to leave on the table. He covers rebounds better than most wings. The 77.7% free throws and 3.5 turnovers keep him from being a flawless fit, so bank FT% elsewhere." },
          { name: 'Deni Avdija', note: "A breakout all-around line — 23.7 points, 6.8 rebounds, 6.6 assists — from a wing who doesn't lean on blocks (0.6). He stuffs the sheet in exactly the columns you're building. The 3.6 turnovers are steep, so surround him with secure handlers." },
        ],
      },
      {
        round: 5,
        candidates: [
          { name: 'Jalen Brunson', note: "One of the lowest block totals in the top 50 (0.1), which makes his 26.3 points, 6.5 assists and 2.8 threes pure profit here. Efficient and low-turnover (2.3) for a lead guard. Rebounds (3.4) and steals (0.7) are thin — cover them with your bigs and a steal specialist." },
          { name: 'Franz Wagner', note: "A quietly perfect fit: balanced scoring, 5.6 boards, steals and 82.9% free throws with just 1.6 turnovers and 0.3 blocks. Wagner keeps your percentages and turnovers honest while contributing everywhere the build cares about." },
          { name: 'Desmond Bane', note: "Elite efficiency for a guard — 48.8% from the floor and a huge 92.0% from the line — plus threes and low turnovers (2.0). His negligible blocks (0.4) make him a clean, category-friendly pickup that shores up both percentages." },
        ],
      },
      {
        round: 6,
        candidates: [
          { name: 'Dyson Daniels', note: "The steals cheat code — 1.9 a game — with surprising rebounds (6.6) and assists (6.1) for a guard, and blocks (0.4) that don't matter to you. He wins a scarce category by himself. The 61.5% free throws are a real drag, so stack FT% before you take him." },
          { name: 'Immanuel Quickley', note: "Assists, threes, steals and 82.3% free throws with barely any blocks (0.1) — a tidy guard line for the middle rounds, and low turnovers (1.6) too. The 44.7% field goal is the only real hit." },
          { name: 'Tyler Herro', note: "Pure offense: 22.1 points, 2.5 threes and a sparkling 91.7% from the line, with negligible blocks (0.3) and few turnovers (1.9). He racks up the columns you're chasing; steals (0.7) and boards are the tradeoff." },
        ],
      },
      {
        round: 7,
        candidates: [
          { name: 'Josh Giddey', note: "Near-triple-double production — 8.4 rebounds and 8.7 assists — from a guard whose 0.4 blocks are a non-factor. He single-handedly eases the build's rebound weakness. The 3.7 turnovers and 76.2% free throws are the costs to plan around." },
          { name: 'Paul George', note: "When healthy, threes, steals and 85.1% free throws with low turnovers (1.7) and irrelevant blocks (0.5) — broad, on-build coverage. The 42.7% field goal and injury risk are why he slides to here." },
          { name: 'Norman Powell', note: "A cheap bucket of threes and points (22.4 and 2.9) with steals and only 0.2 blocks. He quietly moves the categories you win, and the low turnovers (2.1) are a bonus; just don't expect rebounds (3.6) or assists." },
        ],
      },
      {
        round: 8,
        candidates: [
          { name: 'LaMelo Ball', note: "Elite assists and threes (7.2 and 3.5) plus 90.1% free throws, and his tiny 0.2 blocks are a feature here — a category-league monster in exactly your winning columns. The 39.8% field goal is ugly; punt-blocks can absorb it, but don't pair him with other bricklayers." },
          { name: "De'Aaron Fox", note: "Assists, steals and efficient scoring (49.6% FG) from the point, with 0.3 blocks to ignore. Fox contributes across the board without hurting your field goal. The 76.2% free throws are the one column he won't help." },
          { name: 'Kon Knueppel', note: "A rookie sharpshooter posting 3.5 threes on 48.9%/87.1% splits with useful boards (5.3) and 0.2 blocks — efficient, on-build value at a late price. Steals (0.8) are the only thin spot." },
        ],
      },
      {
        round: 9,
        candidates: [
          { name: 'Trae Young', note: "The archetypal punt-blocks guard: 8.6 assists and 82.8% free throws with 0.1 blocks — nothing wasted. He wins assists almost single-handedly. The 42.7% field goal and near-zero rebounds (1.8) are the price of admission." },
          { name: 'Jalen Williams', note: "A well-rounded, low-risk wing — 49.4% shooting, 1.4 steals, 5.3 assists, few turnovers (2.0) — with 0.2 blocks that keep him fully on-build. Nothing here hurts you; a safe value pick." },
          { name: 'Pascal Siakam', note: "Efficient scoring and rebounds (24.0 and 6.7) from a forward who barely blocks (0.4), helping the build's soft spots. The 68.2% free throws are the lone category he drags." },
        ],
      },
      {
        round: 10,
        candidates: [
          { name: 'Ja Morant', note: "A burst of assists and scoring (8.1 and 19.5) with a strong 89.7% from the line and 0.3 blocks to leave behind — he fuels your guard categories. The 41.0% field goal and 3.6 turnovers are why he's this cheap." },
          { name: 'DeMar DeRozan', note: "Mid-range points, 86.0% free throws and a microscopic 1.1 turnovers, with 0.3 blocks that don't matter — steady, efficient value late. He won't help threes (0.6) or defense much, but he never hurts your percentages." },
          { name: 'Collin Gillespie', note: "A late-round steal for this build: 3.1 threes, 4.8 assists, 1.3 steals and 86.3% free throws with just 0.2 blocks and 1.6 turnovers. He quietly nudges several winning columns at once." },
        ],
      },
      {
        round: 11,
        candidates: [
          { name: 'Josh Hart', note: "A Swiss-army source of non-block value — 7.5 rebounds, 5.0 assists and 1.1 steals from a guard, on 49.1% shooting. He covers the build's rebound gap cheaply. The 70.6% free throws are the one hit." },
          { name: 'Reed Sheppard', note: "Threes and steals with upside at a bargain, plus 81.3% free throws and few turnovers (1.5). A cheap dart that fits the profile if his role keeps growing." },
          { name: 'Zion Williamson', note: "A field-goal and points anchor — 21.5 on a monster 58.7% — to offset the guard-heavy build, with 0.6 blocks that were never his game. The zero threes (0.0) and 71.7% free throws are the tradeoffs; his health is the real risk." },
        ],
      },
      {
        round: 12,
        candidates: [
          { name: 'Payton Pritchard', note: "Volume threes and assists (2.5 and 5.3) with 86.1% free throws, a tiny 0.1 blocks and league-low turnovers (1.3) — excellent last-round value for the columns you win." },
          { name: 'Jrue Holiday', note: "Steals, assists and threes with veteran efficiency and just 0.1 blocks — a clean guard to round out the roster. The 2.9 turnovers are the only mild negative." },
          { name: 'Domantas Sabonis', note: "A perfect punt-blocks big: 11.4 rebounds, 4.1 assists and 54.3% shooting from the center spot with a mere 0.2 blocks. He hammers the build's two weak columns without costing you a category you're chasing — grab him if he slips. The 72.7% free throws are the one drag." },
        ],
      },
    ],

    faqs: [
      {
        q: 'Does punting blocks mean I lose rebounds too?',
        a: 'Usually you run below average in rebounds and field-goal percentage, since the players who supply blocks tend to supply those as well. You make it up across assists, steals, threes and free-throw percentage.',
      },
      {
        q: 'Is punt blocks good on Yahoo 9-cat?',
        a: 'Yes. It is a classic 9-cat build and has only gotten stronger as elite shot-blocking has become rarer across the league.',
      },
    ],
  },

  // ---- Rankings ------------------------------------------------------------
  {
    slug: 'top-150',
    type: 'rankings',
    puntKey: null, // no punt — every category counts, hence "pure"
    title: 'Top 150',
    season: CURRENT_GUIDE_SEASON,
    difficulty: 'Beginner',
    isPremium: false, // free & indexable — the draft-season lead magnet
    tagline:
      'Projected 9-category value for 2026-27. No punt, no positional fudging — 150 players, each with the reasoning behind his rank.',
    strengths: [],
    weaknesses: [],

    // This guide renders the authored projection (config/top-150-2026-27.js)
    // instead of a live board — the season hasn't been played, so there are no
    // z-scores to sort. `projection` switches Guide.jsx to <ProjectionList>.
    // Ungated: all 150 render, and the badge on this guide reads "Free"
    // because that is now true of the whole page. A gate here made the board a
    // teaser wearing a Free badge, which is the one thing a draft-season lead
    // magnet cannot afford to be. previewRows is unused while freeLimit is null.
    projection: {
      freeLimit: null,
      previewRows: 3,
    },

    sections: [
      {
        id: 'strategy',
        heading: 'What this ranking is',
        body: [
          "Every other guide in this section throws a category away on purpose. This one throws nothing away. All nine categories — points, threes, rebounds, assists, steals, blocks, field-goal percentage, free-throw percentage and turnovers — are weighted equally, and a player's rank is a projection of how much total z-score he will add to a roster this season. No positional adjustment, no name recognition, no punt.",
          "That makes it the honest baseline. A top 150 tells you what each player is worth before you have committed to a build, which is exactly the information you need in the opening rounds when your team still has no identity. Once you know what everyone costs in raw value, choosing to give a category away becomes a decision you make with your eyes open rather than one the draft makes for you.",
        ],
      },
      {
        id: 'method',
        heading: 'How the projection was built',
        body: [
          "Every rank starts from last season's actual nine-category production — the line you can see underneath each player below, pulled live from the same database that powers the rankings tool. That is the evidence. The projection then adjusts it for the four things a raw stat line cannot capture: age and trajectory, expected role and minutes, availability history, and the specific way a player's shape gains or loses value in a nine-category league.",
          "The last of those is why this list looks different from the consensus. Turnovers count here, so high-usage playmakers fall. Free-throw percentage counts on volume, so a 60-percent big taking five attempts a night is penalised far more than the box score suggests. And blocks and steals are the scarcest columns on the board, so the players who supply them are ranked ahead of higher scorers who do not.",
          "Availability is treated as part of the projection rather than a footnote. A player who produces a top-ten line in fifty games is ranked as what he is — a partial season of excellent production — not as a top-ten player with an asterisk. That is why several famous names sit twenty or thirty spots below where their per-game rate would put them.",
        ],
      },
      {
        id: 'draft',
        heading: 'How to actually use it on draft day',
        body: [
          "For the first three or four rounds, take the best available player on this board and do not overthink it. Early picks are about raw value; no punt build is strong enough to justify reaching past a materially better player in round two.",
          "From the middle rounds on, the list stops being a script and becomes a filter. Look at the roster you have accumulated, find the one or two categories you are already losing, and start reading for players who reinforce your strengths rather than patch your holes. That drift is how nearly every good team ends up in a punt — you do not choose it in advance, you notice it happening and commit.",
          "The moment you know which category you are conceding, switch to the matching punt guide. Its board re-ranks the entire league with that column removed from the maths, and the ordering changes more than you would expect — that reshuffle is your real draft board for the rest of the night. Several players ranked in the eighties here are top-40 assets inside the right build, and the write-ups below say so where it applies.",
        ],
      },
      {
        id: 'caveats',
        heading: 'What this list does not know',
        body: [
          "It is a projection of a season that has not been played, so treat it as a starting point with reasoning attached, not a verdict. Three gaps are worth naming outright. Offseason moves are not fully reflected — each player carries his last known team, and a trade or signing that changes a usage rate should move him on your own board. Rookies are excluded entirely: with no prior season to project from, ranking them would be guesswork dressed up as analysis, so slot this year's class in yourself.",
          "And injury returns are the widest error bars on the list. Players coming back from a lost season appear without a prior-season line, ranked on what they were before plus a discount for the unknown. If the reports out of camp are good, move them up aggressively — that is where the biggest edges in a draft usually sit.",
        ],
      },
    ],

    faqs: [
      {
        q: 'Are these projections or last season\'s rankings?',
        a: 'Projections. The 2026-27 season has not been played, so the ranks are a judgement call built on last season\'s production, age and trajectory, expected role, and availability history. Each player\'s actual prior-season line is shown underneath his write-up so you can see exactly what the projection is arguing with.',
      },
      {
        q: 'Should I just draft straight down this list?',
        a: 'For the first three or four rounds, yes. After that, fit beats raw value — once your roster leans a certain way, reinforcing your strong categories is worth more than adding a slightly better player who spreads your production thinner.',
      },
      {
        q: 'Why is a big scorer ranked below a player who averages far fewer points?',
        a: 'Because points are the least scarce category in 9-cat. A player who supplies steals, blocks or an elite percentage is helping in a column where the gap between good and average is much wider, and volume scorers usually give some of it back in turnovers and field-goal percentage.',
      },
      {
        q: 'Does this work for 8-cat leagues?',
        a: 'Mostly. If your league drops turnovers, high-usage playmakers are worth more than they appear here — anyone whose write-up flags turnovers as the main cost should move up a round or so.',
      },
      {
        q: 'Why are there no rookies?',
        a: 'Because there is nothing to project from. A first-year player has no prior nine-category production, so ranking him would be guesswork presented as analysis. Slot this year\'s class into the list yourself once you have seen the preseason roles.',
      },
    ],
  },

  {
    slug: 'sleepers',
    type: 'rankings',
    puntKey: null,
    title: 'Sleepers',
    season: CURRENT_GUIDE_SEASON,
    difficulty: 'Intermediate',
    isPremium: false,
    tagline:
      'Fifteen players whose projected 9-category value sits well above what they will cost you on draft day.',
    strengths: [],
    weaknesses: [],

    // Unranked write-up list (config/sleepers-busts-2026-27.js).
    playerNotes: {
      source: 'sleepers',
      accent: '#2e9e53',
      // Gated at 6 of 15 from the 2026-27 draft season on.
      //
      // These were ungated while the plan was for the punt guides to carry the
      // pass. They are not written yet (see PLANNED_GUIDES at the foot of this
      // file), so the pass was selling the back half of the top 150 and little
      // else — which is not $15 of anything. Six free entries keeps the page a
      // real list for "fantasy basketball sleepers" (the same ~40% free share
      // the top 150 ranks at position 7 on) while the remaining nine become a
      // reason to buy.
      //
      // rosterBlock() in seo-content.js reads this number rather than copying
      // it, so the crawlable block ships exactly the six a logged-out visitor
      // sees, plus the "9 more with a Draft Pass" line. Never hand a crawler
      // the locked remainder — that is cloaking.
      freeLimit: 6,
      previewRows: 2,
      heading: 'The sleepers',
      lead:
        "Each name below costs less than it should, with the argument and last season's real line attached. Prices are the range these players typically go in a twelve-team league — adjust to what you actually see on the clock.",
    },

    sections: [
      {
        id: 'strategy',
        heading: 'What a sleeper actually is',
        body: [
          "A sleeper is not a player nobody has heard of. It is a player whose projected nine-category value sits materially above what he will cost you, and in category leagues that gap almost always comes from the same three places: minutes that are about to grow, a scarce category supplied cheaply, or production the market is still discounting as a fluke.",
          "The second of those is the one most drafters underrate. Points are everywhere; blocks, steals and free-throw percentage are not. A bench big who blocks 1.9 shots in 21 minutes moves a category you cannot otherwise buy after round eight, and he does it at no draft cost. That is a bigger edge than a mid-round scorer who adds four points a night to a column you were already winning.",
        ],
      },
      {
        id: 'draft',
        heading: 'How to use this list',
        body: [
          "Do not reach. The entire point of a sleeper is the discount, and taking one two rounds early destroys the thing that made him valuable. Keep the list open as a queue: when your pick arrives and nobody on the main board is clearly better, take the sleeper whose best category is the one your roster is closest to losing.",
          "Expect a third of them to miss. Sleeper picks are cheap precisely because they carry role risk, and a list where every name hits is a list that was too conservative to be useful. The correct way to hold them is loosely — draft two or three, give them until Thanksgiving, and drop the ones whose minutes never arrived.",
        ],
      },
      {
        id: 'caveats',
        heading: 'What this list does not know',
        body: [
          "It is a projection of a season that has not been played, and the biggest single input to a sleeper — the depth chart he is standing in — is also the thing most likely to change between now and opening night. A signing or a trade can erase any of these cases overnight, so check the current roster before you draft, and treat the price ranges as approximations rather than market data.",
        ],
      },
    ],

    faqs: [
      {
        q: 'How are these different from the top 150?',
        a: 'The top 150 ranks everyone on projected value. This list is specifically about the gap between that value and draft cost — several of these players appear on the main board too, just far higher than the market has them.',
      },
      {
        q: 'How many sleepers should I actually draft?',
        a: 'Two or three in the last five rounds. They are lottery tickets with good odds, not roster foundations, and a team built mostly out of them has no floor.',
      },
      {
        q: 'Why are there so many bench players here?',
        a: 'Because per-minute production is the most reliable predictor of what happens when minutes arrive, and it is systematically underpriced. A player producing at a top-40 rate in 22 minutes is one rotation change from being a top-40 player.',
      },
    ],
  },

  {
    slug: 'busts',
    type: 'rankings',
    puntKey: null,
    title: 'Busts',
    season: CURRENT_GUIDE_SEASON,
    difficulty: 'Intermediate',
    isPremium: false,
    tagline:
      'Twelve players who will not return their draft price in 9-cat — and exactly which column gives the value back.',
    strengths: [],
    weaknesses: [],

    playerNotes: {
      source: 'busts',
      accent: '#c0392b',
      // Gated at 5 of 12 from the 2026-27 draft season on — same reasoning as
      // the sleepers list above: the punt guides that were meant to carry the
      // pass do not exist yet. Five free entries keeps the page a real list for
      // "fantasy basketball busts"; the other seven come with the pass, and
      // rosterBlock() in seo-content.js mirrors the split into the crawlable
      // HTML automatically.
      freeLimit: 5,
      previewRows: 2,
      heading: 'The busts',
      lead:
        "Every player below is good at basketball. That is not the question — the question is whether the nine-category production justifies the pick, and for each of these it does not at the price listed.",
    },

    sections: [
      {
        id: 'strategy',
        heading: 'What "bust" means here',
        body: [
          "It does not mean the player will be bad. It means his nine-category value will not cover what you paid, which is a different claim and a much more common one. Almost every name below will look perfectly good in a box score and still cost you the round you spent on him.",
          "Three patterns account for nearly all of them. The first is the hidden negative: a free-throw or field-goal percentage bad enough, on enough volume, to hand back most of what the player wins elsewhere. The second is the empty average — scoring volume with no rebounds, assists or defensive stats attached, which reads as stardom and grades as a fourth-rounder. The third is availability: elite per-game production over 40 games is not elite production, and a draft price does not come with a refund for the missing nights.",
        ],
      },
      {
        id: 'draft',
        heading: 'How to use this list',
        body: [
          "Read it as a price list, not a blacklist. Several of these players are excellent picks two or three rounds later than they are going, and a few are outright bargains inside the right build — the write-ups say which. The mistake is not owning them; it is paying the consensus price for them.",
          "The exception worth internalising is the punt case. A player whose only real flaw is free-throw percentage stops being a bust the moment you decide to concede that column, and the same is true for field-goal percentage. If you are committed to a build, take the matching punt guide's board over this list — it re-ranks these players with the offending column removed.",
        ],
      },
      {
        id: 'caveats',
        heading: 'What this list does not know',
        body: [
          "Draft prices move, and a player who is a bust at pick 20 is a fine pick at pick 40. The ranges here are estimates of where these players typically go in a twelve-team league, not live market data — if the room lets one of them fall far enough, the objection disappears. Offseason moves and camp reports can also change a usage projection completely, so check both before you cross a name off.",
        ],
      },
    ],

    faqs: [
      {
        q: 'Are you saying these players are bad?',
        a: 'No. Every one of them is a good NBA player and several are stars. The claim is narrower: at their current draft price, the nine-category production does not pay for the pick.',
      },
      {
        q: 'Why do so many of these have free-throw percentage problems?',
        a: 'Because free-throw percentage is weighted by volume, and a poor shooter who takes six attempts a night does far more damage than the raw percentage suggests. It is the most commonly underestimated negative in category leagues.',
      },
      {
        q: 'What if one of these players falls to me late?',
        a: 'Take him. Every bust case here is a price objection, and the price falling is the fix. The write-ups name the round where each becomes reasonable value.',
      },
    ],
  },

  // Written punt builds, one file per season — see config/punt-guides-2026-27.js.
  // They live outside this file because each runs 200+ lines and six of them
  // would bury the four rankings guides above.
  ...PUNT_GUIDES,
];

// ---------------------------------------------------------------------------
// PLANNED — deliberately NOT in `guides`, so nothing renders and nothing links
// here.
// ---------------------------------------------------------------------------
// These six were listed on /guides with a Premium lock badge while holding no
// prose, no board and no example teams — a paywall in front of an empty page,
// on the most-searched build in 9-cat (punt FT) among others. Unlisting them is
// not a demotion of the plan; it is refusing to sell what is not written.
//
// To ship one: move its entry into `guides` above, fill it out to the shape of
// punt-blocks (sections, buildingBlocks, roundTargets, exampleTeams, faqs), and
// add the route to config/seo-routes.js and the crawlable copy to
// config/seo-content.js — none of the six are in either file, so even as
// teasers they were invisible to search.
export const PLANNED_GUIDES = [
  { slug: 'punt-assists',    type: 'punt', puntKey: 'ast', title: 'Punt Assists',    season: CURRENT_GUIDE_SEASON, difficulty: 'Intermediate', isPremium: true,  tagline: 'Lean into bigs and low-usage wings.', strengths: ['blk', 'reb', 'fg'], weaknesses: ['ast', 'to'] },
  { slug: 'punt-fg',         type: 'punt', puntKey: 'fg',  title: 'Punt FG%',         season: CURRENT_GUIDE_SEASON, difficulty: 'Beginner',     isPremium: true,  tagline: 'The volume-scorer build. Fire away.',  strengths: ['pts', '3pm', 'ast', 'stl'], weaknesses: ['fg'] },
  { slug: 'punt-threes',     type: 'punt', puntKey: '3pm', title: 'Punt Threes',      season: CURRENT_GUIDE_SEASON, difficulty: 'Intermediate', isPremium: true,  tagline: 'Old-school bigs and slashers.',        strengths: ['blk', 'reb', 'fg', 'pts'], weaknesses: ['3pm'] },
  { slug: 'punt-points',     type: 'punt', puntKey: 'pts', title: 'Punt Points',      season: CURRENT_GUIDE_SEASON, difficulty: 'Advanced',     isPremium: true,  tagline: 'Specialists over scorers.',            strengths: ['stl', 'blk', 'fg', 'ft'], weaknesses: ['pts'] },
  { slug: 'punt-steals',     type: 'punt', puntKey: 'stl', title: 'Punt Steals',      season: CURRENT_GUIDE_SEASON, difficulty: 'Advanced',     isPremium: true,  tagline: 'Ignore the noisiest category.',        strengths: ['pts', 'reb', 'blk', 'fg'], weaknesses: ['stl'] },
];

// How much of a guide a signed-out visitor actually gets. DERIVED from the
// gating rather than hand-set, because a badge that is maintained separately
// from the paywall eventually lies about it:
//
//   'free'    nothing is held back — the whole guide renders for everyone
//   'partial' the page opens and then stops; the rest needs a Draft Pass
//   'premium' the guide is behind the pass outright
//
// The rule that matters: "Free" is reserved for guides where it is true of the
// entire page. A guide showing you the first six of fifteen is not free, and
// labelling it that way spends trust to save a word.
export function guideAccess(guide) {
  if (guide.isPremium) return 'premium';
  const limits = [guide.playerNotes, guide.projection, guide.board]
    .filter(Boolean)
    .map((x) => x.freeLimit);
  return limits.some((n) => Number.isFinite(n)) ? 'partial' : 'free';
}

// Badge copy and colour per access level, kept here so the hub cards and the
// guide hero cannot drift apart.
//
// Two badges, not three. 'partial' and 'premium' differ in how much of a page
// is held back, but from the reader's side they are the same thing — one $15
// Draft Pass opens both — so giving them separate labels only invites the
// question of what "Premium" is and whether it costs extra.
//
// Blue, not red or amber. This badge is the first thing a reader sees on a
// guide they might buy, and it should read as an invitation to click rather
// than a warning not to. It is the same blue as the primary CTA buttons.
const DRAFT_PASS_BADGE = { label: 'Draft Pass', color: '#2f80ed', locked: true };

export const ACCESS_BADGE = {
  free: { label: 'Free', color: '#27ae60', locked: false },
  partial: DRAFT_PASS_BADGE,
  premium: DRAFT_PASS_BADGE,
};

export const guideBySlug = Object.fromEntries(guides.map((g) => [g.slug, g]));

// Grouping for the hub page. Both groups read from `guides`, so a guide appears
// on the hub only once it is actually written — PLANNED_GUIDES cannot leak in.
export const guideGroups = [
  {
    id: 'rankings',
    title: 'Rankings & Draft Prep',
    blurb:
      'The unpunted baseline for 2026-27 — projected 9-category value, plus the players priced wrong in both directions.',
    guides: guides.filter((g) => g.type === 'rankings'),
  },
  {
    id: 'punt',
    title: 'Punt Guides',
    blurb:
      'Give up one column on purpose and dominate the rest. Each build comes with a live draft board re-ranked with that category removed.',
    guides: guides.filter((g) => g.type === 'punt'),
  },
];
