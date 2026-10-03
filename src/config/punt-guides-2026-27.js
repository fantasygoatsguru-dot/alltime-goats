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

export const PUNT_FG = {
  slug: 'punt-fg',
  type: 'punt',
  puntKey: 'fg',
  title: 'Punt FG%',
  season: CONTENT_SEASON,
  difficulty: 'Intermediate',
  isPremium: true,
  tagline: 'Turn high-volume guard shooting into points, threes and assists without sacrificing the line or defense.',
  strengths: ['pts', '3pm', 'ast', 'ft'],
  weaknesses: ['fg', 'reb', 'blk', 'to'],
  freeSections: 2,
  board: { minGames: 30, freeLimit: 20, previewRows: 4 },
  sections: [
    {
      id: 'strategy',
      heading: 'The strategy',
      body: [
        'Punt FG% gives high-volume shooters a fairer price by removing the damage their misses do to one category. Luka Dončić is a plausible first-round anchor: his corrected 2025-26 line delivered 33.4 points, 4.0 threes, 7.7 rebounds and 8.2 assists, while his 4.0 turnovers still count. The punt does not excuse the rest of the line. It works best when the first pick gives enough scoring and creation to spend later picks on rebounds, blocks and ball security.',
        'LaMelo Ball shows the percentage discount: 3.8 threes and 7.1 assists came with 40.7% shooting. But Yahoo drafts him near pick 26 while our Top 150 places him 48th, reflecting his new shared backcourt in Minnesota. The punt improves his category fit without making a second-round reach sensible. Look for a price closer to the third round, then add defenders who do not need another high-usage guard spot.'
      ]
    },
    {
      id: 'correlation',
      heading: 'Natural strengths & weaknesses',
      body: [
        'Points, threes, assists and FT% are accessible when early picks favor perimeter scorers. None comes automatically: a low-FG defensive specialist does not replace an elite scorer, and a poor-FT guard can undo the line even if his shooting from the floor no longer matters. Derrick White is especially useful because his 39.5% FG is waived while 2.7 threes, 5.4 assists and 1.3 blocks remain.',
        'Rebounds and blocks are the structural test. Holmgren or a mid-round Buzelis can add blocks without giving up all your threes; Hart supplies rebounds from a wing. Turner gives 1.6 blocks and 2.1 threes at a late price, but only 5.3 rebounds. The other trap is turnovers: stacking Luka, LaMelo and Harden can make a second punt more likely than eight competitive categories. Check the whole roster before buying another creator.'
      ]
    },
    {
      id: 'draft',
      heading: 'Where the value sits in the draft',
      body: [
        'The September 26 Yahoo ADP puts Luka near pick four, Maxey and Edwards in the first round, Harden near 35 and White near 47. Our Top 150 has Harden 26th and White 29th, so neither belongs in a guide that asks you to wait until round five. Conversely, Trae is 55th on our board at a Yahoo price near 27, and LaMelo is 48th at a Yahoo price near 26; an FG% punt alone is not a reason to pay those second-to-third-round prices.',
        'The board below removes FG% from corrected 2025-26 production. It records what players produced, not their projected 2026-27 value. The targets use our Top 150 for the forward-looking case, a September 26 Yahoo ADP snapshot for draft cost, and Yahoo standard pre-ranks checked October 2. Round labels describe a price window, not a promise that a player will fall; after pick 100, use your room and roster needs rather than an exact number.'
      ]
    }
  ],
  buildingBlocks: [
    { name: 'One primary creator', note: 'Secure points, threes and assists without stacking several four-turnover players.' },
    { name: 'Defense from unusual slots', note: 'White can add blocks from guard; Holmgren, Buzelis or Turner combine rim protection with shooting.' },
    { name: 'Boards and free throws kept intact', note: 'Add a rebounding wing or center while checking FT% attempts, then monitor turnovers after each creator.' }
  ],
  exampleTeams: [
    {
      name: 'Luka with out-of-position blocks',
      color: '#8e44ad',
      note: 'A 12-team snake path from roughly pick four: the next turns land near 21, 28, 45, 52, 69, 76 and 93. Curry, Holmgren, White and Jackson are plausible at those prices, while Anunoby and Hart need small slips. White and Holmgren supply blocks and Hart adds wing boards. Luka and Curry make turnovers the eighth-category fight; choose low-turnover depth if that column stays close.',
      roster: ['Luka Dončić', 'Stephen Curry', 'Chet Holmgren', 'Derrick White', 'Jaren Jackson Jr.', 'OG Anunoby', 'Mikal Bridges', 'Josh Hart']
    },
    {
      name: 'Maxey with frontcourt balance',
      color: '#c2185b',
      note: 'A 12-team snake path from pick nine: Towns, Harden, White, Porter, Buzelis, Bridges and Hart fit the next turns near 16, 33, 40, 57, 64, 81 and 88. White and Harden gain from removing FG%, Towns protects boards and FT%, and Hart adds boards at a free-throw cost. Blocks still need the next pick or a later Turner-type center; Hart around 88 costs slightly more than his Yahoo ADP.',
      roster: ['Tyrese Maxey', 'Karl-Anthony Towns', 'James Harden', 'Derrick White', 'Michael Porter Jr.', 'Matas Buzelis', 'Mikal Bridges', 'Josh Hart']
    }
  ],
  roundTargets: [
    { round: 1, candidates: [
      { name: 'Luka Dončić', yahooAdp: 3.5, yahooPreRank: 5, note: 'The 33.4 points, 4.0 threes, 7.7 boards and 8.2 assists justify the early price; removing FG% makes high-volume nights easier to carry. His 4.0 turnovers still count, so buy ball security and blocks with the next picks rather than another lead guard.' },
      { name: 'Tyrese Maxey', yahooAdp: 8.8, yahooPreRank: 4, note: 'Maxey posted 28.3 points, 3.1 threes, 6.6 assists and 1.9 steals across 70 games. Philadelphia added LeBron and Jaylen Brown, so the old usage is not a forecast. The FG% punt helps if his shot volume stays high; seek rebounds and blocks next.' },
      { name: 'Anthony Edwards', yahooAdp: 8.3, yahooPreRank: 6, note: 'Edwards supplies 28.8 points and 3.4 threes, but his 79.6% FT on volume remains a cost even after FG% disappears. Do not mistake a scoring start for a complete punt: draft a strong FT% source and a blocker soon.' }
    ] },
    { round: 2, candidates: [
      { name: 'Karl-Anthony Towns', yahooAdp: 15, yahooPreRank: 11, note: 'Our Top 150 places Towns 17th, close to his Yahoo ADP of 15. His 11.9 rebounds and 85.8% free throws solve two common guard-build problems; giving away his positive FG% is acceptable when you need those scarce categories. His 2.5 turnovers still count.' },
      { name: 'Stephen Curry', yahooAdp: 23.9, yahooPreRank: 12, note: 'Curry made 4.4 threes and remains a major FT% contributor. Our Top 150 places him 19th, but his 43 games make a late-second price a health bet. Take him after a durable opener and buy rebounds soon.' },
      { name: 'Austin Reaves', yahooAdp: 22.3, yahooPreRank: 17, note: 'Our Top 150 places Reaves 12th against Yahoo ADP 22. His 22.9 points, 5.5 assists and 86.8% free throws work even though you give away his good 48.7% FG. The 51-game season and new usage beside Luka make a durable, high-stocks third pick important.' }
    ] },
    { round: 3, candidates: [
      { name: 'Chet Holmgren', yahooAdp: 27.7, yahooPreRank: 19, note: 'His 1.9 blocks, 8.9 rebounds and 1.3 threes solve the guard-heavy build\'s hardest pairing. You give away his 55.7% shooting, but the remaining categories still justify the pick; do not force a lower-ranked percentage drag just because it fits the punt more literally.' },
      { name: 'James Harden', yahooAdp: 35.1, yahooPreRank: 49, note: 'Our Top 150 has Harden 26th, so a third-round Yahoo price is already reasonable before FG% is removed. His 7.9 assists, 3.0 threes and 88.2% free throws suit the build, but 3.5 turnovers and shared Cleveland creation still matter. Use the next pick on defense rather than a third lead guard.' },
      { name: 'Devin Booker', yahooAdp: 26.9, yahooPreRank: 40, note: 'Booker offers scoring, around six assists and strong free throws. Phoenix added another scorer in Miles Bridges, so usage is not fixed. His balanced skill set is useful here when you still need FT% volume; pair him with blocks rather than yet another perimeter scorer.' }
    ] },
    { round: 4, candidates: [
      { name: 'Derrick White', yahooAdp: 47.1, yahooPreRank: 26, note: 'Our Top 150 puts White 29th, well ahead of his Yahoo ADP. Removing his 39.5% FG while keeping 2.7 threes, 5.4 assists and 1.3 blocks makes a fourth-round pick defensible. Do not plan on getting him in round five.' },
      { name: 'Trey Murphy III', yahooAdp: 40.1, yahooPreRank: 22, note: 'Our Top 150 has Murphy 24th, well ahead of Yahoo ADP 40. His 3.2 threes, 21.5 points, 1.5 steals and 88.6% free throws justify the fourth-round price even though FG% is not his main weakness. He is a cleaner partner for a poor-FG creator than another high-turnover guard.' },
      { name: 'Lauri Markkanen', yahooAdp: 38.7, yahooPreRank: 18, note: 'Markkanen gives 26.6 points, threes and 89.6% free throws from forward, with just 1.5 turnovers. Forty-two games and Utah\'s new frontcourt create uncertainty, so pay for the useful scoring-and-FT profile rather than assuming another full-volume season.' }
    ] },
    { round: 5, candidates: [
      { name: 'Brandon Miller', yahooAdp: 46.8, yahooPreRank: 46, note: 'Miller made 3.1 threes and scored 20.2 points despite 43.5% FG. Charlotte\'s changed backcourt could increase his role, but 2.5 turnovers and limited frontcourt stats remain. Select him when threes and points are worth more to your roster than another blocker.' },
      { name: 'Jaren Jackson Jr.', yahooAdp: 50.5, yahooPreRank: 54, note: 'Jackson\'s 1.4 blocks and 1.8 threes protect both ends of a guard-heavy build. He played 48 games and now shares Utah\'s frontcourt with Markkanen, so use his defensive rate without assuming a return to old minutes or block peaks.' },
      { name: 'Michael Porter Jr.', yahooAdp: 59.6, yahooPreRank: 55, note: 'Our Top 150 places Porter 40th against a Yahoo ADP near 60. His 24.2 points, 3.4 threes and 7.1 boards offer unusually useful wing rebounding, though 52 games and a changing Brooklyn role keep him a fifth-round health bet.' }
    ] },
    { round: 6, candidates: [
      { name: 'Matas Buzelis', yahooAdp: 61.9, yahooPreRank: 34, note: 'Buzelis supplied 2.2 threes and 1.5 blocks, a rare pairing that prevents the FG% punt from becoming a blocks punt. Chicago\'s larger role is possible rather than guaranteed; value last season\'s category mix first.' },
      { name: 'OG Anunoby', yahooAdp: 66.6, yahooPreRank: 60, note: 'Our Top 150 places Anunoby 49th. At Yahoo ADP 67, his 1.6 steals, 2.3 threes and 1.8 turnovers help a Luka or Harden team without adding another high-usage guard; take him in the sixth rather than assuming a seventh-round fall.' },
      { name: 'Alex Sarr', yahooAdp: 71.9, yahooPreRank: 59, note: 'Sarr is 45th on our Top 150 and costs a late sixth by Yahoo ADP. His 2.0 blocks and 16.3 points are useful category repair, but 69.2% free throws and a 48-game season make the exact fit conditional on your FT% base.' }
    ] },
    { round: 7, candidates: [
      { name: 'Mikal Bridges', yahooAdp: 79.6, yahooPreRank: 41, note: 'Our Top 150 has Bridges 60th versus a Yahoo ADP near 80. His 82 games, threes, steals and low turnovers make him a realistic seventh-round stabilizer after a high-usage opening, even though his good FG% is unused.' },
      { name: 'Kel\'el Ware', yahooAdp: 73.2, yahooPreRank: 51, note: 'Ware\'s nine rebounds, 1.1 blocks and 1.2 threes are an early-seventh frontcourt option if blocks remain thin. Our Top 150 places him 66th; Milwaukee\'s new rotation makes the old minutes less certain.' },
      { name: 'Paul George', yahooAdp: 80.4, yahooPreRank: 126, note: 'George is 76th on our Top 150 and goes near 80 by Yahoo ADP. His 2.7 threes and 1.7 steals offer wing depth without another point guard, but 37 games and a new Boston role make him an availability bet.' }
    ] },
    { round: 8, candidates: [
      { name: 'Jabari Smith Jr.', yahooAdp: 94.1, yahooPreRank: 84, note: 'Smith supplied 2.3 threes, 6.9 rebounds and 0.9 blocks across 77 games. He brings more boards than a pure shooting wing and more spacing than a traditional center; Houston\'s rotation limits the scoring projection.' },
      { name: 'Josh Hart', yahooAdp: 96.3, yahooPreRank: 68, note: 'Hart\'s 7.4 boards and 4.8 assists from a wing repair rebounding without another high-turnover creator. Yahoo ADP 96 puts him at the round-eight edge; securing him in the high 80s is a reasonable small reach if boards are scarce. His 72.0% FT still needs covering.' },
      { name: 'Norman Powell', yahooAdp: 92.4, yahooPreRank: 115, note: 'Our Top 150 has Powell 81st against Yahoo ADP 92. His 21.7 points and 2.7 threes provide late scoring, while light rebounds and assists mean he fits only after the first seven picks secure those categories.' }
    ] },
    { round: 9, candidates: [
      { name: 'Myles Turner', yahooAdp: 100.3, yahooPreRank: 108, note: 'Turner\'s 44.0% FG disappears here, leaving 2.1 threes and 1.6 blocks at center. Our Top 150 places him 88th, so Yahoo ADP 100 looks fair, but his 5.3 boards do not solve rebounding. Pair him with a rebounding wing or big.' },
      { name: 'Kristaps Porziņģis', yahooAdp: 98.8, yahooPreRank: 148, note: 'Porziņģis offered 1.7 threes and 1.2 blocks with strong free throws from center. Thirty-two games and Golden State\'s health management make this a volatile buy, so the rest of the early roster should be durable.' },
      { name: 'Andrew Wiggins', yahooAdp: 100.7, yahooPreRank: 103, note: 'Wiggins brings 2.0 threes, 1.1 steals and roughly one block from a wing spot. Our Top 150 places him 86th, close enough to Yahoo ADP 101 to use him as a ninth-round stocks patch; Giannis\' arrival in Miami makes scoring volume uncertain.' }
    ] },
    { round: 10, candidates: [
      { name: 'Grayson Allen', yahooAdp: 116.2, yahooPreRank: 113, note: 'Allen made 3.1 threes with 1.4 steals while shooting 40.3%. This is a real punt-FG% gain at a Yahoo ADP near 116, but his move to Charlotte and a 51-game season create role and availability risk. Use him when boards and blocks are secure.' },
      { name: 'Cason Wallace', yahooAdp: 118.2, yahooPreRank: 76, note: 'Wallace\'s 2.0 steals and 0.9 turnovers help rescue the ninth category after early creators. He scored only 8.6 points, so he must be a category finisher rather than your last source of offense.' },
      { name: 'Toumani Camara', yahooAdp: 110.1, yahooPreRank: 97, note: 'Camara made 2.6 threes with 5.1 boards in 82 games. Yahoo ADP near 110 makes him a late-tenth-round wing, and our Top 150 places him 104th. His 70.7% FT makes the pick conditional on strong FT% volume already in place.' }
    ] },
    { round: 11, candidates: [
      { name: 'Reed Sheppard', yahooAdp: 120.8, yahooPreRank: 56, note: 'Sheppard made 2.8 threes with 1.5 steals and 0.7 blocks. VanVleet\'s return could shrink his Houston role; take him for shooting and defense only if the camp rotation supports minutes.' },
      { name: 'Saddiq Bey', yahooAdp: 120.1, yahooPreRank: 109, note: 'Bey contributed 17.7 points, 2.1 threes, 5.6 boards and just 0.9 turnovers. He is 102nd on our Top 150 versus Yahoo ADP 120, but thin stocks mean you need defenders already in place.' },
      { name: 'P.J. Washington', yahooAdp: 115.8, yahooPreRank: 178, note: 'Washington adds seven rebounds, 1.0 steals and 1.1 blocks. Our Top 150 places him 124th, close to Yahoo ADP 116; his 45.0% FG no longer hurts, but 68.7% FT still can. Take him only after strong FT% guards.' }
    ] },
    { round: 12, candidates: [
      { name: 'Donte DiVincenzo', yahooAdp: null, yahooPreRank: null, note: 'Three threes and 1.3 steals across 82 games become more appealing once his 40.6% FG is removed. Minnesota\'s new Ball-Edwards backcourt could change minutes, and this Yahoo snapshot has no reliable ADP; take the value only if it reaches your last pick.' },
      { name: 'Herbert Jones', yahooAdp: null, yahooPreRank: 147, note: 'Jones gave 1.6 steals despite 38.3% shooting. The punt clears that weakness, but 1.4 threes and limited scoring still make him a specialist. Use him only when your final roster needs a steal-rate boost.' },
      { name: 'Jay Huff', yahooAdp: null, yahooPreRank: null, note: 'Huff paired 1.9 blocks with 1.5 threes in 82 games. Zubac\'s arrival in Indiana threatens his minutes, so this is a final-round block-and-spacing gamble rather than guaranteed frontcourt volume.' }
    ] }
  ],
  faqs: [
    { q: 'Does punt FG% mean I should draft only inefficient guards?', a: 'No. A positive-FG player can still be the right pick if he supplies scarce rebounds, blocks or low turnovers. The punt removes a penalty; it does not erase your other seven or eight needs.' },
    { q: 'Can I win turnovers with Luka or Harden?', a: 'Possibly, but it takes low-turnover wings and careful choices after the first creator. Stacking several high-usage guards makes a second punt much more likely.' },
    { q: 'Which other categories are most at risk?', a: 'Rebounds and blocks are the usual structural gaps. FT% can also slip if you solve them with poor free-throw centers, so check both rate and attempt volume.' },
    { q: 'Does this work in eight-category leagues?', a: 'Yes. Without turnovers, high-usage guards get an extra lift, but rebounds and blocks still need deliberate draft capital.' }
  ]
};

