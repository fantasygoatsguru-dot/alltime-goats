// Sleepers and busts for the 2026-27 season.
//
// Like the top 150, these are HUMAN PROJECTIONS — the season hasn't been
// played. Each entry names the player, the price he is likely to cost, and the
// argument. <PlayerNotes> matches `name` against player_period_averages for
// PRIOR_SEASON to show last season's real line under each write-up, so keep
// spellings identical to the database.
//
// A sleeper is a player whose projected nine-category value sits materially
// above his draft cost. A bust is the reverse: a good player whose price makes
// him a bad pick, which is a different claim from "he will play badly".

export const SLEEPERS = [
  {
    name: "Kel'el Ware",
    team: 'MIA',
    tag: 'Round 5-6 price',
    note:
      "The best per-minute big available anywhere near this range: 9.4 rebounds and 1.1 blocks in only 23 minutes a night, on 53.8 percent shooting with a free-throw percentage that does not hurt and almost no turnovers. Extend that to 30 minutes and it is a top-40 line. Miami has no long-term reason to keep capping him, and the categories he supplies — rebounds, blocks, field-goal percentage — are the three hardest to buy late.",
  },
  {
    name: 'Ryan Rollins',
    team: 'MIL',
    tag: 'Round 6-7 price',
    note:
      "Seventeen points, 5.5 assists, 2.5 threes and 1.5 steals on a positive field-goal percentage across 60 games, and much of the market still treats it as a fluke season from a former second-round pick. Five positive columns from a guard with a locked-in starting job is a fifth-round profile being drafted two rounds later.",
  },
  {
    name: 'Matas Buzelis',
    team: 'CHI',
    tag: 'Round 6-8 price',
    note:
      "Blocks and threes from the same roster spot is one of the rarest shapes in fantasy basketball, and he produced 1.5 and 2.2 of them in 64 games as a 21-year-old on a positive field-goal percentage. Chicago has every incentive to keep expanding the role. The assists are thin and the turnovers are mildly negative, but neither is what you are drafting him for.",
  },
  {
    name: 'Jay Huff',
    team: 'IND',
    tag: 'Undrafted in most leagues',
    note:
      "1.9 blocks a night in 21 minutes across all 65 games — a blocks rate that belongs in the top ten — and unlike almost every other shot-blocker he shoots 82 percent from the line and hits a three. That combination means he can be added to any build, including the ones that punt free throws and the ones that cannot. Light rebounds are the only real flaw. He is the cheapest category win on the board.",
  },
  {
    name: 'Kyshawn George',
    team: 'WAS',
    tag: 'Round 8-10 price',
    note:
      "Fifteen points, 5.2 rebounds, 4.5 assists, two threes and nearly a block in his second season, on a Washington roster with no established pecking order in front of him. Contributing in six columns at 22 is exactly the profile that jumps two rounds in a year. The 2.7 turnovers and the shooting percentage are the things that have to improve, and both usually do with role stability.",
  },
  {
    name: 'Cedric Coward',
    team: 'MEM',
    tag: 'Round 9-11 price',
    note:
      "Thirteen points, 6.4 rebounds and 2.8 assists as a rookie on a positive field-goal percentage with an 84 percent free-throw percentage. Rookies almost never help both percentages — that is a real skill signal, not a hot streak. Memphis has minutes available on the wing, and a modest role increase makes this a top-70 line.",
  },
  {
    name: 'Onyeka Okongwu',
    team: 'ATL',
    tag: 'Round 5-7 price',
    note:
      "Sixteen points, 7.8 rebounds, 1.2 steals, 1.1 blocks and threes across 58 games as Atlanta's starting centre, with a neutral free-throw percentage — a big who fills five columns and hurts you in none. He gets drafted like a backup because he spent years as one. Nothing about last season suggests he still is.",
  },
  {
    name: 'Cason Wallace',
    team: 'OKC',
    tag: 'Round 9-11 price',
    note:
      "2.1 steals a game over 61 games in only 27 minutes — a top-five rate in the single most volatile category in fantasy basketball, which makes him the cheapest way to stop losing it every week. He adds threes and does not turn the ball over. The scoring is minimal and the field-goal percentage is negative, so he belongs on a roster that has already banked its efficiency.",
  },
  {
    name: 'Naz Reid',
    team: 'MIN',
    tag: 'Round 7-8 price',
    note:
      "Threes, 6.4 rebounds, a block and a steal in 26 bench minutes across 64 games. Five-category contribution with that availability is starter production at a backup price, and any Gobert absence turns it into a top-60 stretch. The free-throw percentage is the one column he drags.",
  },
  {
    name: 'Ajay Mitchell',
    team: 'OKC',
    tag: 'Round 10-12 price',
    note:
      "Fourteen points, 3.6 assists and 1.4 steals on 48.3 percent shooting with an 87 percent free-throw percentage — genuinely efficient guard production, and efficiency is what late-round picks usually cost you. The Oklahoma City rotation is the cap on his minutes, which is also the only reason he is this cheap.",
  },
  {
    name: 'Derik Queen',
    team: 'NOP',
    tag: 'Round 8-10 price',
    note:
      "Twelve points, 7.1 rebounds, 3.9 assists and near a block in all 65 games as a rookie big. The passing is the unusual part: a centre who hands you assists solves the hole that guard-light rosters cannot otherwise fill. New Orleans has no reason to slow him down, and second-year bigs with this shape routinely gain two rounds.",
  },
  {
    name: 'Neemias Queta',
    team: 'BOS',
    tag: 'Undrafted in most leagues',
    note:
      "8.3 rebounds and 1.3 blocks on 63.4 percent shooting in 25 minutes across 60 games. Three genuinely useful categories, one of them elite, from a player who goes undrafted in twelve-team leagues. The 68.8 percent free-throw percentage is the tax, and it is smaller than nearly every other centre charges for the same production.",
  },
  {
    name: 'Julian Champagnie',
    team: 'SAS',
    tag: 'Round 11-13 price',
    note:
      "2.4 threes, 5.7 rebounds and an 83 percent free-throw percentage with 0.9 turnovers across 63 games. Shooting specialists usually give the rebounds back; he does not, which makes him a three-category contributor rather than a one-trick streamer. San Antonio's wing rotation is settled around him.",
  },
  {
    name: 'Jaylon Tyson',
    team: 'CLE',
    tag: 'Round 11-13 price',
    note:
      "Thirteen points, 5.2 rebounds and two threes on 50.3 percent shooting in his second season across 59 games. Efficient young wings with a real role are the standard shape of a mid-round breakout, and Cleveland's injury history all but guarantees stretches where he starts. The upside case is a top-80 season; the downside is a bench player you drop in November.",
  },
  {
    name: 'Cam Spencer',
    team: 'MEM',
    tag: 'Undrafted in most leagues',
    note:
      "5.4 assists, 2.1 threes and a 93 percent free-throw percentage on a positive field-goal percentage across 60 games. Three positive columns, zero negative ones, and no draft cost at all. He will not win you a category by himself, but he is the rare free player who never costs you one either.",
  },
];

