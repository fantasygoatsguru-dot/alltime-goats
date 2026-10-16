// Projected 9-cat draft top 150 for the 2026-27 season.
//
// This is a 2026-27 projection, refreshed against corrected 2025-26 results.
// The order uses corrected 2025-26 nine-category value, Yahoo standard rank and
// ADP, plus editorial adjustments for health, role and team changes. Players
// whose value depends on a punt are placed at the price their likely punt build
// can justify. Yahoo market data is a dated snapshot, not a stat projection.
//
// The rows are keyed by `name`; <ProjectionList> matches them against
// player_period_averages for `PRIOR_SEASON` to show last season's actual line
// underneath the projection. A name that doesn't match simply renders without
// the line (that's the intended behaviour for players who missed the season —
// Haliburton, Lillard, Irving), so keep spellings identical to the database.
//
// This is a draft board for 9-cat leagues, including build-specific prices.
// Read a punt-dependent player's note before treating his rank as neutral value.

export const PROJECTION_SEASON = '2026-27';
export const PRIOR_SEASON = '2025-26';

// The board is grouped the way it is actually used: rounds of a 12-team draft.
// `from`/`to` are derived so the grouping stays correct if the list ever grows
// past 150.
export const PICKS_PER_ROUND = 12;

const ROUND_NOTES = [
  'The first round combines broad category anchors with a few build-defining picks. Read each note before deciding which weakness your next selection must cover.',
  'The range from pick 13 to 24 mixes reliable category anchors with players whose health or role adds uncertainty. Compare the projected value with the price in your room.',
  'Strong per-game profiles remain, but category shape starts to matter more. Check whether your first two picks already cover rebounds, assists and both percentages.',
  'Several players here can beat this rank if health or a new role breaks their way. Balance that upside against the availability of your earlier selections.',
  'The middle rounds are where a balanced start can become a clear build. Look for a category contribution your roster can turn into a weekly win.',
  'New teams, changing rotations and injury returns create wider outcomes here. Read the context behind a rank before treating an ADP gap as a discount.',
  'Compare each player with your existing roster: a useful specialty can outweigh a small difference in overall value.',
  'Veterans and young starters share this range. Minutes and usage are the main variables to check again before draft night.',
  'Several picks need a specific role or clean bill of health to pay off. Favor players whose best categories still help your build.',
  'Draft for a clear category need, then check whether the likely minutes support the old per-game line.',
  'These players have more concentrated category value. A specialist can help considerably if your roster can absorb the weak spots.',
  'Focus on the role you can verify at draft time. A late pick with secure minutes is often easier to use than a higher-upside bench gamble.',
  'Final picks are flexible roster spots. Reassess roles through camp and be ready to change course when minutes become clearer.',
];

export const ROUNDS = ROUND_NOTES.map((blurb, i) => ({
  id: i + 1,
  round: i + 1,
  from: i * PICKS_PER_ROUND + 1,
  to: (i + 1) * PICKS_PER_ROUND,
  name: `Round ${i + 1}`,
  blurb,
}));

export const roundFor = (rank) => ROUNDS.find((r) => rank >= r.from && rank <= r.to);

export const RANKINGS_UPDATED_AT = '2026-10-14';
export const YAHOO_ADP_DATE = '2026-09-26';
export const YAHOO_PRERANK_DATE = '2026-10-13';