export const PUNT_THREES = {
  slug: 'punt-threes',
  type: 'punt',
  puntKey: '3pm',
  title: 'Punt Threes',
  season: CONTENT_SEASON,
  difficulty: 'Intermediate',
  isPremium: true,
  tagline: 'Turn scarce rebounding, defense and efficient scoring into wins without giving away free throws.',
  strengths: ['fg', 'reb', 'blk', 'ast'],
  weaknesses: ['3pm', 'ft', 'pts', 'to'],
  freeSections: 2,
  board: { minGames: 30, freeLimit: 20, previewRows: 4 },
  sections: [
    {
      id: 'strategy',
      heading: 'The strategy',
      body: [
        'Punt threes lets finishers, slashers and passing bigs compete on the eight categories they actually produce. Scottie Barnes is a useful early example: he gave 7.5 rebounds, 5.9 assists, 1.4 steals and 1.4 blocks while making only 0.8 threes in 2025-26. Amen Thompson supplied 7.8 boards, 5.3 assists and 1.5 steals with 0.3 threes. The punt makes those profiles easier to pair, but it does not make every non-shooter a bargain at any price.',
        'Shai Gilgeous-Alexander is the safest first-round base if available: 31.1 points on 55.3% FG, 87.9% FT, 6.6 assists and only 2.2 turnovers. You discard some shooting value, but his scoring and percentages give a low-three frontcourt room to breathe. Jalen Johnson is a later first-round path to rebounds and assists, though his 78.8% FT on volume and 3.4 turnovers make the next picks more demanding.'
      ]
    },
    {
      id: 'correlation',
      heading: 'Natural strengths & weaknesses',
      body: [
        'FG%, rebounds, blocks and out-of-position assists are the natural rewards, especially if the early roster includes Barnes, Amen or a finishing center. Points and steals still require deliberate sources; a lineup of low-usage centers can dominate boards yet lose too many other columns. The best complement may be an ordinary shooter such as Kawhi or Bane whose points, steals or FT% remain valuable even after the threes are removed.',
        'FT% is the second-punt trap. Duren made 74.7% of his free throws, Clingan 69.2%, Dyson Daniels 61.5% and Ausar Thompson 57.1%. Stacking them does not become safe just because none makes threes. Measure percentage impact using attempts, buy real FT% volume before another poor-FT big, and keep an eye on turnovers if Johnson or Sengun is your main passer.'
      ]
    },
    {
      id: 'draft',
      heading: 'Where the value sits in the draft',
      body: [
        'Yahoo ADP from September 26 places Johnson near 12, Barnes near 14, Amen near 24, Duren near 36 and Clingan near 42; our Top 150 ranks them 11th, 15th, 22nd, 35th and 34th. Those are credible price bands, not players you can combine freely. In a 12-team snake, a Johnson-Barnes opening is possible near the turn, while a Shai start must wait until the next turn to see which frontcourt piece remains.',
        'The board below removes threes from corrected 2025-26 production, so it describes history rather than a 2026-27 projection. These round targets use our Top 150 for the forward-looking case, the dated Yahoo ADP for cost, and Yahoo standard pre-ranks checked October 2. A player near a round edge may leave before your turn, especially in rooms that recognize the same punt.'
      ]
    }
  ],
  buildingBlocks: [
    { name: 'Scoring and free-throw base', note: 'A Shai, Kawhi or Bane type supplies points and FT% volume before low-three bigs put the line under pressure.' },
    { name: 'Rebounds with playmaking', note: 'Barnes, Johnson and Amen contribute assists without the usual point-guard dependence on threes.' },
    { name: 'Selective rim protection', note: 'Duren, Clingan and later centers add boards and blocks only when their free throws fit the existing roster.' }
  ],
  exampleTeams: [
    {
      name: 'Shai with defensive depth',
      color: '#16a085',
      note: 'A plausible 12-team snake path from pick four, with turns near 21, 28, 45, 52, 69, 76 and 93. Amen, Holmgren, Clingan, Bane, Anunoby, Bridges and McDaniels sit near those Yahoo prices; Clingan, Anunoby and McDaniels each need a small slide. Shai and Bane protect scoring and FT%, but Amen and Clingan still make the line worth checking before every later big.',
      roster: ['Shai Gilgeous-Alexander', 'Amen Thompson', 'Chet Holmgren', 'Donovan Clingan', 'Desmond Bane', 'OG Anunoby', 'Mikal Bridges', 'Jaden McDaniels']
    },
    {
      name: 'Johnson and Barnes near the turn',
      color: '#b8860b',
      note: 'From the end of round one, Johnson, Barnes, Duren, Markkanen, Buzelis, Anunoby, McDaniels and Bridges fit turns near 12, 13, 36, 37, 60, 61, 84 and 85. Markkanen supplies points and FT% despite his unused threes; Duren carries the FG% and boards. This path depends on several small slips and on Markkanen staying available after a 42-game season. Free throws and scoring are the next categories to recheck.',
      roster: ['Jalen Johnson', 'Scottie Barnes', 'Jalen Duren', 'Lauri Markkanen', 'Matas Buzelis', 'OG Anunoby', 'Jaden McDaniels', 'Mikal Bridges']
    }
  ],
  roundTargets: [
    { round: 1, candidates: [
      { name: 'Shai Gilgeous-Alexander', yahooAdp: 4.1, yahooPreRank: 2, note: 'Our Top 150 ranks Shai third, in line with his Yahoo price. His 31.1 points, 55.3% FG, 87.9% FT, 6.6 assists and 2.2 turnovers protect several categories this punt can lose. Take the best player at pick four, then use the next turn for rebounds and defense.' },
      { name: 'Jalen Johnson', yahooAdp: 11.8, yahooPreRank: 16, note: 'Johnson is 11th on our Top 150 and goes near pick 12. His 10.3 rebounds and 7.9 assists from forward make a low-three roster easier to build, but 78.8% FT and 3.4 turnovers mean the next two picks should be cleaner.' },
      { name: 'Nikola Jokić', yahooAdp: 1.9, yahooPreRank: 1, note: 'Jokić remains our top overall player: 12.9 boards, 10.7 assists and 56.9% FG are a rare foundation. Punting his useful threes is an opportunity cost, so take him because the remaining eight categories still justify pick one, not because he is a punt-specific discount.' }
    ] },
    { round: 2, candidates: [
      { name: 'Scottie Barnes', yahooAdp: 14.1, yahooPreRank: 21, note: 'Our Top 150 has Barnes 15th, close to Yahoo ADP 14. His 0.8 threes stop mattering, while 7.5 boards, 5.9 assists, 1.4 steals and 1.4 blocks remain. Toronto\'s new Kawhi pairing may change scoring, so secure a true points source next.' },
      { name: 'Amen Thompson', yahooAdp: 23.6, yahooPreRank: 10, note: 'Amen is 22nd on our board and near pick 24 on Yahoo. The punt removes his 0.3 threes, preserving 7.8 rebounds, 5.3 assists, 1.5 steals and 53.4% FG from guard. VanVleet\'s return may reduce his on-ball time; check FT% before pairing him with another poor shooter at the line.' },
      { name: 'Austin Reaves', yahooAdp: 22.3, yahooPreRank: 17, note: 'Reaves ranks 12th on our Top 150 versus Yahoo ADP 22. His 22.9 points, 5.5 assists and 86.8% FT protect categories a big-heavy start can lose, though you discard 2.3 threes. A 51-game season makes him a health bet; follow with a reliable rebounder.' }
    ] },
    { round: 3, candidates: [
      { name: 'Jalen Duren', yahooAdp: 36, yahooPreRank: 28, note: 'Duren is 35th on our board and costs a late third by Yahoo ADP. He gave 19.5 points, 10.5 boards and 65.0% FG with no threes. His 74.7% FT is a real cost; he fits best after a high-volume FT anchor rather than beside Sengun or another weak-FT big.' },
      { name: 'Chet Holmgren', yahooAdp: 27.7, yahooPreRank: 19, note: 'Holmgren is 23rd on our board and near pick 28 on Yahoo. His 8.9 boards, 1.9 blocks and 79.2% FT support a frontcourt without a severe line penalty. You sacrifice 1.3 threes, but the remaining category spread is worth the third-round price.' },
      { name: 'Kawhi Leonard', yahooAdp: 29.3, yahooPreRank: 15, note: 'Kawhi sits 14th on our Top 150 at a Yahoo price near 29. The 27.5 points, 1.8 steals, 50.8% FG and 88.8% FT can protect four columns while your bigs dominate boards. His move to Toronto and age make another 65-game season uncertain.' }
    ] },
    { round: 4, candidates: [
      { name: 'Donovan Clingan', yahooAdp: 41.6, yahooPreRank: 29, note: 'Clingan is 34th on our board and near pick 42 on Yahoo. His 11.5 rebounds and 1.7 blocks in 77 games justify the price when frontcourt defense is missing. The 69.2% FT means pairing him with Duren, Amen or Dyson needs a strong line already in place.' },
      { name: 'Lauri Markkanen', yahooAdp: 38.7, yahooPreRank: 18, note: 'Our Top 150 places Markkanen 20th against Yahoo ADP 39. His 26.6 points, 89.6% FT and 1.5 turnovers address punt-threes pressure points, even though his 2.7 threes become unused value. Only 42 games and Utah\'s changed frontcourt keep the price discounted.' }
    ] },
    { round: 5, candidates: [
      { name: 'Desmond Bane', yahooAdp: 52.9, yahooPreRank: 44, note: 'Bane is 38th on our board versus Yahoo ADP 53. His 20.1 points, 90.8% FT, 48.3% FG and 82 games supply a reliable scoring-and-percentage counterweight to a Duren or Clingan pick. Losing his threes costs value, so choose him when the line needs the larger lift.' },
      { name: 'Jaren Jackson Jr.', yahooAdp: 50.5, yahooPreRank: 54, note: 'Jackson brings 1.4 blocks and better FT% than several finishing centers, but his 1.8 threes are lost here. Our Top 150 has him 43rd and Yahoo ADP near 50; 48 games and Utah\'s new frontcourt make health and role the bigger questions.' },
      { name: 'Matas Buzelis', yahooAdp: 61.9, yahooPreRank: 34, note: 'Buzelis goes near the round-five boundary despite a Top 150 rank of 59. His 1.5 blocks can protect rim defense from forward, while 2.2 threes are unused. Take him at the end of five only if the preceding picks need blocks more than FT% or scoring.' }
    ] },
    { round: 6, candidates: [
      { name: 'Dyson Daniels', yahooAdp: 62.9, yahooPreRank: 20, note: 'Our Top 150 ranks Daniels 33rd versus Yahoo ADP 63, and the punt removes his 0.3 threes. Two steals, 6.8 boards and 5.9 assists from guard are powerful, but 61.5% FT can quietly force a second punt. Take him only after enough FT% volume is secured.' },
      { name: 'Julius Randle', yahooAdp: 68.4, yahooPreRank: 101, note: 'Randle is 68th on our board and costs roughly the same by Yahoo ADP. His 21.1 points, 6.7 boards and 5.0 assists can repair scoring from a forward slot. Brooklyn offers new touches, but 2.7 turnovers and limited blocks remain costs.' },
      { name: 'OG Anunoby', yahooAdp: 66.6, yahooPreRank: 60, note: 'Anunoby sits 49th on our Top 150 versus Yahoo ADP 67. His 1.6 steals, 0.7 blocks and 1.8 turnovers help a big-heavy team keep defense and ball security. The 2.3 threes are unused, so the sixth-round price needs a clear steals need.' }
    ] },
    { round: 7, candidates: [
      { name: 'Zion Williamson', yahooAdp: 69.7, yahooPreRank: 107, note: 'Zion\'s 21.0 points on 60.0% FG come with no threes, a direct benefit of this punt. Our Top 150 places him 82nd versus Yahoo ADP 70 because 71.6% FT, limited blocks and health risk still matter. Wait for a discount or draft only after strong FT% volume.' },
      { name: 'Mikal Bridges', yahooAdp: 79.6, yahooPreRank: 41, note: 'Bridges is 60th on our Top 150 and goes near pick 80. His 82 games, 1.3 steals, 0.8 blocks and few turnovers can stabilize a Johnson or Randle start. You give away his threes, but the defensive coverage still plays at this price.' },
      { name: 'De\'Aaron Fox', yahooAdp: 80.1, yahooPreRank: 85, note: 'Fox is 75th on our Top 150 against Yahoo ADP 80. He supplies 18.6 points, 6.2 assists and 48.6% FG if your first six picks lack a guard creator. His middling FT% and shared San Antonio backcourt make him a conditional seventh-round fit.' }
    ] },
    { round: 8, candidates: [
      { name: 'Jaden McDaniels', yahooAdp: 89.2, yahooPreRank: 43, note: 'McDaniels ranks 78th on our board at Yahoo ADP 89. He gave 14.8 points, 51.5% FG, 1.1 steals and 1.0 blocks from a wing. His 1.4 threes are expendable here; Minnesota\'s new guard mix is the scoring uncertainty.' },
      { name: 'Josh Hart', yahooAdp: 96.3, yahooPreRank: 68, note: 'Hart is 93rd on our board and goes near the end of eight. His 7.4 rebounds and 4.8 assists from a wing work in a low-three build, with only 1.9 turnovers. The 72.0% FT requires another line anchor; do not use him as the fix for steals or points.' },
      { name: 'Norman Powell', yahooAdp: 92.4, yahooPreRank: 115, note: 'Powell ranks 81st on our board and costs roughly pick 92. His 21.7 points provide a late scoring lift after several defensive bigs. You lose 2.7 threes, so pay this price only if points and FT% are still winnable categories.' }
    ] },
    { round: 9, candidates: [
      { name: 'Andrew Wiggins', yahooAdp: 100.7, yahooPreRank: 103, note: 'Wiggins is 86th on our board and costs about pick 101. His steals, blocks and 47.5% FG can fill a wing slot without another low-FT center. The two threes you discard and Giannis\' arrival in Miami limit the scoring case.' },
      { name: 'Jalen Suggs', yahooAdp: 111.4, yahooPreRank: 89, note: 'Suggs gave 1.8 steals and 5.5 assists in 57 games. Our Top 150 ranks him 72nd, but 43.5% FG and availability still matter after threes are removed. He is a ninth-to-tenth-round defense and passing target, not a scoring solution.' },
      { name: 'Nikola Vučević', yahooAdp: 114.7, yahooPreRank: null, note: 'Vučević remains a source of 8.4 boards and low turnovers, but his 1.6 threes are lost in this build. Our Top 150 puts him 97th versus Yahoo ADP 115; only take him early if Orlando shows a clear frontcourt role.' }
    ] },
    { round: 10, candidates: [
      { name: 'Jimmy Butler III', yahooAdp: 117.1, yahooPreRank: null, note: 'Butler sits 79th on our Top 150 against Yahoo ADP 117 because the January ACL tear leaves his return uncertain. His 0.8 threes are expendable while 52.0% FG, 86.2% FT, 1.4 steals and 1.6 turnovers could fill several holes. Keep the rest of the roster durable.' },
      { name: 'DeMar DeRozan', yahooAdp: 116.2, yahooPreRank: 155, note: 'DeRozan is 118th on our board and costs near the same by Yahoo ADP. His 0.6 threes disappear, leaving 18.1 points, 86.5% FT, 4.1 assists and only 1.2 turnovers. Denver\'s changed offense may trim usage; buy the clean late scoring line, not a bigger role.' },
      { name: 'Cason Wallace', yahooAdp: 118.2, yahooPreRank: 76, note: 'Wallace is 103rd on our board against Yahoo ADP 118. Two steals and 0.9 turnovers can rescue close categories after several high-usage forwards. His 8.6 points are too light to repair a scoring deficit.' }
    ] },
    { round: 11, candidates: [
      { name: 'Ayo Dosunmu', yahooAdp: 114.9, yahooPreRank: 96, note: 'Dosunmu is 116th on our board and near pick 115 on Yahoo. The 51.7% FG, 87.6% FT and 1.4 turnovers are unusually clean for a late guard. Minnesota\'s crowded backcourt makes minutes uncertain; take him near this price only if your team needs efficiency more than scoring volume.' },
      { name: 'Tre Jones', yahooAdp: 116, yahooPreRank: 156, note: 'Jones gave 5.4 assists with 1.4 turnovers, 55.3% FG and 84.1% FT. His limited threes stop mattering, but scoring is still thin. Our Top 150 places him 130th, so he is an eleventh-round roster fit if you specifically need passing and clean percentages.' },
      { name: 'Neemias Queta', yahooAdp: 115.2, yahooPreRank: 116, note: 'Queta had zero threes, 65.3% FG, 8.4 rebounds and 1.3 blocks across 76 games. Yahoo ADP near 115 is earlier than our Top 150 rank of 138; his 70.3% FT makes him a late frontcourt contingency only after the line is secure.' }
    ] },
    { round: 12, candidates: [
      { name: 'Bilal Coulibaly', yahooAdp: null, yahooPreRank: null, note: 'Coulibaly supplies 1.3 steals and 1.0 blocks with modest threes. Our Top 150 places him 114th, but Yahoo gives no reliable ADP in this snapshot. His 42.5% FG and uncertain Washington scoring role make him a final-pick defensive bet, not a percentage anchor.' },
      { name: 'Jay Huff', yahooAdp: null, yahooPreRank: null, note: 'Huff blocked 1.9 shots in 82 games, but his 1.5 threes are unused here and Zubac\'s arrival could cut minutes. Yahoo gives no reliable ADP in this snapshot; take him only if blocks still need help and he actually reaches your last pick.' }
    ] }
  ],
  faqs: [
    { q: 'Does punt threes mean I should take every non-shooter?', a: 'No. A low-three player still has to help the other eight categories at the pick you spend. FT%, points and turnovers remain live costs.' },
    { q: 'Can I pair Amen Thompson with Dyson Daniels?', a: 'Their rebounds, assists and steals fit, but the combined free-throw impact can create a second punt. Make sure earlier picks supply enough FT% volume before choosing both.' },
    { q: 'Should I avoid all three-point shooters?', a: 'No. Shai, Kawhi, Markkanen or Bane may be worth the price for scoring and free throws even when some threes are unused.' },
    { q: 'Does punt threes work in eight-category leagues?', a: 'Yes, but removing turnovers also boosts high-usage passers. Recheck FT% and points; those remain the easiest columns to lose behind an all-frontcourt start.' }
  ]
};

