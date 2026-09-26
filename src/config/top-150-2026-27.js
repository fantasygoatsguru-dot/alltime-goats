// Projected pure 9-cat top 150 for the 2026-27 season.
//
// This is a 2026-27 projection, refreshed against corrected 2025-26 results.
// The order uses corrected 2025-26 nine-category value, Yahoo standard rank and
// ADP, plus editorial adjustments for health, role and team changes. Yahoo
// market data is a dated snapshot, not a 2026-27 stat projection.
//
// The rows are keyed by `name`; <ProjectionList> matches them against
// player_period_averages for `PRIOR_SEASON` to show last season's actual line
// underneath the projection. A name that doesn't match simply renders without
// the line (that's the intended behaviour for players who missed the season —
// Haliburton, Lillard, Irving), so keep spellings identical to the database.
//
// Rankings assume no punt: all nine categories weighted equally.

export const PROJECTION_SEASON = '2026-27';
export const PRIOR_SEASON = '2025-26';

// The board is grouped the way it is actually used: rounds of a 12-team draft.
// `from`/`to` are derived so the grouping stays correct if the list ever grows
// past 150.
export const PICKS_PER_ROUND = 12;

const ROUND_NOTES = [
  'These picks supply the broadest category base. Use the player notes to decide which first-round weakness your next selection must cover.',
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

export const YAHOO_MARKET_DATE = '2026-09-26';

export const PLAYERS = [
  {
    "rank": 1,
    "name": "Nikola Jokić",
    "team": "DEN",
    "yahooAdp": 1.9,
    "yahooPreRank": 1,
    "note": "Still the safest first pick in fantasy basketball. Jokić is the only player on this board who is elite in points, rebounds, assists and field-goal percentage at the same time, and he adds positive free-throw value from the center slot. Last season he averaged 27.7 points, 12.9 rebounds and 10.7 assists while shooting 56.9% from the field. The 3.7 turnovers and his age are the costs, but neither is enough to take away the broadest category foundation in the draft."
  },
  {
    "rank": 2,
    "name": "Victor Wembanyama",
    "team": "SAS",
    "yahooAdp": 1.6,
    "yahooPreRank": 3,
    "note": "The only player with a realistic path to pushing Jokić out of the top spot. His 3.1 blocks per game can tilt a matchup on their own, yet he also gives you 25 points, 11.5 rebounds and usable threes without a free-throw punt. The debate at pick one is about games played, not talent: last season's 64 games still leave some room for a healthier ceiling."
  },
  {
    "rank": 3,
    "name": "Shai Gilgeous-Alexander",
    "team": "OKC",
    "yahooAdp": 4.1,
    "yahooPreRank": 2,
    "note": "The cleanest perimeter anchor in nine-category leagues. SGA scored 31.1 points on 55.3% shooting and made 87.9% of his free throws while adding assists and steals; 2.2 turnovers are manageable for that level of creation. Rebounds and threes are the columns to address later, but neither should stop you from taking him in the first four picks."
  },
  {
    "rank": 4,
    "name": "Luka Dončić",
    "team": "LAL",
    "yahooAdp": 3.5,
    "yahooPreRank": 5,
    "note": "Luka can give a team its points, threes, rebounds and assists foundation in one selection. His first full Lakers season produced 33.4 points, 4.0 threes, 7.7 boards and 8.2 assists, so a repeat would overwhelm most opponents in those categories. Four turnovers a game are the unavoidable cost; draft him with a plan to protect that column or commit to punting it."
  },
  {
    "rank": 5,
    "name": "Donovan Mitchell",
    "team": "CLE",
    "yahooAdp": 13.8,
    "yahooPreRank": 8,
    "note": "A stronger nine-category first-round pick than his Yahoo ADP suggests. Mitchell's 27.9 points, 3.2 threes, 1.5 steals and 86.5% free throws give you several scarce guard contributions without the field-goal hit many volume scorers bring. He does little for rebounds or blocks, so make the next pick a frontcourt complement if you want to stay balanced."
  },
  {
    "rank": 6,
    "name": "Anthony Edwards",
    "team": "MIN",
    "yahooAdp": 8.3,
    "yahooPreRank": 6,
    "note": "You know exactly which categories Edwards is meant to carry: he averaged 28.8 points and 3.4 threes, and even chipped in five rebounds from the wing. He was less helpful in assists and free-throw impact than the best first-round guards, which makes his next teammate more important than his scoring totals suggest. His 61-game season also deserves more weight than the old durability reputation."
  },
  {
    "rank": 7,
    "name": "Jamal Murray",
    "team": "DEN",
    "yahooAdp": 20.5,
    "yahooPreRank": 9,
    "note": "Last season finally gave Murray the full-volume fantasy line managers have waited for: 25.4 points, 3.3 threes and 7.1 assists across 75 games. That production makes him more than a late-second-round consolation prize at Yahoo's current price. Denver added DeMar DeRozan, so I would not simply copy Murray's usage forward, but his shooting and playmaking still give him a clear path to early-round value."
  },
  {
    "rank": 8,
    "name": "Tyrese Maxey",
    "team": "PHI",
    "yahooAdp": 8.8,
    "yahooPreRank": 4,
    "note": "The 2025–26 line was worthy of an early first-round pick: 28.3 points, 3.1 threes, 6.6 assists and 1.9 steals, with strong free throws. Philadelphia has since added LeBron James and acquired Jaylen Brown, so projecting the same creation load would be careless. Maxey can give some of it back and still justify this rank; the risk is a larger scoring and assist dip than the new lineup requires."
  },
  {
    "rank": 9,
    "name": "Cade Cunningham",
    "team": "DET",
    "yahooAdp": 6.2,
    "yahooPreRank": 25,
    "note": "Few players can match Cunningham's 9.9 assists while also supplying nearly 24 points and useful rebounds. Detroit will keep putting the ball in his hands, which makes the opportunities unusually secure. The 3.7 turnovers hurt in a pure nine-category build, and his free-throw impact is modest for a guard drafted this early; pair him with efficient perimeter production."
  },
  {
    "rank": 10,
    "name": "Jalen Johnson",
    "team": "ATL",
    "yahooAdp": 11.8,
    "yahooPreRank": 16,
    "note": "The value of Johnson is the shape of his line. A forward giving you 10.3 rebounds and 7.9 assists frees the rest of your draft to chase scoring and shooting without abandoning the boards. His 22.5 points help too, but 3.4 turnovers and ordinary free-throw impact keep this from being a no-questions-asked first-round profile."
  },
  {
    "rank": 11,
    "name": "Austin Reaves",
    "team": "LAL",
    "yahooAdp": 22.3,
    "yahooPreRank": 17,
    "note": "LeBron's move to Philadelphia leaves more creation for Reaves beside Luka in Los Angeles. He already averaged 22.9 points and 5.5 assists on 48.7% shooting, so a larger role can push him into the first-round conversation. Last year's 51 games are the caution; the projection needs both the opportunity and enough availability to pay off."
  },
  {
    "rank": 12,
    "name": "Jayson Tatum",
    "team": "BOS",
    "yahooAdp": 9.8,
    "yahooPreRank": 14,
    "note": "The 16-game return from the Achilles injury is too small a sample to define Tatum's next season. He still supplied ten rebounds and 2.9 threes in that stretch, and Boston's trade of Jaylen Brown to Philadelphia gives him a path back to a larger scoring role. This rank prices in a strong return while leaving room for a slower start or a minutes limit."
  },
  {
    "rank": 13,
    "name": "Kawhi Leonard",
    "team": "TOR",
    "yahooAdp": 29.3,
    "yahooPreRank": 15,
    "note": "When he played, Kawhi was still an elite fantasy producer: 27.5 points, 1.8 steals and excellent percentages in 65 games. A September trade sent him from the Clippers back to Toronto for Brandon Ingram, putting that line in a different offense beside Scottie Barnes. The Yahoo discount reflects real age and availability risk, but the per-game upside makes him hard to pass at this spot."
  },
  {
    "rank": 14,
    "name": "Scottie Barnes",
    "team": "TOR",
    "yahooAdp": 14.1,
    "yahooPreRank": 22,
    "note": "Barnes helps in almost every category without needing a huge scoring night to matter. He played 80 games and averaged 7.5 rebounds, 5.9 assists, 1.4 steals and 1.4 blocks, a remarkably useful mix for a forward. Toronto's addition of Kawhi Leonard may trim his scoring share, but the passing and defense should remain the reasons to draft him."
  },
  {
    "rank": 15,
    "name": "Cooper Flagg",
    "team": "DAL",
    "yahooAdp": 10.1,
    "yahooPreRank": 7,
    "note": "Flagg's first NBA season already brought 21 points, 6.7 rebounds, 4.5 assists and contributions in both defensive categories. It is easy to see a second-year leap, especially if the three-point shot develops. Kyrie Irving's return gives Dallas another creator, however, so the best case is growth in efficiency and all-around impact rather than an automatic jump in usage."
  },
  {
    "rank": 16,
    "name": "Karl-Anthony Towns",
    "team": "NYK",
    "yahooAdp": 15,
    "yahooPreRank": 13,
    "note": "Towns is one of the easiest early centers to fit around a guard-heavy start. His 11.9 rebounds and 85.8% free throws come with solid field-goal impact and some threes, so he solves problems without creating the usual big-man penalty at the line. Half a block a game means he cannot be your main source of rim protection."
  },
  {
    "rank": 17,
    "name": "Kevin Durant",
    "team": "HOU",
    "yahooAdp": 16.9,
    "yahooPreRank": 27,
    "note": "Durant still gives a fantasy roster the hard-to-find combination of volume scoring and clean percentages. He averaged 26 points on 52.0% shooting and 87.4% from the line across 78 games, a stronger availability result than his age might lead you to expect. The age risk remains real, and Houston's other creators can limit his assists, but the per-game case is still comfortably early-round."
  },
  {
    "rank": 18,
    "name": "Stephen Curry",
    "team": "GSW",
    "yahooAdp": 23.9,
    "yahooPreRank": 11,
    "note": "Four-plus threes and elite free-throw impact remain a powerful start to a draft, and Curry supplied both in 2025–26. The price has to reflect that he played only 43 games, though; a healthy 26.5-point season is a very different outcome from another long absence. Pair him with durable picks and make sure your roster can cover rebounds."
  },
  {
    "rank": 19,
    "name": "Lauri Markkanen",
    "team": "UTA",
    "yahooAdp": 38.7,
    "yahooPreRank": 18,
    "note": "Markkanen gives you a big's roster slot without sacrificing threes or free throws. He scored 26.6 points and hit 89.6% at the line last season, which is why the per-game ceiling sits much higher than his Yahoo draft cost. Only 42 games and Utah's addition of Jaren Jackson Jr. make this a riskier bet than the shooting line alone suggests."
  },
  {
    "rank": 20,
    "name": "Tyrese Haliburton",
    "team": "IND",
    "yahooAdp": 16.5,
    "yahooPreRank": 12,
    "note": "A healthy Haliburton is one of the rare guards who can carry assists and threes without burying you in turnovers. He missed 2025–26 after the Achilles injury; his last full-season baseline was 18.6 points and 9.2 assists in 2024–25. This ranking bets on much of that profile returning, while allowing for an uneven ramp back to full minutes."
  },
  {
    "rank": 21,
    "name": "Chet Holmgren",
    "team": "OKC",
    "yahooAdp": 27.7,
    "yahooPreRank": 19,
    "note": "Holmgren brings a combination many centers cannot offer: nearly two blocks, 8.9 rebounds, useful threes and strong field-goal shooting without a major free-throw penalty. Oklahoma City's depth may keep his minutes below those of other early bigs, but the category spread gives him plenty of value even there. A healthy, larger workload is the upside."
  },
  {
    "rank": 22,
    "name": "Trey Murphy III",
    "team": "NOP",
    "yahooAdp": 40.1,
    "yahooPreRank": 21,
    "note": "Murphy's 3.2 threes and 1.5 steals are already a rare pairing, and his 21.5 points make him much more than a shooting specialist. He is far cheaper in Yahoo drafts than this projection, which leaves room to wait if your league follows that market. His rebounds and assists are useful rather than carrying categories, so a point guard or rebounding big still makes sense beside him."
  },
  {
    "rank": 23,
    "name": "Amen Thompson",
    "team": "HOU",
    "yahooAdp": 23.6,
    "yahooPreRank": 10,
    "note": "Amen does his best work in categories most guards cannot supply: 7.8 rebounds on 53.4% shooting, plus 1.5 steals. The assists are valuable too, but Fred VanVleet's return could reduce the point-guard time that helped him reach 5.3 a game. The almost empty three-point column means your other perimeter picks need to shoot."
  },
  {
    "rank": 24,
    "name": "Bam Adebayo",
    "team": "MIA",
    "yahooAdp": 30.1,
    "yahooPreRank": 30,
    "note": "Bam's case is built on 20 points, ten rebounds and helpful assists and steals from a center, not on dominant blocks. His 44.2% field-goal mark last season also removes some of the efficiency cushion managers expect from a big. Miami's addition of Giannis changes the frontcourt hierarchy, so this rank assumes Bam keeps enough touches and minutes to preserve the broad line."
  },
  {
    "rank": 25,
    "name": "James Harden",
    "team": "CLE",
    "yahooAdp": 35.1,
    "yahooPreRank": 49,
    "note": "Harden still supplies elite assists, threes and free-throw impact, but the surrounding context has changed. The February swap for Darius Garland moved him from the Clippers to Cleveland, where Donovan Mitchell also needs the ball. His 7.9 assists can survive a shared backcourt; 3.5 turnovers and an ordinary field-goal rate are the reasons he sits below the cleanest guards."
  },
  {
    "rank": 26,
    "name": "Devin Booker",
    "team": "PHX",
    "yahooAdp": 26.9,
    "yahooPreRank": 40,
    "note": "Booker offers a dependable scoring and free-throw foundation, and his six assists keep him from being a points-only pick. Phoenix's addition of Miles Bridges adds another scorer around him, but Booker remains the offense's best bet for high-volume creation. The modest steals and 3.2 turnovers are the categories to balance with later picks."
  },
  {
    "rank": 27,
    "name": "Derrick White",
    "team": "BOS",
    "yahooAdp": 47.1,
    "yahooPreRank": 26,
    "note": "White's fantasy value is easy to miss if you stop at the 16.5 points. He averaged 2.7 threes, 5.4 assists and 1.3 blocks from a guard spot, a combination that fits almost any build. The 39.5% field-goal shooting is a real cost, so pair him with an efficient frontcourt player rather than asking him to anchor a percentage."
  },
  {
    "rank": 28,
    "name": "Evan Mobley",
    "team": "CLE",
    "yahooAdp": 30,
    "yahooPreRank": 45,
    "note": "Mobley gives you nine rebounds and 1.7 blocks while keeping the field-goal category strong, a straightforward way to balance an early guard pick. His free throws fell to 60.6% last season, so the old assumption that he is safe at the line no longer works. Draft him for the defensive and rebounding floor, then protect FT% or lean into a punt."
  },
  {
    "rank": 29,
    "name": "Jalen Brunson",
    "team": "NYK",
    "yahooAdp": 21.9,
    "yahooPreRank": 42,
    "note": "Brunson gives you reliable points and assists without the extreme turnovers of some high-usage guards. He averaged 26 points and 6.8 assists across 74 games, so the role and availability are both easier to trust than many players in this range. He adds little in steals, rebounds or blocks; those categories should guide your next picks."
  },
  {
    "rank": 30,
    "name": "Alperen Sengun",
    "team": "HOU",
    "yahooAdp": 18.4,
    "yahooPreRank": 57,
    "note": "A center who averages 6.2 assists and nearly nine rebounds changes what you need from your guards. Sengun also supplies strong field-goal shooting and more than a steal a game, making him a useful build anchor. The 69.1% free throws and 3.2 turnovers demand a plan, especially if your first pick already hurt either category."
  },
  {
    "rank": 31,
    "name": "Giannis Antetokounmpo",
    "team": "MIA",
    "yahooAdp": 7.8,
    "yahooPreRank": 50,
    "note": "The per-game force is obvious: 27.6 points, 9.8 rebounds and 62.4% field-goal shooting even in an injury-shortened season. Miami acquired Giannis from Milwaukee in the July deal that sent Tyler Herro, Kel'el Ware and Jaime Jaquez Jr. the other way, so the Bam Adebayo pairing adds a new usage question. In pure nine-category leagues, 65.0% free throws on volume and last year's 36 games make Yahoo's first-round price difficult to justify without a punt plan."
  },
  {
    "rank": 32,
    "name": "Donovan Clingan",
    "team": "POR",
    "yahooAdp": 41.6,
    "yahooPreRank": 29,
    "note": "Clingan already gives you the traditional center categories in bulk: 11.5 boards and 1.7 blocks across 77 games. He even made more than a three a night, although that is a bonus rather than the core of the pick. Free throws and steals need help elsewhere, but his reliable minutes make him a clean way to repair a guard-heavy start."
  },
  {
    "rank": 33,
    "name": "Nickeil Alexander-Walker",
    "team": "ATL",
    "yahooAdp": 60.1,
    "yahooPreRank": 24,
    "note": "The new Atlanta role turned Alexander-Walker into a real scorer, not merely a steals specialist. He averaged 20.8 points and 3.2 threes while hitting 90.2% at the line, and he played 78 games. Yahoo's much later ADP leaves a possible discount if the Hawks keep that offensive workload intact."
  },
  {
    "rank": 34,
    "name": "Onyeka Okongwu",
    "team": "ATL",
    "yahooAdp": 54.7,
    "yahooPreRank": 36,
    "note": "Okongwu's line is broader than that of a traditional shot blocker: 15.2 points, 7.6 rebounds, 1.9 threes and contributions in both defensive categories. He does not dominate FG% the way some centers do, so the shooting volume matters as much as the percentage. At his Yahoo price, the appeal is getting several useful categories from one mid-round frontcourt slot."
  },
  {
    "rank": 35,
    "name": "Desmond Bane",
    "team": "ORL",
    "yahooAdp": 52.9,
    "yahooPreRank": 44,
    "note": "Bane is a dependable way to buy points and strong free-throw impact without giving away field-goal percentage. He played all 82 games for Orlando, averaged 20.1 points and shot 90.8% at the line. The line lacks a single massive counting category, but that durability and efficiency make him easy to fit around a riskier early pick."
  },
  {
    "rank": 36,
    "name": "Michael Porter Jr.",
    "team": "BKN",
    "yahooAdp": 59.6,
    "yahooPreRank": 55,
    "note": "Brooklyn gave Porter the scoring role that Denver could not, and he turned it into 24.2 points, 3.4 threes and 7.1 rebounds. That is early-round per-game production at a much later Yahoo price. The question is availability after a 52-game season, along with whether the Nets' changed frontcourt keeps his shot volume as high."
  },
  {
    "rank": 37,
    "name": "Jalen Duren",
    "team": "DET",
    "yahooAdp": 36,
    "yahooPreRank": 28,
    "note": "Duren solves rebounds and field-goal percentage almost by himself, and his 19.5 points make him more than a specialist. Detroit moved Isaiah Stewart to Memphis, clearing additional frontcourt room around its starting center. The zero threes and 74.7% free throws mean he fits best behind guards who already handle shooting and creation."
  },
  {
    "rank": 38,
    "name": "Dyson Daniels",
    "team": "ATL",
    "yahooAdp": 62.9,
    "yahooPreRank": 20,
    "note": "Two steals a game make Daniels a category changer, and the 6.8 rebounds and 5.9 assists are unusually helpful from a guard. His 0.3 threes and 61.5% free throws can pull a balanced roster in the wrong direction, though. Draft him when you already have shooting and free-throw volume, then let his defense and playmaking do the work."
  },
  {
    "rank": 39,
    "name": "Brandon Miller",
    "team": "CHA",
    "yahooAdp": 46.8,
    "yahooPreRank": 46,
    "note": "Miller supplies the volume threes and points Charlotte needs after its backcourt reshuffle. He averaged 20.2 points and 3.1 threes, but 43.5% shooting and 2.5 turnovers keep the nine-category ceiling below the scoring headline. The upside depends on taking a larger share of creation without losing more efficiency."
  },
  {
    "rank": 40,
    "name": "Josh Giddey",
    "team": "CHI",
    "yahooAdp": 23.8,
    "yahooPreRank": 61,
    "note": "The appeal of Giddey is not hard to see: 8.3 rebounds and 9.1 assists from a guard can fix two categories in one pick. Chicago's new rotation may change the exact usage, but that out-of-position production remains his calling card. The 3.6 turnovers and 76.3% free throws make him much more attractive to the right build than to a roster trying to stay balanced."
  },
  {
    "rank": 41,
    "name": "Domantas Sabonis",
    "team": "SAC",
    "yahooAdp": 27,
    "yahooPreRank": 38,
    "note": "Nineteen games are a poor basis for writing off a player who has long supplied elite rebounds, efficient scoring and center-position assists. The 2025–26 sample still showed 11.4 boards, but health is the reason he comes at a discount. If the role and minutes normalize, this rank will look cautious; free throws and blocks remain the category compromises."
  },
  {
    "rank": 42,
    "name": "Jaylen Brown",
    "team": "PHI",
    "yahooAdp": 27.5,
    "yahooPreRank": 95,
    "note": "Brown's 28.5 points and 6.9 rebounds were outstanding in Boston, but the same workload is not guaranteed in Philadelphia. The July trade for Paul George put him beside Tyrese Maxey and the newly signed LeBron James, giving the Sixers three players who can create their own offense. His points and boards still carry value; 3.6 turnovers and a shared usage pie keep me below Yahoo's price."
  },
  {
    "rank": 43,
    "name": "Jaren Jackson Jr.",
    "team": "UTA",
    "yahooAdp": 50.5,
    "yahooPreRank": 54,
    "note": "Jackson's blocks are still a scarce asset, though last season's 1.4 per game were below his best years. Memphis sent him to Utah at the February deadline, and sharing the frontcourt with Lauri Markkanen changes the touches and rebounding context. He can beat this rank if the defensive rate rises again, but 48 games make a full-season bet less comfortable."
  },
  {
    "rank": 44,
    "name": "Alex Sarr",
    "team": "WAS",
    "yahooAdp": 71.9,
    "yahooPreRank": 59,
    "note": "Sarr gives you a path to two blocks a night without spending a first-round pick, and his 16.3 points add some scoring upside. He appeared in 48 games, so availability is part of the decision. Free throws are the main category to protect; the defensive ceiling remains the reason to take him ahead of a safer mid-round scorer."
  },
  {
    "rank": 45,
    "name": "LeBron James",
    "team": "PHI",
    "yahooAdp": 38.3,
    "yahooPreRank": 92,
    "note": "LeBron still averaged 20.6 points and 7.1 assists at 41, which is remarkable production from a player entering another season. He left the Lakers for Philadelphia in July, joining Maxey and Brown in a far more crowded creation setup. The assists and field-goal efficiency should remain useful, but age, turnovers and a likely smaller workload keep this below his Yahoo draft price."
  },
  {
    "rank": 46,
    "name": "Joel Embiid",
    "team": "PHI",
    "yahooAdp": 50.8,
    "yahooPreRank": 125,
    "note": "Embiid can still win a matchup in points and free-throw impact whenever he is on the court; he averaged 26.9 points in 2025–26. The problem is turning that per-game edge into a full fantasy season after only 38 appearances. Philadelphia has also added LeBron and Brown, so the safest projection gives Embiid plenty of value without assuming every old touch returns."
  },
  {
    "rank": 47,
    "name": "LaMelo Ball",
    "team": "MIN",
    "yahooAdp": 26,
    "yahooPreRank": 62,
    "note": "Ball's 3.8 threes and 7.1 assists are exactly the sort of guard categories that vanish quickly on draft night. Charlotte sent him to Minnesota in July, where Anthony Edwards will share the ball and reduce the certainty of another high-usage season. His 40.7% shooting already creates an FG% problem, so Yahoo's much earlier ADP asks you to bet heavily on the new fit."
  },
  {
    "rank": 48,
    "name": "OG Anunoby",
    "team": "NYK",
    "yahooAdp": 66.6,
    "yahooPreRank": 60,
    "note": "Anunoby keeps contributing even when New York does not need him to create: 1.6 steals, 2.3 threes and solid shooting across 67 games. That is a useful glue piece for a roster built around high-usage stars. His assist ceiling is limited, but the category mix is easy to draft and the Yahoo price leaves room for this ranking to pay off."
  },
  {
    "rank": 49,
    "name": "Jalen Williams",
    "team": "OKC",
    "yahooAdp": 42.5,
    "yahooPreRank": 35,
    "note": "Last year's 33 games and reduced scoring should not erase the broad line Williams built before the injuries. He still averaged 5.5 assists and shot 48.4% when available, the type of support that lets a star-heavy roster stay balanced. The fourth-round price is a bet that health and minutes return, not that the short 2025–26 sample was his new ceiling."
  },
  {
    "rank": 50,
    "name": "Franz Wagner",
    "team": "ORL",
    "yahooAdp": 53.2,
    "yahooPreRank": 39,
    "note": "Wagner's 20.6 points on 48.1% shooting are a useful base from the wing, and he does not force a punt in any obvious category. A 34-game season is why he falls into this range rather than sitting with the safer early-round forwards. Take him for the balanced line, but pair the injury bet with dependable availability elsewhere."
  },
  {
    "rank": 51,
    "name": "Kon Knueppel",
    "team": "CHA",
    "yahooAdp": 40.4,
    "yahooPreRank": 23,
    "note": "Knueppel wasted little time becoming one of the league's most reliable high-volume shooters. His rookie year delivered 3.4 threes and 18.5 points over 81 games, a strong foundation for a second-season projection. Charlotte's reshaped backcourt could change how his shots arrive, but the shooting itself is the reason to pay this price."
  },
  {
    "rank": 52,
    "name": "Walker Kessler",
    "team": "LAL",
    "yahooAdp": 38,
    "yahooPreRank": 32,
    "note": "Kessler's five-game 2025–26 line is a poor guide to a full season, even though it included 10.8 rebounds and 1.8 blocks. Utah sent him to the Lakers in a July sign-and-trade, giving Luka a new rim-running center. The role could be excellent for FG% and blocks; health and free throws keep this rank below his upside."
  },
  {
    "rank": 53,
    "name": "Keyonte George",
    "team": "UTA",
    "yahooAdp": 56.3,
    "yahooPreRank": 121,
    "note": "George broke through as a high-volume scorer and playmaker, averaging 23.5 points and 6.1 assists while making 89.1% of his free throws. Those are difficult guard categories to find later. The 3.1 turnovers and Utah's added frontcourt scoring create enough uncertainty to keep him near his Yahoo price."
  },
  {
    "rank": 54,
    "name": "VJ Edgecombe",
    "team": "PHI",
    "yahooAdp": 74.7,
    "yahooPreRank": 31,
    "note": "Edgecombe's first season showed why a defensive guard can matter before his offense is polished: 1.4 steals, 5.6 rebounds and 4.2 assists across 75 games. Philadelphia's new star-heavy lineup may limit his shot creation, but his best categories do not require the ball. He fits behind early scoring picks."
  },
  {
    "rank": 55,
    "name": "Anthony Davis",
    "team": "WAS",
    "yahooAdp": 40.5,
    "yahooPreRank": 37,
    "note": "Davis can still deliver the rebounds and blocks of an early-round anchor when he plays. Dallas traded him to Washington at the February deadline, so the Wizards' frontcourt is the context for this projection. Twenty games last season make another full-season assumption too expensive, especially at Yahoo's earlier cost."
  },
  {
    "rank": 56,
    "name": "Matas Buzelis",
    "team": "CHI",
    "yahooAdp": 61.9,
    "yahooPreRank": 34,
    "note": "Buzelis is appealing because 2.2 threes and 1.5 blocks rarely come from the same forward. Chicago can give him room to grow after its roster changes, though a second-year leap in scoring or efficiency is still a projection. He covers two hard-to-pair categories without being a specialist in either one."
  },
  {
    "rank": 57,
    "name": "Mikal Bridges",
    "team": "NYK",
    "yahooAdp": 79.6,
    "yahooPreRank": 41,
    "note": "Bridges' value is in dependable minutes and a line that seldom forces a build change. He played all 82 games, shot 49.0% and added threes, steals and very few turnovers. The 14.4 points will not carry a category, but he is a useful stabilizer after an injury risk or a high-turnover star."
  },
  {
    "rank": 58,
    "name": "Deni Avdija",
    "team": "POR",
    "yahooAdp": 39.6,
    "yahooPreRank": 75,
    "note": "Avdija's 23.8 points, 6.8 rebounds and 6.6 assists were a breakout line, but Portland's offense has changed around him. The Blazers brought in Ja Morant and are getting Damian Lillard back, so the old creation load is unlikely to repeat. He still brings valuable wing rebounding and passing; Yahoo's earlier ADP assumes he keeps most of last year's usage."
  },
  {
    "rank": 59,
    "name": "Trae Young",
    "team": "WAS",
    "yahooAdp": 26.8,
    "yahooPreRank": 72,
    "note": "Young can still swing an assists category, and Washington should use him as a lead creator after acquiring him from Atlanta in January. He managed only 15 games last season, so that injury-hit line should not be mistaken for his usual scoring ceiling. FG%, turnovers and health make him a more volatile nine-category pick than Yahoo ADP suggests."
  },
  {
    "rank": 60,
    "name": "Ryan Rollins",
    "team": "MIL",
    "yahooAdp": 77.7,
    "yahooPreRank": 58,
    "note": "Rollins turned a larger Milwaukee role into 17.3 points, 5.6 assists and 1.5 steals across 74 games. Giannis' departure changes the Bucks' offense again, creating possible touches and a new hierarchy with Tyler Herro. The draft case is a repeat of the playmaking and defensive activity, not an assumption that every extra shot becomes efficient scoring."
  },
  {
    "rank": 61,
    "name": "Tyler Herro",
    "team": "MIL",
    "yahooAdp": 68.8,
    "yahooPreRank": 48,
    "note": "Herro brings points, threes and elite free throws to a Milwaukee team that acquired him in the Giannis trade. His 2025–26 rate was strong when available, but he played only 33 games, so the health discount belongs in the price. The Bucks need his offense; steals and blocks still have to come from elsewhere."
  },
  {
    "rank": 62,
    "name": "Naz Reid",
    "team": "CHA",
    "yahooAdp": 62.5,
    "yahooPreRank": 53,
    "note": "Reid pairs threes with rebounds, blocks and enough steals to matter. Minnesota sent him to Charlotte in July, giving him a different path to minutes after years behind a crowded Wolves frontcourt. He can beat this rank if the new role grows; his 45.6% shooting and 73.2% free throws keep the floor less clean."
  },
  {
    "rank": 63,
    "name": "Immanuel Quickley",
    "team": "TOR",
    "yahooAdp": 97,
    "yahooPreRank": 69,
    "note": "Quickley is a tidy source of assists, threes and steals with only 1.5 turnovers a game. His 70-game season restored confidence after earlier injury trouble, and Yahoo is still drafting him later than this ranking. Toronto's addition of Kawhi could change the hierarchy, so buy the balanced guard line without assuming more points."
  },
  {
    "rank": 64,
    "name": "Kyrie Irving",
    "team": "DAL",
    "yahooAdp": 52.3,
    "yahooPreRank": 73,
    "note": "The last full evidence before his ACL tear was a 24.7-point, 4.6-assist 2024–25 season with elite free-throw shooting. He has no 2025–26 line, and a return beside Cooper Flagg gives Dallas a different offense from the one he left. The per-game ceiling is far higher than pick 64; the uncertainty is how quickly his minutes and burst come back."
  },
  {
    "rank": 65,
    "name": "Kel'el Ware",
    "team": "MIL",
    "yahooAdp": 73.2,
    "yahooPreRank": 51,
    "note": "Ware's nine rebounds, 1.1 blocks and 1.2 threes give him an attractive center profile without needing a punt. Miami included him in the July Giannis package to Milwaukee, where the frontcourt rotation and minutes are less settled. Draft him for a possible larger role, but do not pay as though that role is guaranteed."
  },
  {
    "rank": 66,
    "name": "Julius Randle",
    "team": "BKN",
    "yahooAdp": 68.4,
    "yahooPreRank": 101,
    "note": "Randle's 21.1 points, 6.7 rebounds and five assists still form a useful fantasy line. Minnesota traded him to Brooklyn in July's four-team deal, and Nic Claxton's departure opens a clearer path to frontcourt touches. The turnovers and modest defensive stats remain, but the new situation gives him a route to beating this rank."
  },
  {
    "rank": 67,
    "name": "Brandon Ingram",
    "team": "LAC",
    "yahooAdp": 63,
    "yahooPreRank": 91,
    "note": "Toronto sent Ingram to the Clippers in September's Kawhi trade, so last year's Raptors usage is not a ready-made forecast. He averaged 21.5 points on good shooting and offers some rebounds and assists, a solid base if the new wing role stays large. Limited defensive contributions keep him from rising much higher in nine-category value."
  },
  {
    "rank": 68,
    "name": "Pascal Siakam",
    "team": "IND",
    "yahooAdp": 49.3,
    "yahooPreRank": 79,
    "note": "Siakam remains Indiana's best source of forward scoring and supplies useful rebounds, assists and field-goal impact. His 24 points per game are real, but 69.3% free throws are a larger nine-category penalty than a points-and-rebounds glance reveals. Haliburton's return could change how his shots arrive without erasing his role."
  },
  {
    "rank": 69,
    "name": "Paolo Banchero",
    "team": "ORL",
    "yahooAdp": 34.1,
    "yahooPreRank": 119,
    "note": "Banchero can put up a strong points-rebounds-assists line from the forward slot; last season's 8.4 boards and 5.2 assists show the appeal. Managers must also price in ordinary shooting efficiency, only 1.2 threes and 3.1 turnovers. Yahoo's early-third-round cost leaves little room for those weaknesses unless an efficiency step arrives."
  },
  {
    "rank": 70,
    "name": "Jalen Suggs",
    "team": "ORL",
    "yahooAdp": 111.4,
    "yahooPreRank": 87,
    "note": "Suggs' 1.8 steals and 5.5 assists give him a useful defensive and playmaking identity even when his shot is uneven. He played 57 games and shot 43.5% in 2025–26, so availability and efficiency matter to this projection. At Yahoo's later price, the category mix is worth a look if FG% is covered."
  },
  {
    "rank": 71,
    "name": "Ty Jerome",
    "team": "MEM",
    "yahooAdp": 111.3,
    "yahooPreRank": 47,
    "note": "Jerome's 15-game season offered a glimpse of real offense: 2.8 threes and 5.7 assists with strong percentages. That is too little playing time to treat as a settled baseline on a Memphis roster with changing guard roles. Draft him as a bet on secure minutes rather than those exact rates repeating."
  },
  {
    "rank": 72,
    "name": "De'Aaron Fox",
    "team": "SAS",
    "yahooAdp": 80.1,
    "yahooPreRank": 85,
    "note": "Fox gives San Antonio another creator beside Wembanyama, and his 6.2 assists and 48.6% shooting were useful last season. The 18.6 points were below the scoring level many managers associate with his name, and free throws remain middling. He fits when you need a guard who helps FG% and assists more than a pure scoring star."
  },
  {
    "rank": 73,
    "name": "Paul George",
    "team": "BOS",
    "yahooAdp": 80.4,
    "yahooPreRank": 126,
    "note": "Philadelphia traded George to Boston for Jaylen Brown in July, giving the Celtics a veteran wing who can shoot and generate steals around Tatum. He still averaged 1.7 steals and 2.7 threes, but 37 games make age and health central to the pick. The discounted version of George is appealing; the old first-round expectation is not the price to use."
  },
  {
    "rank": 74,
    "name": "Jaden McDaniels",
    "team": "MIN",
    "yahooAdp": 89.2,
    "yahooPreRank": 43,
    "note": "McDaniels gives you defensive help without an empty offensive line: a steal and a block per game, 14.8 points and 51.5% shooting. Minnesota added LaMelo Ball, which may change the shot distribution but should not erase the minutes he earns on defense. He fits when you need stocks rather than another high-usage scorer."
  },
  {
    "rank": 75,
    "name": "Jimmy Butler III",
    "team": "GSW",
    "yahooAdp": 117.1,
    "yahooPreRank": null,
    "note": "Butler was still efficient before a January ACL tear cut his season to 38 games. His 52.0% shooting, 86.2% free throws and 1.4 steals explain why the per-game case has not disappeared. The timing and workload of his return are unknown, so a roster already carrying injury risk should let someone else take the bet."
  },
  {
    "rank": 76,
    "name": "Kevin Porter Jr.",
    "team": "MIL",
    "yahooAdp": 118.7,
    "yahooPreRank": 133,
    "note": "Porter can give you 7.4 assists and more than two steals a night, a rare combination at this draft cost. He played only 38 games, and Milwaukee's new guard rotation after the Giannis trade makes the workload harder to project. The upside is clear, but so are turnover and availability risks."
  },
  {
    "rank": 77,
    "name": "Norman Powell",
    "team": "CHI",
    "yahooAdp": 92.4,
    "yahooPreRank": 115,
    "note": "Chicago signed Powell after his Miami season, adding a proven 21.7-point scorer and 2.7-threes shooter. The Bulls need offense after moving Coby White, but Powell offers little in rebounds or assists. He is a useful way to add scoring late if the rest of your roster already covers those columns."
  },
  {
    "rank": 78,
    "name": "Jabari Smith Jr.",
    "team": "HOU",
    "yahooAdp": 94.1,
    "yahooPreRank": 84,
    "note": "Smith's 2.3 threes and 6.9 rebounds make him a comfortable fit at power forward, and 77 games give the projection a useful availability base. Houston's crowded frontcourt and creation mix limit the easy path to a scoring jump. Draft him for shooting and boards, with defensive improvement as upside."
  },
  {
    "rank": 79,
    "name": "Payton Pritchard",
    "team": "BOS",
    "yahooAdp": 79.6,
    "yahooPreRank": 33,
    "note": "Pritchard's 2.7 threes, 5.2 assists and 1.4 turnovers form the kind of guard line that helps without demanding a punt. He played 79 games, which matters when so many players in this range carry health questions. Boston's new Brown-for-George lineup may shift usage, but shooting and ball security should travel."
  },
  {
    "rank": 80,
    "name": "Reed Sheppard",
    "team": "HOU",
    "yahooAdp": 120.8,
    "yahooPreRank": 56,
    "note": "Sheppard's second season showed the appeal of his profile: 2.8 threes, 1.5 steals and even some blocks from a guard. Fred VanVleet's return raises a minutes question, which Yahoo's late ADP reflects. The defensive shooting mix gives him room to beat this rank if Houston keeps him heavily involved."
  },
  {
    "rank": 81,
    "name": "Andrew Wiggins",
    "team": "MIA",
    "yahooAdp": 100.7,
    "yahooPreRank": 103,
    "note": "Wiggins does not need a featured role to supply threes, a steal and a block from the wing. He averaged 15.4 points on 47.5% shooting for Miami, a line that fits around demanding stars. Giannis' arrival changes the shot hierarchy, so buy the complementary production rather than expecting a scoring spike."
  },
  {
    "rank": 82,
    "name": "Zach Edey",
    "team": "MEM",
    "yahooAdp": 74.9,
    "yahooPreRank": 65,
    "note": "Eleven games are far too few for a full-season projection, but Edey's 11.1 rebounds and 1.9 blocks show the upside if he stays on the floor. Memphis' frontcourt changed with Jerami Grant and Isaiah Stewart arriving, so his minutes are not automatic. A healthy starting role would beat this rank; availability keeps it a bet."
  },
  {
    "rank": 83,
    "name": "Ausar Thompson",
    "team": "DET",
    "yahooAdp": 88.5,
    "yahooPreRank": 83,
    "note": "Thompson is a defensive specialist with real rebounding and FG% help: two steals, 0.9 blocks and 52.5% shooting. He gives almost nothing in threes and shot 57.1% at the line, so the right build matters more than his overall rank. Take him after securing shooting and free-throw volume."
  },
  {
    "rank": 84,
    "name": "Myles Turner",
    "team": "MIL",
    "yahooAdp": 100.3,
    "yahooPreRank": 109,
    "note": "Turner's 1.6 blocks and 2.1 threes still create the rare stretch-center package that made him a category-league staple. His 44.0% shooting and 5.3 rebounds are weaker than managers may expect from a center. Milwaukee's changed frontcourt could alter the role, so do not count on a big rebounding fix."
  },
  {
    "rank": 85,
    "name": "Darius Garland",
    "team": "LAC",
    "yahooAdp": 66.1,
    "yahooPreRank": 52,
    "note": "Garland's 6.7 assists, 2.7 threes and strong free throws give him a useful guard core. Cleveland sent him to the Clippers in the February Harden swap, then Los Angeles replaced Kawhi with Brandon Ingram in September. Forty-five games and 2.9 turnovers keep the ranking below Yahoo's price, even with a larger creation role possible."
  },
  {
    "rank": 86,
    "name": "Donte DiVincenzo",
    "team": "MIN",
    "yahooAdp": null,
    "yahooPreRank": null,
    "note": "Three threes and 1.3 steals per game are plenty of reason to consider DiVincenzo once the primary creators are gone. He played all 82 games, but 40.6% shooting makes the FG% hit real. Minnesota's addition of LaMelo Ball can change the guard rotation; his value is safest as a shooter and defender."
  },
  {
    "rank": 87,
    "name": "Jarrett Allen",
    "team": "CLE",
    "yahooAdp": 70.2,
    "yahooPreRank": 67,
    "note": "Allen keeps doing the big-man work: 63.8% shooting, 8.5 rebounds and low turnovers. He no longer supplies the block rate of a defensive specialist, so this is an efficiency and boards pick rather than a one-man rim-protection plan. His 56 games last season put an availability discount on an otherwise straightforward line."
  },
  {
    "rank": 88,
    "name": "Josh Hart",
    "team": "NYK",
    "yahooAdp": 96.3,
    "yahooPreRank": 68,
    "note": "Hart's 7.4 rebounds and 4.8 assists from the wing are a quiet way to patch the categories guard-heavy starts often miss. He shot 50.8% and played 66 games, helping more than the 12 points suggest. The 72.0% free throws and modest defensive stats mean the rest of your roster should cover those areas."
  },
  {
    "rank": 89,
    "name": "Ivica Zubac",
    "team": "IND",
    "yahooAdp": 64.8,
    "yahooPreRank": 71,
    "note": "Indiana acquired Zubac from the Clippers at the February deadline, and Haliburton's return should give him a different source of easy finishes. He averaged 10.5 rebounds and shot 60.0%, the categories that anchor this pick. The 48-game season and less than a block per game keep him below the best all-around centers."
  },
  {
    "rank": 90,
    "name": "Dejounte Murray",
    "team": "NOP",
    "yahooAdp": 72.3,
    "yahooPreRank": 93,
    "note": "Murray managed only 14 games after his injury, so the 2025–26 line is evidence of upside rather than a safe forecast. He still supplied 6.4 assists and 1.6 steals, exactly the categories that make him attractive late. Turnovers and availability make this a better pick for a stable roster than one already betting on recoveries."
  },
  {
    "rank": 91,
    "name": "Ja Morant",
    "team": "POR",
    "yahooAdp": 92.6,
    "yahooPreRank": null,
    "note": "Portland acquired Morant from Memphis in June, pairing him with a returning Damian Lillard. His 8.1 assists in a 20-game season show the playmaking ceiling, but the new backcourt and 3.5 turnovers complicate the nine-category case. Draft him for a healthy rebound in usage and games played, knowing last year's 41.0% shooting is another problem to solve."
  },
  {
    "rank": 92,
    "name": "Stephon Castle",
    "team": "SAS",
    "yahooAdp": 54.4,
    "yahooPreRank": 81,
    "note": "Castle is already a strong source of assists and rebounds from a guard spot, with 7.4 and 5.3 per game. The 3.2 turnovers and 73.4% free throws explain why a good real-life season did not produce the same nine-category rank. Yahoo is drafting him earlier; that price needs an efficiency jump, not just more minutes."
  },
  {
    "rank": 93,
    "name": "Nikola Vučević",
    "team": "ORL",
    "yahooAdp": 114.7,
    "yahooPreRank": null,
    "note": "Vučević moved from Chicago to Boston during 2025–26, then signed with Orlando in July. His 8.4 rebounds, 1.6 threes and decent free throws can still help, but Orlando's frontcourt gives him a less certain minutes ceiling than his old Bulls role. The late Yahoo price is appealing if he secures a clear rotation spot."
  },
  {
    "rank": 94,
    "name": "Grayson Allen",
    "team": "CHA",
    "yahooAdp": 116.2,
    "yahooPreRank": 112,
    "note": "Allen's 3.1 threes and 1.4 steals are useful for a late guard pick, even though 40.3% shooting pulls down FG%. Phoenix traded him to Charlotte in the Miles Bridges deal, putting those shots in a different rotation. Take him when you need shooting and defense, with efficiency and role as the risks."
  },
  {
    "rank": 95,
    "name": "Damian Lillard",
    "team": "POR",
    "yahooAdp": 67.9,
    "yahooPreRank": 77,
    "note": "Lillard's last healthy season brought 24.9 points and 7.1 assists in 2024–25, enough to make the per-game upside obvious. He missed 2025–26 with an Achilles injury and now returns to a Portland backcourt that also includes Ja Morant. This rank discounts recovery and an uncertain usage split; Yahoo's earlier ADP asks for a smoother comeback."
  },
  {
    "rank": 96,
    "name": "Keegan Murray",
    "team": "SAC",
    "yahooAdp": 121,
    "yahooPreRank": 82,
    "note": "Murray's 23-game season makes it hard to use last year's rate as a settled baseline, although 1.5 blocks from a forward are enticing. He has shown threes and defensive value before, so a healthy season could beat this rank. The pick depends on availability and a stable Sacramento role more than a particular scoring jump."
  },
  {
    "rank": 97,
    "name": "Miles Bridges",
    "team": "PHX",
    "yahooAdp": 98,
    "yahooPreRank": 90,
    "note": "Charlotte sent Bridges to Phoenix in July, where Devin Booker and Jalen Green also need shots. His 17.1 points, 5.8 rebounds and 1.9 threes are a useful line, but repeating the old scoring role in a new offense is not automatic. The price works if the rebounding survives fewer attempts."
  },
  {
    "rank": 98,
    "name": "Zion Williamson",
    "team": "NOP",
    "yahooAdp": 69.7,
    "yahooPreRank": 107,
    "note": "Zion still shoots 60.0% from the field on meaningful volume and scores 21 points a game when available. The fantasy difficulty is familiar: no threes, 71.6% free throws and another season short of 70 games. He can be strong in a compatible build, but a balanced nine-category roster must plan around those costs."
  },
  {
    "rank": 99,
    "name": "Saddiq Bey",
    "team": "NOP",
    "yahooAdp": 120.1,
    "yahooPreRank": 108,
    "note": "Bey gave New Orleans reliable scoring volume with 17.7 points, 2.1 threes and 5.6 rebounds across 72 games. Low turnovers help, while limited steals and blocks cap his ceiling. His Yahoo cost is later than this rank, making him useful when you need points and shooting without paying for a name."
  },
  {
    "rank": 100,
    "name": "Cason Wallace",
    "team": "OKC",
    "yahooAdp": 118.2,
    "yahooPreRank": 76,
    "note": "Wallace can move a steals matchup with two a game while barely turning the ball over. That defensive profile is valuable on a roster full of high-usage scorers, even though his 8.6 points and 2.6 assists will not carry the offense. Draft him as category repair, not as a sudden lead-guard breakout."
  },
  {
    "rank": 101,
    "name": "Toumani Camara",
    "team": "POR",
    "yahooAdp": 110.1,
    "yahooPreRank": 98,
    "note": "Camara played every game and made 2.6 threes while giving Portland steady defense on the wing. The 70.7% free throws and modest assists keep the overall value lower than the minutes suggest. He is a useful late pick for shooting and steals, especially if your earlier roster can absorb the percentages."
  },
  {
    "rank": 102,
    "name": "Derik Queen",
    "team": "NOP",
    "yahooAdp": 79.5,
    "yahooPreRank": 80,
    "note": "Queen's rookie year brought 7.1 rebounds and 3.7 assists from the frontcourt, a promising base for a larger second-season role. He did not add many threes, and turnovers can rise as the ball finds him more often. Draft him for the possibility that the passing and boards grow together, not because the rookie line was already polished."
  },
  {
    "rank": 103,
    "name": "Jusuf Nurkić",
    "team": "UTA",
    "yahooAdp": 112.8,
    "yahooPreRank": null,
    "note": "Nurkić still rebounds at a high rate and produced 4.8 assists from the center spot, a valuable shortcut for a team light on guards. He played only 41 games and shot 54.9% at the line, so the fit is narrow in a balanced build. Utah's crowded frontcourt adds another reason to check his minutes before paying the Yahoo price."
  },
  {
    "rank": 104,
    "name": "Collin Gillespie",
    "team": "PHX",
    "yahooAdp": 120.8,
    "yahooPreRank": 100,
    "note": "Gillespie gives Phoenix a useful low-turnover source of threes and assists: 2.9 triples, 4.6 dimes and 1.6 turnovers in an 80-game season. He does not need a starring role to help a fantasy roster. Booker and the Suns' other scorers limit the creation ceiling, but the late draft price leaves room for this line to be worthwhile."
  },
  {
    "rank": 105,
    "name": "Coby White",
    "team": "CHA",
    "yahooAdp": 88.5,
    "yahooPreRank": 106,
    "note": "Chicago traded White to Charlotte during 2025–26, and his new deal there looks more interesting after LaMelo Ball moved to Minnesota. He averaged 17.4 points and 2.3 threes despite the disrupted season; a clearer lead-guard role could lift the assists. The weak steals and 2.6 turnovers keep the projection below his Yahoo cost until that role is visible."
  },
  {
    "rank": 106,
    "name": "Kyshawn George",
    "team": "WAS",
    "yahooAdp": 118,
    "yahooPreRank": 131,
    "note": "George's 2.1 threes, 5.1 rebounds, 4.5 assists and nearly a block per game give him several ways to help without dominating the ball. Washington's addition of Trae Young may reduce his creation work, but it could also bring easier shots. The 48-game season and 43.8% shooting make the role and efficiency worth watching."
  },
  {
    "rank": 107,
    "name": "Bennedict Mathurin",
    "team": "NOP",
    "yahooAdp": 117.1,
    "yahooPreRank": null,
    "note": "Mathurin's route from Indiana to the Clippers at the February deadline ended with a July signing in New Orleans. Last year's 17.6 points and strong free throws offer a scoring base, but the Pelicans' wing rotation is a new puzzle. The late price works if his minutes and shots settle quickly; steals and assists are unlikely to carry him."
  },
  {
    "rank": 108,
    "name": "CJ McCollum",
    "team": "ATL",
    "yahooAdp": 108.3,
    "yahooPreRank": 111,
    "note": "Washington traded McCollum to Atlanta for Trae Young in January, and he re-signed with the Hawks in July. His 18.7 points and 2.5 threes remain useful, especially if Atlanta keeps him in a steady backcourt role. Limited steals and modest assists make him a scoring supplement rather than the point guard around whom to build a team."
  },
  {
    "rank": 109,
    "name": "Peyton Watson",
    "team": "CLE",
    "yahooAdp": 115.4,
    "yahooPreRank": 127,
    "note": "Watson's 1.1 blocks, 0.9 steals and 14.6 points gave Denver a useful two-way line. An August five-team trade sent him to Cleveland, where minutes around a deeper rotation are the main question. The defensive categories make him worth a late pick if camp confirms the role; do not simply project last year's shot count onto the new team."
  },
  {
    "rank": 110,
    "name": "Cedric Coward",
    "team": "MEM",
    "yahooAdp": 88.6,
    "yahooPreRank": 63,
    "note": "Coward's first season supplied 5.9 rebounds from the wing with 13.6 points and solid free throws. Memphis' changes make the exact offensive role less certain, but that rebounding gives him a route to value even without a scoring breakout. The Yahoo price is earlier than this rank, so a drafter needs to believe his minutes or usage will grow."
  },
  {
    "rank": 111,
    "name": "Anthony Black",
    "team": "ORL",
    "yahooAdp": 118.7,
    "yahooPreRank": 123,
    "note": "Black took a larger Orlando role and turned it into 15 points, 1.4 steals and some blocks from the guard spot. His 73.2% free throws and only 3.7 assists keep the category line from matching the real-life progress. The defensive production makes him an interesting late pick if your earlier guards already handle shooting and creation."
  },
  {
    "rank": 112,
    "name": "Bilal Coulibaly",
    "team": "WAS",
    "yahooAdp": null,
    "yahooPreRank": null,
    "note": "Coulibaly's 1.3 steals and one block a game are the reason to make this pick. He also rebounds enough to fit around smaller guards, but 42.5% shooting and modest threes hold back the overall line. Washington's backcourt has changed with Trae Young arriving; defensive minutes are safer to project than a sudden scoring leap."
  },
  {
    "rank": 113,
    "name": "Brandin Podziemski",
    "team": "GSW",
    "yahooAdp": 116.8,
    "yahooPreRank": 99,
    "note": "Podziemski played all 82 games and contributed 5.1 rebounds, 3.7 assists and 1.1 steals from Golden State's guard rotation. He is unlikely to win a category on his own, but that spread can stabilize a roster after more volatile picks. The Warriors' new pieces may shift minutes, so his price should stay in the late rounds."
  },
  {
    "rank": 114,
    "name": "Ayo Dosunmu",
    "team": "MIN",
    "yahooAdp": 114.9,
    "yahooPreRank": 96,
    "note": "Chicago sent Dosunmu to Minnesota in February and he signed a new deal there, but the Wolves also brought in LaMelo Ball. His 51.7% shooting and 1.4 turnovers are unusually clean for a guard, so he can help without heavy usage. The crowded Ball-Edwards backcourt makes minutes the obstacle to a larger fantasy leap."
  },
  {
    "rank": 115,
    "name": "Kristaps Porziņģis",
    "team": "GSW",
    "yahooAdp": 98.8,
    "yahooPreRank": 148,
    "note": "Atlanta traded Porziņģis to Golden State for Jonathan Kuminga and Buddy Hield in February. He still offers threes, blocks and strong free throws from a center slot, a category mix that can beat this rank easily. Thirty-two games last season and the Warriors' need to manage his health make the full-season return the real gamble."
  },
  {
    "rank": 116,
    "name": "DeMar DeRozan",
    "team": "DEN",
    "yahooAdp": 116.2,
    "yahooPreRank": 155,
    "note": "DeRozan left Sacramento for Denver in free agency, where Jokić should create easier scoring chances but also command the offense. He still averaged 18.1 points and shot 86.5% at the line while rarely turning it over. The 0.6 threes and little rebounding make him a late category-specific pick rather than a broad fantasy anchor."
  },
  {
    "rank": 117,
    "name": "Andrew Nembhard",
    "team": "IND",
    "yahooAdp": 114.3,
    "yahooPreRank": 174,
    "note": "Nembhard's 7.7 assists look like a bargain at this draft price, but they came while Haliburton missed the season. Indiana's star point guard is returning, so some creation duties should move back to him. Nembhard still supplies threes and useful points; pay for a complementary guard, not the full injury-replacement role."
  },
  {
    "rank": 118,
    "name": "Day'Ron Sharpe",
    "team": "BKN",
    "yahooAdp": 94.6,
    "yahooPreRank": 104,
    "note": "Brooklyn kept Sharpe on a new deal and sent Nic Claxton to Chicago, opening the starting-center opportunity he did not have last season. His 6.7 rebounds and 60.1% shooting came from a smaller role, so there is room for both to grow with minutes. Free throws and foul trouble remain the reasons not to chase Yahoo's earlier price."
  },
  {
    "rank": 119,
    "name": "Nic Claxton",
    "team": "CHI",
    "yahooAdp": 90.1,
    "yahooPreRank": 105,
    "note": "Brooklyn traded Claxton to Chicago in July's four-team deal, giving the Bulls a center who can finish efficiently and provide blocks. His 57.1% shooting, 3.7 assists and 1.1 blocks were useful last season, but 61.6% free throws can be costly. The new rotation decides whether he gets enough minutes to justify Yahoo's earlier ADP."
  },
  {
    "rank": 120,
    "name": "Rudy Gobert",
    "team": "MIN",
    "yahooAdp": 72.5,
    "yahooPreRank": 89,
    "note": "Gobert still does exactly what a punt-free-throw manager wants: 11.5 rebounds, 1.6 blocks and 68.2% field-goal shooting. The 52.6% free throws are a large enough hit that taking him in a balanced nine-category build requires a clear plan. Minnesota's changed frontcourt and 76-game season do not alter that central tradeoff."
  },
  {
    "rank": 121,
    "name": "Devin Vassell",
    "team": "SAS",
    "yahooAdp": 116.5,
    "yahooPreRank": 122,
    "note": "Vassell made 2.5 threes with fewer than one turnover a game, a pleasant combination for a late guard or wing. He does not produce enough assists or steals to carry those categories, and San Antonio's backcourt gives him limited creation upside. Take him when you need clean shooting volume rather than a breakout lead option."
  },
  {
    "rank": 122,
    "name": "Ajay Mitchell",
    "team": "OKC",
    "yahooAdp": 117.2,
    "yahooPreRank": 114,
    "note": "Mitchell gave Oklahoma City 13.6 points, 1.2 steals and efficient free throws in 57 games. His path to a bigger role is harder to see on a deep Thunder roster, so the value comes from useful two-way minutes at a late cost. He works as a depth pick after you have already secured primary scoring and assists."
  },
  {
    "rank": 123,
    "name": "Jerami Grant",
    "team": "MEM",
    "yahooAdp": 118.6,
    "yahooPreRank": null,
    "note": "Portland sent Grant to Memphis in the Ja Morant deal, putting his 18.4 points and 2.4 threes in a new frontcourt. The shooting travels, but the Grizzlies' rotation will decide whether he gets the same volume. He offers little rebounding for a forward, so draft him for scoring and threes rather than to repair a big-man category."
  },
  {
    "rank": 124,
    "name": "P.J. Washington",
    "team": "DAL",
    "yahooAdp": 115.8,
    "yahooPreRank": 178,
    "note": "Washington supplies seven rebounds, a steal and a block from the forward slot, enough defensive value to remain useful without a big scoring night. Dallas' healthier creators may reduce his touches, and 68.7% free throws are a real weakness. He fits a roster that needs frontcourt defense and already has free-throw impact in place."
  },
  {
    "rank": 125,
    "name": "Jay Huff",
    "team": "IND",
    "yahooAdp": null,
    "yahooPreRank": null,
    "note": "Huff's 1.9 blocks and 1.5 threes are a rare late-center pairing, and he played all 82 games. Indiana's addition of Zubac could squeeze his minutes, however, so the 2025–26 role is not automatic. Draft him when the blocks fill a clear need and you can move on quickly if the rotation closes."
  },
  {
    "rank": 126,
    "name": "Jrue Holiday",
    "team": "POR",
    "yahooAdp": 117.3,
    "yahooPreRank": 160,
    "note": "Holiday still supplied 6.1 assists and 2.6 threes for Portland, but the backcourt is far more crowded now that Morant has arrived and Lillard is returning. Those changes make last year's creation load a poor projection. His defensive reputation does not add much fantasy value on its own; draft the minutes and role you can verify."
  },
  {
    "rank": 127,
    "name": "RJ Barrett",
    "team": "TOR",
    "yahooAdp": 111.5,
    "yahooPreRank": null,
    "note": "Barrett's 19.3 points on 49.1% shooting make him a useful late source of scoring, with 5.3 rebounds on top. Toronto's trade for Kawhi Leonard could take away some attempts, while 71.7% free throws and low defensive stats already limit the nine-category line. He fits better as a final scoring piece than as a category foundation."
  },
  {
    "rank": 128,
    "name": "Tari Eason",
    "team": "HOU",
    "yahooAdp": 117.1,
    "yahooPreRank": 132,
    "note": "Eason still offers steals and rebounds in modest minutes, and those categories give him a path to value without a scoring breakout. His 41.6% shooting last season makes the usual efficiency assumption unsafe. Houston's deep forward rotation adds minutes risk, so draft him for the defensive upside at a late price."
  },
  {
    "rank": 129,
    "name": "John Collins",
    "team": "DET",
    "yahooAdp": 116.5,
    "yahooPreRank": 102,
    "note": "A July sign-and-trade moved Collins from the Clippers to Detroit, placing him next to Jalen Duren in a different frontcourt mix. His 55.1% shooting and 5.3 rebounds provide a useful floor, but only 0.7 blocks limit the usual big-man appeal. The rank depends on stable minutes more than a return to his old scoring peak."
  },
  {
    "rank": 130,
    "name": "Tre Jones",
    "team": "CHI",
    "yahooAdp": 116,
    "yahooPreRank": 156,
    "note": "Jones is one of the cleaner late sources of assists: 5.4 per game with only 1.4 turnovers, plus 55.3% shooting. Chicago's guard rotation changed when Coby White left, giving Jones a clearer path to useful minutes. He will not supply many threes or points, so pair him with scoring you already trust."
  },
  {
    "rank": 131,
    "name": "Julian Champagnie",
    "team": "SAS",
    "yahooAdp": 110.9,
    "yahooPreRank": 128,
    "note": "Champagnie played every game and supplied 2.4 threes with 5.8 rebounds, a useful combination from a late wing pick. San Antonio's stars keep his usage modest, which limits points and assists. He is a sensible choice when your roster needs reliable shooting and boards more than another speculative creator."
  },
  {
    "rank": 132,
    "name": "Zach LaVine",
    "team": "SAC",
    "yahooAdp": 103.7,
    "yahooPreRank": 162,
    "note": "LaVine still scored 19.2 points and made 2.5 threes, but a 39-game season makes availability the first question. Sacramento's changing lineup also gives less certainty about his shot volume than the old name value suggests. The Yahoo cost is earlier than this ranking; take him only if you can carry the missed-game risk and need scoring."
  },
  {
    "rank": 133,
    "name": "Aaron Gordon",
    "team": "DEN",
    "yahooAdp": 112.5,
    "yahooPreRank": 154,
    "note": "Gordon's 16.2 points and 5.8 rebounds are useful when he plays, but last season ended at 36 games. Denver also added DeMar DeRozan, which can take some offensive possessions from its forwards. He remains a good complement to Jokić in real basketball; in fantasy, the health and reduced usage possibilities make him a late pick."
  },
  {
    "rank": 134,
    "name": "Kelly Oubre Jr.",
    "team": "IND",
    "yahooAdp": 117.4,
    "yahooPreRank": 169,
    "note": "Oubre left Philadelphia for Indiana, where his place in a healthier Pacers rotation will decide the minutes. He averaged 1.4 steals and 14.1 points, a useful late-wing mix when the role is secure. His assists are thin, and he is not an efficiency anchor, so target him for defense and secondary scoring."
  },
  {
    "rank": 135,
    "name": "Davion Mitchell",
    "team": "MIA",
    "yahooAdp": 118.6,
    "yahooPreRank": 117,
    "note": "Mitchell's 6.5 assists and 49.0% shooting were helpful from a Miami guard, especially with only 1.5 turnovers. Giannis' arrival changes the offense, but the bigger fantasy issue remains his 64.6% free throws and limited scoring. He works as a late assists source if the rest of your roster can absorb that line."
  },
  {
    "rank": 136,
    "name": "Jaime Jaquez Jr.",
    "team": "MIL",
    "yahooAdp": 106.1,
    "yahooPreRank": 64,
    "note": "Miami sent Jaquez to Milwaukee in the July Giannis package, giving him a different route to minutes and creation. He averaged 15.4 points and 4.7 assists on 50.7% shooting, a well-rounded offensive base for this price. The Bucks' new rotation could lift or squeeze him, so treat the old role as evidence rather than a promise."
  },
  {
    "rank": 137,
    "name": "Jalen Green",
    "team": "PHX",
    "yahooAdp": 103,
    "yahooPreRank": 140,
    "note": "Green's 32-game Phoenix season did little to resolve the old fantasy question: can the scoring volume outweigh 42.2% shooting and a thin assist line? The Suns now have Miles Bridges beside Devin Booker, adding competition for shots. He has the talent to beat this rank, but the role and health have to cooperate before the nine-category case is strong."
  },
  {
    "rank": 138,
    "name": "Neemias Queta",
    "team": "BOS",
    "yahooAdp": 115.2,
    "yahooPreRank": 116,
    "note": "Queta's 65.3% field-goal shooting, 8.4 rebounds and 1.3 blocks give Boston useful traditional center production. He played 76 games, a better availability record than many late bigs. The zero threes and 70.3% free throws restrict the fit, but he can patch FG% and boards if those are your remaining needs."
  },
  {
    "rank": 139,
    "name": "Santi Aldama",
    "team": "DAL",
    "yahooAdp": null,
    "yahooPreRank": 180,
    "note": "Memphis traded Aldama to Dallas in July, making his 6.7 rebounds and 1.6 threes part of a crowded Mavericks frontcourt. The stretch-big profile is useful, but the team must give him enough minutes around Cooper Flagg and its centers. His 66.7% free throws mean the role needs to be substantial before this becomes more than a late flier."
  },
  {
    "rank": 140,
    "name": "Wendell Carter Jr.",
    "team": "ORL",
    "yahooAdp": 113.4,
    "yahooPreRank": 161,
    "note": "Carter's 7.4 rebounds, 51.2% shooting and 78 games are the reasons to keep him in a late-round queue. Orlando's return of Vučević complicates the frontcourt minutes, and Carter no longer offers the block rate many fantasy managers want from a center. He is a steady boards pick if camp clarifies the rotation."
  },
  {
    "rank": 141,
    "name": "Moses Moody",
    "team": "GSW",
    "yahooAdp": null,
    "yahooPreRank": null,
    "note": "Moody made 2.5 threes with only 0.9 turnovers, a useful low-maintenance line from Golden State's wing rotation. He does not give much in assists or rebounds, so his value is concentrated in shooting and clean minutes. The Warriors' added pieces make his exact role worth checking before using one of your final picks."
  },
  {
    "rank": 142,
    "name": "Herbert Jones",
    "team": "NOP",
    "yahooAdp": null,
    "yahooPreRank": 146,
    "note": "Jones' 1.6 steals still create a reason to draft him, and he added 1.4 threes despite another uneven offensive season. The 38.3% field-goal shooting is too damaging to ignore in a balanced build. He makes most sense when your early roster is efficient and you need one late defensive specialist."
  },
  {
    "rank": 143,
    "name": "Dillon Brooks",
    "team": "PHX",
    "yahooAdp": 114.9,
    "yahooPreRank": 171,
    "note": "Brooks' 20.2 points look tempting this late, but the full line includes 43.5% shooting, only 1.8 assists and little shot blocking. Phoenix now has more scoring options around Booker, so last year's volume may be difficult to repeat. Take him if you need points and threes; do not mistake the scoring average for broad nine-category value."
  },
  {
    "rank": 144,
    "name": "Ace Bailey",
    "team": "UTA",
    "yahooAdp": 118.1,
    "yahooPreRank": 147,
    "note": "Bailey's first year gave Utah 1.9 threes and some blocks from the wing, enough to see a category-friendly path if his role grows. The 44.3% shooting and 75.0% free throws show why the rookie line was not yet a finished fantasy product. He is a final-round upside pick rather than a safe source of any one category."
  },
  {
    "rank": 145,
    "name": "Isaiah Hartenstein",
    "team": "OKC",
    "yahooAdp": 105.4,
    "yahooPreRank": 141,
    "note": "Hartenstein's 9.4 rebounds and 62.2% shooting remain useful, and his 3.5 assists are a pleasant bonus from a center. Oklahoma City's depth and his 47-game season put limits on the volume you can assume. The 61.0% free throws are the main category cost; he fits best when that column is already protected or punted."
  },
  {
    "rank": 146,
    "name": "Quentin Grimes",
    "team": "LAL",
    "yahooAdp": 120.4,
    "yahooPreRank": 129,
    "note": "Grimes left Philadelphia for the Lakers in free agency, where Luka and Reaves will drive most of the offense. His 13.4 points, 1.7 threes and solid free throws can still matter in a stable wing role. Do not draft him for a creation leap; the appeal is reliable complementary minutes and a low-cost shooting floor."
  },
  {
    "rank": 147,
    "name": "Kyle Filipowski",
    "team": "UTA",
    "yahooAdp": 114.2,
    "yahooPreRank": 170,
    "note": "Filipowski's 7.2 rebounds and 2.6 assists make him more versatile than a typical late big. Utah's additions and a crowded frontcourt can change his minutes, while 75.0% free throws limit the efficiency case. He is worth a last pick when you need boards and some passing with room for a role to grow."
  },
  {
    "rank": 148,
    "name": "Aaron Nesmith",
    "team": "IND",
    "yahooAdp": 108.8,
    "yahooPreRank": 166,
    "note": "Nesmith offers 2.3 threes and useful points from an Indiana wing spot, but 45 games and 41.4% shooting make the floor shaky. A healthier Pacers roster may give him cleaner looks while also spreading the attempts. Take him for late shooting if the minutes are clear, not for a large all-around leap."
  },
  {
    "rank": 149,
    "name": "Mark Williams",
    "team": "PHX",
    "yahooAdp": 108.1,
    "yahooPreRank": null,
    "note": "Williams shot 64.4% and grabbed eight rebounds for Phoenix, the kind of late FG% help a guard-heavy team may need. The 60-game season and less than a block per game make him less useful as a defensive specialist than his size suggests. He is a final-round center for efficiency and boards, with health deciding the upside."
  },
  {
    "rank": 150,
    "name": "Isaiah Stewart",
    "team": "MEM",
    "yahooAdp": 111.2,
    "yahooPreRank": 143,
    "note": "Detroit traded Stewart to Memphis in July, where the center rotation will determine whether his 1.6 blocks can hold up. He has enough shooting touch to avoid being a pure rim protector, but last season's five rebounds and 0.3 steals limit the overall line. Draft him for blocks when camp shows a clear minutes path."
  }
];
