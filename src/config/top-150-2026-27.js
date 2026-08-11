// Projected pure 9-cat top 150 for the 2026-27 season.
//
// This is the one place on the site where the ranking is a HUMAN PROJECTION
// rather than a live query — the season hasn't been played, so there are no
// z-scores to sort. Each player's note explains why he sits where he sits.
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
  'The anchors. Multi-category producers who win three or four columns by themselves, and the largest value gap on the entire board sits inside this round. Take the best available — no build is worth reaching past one of these.',
  'Genuine first-round production with one visible flaw each: turnovers, a percentage, or a games-played history. Sort by which flaw your roster can absorb, and try to leave this round holding one player who rebounds and one who does not hurt your free throws.',
  'High-end starters, and the last round where a player fills six or more columns. Projected value is close enough here that shape should decide: the broad contributor if your roster has no identity yet, the specialist if it already does.',
  'The efficiency round. Several first-round talents are still here on injury or age discounts, and taking one is how you build a ceiling — but only if your first three picks are durable.',
  'Where builds get decided. Most of these players lean hard in one direction, big-man columns or guard columns, so the picks you make now quietly choose your punt for you.',
  'Upside and specialists in equal measure. The young players in this round have realistic top-50 outcomes; the veterans have one elite category and a hole next to it.',
  'The last round with real starters in it. From here, target players who reinforce the two categories you are already winning rather than the ones you are losing.',
  'Role-dependent production. Everyone here helps in three or four columns; the difference between them is minutes, and minutes are the thing that changes most in October.',
  'Injury bets and category patches. A per-game top-50 line is available in this round if you can carry the games-played risk on a roster that is otherwise durable.',
  'Specialists. One or two strong columns, several negative ones. In the right build these players beat their rank by two rounds; in the wrong one they are unstartable.',
  'Punt-build fuel. Almost every player in this round is elite in something and unplayable in something else — which is exactly what you want once your build has an identity.',
  'Streaming candidates with a starting job. Take the ones whose single best category is the one your roster is closest to losing.',
  'The last picks and the early waiver wire. Turn this group over aggressively once the season starts — the gap between pick 145 and pick 180 is a single rotation change.',
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

