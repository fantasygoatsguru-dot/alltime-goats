// Punt guides for 2026-27.
// Historical boards: corrected 2025-26 season values with the punted category removed.
// Editorial round targets: 2026-27 roles and Yahoo ADP/pre-rank snapshot of 2026-09-26.
// Player names match player_period_averages for the historical line and draft builder.

import { CONTENT_SEASON } from './season.js';

export const PUNT_FT = {
  "slug": "punt-ft",
  "type": "punt",
  "puntKey": "ft",
  "title": "Punt FT%",
  "season": CONTENT_SEASON,
  "difficulty": "Beginner",
  "isPremium": true,
  "tagline": "Use the free-throw discount on elite bigs, then buy the threes, assists and steals needed to finish the build.",
  "strengths": [
    "fg",
    "reb",
    "blk",
    "pts"
  ],
  "weaknesses": [
    "ft",
    "3pm",
    "ast",
    "to"
  ],
  "freeSections": 2,
  "board": {
    "minGames": 30,
    "freeLimit": 20,
    "previewRows": 4
  },
  "sections": [
    {
      "id": "strategy",
      "heading": "The strategy",
      "body": [
        "Punt FT% starts with a player whose volume at the line makes a balanced roster difficult. Giannis is the clearest 2026-27 case: he averaged 27.6 points on 62.4% shooting but made 65.0% of his free throws on 9.9 attempts. His move to Miami adds a new frontcourt partnership with Bam Adebayo; the scoring and FG% case is still strong, but the exact usage split is a projection rather than last year's fact.",
        "This build should make rebounds, FG% and blocks easier to win, but none is automatic. A roster full of centers can still lose the weekly matchup when threes, assists and steals are neglected, and high-usage bigs can pile up turnovers. Use the discount to secure frontcourt strengths, then spend real draft capital on guard categories."
      ]
    },
    {
      "id": "correlation",
      "heading": "Natural strengths & weaknesses",
      "body": [
        "The strongest punt-FT% bigs bring efficient scoring and boards; some, such as Mobley and Clingan, also supply blocks. Giannis and Zion provide FG% and points without many threes, while Sengun adds 6.2 assists from center. Because these profiles differ, do not treat every low-FT player as interchangeable: choose the categories your first pick did not cover.",
        "Threes are the usual pressure point, followed by assists and sometimes steals. A second-round Murray or a fourth-round Murphy can supply shooting without weakening the frontcourt, while Castle, Daniels and other later guards can address creation or defense. Turnovers are the ninth-category trap: Giannis, Sengun and Castle together would put heavy pressure on that column unless later picks are unusually secure."
      ]
    },
    {
      "id": "draft",
      "heading": "Where the value sits in the draft",
      "body": [
        "Yahoo ADP already puts Giannis near pick eight, so this is not a build that can wait for him to fall into round three. Sengun and Amen usually cost a second-rounder; Mobley and Duren are third-round prices. Use those early prices to choose a core, then target the guards and shooting forwards who keep the team from turning into a double- or triple-punt.",
        "The table below removes FT% from corrected 2025-26 production. Treat it as a record of last season's category value, not a 2026-27 forecast. The round targets account for the September 26 Yahoo ADP and pre-rank snapshot and for current roles, with a caution that the late ADP pool is tightly clustered near pick 120 and individual rooms will differ."
      ]
    }
  ],
  "buildingBlocks": [
    {
      "name": "A genuine punt anchor",
      "note": "Giannis or another high-volume free-throw drag makes the category concession worth the opportunity cost."
    },
    {
      "name": "Frontcourt category base",
      "note": "Choose bigs whose rebounds, FG% and blocks complement the first pick rather than merely duplicating it."
    },
    {
      "name": "Bought perimeter production",
      "note": "Add threes, assists and steals before the late rounds, and keep turnovers in view."
    }
  ],
  "exampleTeams": [
    {
      "name": "Giannis with defensive guard depth",
      "color": "#2f80ed",
      "note": "A realistic eight-pick path by Yahoo price: Castle and Daniels protect assists, while Chet and Clingan cover blocks. Murray and Edgecombe provide some threes, but these eight players combined for only 9.6 threes per game in 2025-26, making shooting the next priority.",
      "roster": [
        "Giannis Antetokounmpo",
        "Jamal Murray",
        "Chet Holmgren",
        "Donovan Clingan",
        "Stephon Castle",
        "Dyson Daniels",
        "VJ Edgecombe",
        "Ausar Thompson"
      ]
    },
    {
      "name": "Luka with frontcourt efficiency",
      "color": "#16a085",
      "note": "Luka supplies points, threes and assists; Sengun, Mobley and Clingan create a strong big-man base. The turnover total is the danger, so this is a punt-FT% roster that may need to concede turnovers or choose cleaner later guards.",
      "roster": [
        "Luka Dončić",
        "Alperen Sengun",
        "Evan Mobley",
        "Donovan Clingan",
        "Desmond Bane",
        "Dyson Daniels",
        "De'Aaron Fox",
        "Jaden McDaniels"
      ]
    }
  ],
  "roundTargets": [
    {
      "round": 1,
      "candidates": [
        {
          "name": "Giannis Antetokounmpo",
          "yahooAdp": 7.8,
          "yahooPreRank": 50,
          "note": "This rank assumes the FT% punt from the opening pick. Giannis gave 27.6 points and 9.8 boards on 62.4% shooting while making 65.0% of 9.9 free throws; Miami's new pairing with Bam adds usage uncertainty, but his scoring and FG% remain the anchor. Plan to buy threes soon."
        },
        {
          "name": "Nikola Jokić",
          "yahooAdp": 1.9,
          "yahooPreRank": 1,
          "note": "Jokić's 10.7 assists and 12.9 rebounds make every roster build easier, even though punting his positive FT% impact wastes a strength. If he is there at the top, take the best player and decide whether the free-throw punt is still the right plan after round two."
        },
        {
          "name": "Luka Dončić",
          "yahooAdp": 3.5,
          "yahooPreRank": 5,
          "note": "Luka's 33.4 points, 4.0 threes and 8.2 assists cover the guard categories most punt-FT teams struggle to buy. His four turnovers and 78.0% free throws make the build plausible, but you will still need big-man FG% and blocks soon."
        }
      ]
    },
    {
      "round": 2,
      "candidates": [
        {
          "name": "Alperen Sengun",
          "yahooAdp": 18.4,
          "yahooPreRank": 57,
          "note": "Sengun is a second-round center who supplies 6.2 assists along with 8.9 boards and 20.4 points. His 69.1% free throws fit the punt, but 3.2 turnovers mean the next guard should be comparatively secure with the ball."
        },
        {
          "name": "Amen Thompson",
          "yahooAdp": 23.6,
          "yahooPreRank": 10,
          "note": "Amen's 7.8 rebounds, 5.3 assists and 1.5 steals from a guard spot make him a useful bridge between a Giannis start and the perimeter categories. The 0.3 threes are the obvious gap, and Fred VanVleet's return could reduce his time on the ball."
        },
        {
          "name": "Jamal Murray",
          "yahooAdp": 20.5,
          "yahooPreRank": 9,
          "note": "Murray is not a punt-specific pick, but 3.3 threes and 7.1 assists are exactly what a Giannis team must buy early. He played 75 games and kept turnovers at 2.3, making him a cleaner second creator than another poor-shooting big."
        }
      ]
    },
    {
      "round": 3,
      "candidates": [
        {
          "name": "Evan Mobley",
          "yahooAdp": 30,
          "yahooPreRank": 45,
          "note": "Mobley's 60.6% free throws came with 9.0 rebounds, 1.7 blocks and 54.6% shooting. That is a strong third-round punt-FT% big, though pairing him with Giannis still leaves threes and high-end assists to address."
        },
        {
          "name": "Jalen Duren",
          "yahooAdp": 36,
          "yahooPreRank": 28,
          "note": "Duren shot 65.0% from the floor and averaged 19.5 points with 10.5 boards. The 74.7% free throws matter less here, but zero threes mean your second and fourth picks should supply shooting."
        },
        {
          "name": "Chet Holmgren",
          "yahooAdp": 27.7,
          "yahooPreRank": 19,
          "note": "Chet's 1.9 blocks and 8.9 boards solidify the frontcourt without the severe turnover cost some other bigs carry. His 79.2% free throws are not the reason to select him; the 1.3 threes and defensive ceiling make him easier to fit beside Giannis than another non-shooter."
        }
      ]
    },
    {
      "round": 4,
      "candidates": [
        {
          "name": "Donovan Clingan",
          "yahooAdp": 41.6,
          "yahooPreRank": 29,
          "note": "His 11.5 rebounds and 1.7 blocks came over 77 games, a stronger availability base than many centers at this price. Clingan's 69.2% free throws fit the punt, but 12.1 points and 1.1 threes mean you need perimeter scoring and shooting elsewhere."
        },
        {
          "name": "LeBron James",
          "yahooAdp": 38.3,
          "yahooPreRank": 92,
          "note": "LeBron's 7.1 assists and 20.6 points can protect guard categories from a forward slot, while 73.5% free throws do little harm here. He is now in Philadelphia with Maxey and Brown, and age makes the 2025-26 usage a poor automatic forecast."
        },
        {
          "name": "Trey Murphy III",
          "yahooAdp": 40.1,
          "yahooPreRank": 21,
          "note": "A Giannis or Mobley start often needs this kind of fourth-round player: Murphy made 3.2 threes, scored 21.5 points and added 1.5 steals. His excellent FT% is value the build gives away, but the shooting and defense are still worth buying at the market price."
        }
      ]
    },
    {
      "round": 5,
      "candidates": [
        {
          "name": "Pascal Siakam",
          "yahooAdp": 49.3,
          "yahooPreRank": 79,
          "note": "Siakam's 24.0 points and 6.6 boards came with 69.3% free throws on 6.1 attempts, a meaningful discount in this build. Haliburton's return should reduce some offensive burden, so use him for efficient forward scoring rather than counting on the same usage."
        },
        {
          "name": "Stephon Castle",
          "yahooAdp": 54.4,
          "yahooPreRank": 81,
          "note": "The 7.4 assists and 5.3 boards from a guard help balance a big-heavy start. His 73.4% free throws are easier to accept here, but 3.2 turnovers and 1.2 threes require later shooting and ball security."
        },
        {
          "name": "Onyeka Okongwu",
          "yahooAdp": 54.7,
          "yahooPreRank": 36,
          "note": "Okongwu's 1.9 threes and 1.1 blocks give you the spacing many low-FT bigs lack. His 75.7% line is a modest punt benefit; 48.0% FG is the category cost to weigh against the useful steals and passing."
        }
      ]
    },
    {
      "round": 6,
      "candidates": [
        {
          "name": "Dyson Daniels",
          "yahooAdp": 62.9,
          "yahooPreRank": 20,
          "note": "Daniels adds 2.0 steals, 6.8 rebounds and 5.9 assists, the latter two especially helpful around a Giannis frontcourt. The 61.5% free throws are harmless here, but 0.3 threes make another shooter a priority."
        },
        {
          "name": "Zion Williamson",
          "yahooAdp": 69.7,
          "yahooPreRank": 107,
          "note": "Zion's 21.0 points on 60.0% shooting are valuable when his 71.6% free throws no longer count. He gives almost no threes and little shot blocking, so take him only if earlier picks already protect those categories and your roster can carry his health risk."
        },
        {
          "name": "Tyler Herro",
          "yahooAdp": 68.8,
          "yahooPreRank": 48,
          "note": "Herro's 2.5 threes and 20.5 points can rescue a low-shooting start; his 91.7% free throws are simply unused value in this build. Milwaukee acquired him in the Giannis deal, and a 33-game season means the role upside comes with real availability risk."
        }
      ]
    },
    {
      "round": 7,
      "candidates": [
        {
          "name": "Kel'el Ware",
          "yahooAdp": 73.2,
          "yahooPreRank": 51,
          "note": "Ware's 9.0 boards, 1.1 blocks and 1.2 threes can support a frontcourt without completely abandoning spacing. Miami sent him to Milwaukee in the Giannis trade; the new rotation must be checked before assuming more than last year's 22-minute role."
        },
        {
          "name": "De'Aaron Fox",
          "yahooAdp": 80.1,
          "yahooPreRank": 85,
          "note": "Fox gives a punt-FT team 6.2 assists and 1.8 threes without the massive FG% cost of some late guards. His 76.0% free throws are less of a concern here, but he must share creation with Castle and Wembanyama in San Antonio."
        },
        {
          "name": "VJ Edgecombe",
          "yahooAdp": 74.7,
          "yahooPreRank": 31,
          "note": "The rookie supplied 16.0 points, 2.0 threes, 4.2 assists and 1.4 steals, a helpful guard blend after several frontcourt picks. Philadelphia's new Brown-and-LeBron lineup makes his next role harder to project, so treat the seventh-round price as an upside bet."
        }
      ]
    },
    {
      "round": 8,
      "candidates": [
        {
          "name": "Ausar Thompson",
          "yahooAdp": 88.5,
          "yahooPreRank": 83,
          "note": "Ausar's 2.0 steals, 0.9 blocks and 52.5% shooting are a strong defensive payoff once his 57.1% free throws stop counting. His 0.1 threes and 9.9 points are not rescued by the punt, so draft him after securing perimeter offense."
        },
        {
          "name": "Nic Claxton",
          "yahooAdp": 90.1,
          "yahooPreRank": 105,
          "note": "The 61.6% free throws no longer punish his 3.7 assists, 1.1 blocks and 57.1% shooting. Chicago acquired him from Brooklyn; the rotation with its other frontcourt pieces is the key to whether his eighth-round price pays off."
        },
        {
          "name": "Jaden McDaniels",
          "yahooAdp": 89.2,
          "yahooPreRank": 43,
          "note": "McDaniels shot 51.5% while giving 1.1 steals, 1.0 blocks and 1.4 threes. He is not a FT% discount play, but that balanced wing line can prevent a frontcourt-heavy roster from becoming dependent on one category."
        }
      ]
    },
    {
      "round": 9,
      "candidates": [
        {
          "name": "Myles Turner",
          "yahooAdp": 100.3,
          "yahooPreRank": 109,
          "note": "Turner's 2.1 threes and 1.6 blocks are an unusually useful pair for this build. He shot only 44.0% from the field after moving to Milwaukee, so he belongs beside strong FG% bigs rather than on a roster already slipping there."
        },
        {
          "name": "Isaiah Hartenstein",
          "yahooAdp": 105.4,
          "yahooPreRank": 141,
          "note": "Hartenstein's 9.4 rebounds, 3.5 assists and 62.2% shooting help in three categories while his 61.0% free throws disappear from the calculation. Forty-seven games and Oklahoma City's changing frontcourt are reasons to avoid treating the old minutes as guaranteed."
        },
        {
          "name": "Daniel Gafford",
          "yahooAdp": 107.9,
          "yahooPreRank": 191,
          "note": "Gafford's 65.5% shooting and 1.3 blocks come at a late price, with 68.3% free throws you can ignore. His 6.9 boards and Dallas rotation make him a category piece rather than a complete late center."
        }
      ]
    },
    {
      "round": 10,
      "candidates": [
        {
          "name": "Jusuf Nurkić",
          "yahooAdp": 112.8,
          "yahooPreRank": null,
          "note": "Nurkić gave Utah 10.4 rebounds and 4.8 assists from center, unusually useful passing this late. The 54.9% free throws are waived here, but 41 games and a crowded Jazz frontcourt keep the pick speculative."
        },
        {
          "name": "P.J. Washington",
          "yahooAdp": 115.8,
          "yahooPreRank": 178,
          "note": "Washington brings 7.0 boards, 1.1 blocks and 1.4 threes while 68.7% free throws stop mattering. His 45.0% FG is the real build cost, so pair him with Giannis or another strong efficiency anchor."
        },
        {
          "name": "Neemias Queta",
          "yahooAdp": 115.2,
          "yahooPreRank": 116,
          "note": "Queta's 65.3% shooting, 8.4 rebounds and 1.3 blocks came over 76 games. Boston added Mitchell Robinson, which makes the minutes less certain, but the tenth-round price is a reasonable bet on a usable frontcourt role."
        }
      ]
    },
    {
      "round": 11,
      "candidates": [
        {
          "name": "Cason Wallace",
          "yahooAdp": 118.2,
          "yahooPreRank": 76,
          "note": "Two steals and 0.9 turnovers can repair a defensive or ball-security gap without another high-usage guard. He scored only 8.6 points, so he must be a final category piece rather than the source of offense your first rounds missed."
        },
        {
          "name": "Saddiq Bey",
          "yahooAdp": 120.1,
          "yahooPreRank": 108,
          "note": "Bey's 2.1 threes and 17.7 points help a punt-FT team that spent early picks on non-shooting bigs. His 0.9 turnovers and 5.6 boards make him a cleaner late wing than the scoring average alone suggests."
        },
        {
          "name": "Tre Jones",
          "yahooAdp": 116,
          "yahooPreRank": 156,
          "note": "Jones' 5.4 assists with 1.4 turnovers are a useful late antidote to a Giannis-Sengun-Castle type start. He is not a punt specialist, but a final guard who protects the build's weak passing and turnover columns."
        }
      ]
    },
    {
      "round": 12,
      "candidates": [
        {
          "name": "Jay Huff",
          "yahooAdp": null,
          "yahooPreRank": null,
          "note": "Huff's 1.9 blocks and 1.5 threes over 82 games are a rare last-pick combination. Indiana's addition of Zubac may trim his minutes, so verify the rotation rather than assuming those rates will come with the same workload."
        },
        {
          "name": "Donte DiVincenzo",
          "yahooAdp": null,
          "yahooPreRank": null,
          "note": "Three threes and 1.3 steals can give this build badly needed perimeter volume at the end. The dated Yahoo snapshot has no reliable ADP for him, so take the value only if he actually reaches your late pick."
        },
        {
          "name": "Moses Moody",
          "yahooAdp": null,
          "yahooPreRank": null,
          "note": "Moody made 2.5 threes with only 0.9 turnovers, a clean final shooting slot for a frontcourt-heavy team. The 60-game season and modest assists limit him to a complementary role."
        }
      ]
    }
  ],
  "faqs": [
    {
      "q": "Is punt FT% a good strategy for a beginner?",
      "a": "It is easy to recognize the first-round anchor, but finishing the build takes discipline. Protect threes, assists and steals early enough that the frontcourt discount does not become a second or third punt."
    },
    {
      "q": "Do I have to avoid good free-throw shooters entirely?",
      "a": "No. You stop paying extra for FT% impact; a good shooter who brings scarce threes, assists or steals can still be the right pick."
    },
    {
      "q": "What usually kills a punt FT% team?",
      "a": "Too many low-three bigs and too little playmaking or defense from the guards. Turnovers can also become a hidden second punt if you stack several high-usage creators."
    },
    {
      "q": "Does punt FT% work in 8-cat leagues?",
      "a": "Yes. Removing turnovers helps high-usage players such as Giannis and Sengun, though the need for threes and guard depth remains."
    }
  ]
};