export const PLAYERS = [
  {
    "rank": 1,
    "name": "Nikola Jokić",
    "team": "DEN",
    "yahooAdp": 1.9,
    "yahooPreRank": 1,
    "note": "Still the safest first pick in fantasy basketball. Jokić is the only player on this board who is elite in points, rebounds, assists and field-goal percentage at the same time, and he adds positive free-throw value from the center slot. Last season he averaged 27.7 points, 12.9 rebounds and 10.7 assists while shooting 56.9% from the field. The 3.7 turnovers and his age are the costs, but neither is enough to take away the broadest category foundation in the draft. Compared with Wembanyama, Jokić gives up the overwhelming block advantage but supplies more than three times as many assists. That makes him the easier first pick for a balanced roto roster, while a head-to-head manager can choose either based on the categories they want to build around."
  },
  {
    "rank": 2,
    "name": "Victor Wembanyama",
    "team": "SAS",
    "yahooAdp": 1.6,
    "yahooPreRank": 3,
    "note": "The only player with a realistic path to pushing Jokić out of the top spot. His 3.1 blocks per game can tilt a matchup on their own, yet he also gives you 25 points, 11.5 rebounds and usable threes without a free-throw punt. The debate at pick one is about games played, not talent: last season's 64 games still leave some room for a healthier ceiling. Jokić offers a safer path to assists, but Wembanyama can win blocks almost alone and still cover FT%, which is unusual for a center. He is especially powerful in head-to-head categories, where a three-block night can swing a week; in roto, the games-played gap matters more."
  },
  {
    "rank": 3,
    "name": "Shai Gilgeous-Alexander",
    "team": "OKC",
    "yahooAdp": 4.1,
    "yahooPreRank": 2,
    "note": "The cleanest perimeter anchor in nine-category leagues. SGA scored 31.1 points on 55.3% shooting and made 87.9% of his free throws while adding assists and steals; 2.2 turnovers are manageable for that level of creation. Rebounds and threes are the columns to address later, but neither should stop you from taking him in the first four picks. His 6.6 assists are not Luka's 8.2, but the huge field-goal edge and lower turnovers make SGA easier to use in a balanced nine-category build. In eight-category leagues, where turnovers disappear, that particular advantage narrows and Luka becomes a closer call."
  },
  {
    "rank": 4,
    "name": "Luka Dončić",
    "team": "LAL",
    "yahooAdp": 3.5,
    "yahooPreRank": 5,
    "note": "Luka can give a team its points, threes, rebounds and assists foundation in one selection. His first full Lakers season produced 33.4 points, 4.0 threes, 7.7 boards and 8.2 assists, so a repeat would overwhelm most opponents in those categories. Four turnovers a game are the unavoidable cost; draft him with a plan to protect that column or commit to punting it. He rises relative to SGA in eight-category formats because his four turnovers no longer count, and he is an obvious anchor for a deliberate punt-turnovers build. In roto, where you must keep every category competitive, that same volume requires careful low-turnover picks later."
  },
  {
    "rank": 5,
    "name": "Giannis Antetokounmpo",
    "team": "MIA",
    "yahooAdp": 7.8,
    "yahooPreRank": 50,
    "note": "The per-game force is obvious: 27.6 points, 9.8 rebounds and 62.4% field-goal shooting even in an injury-shortened season. Miami acquired Giannis from Milwaukee in the July deal that sent Tyler Herro, Kel'el Ware and Jaime Jaquez Jr. the other way, so the Bam Adebayo pairing adds a new usage question. At 65.0% from the line on volume, his first-round price only makes sense with a punt-FT% plan, and last year's 36 games add genuine availability risk. No. 5 is an explicit build-specific valuation, not a claim that he is the fifth-safest balanced-roto pick. It assumes a punt-FT% team ready to find threes and assists around him; the availability risk remains part of that decision. Compared with Bam, Giannis provides much more FG% and scoring volume; both now have to share Miami's frontcourt possessions."
  },
  {
    "rank": 6,
    "name": "Anthony Edwards",
    "team": "MIN",
    "yahooAdp": 8.3,
    "yahooPreRank": 6,
    "note": "You know exactly which categories Edwards is meant to carry: he averaged 28.8 points and 3.4 threes, and even chipped in five rebounds from the wing. He was less helpful in assists and free-throw impact than the best first-round guards, which makes his next teammate more important than his scoring totals suggest. His 61-game season also deserves more weight than the old durability reputation. Mitchell gives more assists and stronger FT% impact, while Edwards brings the larger rebounding contribution from a wing. In a points league, Ant's scoring volume can make the choice look simpler; in nine-category leagues, his 79.6% free throws on volume have to enter the comparison."
  },
  {
    "rank": 7,
    "name": "Jayson Tatum",
    "team": "BOS",
    "yahooAdp": 9.8,
    "yahooPreRank": 14,
    "note": "Tatum looks more like a first-round option than a recovery stash now. He scored 23 points with four threes in 27 minutes on October 10. The important change is participation, not the shooting percentage in one exhibition. Last season's 16-game return supplied ten rebounds and 2.9 threes per game, and Brown's departure gives Boston a reason to lean on Tatum's creation again. He is a first-round option rather than a top-five certainty: a full season after the Achilles recovery still carries more workload uncertainty than an ordinary healthy offseason. His rebounding makes him easier to pair with an early guard than a scorer who contributes little outside points and threes.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1628369/jayson-tatum"
      }
    ]
  },
  {
    "rank": 8,
    "name": "Tyrese Maxey",
    "team": "PHI",
    "yahooAdp": 8.8,
    "yahooPreRank": 4,
    "note": "The 2025–26 line was worthy of an early first-round pick: 28.3 points, 3.1 threes, 6.6 assists and 1.9 steals, with strong free throws. Philadelphia has since added LeBron James and acquired Jaylen Brown, so projecting the same creation load would be careless. Maxey can give some of it back and still justify this rank; the risk is a larger scoring and assist dip than the new lineup requires. His 1.9 steals were nearly a full steal above Curry's mark, an important reason to keep him high even after allowing for less usage. Maxey is particularly attractive in head-to-head builds that need points and steals together; in a total-season format, his 70-game baseline also helps."
  },
  {
    "rank": 9,
    "name": "Cade Cunningham",
    "team": "DET",
    "yahooAdp": 6.2,
    "yahooPreRank": 26,
    "note": "Few players can match Cunningham's 9.9 assists while also supplying nearly 24 points and useful rebounds. Detroit will keep putting the ball in his hands, which makes the opportunities unusually secure. The 3.7 turnovers hurt in a pure nine-category build, and his free-throw impact is modest for a guard drafted this early; pair him with efficient perimeter production. Cade's 5.5 rebounds are a useful bonus from a point guard, but the turnover gap from SGA is about 1.5 per game. He jumps in eight-category leagues and in punt-turnovers builds; roto managers should pair him with low-usage wings rather than a second ball-dominant guard."
  },
  {
    "rank": 10,
    "name": "Jalen Johnson",
    "team": "ATL",
    "yahooAdp": 11.8,
    "yahooPreRank": 17,
    "note": "The value of Johnson is the shape of his line. A forward giving you 10.3 rebounds and 7.9 assists frees the rest of your draft to chase scoring and shooting without abandoning the boards. His 22.5 points help too, but 3.4 turnovers and ordinary free-throw impact keep this from being a no-questions-asked first-round profile. Johnson is a better rebounding partner for a first-round guard than another scoring wing: his 10.3 boards compare with only 4.5 from Mitchell. In eight-category formats his turnover burden vanishes, while in balanced roto leagues his 78.8% free throws on volume still need help."
  },
  {
    "rank": 11,
    "name": "Austin Reaves",
    "team": "LAL",
    "yahooAdp": 22.3,
    "yahooPreRank": 16,
    "note": "LeBron's move to Philadelphia leaves more creation for Reaves beside Luka in Los Angeles. He already averaged 22.9 points and 5.5 assists on 48.7% shooting, so a larger role can push him into the first-round conversation. Last year's 51 games are the caution; the projection needs both the opportunity and enough availability to pay off. Reaves shot 86.8% at the line and 48.7% from the floor, a combination that is easier to pair with a high-volume scorer than most mid-round guards. His fit is strongest in balanced nine-category and roto teams; the 51 games make him less appealing if your first pick already carries major availability risk."
  },
  {
    "rank": 12,
    "name": "Cooper Flagg",
    "team": "DAL",
    "yahooAdp": 10.1,
    "yahooPreRank": 7,
    "note": "Flagg's first NBA season already brought 21 points, 6.7 rebounds, 4.5 assists and contributions in both defensive categories. It is easy to see a second-year leap, especially if the three-point shot develops. Kyrie Irving's return gives Dallas another creator, however, so the best case is growth in efficiency and all-around impact rather than an automatic jump in usage. Flagg's 1.2 steals and 0.9 blocks gave him a defensive base that most young scorers lack. He is a safer nine-category bet than a points-only rookie breakout, while a points league may care more about how Kyrie's return affects his touches than about those defensive categories."
  },
  {
    "rank": 13,
    "name": "Kevin Durant",
    "team": "HOU",
    "yahooAdp": 16.9,
    "yahooPreRank": 27,
    "note": "Durant still gives a fantasy roster the hard-to-find combination of volume scoring and clean percentages. He averaged 26 points on 52.0% shooting and 87.4% from the line across 78 games, a stronger availability result than his age might lead you to expect. The age risk remains real, and Houston's other creators can limit his assists, but the per-game case is still comfortably early-round. Only 0.8 steals came with last season's offense, so a Durant-led team should find defense elsewhere rather than expecting the old two-way line. His percentages make him valuable in roto, while head-to-head managers can tolerate the age risk more easily if their draft already includes durable category anchors."
  },
  {
    "rank": 14,
    "name": "Jamal Murray",
    "team": "DEN",
    "yahooAdp": 20.5,
    "yahooPreRank": 9,
    "note": "Last season finally gave Murray the full-volume fantasy line managers have waited for: 25.4 points, 3.3 threes and 7.1 assists across 75 games. His 2.3 turnovers and 88.7% free throws make that much cleaner in nine-category leagues than the usual high-usage guard line. The correction here is the price, not a loss of faith in the player. With DeMar DeRozan joining Denver, a first-round valuation asks Murray to repeat nearly everything that went right while absorbing another scorer. I prefer him in the second round, behind younger foundations with broader rebounding or defensive contributions. That still leaves room to beat his September ADP; it no longer treats last season's best-case volume as the default."
  },
  {
    "rank": 15,
    "name": "Scottie Barnes",
    "team": "TOR",
    "yahooAdp": 14.1,
    "yahooPreRank": 23,
    "note": "Barnes helps in almost every category without needing a huge scoring night to matter. He played 80 games and averaged 7.5 rebounds, 5.9 assists, 1.4 steals and 1.4 blocks, a remarkably useful mix for a forward. Toronto's addition of Kawhi Leonard may trim his scoring share, but the passing and defense should remain the reasons to draft him. His 1.4 steals and 1.4 blocks are a better defensive combination than most forwards offer, and they do not depend on being Toronto's leading scorer. Barnes fits balanced nine-category and roto builds especially well; a punt-threes team can also treat his 0.8 triples as a smaller cost."
  },
  {
    "rank": 16,
    "name": "Donovan Mitchell",
    "team": "CLE",
    "yahooAdp": 13.8,
    "yahooPreRank": 8,
    "note": "Mitchell is a strong second-round scoring anchor whose best pairing is a frontcourt player who covers his gaps. His 27.9 points, 3.2 threes, 1.5 steals and 86.5% free throws cover several important guard categories. The limitation is breadth: rebounds and blocks have to come from later picks, and his passing does not create the same advantage as the elite lead creators. Seventy games and 2.8 turnovers made last season useful without making him a top-five foundation. At No. 16, the scoring and shooting are easier to justify without assuming another leap. He fits especially well after a big who supplies boards and rim protection; punt blocks can value him more highly than this overall placement."
  },
  {
    "rank": 17,
    "name": "Karl-Anthony Towns",
    "team": "NYK",
    "yahooAdp": 15,
    "yahooPreRank": 13,
    "note": "Towns is one of the easiest early centers to fit around a guard-heavy start. His 11.9 rebounds and 85.8% free throws come with solid field-goal impact and some threes, so he solves problems without creating the usual big-man penalty at the line. Half a block a game means he cannot be your main source of rim protection. Compared with Duren, Towns gives up a great deal of FG% impact but adds threes and much better free throws. That makes KAT an unusually useful center for roto or a balanced nine-category team; a punt-blocks build can turn his 0.5 blocks from a flaw into an easy category sacrifice."
  },
  {
    "rank": 18,
    "name": "Tyrese Haliburton",
    "team": "IND",
    "yahooAdp": 16.5,
    "yahooPreRank": 12,
    "note": "Haliburton's appeal is the rare chance to buy elite passing without surrendering turnovers. In 2024–25, his last played season, he averaged 9.2 assists against just 1.6 turnovers, alongside 18.6 points. He returned to unrestricted practice October 12 after the ankle absence. That removes some of the immediate concern behind the previous discount, but practice is not proof of a full regular-season workload after the lost Achilles-recovery year. The second round is a sensible price; the uncertainty makes a first-round investment harder to justify. Pair him with another dependable passer so that a managed schedule does not decide your assists category.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1630169/tyrese-haliburton"
      }
    ]
  },
  {
    "rank": 19,
    "name": "Stephen Curry",
    "team": "GSW",
    "yahooAdp": 23.9,
    "yahooPreRank": 11,
    "note": "Four-plus threes and elite free-throw impact remain a powerful start to a draft, and Curry supplied both in 2025–26. The price has to reflect that he played only 43 games, though; a healthy 26.5-point season is a very different outcome from another long absence. Pair him with durable picks and make sure your roster can cover rebounds. Curry's 4.4 threes were more than double Reaves' 2.3, a difference that can change how aggressively you chase shooting later. He fits a punt-rebounds or guard-heavy head-to-head build naturally, but a balanced roto manager must weigh that specialist edge against 43 games. Golden State has a back-to-back in each week from March 8 through March 28. If those are your H2H playoff dates, use the schedule as a workload-risk tiebreaker, not a guarantee that Curry will sit or a reason to ignore his category advantage.",
    "sources": [
      {
        "label": "Official 2026–27 team schedules",
        "url": "https://ak-static.cms.nba.com/wp-content/uploads/sites/46/2026/08/2026-27-NBA-Regular-Season-Schedule-By-Team.pdf"
      }
    ]
  },
  {
    "rank": 20,
    "name": "Amen Thompson",
    "team": "HOU",
    "yahooAdp": 23.6,
    "yahooPreRank": 10,
    "note": "Amen does his best work in categories most guards cannot supply: 7.8 rebounds on 53.4% shooting, plus 1.5 steals. The assists are valuable too, but Fred VanVleet's return could reduce the point-guard time that helped him reach 5.3 a game. The almost empty three-point column means your other perimeter picks need to shoot. Amen's 0.3 threes make him a much better fit for a punt-threes or FG%-focused team than for a roster already short on spacing. Compared with Dyson Daniels, he gives up some steals but offers more scoring and stronger shooting from the field."
  },
  {
    "rank": 21,
    "name": "Trey Murphy III",
    "team": "NOP",
    "yahooAdp": 40.1,
    "yahooPreRank": 21,
    "note": "Murphy's 3.2 threes and 1.5 steals are already a rare pairing, and his 21.5 points make him much more than a shooting specialist. He is far cheaper in Yahoo drafts than this projection, which leaves room to wait if your league follows that market. His rebounds and assists are useful rather than carrying categories, so a point guard or rebounding big still makes sense beside him. Murphy's 88.6% free throws and only 1.8 turnovers make those threes easier to use in roto than a lower-efficiency gunner's. In a head-to-head punt-blocks build, his 0.4 blocks cost almost nothing while the shooting and steals gain importance."
  },
  {
    "rank": 22,
    "name": "Bam Adebayo",
    "team": "MIA",
    "yahooAdp": 30.1,
    "yahooPreRank": 30,
    "note": "Bam's case is built on 20 points, ten rebounds and helpful assists and steals from a center, not on dominant blocks. His 44.2% field-goal mark last season also removes some of the efficiency cushion managers expect from a big. Miami's addition of Giannis changes the frontcourt hierarchy, so this rank assumes Bam keeps enough touches and minutes to preserve the broad line. The new Giannis pairing also puts two frontcourt players with limited block rates in the same offense, so Bam is less of a defensive-category fix than his position suggests. In a punt-blocks build his 0.7 blocks are less costly, and his assists and steals from center become more valuable."
  },
  {
    "rank": 23,
    "name": "Lauri Markkanen",
    "team": "UTA",
    "yahooAdp": 38.7,
    "yahooPreRank": 18,
    "note": "Markkanen's 26.6 points, 89.6% free throws and only 1.5 turnovers explain why his per-game line deserves early-round attention. They do not establish an equally strong full-season floor. He played 42 games, and Utah now has Jaren Jackson Jr. plus another young scorer in Darryn Peterson. I am taking a little more room for both missed games and a smaller share of the offense rather than copying the old scoring average forward. The big-man eligibility remains useful when you need shooting without another poor free-throw shooter. Punt-assists teams can justify paying toward the top of this range; a balanced team should not chase Yahoo's second-round ordering simply because the percentages look attractive."
  },
  {
    "rank": 24,
    "name": "Kawhi Leonard",
    "team": "TOR",
    "yahooAdp": 29.3,
    "yahooPreRank": 15,
    "note": "When he played, Kawhi was still an elite fantasy producer: 27.5 points, 1.8 steals and excellent percentages in 65 games. A September trade sent him from the Clippers back to Toronto for Brandon Ingram, putting that line in a different offense beside Scottie Barnes. The per-game line still belongs in the early second round; the full-season line does not. Kawhi is 35, he has not cleared 70 games since 2016–17, and Toronto now asks him to share creation with Scottie Barnes and Immanuel Quickley in an unfamiliar offense. No. 24 keeps him at the end of round two, close to his Yahoo pre-rank, rather than paying a top-15 price for a season that has to go right in health and fit at once. Kawhi's 50.8% shooting and 88.8% free throws make his efficiency more useful than that of most high-scoring wings. He is a more comfortable roto pick than a streaky volume shooter when healthy, yet the new Toronto fit and his age make pairing him with another injury gamble unwise."
  },
  {
    "rank": 25,
    "name": "Chet Holmgren",
    "team": "OKC",
    "yahooAdp": 27.7,
    "yahooPreRank": 19,
    "note": "Holmgren's appeal is still the rare frontcourt combination of blocks, rebounds and free throws that do not demand a punt. His 8.9 rebounds and nearly two blocks last season give the projection substance without needing a huge scoring leap. A quadriceps contusion has kept him out of preseason action, with another absence announced October 10. That warrants a small discount, not the same treatment as a player facing surgery or an established months-long absence. I would still take his balanced category profile before chasing a center whose blocks come with a large foul-line penalty, but I want a practice or game return before paying an early-second-round price. Do not mistake Oklahoma City's team-wide rest plans for proof that his own injury has cleared.",
    "sources": [
      {
        "label": "NBA player updates · Oct 10, 2026",
        "url": "https://www.nba.com/player/1631096/chet-holmgren"
      }
    ]
  },
  {
    "rank": 26,
    "name": "James Harden",
    "team": "CLE",
    "yahooAdp": 35.1,
    "yahooPreRank": 49,
    "note": "Harden remains a way to buy assists and free-throw volume after the most expensive guards are gone. Last season's 7.9 assists were valuable even with 3.5 turnovers, so the sensible pairing is a low-turnover finisher rather than another ball-dominant guard. An ankle issue cost him Cleveland's October 8 preseason opener. I am not turning one missed exhibition into an assumed regular-season absence, but it belongs on the final pre-draft checklist, especially for a veteran whose value depends on handling the ball so much. Donovan Mitchell limits the case for a scoring surge; Harden's passing and foul-line impact are the reasons to buy. Keep the third-round valuation conditional on no more serious update, rather than treating an ADP as medical reassurance.",
    "sources": [
      {
        "label": "NBA player updates · Oct 8, 2026",
        "url": "https://www.nba.com/player/201935/james-harden"
      }
    ]
  },
  {
    "rank": 27,
    "name": "Alperen Sengun",
    "team": "HOU",
    "yahooAdp": 18.4,
    "yahooPreRank": 57,
    "note": "A center who averages 6.2 assists and nearly nine rebounds changes what you need from your guards. Sengun also supplies strong field-goal shooting and more than a steal a game, making him a useful build anchor. The 69.1% free throws and 3.2 turnovers demand a plan, especially if your first pick already hurt either category. The playmaking is not Jokić's 10.7 assists, but 6.2 from a center still gives a draft remarkable flexibility. He gains relative appeal in eight-category and punt-FT% leagues because one or both of his main penalties disappear; in roto they remain costly."
  },
  {
    "rank": 28,
    "name": "Trae Young",
    "team": "WAS",
    "yahooAdp": 26.8,
    "yahooPreRank": 72,
    "note": "Young should not be priced as though his 15-game injury season is the most likely shape of the next one. Even that interrupted year produced eight assists per game. On October 12 he delivered 11 assists in 28 minutes. That return deserves more credit than the previous fourth-round price gave it: an eight-assist guard with strong free-throw impact and real three-point volume is scarce, and very few players left after pick 25 can move assists by themselves. No. 28 puts him in the third round, around his September ADP, without paying a second-round price for a 15-game sample. FG%, turnovers and limited defensive production still matter in nine-category leagues, and Washington's other scoring options do not turn him into a clean all-category player. He makes the most sense for a team deliberately buying assists and FT%, with an efficient frontcourt pick to follow, rather than as a generic best-player-available selection. Removing turnovers or punting FG% strengthens the case; those are changes in format, not evidence that every drafter should pay the same price.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1629027/trae-young"
      }
    ]
  },
  {
    "rank": 29,
    "name": "LaMelo Ball",
    "team": "MIN",
    "yahooAdp": 26,
    "yahooPreRank": 62,
    "note": "Ball belongs in the third-round discussion rather than behind most of the early middle-round specialists. Last season's 3.8 threes and 7.1 assists are difficult to replace with two ordinary middle-round picks. He had seven assists in 22 minutes on October 12. That does not settle the Edwards partnership, but it gives no reason to assume Ball's playmaking disappears. The 40.7% shooting remains a serious cost, and I would not value him as a balanced-roto second-round anchor. No. 29 gives his scarce assists and shooting more weight without pretending the efficiency cost has disappeared. In a punt-FG% build he can go earlier; in a neutral build, surround him with efficient frontcourt volume. Yahoo's later public pre-rank is a reason to watch for a discount, not a reason to downgrade his ability.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1630163/lamelo-ball"
      }
    ]
  },
  {
    "rank": 30,
    "name": "Devin Booker",
    "team": "PHX",
    "yahooAdp": 26.9,
    "yahooPreRank": 40,
    "note": "Booker offers a dependable scoring and free-throw foundation, and his six assists keep him from being a points-only pick. Phoenix's addition of Miles Bridges adds another scorer around him, but Booker remains the offense's best bet for high-volume creation. The modest steals and 3.2 turnovers are the categories to balance with later picks. Booker's 6.0 assists make him a more complete guard than a pure scoring specialist, though Maxey gives you more steals at a similar early price. He fits balanced roto teams if you can find defense later; a punt-steals build makes the 0.8 steals less of a concern."
  },
  {
    "rank": 31,
    "name": "Derrick White",
    "team": "BOS",
    "yahooAdp": 47.1,
    "yahooPreRank": 25,
    "note": "White's fantasy value is easy to miss if you stop at the 16.5 points. He averaged 2.7 threes, 5.4 assists and 1.3 blocks from a guard spot, a combination that fits almost any build. The 39.5% field-goal shooting is a real cost, so pair him with an efficient frontcourt player rather than asking him to anchor a percentage. Few guards can approach White's 1.3 blocks, so he fits a build that needs rim protection without using another center slot. Compared with Bane, the defensive ceiling is higher but the FG% cost is much steeper; roto managers should know which percentage their roster can repair."
  },
  {
    "rank": 32,
    "name": "Evan Mobley",
    "team": "CLE",
    "yahooAdp": 30,
    "yahooPreRank": 45,
    "note": "Mobley gives you nine rebounds and 1.7 blocks while keeping the field-goal category strong, a straightforward way to balance an early guard pick. His free throws fell to 60.6% last season, so the old assumption that he is safe at the line no longer works. Draft him for the defensive and rebounding floor, then protect FT% or lean into a punt. The FT% hit is more serious than Holmgren's, even though both can provide blocks and good FG% from center. Mobley becomes much easier to draft in a punt-FT% head-to-head build; in roto, his free-throw attempts make the percentage a real team-wide decision."
  },
  {
    "rank": 33,
    "name": "Jalen Brunson",
    "team": "NYK",
    "yahooAdp": 21.9,
    "yahooPreRank": 42,
    "note": "Brunson gives you reliable points and assists without the extreme turnovers of some high-usage guards. He averaged 26 points and 6.8 assists across 74 games, so the role and availability are both easier to trust than many players in this range. He adds little in steals, rebounds or blocks; those categories should guide your next picks. His 2.4 turnovers are controlled for a 6.8-assist lead guard, making him more comfortable in nine-category than several flashier creators. Brunson's 0.8 steals mean he pairs better with a defensive wing such as Anunoby than with another score-first guard."
  },
  {
    "rank": 34,
    "name": "Josh Giddey",
    "team": "CHI",
    "yahooAdp": 23.8,
    "yahooPreRank": 61,
    "note": "The appeal of Giddey is not hard to see: 8.3 rebounds and 9.1 assists from a guard can fix two categories in one pick. Chicago's new rotation may change the exact usage, but that out-of-position production remains his calling card. The 3.6 turnovers and 76.3% free throws are the reason this rank assumes a punt-turnovers build rather than a balanced roster. He is one of the best guards for a punt-turnovers team because the 9.1 assists and 8.3 rebounds can reshape a matchup. Eight-category leagues give him the same turnover relief, while a roto roster that already has Cade or Luka should be cautious about stacking another 3.6 turnovers."
  },
  {
    "rank": 35,
    "name": "Jalen Duren",
    "team": "DET",
    "yahooAdp": 36,
    "yahooPreRank": 28,
    "note": "Duren solves rebounds and field-goal percentage almost by himself, and his 19.5 points make him more than a specialist. Detroit moved Isaiah Stewart to Memphis, clearing additional frontcourt room around its starting center. The zero threes and 74.7% free throws mean he fits best behind guards who already handle shooting and creation. The 65.0% FG mark on major volume can rescue an inefficient guard start, but the 74.7% free throws are more damaging than Towns' line. Duren is a natural punt-FT% or punt-threes center; Towns is the better balanced-roto option when you need shooting from the position."
  },
  {
    "rank": 36,
    "name": "Brandon Miller",
    "team": "CHA",
    "yahooAdp": 46.8,
    "yahooPreRank": 46,
    "note": "Charlotte's available offense gives Miller a route to valuable scoring and three-point volume. He returned October 11 with 18 points, four threes and four assists in 22 minutes. That clears the specific participation concern behind the earlier shin-injury caution. His 2025–26 averages of 20.2 points and 3.1 threes already support a useful scoring foundation; more creation is upside rather than something we need to invent from one exhibition. The restraint is efficiency: 43.5% shooting and 2.5 turnovers were real costs last season. Round four buys that offensive opportunity without requiring a leap across every category. He becomes easier to buy earlier in punt-FG%, while a balanced team should pair him with reliable interior shooting.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1641706/brandon-miller"
      }
    ]
  },
  {
    "rank": 37,
    "name": "Anthony Davis",
    "team": "WAS",
    "yahooAdp": 40.5,
    "yahooPreRank": 36,
    "note": "Davis now deserves credit for getting back on the court, while still carrying a meaningful availability discount. His October 10 outing included 11 rebounds and two blocks in 22 minutes. That is exactly the category shape a drafter wants to see; it is not evidence that he will suddenly play a full season after only 20 games in 2025–26. Washington can use his finishing and defense alongside Trae Young, and a healthy Davis has a much broader scoring and passing profile than a late-round rebound specialist. The early fourth round is a better reflection of that ceiling: few players outside the top 30 can supply elite rebounds, blocks and FG% together, and the price still leaves room for a managed workload. Do not pay his Yahoo pre-rank of 36 on hope alone, but waiting for round five gives up too much category upside. His own percentages do not require a punt-FT% build. The limiting resource is available games, so he fits better after a dependable start than beside several other recovery bets.",
    "sources": [
      {
        "label": "NBA player updates · Oct 11, 2026",
        "url": "https://www.nba.com/player/203076/anthony-davis"
      }
    ]
  },
  {
    "rank": 38,
    "name": "Jalen Williams",
    "team": "OKC",
    "yahooAdp": 42.5,
    "yahooPreRank": 35,
    "note": "The recovery discount was too large once Williams could demonstrate his usual all-around game again. He had 16 points and six assists in 19 minutes on October 7; his next announced absence was rest. That is evidence of participation, not a reason to project his exhibition shooting percentage across a season. Last year's 33 games still matter, but the 5.5 assists and 48.4% shooting show how useful his line can be even without a scoring career year. He fits in the fourth round, where the combination of passing, efficient scoring and defensive production is harder to replace than another specialist's extra threes. His 0.7 threes last season remain a roster-building consideration. Follow him with shooting rather than assuming every part of his pre-injury ceiling returns together.",
    "sources": [
      {
        "label": "NBA player updates · Oct 10, 2026",
        "url": "https://www.nba.com/player/1631114/jalen-williams"
      }
    ]
  },
  {
    "rank": 39,
    "name": "Jaylen Brown",
    "team": "PHI",
    "yahooAdp": 27.5,
    "yahooPreRank": 94,
    "note": "Brown's previous season produced 28.5 points and 6.9 rebounds, but that was not a clean nine-category line: 79.5% free throws, 3.6 turnovers and limited blocks left work for the rest of the roster. Philadelphia also has more mouths to feed than the Boston offense he led while Tatum missed time. Do not assume improved efficiency will fully replace lost volume. He remains valuable for points and rebounds from a wing, particularly when turnovers are punted. Even a reduced share of Philadelphia's offense leaves a strong scoring and rebounding floor for a wing, and that floor is worth more than the fifth-round placement implied. No. 39 is an early fourth-round price, still well behind his September ADP near 28. Yahoo's much later public ordering can make him a bargain; the objection is to paying for last season's scoring role before seeing how the new one settles."
  },
  {
    "rank": 40,
    "name": "Desmond Bane",
    "team": "ORL",
    "yahooAdp": 52.9,
    "yahooPreRank": 44,
    "note": "Bane is a dependable way to buy points and strong free-throw impact without giving away field-goal percentage. He played all 82 games for Orlando, averaged 20.1 points and shot 90.8% at the line. The line lacks a single massive counting category, but that durability and efficiency make him easy to fit around a riskier early pick. Bane's 48.3% field goals and 90.8% free throws were stronger percentage support than most 20-point guards provided. Compared with Derrick White, he gives up the unusual blocks but brings a much cleaner FG% line. That makes him an easier roto fit when your early picks already cover defensive stats."
  },
  {
    "rank": 41,
    "name": "Domantas Sabonis",
    "team": "SAC",
    "yahooAdp": 27,
    "yahooPreRank": 38,
    "note": "Nineteen games are a poor basis for writing off a player who has long supplied elite rebounds, efficient scoring and center-position assists. The 2025–26 sample still showed 11.4 boards, but health is the reason he comes at a discount. If the role and minutes normalize, this rank will look cautious; free throws and blocks remain the category compromises. His 0.2 blocks are the obvious fit for a punt-blocks team, where 11.4 rebounds and center assists become even more valuable. Compared with Clingan, Sabonis gives up rim protection and adds playmaking; which one helps more depends on the categories your first two picks already cover. He missed October 8 and October 10 for an undisclosed reason. Do not label those absences a diagnosed recurrence or assume they are harmless rest; they leave the workload question open and stop me from lifting the existing discount.",
    "sources": [
      {
        "label": "NBA player updates · Oct 10, 2026",
        "url": "https://www.nba.com/player/1627734/domantas-sabonis"
      }
    ]
  },
  {
    "rank": 42,
    "name": "Donovan Clingan",
    "team": "POR",
    "yahooAdp": 41.6,
    "yahooPreRank": 29,
    "note": "Clingan already gives you the traditional center categories in bulk: 11.5 boards and 1.7 blocks across 77 games. He even made more than a three a night, although that is a bonus rather than the core of the pick. The fourth round is a better price than the third for that specialist profile. His 12.1 points and 52.1% shooting do not provide the scoring or FG% leverage of the strongest early centers, while free throws and steals still need help elsewhere. He can repair a guard-heavy start, but should not be priced as a complete frontcourt anchor. He is a cleaner rebounding and blocking specialist than Okongwu, but Okongwu supplies more threes and passing. In punt-FT% leagues the 69.2% at the line is easier to ignore; balanced roto managers should make sure the attempt volume will not erase his block advantage."
  },
  {
    "rank": 43,
    "name": "Jaren Jackson Jr.",
    "team": "UTA",
    "yahooAdp": 50.5,
    "yahooPreRank": 54,
    "note": "Jackson's blocks are still a scarce asset, though last season's 1.4 per game were below his best years. Memphis sent him to Utah at the February deadline, and sharing the frontcourt with Lauri Markkanen changes the touches and rebounding context. He can beat this rank if the defensive rate rises again, but 48 games make a full-season bet less comfortable. Sarr supplied more blocks last season, 2.0 to Jackson's 1.4, but Jackson offers more threes and better free throws. That makes Jackson the more flexible center for a balanced nine-category team, provided the 48-game availability risk fits the rest of the roster."
  },
  {
    "rank": 44,
    "name": "Dyson Daniels",
    "team": "ATL",
    "yahooAdp": 62.9,
    "yahooPreRank": 20,
    "note": "Two steals a game make Daniels a category changer, and the 6.8 rebounds and 5.9 assists are unusually helpful from a guard. His 0.3 threes and 61.5% free throws can pull a balanced roster in the wrong direction, though. Draft him when you already have shooting and free-throw volume, then let his defense and playmaking do the work. No. 44 moves him from the third round into the fourth: a player who needs a specific build should not cost the same pick as a broader category anchor, and his September ADP near 63 suggests the room will not force you to reach. He gives you more steals and assists than Amen, but the 61.5% free throws and almost no threes make roster construction stricter. Daniels is at his best in a punt-FT% or punt-threes head-to-head plan; do not drop him into a balanced roto team just because the steal rate is exciting."
  },
  {
    "rank": 45,
    "name": "Michael Porter Jr.",
    "team": "BKN",
    "yahooAdp": 59.6,
    "yahooPreRank": 55,
    "note": "Brooklyn gave Porter the scoring role that Denver could not, and he turned it into 24.2 points, 3.4 threes and 7.1 rebounds. That is early-round per-game production at a much later Yahoo price. The question is availability after a 52-game season, along with whether the Nets' changed frontcourt keeps his shot volume as high. His 3.4 threes were level with Edwards, and the 7.1 rebounds came from a wing rather than a center slot. That combination can carry a head-to-head punt-assists build, where Porter's three dimes no longer hold him back; in roto the 52 games remain a larger concern. He returned from wrist soreness October 12, scoring 22 points in 24 minutes. That removes the immediate absence behind the earlier caution, not the full-season availability risk.",
    "sources": [
      {
        "label": "NBA player updates · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1629008/michael-porter-jr"
      }
    ]
  },
  {
    "rank": 46,
    "name": "Nickeil Alexander-Walker",
    "team": "ATL",
    "yahooAdp": 60.1,
    "yahooPreRank": 24,
    "note": "The new Atlanta role turned Alexander-Walker into a real scorer, not merely a steals specialist. He averaged 20.8 points and 3.2 threes while hitting 90.2% at the line, and he played 78 games. That was his first season with this kind of usage, though, and Atlanta's offense also has to feed Jalen Johnson, CJ McCollum and Okongwu's expanded role. No. 46 prices a partial step back rather than a full repeat of the career year. Yahoo's ADP near 60 still leaves a possible discount if the Hawks keep that offensive workload intact. Compared with Brandon Miller, his 90.2% free throws and 1.3 steals make the scoring package more balanced even if the shot volume changes. He works in roto as an efficient guard-category supplement, while points-league managers may care more about whether the 20.8-point role repeats."
  },
  {
    "rank": 47,
    "name": "Walker Kessler",
    "team": "LAL",
    "yahooAdp": 38,
    "yahooPreRank": 33,
    "note": "Kessler's return to full practice on October 11 weakens the reason for leaving him near the end of round five. The Lakers fit offers an obvious route to useful rebounds, blocks and high-percentage finishes, although I still prefer Clingan's larger recent body of work. Last season's 10.8 rebounds and 1.8 blocks came in only five games; neither that sample nor a good practice establishes a durable full-season baseline. The price works without requiring a top-25 outcome. Build around interior efficiency and rim protection, then find your threes and assists elsewhere. A balanced roster should also avoid treating the small-sample free-throw result as a guaranteed improvement.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1631117/walker-kessler"
      }
    ]
  },
  {
    "rank": 48,
    "name": "Onyeka Okongwu",
    "team": "ATL",
    "yahooAdp": 54.7,
    "yahooPreRank": 37,
    "note": "Okongwu's line is broader than that of a traditional shot blocker: 15.2 points, 7.6 rebounds, 1.9 threes and contributions in both defensive categories. He does not dominate FG% the way some centers do, so the shooting volume matters as much as the percentage. At his Yahoo price, the appeal is getting several useful categories from one mid-round frontcourt slot. No. 48 is the end of round four rather than the middle of it: 48.0% from the field is light for a center, and none of his categories is dominant enough to justify taking him well ahead of his market price near 55. The 1.9 threes separate him from Clingan and other traditional centers, while 1.1 steals and 1.1 blocks keep the defense useful. He is an appealing nine-category choice for a roster that needs a center without sacrificing shooting; a punt-threes team would capture less of what makes him special."
  },
  {
    "rank": 49,
    "name": "Deni Avdija",
    "team": "POR",
    "yahooAdp": 39.6,
    "yahooPreRank": 76,
    "note": "Avdija's 23.8 points, 6.8 rebounds and 6.6 assists were a breakout line, but Portland's offense has changed around him. The Blazers brought in Ja Morant and are getting Damian Lillard back, so the old creation load is unlikely to repeat. He still brings valuable wing rebounding and passing; His place here assumes a punt-turnovers team can use his wing volume even if the new backcourt takes some creation away. Giddey offered more assists and rebounds, but Avdija scored 6.8 more points per game last season. The 3.7 turnovers make both players easier to use in eight-category or punt-turnovers leagues; in roto, Portland's new backcourt adds another reason to be conservative."
  },
  {
    "rank": 50,
    "name": "Alex Sarr",
    "team": "WAS",
    "yahooAdp": 71.9,
    "yahooPreRank": 59,
    "note": "Sarr gives you a path to two blocks a night without spending a first-round pick, and his 16.3 points add some scoring upside. He appeared in 48 games, so availability is part of the decision. Free throws are the main category to protect; the defensive ceiling remains the reason to take him ahead of a safer mid-round scorer. He blocks more shots than Jackson at a later price, yet the 69.2% free throws make the full category tradeoff less friendly. Sarr is especially compelling for a punt-FT% team; roto managers should ask whether the block gain offsets the percentage and missed games."
  },
  {
    "rank": 51,
    "name": "LeBron James",
    "team": "PHI",
    "yahooAdp": 38.3,
    "yahooPreRank": 92,
    "note": "LeBron still averaged 20.6 points and 7.1 assists at 41, which is remarkable production from a player entering another season. He left the Lakers for Philadelphia in July, joining Maxey and Brown in a far more crowded creation setup. The assists and field-goal efficiency should remain useful, but age, turnovers and a likely smaller workload keep this below his Yahoo draft price. His 7.1 assists still exceed Maxey's 6.6, but the 73.5% free throws and 3.0 turnovers are real nine-category costs. In a points league, scoring and passing may outweigh those percentage concerns; in roto, sharing the ball with Maxey and Brown keeps the range of outcomes wider."
  },
  {
    "rank": 52,
    "name": "Joel Embiid",
    "team": "PHI",
    "yahooAdp": 50.8,
    "yahooPreRank": 125,
    "note": "Embiid can still win a matchup in points and free-throw impact whenever he is on the court; he averaged 26.9 points in 2025–26. The problem is turning that per-game edge into a full fantasy season after only 38 appearances. Philadelphia has also added LeBron and Brown, so the safest projection gives Embiid plenty of value without assuming every old touch returns. His 85.4% free throws from center remain a rare way to support an early guard-heavy build. Compared with Towns, Embiid offers the bigger scoring and block ceiling but a much steeper missed-game risk; the choice should reflect the durability of your other picks. Philadelphia opens with four games through October 25, including an October 24–25 back-to-back. That is a useful early workload test, not four guaranteed Embiid appearances. Prefer a healthier center at a similar price if your roster cannot absorb another managed schedule.",
    "sources": [
      {
        "label": "Official 2026–27 team schedules",
        "url": "https://ak-static.cms.nba.com/wp-content/uploads/sites/46/2026/08/2026-27-NBA-Regular-Season-Schedule-By-Team.pdf"
      }
    ]
  },
  {
    "rank": 53,
    "name": "OG Anunoby",
    "team": "NYK",
    "yahooAdp": 66.6,
    "yahooPreRank": 60,
    "note": "Anunoby keeps contributing even when New York does not need him to create: 1.6 steals, 2.3 threes and solid shooting across 67 games. That is a useful glue piece for a roster built around high-usage stars. His assist ceiling is limited, but the category mix is easy to draft and the Yahoo price leaves room for this ranking to pay off. His 1.6 steals, 0.7 blocks and 2.3 threes make him a more complete defensive wing than the points average shows. Anunoby is particularly helpful in roto, where the 1.8 turnovers and solid shooting can stabilize a roster; he is less exciting in a points league that rewards raw creation."
  },
  {
    "rank": 54,
    "name": "Paolo Banchero",
    "team": "ORL",
    "yahooAdp": 34.1,
    "yahooPreRank": 121,
    "note": "Banchero can put up a strong points-rebounds-assists line from the forward slot; last season's 8.4 boards and 5.2 assists show the appeal. Managers must also price in ordinary shooting efficiency, only 1.2 threes and 3.1 turnovers. His place here assumes a punt-turnovers or punt-FT% team will pay for that forward volume; a balanced roster should wait for an efficiency step. Compared with Randle, he gives more rebounds and similar assists but also more turnovers, so eight-category scoring improves the case. A punt-FT% or punt-turnovers head-to-head team can chase his all-around volume; a balanced roto manager needs an efficiency plan."
  },
  {
    "rank": 55,
    "name": "Franz Wagner",
    "team": "ORL",
    "yahooAdp": 53.2,
    "yahooPreRank": 39,
    "note": "Wagner's 20.6 points on 48.1% shooting are a useful base from the wing, and he does not force a punt in any obvious category. A 34-game season is why he falls into this range rather than sitting with the safer early-round forwards. Take him for the balanced line, but pair the injury bet with dependable availability elsewhere. Paolo supplies more rebounds and assists, while Wagner is easier to fit around a turnover-sensitive nine-category roster. In a points league the gap may favor Paolo's larger usage; in roto, Wagner's 1.7 turnovers and steadier shooting profile can be the more useful shape if health returns."
  },
  {
    "rank": 56,
    "name": "Kyrie Irving",
    "team": "DAL",
    "yahooAdp": 52.3,
    "yahooPreRank": 73,
    "note": "Irving's comeback is now an appearance rather than a scheduled date: he scored 17 points in 22 minutes on October 11. That earns a smaller recovery discount, not an automatic restoration of his old workload. His last played season, 2024–25, supplied 24.7 points, 2.9 threes and 91.6% free throws. Those categories can help without needing him to monopolize creation alongside Flagg. I would consider him in the fifth-round area after a dependable start, while leaving room for managed minutes and missed games. There is a reasonable case for a more aggressive ranking, but stacking him with another major recovery bet makes the downside much harder to absorb.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/202681/kyrie-irving"
      }
    ]
  },
  {
    "rank": 57,
    "name": "Keyonte George",
    "team": "UTA",
    "yahooAdp": 56.3,
    "yahooPreRank": 122,
    "note": "George broke through as a high-volume scorer and playmaker, averaging 23.5 points and 6.1 assists while making 89.1% of his free throws. Those are difficult guard categories to find later. The 3.1 turnovers and Utah's added frontcourt scoring create enough uncertainty to keep him near his Yahoo price. Murray supplied more assists with fewer turnovers last season, so George needs his scoring and 89.1% free throws to carry the comparison. He is a stronger fit in a punt-turnovers or eight-category build than on a balanced roto team that already has a high-usage guard."
  },
  {
    "rank": 58,
    "name": "VJ Edgecombe",
    "team": "PHI",
    "yahooAdp": 74.7,
    "yahooPreRank": 31,
    "note": "Edgecombe's first season showed why a defensive guard can matter before his offense is polished: 1.4 steals, 5.6 rebounds and 4.2 assists across 75 games. Philadelphia's new star-heavy lineup may limit his shot creation, but his best categories do not require the ball. He fits behind early scoring picks. His 1.4 steals matched Barnes' rate, even if Barnes contributes more blocks and frontcourt rebounds. Edgecombe fits a guard-heavy nine-category team looking for defensive balance; points leagues may undervalue the quiet steals and overvalue a hoped-for scoring leap."
  },
  {
    "rank": 59,
    "name": "Mikal Bridges",
    "team": "NYK",
    "yahooAdp": 79.6,
    "yahooPreRank": 41,
    "note": "Bridges' value is in dependable minutes and a line that seldom forces a build change. He played all 82 games, shot 49.0% and added threes, steals and very few turnovers. The 14.4 points will not carry a category, but he is a useful stabilizer after an injury risk or a high-turnover star. His 1.3 steals and 0.8 blocks give more defensive coverage than a simple points-league ranking would show. Compared with Porter, Bridges offers far less scoring and rebounding but a much safer 82-game workload, so the choice depends on whether your roster needs ceiling or stability."
  },
  {
    "rank": 60,
    "name": "Ryan Rollins",
    "team": "MIL",
    "yahooAdp": 77.7,
    "yahooPreRank": 58,
    "note": "Rollins turned a larger Milwaukee role into 17.3 points, 5.6 assists and 1.5 steals across 74 games. Giannis' departure changes the Bucks' offense again, creating possible touches and a new hierarchy with Tyler Herro. The draft case is a repeat of the playmaking and defensive activity, not an assumption that every extra shot becomes efficient scoring. Quickley averaged slightly more assists with nearly half the turnovers, while Rollins added more steals and points. A nine-category roto team may prefer Quickley's cleaner line; a head-to-head manager hunting a breakout can take Rollins if Milwaukee's new roles leave him enough minutes."
  },
  {
    "rank": 61,
    "name": "Tyler Herro",
    "team": "MIL",
    "yahooAdp": 68.8,
    "yahooPreRank": 47,
    "note": "Herro brings points, threes and elite free throws to a Milwaukee team that acquired him in the Giannis trade. His 2025–26 rate was strong when available, but he played only 33 games, so the health discount belongs in the price. The Bucks need his offense; steals and blocks still have to come from elsewhere. Herro's 91.7% free throws were even higher than Bane's 90.8%, though Bane played 49 more games. That makes Herro an appealing FT%-and-threes fit when you already have safe early picks; total-season formats should price the availability gap heavily."
  },
  {
    "rank": 62,
    "name": "Naz Reid",
    "team": "CHA",
    "yahooAdp": 62.5,
    "yahooPreRank": 52,
    "note": "Reid pairs threes with rebounds, blocks and enough steals to matter. Minnesota sent him to Charlotte in July, giving him a different path to minutes after years behind a crowded Wolves frontcourt. He can beat this rank if the new role grows; his 45.6% shooting and 73.2% free throws keep the floor less clean. Ware brought more rebounds and similar blocks, but Reid's 2.1 threes give a roster a very different kind of center production. A punt-FG% or punt-FT% head-to-head team can absorb his percentage weaknesses more easily than a roto team can."
  },
  {
    "rank": 63,
    "name": "Immanuel Quickley",
    "team": "TOR",
    "yahooAdp": 97,
    "yahooPreRank": 69,
    "note": "Quickley is a tidy source of assists, threes and steals with only 1.5 turnovers a game. His 70-game season restored confidence after earlier injury trouble, and Yahoo is still drafting him later than this ranking. Toronto's addition of Kawhi could change the hierarchy, so buy the balanced guard line without assuming more points. Rollins gives more points and steals, but Quickley's 1.5 turnovers and 2.5 threes are a cleaner nine-category blend. He is also a useful roto guard when you need assists without taking another extreme usage risk; eight-category scoring narrows that ball-security edge."
  },
  {
    "rank": 64,
    "name": "Matas Buzelis",
    "team": "CHI",
    "yahooAdp": 61.9,
    "yahooPreRank": 34,
    "note": "Buzelis can give a roster blocks without forcing another traditional center into the lineup. Last season's 1.5 blocks and 2.2 threes are the foundation of that appeal, not an assumption that every young forward becomes a major scorer. He left the October 9 exhibition with a right ankle injury. Until there is more clarity, I would keep a small buffer in his draft price rather than push him toward Yahoo's much earlier pre-rank. Chicago offers room for development, but Caleb Wilson and the veteran additions also need possessions. A third-year increase in strength or usage is upside, not something to count twice alongside his existing category production. He remains useful around the middle rounds if your opening picks need both shooting and rim protection.",
    "sources": [
      {
        "label": "NBA player updates · Oct 10, 2026",
        "url": "https://www.nba.com/player/1641824/matas-buzelis"
      }
    ]
  },
  {
    "rank": 65,
    "name": "Darius Garland",
    "team": "LAC",
    "yahooAdp": 66.1,
    "yahooPreRank": 53,
    "note": "Garland offers the assists and shooting of a useful middle-round lead guard. He supplied 15 points and six assists in 15 minutes in the October 4 opener. The important part is that he was playing his usual offensive role; four made field goals without a miss do not establish a new efficiency level. Ingram's absence leaves more creation to be shared by Garland and the rest of the backcourt, although rookie Keaton Wagler is another ballhandler rather than a reason to project unlimited touches. Last year's 6.7 assists, 2.7 threes and 86.1% free throws already describe a valuable guard. The 45-game season and 2.9 turnovers still call for restraint, but I would consider him in the sixth round, particularly in a room where assists are going quickly.",
    "sources": [
      {
        "label": "NBA player updates · Oct 5, 2026",
        "url": "https://www.nba.com/player/1629636/darius-garland"
      },
      {
        "label": "Clippers media day · Sep 28, 2026",
        "url": "https://www.nba.com/news/brandon-ingrams-clippers-debut-on-hold-after-heel-surgery-partial-achilles-tear"
      }
    ]
  },
  {
    "rank": 66,
    "name": "Cameron Boozer",
    "team": "MEM",
    "yahooAdp": null,
    "note": "Boozer belongs on the draft board now, not in a separate pile of rookies to revisit later. At Duke he averaged 22.5 points, 10.2 rebounds and 4.1 assists in 2025–26. Those are college numbers, not an NBA forecast. His October 7 exhibition added 16 points and six rebounds in 22 minutes. My attraction is the possibility of filling several frontcourt categories without needing a specialist's role. I am leaving a meaningful adjustment for the tougher competition, uncertain NBA efficiency and a workload that still has to be earned. Consider him in the middle rounds after a stable start; a blank prior-season NBA card is missing history, not a reason to pretend he has no value.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1643409/cameron-boozer"
      },
      {
        "label": "NBA draft profile · 2025–26 college baseline",
        "url": "https://www.nba.com/draft/2026/prospects/cameron-boozer"
      }
    ],
    "yahooPreRank": 71
  },
  {
    "rank": 67,
    "name": "Kon Knueppel",
    "team": "CHA",
    "yahooAdp": 40.4,
    "yahooPreRank": 22,
    "note": "Knueppel's 3.4 threes and 18.5 points over 81 games give the shooting projection a strong base, but opening-night uncertainty now belongs in the price. A left hamstring injury rules him out of preseason; Charlotte has not confirmed him for the opener. The temptation is to count all the shots left behind by LaMelo Ball and pay for a clean second-year leap. Those opportunities do not help while he is unavailable, and an abbreviated preparation period makes the early workload harder to project. I would rather take him in the middle rounds than pay Yahoo's aggressive public pre-rank. His role remains attractive once healthy, so this is a discount for the uncertain start, not a claim that the long-term shooting case has disappeared. Avoid pairing him with Coby White if both picks need immediate availability.",
    "sources": [
      {
        "label": "NBA player updates · Sep 28, 2026",
        "url": "https://www.nba.com/player/1642851/kon-knueppel"
      }
    ]
  },
  {
    "rank": 68,
    "name": "Kel'el Ware",
    "team": "MIL",
    "yahooAdp": 73.2,
    "yahooPreRank": 51,
    "note": "Ware's nine rebounds, 1.1 blocks and 1.2 threes give him an attractive center profile without needing a punt. Miami included him in the July Giannis package to Milwaukee, where the frontcourt rotation and minutes are less settled. Draft him for a possible larger role, but do not pay as though that role is guaranteed. Reid offers more threes; Ware's nine rebounds make him the better fit when a guard-heavy team needs a traditional center category. The 74.0% free throws create a small build decision, and a punt-FT% team can push him higher if Milwaukee gives him a large role."
  },
  {
    "rank": 69,
    "name": "Ausar Thompson",
    "team": "DET",
    "yahooAdp": 88.5,
    "yahooPreRank": 82,
    "note": "Thompson is a defensive specialist with real rebounding and FG% help: two steals, 0.9 blocks and 52.5% shooting. He gives almost nothing in threes and shot 57.1% at the line, so this rank assumes a punt-FT% or punt-threes build. Take him after securing enough shooting and playmaking elsewhere. His 2.0 steals matched Dyson Daniels, but the 57.1% free throws and almost nonexistent threes force a very different build. Punt-FT% or punt-threes teams can turn that defensive upside into an advantage; balanced roto teams have less room to absorb both gaps."
  },
  {
    "rank": 70,
    "name": "Jaden McDaniels",
    "team": "MIN",
    "yahooAdp": 89.2,
    "yahooPreRank": 43,
    "note": "McDaniels should not have to become a featured scorer to justify a middle-round pick. Last season he supplied a steal and a block per game while scoring 14.8 points on 51.5% shooting. That is a useful way to add defense without undoing the efficiency of an early-round foundation. Minnesota's new creators may change the distribution of shots, but I would rather pay for the complementary profile than project a major usage jump. That steadiness is useful beside a higher-risk lead guard. Anunoby still offers more threes and steals, so this is not a claim that the two are interchangeable; McDaniels is the cheaper fit when blocks from a wing matter more than another large scoring average."
  },
  {
    "rank": 71,
    "name": "Julius Randle",
    "team": "BKN",
    "yahooAdp": 68.4,
    "yahooPreRank": 101,
    "note": "Randle's 21.1 points, 6.7 rebounds and five assists still form a useful fantasy line. Minnesota traded him to Brooklyn in July's four-team deal, and Nic Claxton's departure opens a clearer path to frontcourt touches. The turnovers and modest defensive stats remain, but the new situation gives him a route to beating this rank. His 5.0 assists from a forward are close to Banchero's 5.2, but Randle's 2.7 turnovers were a little easier to absorb. In points leagues the new Brooklyn role could make him more attractive than this nine-category slot; roto managers still have to price the weak block rate."
  },
  {
    "rank": 72,
    "name": "Pascal Siakam",
    "team": "IND",
    "yahooAdp": 49.3,
    "yahooPreRank": 79,
    "note": "Siakam remains Indiana's best source of forward scoring and supplies useful rebounds, assists and field-goal impact. His 24 points per game are real, but 69.3% free throws are a larger nine-category penalty than a points-and-rebounds glance reveals. Haliburton's return could change how his shots arrive without erasing his role. Ingram's free throws are cleaner, but Siakam's 6.6 rebounds and 1.1 steals offer more category help from a forward. He becomes easier to draft in punt-FT% leagues, especially if you need scoring without another guard; a roto team should calculate the free-throw cost first."
  },
  {
    "rank": 73,
    "name": "Stephon Castle",
    "team": "SAS",
    "yahooAdp": 54.4,
    "yahooPreRank": 84,
    "note": "Castle is already a strong source of assists and rebounds from a guard spot, with 7.4 and 5.3 per game. The 3.2 turnovers and 73.4% free throws explain why a good real-life season did not produce the same nine-category rank. This slot assumes his assists and rebounds go to a punt-turnovers or punt-FT% roster; a balanced team should still demand an efficiency jump. His 7.4 assists and 5.3 rebounds offer the sort of guard volume that Giddey supplies, although Giddey reached 9.1 and 8.3 respectively. Both lose ground to cleaner guards in nine-category roto because of turnovers; Castle becomes more appealing in eight-category leagues or a punt-FT% build."
  },
  {
    "rank": 74,
    "name": "Jalen Suggs",
    "team": "ORL",
    "yahooAdp": 111.4,
    "yahooPreRank": 89,
    "note": "Suggs' 1.8 steals and 5.5 assists give him a useful defensive and playmaking identity even when his shot is uneven. He played 57 games and shot 43.5% in 2025–26, so availability and efficiency matter to this projection. At Yahoo's later price, the category mix is worth a look if FG% is covered. His 1.8 steals put him near Kawhi's rate, though not near Kawhi's efficiency or scoring ceiling. Suggs is valuable in head-to-head categories when you can use his defense and assists together; a points league may treat that 13.8-point average less kindly."
  },
  {
    "rank": 75,
    "name": "Ja Morant",
    "team": "POR",
    "yahooAdp": 92.6,
    "yahooPreRank": null,
    "note": "Portland acquired Morant from Memphis in June, pairing him with a returning Damian Lillard. His 8.1 assists in a 20-game season show the playmaking ceiling, but the new backcourt and 3.5 turnovers complicate the nine-category case. His placement assumes a punt-turnovers or punt-FG% team can absorb one of those costs, but a healthy rebound in games played is still essential. Eight assists can swing a weekly matchup, while 3.5 turnovers and 41.0% shooting can undo much of that gain in nine-category scoring. He fits eight-category or punt-FG% teams better than a balanced roto roster, and 20 games last season demand a real availability discount."
  },
  {
    "rank": 76,
    "name": "Ty Jerome",
    "team": "MEM",
    "yahooAdp": 111.3,
    "yahooPreRank": 48,
    "note": "Jerome's 15-game season offered a glimpse of real offense: 2.8 threes and 5.7 assists with strong percentages. That is too little playing time to treat as a settled baseline on a Memphis roster with changing guard roles. Draft him as a bet on secure minutes rather than those exact rates repeating. Pritchard's 79-game record is the safer alternative if your roster simply needs threes and assists. Jerome's 19.7-point, 5.7-assist burst is the upside play, but roto managers should not convert 15 games into a full-season expectation."
  },
  {
    "rank": 77,
    "name": "De'Aaron Fox",
    "team": "SAS",
    "yahooAdp": 80.1,
    "yahooPreRank": 85,
    "note": "Fox gives San Antonio another creator beside Wembanyama, and his 6.2 assists and 48.6% shooting were useful last season. The 18.6 points were below the scoring level many managers associate with his name, and free throws remain middling. He fits when you need a guard who helps FG% and assists more than a pure scoring star. Garland supplied slightly more assists and much better FT%, but Fox shot 48.6% from the floor to Garland's 46.0%. In a punt-FT% or FG%-focused build, Fox can be the more useful point guard; in roto, the free-throw hit matters."
  },
  {
    "rank": 78,
    "name": "Paul George",
    "team": "BOS",
    "yahooAdp": 80.4,
    "yahooPreRank": 126,
    "note": "Philadelphia traded George to Boston for Jaylen Brown in July, giving the Celtics a veteran wing who can shoot and generate steals around Tatum. He still averaged 1.7 steals and 2.7 threes, but 37 games make age and health central to the pick. George is appealing at a discount that accounts for missed games. The 1.7 steals and 2.7 threes compare favorably with Anunoby's 1.6 and 2.3, but Anunoby played 30 more games. Take George when you have room for a health bet and need shooting and defense together; a total-season roto team may prefer the steadier option."
  },
  {
    "rank": 79,
    "name": "Rudy Gobert",
    "team": "MIN",
    "yahooAdp": 72.5,
    "yahooPreRank": 87,
    "note": "Gobert still does exactly what a punt-free-throw manager wants: 11.5 rebounds, 1.6 blocks and 68.2% field-goal shooting. The 52.6% free throws mean this rank assumes a punt-FT% team; a balanced nine-category build should take him much later. Minnesota's changed frontcourt and 76-game season do not alter that central tradeoff. His 1.4 turnovers are also manageable for a center who can swing rebounds and blocks in a weekly matchup. Jarrett Allen gives less rebounding but a much gentler free-throw line; Gobert is the better buy if you are already punting FT% or can absorb a 52.6% shooter."
  },
  {
    "rank": 80,
    "name": "Zach Edey",
    "team": "MEM",
    "yahooAdp": 74.9,
    "yahooPreRank": 65,
    "note": "Edey's preseason return is worth more than another speculative promise of a bigger role. He reached 16 minutes on October 9, with 10 points and five rebounds. That is encouraging, but it does not establish that the 11.1 rebounds and 1.9 blocks from last season's tiny 11-game sample will scale to a full schedule. Memphis has other frontcourt options, and the useful milestone is sustained playing time without another interruption. For a roster short on boards and blocks, he is now easier to consider than an injured big with no return timetable. Keep a discount for workload and free throws, though. A couple of encouraging exhibitions can reopen the upside case; they cannot give him Clingan's much stronger recent availability record.",
    "sources": [
      {
        "label": "NBA player updates · Oct 10, 2026",
        "url": "https://www.nba.com/player/1641744/zach-edey"
      }
    ]
  },
  {
    "rank": 81,
    "name": "Dejounte Murray",
    "team": "NOP",
    "yahooAdp": 72.3,
    "yahooPreRank": 95,
    "note": "Murray's 6.4 assists and 1.6 steals in his 14-game return offer a useful source of two scarce guard categories. Those are useful categories even if his scoring never returns to its best level. The latest reviewed update still lists the October 8 toe absence after his preseason return. The category appeal depends on availability; that report is not medical clearance. The gap from more optimistic boards remains deliberate: a short return sample and uncertain immediate workload are not the same as an established healthy season. He fits a roster that needs passing and steals and already has dependable starters; do not make him your only plan for either category.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1627749/dejounte-murray"
      }
    ]
  },
  {
    "rank": 82,
    "name": "Norman Powell",
    "team": "CHI",
    "yahooAdp": 92.4,
    "yahooPreRank": 115,
    "note": "Chicago signed Powell after his Miami season, adding a proven 21.7-point scorer and 2.7-threes shooter. The Bulls need offense after moving Coby White, but Powell offers little in rebounds or assists. He is a useful way to add scoring late if the rest of your roster already covers those columns. Powell's 21.7 points and 2.7 threes offered more scoring punch than Bey's 17.7 and 2.1, though Bey supplied more rebounds. He is a sensible late scoring and FT% patch in category leagues, especially if your first few picks already covered assists and defensive stats."
  },
  {
    "rank": 83,
    "name": "Zion Williamson",
    "team": "NOP",
    "yahooAdp": 69.7,
    "yahooPreRank": 107,
    "note": "Zion still shoots 60.0% from the field on meaningful volume and scores 21 points a game when available. The fantasy difficulty is familiar: no threes, 71.6% free throws and another season short of 70 games. This rank assumes a punt-threes or punt-FT% roster can use his scoring and FG% impact; a balanced nine-category team should take him later. At 21.0 points on 60.0% shooting, he gives a far greater scoring lift than most efficiency-first bigs. A punt-FT% team can pair him with Gobert for dominant FG%, while a balanced nine-category roster has to cover Zion's absent threes and modest blocks."
  },
  {
    "rank": 84,
    "name": "Jarrett Allen",
    "team": "CLE",
    "yahooAdp": 70.2,
    "yahooPreRank": 67,
    "note": "Allen's value is straightforward: 63.8% shooting, 8.5 rebounds and low turnovers, with 70.9% free throws that are easier to accommodate than those of many traditional centers. His 56-game season warrants an availability discount, and the modest block rate limits how much defensive value you are buying. He is not a complete answer for rim protection, but he can repair FG% without making you abandon FT%. A punt-FT% team can prefer Gobert's stronger boards-and-blocks package; a balanced roster often has more use for Allen than a raw rebounding comparison suggests."
  },
  {
    "rank": 85,
    "name": "Damian Lillard",
    "team": "POR",
    "yahooAdp": 67.9,
    "yahooPreRank": 77,
    "note": "Lillard has cleared an important practical hurdle: he played October 7, scoring 15 points with three threes in 19 minutes. That gives you evidence of game participation, not a guarantee of his Milwaukee workload. The 2024–25 baseline of 24.9 points and 7.1 assists predates the Achilles tear, and Ja Morant now shares Portland's backcourt. I want Lillard for shooting, free-throw value and useful secondary creation, not because one exhibition proves he can reproduce every old assist. He is a reasonable seventh-round gamble after a durable opening. Taking him much earlier requires more confidence in minutes and availability than this small sample can provide; taking him with several other recovery bets makes the same uncertainty harder to manage.",
    "sources": [
      {
        "label": "NBA player updates · Oct 8, 2026",
        "url": "https://www.nba.com/player/203081/damian-lillard"
      }
    ]
  },
  {
    "rank": 86,
    "name": "Ivica Zubac",
    "team": "IND",
    "yahooAdp": 64.8,
    "yahooPreRank": 70,
    "note": "Zubac's 10.5 rebounds and 60.0% shooting are worth paying for when an early guard-heavy start needs a center. Haliburton's return also gives Indiana a route to easier finishes, although better service does not guarantee more minutes or a new scoring ceiling. His 48-game season warrants caution, while 0.8 blocks put him below the strongest rim protectors for defensive impact. Prefer him when FG% and rebounds are the holes; prefer a different center if the whole purpose of the pick is to win blocks."
  },
  {
    "rank": 87,
    "name": "Caleb Wilson",
    "team": "CHI",
    "yahooAdp": null,
    "note": "Wilson has enough evidence of involvement to be more than a final-pick name. On October 11 he delivered 17 points and five assists in 25 minutes. I would pay for the chance at a useful scoring-and-creation role, but not turn those preseason totals into season averages. Chicago also needs to accommodate Giddey, Buzelis and Powell; a promising rookie does not automatically inherit every available shot. His placement is a forward-looking upside allowance, with more uncertainty around shooting impact and turnovers than an established veteran in the same range. Draft him after covering your essential categories, not as the player who must single-handedly fix both percentages.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1643410/caleb-wilson"
      }
    ],
    "yahooPreRank": 66
  },
  {
    "rank": 88,
    "name": "Jabari Smith Jr.",
    "team": "HOU",
    "yahooAdp": 94.1,
    "yahooPreRank": 83,
    "note": "Smith's 2.3 threes and 6.9 rebounds make him a comfortable fit at power forward, and 77 games give the projection a useful availability base. Houston's crowded frontcourt and creation mix limit the easy path to a scoring jump. Draft him for shooting and boards, with defensive improvement as upside. The 2.3 threes, 6.9 rebounds and 0.9 blocks form a useful middle ground between a shooting forward and a traditional big. Compared with Naz Reid, Smith gives a little more rebounding with similar threes and blocks; balanced nine-category teams can use that flexibility more readily than points teams."
  },
  {
    "rank": 89,
    "name": "Payton Pritchard",
    "team": "BOS",
    "yahooAdp": 79.6,
    "yahooPreRank": 32,
    "note": "Pritchard's 2.7 threes, 5.2 assists and 1.4 turnovers form the kind of guard line that helps without demanding a punt. He played 79 games, which matters when so many players in this range carry health questions. Boston's new Brown-for-George lineup may shift usage, but shooting and ball security should travel. His 79 games and 1.4 turnovers make the 5.2 assists unusually easy to fit into a roto backcourt. Jerome has a higher scoring ceiling, but Pritchard is the steadier choice when your team needs threes and dimes without another high-usage gamble."
  },
  {
    "rank": 90,
    "name": "Reed Sheppard",
    "team": "HOU",
    "yahooAdp": 120.8,
    "yahooPreRank": 56,
    "note": "Sheppard's second season showed the appeal of his profile: 2.8 threes, 1.5 steals and even some blocks from a guard. Fred VanVleet's return raises a minutes question, which Yahoo's late ADP reflects. The defensive shooting mix gives him room to beat this rank if Houston keeps him heavily involved. His 2.8 threes came with 1.5 steals and 0.7 blocks, an uncommon defensive bonus for a shooter. Wallace offers more steals but less than half as many threes, so Sheppard is the better category fit when you need offense and stocks from one guard slot."
  },
  {
    "rank": 91,
    "name": "Andrew Wiggins",
    "team": "MIA",
    "yahooAdp": 100.7,
    "yahooPreRank": 103,
    "note": "Wiggins does not need a featured role to supply threes, a steal and a block from the wing. He averaged 15.4 points on 47.5% shooting for Miami, a line that fits around demanding stars. Giannis' arrival changes the shot hierarchy, so buy the complementary production rather than expecting a scoring spike. Two threes and one block per game are a helpful wing pairing, especially for a roster that is already strong in assists. McDaniels matches the block rate with better FG%, while Wiggins gives more scoring; the choice is about which category your middle rounds leave exposed."
  },
  {
    "rank": 92,
    "name": "Myles Turner",
    "team": "MIL",
    "yahooAdp": 100.3,
    "yahooPreRank": 109,
    "note": "Turner's 1.6 blocks and 2.1 threes still create the rare stretch-center package that made him a category-league staple. His 44.0% shooting and 5.3 rebounds are weaker than managers may expect from a center. Milwaukee's changed frontcourt could alter the role, so do not count on a big rebounding fix. Turner's 2.1 threes and 1.6 blocks remain a scarce combination at center, even after a lower-scoring Milwaukee season. Huff blocked slightly more shots but hit fewer threes, so Turner is easier to fit when a nine-category roster needs spacing without giving up rim protection."
  },
  {
    "rank": 93,
    "name": "Dylan Harper",
    "team": "SAS",
    "yahooAdp": null,
    "note": "Leaving Harper outside the board was too conservative once San Antonio tested him alongside Fox and Castle in the starting lineup. That is a more meaningful opportunity signal than a small burst of preseason shooting. His rookie averages were 11.8 points, 3.4 rebounds and 3.9 assists; the projection needs more playing time, not an assumption that he has already become an elite category guard. Wembanyama remains the centerpiece, and sharing the court with two other creators limits how much passing volume I would buy in advance. Harper is worth a middle-to-late-round bet on growth, but I would rather leave some upside in the price than reach for a fully realized breakout.",
    "sources": [
      {
        "label": "NBA/The Athletic · three-guard starting lineup, Oct 9",
        "url": "https://cdn-uat.nba.com/news/dylan-harper-eyes-starting-role-2026-27"
      },
      {
        "label": "NBA profile · 2025–26 baseline",
        "url": "https://www.nba.com/player/1642844/dylan-harper/bio"
      }
    ],
    "yahooPreRank": 88
  },
  {
    "rank": 94,
    "name": "Josh Hart",
    "team": "NYK",
    "yahooAdp": 96.3,
    "yahooPreRank": 68,
    "note": "Hart's 7.4 rebounds and 4.8 assists from the wing are a quiet way to patch the categories guard-heavy starts often miss. He shot 50.8% and played 66 games, helping more than the 12 points suggest. The 72.0% free throws and modest defensive stats mean the rest of your roster should cover those areas. His 1.9 turnovers are far lighter than Giddey's 3.6, a meaningful trade-off for teams that already have enough playmaking. Giddey has the higher counting-stat ceiling; Hart makes more sense in a nine-category roto build that already has enough scoring."
  },
  {
    "rank": 95,
    "name": "Brandin Podziemski",
    "team": "GSW",
    "yahooAdp": 116.8,
    "yahooPreRank": 99,
    "note": "Podziemski is a more useful late-middle-round pick when his minutes do not depend on beating a healthy, complete Warriors rotation. He was back in the starting lineup October 10. With Butler and Moody still recovering, there is a clearer opportunity to turn last season's broad supporting line into steady early contributions. The 5.1 rebounds, 3.7 assists and 1.1 steals are helpful from a guard, while 1.6 turnovers make him easier to fit beside a high-usage star. The appeal is usable production rather than a sudden scoring explosion. His 82 games last season are evidence of past availability rather than a guarantee, and the role can tighten when teammates return. Draft him for what the roster needs now, not as a season-long monopoly on backcourt minutes.",
    "sources": [
      {
        "label": "NBA player updates · Oct 10, 2026",
        "url": "https://www.nba.com/player/1641764/brandin-podziemski"
      },
      {
        "label": "Warriors injury update · Sep 28, 2026",
        "url": "https://uk.sports.yahoo.com/news/warriors-injury-porzingis-health-issue-160553940.html"
      }
    ]
  },
  {
    "rank": 96,
    "name": "Kevin Porter Jr.",
    "team": "MIL",
    "yahooAdp": 118.7,
    "yahooPreRank": 134,
    "note": "Porter's 7.4 assists and more than two steals per game explain the upside, but access to that production depends on his minutes. His 38-game season and Milwaukee's crowded guard rotation leave a wider range of minutes than a simple per-game comparison suggests. A usable bench appearance is not a guaranteed lead-guard job, so leave room in the price for a smaller role. The 2.9 turnovers and modest 1.2 threes require support from the rest of the roster; buy the passing and defensive ceiling at a discount rather than filling an early starting spot with assumptions."
  },
  {
    "rank": 97,
    "name": "Grayson Allen",
    "team": "CHA",
    "yahooAdp": 116.2,
    "yahooPreRank": 112,
    "note": "Allen's 3.1 threes and 1.4 steals make him a useful late shooting target, especially if your first picks supplied rebounds rather than perimeter volume. Charlotte's injuries create a possible opening for early minutes, but the missing players can reclaim those possessions when they return. I would treat that as a short-term opportunity rather than turn Allen into an unconditional full-season starter. His 40.3% shooting still pulls against a balanced FG% build, and last year's availability does not justify calling him a safe volume bet. He is a better immediate option than stashing an unavailable shooter when your roster needs contributions from the first week. A punt-FG% team can be more aggressive, while everyone else should weigh the threes against the cost of his misses.",
    "sources": [
      {
        "label": "Charlotte lineup update · Oct 6, 2026",
        "url": "https://www.nba.com/stats/fantasynews?Team=nuggets"
      }
    ]
  },
  {
    "rank": 98,
    "name": "Keegan Murray",
    "team": "SAC",
    "yahooAdp": 121,
    "yahooPreRank": 81,
    "note": "Murray's 23-game season makes it hard to use last year's rate as a settled baseline, although 1.5 blocks from a forward are enticing. He has shown threes and defensive value before, so a healthy season could beat this rank. The pick depends on availability and a stable Sacramento role more than a particular scoring jump. He averaged 1.5 blocks in just 23 games, more than McDaniels' 1.0, but his shot and role need a steadier season before that ceiling can be trusted. Category teams short on forward defense can buy the upside; total-season roto teams should weigh the lost games heavily."
  },
  {
    "rank": 99,
    "name": "Day'Ron Sharpe",
    "team": "BKN",
    "yahooAdp": 94.6,
    "yahooPreRank": 105,
    "note": "Sharpe belongs above speculative backup centers now that there is evidence of a usable starting opportunity. He returned from the shoulder absence to play 21 minutes on October 12. Last season's 60.1% shooting and 6.7 rebounds came in a smaller role, so the attraction is buying more minutes for an established interior skill set, not extrapolating a hot night. Brooklyn still has other players who need touches and boards. I would not assume a 30-minute job or price in new three-point volume. Around the ninth round, however, the chance to improve your rebounds and FG% is more persuasive than waiting until the final rounds for someone with a less visible path to the court.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1630549/dayron-sharpe"
      }
    ]
  },
  {
    "rank": 100,
    "name": "Miles Bridges",
    "team": "PHX",
    "yahooAdp": 98,
    "yahooPreRank": 90,
    "note": "Charlotte sent Bridges to Phoenix in July, where Devin Booker and Jalen Green also need shots. His 17.1 points, 5.8 rebounds and 1.9 threes are a useful line, but repeating the old scoring role in a new offense is not automatic. The price works if the rebounding survives fewer attempts. His 17.1 points and 5.8 boards look a lot like Bey's 17.7 and 5.6, but their new roles make last year's volume an uncertain guide. Bridges is most useful when you need points with some rebounding from a wing; category teams chasing stocks should look elsewhere."
  },
  {
    "rank": 101,
    "name": "Saddiq Bey",
    "team": "NOP",
    "yahooAdp": 120.1,
    "yahooPreRank": 108,
    "note": "Bey gave New Orleans reliable scoring volume with 17.7 points, 2.1 threes and 5.6 rebounds across 72 games. Low turnovers help, while limited steals and blocks cap his ceiling. His Yahoo cost is later than this rank, making him useful when you need points and shooting without paying for a name. Bey's 17.7 points, 2.1 threes and 5.6 rebounds made him a useful alternative to Miles Bridges for balanced wing production. His 0.9 turnovers add roto appeal, but a points league may see little difference unless the new Pelicans usage gives him another scoring step."
  },
  {
    "rank": 102,
    "name": "Cason Wallace",
    "team": "OKC",
    "yahooAdp": 118.2,
    "yahooPreRank": 75,
    "note": "Wallace can move a steals matchup with two a game while barely turning the ball over. That defensive profile is valuable on a roster full of high-usage scorers, even though his 8.6 points and 2.6 assists will not carry the offense. Draft him as category repair, not as a sudden lead-guard breakout. Two steals per game put him alongside Ausar Thompson, but Wallace adds 1.3 threes and shoots far better at the line. He is an easier fit on a balanced nine-category team, especially if a high-volume point guard already handles your assists."
  },
  {
    "rank": 103,
    "name": "Toumani Camara",
    "team": "POR",
    "yahooAdp": 110.1,
    "yahooPreRank": 98,
    "note": "Camara played every game and made 2.6 threes while giving Portland steady defense on the wing. The 70.7% free throws and modest assists keep the overall value lower than the minutes suggest. He is a useful late pick for shooting and steals, especially if your earlier roster can absorb the percentages. The 2.6 threes and 5.1 rebounds are useful from a defensive wing, even if his 1.1 steals fell short of Wallace's 2.0. Camara fits a balanced category roster that needs threes and boards in one slot; his 70.7% free throws are easier to hide in a punt-FT% build."
  },
  {
    "rank": 104,
    "name": "Darryn Peterson",
    "team": "UTA",
    "yahooAdp": null,
    "note": "Peterson scored 23 points in 30 minutes on October 6, giving Utah a reason to keep exploring his offensive role. That is a preseason result, not a scoring projection. I am willing to draft the upside, but Keyonte George already supplies creation and the frontcourt needs touches too. For nine-category purposes, the question is whether the points arrive with usable efficiency and enough secondary contributions to survive rough shooting nights. I would take him in the later middle rounds rather than at the most optimistic rookie price. A roster with dependable percentages and passing can be more patient with the learning curve than one asking him to carry those categories immediately.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1643408/darryn-peterson"
      }
    ],
    "yahooPreRank": 74
  },
  {
    "rank": 105,
    "name": "Derik Queen",
    "team": "NOP",
    "yahooAdp": 79.5,
    "yahooPreRank": 80,
    "note": "Queen's rookie year brought 7.1 rebounds and 3.7 assists from the frontcourt, a promising base for a larger second-season role. He did not add many threes, and turnovers can rise as the ball finds him more often. Draft him for the possibility that the passing and boards grow together, not because the rookie line was already polished. The rookie's 7.1 boards and 3.7 assists from a center slot give him a different path to value than rim protectors such as Gobert. In points leagues, that playmaking is especially useful; nine-category teams will need to account for his 0.3 threes and 2.3 turnovers."
  },
  {
    "rank": 106,
    "name": "Collin Gillespie",
    "team": "PHX",
    "yahooAdp": 120.8,
    "yahooPreRank": 100,
    "note": "Gillespie gives Phoenix a useful low-turnover source of threes and assists: 2.9 triples, 4.6 dimes and 1.6 turnovers in an 80-game season. He does not need a starring role to help a fantasy roster. Booker and the Suns' other scorers limit the creation ceiling, but the late draft price leaves room for this line to be worthwhile. His 2.9 threes, 4.6 assists and 1.6 turnovers are a useful late guard blend after high-usage early picks. Pritchard provides slightly more passing with similar ball security, while Gillespie's 80-game season gives both players a solid total-season case."
  },
  {
    "rank": 107,
    "name": "Kyshawn George",
    "team": "WAS",
    "yahooAdp": 118,
    "yahooPreRank": 131,
    "note": "George's 2.1 threes, 5.1 rebounds, 4.5 assists and nearly a block per game give him several ways to help without dominating the ball. Washington's addition of Trae Young may reduce his creation work, but it could also bring easier shots. The 48-game season and 43.8% shooting make the role and efficiency worth watching. At 14.8 points, 5.1 rebounds and 4.5 assists, he filled more columns than most wings this late in a draft. Podziemski offers a steadier 82-game history, while George's 0.9 blocks give a category team a higher defensive ceiling if he can stay on the court."
  },
  {
    "rank": 108,
    "name": "Bennedict Mathurin",
    "team": "NOP",
    "yahooAdp": 117.1,
    "yahooPreRank": null,
    "note": "Mathurin's route from Indiana to the Clippers at the February deadline ended with a July signing in New Orleans. Last year's 17.6 points and strong free throws offer a scoring base, but the Pelicans' wing rotation is a new puzzle. The late price works if his minutes and shots settle quickly; steals and assists are unlikely to carry him. His 17.6 points and 86.9% free throws create a clear scoring and FT% use case, but 0.8 steals and 0.2 blocks offer little defensive help. He is a better fit for points leagues or a category roster already strong in stocks than for a team hoping its final wing will fix steals."
  },
  {
    "rank": 109,
    "name": "CJ McCollum",
    "team": "ATL",
    "yahooAdp": 108.3,
    "yahooPreRank": 110,
    "note": "Washington traded McCollum to Atlanta for Trae Young in January, and he re-signed with the Hawks in July. His 18.7 points and 2.5 threes remain useful, especially if Atlanta keeps him in a steady backcourt role. Limited steals and modest assists make him a scoring supplement rather than the point guard around whom to build a team. The 18.7 points, 2.5 threes and 3.9 assists make him a practical late guard for a team short on offense. Compared with Coby White, McCollum gives similar scoring with fewer turnovers; roto managers should still ask how much Atlanta's backcourt will let him handle the ball."
  },
  {
    "rank": 110,
    "name": "Peyton Watson",
    "team": "CLE",
    "yahooAdp": 115.4,
    "yahooPreRank": 128,
    "note": "Watson's 1.1 blocks, 0.9 steals and 14.6 points gave Denver a useful two-way line. An August five-team trade sent him to Cleveland, where minutes around a deeper rotation are the main question. The defensive categories make him worth a late pick if camp confirms the role; do not simply project last year's shot count onto the new team. His 1.1 blocks and 0.9 steals offer more defensive reach than most 14-point wings, while 49.1% shooting keeps him from being a one-category specialist. He fits nine-category teams looking for stocks without an FG% sacrifice; points leagues may prefer Mathurin's steadier scoring and foul shooting."
  },
  {
    "rank": 111,
    "name": "Yaxel Lendeborg",
    "team": "GSW",
    "yahooAdp": null,
    "note": "Lendeborg's October 10 preseason line included 23 points, ten rebounds and six assists in 24 minutes. I would not annualize any of it, but the variety is a good reason to investigate him rather than dismiss all incoming rookies. Golden State's unavailable forwards leave opportunity; how much survives the regular-season rotation remains a projection. The appeal here is a chance to contribute beyond scoring, especially on a roster that already has its specialist guards. My price stays in the later rounds because one impressive exhibition does not establish defensive rates, shooting percentages or secure starter minutes. Leave room to be wrong without sacrificing the rest of your draft.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1642865/null"
      }
    ],
    "yahooPreRank": 93
  },
  {
    "rank": 112,
    "name": "Cedric Coward",
    "team": "MEM",
    "yahooAdp": 88.6,
    "yahooPreRank": 64,
    "note": "Coward's first season supplied 5.9 rebounds from the wing with 13.6 points and solid free throws. Memphis' changes make the exact offensive role less certain, but that rebounding gives him a route to value even without a scoring breakout. The Yahoo price is earlier than this rank, so a drafter needs to believe his minutes or usage will grow. He paired 13.6 points with 5.9 rebounds and 84.3% free throws, a tidy wing line in his first season. Kyshawn George has more assists and blocks, so Coward is the steadier scoring and rebounding fit rather than the bigger all-category swing."
  },
  {
    "rank": 113,
    "name": "Christian Braun",
    "team": "DEN",
    "yahooAdp": null,
    "yahooPreRank": 78,
    "note": "Braun belongs on a standard-league board before several injured names with no near-term route to production. He averaged 12.0 points, 4.8 rebounds and 2.7 assists last season, and his starting role looks secure. That does not make him a scoring breakout pick: Jokić, Murray and DeRozan can absorb plenty of possessions, leaving Braun most useful as a complementary finisher. The appeal is getting a usable wing rather than tying up a roster spot while waiting for a distant return. I would take him late when rebounds and supporting offense matter more than another high-usage guard. Yahoo's public pre-rank is considerably more optimistic; do not pay that price merely because the starting job is clearer than someone else's.",
    "sources": [
      {
        "label": "NBA player updates · Sep 29, 2026",
        "url": "https://www.nba.com/player/1631128/christian-braun"
      }
    ]
  },
  {
    "rank": 114,
    "name": "Neemias Queta",
    "team": "BOS",
    "yahooAdp": 115.2,
    "yahooPreRank": 116,
    "note": "Queta offers established center production without needing a scoring breakout. In 2025–26 he played 76 games, shot 65.3% and averaged 8.4 rebounds with 1.3 blocks. He also collected ten rebounds in 19 minutes on October 10. I am not treating that exhibition as a breakout signal; it simply fits the established reason to draft him. The lack of threes and 70.3% free throws limit how widely he fits, but those costs do not turn him into an interchangeable bench gamble. Choose him ahead of uncertain injury stashes when your final center needs to supply actual rebounds, FG% and blocks.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1629674/neemias-queta"
      }
    ]
  },
  {
    "rank": 115,
    "name": "Anthony Black",
    "team": "ORL",
    "yahooAdp": 118.7,
    "yahooPreRank": 124,
    "note": "Black took a larger Orlando role and turned it into 15 points, 1.4 steals and some blocks from the guard spot. His 73.2% free throws and only 3.7 assists keep the category line from matching the real-life progress. The defensive production makes him an interesting late pick if your earlier guards already handle shooting and creation. The 15.0 points, 3.7 assists and 1.4 steals give him a useful two-way guard profile. Castle is the stronger passer and rebounder, while Black offers more steals and fewer turnovers; in nine-category play, that distinction can matter more than the small scoring gap."
  },
  {
    "rank": 116,
    "name": "AJ Dybantsa",
    "team": "WAS",
    "yahooAdp": null,
    "note": "Dybantsa's draft pedigree should buy him consideration, not immunity from the category math. He scored 14 points with a steal and a block in 25 minutes on October 12. Washington already has established creators and frontcourt options, so I would not price the rookie as the unquestioned offensive centerpiece. The useful question is whether he can add boards and defense while his shooting and role settle. I am taking the upside in the late rounds rather than paying a premium solely for the first-overall label. In points leagues, extra scoring opportunity can move the valuation faster; here, inefficient volume and turnovers can give much of that gain back.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1643407/aj-dybantsa"
      }
    ],
    "yahooPreRank": 152
  },
  {
    "rank": 117,
    "name": "Nic Claxton",
    "team": "CHI",
    "yahooAdp": 90.1,
    "yahooPreRank": 104,
    "note": "Chicago still offers a reasonable path to minutes, but Claxton's hamstring makes the opening workload less dependable. The October 5 update called for a re-evaluation in two weeks, close to the start of the season. That is not the same as a confirmed opening-night return. His 57.1% shooting, 3.7 assists and 1.1 blocks provide useful big-man categories; 61.6% free throws keep him much more attractive to a punt-FT% team than to a balanced roster. The Bulls role has value, but the price needs to account for the risk. Sharpe is a relevant alternative if you need early production, though his own shoulder status needs checking. Take Claxton only after deciding that the potential missed games and foul-line cost are both acceptable, rather than treating a new team as an automatic breakout.",
    "sources": [
      {
        "label": "Bulls training-camp report · Oct 5, 2026",
        "url": "https://podcasts.apple.com/us/podcast/bulls-training-camp-preseason-starters-revealed-nic/id1225030836?i=1000793329258"
      }
    ]
  },
  {
    "rank": 118,
    "name": "Jimmy Butler III",
    "team": "GSW",
    "yahooAdp": null,
    "yahooPreRank": null,
    "availability": 0.3,
    "status": "Knee · targeting early 2027",
    "note": "Butler is ranked as an injured-reserve stash, not a full-season contributor. Golden State's October 2 update targeted early 2027 for his knee recovery without confirming a date, so the realistic expectation is roughly 30 to 35 games after a ramp-up. When he played last season he was still efficient: 19.8 points on 52.0% shooting, 86.2% at the line, 4.8 assists and 1.4 steals in 38 games. Half a season of that line is worth more than most healthy players available after pick 110, which is why he belongs in round ten rather than off the board. The cost is the roster spot until then. Draft him only if your league has an injured-reserve slot or a bench deep enough to carry an empty spot through December. In head-to-head, a return before your fantasy playoffs is what matters; in roto, the missed months are counting stats you cannot recover.",
    "sources": [
      {
        "label": "NBA recovery update · checked Oct 13",
        "url": "https://www.nba.com/player/202710/jimmy-butler"
      }
    ]
  },
  {
    "rank": 119,
    "name": "Collin Murray-Boyles",
    "team": "TOR",
    "yahooAdp": null,
    "note": "Murray-Boyles offers a better late gamble than an unavailable veteran when your roster still needs frontcourt contributions. His rookie season produced 8.5 points, five rebounds and 1.9 assists. On October 10 he added nine boards and two blocks in 22 bench minutes. The role is the uncertainty: he does not need to lead Toronto in scoring to help, but a limited reserve workload puts a cap on every counting category. I would use him for interior production and defensive upside, not as a solution for threes or free throws. The case improves in a build that can absorb those weaknesses, while a balanced team should avoid stacking several similarly shaped bigs.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1642867/collin-murray-boyles"
      },
      {
        "label": "NBA profile · rookie baseline",
        "url": "https://api-hub.nba.com/player/1642867"
      }
    ],
    "yahooPreRank": 113
  },
  {
    "rank": 120,
    "name": "Tari Eason",
    "team": "HOU",
    "yahooAdp": 117.1,
    "yahooPreRank": 132,
    "note": "Eason is worth moving ahead of some injured late-round names, but not because a single big scoring night guarantees a breakout. He delivered 20 points and nine rebounds in 24 minutes off the bench on October 9. The useful signal is that his rebounding and defensive activity can matter without a starting job; Houston's crowded forward rotation still limits any minutes assumption. Last year's 6.3 rebounds and 1.2 steals are the repeatable categories to target, while 41.6% shooting is a reason to avoid calling him an automatic FG% helper. He works well as a late upside pick after a stable roster is built. In a punt-FG% team, the efficiency risk is easier to absorb, but even that build needs him to stay in the rotation.",
    "sources": [
      {
        "label": "NBA player updates · Oct 9, 2026",
        "url": "https://www.nba.com/player/1631106/tari-eason"
      }
    ]
  },
  {
    "rank": 121,
    "name": "Ayo Dosunmu",
    "team": "MIN",
    "yahooAdp": 114.9,
    "yahooPreRank": 96,
    "note": "Chicago sent Dosunmu to Minnesota in February and he signed a new deal there, but the Wolves also brought in LaMelo Ball. His 51.7% shooting and 1.4 turnovers are unusually clean for a guard, so he can help without heavy usage. The crowded Ball-Edwards backcourt makes minutes the obstacle to a larger fantasy leap. His 51.7% shooting and 87.6% free throws make the 14.8 points unusually efficient for a guard. That gives him more category value than a points-league projection alone might suggest, especially beside a volume shooter who drags FG%."
  },
  {
    "rank": 122,
    "name": "DeMar DeRozan",
    "team": "DEN",
    "yahooAdp": 116.2,
    "yahooPreRank": 155,
    "note": "DeRozan left Sacramento for Denver in free agency, where Jokić should create easier scoring chances but also command the offense. He still averaged 18.1 points and shot 86.5% at the line while rarely turning it over. The 0.6 threes and little rebounding make him a late category-specific pick rather than a broad fantasy anchor. His 18.1 points, 4.1 assists and 1.2 turnovers make him a cleaner nine-category scorer than many high-volume wings. He is particularly useful for a team that needs points without adding another three-turnover guard, though his 0.6 threes mean a punt-threes roster fits him most naturally."
  },
  {
    "rank": 123,
    "name": "Andrew Nembhard",
    "team": "IND",
    "yahooAdp": 114.3,
    "yahooPreRank": 174,
    "note": "Nembhard's 7.7 assists look like a bargain at this draft price, but they came while Haliburton missed the season. Indiana's star point guard is returning, so some creation duties should move back to him. Nembhard still supplies threes and useful points; pay for a complementary guard, not the full injury-replacement role. The 7.7 assists would rank among the best late sources of dimes, and 2.4 turnovers are manageable beside that volume. Davion Mitchell offers fewer points and threes but a slightly cleaner assist-to-turnover ratio; Nembhard is the better fit when you need scoring along with playmaking."
  },
  {
    "rank": 124,
    "name": "Isaiah Hartenstein",
    "team": "OKC",
    "yahooAdp": 105.4,
    "yahooPreRank": 142,
    "note": "Hartenstein's 9.4 rebounds, 3.5 assists and 62.2% shooting give him several ways to help a roster. The passing is particularly helpful after a draft start dominated by scoring guards and wings. An ankle issue kept him out of the October 12 exhibition. That ankle concern and his 47-game season both warrant an availability discount. His 61.0% free throws are another genuine cost, so the stronger target audience is punt-FT% or a roster with enough made-free-throw volume to absorb him. I prefer this established category package to many final-round role bets, provided the ankle improves before you need him in the lineup.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1628392/isaiah-hartenstein"
      }
    ]
  },
  {
    "rank": 125,
    "name": "Devin Vassell",
    "team": "SAS",
    "yahooAdp": 116.5,
    "yahooPreRank": 120,
    "note": "Vassell made 2.5 threes with fewer than one turnover a game, a pleasant combination for a late guard or wing. He does not produce enough assists or steals to carry those categories, and San Antonio's backcourt gives him limited creation upside. Take him when you need clean shooting volume rather than a breakout lead option. His 2.5 threes and 0.9 turnovers help a nine-category team that already has its primary playmakers. Compared with Grimes, Vassell brings more shooting but less passing; both need a scoring rebound to become more than late-round complements."
  },
  {
    "rank": 126,
    "name": "Ajay Mitchell",
    "team": "OKC",
    "yahooAdp": 117.2,
    "yahooPreRank": 114,
    "note": "Mitchell gave Oklahoma City 13.6 points, 1.2 steals and efficient free throws in 57 games. His path to a bigger role is harder to see on a deep Thunder roster, so the value comes from useful two-way minutes at a late cost. He works as a depth pick after you have already secured primary scoring and assists. He shot 48.5% from the field and 87.0% at the line while adding 3.6 assists, a clean profile for a secondary guard. Gillespie gives more threes and a larger workload, so Mitchell fits best when efficiency and a possible role jump matter more than a proven volume floor."
  },
  {
    "rank": 127,
    "name": "P.J. Washington",
    "team": "DAL",
    "yahooAdp": 115.8,
    "yahooPreRank": 178,
    "note": "Washington supplies seven rebounds, a steal and a block from the forward slot, enough defensive value to remain useful without a big scoring night. Dallas' healthier creators may reduce his touches, and 68.7% free throws are a real weakness. He fits a roster that needs frontcourt defense and already has free-throw impact in place. The 7.0 boards, 1.0 steals and 1.1 blocks supply defensive help from a forward slot even when his shot is inconsistent. John Collins shoots more efficiently but contributes less across the defensive categories; Washington is the better nine-category fit if your centers already cover FG%."
  },
  {
    "rank": 128,
    "name": "Coby White",
    "team": "CHA",
    "yahooAdp": 88.5,
    "yahooPreRank": 106,
    "note": "The path to more ballhandling in Charlotte remains interesting; the calf injury is why the draft price needs to come down. White will miss preseason with a left calf strain, and his opening-night availability is unconfirmed. Last season's 17.4 points and 2.3 threes show the scoring base, but 0.5 steals and 2.6 turnovers already meant the best case was more appealing in points or eight-category formats than in balanced nine-category play. I would take the late opportunity if my guards are otherwise dependable, rather than pay in advance for both a bigger role and a smooth return. Do not stack him with Knueppel simply because Charlotte has shots to redistribute: both picks could leave you searching for healthy early-season minutes.",
    "sources": [
      {
        "label": "Hornets calf-injury announcement · Oct 6, 2026",
        "url": "https://cdn-uat.nba.com/news/coby-white-preseason-calf-strain"
      }
    ]
  },
  {
    "rank": 129,
    "name": "Jrue Holiday",
    "team": "POR",
    "yahooAdp": 117.3,
    "yahooPreRank": 161,
    "note": "Holiday still supplied 6.1 assists and 2.6 threes for Portland, but the backcourt is far more crowded now that Morant has arrived and Lillard is returning. Those changes make last year's creation load a poor projection. His defensive reputation does not add much fantasy value on its own; draft the minutes and role you can verify. His 6.1 assists and 2.6 threes show he can still handle a useful guard role when healthy. Nembhard offers more passing and played four more games last season; Holiday's veteran profile makes more sense as a late roto stabilizer than a breakout bet."
  },
  {
    "rank": 130,
    "name": "Brandon Ingram",
    "team": "LAC",
    "availability": 0.5,
    "status": "Heel/Achilles surgery · no date",
    "yahooAdp": 63,
    "yahooPreRank": 91,
    "note": "This is an injured-reserve decision now, not a routine mid-round scoring pick. Ingram will miss the opening of the season after heel and partial Achilles surgery, with no confirmed return date. His 21.5 points and 82.0% free throws from last season explain the appeal if he returns to a large Clippers role, but those numbers cannot replace the weeks spent holding an unavailable player. Prefer healthy contributors unless you have a spare injured-reserve slot. Unlike a short preseason precaution, this situation has already changed the start of his season. Garland is the more immediate way to invest in the Clippers' offense; Ingram needs a substantial discount and a roster that can wait without sacrificing flexibility.",
    "sources": [
      {
        "label": "Clippers media day · Sep 28, 2026",
        "url": "https://www.nba.com/news/brandon-ingrams-clippers-debut-on-hold-after-heel-surgery-partial-achilles-tear"
      }
    ]
  },
  {
    "rank": 131,
    "name": "Draymond Green",
    "team": "GSW",
    "yahooAdp": null,
    "yahooPreRank": 192,
    "note": "Green is a late way to add frontcourt passing without pretending every useful fantasy player must score 20 points. Last season he averaged 5.5 assists and 5.5 rebounds with only 8.4 points. That is a specific fit: he can help a punt-points roster or a team that already drafted scoring, but he will not repair an offensive shortage by himself. Golden State's unavailable veterans make an active contributor more useful than another distant stash, although more responsibility does not guarantee better efficiency or fewer turnovers. I would take him for the categories you actually need, not for his defensive reputation or an assumed return to his statistical peak. Keep age, rest and roster flexibility in the decision rather than treating an established name as a full-season guarantee.",
    "sources": [
      {
        "label": "NBA player updates · Oct 10, 2026",
        "url": "https://www.nba.com/player/203110/draymond-green"
      }
    ]
  },
  {
    "rank": 132,
    "name": "Cameron Johnson",
    "team": "DEN",
    "yahooAdp": null,
    "note": "Johnson is back in the late-round discussion because a complementary shooter can help without demanding a large share of the offense. He made four threes in 25 minutes on October 11. That does not justify projecting the night's shooting percentage forward, but it is evidence of participation in the role a drafter wants to buy. Denver's established creators make a major assists or scoring leap unnecessary to this argument. Choose him when the last wing spot needs shooting rather than defensive volume; he should not be your emergency solution for steals or blocks. I prefer that identifiable use to spending a standard-league pick on an indefinite wait for an injured name.",
    "sources": [
      {
        "label": "NBA role/game review · checked Oct 13, 2026",
        "url": "https://www.nba.com/player/1629661/cameron-johnson"
      }
    ],
    "yahooPreRank": 181
  },
  {
    "rank": 133,
    "name": "RJ Barrett",
    "team": "TOR",
    "yahooAdp": 111.5,
    "yahooPreRank": null,
    "note": "Barrett's 19.3 points on 49.1% shooting make him a useful late source of scoring, with 5.3 rebounds on top. Toronto's trade for Kawhi Leonard could take away some attempts, while 71.7% free throws and low defensive stats already limit the nine-category line. He fits better as a final scoring piece than as a category foundation. The 19.3 points on 49.1% shooting give him a stronger FG% case than most scoring wings this late. Mathurin shoots free throws better, while Barrett adds more rebounds and assists; a punt-FT% or points team can focus on the volume and worry less about his 71.7% at the line."
  },
  {
    "rank": 134,
    "name": "Wendell Carter Jr.",
    "team": "ORL",
    "yahooAdp": 113.4,
    "yahooPreRank": 160,
    "note": "Carter's 78 games, 7.4 rebounds, 51.2% shooting and 79.2% free throws make him a plausible late balanced-roster center. The concern is sharing Orlando's frontcourt with Vučević, not an inability to contribute. I am narrowing the old, overly large gap between the two rather than declaring that camp has settled their minutes. Carter gives up some shooting and passing upside but does not need a high-usage role to supply useful boards. He still leaves you looking elsewhere for blocks. Take him when those percentages and rebounds fit the last roster slot; do not buy him as a hidden high-volume scorer."
  },
  {
    "rank": 135,
    "name": "John Collins",
    "team": "DET",
    "yahooAdp": 116.5,
    "yahooPreRank": 102,
    "note": "A July sign-and-trade moved Collins from the Clippers to Detroit, placing him next to Jalen Duren in a different frontcourt mix. His 55.1% shooting and 5.3 rebounds provide a useful floor, but only 0.7 blocks limit the usual big-man appeal. The rank depends on stable minutes more than a return to his old scoring peak. He shot 55.1% from the floor, well ahead of P.J. Washington's 45.0%, but Washington gives more rebounds and blocks. Collins fits a roster that needs efficient forward scoring; nine-category teams looking for defensive repair should lean toward Washington."
  },
  {
    "rank": 136,
    "name": "Nikola Vučević",
    "team": "ORL",
    "yahooAdp": 114.7,
    "yahooPreRank": null,
    "note": "Vučević's 8.4 rebounds, 1.6 threes and only 1.3 turnovers still describe a useful fantasy center. Orlando already has Carter, and there is not enough evidence here to give Vučević his old starter workload by default. He belongs in the late-round mix, where you can take the shooting if the rotation supports it and move on if it does not. He may fit a punt-blocks roster better than a team desperate for rim protection. Carter is the more appealing alternative when you need efficient boards rather than a center's three-point volume."
  },
  {
    "rank": 137,
    "name": "Jusuf Nurkić",
    "team": "UTA",
    "availability": 0.75,
    "status": "Toe tear · re-evaluation early Nov",
    "yahooAdp": 112.8,
    "yahooPreRank": null,
    "note": "The toe injury changes Nurkić from an inexpensive source of boards and center assists into a conditional stash. Utah announced a partial plantar plate tear and a four-week re-evaluation on October 8. A re-evaluation is not a promise to play that day, so the missed opening stretch needs to be paid for in the draft price. His 10.4 rebounds and 4.8 assists last season are genuinely unusual late-round production, but only 41 games and 54.9% free throws already made him a specialized purchase. I would consider him late for a punt-FT% roster with injury space, not reach to secure the old line. Jackson and Utah's other bigs may absorb work while he is out; do not assume those temporary minutes establish the permanent rotation.",
    "sources": [
      {
        "label": "Jazz medical update · Oct 8, 2026",
        "url": "https://www.nba.com/news/jazz-jusuf-nurkic-foot-injury"
      }
    ]
  },
  {
    "rank": 138,
    "name": "Tre Jones",
    "team": "CHI",
    "yahooAdp": 116,
    "yahooPreRank": 156,
    "note": "Jones is one of the cleaner late sources of assists: 5.4 per game with only 1.4 turnovers, plus 55.3% shooting. Chicago's guard rotation changed when Coby White left, giving Jones a clearer path to useful minutes. He will not supply many threes or points, so pair him with scoring you already trust. His 5.4 assists with just 1.4 turnovers are a clean late answer for teams that took high-usage scorers early. Davion Mitchell gives more assists, while Jones' 84.1% free throws are far easier to use in roto than Mitchell's 64.6%. A hip issue kept him out October 9. This late in a draft, an available roster slot can be more useful than waiting through an unclear opening workload; verify that he is back before using him as your immediate assists fix.",
    "sources": [
      {
        "label": "NBA player updates · Oct 9, 2026",
        "url": "https://www.nba.com/player/1630200/tre-jones"
      }
    ]
  },
  {
    "rank": 139,
    "name": "Khaman Maluach",
    "team": "PHX",
    "yahooAdp": null,
    "yahooPreRank": 86,
    "note": "Maluach gets a place on this board because Phoenix has a real opening at center, not because a promising summer should automatically translate into a full-season breakout. Mark Williams is out after shoulder surgery, and Maluach started the October 10 exhibition. Ighodaro is still competing for the work, so I would buy the rebounding and rim-protection upside with a late pick rather than assume the job is settled. His small prior-season role does not establish a safe scoring, minutes or free-throw forecast. If camp ends with a dependable starting workload, he can move higher; if the minutes remain split, he is a matchup-dependent big. The draft-room mistake would be paying for both a guaranteed starting job and rapid development before either has been established.",
    "sources": [
      {
        "label": "NBA player updates · Oct 11, 2026",
        "url": "https://www.nba.com/player/1642863/khaman-maluach"
      },
      {
        "label": "Suns shoulder-surgery announcement · Sep 11, 2026",
        "url": "https://cdn-uat.nba.com/news/phoenix-suns-mark-williams-injury"
      }
    ]
  },
  {
    "rank": 140,
    "name": "Julian Champagnie",
    "team": "SAS",
    "yahooAdp": 110.9,
    "yahooPreRank": 127,
    "note": "Champagnie played every game and supplied 2.4 threes with 5.8 rebounds, a useful combination from a late wing pick. San Antonio's stars keep his usage modest, which limits points and assists. He is a sensible choice when your roster needs reliable shooting and boards more than another speculative creator. The 2.4 threes, 5.8 boards and 0.8 turnovers make him a quiet nine-category glue player. He offers less scoring than Vassell but more rebounding from the same Spurs wing group, so team need should determine which one you take late."
  },
  {
    "rank": 141,
    "name": "Zach LaVine",
    "team": "SAC",
    "yahooAdp": 103.7,
    "yahooPreRank": 162,
    "note": "LaVine still scored 19.2 points and made 2.5 threes, but a 39-game season makes availability the first question. Sacramento's changing lineup also gives less certainty about his shot volume than the old name value suggests. The Yahoo cost is earlier than this ranking; take him only if you can carry the missed-game risk and need scoring. His 19.2 points and 88.0% free throws still address two categories that tend to dry up early in drafts. Powell gave more points and threes over 19 more games, so LaVine is the cheaper head-to-head scoring bet rather than the safer roto choice."
  },
  {
    "rank": 142,
    "name": "Kristaps Porziņģis",
    "team": "GSW",
    "yahooAdp": null,
    "yahooPreRank": null,
    "availability": 0.35,
    "status": "Away from team · no timetable",
    "note": "Porziņģis is the higher-ceiling final-round stash. He remained away from the team on October 12 with no confirmed return timetable, and last season's 32 games extend a long pattern of missed time, so this rank assumes a large share of the season is lost. The per-game profile explains why he is on the board at all: 16.7 points, 1.7 threes, 1.2 blocks and 84.2% free throws in 24 minutes is a rare stretch-big combination. At No. 142 the price is a bench spot, not a starting-lineup plan. The report does not establish a diagnosis, and the ranking should not invent one. Move him up only when Golden State gives a concrete timeline, and drop him without regret if a healthy contributor needs the spot.",
    "sources": [
      {
        "label": "NBA availability update · Oct 12",
        "url": "https://www.nba.com/player/204001/kristaps-porzingis"
      }
    ]
  },
  {
    "rank": 143,
    "name": "Aaron Gordon",
    "team": "DEN",
    "yahooAdp": 112.5,
    "yahooPreRank": 154,
    "note": "Gordon's 16.2 points and 5.8 rebounds are useful when he plays, but last season ended at 36 games. Denver also added DeMar DeRozan, which can take some offensive possessions from its forwards. He remains a good complement to Jokić in real basketball; in fantasy, the health and reduced usage possibilities make him a late pick. He supplied 16.2 points on 49.7% shooting with 5.8 rebounds, useful numbers when Denver could keep him on the floor. Collins offers a stronger FG% rate and more games, while Gordon's 2.7 assists add a little more creation; both require a health and role discount."
  },
  {
    "rank": 144,
    "name": "Kelly Oubre Jr.",
    "team": "IND",
    "yahooAdp": 117.4,
    "yahooPreRank": 169,
    "note": "Oubre left Philadelphia for Indiana, where his place in a healthier Pacers rotation will decide the minutes. He averaged 1.4 steals and 14.1 points, a useful late-wing mix when the role is secure. His assists are thin, and he is not an efficiency anchor, so target him for defense and secondary scoring. The 1.4 steals and 5.0 rebounds are useful wing categories even if his 14.1 points do not carry a points-league roster. He can help a nine-category team that missed steals, but 50 games make him a less secure volume pick than Champagnie; Moody's injury recovery makes him a watchlist option rather than a healthy alternative."
  },
  {
    "rank": 145,
    "name": "Davion Mitchell",
    "team": "MIA",
    "yahooAdp": 118.6,
    "yahooPreRank": 118,
    "note": "Mitchell's 6.5 assists and 49.0% shooting were helpful from a Miami guard, especially with only 1.5 turnovers. Giannis' arrival changes the offense, but the bigger fantasy issue remains his 64.6% free throws and limited scoring. He works as a late assists source if the rest of your roster can absorb that line. His 6.5 assists and 1.5 turnovers are an unusually clean passing combination in the late rounds. Tre Jones is friendlier to FT% and offers more scoring; Mitchell fits a punt-FT% roster or a team that needs dimes without adding turnover pain."
  },
  {
    "rank": 146,
    "name": "Jaime Jaquez Jr.",
    "team": "MIL",
    "yahooAdp": 106.1,
    "yahooPreRank": 63,
    "note": "Miami sent Jaquez to Milwaukee in the July Giannis package, giving him a different route to minutes and creation. He averaged 15.4 points and 4.7 assists on 50.7% shooting, a well-rounded offensive base for this price. The Bucks' new rotation could lift or squeeze him, so treat the old role as evidence rather than a promise. The 15.4 points, 5.0 rebounds and 4.7 assists give him an appealing multi-category line from a wing. Podziemski offers better threes and a longer recent workload, while Jaquez brings more scoring and FG%; points leagues may prefer the latter combination."
  },
  {
    "rank": 147,
    "name": "Jalen Green",
    "team": "PHX",
    "yahooAdp": 103,
    "yahooPreRank": 140,
    "note": "Green's 32-game Phoenix season did little to resolve the old fantasy question: can the scoring volume outweigh 42.2% shooting and a thin assist line? The Suns now have Miles Bridges beside Devin Booker, adding competition for shots. He has the talent to beat this rank, but the role and health have to cooperate before the nine-category case is strong. His 17.8 points and 2.2 threes in 32 games hint at a late scoring payoff, but 42.2% shooting and 74.7% free throws can hurt both percentages. He is easier to use in a punt-FG% or points league than in balanced roto, where the small sample and efficiency risks compound."
  },
  {
    "rank": 148,
    "name": "Santi Aldama",
    "team": "DAL",
    "yahooAdp": null,
    "yahooPreRank": 180,
    "note": "Memphis traded Aldama to Dallas in July, making his 6.7 rebounds and 1.6 threes part of a crowded Mavericks frontcourt. The stretch-big profile is useful, but the team must give him enough minutes around Cooper Flagg and its centers. His 66.7% free throws mean the role needs to be substantial before this becomes more than a late flier. The 14.0 points, 6.7 boards and 1.6 threes can fill several late roster holes from a forward or center slot. Washington supplies more steals and blocks, so Aldama is the better fit when offense and rebounds matter more than defensive stocks."
  },
  {
    "rank": 149,
    "name": "Herbert Jones",
    "team": "NOP",
    "yahooAdp": null,
    "yahooPreRank": 148,
    "note": "Jones' 1.6 steals still create a reason to draft him, and he added 1.4 threes despite another uneven offensive season. The 38.3% field-goal shooting is too damaging to ignore in a balanced build. He makes most sense when your early roster is efficient and you need one late defensive specialist. His 1.6 steals remain a category weapon, but 38.3% shooting makes the cost of those steals unusually high. A punt-FG% head-to-head team can draft him for defense; balanced roto teams may prefer Wallace's similar steals rate and much lighter shooting penalty."
  },
  {
    "rank": 150,
    "name": "Dillon Brooks",
    "team": "PHX",
    "yahooAdp": 114.9,
    "yahooPreRank": 171,
    "note": "Brooks' 20.2 points look tempting this late, but the full line includes 43.5% shooting, only 1.8 assists and little shot blocking. Phoenix now has more scoring options around Booker, so last year's volume may be difficult to repeat. Take him if you need points and threes; do not mistake the scoring average for broad nine-category value. His 20.2 points and 2.3 threes were a bigger scoring contribution than Oubre or Moody supplied, though he gives less across rebounds and assists. He fits a late points or threes need; in roto, the 43.5% FG and uncertain Phoenix usage deserve a discount."
  }
];