export const PLAYERS = [
  // ---- Round 1 (picks 1-12) ----------------------------------------
  {
    rank: 1,
    name: 'Nikola Jokić',
    team: 'DEN',
    note:
      "Still the safest first pick in fantasy basketball. Jokić is the only player who is elite in points, rebounds, assists and field-goal percentage at the same time, and he adds a positive free-throw percentage from the centre slot — a combination nobody else on this board offers. He turns 32 in February and has never had a serious injury, so the aging curve is the only argument against him, and it is not enough of one yet. The 3.8 turnovers are the single tax you pay, and they are priced in.",
  },
  {
    rank: 2,
    name: 'Victor Wembanyama',
    team: 'SAS',
    note:
      "The best per-minute fantasy asset alive and the one player with a realistic path to overtaking Jokić outright. He wins blocks by a margin no category in fantasy basketball can match, rebounds like a franchise centre and hits threes and free throws at guard-level rates. The projection holds him at two rather than one purely on availability — he has yet to complete a full season, and the last two ended early. If he plays 70, he is the top pick in hindsight.",
  },
  {
    rank: 3,
    name: 'Shai Gilgeous-Alexander',
    team: 'OKC',
    note:
      "The cleanest, lowest-variance profile in the top five: elite points, elite free-throw percentage, strong field-goal percentage, real steals and — unusually for a 30-point scorer — only two turnovers a night. He plays. Rebounds are the one column he does not touch, which is trivially patched later. If you want a first-rounder who will simply produce his projection without a story attached, this is the one.",
  },
  {
    rank: 4,
    name: 'Tyrese Maxey',
    team: 'PHI',
    note:
      "Last season's breakout is real and repeatable: near-29 points, better than three threes, six-plus assists and — the part people miss — over two steals a game, which is what pushed him into the elite tier rather than the scoring alone. He carries an enormous minutes load in Philadelphia, which is both why the counting stats are huge and the main risk to them. Only average field-goal percentage keeps him from the top three.",
  },
  {
    rank: 5,
    name: 'Luka Dončić',
    team: 'LAL',
    note:
      "A one-man category sweep — points, threes, rebounds and assists all at first-round levels from a single roster spot — and he is entering his prime-age seasons in Los Angeles. What holds him at five rather than two is the turnover column: four a game is the worst mark in the league, and it drags his total value down by roughly a full round. Draft him and you have committed to chasing low-turnover role players for the rest of the night.",
  },

  {
    rank: 6,
    name: 'Cade Cunningham',
    team: 'DET',
    note:
      "A 25-point, 10-assist guard who also rebounds and gets a steal and a block a night — there are perhaps four players in the league producing across that many columns. The 3.7 turnovers are the price, and they are steep enough that he should not be paired with Luka or Harden types. Detroit's offence runs entirely through him, which makes the volume about as safe as volume gets.",
  },
  {
    rank: 7,
    name: 'Anthony Edwards',
    team: 'MIN',
    note:
      "Nearly 30 points and three and a half threes with a positive field-goal percentage — he single-handedly wins the two categories that dry up fastest in the middle rounds. Assists are modest for a first option and the turnovers are mildly negative, so he is a strong pick rather than a perfect one. Availability has been excellent, which matters more at this stage of the draft than the last two percent of upside.",
  },
  {
    rank: 8,
    name: 'Cooper Flagg',
    team: 'DAL',
    note:
      "The most aggressive projection on this board. A rookie season of 20 points, 6.7 rebounds, 4.2 assists and a steal-plus-block line is already top-50 production, and second-year leaps for players with that profile are the most reliable pattern in fantasy basketball. Dallas will give him the ball more, the three-point volume should climb, and everything else is already in place. The downside is he simply repeats last season — which still makes him worth this pick.",
  },
  {
    rank: 9,
    name: 'Donovan Mitchell',
    team: 'CLE',
    note:
      "Points, threes, a strong free-throw percentage and enough steals to matter, all delivered with unusual consistency year over year. Rebounds and blocks are non-factors and the turnovers run mildly negative, so he is a category-narrow first-rounder — excellent if you pair him with a big early, awkward if you double down on guards.",
  },
  {
    rank: 10,
    name: 'Jalen Johnson',
    team: 'ATL',
    note:
      "The rare forward who fills the guard columns: 10.4 rebounds and 7.9 assists alongside 23 points and a positive field-goal percentage. That shape is what makes him a genuine first-round asset rather than a good one — he covers the two categories most guard-heavy rosters bleed. The 3.4 turnovers and a poor free-throw percentage are the cost, and the injury history is the reason he is tenth rather than sixth.",
  },
  {
    rank: 11,
    name: 'Lauri Markkanen',
    team: 'UTA',
    note:
      "Efficient volume scoring with threes and a genuinely elite free-throw percentage for a big — an unusual and very useful package. Nothing in his line is negative, which is why he grades out this high despite winning no category outright. The forty-game season is the concern; Utah has no reason to push him hard, and that has cost his managers before.",
  },
  {
    rank: 12,
    name: 'Amen Thompson',
    team: 'HOU',
    note:
      "A defensive-stat machine still adding offence: 7.5 rebounds and 5.3 assists from the wing with 1.5 steals and a strong field-goal percentage on 37 minutes a night. The three-point column is effectively empty and the free throws are neutral, so he needs shooting around him — but the minutes and the trajectory both point up, and this is the last tier where you can get a top-30 floor with genuine top-10 upside.",
  },
  // ---- Round 2 (picks 13-24) ---------------------------------------
  {
    rank: 13,
    name: 'Scottie Barnes',
    team: 'TOR',
    note:
      "Fills eight of nine columns without ever leading one: 19 points, 7.9 rebounds, 5.4 assists, 1.4 steals and 1.5 blocks on a positive field-goal percentage, and he played 61 games. That combination of breadth and availability is worth more in 9-cat than a bigger name with two dead categories. The weak three-point volume is the one thing to plan around.",
  },
  {
    rank: 14,
    name: 'Evan Mobley',
    team: 'CLE',
    note:
      "A modern big who adds blocks and a strong field-goal percentage without the usual free-throw disaster — his line is only mildly negative there, which is what separates him from the punt-FT crowd. Rebounds, assists and efficiency all arrive together, and Cleveland's usage has trended his way each year. He is the safest big on the board after the top three.",
  },

  {
    rank: 15,
    name: 'Chet Holmgren',
    team: 'OKC',
    note:
      "Nine rebounds, nearly two blocks and a positive field-goal percentage with real three-point volume from the centre spot, and — critically for a big — he does not hurt you at the line or with turnovers. Oklahoma City's depth caps his minutes and therefore his ceiling, which is the only reason he is not ten spots higher.",
  },
  {
    rank: 16,
    name: 'Jayson Tatum',
    team: 'BOS',
    note:
      "The biggest projection call on the board. He played three games last season coming back from the Achilles rupture, so there is no recent line to anchor to — but a fully healthy Tatum is a 26-point, three-three, eight-rebound, five-assist producer with a steal and a block, which is top-eight production. Ranking him sixteenth splits the difference between that ceiling and a season that starts on a minutes limit. If he looks right in October, he is a steal at this price.",
  },
  {
    rank: 17,
    name: 'Jamal Murray',
    team: 'DEN',
    note:
      "Twenty-five points, three threes and seven assists with only 2.3 turnovers — a genuinely efficient, low-noise line for a lead guard. He contributes nothing in rebounds, steals or blocks, so he is a four-category player, but he is very good in all four and he played 59 games. Solid rather than exciting, which is exactly right for this range.",
  },
  {
    rank: 18,
    name: 'Alperen Sengun',
    team: 'HOU',
    note:
      "Nine rebounds and six assists from the centre spot with a positive field-goal percentage — the playmaking is what makes him special, because it patches the category guard-light rosters cannot otherwise cover from a big. The free-throw percentage is a real negative and the turnovers are worse, so he pushes you gently toward a punt-FT build whether you planned one or not.",
  },
  {
    rank: 19,
    name: 'Karl-Anthony Towns',
    team: 'NYK',
    note:
      "Twelve rebounds with threes and a mid-eighties free-throw percentage from a centre is a shape almost nobody else offers, and it makes him the single best fit for guard-heavy builds on this board. Blocks are surprisingly absent, which is why he grades below the elite bigs, and the 61 games he played last season were more than his recent norm.",
  },
  {
    rank: 20,
    name: 'Trey Murphy III',
    team: 'NOP',
    note:
      "Twenty-two points, 3.3 threes, 5.6 rebounds and 1.5 steals with only 1.8 turnovers — a genuinely clean line with no category that actively hurts you. That efficiency of production is worth more than it looks in the middle of a draft. Health is the standing question; when he plays 60-plus games he returns second-round value.",
  },
  {
    rank: 21,
    name: 'Kawhi Leonard',
    team: 'LAC',
    note:
      "On a per-game basis he was a top-five player last season: 27 points, 2.5 threes, two steals, elite percentages and low turnovers. The ranking is entirely a bet on how many of those games you actually get. He turns 36 this season and 49 games is his recent baseline, so this is the spot where the per-game value and the availability discount meet. Take him only if your roster can survive twenty missed nights.",
  },
  {
    rank: 22,
    name: 'Alex Sarr',
    team: 'WAS',
    note:
      "Two blocks a game with rebounds, threes and a positive field-goal percentage in his second season, on a Washington roster with nothing in front of him. Blocks are the scarcest category in fantasy basketball and he supplies them without the usual free-throw catastrophe. Straightforward third-year growth puts him twenty spots higher than this.",
  },
  {
    rank: 23,
    name: 'Bam Adebayo',
    team: 'MIA',
    note:
      "Twenty points and ten rebounds with steals, assists and a neutral free-throw percentage, and he plays close to a full season every year. The lack of blocks for a centre is the persistent disappointment and the field-goal percentage has drifted to neutral, so he is a floor pick rather than a difference-maker — but the floor is genuinely high.",
  },
  {
    rank: 24,
    name: 'Derrick White',
    team: 'BOS',
    note:
      "The best source of blocks from a guard in the league, and he pairs them with threes, steals, assists and almost no turnovers. That combination is enormously valuable in 9-cat because it fills the two categories guards normally cannot. The poor field-goal percentage is the trade, and Tatum's return will pull some usage back, which is priced in here.",
  },
  // ---- Round 3 (picks 25-36) ---------------------------------------
  {
    rank: 25,
    name: 'Franz Wagner',
    team: 'ORL',
    note:
      "Twenty-one points, 5.6 rebounds and 3.7 assists with a positive field-goal percentage, a good free-throw percentage and only 1.6 turnovers — a no-holes line that quietly props up the columns most wings drag down. He managed 27 games last season, and that is the entire argument against him. On a full season he is a top-15 player.",
  },
  {
    rank: 26,
    name: 'Giannis Antetokounmpo',
    team: 'MIL',
    note:
      "The most polarising player in category leagues. His field-goal percentage is the single most valuable category contribution in the league and the points and rebounds are elite — but the free-throw percentage is equally elite in the wrong direction, the turnovers are bad, and he has now had two straight seasons cut short. He is a first-round player only if you are punting free throws, in which case move him up twenty spots.",
  },
  {
    rank: 27,
    name: 'Austin Reaves',
    team: 'LAL',
    note:
      "Twenty-three points, 5.4 assists, 2.4 threes and a 3.00 free-throw percentage z-score — genuinely elite at the line — with no dead categories beyond blocks. He is one of the best value-per-draft-slot players on this board. The three turnovers are the only real negative, and a 39-game season is the reason he is available here at all.",
  },
  {
    rank: 28,
    name: 'Tyrese Haliburton',
    team: 'IND',
    note:
      "Missed the entire 2025-26 season with the Achilles injury, so this is a projection with no recent evidence behind it. Pre-injury he was a top-15 fantasy asset: nine assists, three threes, elite turnover economy and a strong free-throw percentage. Achilles recoveries for guards who rely on burst are the least predictable in sports, which is why he sits here rather than in the top fifteen. The upside is a round-two return at a round-three price.",
  },
  {
    rank: 29,
    name: 'Jalen Brunson',
    team: 'NYK',
    note:
      "Twenty-six points, 6.5 assists, 2.8 threes and a good free-throw percentage with a manageable 2.3 turnovers, delivered across 60 games. What he does not do is rebound, steal or block — three empty columns is a lot to carry this early — so he is best on a roster that has already banked its defensive stats.",
  },
  {
    rank: 30,
    name: 'Anthony Davis',
    team: 'DAL',
    note:
      "Eleven rebounds, 1.6 blocks, a strong field-goal percentage and real steals — a genuine first-round line whenever he is on the floor, which was twenty games last season. At 33 the availability pattern is established rather than unlucky. Ranked here as a calculated risk: if you have two durable anchors already, the per-game payoff is worth a third-round pick.",
  },

  {
    rank: 31,
    name: 'Paolo Banchero',
    team: 'ORL',
    note:
      "Twenty-two points, 8.5 rebounds and five assists is a strong counting-stat base, and he takes eight free throws a night, which caps how much the mediocre percentage can hurt. Three turnovers and almost no steals or blocks keep him out of the tier above. Still only 24, and the assist growth last season was the best sign in his profile.",
  },
  {
    rank: 32,
    name: 'Jalen Williams',
    team: 'OKC',
    note:
      "Before the injury he was an efficient 18 points, 5.2 assists and 1.4 steals on 49 percent shooting with a good free-throw percentage — a clean, no-negatives line. Twenty-four games is the concern, not the production. If Oklahoma City's minutes return to normal he is a comfortable third-round value.",
  },
  {
    rank: 33,
    name: 'Onyeka Okongwu',
    team: 'ATL',
    note:
      "Sixteen points, 7.8 rebounds, 1.2 steals and 1.1 blocks with threes now part of the profile and a neutral free-throw percentage — a big who fills five columns and hurts you in none. He played 58 games as the primary Atlanta centre. Unspectacular, extremely useful, and consistently drafted about a round later than he should be.",
  },
  {
    rank: 34,
    name: 'Desmond Bane',
    team: 'ORL',
    note:
      "Twenty points, two threes, four rebounds and four assists on a positive field-goal percentage with a good free-throw percentage and low turnovers — broad coverage with no landmines. He played 62 games, the most of anyone in this range. The ceiling is limited by modest defensive stats, but nothing here goes wrong.",
  },
  {
    rank: 35,
    name: 'Jaren Jackson Jr.',
    team: 'MEM',
    note:
      "Blocks, threes and a positive free-throw percentage from a big is the exact shape that fits guard-heavy rosters, and 1.4 blocks a night in a league this short on rim protection is worth a round on its own. Rebounds are light for a centre and the foul trouble caps his minutes, which is why he settles here rather than in the twenties.",
  },
  {
    rank: 36,
    name: 'Donovan Clingan',
    team: 'POR',
    note:
      "Eleven and a half rebounds and 1.5 blocks with a positive turnover z-score — he is one of the very few bigs who does not cough the ball up — across 61 games in his second season. Points and free-throw percentage are the drags. As a source of the two scarcest big-man columns at this price, he is a structural bargain.",
  },
  // ---- Round 4 (picks 37-48) ---------------------------------------
  {
    rank: 37,
    name: 'Michael Porter Jr.',
    team: 'BKN',
    note:
      "Twenty-four points, 3.4 threes and 7.1 rebounds is a genuinely rare combination from the wing, and Brooklyn gives him unlimited shot volume. Assists, steals and blocks are all near zero, so he is a three-category specialist — but those three categories are among the most useful, and the percentages do not hurt.",
  },
  {
    rank: 38,
    name: 'Jaylen Brown',
    team: 'BOS',
    note:
      "Twenty-eight points and seven rebounds with a strong field-goal percentage, but a mediocre free-throw percentage on high volume and 3.5 turnovers hollow out the total. Tatum's return should reduce the usage that produced last season's scoring. A good player whose fantasy value has always trailed his reputation by a round or two.",
  },
  {
    rank: 39,
    name: 'Deni Avdija',
    team: 'POR',
    note:
      "Twenty-four points, 6.8 rebounds and 6.6 assists from a wing is a genuinely unusual stat line and the breakout looks real rather than sample-driven. The 3.6 turnovers are the worst in this tier and the defensive stats are thin, so he needs secure handlers around him — but the counting-stat base is worth building on.",
  },
  {
    rank: 40,
    name: 'Devin Booker',
    team: 'PHX',
    note:
      "Twenty-five points, six assists and an elite free-throw percentage, with almost nothing else: no rebounds, no steals, no blocks, negative field-goal percentage and 3.2 turnovers. That is a four-category player with two active negatives, which in 9-cat is a fourth-round profile even though the name says second.",
  },
  {
    rank: 41,
    name: 'Stephen Curry',
    team: 'GSW',
    note:
      "Still the most concentrated source of threes in the league and a 93 percent free-throw shooter, which alone is worth a middle-round pick. He turns 39 this season and played 39 games last year, and the rebounds, steals and blocks were already empty before the decline. Draft him for two elite categories and accept the rest.",
  },
  {
    rank: 42,
    name: 'Kevin Durant',
    team: 'HOU',
    note:
      "The efficiency has not gone anywhere — a strong field-goal percentage and an excellent free-throw percentage on real volume — and 26 points a night is still first-round scoring. But he is 38, the turnovers are negative, and the defensive stats have thinned out. A safe source of three categories with a shrinking margin for error.",
  },
  {
    rank: 43,
    name: 'Dyson Daniels',
    team: 'ATL',
    note:
      "The steals cheat code: 1.9 a game is a category win on its own, and he adds 6.6 rebounds and 6.1 assists from the guard slot with a positive field-goal percentage. The scoring is minimal and the free-throw percentage is a genuine drag, so he is a build-defining specialist rather than a balanced pick — but nobody else moves a single column this much this late.",
  },
  {
    rank: 44,
    name: 'Jalen Suggs',
    team: 'ORL',
    note:
      "Nearly two steals, five assists, two threes and real blocks for a guard — the defensive-stat package is genuinely rare. The scoring is modest and the percentages are neutral, and 40 games is a familiar number for him. Ranked on the assumption of another partial season; a full one puts him inside the top 30.",
  },
  {
    rank: 45,
    name: 'Brandon Miller',
    team: 'CHA',
    note:
      "Twenty-one points and 3.1 threes with rebounds and a steal, and Charlotte's offence is built around him. The negative field-goal percentage and three turnovers are the cost of that volume. He is 24 with a clear path to more, and the three-point production alone justifies this range.",
  },
  {
    rank: 46,
    name: 'James Harden',
    team: 'LAC',
    note:
      "Eight assists, three threes and an elite free-throw percentage with steals on top — four strong columns from one roster spot at 37 years old. The 3.6 turnovers and a poor field-goal percentage are why he is not higher, and pairing him with another negative-efficiency guard is how rosters lose two categories at once.",
  },
  {
    rank: 47,
    name: 'Immanuel Quickley',
    team: 'TOR',
    note:
      "Threes, six assists, steals and a decent free-throw percentage with only 1.6 turnovers — a tidy, low-noise guard line that fits almost any build. The negative field-goal percentage is the only real hit. He played 60 games last season, which for him is the outcome that has been missing.",
  },
  {
    rank: 48,
    name: 'Joel Embiid',
    team: 'PHI',
    note:
      "Twenty-seven points, 7.7 rebounds, a strong field-goal percentage and an elite free-throw percentage for a centre — per game, that is a top-five line. He has played 32, 19 and 39 games in recent seasons. This ranking assumes another half-season; if you draft him, do it with a roster that is already deep in the categories he supplies.",
  },
  // ---- Round 5 (picks 49-60) ---------------------------------------
  {
    rank: 49,
    name: 'OG Anunoby',
    team: 'NYK',
    note:
      "Threes and 1.7 steals with a positive field-goal percentage and enough rebounds to matter — a clean four-category wing with no active negatives. The scoring will not carry you and the free-throw percentage is neutral. Exactly the kind of player who is worth more to a real roster than to a ranking list.",
  },
  {
    rank: 50,
    name: 'Julius Randle',
    team: 'MIN',
    note:
      "Twenty-one points, seven rebounds and 5.2 assists on a positive field-goal percentage across 65 games — the most durable player in this range. The 2.6 turnovers and empty steal and block columns cap him. Boring, available, and a perfectly good fourth-round anchor for a build that needs volume.",
  },

  {
    rank: 51,
    name: 'Kon Knueppel',
    team: 'CHA',
    note:
      "Nineteen points and 3.5 threes on 48.9 percent shooting with an 87 percent free-throw percentage as a rookie, across 65 games. Efficient high-volume shooting from a 20-year-old with a guaranteed role is the cleanest second-year bet on the board. Steals and blocks are empty, so treat him as a pure offensive category source.",
  },
  {
    rank: 52,
    name: 'Jalen Duren',
    team: 'DET',
    note:
      "Eighteen points and 10.3 rebounds on 62.8 percent shooting — the field-goal percentage contribution alone is worth a middle-round pick, and the rebounding is top-ten. Zero threes, a mediocre free-throw percentage on six attempts a night and modest blocks are the reasons he is not higher. In a punt-FT build, move him up two rounds.",
  },
  {
    rank: 53,
    name: 'VJ Edgecombe',
    team: 'PHI',
    note:
      "Thirty-five minutes a night as a rookie with 15.6 points, two threes, 5.6 rebounds and 1.5 steals. The field-goal percentage is poor and needs to improve, but the role is already enormous and the defensive stats travel. A second-year step forward here is the difference between this rank and the top 30.",
  },
  {
    rank: 54,
    name: 'Tyler Herro',
    team: 'MIA',
    note:
      "Twenty-two points, 2.5 threes and a 91.7 percent free-throw percentage with a positive field-goal percentage and low turnovers — pure, efficient offence with no defensive stats at all. Nineteen games last season is the reason he is here; the per-game production belongs two rounds earlier.",
  },
  {
    rank: 55,
    name: 'Mikal Bridges',
    team: 'NYK',
    note:
      "The only player in this range with a positive turnover z-score — 1.1 a game — alongside threes, 1.4 steals and a positive field-goal percentage, over 65 games. He will never lead a category, but he actively helps in four and hurts in none, which is worth more in a nine-category league than the scoring line suggests.",
  },
  {
    rank: 56,
    name: 'Keyonte George',
    team: 'UTA',
    note:
      "Twenty-four points, 6.3 assists, 2.5 threes and an elite free-throw percentage — four strong columns from Utah's lead guard, with no competition for the ball. Three turnovers and a negative field-goal percentage are the price. Still 23, and the usage is not going anywhere.",
  },
  {
    rank: 57,
    name: 'Ryan Rollins',
    team: 'MIL',
    note:
      "Seventeen points, 5.5 assists, 2.5 threes and 1.5 steals on a positive field-goal percentage across 60 games — a genuine breakout that was still being drafted as a fluke last season. The free-throw percentage is neutral and the turnovers are manageable. If the role holds, this is a top-40 line.",
  },
  {
    rank: 58,
    name: 'Jimmy Butler III',
    team: 'GSW',
    note:
      "A strong field-goal percentage, an excellent free-throw percentage, 1.4 steals and just 1.6 turnovers — he props up efficiency in a way that lets the rest of your roster take risks. The counting stats are ordinary now and he is 37, so the value is entirely in the percentages and the steals.",
  },
  {
    rank: 59,
    name: 'Nickeil Alexander-Walker',
    team: 'ATL',
    note:
      "Twenty points, three threes and steals across 61 games as a full-time starter — the volume is real and the role is secure. A negative field-goal percentage is the only meaningful drag. A reliable source of the two categories most rosters run short of in the middle rounds.",
  },
  {
    rank: 60,
    name: "Kel'el Ware",
    team: 'MIA',
    note:
      "Nine and a half rebounds and 1.1 blocks in only 23 minutes a night, on 53.8 percent shooting with a usable free-throw percentage and almost no turnovers. The per-minute production is top-40; the minutes are the entire question. If Miami expands his role, this is the single best value on the board in this range.",
  },
  // ---- Round 6 (picks 61-72) ---------------------------------------
  {
    rank: 61,
    name: 'Matas Buzelis',
    team: 'CHI',
    note:
      "Sixteen points, 1.5 blocks and 2.2 threes on a positive field-goal percentage over 64 games in his second season — blocks-and-threes from a forward is a genuinely scarce combination. The two turnovers and thin assists are the limits. Chicago has every reason to keep expanding his role.",
  },
  {
    rank: 62,
    name: 'Josh Giddey',
    team: 'CHI',
    note:
      "Eight and a half rebounds and 8.7 assists is near-triple-double production from a guard, and it single-handedly patches the two columns guard-heavy rosters miss. The 3.7 turnovers are among the worst on this board and the free-throw percentage is a drag, so he is a build-shaper rather than a plug-and-play pick.",
  },
  {
    rank: 63,
    name: 'Walker Kessler',
    team: 'UTA',
    note:
      "Five games last season, which makes this a projection off his prior body of work: an elite rebounding and shot-blocking centre with a strong field-goal percentage and a free-throw percentage that will hurt. Health is the whole story — the production, when he plays, is a top-40 fantasy line.",
  },
  {
    rank: 64,
    name: 'LaMelo Ball',
    team: 'CHA',
    note:
      "Seven assists, 3.5 threes and a 90 percent free-throw percentage is elite production in three of the most valuable columns. The 39.8 percent field-goal percentage on 17 attempts a night is genuinely destructive, and the games-played history is the worst among relevant guards. A punt-FG build should draft him a round and a half earlier than this.",
  },
  {
    rank: 65,
    name: "De'Aaron Fox",
    team: 'SAS',
    note:
      "Nineteen points, 6.3 assists and 1.2 steals on a positive field-goal percentage — efficient, broad guard production with no disaster categories. The free-throw percentage is the one column he will not help. Sharing a backcourt in San Antonio caps the usage that used to make him a second-rounder.",
  },
  {
    rank: 66,
    name: 'Norman Powell',
    team: 'MIA',
    note:
      "Twenty-two points and 2.9 threes with a positive free-throw percentage and enough steals to matter — cheap, efficient scoring volume. No rebounds, no assists, no blocks. He is exactly what a roster that has already banked its defensive stats needs in round six.",
  },
  {
    rank: 67,
    name: 'Naz Reid',
    team: 'MIN',
    note:
      "Threes, 6.4 rebounds, a block and a steal a night off Minnesota's bench across 64 games — genuine five-category contribution in 26 minutes. The free-throw percentage is a drag and the minutes ceiling is real, but the availability and the shape are both excellent for this price.",
  },
  {
    rank: 68,
    name: 'Ausar Thompson',
    team: 'DET',
    note:
      "Two steals a game with a strong field-goal percentage, rebounds and blocks from the wing — a defensive-stat specialist of the type that wins two categories outright. The 57.9 percent free-throw percentage is close to unplayable outside a punt-FT build, and the scoring is minimal. Draft him knowing exactly which build he belongs to.",
  },
  {
    rank: 69,
    name: 'Trae Young',
    team: 'ATL',
    note:
      "Twelve games last season, but the profile has not changed: 8.6 assists and a good free-throw percentage on enormous volume, with a bad field-goal percentage and nothing in rebounds or blocks. He wins assists almost by himself, which is worth this pick even with the games-played risk attached.",
  },
  {
    rank: 70,
    name: 'Kevin Porter Jr.',
    team: 'MIL',
    note:
      "Seven and a half assists and 2.2 steals in 34 games — the steals in particular are elite, and the assist volume is starter-level. The turnovers are bad and the role has never been stable for a full season. A high-variance pick with a top-50 outcome inside it.",
  },
  {
    rank: 71,
    name: 'Ty Jerome',
    team: 'MEM',
    note:
      "Eleven games of 20 points, 5.6 assists and 2.6 threes on efficient shooting — a small sample that flattered him in last season's rankings, but the underlying shooting and low turnovers are consistent with his career. Ranked here as a bet on role rather than production; if Memphis hands him the ball, he returns value quickly.",
  },
  {
    rank: 72,
    name: 'Zach Edey',
    team: 'MEM',
    note:
      "Eleven games of 11.1 rebounds and 1.9 blocks on 63.3 percent shooting — rebounding and efficiency of that quality is a category-winning combination when it is on the floor. The 2.4 turnovers for a low-usage big are ugly and the injury history is now a pattern. Priced as the upside pick he is.",
  },
  // ---- Round 7 (picks 73-84) ---------------------------------------
  {
    rank: 73,
    name: 'Myles Turner',
    team: 'MIL',
    note:
      "1.6 blocks and 2.2 threes with a neutral free-throw percentage — the classic blocks-and-threes big who fits any build that needs rim protection without a free-throw penalty. The rebounds are light for a centre and the scoring has slipped. Reliable, unexciting, and available two rounds after the bigs above him.",
  },
  {
    rank: 74,
    name: 'Cason Wallace',
    team: 'OKC',
    note:
      "2.1 steals a game across 61 games — a top-five steals rate — with threes and a positive turnover profile in only 27 minutes. The scoring is minimal and the field-goal percentage is negative, so he is a single-category specialist. In a build that needs steals, he wins the column on his own.",
  },
  {
    rank: 75,
    name: 'Jabari Smith Jr.',
    team: 'HOU',
    note:
      "Fifteen points, 6.8 rebounds, two threes and a block in 35 minutes across 57 games — broad, low-negative production from a starting forward. Nothing here is elite and the assists are near zero, but the minutes are locked in and the free-throw percentage is a small plus.",
  },

  {
    rank: 76,
    name: 'Stephon Castle',
    team: 'SAS',
    note:
      "Sixteen points, 6.8 assists and 1.3 steals on a positive field-goal percentage in his second season — the playmaking growth was the real development. The 3.1 turnovers and a poor free-throw percentage on nearly six attempts a night are what keep him out of the top 50. Sharing a backcourt with Fox limits the ceiling.",
  },
  {
    rank: 77,
    name: 'Pascal Siakam',
    team: 'IND',
    note:
      "Twenty-four points and 6.7 rebounds on a positive field-goal percentage — a steady, high-floor forward line. The 68 percent free-throw percentage on six attempts a night is a genuine category drag, and there is nothing in threes, steals or blocks. He is worth more to a punt-FT roster than to anyone else.",
  },
  {
    rank: 78,
    name: 'Brandon Ingram',
    team: 'TOR',
    note:
      "Twenty-two points and 5.8 rebounds with a positive field-goal percentage and a good free-throw percentage across 61 games — the availability was the surprise and the reason he is ranked this high. Almost no threes, steals or blocks means three empty columns, which caps him firmly in this tier.",
  },
  {
    rank: 79,
    name: 'Donte DiVincenzo',
    team: 'MIN',
    note:
      "Three threes and 1.4 steals a night over 65 games with only 1.5 turnovers — a durable, cheap source of two scarce categories. The 41.7 percent field-goal percentage is the cost and it is not small. Ideal as a late-round specialist on a roster that has already secured its efficiency.",
  },
  {
    rank: 80,
    name: 'Grayson Allen',
    team: 'PHX',
    note:
      "3.3 threes and 1.5 steals with four assists and low turnovers — the same efficient specialist profile he has had for years, in a role Phoenix is unlikely to reduce. The negative field-goal percentage is the trade. A dependable way to win threes late.",
  },
  {
    rank: 81,
    name: 'Collin Gillespie',
    team: 'PHX',
    note:
      "3.1 threes, 4.8 assists, 1.3 steals and an 86 percent free-throw percentage with only 1.6 turnovers, across 63 games. That is four positive columns and no disasters from a player who will be available late. The poor field-goal percentage on modest volume is easily absorbed.",
  },
  {
    rank: 82,
    name: 'Payton Pritchard',
    team: 'BOS',
    note:
      "Sixteen points, 5.3 assists, 2.5 threes and an 86 percent free-throw percentage with a league-low 1.3 turnovers over 60 games. The turnover economy is genuinely valuable and often ignored. Tatum's return will cost him some usage, which is why he is not twenty spots higher.",
  },
  {
    rank: 83,
    name: 'Reed Sheppard',
    team: 'HOU',
    note:
      "2.6 threes and 1.3 steals in 26 minutes across 60 games, with a good free-throw percentage and low turnovers. The field-goal percentage is poor and the rebounds are absent, but the shooting-and-steals combination at this price is a clean fit for guard-light rosters. Third-year growth is the upside case.",
  },
  {
    rank: 84,
    name: 'Nikola Vučević',
    team: 'CHI',
    note:
      "8.7 rebounds, threes, three assists and an 83.5 percent free-throw percentage from a centre on a positive field-goal percentage — the shape is still excellent for guard-heavy builds. He is 36 and the blocks have never been there. Available far later than the production warrants, as usual.",
  },
  // ---- Round 8 (picks 85-96) ---------------------------------------
  {
    rank: 85,
    name: 'Jaden McDaniels',
    team: 'MIN',
    note:
      "Fifteen points on 51.5 percent shooting with a block, a steal and an 85 percent free-throw percentage across 63 games — a genuinely efficient forward who helps both percentages. The counting stats are modest and the threes are thin. A quiet, high-availability roster stabiliser.",
  },
  {
    rank: 86,
    name: 'Kyshawn George',
    team: 'WAS',
    note:
      "Fifteen points, 5.2 rebounds, 4.5 assists, two threes and near a block a game in his second season, with Washington's rotation wide open. The 2.7 turnovers and 44 percent shooting are the flaws. The breadth of contribution at 22 years old is what makes him worth this pick.",
  },
  {
    rank: 87,
    name: 'Peyton Watson',
    team: 'DEN',
    note:
      "Fifteen points, 1.2 blocks and a steal on a positive field-goal percentage in 30 minutes — the blocks from a wing are the valuable part. A poor free-throw percentage and modest rebounds cap him, and Denver's rotation is crowded. Ranked on the assumption the defensive role holds.",
  },
  {
    rank: 88,
    name: 'Andrew Wiggins',
    team: 'MIA',
    note:
      "Sixteen points, two threes, five rebounds and 1.1 blocks on a positive field-goal percentage with only 1.6 turnovers over 56 games — a genuinely well-rounded, low-negative line. Nothing is elite and the assists are thin, but he helps in six columns and hurts in none.",
  },
  {
    rank: 89,
    name: 'Domantas Sabonis',
    team: 'SAC',
    note:
      "Nineteen games last season, but 11.4 rebounds, 4.1 assists and 54.3 percent shooting is a top-30 line whenever he plays. Blocks are nonexistent and the free-throw percentage is a drag. Ranked as an injury bet with a very high per-game payoff — and a perfect punt-blocks centre.",
  },
  {
    rank: 90,
    name: 'Jarrett Allen',
    team: 'CLE',
    note:
      "8.5 rebounds and a block on 63.6 percent shooting — the field-goal percentage contribution is among the best in the league and it lifts an entire roster. Zero threes and a poor free-throw percentage on 4.5 attempts a night are the cost. A punt-FT build should take him thirty spots earlier.",
  },
  {
    rank: 91,
    name: 'Anthony Black',
    team: 'ORL',
    note:
      "Fifteen points, 3.8 assists and 1.4 steals in 30 minutes across 59 games, in his third season with the role finally secure. The percentages are both mildly negative and the 2.1 turnovers are ordinary. A broad, unremarkable line with a clear path to more.",
  },
  {
    rank: 92,
    name: 'Cedric Coward',
    team: 'MEM',
    note:
      "Thirteen points, 6.4 rebounds and 2.8 assists on a positive field-goal percentage with an 84 percent free-throw percentage as a rookie. The efficiency is what stands out — rookies rarely help both percentages. Memphis has minutes available and the second-year projection is the reason he is ranked here rather than fifty spots lower.",
  },
  {
    rank: 93,
    name: 'Derik Queen',
    team: 'NOP',
    note:
      "Twelve points, 7.1 rebounds, 3.9 assists and near a block across all 65 games as a rookie big — the passing from the centre spot is the unusual part and it is what raises his ceiling. The 2.3 turnovers are high and the threes are absent. A straightforward second-year growth pick.",
  },
  {
    rank: 94,
    name: 'Santi Aldama',
    team: 'MEM',
    note:
      "Fourteen points, 6.7 rebounds, three assists and threes on a positive field-goal percentage — broad forward production in 28 minutes. The 66.7 percent free-throw percentage is the one genuine negative. Useful in almost any build, and consistently drafted after players who contribute less.",
  },
  {
    rank: 95,
    name: 'Ja Morant',
    team: 'MEM',
    note:
      "Twenty games last season. Eight assists, an 89.7 percent free-throw percentage and 19 points is a real fantasy line, but the 41 percent shooting and 3.5 turnovers actively damage two categories, and the availability has been poor for three straight years. A late-round lottery ticket rather than a building block.",
  },
  {
    rank: 96,
    name: 'Darius Garland',
    team: 'CLE',
    note:
      "Eighteen points, 6.9 assists, 2.3 threes and an 85.5 percent free-throw percentage in 28 games — top-50 production when healthy, which has become the operative word. Nothing in rebounds, steals or blocks. Ranked here purely on the games-played risk; the per-game line belongs much earlier.",
  },
  // ---- Round 9 (picks 97-108) --------------------------------------
  {
    rank: 97,
    name: 'Keegan Murray',
    team: 'SAC',
    note:
      "1.5 blocks, 5.7 rebounds and a steal from a forward with three-point volume — a genuinely useful shape — across only 22 games. The negative field-goal percentage is the drag. A bet on health and on Sacramento giving him the shots his role implies.",
  },
  {
    rank: 98,
    name: 'Jrue Holiday',
    team: 'POR',
    note:
      "Sixteen points, 6.3 assists, 2.5 threes and 1.2 steals on a positive field-goal percentage — still broad, still efficient at 36. The 2.9 turnovers are the mild negative and 37 games is the real one. Portland's young backcourt makes the minutes projection genuinely uncertain.",
  },
  {
    rank: 99,
    name: 'Saddiq Bey',
    team: 'NOP',
    note:
      "Seventeen points, two threes, 5.8 rebounds and an 84 percent free-throw percentage with a remarkable 0.9 turnovers across 59 games. The turnover economy and free-throw percentage are the value here; the steals and blocks are empty. A clean, cheap, low-risk contributor.",
  },
  {
    rank: 100,
    name: 'Zion Williamson',
    team: 'NOP',
    note:
      "Twenty-one points on 58.7 percent shooting is one of the most valuable field-goal percentage contributions in the league, and he adds rebounds and a steal. Zero threes, a 71.7 percent free-throw percentage on 7.6 attempts and the longest injury history on this board are why a top-40 per-game line lands at 100.",
  },

  {
    rank: 101,
    name: 'Josh Hart',
    team: 'NYK',
    note:
      "7.5 rebounds and five assists from a guard on 49 percent shooting — he covers the two columns guard-heavy rosters cannot, which is worth more than the 11.7 points suggests. The 70.6 percent free-throw percentage is the one hit. A structural fit for a very specific kind of roster.",
  },
  {
    rank: 102,
    name: 'Bennedict Mathurin',
    team: 'IND',
    note:
      "Eighteen points and an 87 percent free-throw percentage on nearly six attempts a night — the free-throw contribution is genuinely elite and often overlooked. The 42.7 percent shooting is the offset, and the defensive stats are empty. Volume scoring with one very good category attached.",
  },
  {
    rank: 103,
    name: 'Tari Eason',
    team: 'HOU',
    note:
      "1.3 steals and 6.1 rebounds in 26 minutes with threes — a defensive-stat wing whose per-minute production has always outrun his role. Both percentages are negative and the scoring is modest. Worth this pick only if you need steals and can absorb the efficiency.",
  },
  {
    rank: 104,
    name: 'Nic Claxton',
    team: 'BKN',
    note:
      "Seven rebounds, 1.2 blocks and four assists on 57.5 percent shooting — the efficiency and rim protection are both real. The 61.4 percent free-throw percentage is severe enough that he is close to unplayable outside a punt-FT build, where he is a round-six value instead.",
  },
  {
    rank: 105,
    name: 'Jay Huff',
    team: 'IND',
    note:
      "1.9 blocks in 21 minutes a night across all 65 games, with threes and an 81.7 percent free-throw percentage from a centre. That is an absurd blocks rate at a bench-minute cost, and unlike most shot-blockers he does not damage your free throws. The rebounds are light. A specialist worth owning in almost every format.",
  },
  {
    rank: 106,
    name: 'Ivica Zubac',
    team: 'LAC',
    note:
      "10.9 rebounds on 61.6 percent shooting — elite in two categories that are hard to buy late. Zero threes, no steals, a mediocre free-throw percentage and modest blocks make him a two-category player. In a punt-FT, punt-threes build he is a top-60 asset.",
  },
  {
    rank: 107,
    name: 'Andrew Nembhard',
    team: 'IND',
    note:
      "7.4 assists and 17 points with threes and an 81 percent free-throw percentage across 50 games — the assist volume alone justifies this range. A negative field-goal percentage and 2.5 turnovers are the cost, and there is nothing in rebounds or blocks.",
  },
  {
    rank: 108,
    name: 'Miles Bridges',
    team: 'CHA',
    note:
      "Seventeen points, 5.9 rebounds, two threes and an 83 percent free-throw percentage with only 1.5 turnovers over 61 games — durable, broad, and mildly negative only in field-goal percentage. Charlotte's young core will eat into the usage, but the availability is the selling point.",
  },
  // ---- Round 10 (picks 109-120) ------------------------------------
  {
    rank: 109,
    name: 'Aaron Gordon',
    team: 'DEN',
    note:
      "Seventeen points on 49.7 percent shooting with threes, six rebounds and just one turnover a game — an efficient, low-noise line that helps quietly. Twenty-five games last season and an age-31 profile in a crowded Denver frontcourt are the reasons for the discount.",
  },
  {
    rank: 110,
    name: 'P.J. Washington',
    team: 'DAL',
    note:
      "6.8 rebounds, 1.2 blocks, a steal and threes from a forward — a four-category contributor with real defensive value. The 67.5 percent free-throw percentage and 44 percent shooting are both drags. A natural punt-FT piece and a mediocre fit anywhere else.",
  },
  {
    rank: 111,
    name: 'Ajay Mitchell',
    team: 'OKC',
    note:
      "Fourteen points, 3.6 assists, 1.4 steals on 48.3 percent shooting with an 87 percent free-throw percentage in 26 minutes — genuinely efficient guard production off Oklahoma City's bench. The minutes ceiling on that roster is the only thing keeping him this low.",
  },
  {
    rank: 112,
    name: 'Shaedon Sharpe',
    team: 'POR',
    note:
      "Nearly 22 points with two threes and 1.4 steals — the scoring volume is real and Portland has committed to it. Three turnovers, no rebounds to speak of and a neutral efficiency profile mean the points come close to unaccompanied. A points-and-threes specialist.",
  },
  {
    rank: 113,
    name: 'Kyrie Irving',
    team: 'DAL',
    note:
      "Missed all of last season recovering from the ACL tear, and turns 35 in March. Pre-injury he was an elite free-throw percentage and three-point source with a positive field-goal percentage and real steals — a top-40 profile. Ranked here because the return timeline and the minutes restriction are both unknowable from the outside.",
  },
  {
    rank: 114,
    name: 'Toumani Camara',
    team: 'POR',
    note:
      "2.4 threes, 1.1 steals and 5.3 rebounds in 33 minutes across all 65 games — a durable defensive wing with shooting volume. Both percentages are negative, especially the 66 percent from the line. Valuable in builds that need steals and threes without needing efficiency.",
  },
  {
    rank: 115,
    name: 'Bilal Coulibaly',
    team: 'WAS',
    note:
      "1.4 steals and near a block a game from a wing with four-plus rebounds — the defensive stats are the whole case, and they are a genuine case. The 40 percent shooting is bad enough to cost you the category on its own. A punt-FG build gets real value here.",
  },
  {
    rank: 116,
    name: 'DeMar DeRozan',
    team: 'SAC',
    note:
      "Eighteen points, an 86 percent free-throw percentage on 5.5 attempts and a remarkable 1.1 turnovers across 64 games — he never hurts your percentages or your turnover column. No threes, no defensive stats. A stabiliser for a roster that has taken on too much variance elsewhere.",
  },
  {
    rank: 117,
    name: 'Wendell Carter Jr.',
    team: 'ORL',
    note:
      "7.6 rebounds on 50.3 percent shooting with a positive free-throw percentage for a big and low turnovers, across 59 games. Nothing here is elite — the blocks in particular are disappointing — but a big who helps both percentages is genuinely useful this late.",
  },
  {
    rank: 118,
    name: 'Jusuf Nurkić',
    team: 'UTA',
    note:
      "10.5 rebounds and 4.7 assists with 1.3 steals from the centre spot on a positive field-goal percentage — the rebounding and playmaking combination is rare. The 54.9 percent free-throw percentage is brutal and the 2.5 turnovers make it worse. Punt-FT builds only.",
  },
  {
    rank: 119,
    name: 'Dejounte Murray',
    team: 'NOP',
    note:
      "Six games last season. The prior line — steals, assists, threes and an 89 percent free-throw percentage — is a top-60 profile, and the steals in particular are hard to replace. The 3.5 turnovers and two seasons lost to injury are why he is ranked as a dart rather than a starter.",
  },
  {
    rank: 120,
    name: 'Mark Williams',
    team: 'PHX',
    note:
      "8.1 rebounds and a block on 63.5 percent shooting in 24 minutes across 55 games — the efficiency is the draw and the availability was a pleasant surprise. Zero threes and no assists keep him narrow, but two strong categories from a late pick is the whole point of this range.",
  },
  // ---- Round 11 (picks 121-132) ------------------------------------
  {
    rank: 121,
    name: 'Isaiah Hartenstein',
    team: 'OKC',
    note:
      "9.2 rebounds, 3.5 assists and a steal on 63.7 percent shooting — a passing, efficient big whose rebounding is top-20 when he plays. The 60.9 percent free-throw percentage is the standard big-man tax and Oklahoma City's rotation limits the minutes.",
  },
  {
    rank: 122,
    name: 'Kelly Oubre Jr.',
    team: 'PHI',
    note:
      "Fifteen points, 1.3 steals and threes in 32 minutes with a positive field-goal percentage — a serviceable scoring wing with one useful defensive category. Nothing else lands, and 41 games last season reflects a long-standing pattern.",
  },
  {
    rank: 123,
    name: 'Brandin Podziemski',
    team: 'GSW',
    note:
      "Twelve points, 5.1 rebounds, 3.8 assists and 1.1 steals across 64 games — genuine breadth from a guard, with only the negative field-goal percentage working against him. Golden State's rotation is unpredictable, but the availability and the shape are both good for this price.",
  },
  {
    rank: 124,
    name: 'Devin Vassell',
    team: 'SAS',
    note:
      "Fourteen points, 2.4 threes and an 81 percent free-throw percentage with only 0.9 turnovers — efficient shooting volume that never hurts you. The negative field-goal percentage and thin defensive stats are the limits, and San Antonio's guard rotation is crowded.",
  },
  {
    rank: 125,
    name: 'Herbert Jones',
    team: 'NOP',
    note:
      "1.7 steals and a block from a wing with an 82 percent free-throw percentage — an elite defensive-stat specialist. The 38.2 percent shooting is severe and the scoring is minimal, so he only works on a roster that has already secured its field-goal percentage. In punt-FG builds, a genuine steal.",
  },

  {
    rank: 126,
    name: 'CJ McCollum',
    team: 'WAS',
    note:
      "Nineteen points and 2.5 threes across 60 games — reliable scoring volume from a 35-year-old on a rebuilding roster. The negative field-goal percentage and empty defensive columns are the reasons he is here rather than fifty spots higher, but the availability is dependable.",
  },
  {
    rank: 127,
    name: "Royce O'Neale",
    team: 'PHX',
    note:
      "2.7 threes and 1.2 steals in 29 minutes across 64 games with low turnovers — a pure specialist who does two useful things and stays on the floor. The 41.7 percent shooting is the cost, and there is no scoring to speak of.",
  },
  {
    rank: 128,
    name: 'Julian Champagnie',
    team: 'SAS',
    note:
      "2.4 threes, 5.7 rebounds and an 83 percent free-throw percentage with only 0.9 turnovers over 63 games. Rebounding from a shooting specialist is the unusual part and it makes him more than a one-column player. The negative field-goal percentage is the standard trade.",
  },
  {
    rank: 129,
    name: 'Jaylon Tyson',
    team: 'CLE',
    note:
      "Thirteen points, 5.2 rebounds and two threes on 50.3 percent shooting across 59 games in his second season — efficient for a young wing, which is rare. The role could grow or vanish depending on Cleveland's health; that uncertainty is the whole discount.",
  },
  {
    rank: 130,
    name: 'Ace Bailey',
    team: 'UTA',
    note:
      "Twelve points in 27 minutes as a rookie on poor efficiency — the production does not justify this rank, but the shot volume, the draft pedigree and Utah's total lack of competition for minutes do. A pure upside hold in the last rounds.",
  },
  {
    rank: 131,
    name: 'Kyle Filipowski',
    team: 'UTA',
    note:
      "Ten points and seven rebounds in 22 minutes on a positive field-goal percentage across 61 games — bench-minute production with a clear path to a starting role. The free-throw percentage and turnovers are mild negatives. A cheap source of rebounds if the minutes arrive.",
  },
  {
    rank: 132,
    name: 'Neemias Queta',
    team: 'BOS',
    note:
      "8.3 rebounds and 1.3 blocks on 63.4 percent shooting in 25 minutes across 60 games — three genuinely useful categories from a player who will go undrafted in shallow leagues. The 68.8 percent free-throw percentage is the tax, and it is smaller than most bigs charge.",
  },
  // ---- Round 12 (picks 133-144) ------------------------------------
  {
    rank: 133,
    name: 'Rudy Gobert',
    team: 'MIN',
    note:
      "11.5 rebounds, 1.6 blocks and a 70.6 percent field-goal percentage — three elite categories, and almost nobody else on this board offers that. The 50 percent free-throw percentage on 4.2 attempts a night is the single most destructive category line in fantasy basketball. In a punt-FT build he is a top-40 player; outside one he is nearly untouchable.",
  },
  {
    rank: 134,
    name: 'Isaiah Stewart',
    team: 'DET',
    note:
      "1.6 blocks in 23 minutes with rebounds and a positive field-goal percentage — an efficient rim protector at replacement-level cost. No threes, no assists, minimal steals. Exactly the kind of single-category patch that wins a close blocks matchup.",
  },
  {
    rank: 135,
    name: 'Moses Moody',
    team: 'GSW',
    note:
      "2.5 threes in 25 minutes with low turnovers and a decent free-throw percentage across 58 games — a reliable shooting specialist whose role has finally stabilised. Nothing else in the line is above replacement, so the value is entirely in the three-point column.",
  },
  {
    rank: 136,
    name: 'Zach LaVine',
    team: 'SAC',
    note:
      "Nineteen points, 2.5 threes and an 88 percent free-throw percentage on a positive field-goal percentage — genuinely efficient scoring that helps both percentages. Zero defensive stats, minimal rebounds and 39 games last season are why the efficient scoring is this cheap.",
  },
  {
    rank: 137,
    name: 'Dillon Brooks',
    team: 'PHX',
    note:
      "Twenty-one points, 2.3 threes and an 85.6 percent free-throw percentage on 17 shots a night — real scoring volume with a good line-percentage attached. The 44.3 percent shooting and near-zero rebounds and assists mean the points arrive alone.",
  },
  {
    rank: 138,
    name: 'RJ Barrett',
    team: 'TOR',
    note:
      "Nineteen points and 5.4 rebounds on 48.9 percent shooting with low turnovers — efficient volume from a forward. The 70 percent free-throw percentage on nearly five attempts is a real drag, and 40 games last season makes the projection shaky.",
  },
  {
    rank: 139,
    name: 'Coby White',
    team: 'CHI',
    note:
      "17.5 points, 4.6 assists and 2.3 threes in 35 games — the per-game line is a top-80 profile and the role is secure when he is healthy. The 43 percent shooting and 2.8 turnovers are the costs, and the availability is why he lands here.",
  },
  {
    rank: 140,
    name: 'Jerami Grant',
    team: 'POR',
    note:
      "Nineteen points, 2.2 threes and an 82 percent free-throw percentage on six attempts a night — a scoring forward who quietly helps at the line. The negative field-goal percentage and empty rebound and assist columns keep him a specialist.",
  },
  {
    rank: 141,
    name: 'Tre Jones',
    team: 'CHI',
    note:
      "5.5 assists on 53.9 percent shooting with an 83 percent free-throw percentage and only 1.3 turnovers — an unusually efficient distributor. No threes, no defensive stats and no rebounds, but a guard who helps both percentages is genuinely rare this late.",
  },
  {
    rank: 142,
    name: 'Davion Mitchell',
    team: 'MIA',
    note:
      "6.7 assists and 1.1 steals in 28 minutes on a positive field-goal percentage across 55 games — assists at this price are the reason to own him. The 67 percent free-throw percentage and minimal scoring are the reasons he is available at it.",
  },
  {
    rank: 143,
    name: 'Cam Spencer',
    team: 'MEM',
    note:
      "5.4 assists, 2.1 threes and a 93 percent free-throw percentage on a positive field-goal percentage across 60 games — three positive columns and no negatives from a player who will go undrafted. The elite free-throw percentage is the standout, even on low volume.",
  },
  {
    rank: 144,
    name: 'Jaime Jaquez Jr.',
    team: 'MIA',
    note:
      "Fifteen points, 5.3 rebounds and 4.7 assists on 50.3 percent shooting across 61 games — broad production with real efficiency. The absence of threes and defensive stats caps him, but few players this late contribute in five columns.",
  },
  // ---- Round 13 (picks 145-150) ------------------------------------
  {
    rank: 145,
    name: 'Quentin Grimes',
    team: 'PHI',
    note:
      "Threes, 3.4 assists and an 83 percent free-throw percentage in 30 minutes across 58 games — a rotation guard with a stable role and no disaster categories. The negative field-goal percentage is the only real cost. Streaming-plus value.",
  },
  {
    rank: 146,
    name: 'Sam Merrill',
    team: 'CLE',
    note:
      "3.2 threes a game in 26 minutes with an 85 percent free-throw percentage and almost no turnovers — one of the highest three-point rates available at any price. Everything else is empty. A pure category patch for the weeks you need to win threes.",
  },
  {
    rank: 147,
    name: 'Damian Lillard',
    team: 'POR',
    note:
      "Missed last season with the Achilles injury and turns 37 in July. Pre-injury he was an elite three-point and free-throw percentage source with high assists — the two skills most likely to survive a decline in athleticism. A last-round bet that the shooting comes back even if the burst does not.",
  },
  {
    rank: 148,
    name: 'Aaron Nesmith',
    team: 'IND',
    note:
      "2.2 threes and an 82.5 percent free-throw percentage from a starting wing. The 38.7 percent shooting is severe and 37 games continues a difficult injury pattern, but the three-point volume in a secure role is worth a final-round pick.",
  },
  {
    rank: 149,
    name: 'Marcus Smart',
    team: 'LAL',
    note:
      "1.3 steals and threes with an 80 percent free-throw percentage in 28 minutes across 55 games — a steals specialist with nothing else attached and a 40 percent field-goal percentage that will cost you. Only worth owning in a build that is already punting efficiency.",
  },
  {
    rank: 150,
    name: 'John Collins',
    team: 'LAC',
    note:
      "Fourteen points and five rebounds on 55.8 percent shooting with a block and a usable free-throw percentage across 54 games — an efficient big who quietly helps three categories. The role is the risk, not the production. A reasonable final pick or first wire add.",
  },
];
