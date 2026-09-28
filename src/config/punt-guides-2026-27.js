// Punt FT% guide for 2026-27.
// Historical board: corrected 2025-26 season values with FT% removed.
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

export const PUNT_GUIDES = [PUNT_FT];
