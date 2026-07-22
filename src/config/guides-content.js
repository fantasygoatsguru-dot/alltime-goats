// Editorial content for the Guides section.
// The STATS are never authored here — they come live from the z-score engine
// (player_period_averages) via <PuntRankingTable> / <TeamRadar> / <DraftBuilder>.
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

export const CURRENT_GUIDE_SEASON = '2025-26';

// ---------------------------------------------------------------------------
// GUIDES
// ---------------------------------------------------------------------------
// Only `punt-blocks` is written out in full — it's the sample. The rest are
// light stubs so you can see how the hub groups and lists them.

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

  // ---- Stubs (not written out) --------------------------------------------
  { slug: 'punt-assists',    type: 'punt', puntKey: 'ast', title: 'Punt Assists',    season: CURRENT_GUIDE_SEASON, difficulty: 'Intermediate', isPremium: true,  tagline: 'Lean into bigs and low-usage wings.', strengths: ['blk', 'reb', 'fg'], weaknesses: ['ast', 'to'] },
  { slug: 'punt-fg',         type: 'punt', puntKey: 'fg',  title: 'Punt FG%',         season: CURRENT_GUIDE_SEASON, difficulty: 'Beginner',     isPremium: true,  tagline: 'The volume-scorer build. Fire away.',  strengths: ['pts', '3pm', 'ast', 'stl'], weaknesses: ['fg'] },
  { slug: 'punt-ft',         type: 'punt', puntKey: 'ft',  title: 'Punt FT%',         season: CURRENT_GUIDE_SEASON, difficulty: 'Beginner',     isPremium: true,  tagline: 'Stack the bigs, dominate the paint.',  strengths: ['blk', 'reb', 'fg'], weaknesses: ['ft'] },
  { slug: 'punt-threes',     type: 'punt', puntKey: '3pm', title: 'Punt Threes',      season: CURRENT_GUIDE_SEASON, difficulty: 'Intermediate', isPremium: true,  tagline: 'Old-school bigs and slashers.',        strengths: ['blk', 'reb', 'fg', 'pts'], weaknesses: ['3pm'] },
  { slug: 'punt-points',     type: 'punt', puntKey: 'pts', title: 'Punt Points',      season: CURRENT_GUIDE_SEASON, difficulty: 'Advanced',     isPremium: true,  tagline: 'Specialists over scorers.',            strengths: ['stl', 'blk', 'fg', 'ft'], weaknesses: ['pts'] },
  { slug: 'punt-steals',     type: 'punt', puntKey: 'stl', title: 'Punt Steals',      season: CURRENT_GUIDE_SEASON, difficulty: 'Advanced',     isPremium: true,  tagline: 'Ignore the noisiest category.',        strengths: ['pts', 'reb', 'blk', 'fg'], weaknesses: ['stl'] },
];

export const guideBySlug = Object.fromEntries(guides.map((g) => [g.slug, g]));

// Grouping for the hub page.
export const guideGroups = [
  {
    id: 'punt',
    title: 'Punt Guides',
    blurb: 'One winning strategy per category. Give up one column, dominate the rest.',
    guides: guides.filter((g) => g.type === 'punt'),
  },
];