export const PUNT_POINTS = {
  slug: 'punt-points',
  type: 'punt',
  puntKey: 'pts',
  title: 'Punt Points',
  season: CONTENT_SEASON,
  difficulty: 'Advanced',
  isPremium: true,
  tagline: 'Let other managers chase scoring while you build around passing, defense and efficient shooting.',
  strengths: ['reb', 'ast', 'stl', 'blk'],
  weaknesses: ['pts', '3pm', 'ft'],
  freeSections: 2,
  board: { minGames: 30, freeLimit: 20, previewRows: 4 },
  sections: [
    {
      id: 'strategy',
      heading: 'The strategy',
      body: [
        'Some of the most useful category players are difficult to draft together when you still need to win points. Cason Wallace scored 8.6 a game last season, Dyson Daniels 11.9 and Donovan Clingan 12.1. Put several of them on a conventional roster and you spend the rest of the draft trying to catch up in scoring. Punt points gives you permission to stop that chase. Wallace can earn his place through steals and ball security, Daniels through passing and rebounding, and Clingan through boards and blocks. The value comes from being able to use those players together at sensible prices.',
        'The opening rounds still need stars. Jokić gives you enough passing from center to spend later picks on defenders, while Wembanyama makes blocks a realistic strength before you draft a second big. Near the first-round turn, Jalen Johnson and Scottie Barnes offer a different foundation: rebounds and assists from forwards, with Barnes doing much more of the shot blocking. Their scoring will sometimes win you a week anyway. In head-to-head categories, the commitment is to stop spending picks to rescue points when another category would benefit more.',
        'The difficult part is keeping enough shooting. Many of the players who rise here also make very few threes, and taking every attractive defender can leave you conceding points, threes and FT%. That is a narrow path through a nine-category matchup. White, Anunoby and Pritchard matter because they let you keep the defensive specialists without surrendering the whole perimeter. This guide assumes a 12-team, nine-category head-to-head league; deliberately finishing near the bottom in points is a much more expensive concession in roto.'
      ]
    },
    {
      id: 'correlation',
      heading: 'Natural strengths & weaknesses',
      body: [
        'Rebounds and defensive stats are the easiest place to start, but the guards determine how flexible the finished team becomes. Daniels gave you 6.8 rebounds and 5.9 assists; Wallace supplied only 3.1 and 2.6 despite matching his two steals. They solve different problems. Likewise, Duren\'s 10.5 rebounds came with 0.8 blocks, while Holmgren gave 8.9 boards and 1.9 blocks. A collection of players who improve in the punt rankings can still leave you short in one of the categories you meant to win.',
        'Free-throw percentages can be misleading without the attempt volume. Daniels shot 61.5%, but on just 1.6 attempts per game. Duren made a much more respectable 74.7% while taking 6.1. Against an 80% target, each costs roughly three-tenths of a made free throw per game. You can absorb either with the right teammates: Bane and Daniels together shot about 82.7%, combining their 2025-26 makes and attempts with equal games for each. A strong percentage on tiny volume will not do the same job. Pritchard\'s 89.0% came on 1.7 attempts, so he helps without providing Bane\'s influence over the team total.',
        'FG% and turnovers also depend on who you choose. White\'s 39.5% on 14.4 shots can pull down an otherwise efficient frontcourt; Duren\'s 65.0% on 11.5 shots is enough to bring their combined shooting to about 50.9%. With turnovers, the attraction of a low-scoring roster disappears if all your assists come from high-usage creators. Jokić and Johnson averaged 3.7 and 3.4 turnovers. Pritchard, Bridges and Tre Jones give you ways to add passing without letting that column get away from you.'
      ]
    },
    {
      id: 'draft',
      heading: 'Where the value sits in the draft',
      body: [
        'Spend the early picks on production you cannot comfortably replace later. Jokić\'s assists and Wembanyama\'s blocks are obvious examples; Barnes\' combination of passing and defense is another. Barnes usually costs the first/second-round turn, Amen the next turn, and Holmgren an early third. A manager picking near the top cannot reasonably plan on getting all three. Decide which category your first pick leaves exposed, then use the available player at your actual turn.',
        'The middle rounds are where this build becomes interesting. White sits 29th on our Top 150 with Yahoo ADP around 47, and Okongwu is 37th against an ADP near 55. Both offer combinations that save you from using a later pick on a one-category specialist. Daniels has the larger ranking gap, but if Amen is already on the roster, Anunoby\'s shooting may be worth more to you than another rebound and assist boost. That is a sensible reason to pass on the player who looks better in isolation.',
        'The player cards show Yahoo ADP from September 26 and standard pre-ranks checked October 2. Those numbers can disagree sharply: Pritchard is near pick 80 by ADP but 33rd in the default order. Treat the listed rounds as shopping ranges, with room for a player to go earlier in a queue-driven draft. Our Top 150 supplies the 2026-27 outlook; the live punt board uses corrected 2025-26 production. The sample teams combine last season\'s per-game lines with equal games for each player and weight percentages by attempts. They are construction checks, not forecasts of weekly results.'
      ]
    }
  ],
  buildingBlocks: [
    { name: 'An early advantage you can build on', note: 'Jokić lets you get assists without filling the backcourt with lead guards. Wembanyama gives you room to choose a rebounding center who blocks fewer shots. Let that first advantage shape the next two picks.' },
    { name: 'Defenders who cover different needs', note: 'Daniels adds passing, Wallace protects turnovers, and McDaniels brings blocks from the wing. Choose the missing contribution instead of collecting several versions of the same player.' },
    { name: 'Enough shooting to keep your options open', note: 'Anunoby adds threes alongside steals; Pritchard brings threes and assists; Bane has the free-throw volume to support a weaker shooter. Their value rises when they let you keep another specialist.' }
  ],
  exampleTeams: [
    {
      name: 'Jokić with guard defense',
      color: '#16a085',
      note: 'Jokić supplies the passing that lets this team spend heavily on defense. With equal games, these eight 2025-26 lines total 52.9 rebounds, 33.6 assists and 8.5 blocks, while shooting 50.3% FG and 82.0% FT. That leaves room to compete in both percentages; the more obvious unfinished business is shooting, at 13.4 threes across eight players. Sheppard would help that in the later rounds, whereas another non-shooting center would mostly add to existing strengths. From pick one, the turns are 1, 24, 25, 48, 49, 72, 73 and 96. Anunoby and McDaniels each need a modest slide, and Yahoo\'s earlier pre-ranks could remove Amen or White before their ADP suggests. Jackson\'s 48-game season also makes a dependable next pick attractive.',
      roster: ['Nikola Jokić', 'Amen Thompson', 'Chet Holmgren', 'Derrick White', 'Jaren Jackson Jr.', 'OG Anunoby', 'Mikal Bridges', 'Jaden McDaniels']
    },
    {
      name: 'Johnson and Barnes near the turn',
      color: '#b8860b',
      note: 'Johnson and Barnes handle enough passing that Duren can be chosen for his rebounding and FG%. White then adds the guard blocks this opening needs, while Bane gives the free-throw volume to support Duren. The eight historical lines combine for 50.3 rebounds, 35.3 assists and 6.3 blocks at 49.4% FG and 82.4% FT. Threes sit at 13.7 and turnovers at 16.6, so the remaining picks should favor shooting and ball security. The price path is 12, 13, 36, 37, 60, 61, 84 and 85: White is a deliberate early selection relative to ADP, supported by our rank of 29, and Bane needs to fall about seven picks. If Bane goes earlier, Okongwu is an alternative near that turn, but the team would then need a stronger FT% contributor later.',
      roster: ['Jalen Johnson', 'Scottie Barnes', 'Jalen Duren', 'Derrick White', 'Desmond Bane', 'OG Anunoby', 'Jaden McDaniels', 'Payton Pritchard']
    }
  ],
  roundTargets: [
    { round: 1, candidates: [
      { name: 'Nikola Jokić', yahooAdp: 1.9, yahooPreRank: 1, note: 'Jokić makes this build much easier to draft because so much of your passing comes from a center. His 10.7 assists let you use a later guard slot on Wallace or Sheppard without expecting either to run an offense. Add 12.9 rebounds and 56.9% shooting on 17.4 attempts, and you have substantial help in two categories that those guards cannot carry. Wembanyama offers the bigger defensive advantage, but Jokić gives you more freedom to react when centers or point guards go early. The 3.7 turnovers still count, so I would lean toward Bridges and Pritchard later rather than keep adding high-usage passers. He remains worth a pick at the very top even when you stop chasing his points.' },
      { name: 'Victor Wembanyama', yahooAdp: 1.6, yahooPreRank: 3, note: 'The strongest reason to choose Wembanyama here is what his blocks allow you to do with the rest of the roster. He averaged 3.1 in only 29.2 minutes, alongside 11.5 rebounds, 1.9 threes and 82.7% FT on seven attempts. That gives you room to take a center such as Duren for FG% and boards without asking that player to be an elite shot blocker too. You still need a real assist source: Wembanyama\'s 3.1 are useful for a big, but nowhere close to Jokić\'s contribution. His 64 games also matter. If he is your first pick, I would want the next few selections to have dependable roles rather than make the entire frontcourt a bet on health.' },
      { name: 'Shai Gilgeous-Alexander', yahooAdp: 4.1, yahooPreRank: 2, note: 'Shai is the opening for a manager who wants to keep both percentages strong before choosing the specialists. His 87.9% FT came on nine attempts a game, giving him far more influence over the team total than a good shooter who visits the line once or twice. The 55.3% FG on 19.4 attempts is just as valuable, and 6.6 assists with 2.2 turnovers leaves room to compete in ball security. You are paying for 31.1 points that this build will not prioritize, so there is no need to decide on the punt before the next turn. If Barnes, Amen or Holmgren is the best available player there, Shai has already made their category tradeoffs easier to manage.' },
      { name: 'Jalen Johnson', yahooAdp: 11.8, yahooPreRank: 16, note: 'Johnson is an appealing way into this build near the end of round one. The 10.3 rebounds and 7.9 assists allow your next picks to concentrate on defense and shooting, and he contributes far more threes than Amen or Daniels. The catch is that a rebounding forward is not necessarily a shot blocker: Johnson averaged only 0.4 blocks. Barnes makes particular sense beside him because his defense fills that gap while adding another passer. With 3.4 turnovers and 78.8% FT on 5.3 attempts, Johnson also needs teammates who keep the possession count and free throws under control. Our 11th-place ranking and Yahoo\'s price near 12 make this a realistic opening at the turn, without requiring a major fall.' }
    ] },
    { round: 2, candidates: [
      { name: 'Scottie Barnes', yahooAdp: 14.1, yahooPreRank: 21, note: 'Barnes is one of the best reasons to consider this punt. You get 7.5 rebounds and 5.9 assists from forward, plus roughly a steal and a half and a block and a half, without needing a big scoring night. He played 80 games, which gives that broad line more practical value than an impressive per-game season spent mostly on the injury list. Kawhi\'s return to Toronto could take away shots; for this build, the more important question is how much passing Barnes keeps. There is enough else here to like the pairing, provided you buy shooting afterward. Barnes made fewer than one three per game, so following him with White or a shooting big leaves you more choices than immediately adding another non-shooter.' },
      { name: 'Amen Thompson', yahooAdp: 23.6, yahooPreRank: 10, note: 'Few guards can change a team\'s rebounding and FG% the way Amen does. His 7.8 boards and 53.4% shooting came with 5.3 assists and 1.5 steals, making him especially useful after an early center who does not pass much. The shooting limitations need to be separated: 0.3 threes is a major hole, while 77.9% FT on 4.9 attempts is a manageable cost with enough support. He is not in the same free-throw situation as Ausar. VanVleet\'s expected return could reduce the ballhandling that produced those assists, so I would not draft Amen assuming another increase. Around the second/third-round turn, the fit is compelling; Yahoo\'s much earlier default rank is a reason to have a backup plan, not to spend a first-round pick.' }
    ] },
    { round: 3, candidates: [
      { name: 'Chet Holmgren', yahooAdp: 27.7, yahooPreRank: 19, note: 'Holmgren is the center I would look for when the early roster already includes a non-shooting guard. His 1.3 threes are modest on their own, but they help you stay in the category while adding 8.9 rebounds and 1.9 blocks. The 55.7% FG also gives him an advantage over stretch centers who block shots at the expense of your percentage. His 79.2% free throws are manageable, although they will not carry a roster full of poor shooters. Oklahoma City\'s depth leaves the minutes ceiling uncertain after a 28.9-minute season; the appeal is how much he already produces in that workload. With only 1.7 assists, he fits more comfortably beside Jokić, Johnson or Barnes than as part of an opening with no established passer.' },
      { name: 'Jalen Duren', yahooAdp: 36, yahooPreRank: 28, note: 'Duren is the pick for a team that needs its FG% to move. He shot 65.0% on 11.5 attempts, enough volume to absorb much of the damage from a guard such as White. His 10.5 rebounds help too, but the 0.8 blocks explain why I would rather draft him after Barnes or Wembanyama than assume he completes the defense himself. Stewart\'s departure removes one source of competition in Detroit\'s frontcourt, although an increase over last season\'s workload remains a projection. The real cost is at the line: 74.7% on 6.1 attempts has a substantial effect, and he supplies no threes. If those categories already look thin, Holmgren is worth the earlier pick; if shooting is covered, Duren can make the frontcourt much harder to beat.' }
    ] },
    { round: 4, candidates: [
      { name: 'Derrick White', yahooAdp: 47.1, yahooPreRank: 26, note: 'White lets you pursue blocks without filling another center slot. His 1.3 per game came with 2.7 threes and 5.4 assists, which is why he is such an appealing partner for Barnes or a traditional rebounding big. Boston\'s offense will look different with Tatum back and George replacing Brown, so repeating all of last season\'s creation is not assured. His shooting and defensive contributions still give him several ways to help. The difficult number is 39.5% FG on 14.4 attempts: that is too much volume to dismiss as a small guard penalty. A Duren or Jokić start can absorb it much more comfortably than a collection of stretch forwards. Our rank of 29 supports taking him ahead of his fourth-round ADP when your draft position requires it.' },
      { name: 'Donovan Clingan', yahooAdp: 41.6, yahooPreRank: 29, note: 'Clingan gives you a lot of rebounding without asking for many possessions. He collected 11.5 boards and 1.7 blocks with only 1.2 turnovers, a useful combination when your first two picks are already doing most of the passing. The 1.1 threes help as well; he is less restrictive than a center who never shoots from outside. Be careful with the assumption that a player of his size must also dominate FG%. He shot 52.1% on 8.8 attempts, a much smaller percentage contribution than Duren. His 69.2% FT came on 2.5 attempts, so the damage is manageable with enough volume elsewhere. I prefer him when rebounds and turnovers need attention, especially after an opening that already has a dependable free-throw shooter.' }
    ] },
    { round: 5, candidates: [
      { name: 'Onyeka Okongwu', yahooAdp: 54.7, yahooPreRank: 37, note: 'Okongwu belongs in this conversation because he contributes to almost every category you still care about. His 7.6 rebounds came with 3.1 assists, 1.9 threes and 1.1 each in steals and blocks. Clingan is the better choice if you need a large rebounding advantage; Okongwu gives you more ways to finish a roster that already has one traditional center. That flexibility matters beside Amen or Daniels, whose missing threes have to come from somewhere. The percentages are the limitation: 48.0% FG is ordinary for a big, and 75.7% FT does not help a fragile line. Our Top 150 has him 37th against Yahoo ADP near 55. I like that fifth-round price when the early picks already supply efficient volume.' },
      { name: 'Desmond Bane', yahooAdp: 52.9, yahooPreRank: 44, note: 'Bane can make a defensive specialist affordable in ways that the punt rankings alone will miss. His 90.8% FT on 4.2 attempts supplies real support for a Daniels or Duren pick, and 48.3% FG is much easier to accommodate than White\'s shooting. He also gave you 4.1 assists and two threes, so you are getting more than a percentage specialist. The cost is that a meaningful part of his ordinary value comes from his 20.1 points, which this team is choosing to deprioritize. I would take White first if blocks are the pressing need, but Bane is the more comfortable choice when your bigs already cover defense and the free-throw total needs help. His 82-game season is another reason to like him after a riskier opening.' },
      { name: 'Jaren Jackson Jr.', yahooAdp: 50.5, yahooPreRank: 54, note: 'Jackson still gives you blocks and threes from the same frontcourt slot, but the name can create expectations that last season\'s line did not meet. He averaged 1.4 blocks and 5.7 rebounds; that is useful defense, not enough to carry both big-man categories on its own. His 1.8 threes and 80.3% FT make him easier to pair with a non-shooting center, which is the stronger argument at this price. Knee surgery ended his season, and he played only 48 games, so the possibility of a defensive rebound has to be weighed against availability. Buzelis actually supplied slightly more threes and blocks last year at a later Yahoo price. I would choose Jackson when I value his free throws and am comfortable with the health risk, rather than paying for his old block reputation.' }
    ] },
    { round: 6, candidates: [
      { name: 'Dyson Daniels', yahooAdp: 62.9, yahooPreRank: 20, note: 'Daniels is one of the players this punt is built to use. A guard giving you 6.8 rebounds, 5.9 assists and two steals with only 1.8 turnovers can improve several categories that usually require separate picks. His 51.7% FG helps too. The 61.5% FT looks alarming, but it came on 1.6 attempts; with Bane or Shai supplying accurate volume, it is a cost you can plan around. The harder hole to fill is 0.3 threes, particularly if Amen or Barnes is already on the roster. Compared with Wallace, Daniels supplies much more passing and rebounding, so he is worth the earlier pick when you need all three contributions. His ADP near 63 is attractive against our rank of 33, although Yahoo\'s default order puts him high enough that some rooms will never let him get there.' },
      { name: 'OG Anunoby', yahooAdp: 66.6, yahooPreRank: 60, note: 'Anunoby is often the better pick than the next specialist because he helps the categories that specialist would make harder. His 2.3 threes come alongside 1.6 steals and 0.7 blocks, so you can add shooting without giving back the defensive advantage you have been building. He also shot 48.4% FG and 82.8% FT, making him easier to place next to Daniels or Clingan than another poor shooter. The 2.2 assists will not repair a roster that lacks creation, and 67 games keep durability from being a guarantee. Around the sixth round, though, I would be comfortable prioritizing him over a bigger name whose main attraction is scoring. His line addresses several needs that tend to appear together in this build.' },
      { name: 'Matas Buzelis', yahooAdp: 61.9, yahooPreRank: 34, note: 'The useful part of a Buzelis breakout for this team is already visible. He averaged 2.2 threes and 1.5 blocks in 29.2 minutes, with 5.8 rebounds to keep the rest of the line useful. You do not need to predict a jump to 20 points for that combination to matter. Compared with Jackson, he supplied a little more shooting and rim protection last season and played 77 games, although he lacks Jackson\'s established track record. The less comfortable side is 46.3% FG, 78.6% FT and 2.1 turnovers. More offensive responsibility would not automatically improve those numbers. I like him around the fifth/sixth-round boundary when blocks and threes are both short; after White, I would want a stronger FG% base before adding another player who could leave that category exposed.' }
    ] },
    { round: 7, candidates: [
      { name: 'Mikal Bridges', yahooAdp: 79.6, yahooPreRank: 41, note: 'Bridges is a useful answer to a draft that has become too risky or too careless with the ball. His 3.7 assists came with only one turnover, and he added 1.3 steals, 0.8 blocks and 1.9 threes while playing all 82 games. Those contributions are easy to overlook beside a 14.4-point average, but nearly all of them matter here. Shooting 49.0% also makes him a comfortable follow-up to White. His 82.7% FT sounds helpful, yet just 1.2 attempts means he cannot rescue a team that has collected several weak free-throw shooters. Anunoby is the stronger steals-and-threes choice; Bridges offers more passing and a recent record of staying on the floor. That is a sensible seventh-round tradeoff for a team already carrying an injury risk.' },
      { name: 'Payton Pritchard', yahooAdp: 79.6, yahooPreRank: 33, note: 'One of the better ways to finish the backcourt after drafting Barnes or Amen. Pritchard made 2.7 threes and handed out 5.2 assists with only 1.4 turnovers, giving you the shooting those forwards leave short while helping you stay competitive in assists. That is close to White\'s offensive line several rounds later. White earns the higher pick through his blocks; Pritchard\'s advantage is a much easier FG% to absorb, at 46.3% against White\'s 39.5%. Boston\'s return to a Tatum-led offense, with George replacing Brown, could reduce his opportunities to create. I would be happy with something close to last season\'s role at his price around pick 80. Just avoid treating his 89.0% FT as a cure for a weak team percentage: on 1.7 attempts, he cannot do the work of a Bane or Shai.' }
    ] },
    { round: 8, candidates: [
      { name: 'Jaden McDaniels', yahooAdp: 89.2, yahooPreRank: 43, note: 'McDaniels lets you add blocks while keeping a wing slot productive in the percentages. He shot 51.5% FG and 83.5% FT with 1.1 steals and one block, which makes him a comfortable partner for White or a weak-FT center. His 1.4 threes are useful, though Anunoby supplies considerably more shooting. Minnesota\'s addition of Ball changes the offensive hierarchy, but McDaniels does not need a large share of the offense for this build to work; the minutes he earns through defense are more important. Be careful about counting him as a rebounder just because he is a long forward. At 4.2 boards a game, he is better used to complement your centers than to replace one.' },
      { name: 'Jabari Smith Jr.', yahooAdp: 94.1, yahooPreRank: 84, note: 'Smith is useful when you need a forward to keep threes competitive without giving away too much rebounding. His 2.3 threes and 6.9 boards came with 0.9 blocks and only 1.4 turnovers, a combination that fits comfortably after an opening built around passing. He already played 35.1 minutes, so a fantasy improvement needs to come from better production in those minutes rather than an easy workload increase. The 45.0% FG and 77.5% FT are the reason I would hesitate after several inefficient shooters. Buzelis gives you more blocks at an earlier price; Smith offers more rebounding and better ball security. Choose him when those are the gaps, with little need to predict a scoring breakout in Houston\'s crowded offense.' },
      { name: 'Josh Hart', yahooAdp: 96.3, yahooPreRank: 68, note: 'Hart gives you rebounding from a position where most available players are trying to help through scoring and threes. His 7.4 boards were almost level with Barnes, and 4.8 assists with 1.9 turnovers add useful secondary creation. The 50.8% FG is helpful too. He is much less useful if what you really need is another defensive specialist: 1.1 steals are respectable, but 0.3 blocks will not replace a missing big. His 72.0% FT came on 1.9 attempts, a manageable drag when the rest of the line is strong. I like Hart after a shooting-heavy start that needs boards and passing; after Amen and Daniels, his modest 1.5 threes leave too much of the same work for someone else.' }
    ] },
    { round: 9, candidates: [
      { name: 'Myles Turner', yahooAdp: 100.3, yahooPreRank: 108, note: 'Turner is worth considering before you leave all of the remaining blocks work to Huff. Last season he made 2.1 threes and blocked 1.6 shots, a useful combination for a team that spent its early picks on passing forwards. The 11.9 points are no concern here, but the other weaknesses still matter: 5.3 rebounds, 44.0% FG and 74.0% FT are a disappointing percentage-and-rebounding package from a center. I would use him beside an efficient rebounder such as Jokić or Duren, with free throws already supported. Milwaukee\'s changed frontcourt adds uncertainty about his workload, so the case is strongest around his ninth-round ADP. He is a way to buy blocks and shooting together, with a clear cost in the categories traditional centers usually help.' },
      { name: 'Jalen Suggs', yahooAdp: 111.4, yahooPreRank: 89, note: 'Suggs becomes appealing when you reach the later rounds and still need both assists and steals. His 5.5 assists and 1.8 steals came with 2.1 threes, so he offers a much better shooting balance than adding another Daniels-type guard. His 85.5% FT helps too, although the volume is modest. The concern is that this is not a particularly clean possession-by-possession line: 43.5% FG and 2.7 turnovers can eat into the advantages of a careful early draft. He also played 57 games. I would choose him over Wallace when the passing is needed, and Wallace when steals are the main job. Yahoo\'s ADP near 111 gives you time to assess that need, provided your room does not follow his earlier default rank.' },
      { name: 'Andrew Wiggins', yahooAdp: 100.7, yahooPreRank: 103, note: 'Wiggins offers a practical alternative when the earlier defensive wings are gone. His two threes, 1.1 steals and one block cover much of the same territory, although 47.5% FG is less helpful than McDaniels\' shooting. Giannis is now in Miami, so there is little reason to pay for a scoring jump; the useful question is whether Wiggins keeps the minutes and defensive production of a complementary wing. His 1.5 turnovers make the existing line easy to fit around Johnson or another primary passer. Free throws are merely tolerable at 78.4%, so I would prefer McDaniels if that percentage is already tight. Around pick 100, Wiggins is a reasonable way to keep both threes and blocks alive.' }
    ] },
    { round: 10, candidates: [
      { name: 'Cason Wallace', yahooAdp: 118.2, yahooPreRank: 76, note: 'Wallace is a much easier player to carry once you stop needing him to score. His two steals came with just 0.9 turnovers, allowing him to help at both ends of a possession while other guards handle the creation. That distinction matters: 2.6 assists will not solve a shortage of point-guard production. He is a particularly good companion for Jokić, whose passing lets you use a guard slot this way. Compared with Ausar, Wallace supplies more threes and a far less damaging free-throw percentage, so the defensive gain is easier to fit into a single punt. He still shot only 43.2% from the field, albeit on 7.6 attempts. Near the end of round ten, I would take him for steals and turnovers, without needing an offensive breakout.' },
      { name: 'Tre Jones', yahooAdp: 116, yahooPreRank: 156, note: 'Jones deserves more attention in this build than his general ranking suggests. He produced 5.4 assists with 1.4 turnovers, shot 55.3% FG and made 84.1% of his free throws on 3.5 attempts. Those percentages have enough volume to matter, especially after you have added a lower-efficiency guard. The main sacrifice is shooting from outside: 0.6 threes makes him difficult to pair with several other non-shooters. Chicago still has Giddey to handle a large share of the creation, so I would not project Jones as an unrestricted lead guard. His existing line is enough to make the argument. If assists and FG% are your last two needs, I would consider him around his ADP near 116 rather than insist on waiting until his overall rank of 130.' }
    ] },
    { round: 11, candidates: [
      { name: 'Reed Sheppard', yahooAdp: 120.8, yahooPreRank: 56, note: 'Sheppard is the late guard to look for when the early defense has left you short of threes. He made 2.8 per game while adding 1.5 steals and 0.7 blocks, enough defensive help that the shooting does not require a major change in direction. Wallace offers more steals and fewer turnovers, but less than half as many threes. The reason Sheppard remains a later pick is the workload question with VanVleet expected back; last season\'s 26.2 minutes and 82 games are a useful record, not a guaranteed role. His 43.0% FG is another reason to surround him with efficient finishers. Around the tenth/eleventh-round turn, I prefer that upside for a team which already has passing and can absorb the shooting percentage.' },
      { name: 'Ayo Dosunmu', yahooAdp: 114.9, yahooPreRank: 96, note: 'Dosunmu is a useful last guard when the roster needs better shooting percentages rather than another specialist in steals. He made 51.7% of his field goals and 87.6% of his free throws, with 1.8 threes and only 1.4 turnovers. That gives him a quieter route to helping than a guard who needs heavy usage to accumulate assists. The Minnesota rotation is the main obstacle: with Ball and Edwards together, Dosunmu has competition for both minutes and ballhandling. A repeat of his 27.3-minute workload would be enough to keep him interesting, but I would not assume a larger role. He fits after a White or Suggs pick when the existing defense is sound and the percentages need some support.' },
      { name: 'Brandin Podziemski', yahooAdp: 116.8, yahooPreRank: 99, note: 'Podziemski is useful when the roster has several small shortages rather than one glaring hole. His 5.1 rebounds, 3.7 assists and 1.9 threes cover more ground than a specialist who only blocks shots or steals the ball. He also played all 82 games and kept turnovers to 1.6, which is appealing after a few less dependable selections. The percentages explain why I would not choose him simply to make the team safer: 45.5% FG and 79.7% FT offer little protection. If assists are the main problem, Jones gives you more; if threes are urgent, Sheppard supplies more. Podziemski makes sense when you need a little of both plus guard rebounding, and he reaches the late tenth or early eleventh.' }
    ] },
    { round: 12, candidates: [
      { name: 'Neemias Queta', yahooAdp: 115.2, yahooPreRank: 116, note: 'Queta can still help a roster that reaches the final rounds without enough efficient rebounding. He shot 65.3% from the field, collected 8.4 boards and blocked 1.3 shots with about one turnover. The volume is worth noticing: those field goals came on 6.6 attempts, so he will have less influence over FG% than Duren despite the similar accuracy. Boston has added Mitchell Robinson, creating real competition for center minutes after Queta\'s 25.3-minute season. That is why I would want a discount from Yahoo\'s price near 115. His 70.3% FT and almost nonexistent threes also rule out using him as a universal final pick. He belongs here if he slips and your remaining need is specifically FG%, rebounds and blocks.' },
      { name: 'Jay Huff', yahooAdp: null, yahooPreRank: null, note: 'Getting 1.9 blocks and 1.5 threes from a player who barely scores is exactly the kind of trade this build can make. Huff produced that line in 21 minutes a game and appeared in all 82, so he has shown he can contribute without a starter\'s workload. Zubac is now ahead of him in Indiana, however, and there is a difference between maintaining a smaller role and being squeezed out of useful minutes. The other limitation is easy to miss: Huff averaged four rebounds and shot 47.6% FG. He will not replace the rebounding or efficiency you normally want from a center. I like him as a final pick beside an established rebounder, with his threes giving him an edge over a pure block specialist. If you are still chasing boards, Queta addresses that need more directly.' }
    ] }
  ],
  faqs: [
    { q: 'Am I wasting an early pick on a player who scores a lot?', a: 'Some of the scoring value will go unused, but the rest of the line can still justify the pick. Jokić gives you elite passing from center; Wembanyama supplies an exceptional block advantage; Shai has enough accurate shooting volume to support several specialists. Take that foundation when the price is right. The punt becomes a mistake when you pass on a better overall contribution simply to find someone with a lower points average.' },
    { q: 'Can I combine Amen Thompson and Dyson Daniels?', a: 'Yes, if the rest of the roster can supply the shooting. Together they offer excellent guard rebounding and passing, but only about half a three per game between them. The FT% problem is more manageable than the individual percentages suggest because Daniels takes relatively few attempts. A Shai or Bane can provide useful support at the line; White, Anunoby and a shooting big can keep threes competitive. Without that support, the pair can push the team toward more category concessions than you intended.' },
    { q: 'Why not just load up on Gobert, Ausar and other defensive specialists?', a: 'Their defense still has value, but removing points does nothing to remove weak free throws or missing threes. Several such players together can leave you needing to win almost every remaining category each week. Wallace is often easier to fit when steals are the goal, while Holmgren or Okongwu can add frontcourt defense and some shooting. Choose the specialist whose weaknesses your existing roster can absorb.' },
    { q: 'What should I stream once the draft is over?', a: 'Use the open spot for the closest winnable category. If rebounds and blocks are already comfortably ahead, another center may do less than a guard who can add threes or steals. Turnovers and percentages need particular care late in a matchup: extra games can hurt as well as help. An open slot does not have to be filled when the additional attempts or turnovers would put a category lead at risk.' },
    { q: 'Does this work in eight-category leagues or roto?', a: 'In eight-category head-to-head leagues, the idea still works, but you lose the turnover advantage that makes players such as Wallace and Pritchard attractive. High-usage passers become easier to draft, and you should reassess the player order with turnovers removed. In roto, a season-long concession in points costs standings points that must be recovered elsewhere. This guide and its sample teams are aimed at weekly head-to-head matchups, where you can build a more direct route to five category wins.' }
  ]
};

export const PUNT_GUIDES = [PUNT_FT, PUNT_ASSISTS, PUNT_FG, PUNT_THREES, PUNT_POINTS];