export const PUNT_ASSISTS = {
  slug: 'punt-assists',
  type: 'punt',
  puntKey: 'ast',
  title: 'Punt Assists',
  season: CONTENT_SEASON,
  difficulty: 'Intermediate',
  isPremium: true,
  tagline: 'Keep the points and defensive stats; stop paying for playmaking you will not use.',
  strengths: ['pts', 'reb', 'blk', 'to'],
  weaknesses: ['ast', 'stl', 'ft', '3pm'],
  freeSections: 2,
  board: { minGames: 30, freeLimit: 20, previewRows: 4 },
  sections: [
    {
      id: 'strategy',
      heading: 'The strategy',
      body: [
        'Punt assists is a nine-category plan for a roster whose best players score, rebound, defend and finish possessions without creating many shots for teammates. Victor Wembanyama is the cleanest opening: his 2025-26 line included 25.0 points, 11.5 rebounds and 3.1 blocks, but only 3.1 assists. Removing assists makes that already elite combination easier to build around; his first-pick price is justified by the full line, not by a supposed punt discount.',
        'The next picks should buy points and threes from wings while preserving enough FG%, FT% and steals to win at least five of the eight remaining categories. Anthony Edwards is another plausible first-round start, with 28.8 points and 3.4 threes, but his 79.6% free throws on volume and ordinary block production make his follow-up picks very different from Wembanyama\'s.'
      ]
    },
    {
      id: 'correlation',
      heading: 'Natural strengths & weaknesses',
      body: [
        'Centers and finishing forwards make rebounds, FG% and blocks accessible, while low-usage wings can keep turnovers down. That is a menu of possible strengths, not a promise that every punt-assists team wins all four. An Edwards start still needs blocks and boards; a Wembanyama-Clingan start has plenty of both but must buy perimeter scoring and steals elsewhere.',
        'The danger is drifting into a second punt. Traditional centers often give little in threes, and some also damage FT%. Gobert\'s 52.6% free throws make him an expensive fit if you still intend to win the line; Clingan\'s 69.2% is a smaller but real cost. Use shooting wings such as Murphy or Porter for threes, and defenders such as Anunoby or Wallace for steals. Low assists alone do not make a player a target: the other eight categories must justify his draft price.'
      ]
    },
    {
      id: 'draft',
      heading: 'Where the value sits in the draft',
      body: [
        'Yahoo\'s September 26 snapshot puts Wembanyama near pick two and Edwards near pick eight. Towns and Durant usually cost a second-round pick; Holmgren and Kawhi are third-round prices. Use the first three picks to establish points and either defensive big-man production or efficient shooting. Murphy, Porter and later three-point wings can fill the opposite side, but they cannot rescue a roster that has already given away FT% and steals.',
        'The board below removes assists from corrected 2025-26 production; it records last season rather than projecting 2026-27. The round targets use the dated Yahoo ADP and pre-rank snapshot, then account for role and availability. Treat the round labels as a draft queue, especially after pick 100 where the market is tightly packed.'
      ]
    }
  ],
  buildingBlocks: [
    { name: 'An anchor with real category weight', note: 'Wembanyama supplies blocks and boards; Edwards supplies points and threes. Draft the complement, not a copy of the first pick.' },
    { name: 'Scoring without an assist premium', note: 'Use wings such as Murphy, Porter and Powell for points and threes after securing the frontcourt.' },
    { name: 'Protected percentages and steals', note: 'Check FT% attempts and FG% volume, then add a genuine steals source before the late rounds.' }
  ],
  exampleTeams: [
    {
      name: 'Wembanyama with shooting wings',
      color: '#2f80ed',
      note: 'A roughly one-per-round eight-pick start by Yahoo price. Wembanyama and Holmgren carry blocks, while Murphy, Bane and Durant supply threes and points. Anunoby adds steals and Bridges keeps turnovers modest. Recheck steals and rebounds before filling the last roster spots; two elite shot blockers do not settle every category.',
      roster: ['Victor Wembanyama', 'Kevin Durant', 'Chet Holmgren', 'Trey Murphy III', 'Desmond Bane', 'OG Anunoby', 'Mikal Bridges', 'Norman Powell']
    },
    {
      name: 'Edwards with a defensive frontcourt',
      color: '#16a085',
      note: 'Edwards, Kawhi and Porter carry scoring while Towns, Clingan and Buzelis buy back boards and blocks. McDaniels adds steals and efficient wing shooting. Clingan\'s free throws and the health of Kawhi and Porter are the constraints; avoid another poor-FT big until the team radar says the line is safe.',
      roster: ['Anthony Edwards', 'Karl-Anthony Towns', 'Kawhi Leonard', 'Donovan Clingan', 'Michael Porter Jr.', 'Matas Buzelis', 'Mikal Bridges', 'Jaden McDaniels']
    }
  ],
  roundTargets: [
    { round: 1, candidates: [
      { name: 'Victor Wembanyama', yahooAdp: 1.6, yahooPreRank: 3, note: 'The 3.1 blocks, 11.5 boards and 25.0 points make Wembanyama a first-pick anchor even before the assist punt. His 3.1 assists become unused value, but the real benefit is freedom to take later scorers who do not pass. Add threes and steals around him.' },
      { name: 'Anthony Edwards', yahooAdp: 8.3, yahooPreRank: 6, note: 'Edwards gives 28.8 points and 3.4 threes without asking you to win assists. His 79.6% FT on volume can still hurt, so buy a strong free-throw source and a blocker in the next two rounds.' },
      { name: 'Jayson Tatum', yahooAdp: 9.8, yahooPreRank: 14, note: 'Ten rebounds and 2.9 threes in his 16-game return show a useful forward shape for this build. The post-Achilles sample is short; draft for the broader scoring and shooting possibility while pricing in uncertain availability.' }
    ] },
    { round: 2, candidates: [
      { name: 'Karl-Anthony Towns', yahooAdp: 15, yahooPreRank: 13, note: 'Towns offers 11.9 boards, threes and 85.8% free throws from a center slot. He is especially helpful after Edwards because he repairs frontcourt production without turning FT% into a second punt. His 2.5 turnovers are the tradeoff.' },
      { name: 'Kevin Durant', yahooAdp: 16.9, yahooPreRank: 27, note: 'Durant scored 26.0 points on 52.0% shooting and 87.4% free throws across 78 games. That is a strong percentages partner for Wembanyama or Edwards; add steals and rebounding next rather than expecting Durant to carry either.' },
      { name: 'Stephen Curry', yahooAdp: 23.9, yahooPreRank: 11, note: 'Curry supplies elite threes and FT% without requiring a team to chase his passing. Forty-three games last season make the late-second price a health bet. Pair him with a reliable rebounder and do not count on full-season volume.' }
    ] },
    { round: 3, candidates: [
      { name: 'Chet Holmgren', yahooAdp: 27.7, yahooPreRank: 19, note: 'His 1.9 blocks, 8.9 rebounds and 1.3 threes give you the defensive big who does not erase spacing. The 1.7 assists no longer hold the line back; his minutes in Oklahoma City still limit the volume ceiling.' },
      { name: 'Kawhi Leonard', yahooAdp: 29.3, yahooPreRank: 15, note: 'Kawhi brought 27.5 points and 1.8 steals in 65 games, solving two columns a big-heavy opening can miss. His Toronto role after the September trade is new, and age makes another 65-game season uncertain.' },
      { name: 'Jaylen Brown', yahooAdp: 27.5, yahooPreRank: 95, note: 'Brown\'s 28.5 points and 6.9 boards are useful from a wing once assists disappear. Philadelphia has more mouths to feed than last year\'s Boston lineup; treat the old scoring rate as a ceiling, not a settled forecast.' }
    ] },
    { round: 4, candidates: [
      { name: 'Trey Murphy III', yahooAdp: 40.1, yahooPreRank: 21, note: 'Murphy made 3.2 threes, scored 21.5 points and added 1.5 steals. He is the clean perimeter complement to an early Wembanyama or Clingan pick, though his strong FT% should be preserved rather than wasted beside several poor-FT centers.' },
      { name: 'Lauri Markkanen', yahooAdp: 38.7, yahooPreRank: 18, note: 'Markkanen gives 26.6 points, useful threes and 89.6% free throws while his 2.1 assists stop mattering. Forty-two games and Utah\'s changed frontcourt make this a price-sensitive upside pick; do not rely on him alone for scoring volume.' },
      { name: 'Donovan Clingan', yahooAdp: 41.6, yahooPreRank: 29, note: 'Clingan\'s 11.5 rebounds and 1.7 blocks over 77 games can secure the frontcourt early. His 69.2% free throws and modest points mean he works best after a strong shooting and scoring start, not beside another FT% drag.' }
    ] },
    { round: 5, candidates: [
      { name: 'Jaren Jackson Jr.', yahooAdp: 50.5, yahooPreRank: 54, note: 'Jackson offers blocks and scoring from a forward slot, a useful bridge when early picks bought threes. His 1.4 blocks were below his old peak, and Utah\'s frontcourt is crowded; do not pay for a return to his best defensive season.' },
      { name: 'Michael Porter Jr.', yahooAdp: 59.6, yahooPreRank: 55, note: 'Porter supplied 24.2 points, 3.4 threes and 7.1 boards in Brooklyn, with only three assists to give away. Fifty-two games and a changing Nets frontcourt make the fifth-round cost attractive but far from certain.' },
      { name: 'Nickeil Alexander-Walker', yahooAdp: 60.1, yahooPreRank: 24, note: 'His 20.8 points, 3.2 threes and 90.2% free throws over 81 games can balance a big-heavy start. He is a better fit when your first four picks already bought rebounds and blocks; draft the scoring role rather than expecting lead-guard assists.' }
    ] },
    { round: 6, candidates: [
      { name: 'Desmond Bane', yahooAdp: 52.9, yahooPreRank: 44, note: 'Bane played 82 games, scored 20.1 points and shot 90.2% at the line. A team carrying Clingan\'s FT% can use him to protect that category; he adds threes without forcing another high-turnover creator.' },
      { name: 'Matas Buzelis', yahooAdp: 61.9, yahooPreRank: 34, note: 'The 2.2 threes and 1.5 blocks are a rare forward combination. His next step depends on Chicago\'s role distribution, so buy the existing shooting-and-block profile and treat a scoring leap as upside.' },
      { name: 'OG Anunoby', yahooAdp: 66.6, yahooPreRank: 60, note: 'Anunoby adds 1.6 steals and 2.3 threes without needing the ball. He fills a common punt-assists hole after a center-heavy start, with 67 games providing a sturdier availability base than several other wings in this range.' }
    ] },
    { round: 7, candidates: [
      { name: 'Naz Reid', yahooAdp: 62.5, yahooPreRank: 53, note: 'Reid brings threes, rebounds and blocks from the frontcourt. Charlotte offers a new route to minutes, but his precise role is still uncertain; use him when your roster needs spacing and defense from the same slot.' },
      { name: 'Mikal Bridges', yahooAdp: 79.6, yahooPreRank: 41, note: 'Bridges played all 82 games, shot 49.0% and contributed threes, steals and low turnovers. The 14.4 points do not make him a scorer to build around, but his clean wing line complements higher-volume early picks.' },
      { name: 'Kel\'el Ware', yahooAdp: 73.2, yahooPreRank: 51, note: 'Ware posted nine rebounds, 1.1 blocks and 1.2 threes. Milwaukee\'s rotation after the Giannis trade is a projection, so this is a bet on a useful category mix rather than guaranteed extra minutes.' }
    ] },
    { round: 8, candidates: [
      { name: 'Jaden McDaniels', yahooAdp: 89.2, yahooPreRank: 43, note: 'McDaniels gave 1.1 steals, 1.0 blocks and 51.5% shooting while contributing 14.8 points. He is a clean wing defender after an Edwards start; Minnesota\'s new guard rotation could change his shots.' },
      { name: 'Norman Powell', yahooAdp: 92.4, yahooPreRank: 115, note: 'Powell\'s 21.7 points and 2.7 threes are unusually available at this price, and the light assists cost nothing here. Chicago is a new scoring context, so draft him to finish an established team rather than to carry its first offensive category.' },
      { name: 'Jabari Smith Jr.', yahooAdp: 94.1, yahooPreRank: 84, note: 'Smith made 2.3 threes and grabbed 6.9 boards over 77 games. He fits when early scorers left the forward slots thin on rebounding; Houston\'s crowded frontcourt limits how much more to project.' }
    ] },
    { round: 9, candidates: [
      { name: 'Andrew Wiggins', yahooAdp: 100.7, yahooPreRank: 103, note: 'Wiggins gives two threes, a steal and a block from the wing. His 47.5% shooting is manageable beside an efficient big, but Giannis\' arrival in Miami makes the old scoring share uncertain.' },
      { name: 'Myles Turner', yahooAdp: 100.3, yahooPreRank: 109, note: 'Turner still supplied 2.1 threes and 1.6 blocks, a rare late-center pair. His 44.0% FG and 5.3 rebounds are real costs; take him after FG% and boards are secure, not as a substitute for them.' },
      { name: 'Toumani Camara', yahooAdp: 110.1, yahooPreRank: 98, note: 'Camara played 82 games and made 2.6 threes with 5.1 rebounds. His 70.7% free throws can pull down an otherwise clean punt-assists build, so check attempts and roster impact before paying for the shooting.' }
    ] },
    { round: 10, candidates: [
      { name: 'Cason Wallace', yahooAdp: 118.2, yahooPreRank: 76, note: 'Two steals and just 0.9 turnovers make Wallace useful when the first nine picks already secured points. His 8.6 points cannot rescue offense, but the 2.6 assists are no longer a reason to pass on him.' },
      { name: 'Saddiq Bey', yahooAdp: 120.1, yahooPreRank: 108, note: 'Bey gave 17.7 points, 2.1 threes, 5.6 boards and 0.9 turnovers in 72 games. Limited defensive stats mean he belongs on a roster that already has steals and blocks.' },
      { name: 'Devin Vassell', yahooAdp: 116.5, yahooPreRank: 122, note: 'Vassell made 2.5 threes with fewer than one turnover per game, useful final shooting without a playmaking premium. His thin steals mean the category needs another source earlier.' }
    ] },
    { round: 11, candidates: [
      { name: 'P.J. Washington', yahooAdp: 115.8, yahooPreRank: 178, note: 'Washington adds seven boards, a steal and a block from forward, useful defensive insurance after several shooting wings. His 45.0% FG is a poor fit if your first centers were already inefficient.' },
      { name: 'Julian Champagnie', yahooAdp: 110.9, yahooPreRank: 128, note: 'Champagnie supplied 2.4 threes and 5.8 boards in 82 games with modest usage. He is a late shooting-and-rebounding piece; the clustered Yahoo market can push him a round earlier.' },
      { name: 'Neemias Queta', yahooAdp: 115.2, yahooPreRank: 116, note: 'Queta shot 65.3% with 8.4 boards and 1.3 blocks over 76 games. His zero threes and 70.3% FT create pressure elsewhere, so take him only if shooting and the line can absorb it.' }
    ] },
    { round: 12, candidates: [
      { name: 'Moses Moody', yahooAdp: null, yahooPreRank: null, note: 'Moody made 2.5 threes with 0.9 turnovers and little creation, exactly the clean wing shape this build can use. His 60 games and Golden State\'s crowded rotation make him an end-of-draft option, not a volume guarantee.' },
      { name: 'Jay Huff', yahooAdp: null, yahooPreRank: null, note: 'Huff paired 1.9 blocks with 1.5 threes across 82 games. Indiana\'s addition of Zubac threatens his minutes, so take him only when the late price and your block need justify that role risk.' },
      { name: 'Dillon Brooks', yahooAdp: 114.9, yahooPreRank: 171, note: 'Brooks scored 20.2 points and made 2.3 threes with only 1.8 assists, but 43.5% shooting can undo the benefit. Draft him after a strong FG% base and only if you still need points.' }
    ] }
  ],
  faqs: [
    { q: 'Does punt assists mean I should draft only bigs?', a: 'No. A big-heavy team can lose threes, steals and FT%. Use low-assist scoring wings and defenders to keep those columns competitive.' },
    { q: 'Should I avoid every good passer?', a: 'No. Wembanyama and Towns remain valuable even when some assists are discarded. Pay for the categories a player still wins; do not spend an early pick mainly for passing.' },
    { q: 'What is the most common second punt?', a: 'FT% is the main risk when several traditional centers are paired. Threes or steals can also slip away if every later pick is another rebounder.' },
    { q: 'Does this work in eight-category leagues?', a: 'Yes, but turnovers disappear, taking away one of the natural benefits of low-usage players. Recheck the seven remaining category strengths before assuming the same targets are discounted.' }
  ]
};

export const PUNT_GUIDES = [PUNT_FT, PUNT_ASSISTS];
