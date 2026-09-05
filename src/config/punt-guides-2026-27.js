// Punt build guides for the 2026-27 season.
//
// Split out of guides-content.js because a written punt guide runs 200+ lines
// and six of them would bury the four rankings guides in the same file. The
// shape is identical to punt-blocks, which stays in guides-content.js as the
// free, indexable reference build:
//
//   sections        the prose. `freeSections` of them are shown to everyone.
//   board           config for the live re-ranked <RankingTable>.
//   buildingBlocks  the archetypes the build is assembled from.
//   exampleTeams    two blueprints, rendered with <TeamRadar>.
//   roundTargets    12 rounds x 3 candidates, feeding <DraftBuilder>.
//   faqs            free for everyone — structured-data.js emits these as
//                   public FAQ JSON-LD, so gating them would be cloaking.
//
// Player names must match player_period_averages exactly: <TeamRadar> and
// <DraftBuilder> look up each name against the live board, and a spelling that
// misses simply renders without its stat line.
//
// Every per-game number quoted below is that player's real 2025-26 line from
// the same table the rankings tool reads.

import { CONTENT_SEASON } from './season.js';

const SEASON = CONTENT_SEASON;

export const PUNT_FT = {
  slug: 'punt-ft',
  type: 'punt',
  puntKey: 'ft',
  title: 'Punt FT%',
  season: SEASON,
  difficulty: 'Beginner',
  isPremium: true,
  tagline:
    'Give up the line, and the most productive big men in the league start falling to you rounds late.',
  strengths: ['blk', 'reb', 'fg', 'pts'],
  weaknesses: ['ft', '3pm', 'ast'],

  // Premium guide: the strategy and the strengths/weaknesses sections are
  // public, the rest is the pass. Two rather than one because the crawlable
  // block in seo-content.js summarises both, and serving a crawler a paragraph
  // the visitor cannot read is cloaking — the two numbers have to agree. It is
  // also the better teaser: what a buyer is paying for is the round-by-round
  // board, not a description of which categories the build wins.
  freeSections: 2,
  board: { minGames: 30, freeLimit: 20, previewRows: 4 },

  sections: [
    {
      id: 'strategy',
      heading: 'The strategy',
      body: [
        "Punt free-throw percentage is the most forgiving build in nine-category fantasy, and it is the one most managers back into by accident. The reason is simple: the players who wreck your free-throw percentage are, almost without exception, the players who win you blocks, rebounds and field-goal percentage. Those four traits travel together in one body type, and the market prices that body type with a discount attached for the line. Decide in advance that you do not care about the line, and you are the only manager in the room drafting those players at full value.",
        "It is also the cheapest punt to commit to, because free-throw percentage is the category most easily ruined by a single roster spot. One big taking nine attempts a night at 65 percent can drag a whole team under water, which means most managers spend the middle rounds carefully avoiding a group of players you are free to collect. You are not fighting anyone for them.",
        "The trap is thinking the build is only centers. A roster of nothing but bigs wins blocks, rebounds and field-goal percentage by a mile and then loses threes, assists and steals by the same margin, which is a 4-5 loss most weeks. The build works when the frontcourt is the discount and the backcourt is bought deliberately.",
      ],
    },
    {
      id: 'correlation',
      heading: 'Natural strengths & weaknesses',
      body: [
        "Conceding free-throw percentage hands you three categories almost automatically. Blocks and rebounds are the scarcest counting stats on the board and they concentrate in exactly the players you are now free to draft. Field-goal percentage comes with them, because a center who cannot shoot from the line usually scores from two feet.",
        "Points are the quiet fourth. Efficient bigs score more than their reputation suggests — Giannis Antetokounmpo put up 27.6 a night on 62.4 percent shooting, Zion Williamson 21.0 on 60.0 percent — and none of that production costs you anything in a build that has already written off the line.",
        "The bill comes due on the perimeter. Threes and assists are the two columns your frontcourt supplies almost none of, and turnovers can quietly become a fourth problem if you stack high-usage bigs who pass out of double teams. Treat threes and assists as categories you have to buy on purpose, in the middle rounds, before the shooters are gone. A punt build that concedes free throws is strong; one that concedes free throws, threes and assists has punted three categories and cannot win.",
      ],
    },
    {
      id: 'draft',
      heading: 'Where the value sits in the draft',
      body: [
        "The value in this build is not at the top. The first two rounds of a punt-FT board look much like anyone else's, because the best players in the league are the best players in every build — the re-rank moves them a few slots, not a round. What changes is the middle. From roughly pick 60 onward the board diverges sharply from consensus, because that is where the free-throw discount is doing the most work on price.",
        "The live table below re-ranks every player with free-throw percentage struck out of the value total. Sort it and read the middle rounds carefully: the players who climb hardest are the ones your league-mates have quietly crossed off. Those crossings-off are your entire edge, and they only exist for as long as everyone else is still trying to win the category.",
        "One discipline to hold to: take the best player available for the first three or four rounds, exactly as you would in any build. Punt-FT does not reward reaching. It rewards being the only manager willing to take a 55-percent free-throw shooter at his actual value in round six.",
      ],
    },
  ],

  buildingBlocks: [
    {
      name: 'Low-line, high-impact centers',
      note: 'Blocks, rebounds and field-goal percentage in a single slot, priced down entirely by a column you no longer score.',
    },
    {
      name: 'Defensive wings',
      note: 'Steals and blocks from players whose free-throw volume is too low to matter to anyone, so you get them at market price.',
    },
    {
      name: 'Two bought shooters',
      note: 'The build has one real hole. Spend middle-round picks on volume threes and assists before the run starts, not after.',
    },
  ],

  exampleTeams: [
    {
      name: 'Full frontcourt',
      color: '#2f80ed',
      note: 'Maximum blocks, rebounds and field-goal percentage. Wins four categories outright most weeks and needs the waiver wire for threes — the aggressive version of the build.',
      roster: [
        'Giannis Antetokounmpo',
        'Evan Mobley',
        'Alperen Sengun',
        'Alex Sarr',
        'Donovan Clingan',
        'Jalen Duren',
        'Rudy Gobert',
        'Nic Claxton',
      ],
    },
    {
      name: 'Balanced punt-FT',
      color: '#16a085',
      note: 'The safer build: an elite frontcourt core with two defensive playmakers and enough perimeter production to stay competitive in threes and assists rather than conceding them.',
      roster: [
        'Nikola Jokić',
        'Victor Wembanyama',
        'Scottie Barnes',
        'Jalen Johnson',
        'Amen Thompson',
        'Dyson Daniels',
        'Bam Adebayo',
        'Zion Williamson',
      ],
    },
  ],

  roundTargets: [
    {
      round: 1,
      candidates: [
        {
          name: 'Giannis Antetokounmpo',
          note: "The signature pick of the build, and the clearest example of why it exists. Giannis shot 65.0 percent from the line on 9.9 attempts a night — the single most destructive free-throw line in fantasy, and the only reason a player producing 27.6 points, 9.8 rebounds and 5.4 assists on 62.4 percent shooting is ever available at a discount. Remove that column and you are drafting a top-two overall player at a top-eight price. The 3.2 turnovers are the real cost; plan the rest of the roster around ball-secure pieces.",
        },
        {
          name: 'Nikola Jokić',
          note: "The best player in every build, this one included, and he is not a compromise here. Jokić posts 27.7 points, 12.9 rebounds and 10.7 assists on 56.9 percent shooting, and his 83.1 percent from the line is simply value you decline to use. What he actually does for punt-FT is fix its two structural holes — he is the rare frontcourt player who wins assists by himself, which frees your middle rounds to chase threes instead.",
        },
        {
          name: 'Evan Mobley',
          note: "The purest first-round punt-FT asset after Giannis. Mobley's 60.6 percent from the line is bad enough to sink an ordinary roster and is worth nothing against you here, while 18.2 points, 9.0 rebounds and 1.7 blocks on 54.6 percent shooting land squarely in the three categories the build is built to win. Low turnovers (1.9) for a player with his usage, and he played 65 games.",
        },
      ],
    },
    {
      round: 2,
      candidates: [
        {
          name: 'Alperen Sengun',
          note: "A 69.1-percent free-throw shooter on 5.2 attempts, which is exactly the profile the rest of the league is discounting. What you get is 20.4 points, 8.9 rebounds, 6.2 assists and 1.1 blocks on 51.9 percent shooting — a center who wins assists, which is the scarcest thing a frontcourt player can do for this build. The 3.2 turnovers are the tax, and they are worth paying for the category coverage.",
        },
        {
          name: 'Chet Holmgren',
          note: "17.1 points, 8.9 rebounds and 1.9 blocks on 55.7 percent shooting, with a 79.2 percent line that is mildly negative on 4.1 attempts and irrelevant here. He is the cleanest kind of pick in this build: nothing about him is a compromise, he just costs slightly less than he should because his free throws are not helping anyone. Only 1.6 turnovers.",
        },
        {
          name: 'Alex Sarr',
          note: "Two blocks a night is a category win from one roster spot, and 69.2 percent from the line on 3.0 attempts is the discount that makes him affordable. 16.3 points, 7.4 rebounds and 48.2 percent shooting across 48 games — the games played are the risk, not the production. If the minutes hold he is a top-30 asset in this build.",
        },
      ],
    },
    {
      round: 3,
      candidates: [
        {
          name: 'Donovan Clingan',
          note: "11.5 rebounds and 1.7 blocks in only 27 minutes a night, on 52.1 percent shooting and just 1.2 turnovers, with a 69.2-percent line on 2.5 attempts that costs you nothing. He scores 12.1 points and that is fine — this is a two-category monster you are buying at a two-category price, and he played 77 games doing it.",
        },
        {
          name: 'Jalen Duren',
          note: "65.0 percent from the floor on 11.5 attempts is an enormous field-goal contribution, and it comes with 10.5 rebounds and 19.5 points. His 74.7 percent from the line on 6.1 attempts is the only thing keeping him out of the second round in standard formats. Zero threes, so pair him with shooters, but as a pure punt-FT anchor there is nothing here to dislike.",
        },
        {
          name: 'Dyson Daniels',
          note: "The perimeter half of the build, available because of a 61.5-percent free-throw line that will never matter to you. Two steals a night is a category won single-handedly, and 6.8 rebounds and 5.9 assists from a guard patch the exact holes a big-heavy roster opens. 51.7 percent shooting on low volume keeps your field-goal percentage honest. Take him before the steals run.",
        },
      ],
    },
    {
      round: 4,
      candidates: [
        {
          name: 'Jaren Jackson Jr.',
          note: "1.4 blocks and 19.4 points on 47.6 percent shooting, with 1.8 threes — genuinely rare for a big, and precisely the shape that keeps this build from collapsing in the three-point column. His 80.3 percent line is neutral. The 48 games played is the reason he lasts this long; if you can absorb the availability risk he is a round-three talent.",
        },
        {
          name: 'Pascal Siakam',
          note: "69.3 percent from the line on 6.1 attempts is a real drag in most builds and free money in this one. Underneath it sits 24.0 points, 6.6 rebounds and 1.1 steals on 48.4 percent shooting — a full starter's line with no category you have to manage around. One of the cleanest value gaps on the punt-FT board.",
        },
        {
          name: 'Cooper Flagg',
          note: "21.0 points, 6.7 rebounds, 4.5 assists, 1.2 steals and 0.9 blocks across 70 games. He is not a punt-FT special — the 82.7 percent line is fine — but he is the kind of broad contributor the build needs to stay competitive in the columns your centers ignore, and he supplies a little of everything without hurting field-goal percentage badly.",
        },
      ],
    },
    {
      round: 5,
      candidates: [
        {
          name: 'Myles Turner',
          note: "1.6 blocks in 27 minutes with 2.1 threes a night — the single most useful combination available to this build, because he covers its worst category from a frontcourt slot. 74.0 percent from the line on 2.5 attempts is a mild negative you have already written off. The 11.9 points and 44.0 percent shooting are the price of the shooting volume.",
        },
        {
          name: 'Nikola Vučević',
          note: "8.4 rebounds, 1.6 threes and 49.3 percent shooting from a center, with only 1.3 turnovers. He is here because his 82.8 percent line is genuinely good and therefore wasted on you — meaning the market is pricing something you cannot use, which is the mirror image of a discount but works out the same way at this point in the draft.",
        },
        {
          name: 'Matas Buzelis',
          note: "1.5 blocks and 2.2 threes from a forward across 77 games, on 46.3 percent shooting. A useful, cheap version of the Turner profile — blocks and three-point volume from the same roster spot, which is how a punt-FT roster stays out of a 3-6 hole. 78.6 percent from the line is a non-factor.",
        },
      ],
    },
    {
      round: 6,
      candidates: [
        {
          name: 'Zion Williamson',
          note: "60.0 percent from the floor on 13.0 attempts is one of the largest single-player field-goal contributions in the league, and his 71.6 percent line on 7.5 attempts is the entire reason he is available here. 21.0 points and 5.7 rebounds on top. Zero threes and a health history are the real objections; the free-throw objection is one you have already answered.",
        },
        {
          name: 'Ausar Thompson',
          note: "57.1 percent from the line, and it costs you nothing. What is left is 2.0 steals, 0.9 blocks, 5.7 rebounds and 52.5 percent shooting across 73 games — a defensive category machine at a price set almost entirely by the column you punted. The 9.9 points and 0.1 threes mean he is a specialist, so take him knowing which two columns he is for.",
        },
        {
          name: "Kel'el Ware",
          note: "9.0 rebounds and 1.1 blocks in 22 minutes a night on 53.0 percent shooting, with almost no turnovers. Per-minute this is a top-40 line, and the only thing between him and that valuation is playing time. 74.0 percent from the line on barely one attempt makes him free in every sense that matters here.",
        },
      ],
    },
    {
      round: 7,
      candidates: [
        {
          name: 'Jarrett Allen',
          note: "63.8 percent shooting on 9.4 attempts with 8.5 rebounds and 15.4 points — an efficiency and rebounding anchor whose 70.9 percent free-throw line on 4.7 attempts is doing all the work in suppressing his price. In a build that scores field-goal percentage and ignores the line, he is comfortably a round earlier than this.",
        },
        {
          name: 'P.J. Washington',
          note: "68.7 percent from the line, 1.1 blocks, 7.0 rebounds and 1.4 threes on 45.0 percent shooting. A tidy fit: he covers the frontcourt categories, chips into threes rather than zeroing them, and carries a free-throw problem that is the only reason he is still on the board.",
        },
        {
          name: 'Jaden McDaniels',
          note: "1.0 blocks, 1.1 steals and 51.5 percent shooting from a wing, with 1.4 threes. He is the connective tissue of the build — defensive counting stats and efficiency without the center-slot cost, so you can run him alongside two bigs and still field a lineup.",
        },
      ],
    },
    {
      round: 8,
      candidates: [
        {
          name: 'Rudy Gobert',
          note: "52.6 percent from the line on 4.0 attempts is one of the most damaging free-throw lines in the NBA and the sole reason a player shooting 68.2 percent from the floor with 11.5 rebounds and 1.6 blocks across 76 games is available in round eight. For this build specifically he is a cornerstone being sold as a liability. Zero threes and 10.9 points mean he is a three-category specialist — but they are three of your four best categories.",
        },
        {
          name: 'Jay Huff',
          note: "1.9 blocks in 21 minutes a night across all 82 games, with 1.5 threes attached. Blocks and threes from one bench big is an unusual combination and an efficient way to patch the build's weakest column. 82.8 percent from the line is wasted on you, which is fine — you are paying for the swats.",
        },
        {
          name: 'Cason Wallace',
          note: "2.0 steals a night on 43.2 percent shooting with just 0.9 turnovers. A pure category specialist: he wins steals and stays out of the way everywhere else, which is exactly what a frontcourt-heavy roster needs from a late guard slot. Low free-throw volume means he neither helps nor hurts a column you are not scoring.",
        },
      ],
    },
    {
      round: 9,
      candidates: [
        {
          name: 'Al Horford',
          note: "1.1 blocks and 1.6 threes in 22 minutes, on a roster spot that costs nothing this late. The same blocks-plus-shooting shape as Turner and Huff, at a fraction of the price — this build wants two or three of that archetype and this is the cheapest place to find one.",
        },
        {
          name: 'Stephon Castle',
          note: "7.4 assists and 5.3 rebounds from a guard shooting 47.1 percent, with a 73.4 percent free-throw line on 5.6 attempts that has pushed him down every other manager's board. Assists are the category your centers cannot supply, and this is the last round where you can buy seven of them cheaply. The 3.2 turnovers are the cost.",
        },
        {
          name: 'Russell Westbrook',
          note: "6.6 assists, 5.4 rebounds and 1.3 steals, with a 68.7 percent line that is pure discount here. He hands you assists and steals in one slot — the two columns a big-heavy roster is most likely to lose — and the 3.3 turnovers are the reason he is cheap. Fine if your first three picks were low-turnover.",
        },
      ],
    },
    {
      round: 10,
      candidates: [
        {
          name: 'Nic Claxton',
          note: "1.1 blocks, 6.9 rebounds and 3.7 assists on 57.1 percent shooting, with a 61.6 percent free-throw line that makes him unrosterable in a standard build and nearly free in this one. The assists from a center are a genuine bonus. There is very little reason he should still be available in round ten to a manager who has punted the line.",
        },
        {
          name: 'Ivica Zubac',
          note: "10.5 rebounds and 60.0 percent shooting on 9.9 attempts — real double-digit boards and a meaningful field-goal contribution, held down by 72.1 percent from the stripe. Zero threes and 0.4 steals make him narrow, but the two columns he fills are two you intend to win outright.",
        },
        {
          name: 'Aaron Gordon',
          note: "49.7 percent shooting with 5.8 rebounds and 1.7 threes across a 36-game sample. The three-point volume from a frontcourt slot is what earns him the pick — availability is the obvious risk, and it is the only thing keeping him here.",
        },
      ],
    },
    {
      round: 11,
      candidates: [
        {
          name: 'Wendell Carter Jr.',
          note: "7.4 rebounds and 51.2 percent shooting in 29 minutes across 78 games, with 0.6 blocks. Not exciting, but durable and positively contributing to three of your categories at a price where most players contribute to one.",
        },
        {
          name: 'Kyle Filipowski',
          note: "7.2 rebounds and 49.2 percent shooting in only 23 minutes, on a 75.0 percent line. Per-minute production with a plausible path to more, which is the right kind of late-round bet in a build that wants rebounding volume above all.",
        },
        {
          name: 'John Collins',
          note: "55.1 percent shooting with 5.3 rebounds and 0.7 blocks. Efficient scoring from the frontcourt at no cost to the columns you care about, and the 76.5 percent line on 2.2 attempts is the sort of mild negative that pushes a player two rounds past where this build values him.",
        },
      ],
    },
    {
      round: 12,
      candidates: [
        {
          name: 'Neemias Queta',
          note: "65.3 percent shooting, 8.4 rebounds and 1.3 blocks in 25 minutes across 76 games. A last-round center who moves three categories, available this late because 70.3 percent from the line and a bench role keep him off most boards entirely.",
        },
        {
          name: 'Brook Lopez',
          note: "1.2 blocks and 1.5 threes in 22 minutes — the blocks-and-shooting archetype one final time, at the very end of the draft. Take him if your roster is short of either column, which after eleven rounds of this build it usually is.",
        },
        {
          name: 'Jalen Smith',
          note: "6.7 rebounds and 0.8 blocks in 21 minutes on 48.3 percent shooting. Pure rebounding depth for the last pick, and the kind of player you turn over aggressively once the season starts and rotations settle.",
        },
      ],
    },
  ],

  faqs: [
    {
      q: 'Is punt FT% a good strategy for a beginner?',
      a: 'It is the best punt to learn on. The players it targets are easy to identify — big men with bad free-throw lines — and the categories it wins, blocks and rebounds, are the two hardest to fix later in the season. It also fails gracefully: even a poorly executed punt-FT roster usually wins field-goal percentage and rebounds.',
    },
    {
      q: 'Do I have to avoid good free-throw shooters entirely?',
      a: 'No. Punting a category means you stop paying for it, not that you avoid it. If the best player available happens to shoot 90 percent from the line, take him — you are simply not counting that part of his value when you compare him to the alternatives.',
    },
    {
      q: 'What usually kills a punt FT% team?',
      a: 'Threes and assists. The frontcourt players this build collects supply almost none of either, and managers who keep taking centers because they keep looking like value end up conceding three categories instead of one. Buy two shooters and one playmaking guard in the middle rounds, before the run on them starts.',
    },
    {
      q: 'Does punt FT% work in 8-cat leagues?',
      a: 'Yes, and slightly better. Dropping turnovers removes the main tax on high-usage bigs like Giannis Antetokounmpo and Alperen Sengun, who are already the centrepieces of the build.',
    },
  ],
};

export const PUNT_GUIDES = [PUNT_FT];