// Injured players who are not on the board: returns too late or too uncertain
// for a redraft pick at their level. Not rendered anywhere. They exist so the
// live punt tables (RankingTable) still discount them instead of ranking them
// on last season's per-game line, and so round-target "others" can reject them.
// A player with a concrete timetable and enough value belongs in PLAYERS,
// ranked where the missed games put him, with `availability` and `status`.
export const UNRANKED_INJURIES = [
  {
    "name": "Donte DiVincenzo",
    "team": "MIN",
    "availability": 0.1,
    "status": "Achilles · late-season at best",
    "note": "A late-season return from the Achilles tear is still only a possibility, not an established date. His 82 regular-season games last year came before that injury and must not be presented as a safe workload forecast. The old threes-and-steals line is worth remembering for a later waiver decision, but I would not spend a standard redraft pick or an ordinary bench spot waiting on it. A deep league with a genuinely spare injured-reserve slot can make a different decision; even there, check whether a return would occur before your fantasy playoffs finish.",
    "sources": [
      {
        "label": "NBA recovery update · Oct 5, 2026",
        "url": "https://www.nba.com/knicks/player/1628978/donte-divincenzo"
      }
    ]
  },
  {
    "name": "Moses Moody",
    "team": "GSW",
    "availability": 0.5,
    "status": "Patellar tendon · no return plan",
    "note": "Moody was limited to light on-court work in the September 28 update after his patellar-tendon injury. That is not clearance for a normal role. His 2.5 threes and low turnovers remain a potentially useful profile later, but his recovery makes him unsuitable as a dependable full-season pick. I would use the draft pick on an available player and revisit Moody when there is a clearer game-return plan. Do not set a return date from a generic injury-table estimate or mistake a positive rehabilitation update for a fantasy lineup decision.",
    "sources": [
      {
        "label": "NBA player updates · Sep 28, 2026",
        "url": "https://www.nba.com/player/1630541/moses-moody"
      }
    ]
  },
  {
    "name": "Kyle Filipowski",
    "team": "UTA",
    "availability": 0.4,
    "status": "Back surgery · no timetable",
    "note": "The October 10 update described recovery from back surgery without a return timetable. Nurkić's injury therefore does not make Filipowski an automatic early-season beneficiary. His 7.2 rebounds and 2.6 assists last season remain interesting, but they are not available production until he is cleared to play. I would leave him outside the standard redraft board for now rather than use a final pick on two separate assumptions: a prompt recovery and a large role. He belongs on a watchlist for a later minutes opportunity, not in a plan that needs an immediate center contribution.",
    "sources": [
      {
        "label": "NBA player updates · Oct 10, 2026",
        "url": "https://www.nba.com/player/1642271/kyle-filipowski"
      }
    ]
  },
  {
    "name": "Mark Williams",
    "team": "PHX",
    "availability": 0.4,
    "status": "Shoulder surgery · no timetable",
    "note": "Williams is without a confirmed return timetable after September shoulder surgery. A healthy interior scorer can have considerable fantasy value, but a standard redraft roster should not pay for months of waiting as if they were free. I am leaving him outside the active Top 150 and considering Phoenix's available centers instead. Managers with extra injury slots can monitor him as a stash, provided the opportunity cost and the league's playoff dates make sense. Revisit the ranking when there is concrete progress toward playing rather than assuming the best-case calendar becomes the actual one.",
    "sources": [
      {
        "label": "Suns shoulder-surgery announcement · Sep 11, 2026",
        "url": "https://cdn-uat.nba.com/news/phoenix-suns-mark-williams-injury"
      }
    ]
  }
];