export const BUSTS = [
  {
    name: 'Giannis Antetokounmpo',
    team: 'MIL',
    tag: 'Top-5 pick',
    note:
      "This is a price objection, not a talent objection. His field-goal percentage contribution is the most valuable single category line in the league — and his free-throw percentage is equally extreme in the wrong direction, on enormous volume, which cancels much of it out in nine-category scoring. Add bad turnovers and two straight seasons cut short, and a top-five pick is paying first-overall money for roughly third-round value. In a punt-FT build he is a steal; everywhere else he is the most expensive mistake in the draft.",
  },
  {
    name: 'Kawhi Leonard',
    team: 'LAC',
    tag: 'Round 2-3 price',
    note:
      "The per-game production was genuinely elite last season — 27 points, elite percentages, two steals. The problem is that 49 games is now his baseline rather than his floor, and he turns 36 this season. At a second-round price you are paying full value for perhaps 60 percent of a season, and the roster you build around him has to absorb every one of those missing nights.",
  },
  {
    name: 'Devin Booker',
    team: 'PHX',
    tag: 'Round 2-3 price',
    note:
      "Twenty-five points, six assists and an elite free-throw percentage is a strong three-category line — and that is all it is. No rebounds, no steals, no blocks, a negative field-goal percentage and 3.2 turnovers means four dead columns and two active negatives. In points leagues he is a star; in nine-cat he is a fourth-round player who consistently costs a second-round pick.",
  },
  {
    name: 'Jaylen Brown',
    team: 'BOS',
    tag: 'Round 3-4 price',
    note:
      "Last season's 28 points came with Tatum off the floor, and that usage is not coming back. Underneath it, the fantasy profile is mediocre: a poor free-throw percentage on high volume, 3.5 turnovers, and almost nothing in threes, steals or blocks. He is being drafted on a scoring average that is about to fall.",
  },
  {
    name: 'Rudy Gobert',
    team: 'MIN',
    tag: 'Round 6-8 price',
    note:
      "Three elite categories — 11.5 rebounds, 1.6 blocks and a 70 percent field-goal percentage — attached to the single most destructive free-throw line in fantasy basketball: 50 percent on four attempts a night. That one column can lose you the category on its own every week. Inside a punt-FT build he is a top-40 player and worth reaching for. Outside one he is nearly unrosterable, and he is priced as though the distinction does not exist.",
  },
  {
    name: 'Zion Williamson',
    team: 'NOP',
    tag: 'Round 5-7 price',
    note:
      "Twenty-one points on 58.7 percent shooting is a real asset, but it comes with zero threes, a 71.7 percent free-throw percentage on 7.6 attempts — high enough volume to sink the category — and the longest injury history on the board. You are buying one elite column, one badly negative one, and a games-played projection nobody can make with confidence.",
  },
  {
    name: 'LaMelo Ball',
    team: 'CHA',
    tag: 'Round 4-5 price',
    note:
      "Seven assists, 3.5 threes and a 90 percent free-throw percentage is genuinely elite production in three columns. The 39.8 percent shooting on 17 attempts a night is genuinely elite damage in another, and his games-played history is the worst among relevant guards. Draft him in a punt-FG build and he is excellent; draft him as a balanced fourth-rounder and he quietly costs you a category all season.",
  },
  {
    name: 'Ja Morant',
    team: 'MEM',
    tag: 'Round 6-8 price',
    note:
      "The name still commands a middle-round pick and the production no longer supports it. Forty-one percent shooting and 3.5 turnovers actively damage two categories, the threes are minimal, and he has now played 20, 36 and 61 games across the last three seasons. The assists and free-throw percentage are real, but they are the only things you are getting.",
  },
  {
    name: 'Stephen Curry',
    team: 'GSW',
    tag: 'Round 3-4 price',
    note:
      "Still the best three-point source in the league and a 93 percent free-throw shooter, which is worth a middle-round pick on its own. It is not worth a third-round pick from a 39-year-old who played 39 games last season and contributes nothing in rebounds, steals or blocks. The categories he wins are exactly the two you can buy cheaply in round nine.",
  },
  {
    name: 'Joel Embiid',
    team: 'PHI',
    tag: 'Round 3-5 price',
    note:
      "Per game he remains a top-five player. Across three seasons he has played 39, 19 and 32 games. At any price inside the first five rounds you are buying a half-season of production and an entire season of managing your roster around it — and the injuries have moved from bad luck to an established pattern.",
  },
  {
    name: 'Shaedon Sharpe',
    team: 'POR',
    tag: 'Round 7-9 price',
    note:
      "Twenty-two points a night looks like a breakout until you read the rest of the line: 4.5 rebounds, 2.6 assists, no blocks, three turnovers and neutral efficiency. That is scoring volume with nothing attached, and points are the least scarce category in the game. He is drafted on the average and returns about half of the value it implies.",
  },
  {
    name: 'Dillon Brooks',
    team: 'PHX',
    tag: 'Round 9-11 price',
    note:
      "Twenty-one points on 17 shots at 44.3 percent — the scoring is real and it comes at the direct cost of your field-goal percentage. Nothing else in the line helps: three rebounds, under two assists, no blocks, one steal. A player who wins you one category and loses you another is not worth a pick until the very end of the draft.",
  },
];
