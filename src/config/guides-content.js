// Explicit .js extension: scripts/prerender.js reaches this file under plain
// Node ESM (via structured-data.js), which does not resolve extensionless paths.
import { CONTENT_SEASON } from './season.js';
import { PUNT_GUIDES } from './punt-guides-2026-27.js';

// Editorial content for the Guides section.
// The live stat cards come from player_period_averages via <RankingTable>,
// <TeamRadar> and <DraftBuilder>. Historical numbers quoted in the editorial
// notes are the corrected 2025-26 season lines, not 2026-27 projections.
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
  "slug": "punt-blocks",
  "type": "punt",
  "puntKey": "blk",
  "title": "Punt Blocks",
  "season": CURRENT_GUIDE_SEASON,
  "difficulty": "Advanced",
  "isPremium": false,
  "tagline": "Win guard categories without letting rebounds, FG% and turnovers drift out of reach.",
  "strengths": [
    "pts",
    "ast",
    "stl",
    "3pm",
    "ft"
  ],
  "weaknesses": [
    "blk",
    "reb",
    "fg",
    "to"
  ],
  "board": {
    "minGames": 30,
    "freeLimit": null,
    "previewRows": 4
  },
  "sections": [
    {
      "id": "strategy",
      "heading": "The strategy",
      "body": [
        "Punt blocks is a natural home for guards and wings whose value is concentrated in points, threes, assists, steals and free throws. It is less automatic than simply taking the next high-scoring guard: if you give up blocks and then fall behind in rebounds, FG% and turnovers, you can run out of winnable categories. Build a strong perimeter core, then buy efficient boards from players who do not need swats to help you.",
        "Nikola Jokić is the easiest opening because his 12.9 rebounds and 56.9% shooting solve the build's two familiar frontcourt problems while his 10.7 assists make a guard run possible. A Shai or Luka start can work too, but the next rounds must account for their different weaknesses: Shai needs more boards, while Luka's 4.0 turnovers need deliberate protection or a second punt."
      ]
    },
    {
      "id": "correlation",
      "heading": "Natural strengths & weaknesses",
      "body": [
        "The likely winning categories are points, threes, assists, steals and FT%. Rebounds are the harder frontcourt problem: Towns supplies 11.9 boards at a second-round ADP, while Josh Hart and Dyson Daniels offer useful boards from the perimeter much later. FG% can be managed through a few efficient bigs and by avoiding several high-volume shooting drags on the same roster.",
        "Turnovers deserve as much attention as FG%. Guards who produce your scarce assists often carry the ball enough to create a second loss, so pair a Luka or Harden with low-turnover wings such as Mikal Bridges or a steady secondary guard. These are tendencies, not guarantees; use the team radar after each pick instead of assuming the build will win five categories by itself."
      ]
    },
    {
      "id": "draft",
      "heading": "Where the value sits in the draft",
      "body": [
        "Yahoo's September 26 ADP puts most reliable 25-point scorers and primary passers inside the first three rounds. Secure points and at least two credible assist sources early; later picks can add threes, but they rarely replace first-round creation. Towns, Bam and the rare high-board wings are useful when they fit your price because they let you avoid a forced midseason rebound chase.",
        "The live table below shows corrected 2025-26 production with blocks removed. It is a historical build lens, not a 2026-27 projection: health, trades and roles have changed since that season. The round targets use the dated Yahoo ADP and pre-rank snapshot plus those forward adjustments, and a target near a round boundary may go a round earlier in your room."
      ]
    }
  ],
  "buildingBlocks": [
    {
      "name": "Early creation",
      "note": "One elite points source and a second reliable passer before the assist pool thins."
    },
    {
      "name": "Boards without a block premium",
      "note": "Towns, Hart, Daniels and similar players keep rebounds competitive from unusual slots."
    },
    {
      "name": "Efficiency and ball security",
      "note": "Avoid stacking low-FG volume shooters or several three-turnover creators around the same core."
    }
  ],
  "exampleTeams": [
    {
      "name": "Jokić with balanced guards",
      "color": "#2e9e53",
      "note": "An eight-pick path using roughly one player from each of the first eight Yahoo ADP rounds. Jokić and McDaniels help FG%, Bam supplies boards and steals despite his 44.2% shooting, and the guards supply assists. Continue with low-turnover picks if that category remains close.",
      "roster": [
        "Nikola Jokić",
        "Jamal Murray",
        "Bam Adebayo",
        "Trey Murphy III",
        "Desmond Bane",
        "OG Anunoby",
        "De'Aaron Fox",
        "Jaden McDaniels"
      ]
    },
    {
      "name": "Shai with out-of-position boards",
      "color": "#ff6f61",
      "note": "Reaves is close to a realistic second pick after Shai. Bam, Lauri, Daniels and Hart give the perimeter-led team enough boards to compete, though Lauri must slip a few places from ADP. The eight-player line still needs more assists and threes from later picks.",
      "roster": [
        "Shai Gilgeous-Alexander",
        "Austin Reaves",
        "Bam Adebayo",
        "Lauri Markkanen",
        "Franz Wagner",
        "Dyson Daniels",
        "Mikal Bridges",
        "Josh Hart"
      ]
    }
  ],
  "roundTargets": [
    {
      "round": 1,
      "candidates": [
        {
          "name": "Nikola Jokić",
          "yahooAdp": 1.9,
          "yahooPreRank": 1,
          "note": "The cleanest start: 12.9 rebounds and 56.9% shooting prevent the usual frontcourt slide, while 10.7 assists let you buy other categories from later guards. His 3.7 turnovers call for a few low-usage picks rather than another run of lead creators."
        },
        {
          "name": "Shai Gilgeous-Alexander",
          "yahooAdp": 4.1,
          "yahooPreRank": 2,
          "note": "SGA gives you 31.1 points on 55.3% shooting with 1.4 steals and only 2.2 turnovers. The 4.3 boards are light for a first pick, so plan for a rebounding center or forward in the next two rounds."
        },
        {
          "name": "Luka Dončić",
          "yahooAdp": 3.5,
          "yahooPreRank": 5,
          "note": "The 33.4 points, 4.0 threes, 7.7 rebounds and 8.2 assists are a powerful perimeter start. Four turnovers a game make a clean nine-category finish difficult; either protect the category with later picks or consciously accept a second punt."
        }
      ]
    },
    {
      "round": 2,
      "candidates": [
        {
          "name": "Karl-Anthony Towns",
          "yahooAdp": 15,
          "yahooPreRank": 13,
          "note": "Towns is the second-round big who can give a guard-heavy team 11.9 boards without sacrificing FT% or threes. His 0.5 blocks are largely irrelevant here; 2.5 turnovers from a center are the tradeoff to watch."
        },
        {
          "name": "Jamal Murray",
          "yahooAdp": 20.5,
          "yahooPreRank": 9,
          "note": "Murray supplied 25.4 points, 3.3 threes and 7.1 assists across 75 games. He is a strong second creator after Jokić or SGA, but a team starting with Luka should consider its turnover total before adding another high-usage guard."
        },
        {
          "name": "Austin Reaves",
          "yahooAdp": 22.3,
          "yahooPreRank": 17,
          "note": "LeBron's departure creates room for Reaves to build on 22.9 points and 5.5 assists beside Luka. The 51-game season is the risk, while his 86.8% free throws help an early big who contributes less at the line."
        }
      ]
    },
    {
      "round": 3,
      "candidates": [
        {
          "name": "Bam Adebayo",
          "yahooAdp": 30.1,
          "yahooPreRank": 30,
          "note": "Ten rebounds, 3.2 assists and 1.2 steals from center cover more than a traditional blocker would. His 44.2% FG was a drag last season, and Giannis' arrival in Miami changes the touch distribution, so pair him with a more efficient scorer."
        },
        {
          "name": "James Harden",
          "yahooAdp": 35.1,
          "yahooPreRank": 49,
          "note": "Harden's 7.9 assists, 3.0 threes and 88.2% free throws fit the perimeter plan, but 3.5 turnovers can make that category a casualty. Cleveland now runs him beside Donovan Mitchell; price in a shared backcourt rather than assuming the old usage."
        },
        {
          "name": "Kawhi Leonard",
          "yahooAdp": 29.3,
          "yahooPreRank": 15,
          "note": "He averaged 27.5 points and 1.8 steals in 65 games, then moved to Toronto in the September Ingram trade. The production fits almost any punt-blocks roster; new-team usage and age make him a health bet, so keep the rest of the early picks durable."
        }
      ]
    },
    {
      "round": 4,
      "candidates": [
        {
          "name": "Trey Murphy III",
          "yahooAdp": 40.1,
          "yahooPreRank": 21,
          "note": "Murphy's 3.2 threes and 1.5 steals complement a strong early passer, while 5.7 rebounds help more than a pure shooting specialist would. He is also a useful 88.6% free-throw source if the first two picks left that category thin."
        },
        {
          "name": "Lauri Markkanen",
          "yahooAdp": 38.7,
          "yahooPreRank": 18,
          "note": "The 26.6 points, 2.7 threes and 89.6% free throws from a forward solve several of this build's early needs at once. His 6.8 boards are helpful, but 42 games and Utah's new frontcourt make the health and usage assumptions important."
        },
        {
          "name": "Derrick White",
          "yahooAdp": 47.1,
          "yahooPreRank": 26,
          "note": "A guard giving 5.4 assists and 1.3 blocks would lose a valuable stat in this build, yet his 2.7 threes, 90.2% free throws and 1.7 turnovers still fit. The 39.5% FG means he is a better complement to Jokić or Towns than to another low-efficiency guard."
        }
      ]
    },
    {
      "round": 5,
      "candidates": [
        {
          "name": "Desmond Bane",
          "yahooAdp": 52.9,
          "yahooPreRank": 44,
          "note": "Bane's 20.1 points and 90.8% free throws came over all 82 games, with only 2.0 turnovers. The fifth-round price is attractive if you need stable guard scoring rather than another specialist."
        },
        {
          "name": "Franz Wagner",
          "yahooAdp": 53.2,
          "yahooPreRank": 39,
          "note": "His 20.6 points on 48.1% shooting offer the type of wing efficiency a punt-blocks team needs. The 34-game season leaves health uncertainty; pair him with a reliable earlier pick and use his 5.2 rebounds to support your frontcourt."
        },
        {
          "name": "Keyonte George",
          "yahooAdp": 56.3,
          "yahooPreRank": 121,
          "note": "George brings 23.5 points, 6.1 assists and 89.1% free throws at a fifth-round ADP. His 3.1 turnovers and weak defensive line mean he is best after a safe, efficient first-rounder, not as the third ball-dominant guard on your roster."
        }
      ]
    },
    {
      "round": 6,
      "candidates": [
        {
          "name": "OG Anunoby",
          "yahooAdp": 66.6,
          "yahooPreRank": 60,
          "note": "Anunoby supplies 1.6 steals, 2.3 threes and 48.4% shooting without demanding the ball. His 1.8 turnovers are particularly useful if the first rounds included Luka or Harden."
        },
        {
          "name": "Dyson Daniels",
          "yahooAdp": 62.9,
          "yahooPreRank": 20,
          "note": "Two steals, 6.8 rebounds and 5.9 assists from a guard can patch several holes left by a perimeter start. The 0.3 threes and 61.5% free throws are real build costs, although the FT figure came on only 1.6 attempts; make sure your earlier picks bought enough shooting."
        },
        {
          "name": "Tyler Herro",
          "yahooAdp": 68.8,
          "yahooPreRank": 48,
          "note": "Herro's 91.7% free throws and 2.5 threes add shooting to a Miami-to-Milwaukee role change. He played only 33 games last season and steals remain thin, so take him when your first five picks have a durable defensive base."
        }
      ]
    },
    {
      "round": 7,
      "candidates": [
        {
          "name": "Mikal Bridges",
          "yahooAdp": 79.6,
          "yahooPreRank": 41,
          "note": "Bridges played all 82 games, shot 49.0% and added 1.3 steals with only 1.0 turnover. That clean line is valuable after taking two high-usage stars, even if his 14.4 points are not a category anchor."
        },
        {
          "name": "Payton Pritchard",
          "yahooAdp": 79.6,
          "yahooPreRank": 33,
          "note": "His 5.2 assists, 2.7 threes and 1.4 turnovers give you late guard help without a percentage punt. The 79-game workload makes him safer than the similarly priced injury-return options."
        },
        {
          "name": "De'Aaron Fox",
          "yahooAdp": 80.1,
          "yahooPreRank": 85,
          "note": "Fox's 48.6% shooting and 6.2 assists can steady a team whose first guards were less efficient. He gives up FT% impact relative to Pritchard, so the pick works best when earlier selections already secured the line."
        }
      ]
    },
    {
      "round": 8,
      "candidates": [
        {
          "name": "Josh Hart",
          "yahooAdp": 96.3,
          "yahooPreRank": 68,
          "note": "Seven-plus rebounds and 4.8 assists from a wing are exactly the out-of-position categories this build needs. He shot 50.8%, but 72.0% free throws mean a team chasing FT% should check how much volume it already has."
        },
        {
          "name": "Jaden McDaniels",
          "yahooAdp": 89.2,
          "yahooPreRank": 43,
          "note": "McDaniels' 51.5% FG and 1.1 steals are more useful here than his one block, which the build leaves behind. He offers efficient wing scoring when a roster already has its main assists source."
        },
        {
          "name": "Norman Powell",
          "yahooAdp": 92.4,
          "yahooPreRank": 115,
          "note": "Powell's 21.7 points and 2.7 threes are available at a much later ADP than most scorers at that rate. Chicago signed him after his Miami season; light assists and boards mean he should finish an established core, not define it."
        }
      ]
    },
    {
      "round": 9,
      "candidates": [
        {
          "name": "Immanuel Quickley",
          "yahooAdp": 97,
          "yahooPreRank": 69,
          "note": "Quickley gave Toronto 5.9 assists and 2.5 threes with only 1.5 turnovers. Kawhi's arrival may trim creation, but this is a useful ninth-round guard if your early stars pushed turnovers up."
        },
        {
          "name": "CJ McCollum",
          "yahooAdp": 108.3,
          "yahooPreRank": 111,
          "note": "McCollum still produced 18.7 points and 2.5 threes before re-signing with Atlanta. The 3.9 assists are a supplement rather than a rescue plan; use him when you already have two strong passers."
        },
        {
          "name": "Andrew Wiggins",
          "yahooAdp": 100.7,
          "yahooPreRank": 103,
          "note": "Wiggins' 47.5% shooting, 2.0 threes and 1.1 steals can fill wing gaps without a severe percentage hit. You give up his one block in this build, so prioritize him for shooting and efficiency rather than the defensive ceiling."
        }
      ]
    },
    {
      "round": 10,
      "candidates": [
        {
          "name": "Ayo Dosunmu",
          "yahooAdp": 114.9,
          "yahooPreRank": 96,
          "note": "He shot 51.7% from the floor with 3.6 assists and only 1.4 turnovers, a clean late guard line. Minnesota's LaMelo addition clouds his minutes, so the price should remain late."
        },
        {
          "name": "Collin Gillespie",
          "yahooAdp": 120.8,
          "yahooPreRank": 100,
          "note": "Gillespie made 2.9 threes with 4.6 assists and 1.6 turnovers over 80 games. Phoenix's guard rotation is the limitation, but this is an inexpensive way to hold the perimeter categories together."
        },
        {
          "name": "Tre Jones",
          "yahooAdp": 116,
          "yahooPreRank": 156,
          "note": "Jones' 5.4 assists and 1.4 turnovers are a late fix if the roster still needs passing without another turnover hit. Chicago's rotation can shift, so draft the category profile rather than assuming every 2025-26 minute repeats."
        }
      ]
    },
    {
      "round": 11,
      "candidates": [
        {
          "name": "Saddiq Bey",
          "yahooAdp": 120.1,
          "yahooPreRank": 108,
          "note": "Bey's 17.7 points, 2.1 threes and only 0.9 turnovers offer useful late offense without spending a center slot. He does little in blocks, which costs this build nothing; his 5.6 boards are a welcome bonus."
        },
        {
          "name": "Cason Wallace",
          "yahooAdp": 118.2,
          "yahooPreRank": 76,
          "note": "Two steals and 0.9 turnovers can preserve a narrow defensive and ball-security edge after a high-usage start. His 8.6 points are too light to repair scoring, so use him only when that category is already secure."
        },
        {
          "name": "Julian Champagnie",
          "yahooAdp": 110.9,
          "yahooPreRank": 128,
          "note": "The 2.4 threes, 5.8 boards and 0.8 turnovers are a helpful final wing blend. Yahoo's ADP is clustered near pick 111, so treat him as a pick-100-to-130 target rather than assuming an exact eleventh-round fall."
        }
      ]
    },
    {
      "round": 12,
      "candidates": [
        {
          "name": "Donte DiVincenzo",
          "yahooAdp": null,
          "yahooPreRank": null,
          "note": "Three threes, 1.3 steals and 4.1 rebounds in 82 games are useful from an end-of-draft guard. Yahoo's dated ADP snapshot does not give him a reliable price, so confirm he is still available in your room."
        },
        {
          "name": "Moses Moody",
          "yahooAdp": null,
          "yahooPreRank": null,
          "note": "Moody's 2.5 threes and 0.9 turnovers offer a clean final shooting slot. His 60-game season and limited creation keep him a late complement rather than a fallback primary guard."
        },
        {
          "name": "Quentin Grimes",
          "yahooAdp": 120.4,
          "yahooPreRank": 129,
          "note": "Grimes' move to the Lakers places him beside Luka and Reaves, limiting the odds of a major usage jump. He can still add 13.4 points, 3.3 assists and 84.0% free throws if he remains in the rotation; take him only at the tail end of the draft."
        }
      ]
    }
  ],
  "faqs": [
    {
      "q": "Does punting blocks mean I lose rebounds too?",
      "a": "It can. The simplest guards-and-wings version often runs short of boards, so prioritize Towns or Bam early and add rebounding wings later. Compare your roster totals rather than assuming a strong guard core can fix the frontcourt categories."
    },
    {
      "q": "Is punt blocks good on Yahoo 9-cat?",
      "a": "Yes, when you keep at least five other categories competitive. Points, assists, threes, steals and FT% are natural targets, while rebounds, FG% and turnovers need deliberate picks."
    }
  ]
},

  // ---- Rankings ------------------------------------------------------------
  {
    slug: 'top-150',
    type: 'rankings',
    puntKey: null, // general draft board; punt-dependent players use their likely build price
    title: 'Top 150',
    season: CURRENT_GUIDE_SEASON,
    difficulty: 'Beginner',
    isPremium: false,
    tagline:
      '2026-27 nine-category draft ranks refreshed with corrected 2025-26 results. Punt-dependent players are priced for the build most likely to draft them.',
    strengths: [],
    weaknesses: [],

    // This guide renders the 2026-27 projection (config/top-150-2026-27.js),
    // refreshed against corrected 2025-26 results. `projection` switches
    // Guide.jsx to <ProjectionList>.
    // All 150 ranks and write-ups are public.
    projection: {},

    sections: [
      {
        id: 'strategy',
        heading: 'What this ranking is',
        body: [
          "This is a nine-category draft board: points, threes, rebounds, assists, steals, blocks, field-goal percentage, free-throw percentage and turnovers all matter. Most players are placed for their projected overall value. For a player whose realistic drafter will punt a category, the rank reflects what that build can pay. The order is an editorial 2026-27 projection, not a simulated stat line.",
          "Giannis is the clearest example. His free throws pull down a balanced nine-category valuation, but a manager drafting him in the first round is almost certainly building around that weakness. Read his rank as a punt-FT% price. The player notes identify similar cases and explain when a balanced roster should wait longer.",
        ],
      },
      {
        id: 'method',
        heading: 'How the projection was built',
        body: [
          "The baseline is corrected 2025-26 nine-category production from the same database that powers the rankings tool. I combined that value with Yahoo's standard public pre-rank, projected-season rank, current ADP and the previous 2026-27 projection. I then adjusted for minutes, usage, age, injury recovery, verified team moves and the best realistic punt fit for build-dependent players. Yahoo prices show the market; they are not forecasts of fantasy value.",
          "Field-goal and free-throw impact use makes and attempts, not percentage alone. Turnovers count too, so a high-volume creator can be valuable in points and assists while costing you a category. Each player's note names the season behind its exact numbers; the rank itself is the forward-looking call.",
          "Availability changes the order. A strong per-game line in a short season can still make a good pick, but the cost of missed games belongs in the draft decision. Players without a 2025-26 line use their earlier production with a larger uncertainty discount.",
        ],
      },
      {
        id: 'draft',
        heading: 'How to actually use it on draft day',
        body: [
          "Compare this projected rank with Yahoo ADP and pre-rank. A large gap can reveal a useful price, but check the player note before treating it as a bargain: health, a new team or a role change may explain the difference. ADP can move during camp, so the linked Yahoo pages are the source for the current draft room.",
          "As your roster takes shape, use category fit alongside the order. A punt-dependent player may be placed at his best-build price here; take him later if you are trying to win the category he gives away. A slightly lower-ranked player who supplies a category you can realistically win may help more than a duplicate source of points or threes.",
          "Once you know which category you are conceding, use the matching punt guide for the rest of the board. It removes that category from every player's calculation, which is more precise than this single list's selected build adjustments.",
        ],
      },
      {
        id: 'caveats',
        heading: 'What this list does not know',
        body: [
          "Team assignments and transaction notes were refreshed against NBA transaction reporting and Yahoo rosters on September 26, 2026. Later camp moves, depth-chart decisions and ADP shifts can change a projection quickly, so check the linked market pages when you draft. The incoming 2026 rookie class is excluded because there is no NBA category baseline yet.",
          "Injury returns have the widest range of outcomes. Tyrese Haliburton, Kyrie Irving and Damian Lillard have no 2025-26 season line here; their notes use verified 2024-25 numbers and identify the recovery risk. A blank prior-season stat row does not mean a zero projection.",
        ],
      },
    ],

    faqs: [
      {
        q: 'Are these projections or last season\'s rankings?',
        a: 'Projections for 2026-27. Corrected 2025-26 numbers are the historical baseline, while Yahoo draft prices and roster context inform forward-looking adjustments. The stat pills show actual prior-season results, not projected 2026-27 averages.',
      },
      {
        q: 'Should I just draft straight down this list?',
        a: 'Use the order with Yahoo ADP and your roster needs. Punt-dependent players are placed at a price their best build can justify; take them later if you are trying to win the category they give away.',
      },
      {
        q: 'Why is a big scorer ranked below a player who averages far fewer points?',
        a: 'The ranking weighs the whole category profile, expected availability and, for build-dependent players, the price a likely punt team can justify. A scorer may give value back through turnovers or shooting impact, while another player adds steals, blocks or efficient volume.',
      },
      {
        q: 'Does this work for 8-cat leagues?',
        a: 'Mostly. If your league drops turnovers, high-usage playmakers are worth more than they appear here — anyone whose write-up flags turnovers as the main cost should move up a round or so.',
      },
      {
        q: 'Why are there no rookies?',
        a: 'The incoming 2026 class has no NBA nine-category baseline yet. This edition covers established NBA players, including players who were rookies in 2025-26; evaluate the new class separately once preseason roles are clear.',
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
    // Freemium: six entries for anyone, all fifteen for anyone with an account.
    // Moved off the Draft Pass for 2026-27 because the punt guides now carry
    // the pass as originally intended (see PLANNED_GUIDES), and because these
    // two pages were the wrong thing to sell — they draw the draft-season
    // search intent ("fantasy basketball sleepers") but were converting nobody
    // at 1.5s average engagement. As a login gate they buy the one thing the
    // funnel is actually short of: accounts, created before the purchase
    // moment rather than during it.
    requiresLogin: true,
    tagline:
      'Fifteen players whose 2026-27 draft ranks beat their September Yahoo ADP, from early guards to late category values.',
    strengths: [],
    weaknesses: [],

    // Unranked write-up list (config/sleepers-busts-2026-27.js).
    playerNotes: {
      source: 'sleepers',
      accent: '#2e9e53',
      // Gated at 6 of 15 from the 2026-27 draft season on.
      //
      // Six public entries make this a useful list; a free account opens the
      // remaining nine write-ups.
      //
      // rosterBlock() in seo-content.js reads this number rather than copying
      // it, so the crawlable block ships exactly the six a logged-out visitor
      // sees, plus the "9 more with a Draft Pass" line. Never hand a crawler
      // the locked remainder — that is cloaking.
      freeLimit: 6,
      previewRows: 2,
      heading: 'The sleepers',
      lead:
        "Each name has a projected rank ahead of Yahoo ADP in the September 26 snapshot. The cards show ADP, Yahoo pre-rank, our rank and the corrected 2025-26 line; check the live draft room before acting.",
    },

    sections: [
      {
        id: 'strategy',
        heading: 'What a sleeper actually is',
        body: [
          "A sleeper is a player whose projected value exceeds the price at which Yahoo drafts are taking him. That can happen in round two as easily as round ten. The comparison here is between our 2026-27 rank, Yahoo ADP and Yahoo's public pre-rank; last season's category line and current role explain whether the gap is worth buying.",
          "Some gaps reflect healthy skepticism about missed games or a crowded rotation. Others persist because draft rooms lag behind a player's changed role or overlook categories such as steals, blocks and low turnovers. The notes identify the risk instead of treating every gap as a guaranteed bargain.",
        ],
      },
      {
        id: 'draft',
        heading: 'How to use this list',
        body: [
          "Target the Yahoo price shown on each card, adjusting to your room. Jamal Murray and Austin Reaves are early-round value calls; Jalen Suggs and Reed Sheppard are later category bets. Reaching to our rank erases much of the edge. Compare the player's best categories with the roster you have already built.",
          "Spread role and injury risk across your picks. A roster can carry one health gamble more easily than several, and a late-round breakout candidate is easier to replace if the minutes never arrive. Revisit the case during camp when rotations become clearer.",
        ],
      },
      {
        id: 'caveats',
        heading: 'What this list does not know',
        body: [
          "The Yahoo ADP and pre-rank values are a September 26, 2026 snapshot, not live prices. Camp injuries, trades and role decisions can close a value gap quickly. The 2025-26 stat line is historical evidence; our rank is a forward projection.",
        ],
      },
    ],

    faqs: [
      {
        q: 'How are these different from the top 150?',
        a: 'The top 150 projects 2026-27 value using corrected 2025-26 results as its statistical baseline. This list is about the gap between projected value and draft cost; a player may appear in both, but the lists answer different questions.',
      },
      {
        q: 'How many sleepers should I actually draft?',
        a: 'Take value where your room offers it. Several names here are early-round targets, while later options carry more role risk. Avoid stacking multiple injury or minutes bets in the same draft.',
      },
      {
        q: 'Why does Yahoo pre-rank sometimes disagree with ADP?',
        a: 'Pre-rank is Yahoo’s ordering; ADP measures where people actually draft. When the two diverge, the price you can usually pay is ADP, while pre-rank helps reveal what the platform already recognizes.',
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
    // Freemium, same reasoning as the sleepers list above.
    requiresLogin: true,
    tagline:
      'Twelve 2026-27 nine-category price fades where Yahoo ADP sits ahead of our projected rank, even after build fit.',
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
        "These are price objections, not predictions that good NBA players will fail. Each card compares September Yahoo ADP and pre-rank with our 2026-27 rank, then explains the category, role or availability risk behind the gap.",
    },

    sections: [
      {
        id: 'strategy',
        heading: 'What "bust" means here',
        body: [
          "A bust here is a player whose current draft price requires a better 2026-27 outcome than we are willing to project. The list includes stars who may still produce excellent stretches. The question is whether those stretches cover the pick you must spend to acquire them.",
          "These cases are driven by different risks: a high-volume percentage penalty, a new team with less available usage, a thin category line, or too few recent games to support the market price. Some players already receive a punt-friendly rank on our Top 150 and are still going too early on Yahoo.",
        ],
      },
      {
        id: 'draft',
        heading: 'How to use this list',
        body: [
          "Read the tag as the round where the price becomes easier to defend in a standard twelve-team league. A bust at Yahoo ADP can be a useful pick if your room lets him fall. Check the card's Yahoo pre-rank as well: it can differ sharply from where managers actually draft.",
          "A punt can help, but it does not fix missed games or a lost role. Our Top 150 already prices selected punt-dependent players for a likely build; the bust call is based on Yahoo ADP being higher still. Use the matching punt guide when you know your team's category plan.",
        ],
      },
      {
        id: 'caveats',
        heading: 'What this list does not know',
        body: [
          "Yahoo ADP and pre-rank are a September 26, 2026 snapshot, not live market data. A falling ADP can erase a bust case, while camp news can change a role or health assumption. The cards show corrected 2025-26 results beneath forward-looking analysis.",
        ],
      },
    ],

    faqs: [
      {
        q: 'Are you saying these players are bad?',
        a: 'No. The claim is about value at the September Yahoo ADP. A player can have a strong season and still return less than the pick costs.',
      },
      {
        q: 'Why can a punt-friendly player still be a bust?',
        a: 'The Top 150 already prices selected specialists for their likely punt build. A player remains a bust candidate when Yahoo ADP is higher than that favorable rank or when health and role risks still make the price too aggressive.',
      },
      {
        q: 'What if one of these players falls to me late?',
        a: 'Compare his new price with the wait-until round and your roster fit. Every bust case here is a price objection, so a large enough fall can make him a good pick.',
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
//   'login'   the whole guide renders, but only once you have an account
//   'partial' the page opens and then stops; the rest needs a Draft Pass
//   'premium' the guide is behind the pass outright
//
// The rule that matters: "Free" is reserved for guides where it is true of the
// entire page. A guide showing you the first six of fifteen is not free, and
// labelling it that way spends trust to save a word. 'login' costs no money but
// it is still a gate, so it gets its own badge rather than borrowing "Free".
//
// Order is significant: a guide flagged both premium and requiresLogin is a
// paid guide — money is the higher bar, and quoting the lower one would promise
// access the reader will not get.
export function guideAccess(guide) {
  if (guide.isPremium) return 'premium';
  if (guide.requiresLogin) return 'login';
  const limits = [guide.playerNotes, guide.projection, guide.board]
    .filter(Boolean)
    .map((x) => x.freeLimit);
  return limits.some((n) => Number.isFinite(n)) ? 'partial' : 'free';
}

// What actually opens a given guide. Kept next to guideAccess() so the tier and
// the key that unlocks it cannot drift: a 'login' guide must never be gated on
// a pass, and a paid guide must never open on a bare sign-in.
export function isGuideUnlocked(guide, { isSignedIn, hasDraftPass }) {
  return guideAccess(guide) === 'login' ? Boolean(isSignedIn) : Boolean(hasDraftPass);
}

// The class every gated region on a guide carries, and the selector quoted to
// Google in the paywalled-content markup (structured-data.js). It lives here
// rather than in either consumer because it has to mean the same thing in two
// places at once: if the DOM and the JSON-LD disagree about which part of the
// page is gated, the markup stops describing the page and starts misreporting
// it. Google accepts ONLY `.class` selectors here, so this must stay a bare
// class name with no element or attribute qualifiers.
export const GATED_CLASS = 'fgg-gated';
export const GATED_SELECTOR = `.${GATED_CLASS}`;

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
  // Teal rather than the plain-free green, so a reader can tell at a glance on
  // the hub which cards open on a click and which want an account first. Still
  // says "Free", because it is — the account is the price, and it is not money.
  login: { label: 'Free — sign in', color: '#16a085', locked: true },
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
      '2026-27 9-category projections based on corrected 2025-26 results, plus sleepers and busts whose projected value differs from draft cost.',
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
