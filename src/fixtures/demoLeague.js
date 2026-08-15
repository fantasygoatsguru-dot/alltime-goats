// A fixed demo league, used to show the league tools to visitors who have not
// connected Yahoo (see components/DemoLeague.jsx). Rosters are real NBA players
// snake-drafted from the top of the scoring leaders, so the teams are roughly
// balanced and every tool has something interesting to say about them.
//
// Deliberately holds ONLY ids, names and NBA team codes — no statistics. The
// tools fetch stats themselves from player_period_averages for whatever season
// is current, so the demo never shows stale numbers and needs no upkeep when
// STATS_SEASON rolls over. The team codes match public/data/schedule.json,
// which is what the playoff and season strength tools use to count games/week.
//
// Each team MUST carry a unique `key`. That is the field Yahoo teams expose and
// the one the strength tools derive from (`teamKey: team.key`), both for the
// expand/collapse map and for the `${team.key}_${playerId}` disabled-player
// keys. Leave it out and every team shares an `undefined` slot, so expanding or
// disabling on one row silently applies to all of them.

export const DEMO_LEAGUE_NAME = 'Goats Guru Demo League';

export const DEMO_LEAGUE_SETTINGS = {
  leagueName: DEMO_LEAGUE_NAME,
  numTeams: 6,
  scoringType: 'head',
  isDemo: true,
};

export const DEMO_TEAMS = [
  {
    key: 'demo.t.1',
    teamKey: 'demo.t.1',
    team_key: 'demo.t.1',
    name: "Curry in a Hurry",
    league_name: DEMO_LEAGUE_NAME,
    players: [
      { id: 1629029, nbaPlayerId: 1629029, name: "Luka Don\u010di\u0107", team: 'LAL' },
      { id: 1628374, nbaPlayerId: 1628374, name: "Lauri Markkanen", team: 'UTA' },
      { id: 1628973, nbaPlayerId: 1628973, name: "Jalen Brunson", team: 'NYK' },
      { id: 1630559, nbaPlayerId: 1630559, name: "Austin Reaves", team: 'LAL' },
      { id: 1630552, nbaPlayerId: 1630552, name: "Jalen Johnson", team: 'ATL' },
      { id: 2544, nbaPlayerId: 2544, name: "LeBron James", team: 'LAL' },
      { id: 1641706, nbaPlayerId: 1641706, name: "Brandon Miller", team: 'CHA' },
      { id: 1629630, nbaPlayerId: 1629630, name: "Ja Morant", team: 'MEM' },
    ],
  },
  {
    key: 'demo.t.2',
    teamKey: 'demo.t.2',
    team_key: 'demo.t.2',
    name: "Waiting for Godot",
    league_name: DEMO_LEAGUE_NAME,
    players: [
      { id: 1628983, nbaPlayerId: 1628983, name: "Shai Gilgeous-Alexander", team: 'OKC' },
      { id: 203954, nbaPlayerId: 203954, name: "Joel Embiid", team: 'PHI' },
      { id: 201142, nbaPlayerId: 201142, name: "Kevin Durant", team: 'HOU' },
      { id: 201935, nbaPlayerId: 201935, name: "James Harden", team: 'LAC' },
      { id: 1626181, nbaPlayerId: 1626181, name: "Norman Powell", team: 'MIA' },
      { id: 1628415, nbaPlayerId: 1628415, name: "Dillon Brooks", team: 'PHX' },
      { id: 1630217, nbaPlayerId: 1630217, name: "Desmond Bane", team: 'ORL' },
      { id: 1628369, nbaPlayerId: 1628369, name: "Jayson Tatum", team: 'BOS' },
    ],
  },
  {
    key: 'demo.t.3',
    teamKey: 'demo.t.3',
    team_key: 'demo.t.3',
    name: "Block Party",
    league_name: DEMO_LEAGUE_NAME,
    players: [
      { id: 1630162, nbaPlayerId: 1630162, name: "Anthony Edwards", team: 'MIN' },
      { id: 201939, nbaPlayerId: 201939, name: "Stephen Curry", team: 'GSW' },
      { id: 1630595, nbaPlayerId: 1630595, name: "Cade Cunningham", team: 'DET' },
      { id: 1630166, nbaPlayerId: 1630166, name: "Deni Avdija", team: 'POR' },
      { id: 1631094, nbaPlayerId: 1631094, name: "Paolo Banchero", team: 'ORL' },
      { id: 203944, nbaPlayerId: 203944, name: "Julius Randle", team: 'MIN' },
      { id: 203076, nbaPlayerId: 203076, name: "Anthony Davis", team: 'DAL' },
      { id: 1629638, nbaPlayerId: 1629638, name: "Nickeil Alexander-Walker", team: 'ATL' },
    ],
  },
  {
    key: 'demo.t.4',
    teamKey: 'demo.t.4',
    team_key: 'demo.t.4',
    name: "The Triple Doubles",
    league_name: DEMO_LEAGUE_NAME,
    players: [
      { id: 203999, nbaPlayerId: 203999, name: "Nikola Joki\u0107", team: 'DEN' },
      { id: 202695, nbaPlayerId: 202695, name: "Kawhi Leonard", team: 'LAC' },
      { id: 1627750, nbaPlayerId: 1627750, name: "Jamal Murray", team: 'DEN' },
      { id: 1641718, nbaPlayerId: 1641718, name: "Keyonte George", team: 'UTA' },
      { id: 1629639, nbaPlayerId: 1629639, name: "Tyler Herro", team: 'MIA' },
      { id: 1630532, nbaPlayerId: 1630532, name: "Franz Wagner", team: 'ORL' },
      { id: 1630578, nbaPlayerId: 1630578, name: "Alperen Sengun", team: 'HOU' },
      { id: 202710, nbaPlayerId: 202710, name: "Jimmy Butler III", team: 'GSW' },
    ],
  },
  {
    key: 'demo.t.5',
    teamKey: 'demo.t.5',
    team_key: 'demo.t.5',
    name: "Assist Me Later",
    league_name: DEMO_LEAGUE_NAME,
    players: [
      { id: 1630178, nbaPlayerId: 1630178, name: "Tyrese Maxey", team: 'PHI' },
      { id: 203507, nbaPlayerId: 203507, name: "Giannis Antetokounmpo", team: 'MIL' },
      { id: 1626164, nbaPlayerId: 1626164, name: "Devin Booker", team: 'PHX' },
      { id: 1627783, nbaPlayerId: 1627783, name: "Pascal Siakam", team: 'IND' },
      { id: 1630530, nbaPlayerId: 1630530, name: "Trey Murphy III", team: 'NOP' },
      { id: 1629627, nbaPlayerId: 1629627, name: "Zion Williamson", team: 'NOP' },
      { id: 1642843, nbaPlayerId: 1642843, name: "Cooper Flagg", team: 'DAL' },
      { id: 1628389, nbaPlayerId: 1628389, name: "Bam Adebayo", team: 'MIA' },
    ],
  },
  {
    key: 'demo.t.6',
    teamKey: 'demo.t.6',
    team_key: 'demo.t.6',
    name: "Rebound and Down",
    league_name: DEMO_LEAGUE_NAME,
    players: [
      { id: 1628378, nbaPlayerId: 1628378, name: "Donovan Mitchell", team: 'CLE' },
      { id: 1627759, nbaPlayerId: 1627759, name: "Jaylen Brown", team: 'BOS' },
      { id: 1641705, nbaPlayerId: 1641705, name: "Victor Wembanyama", team: 'SAS' },
      { id: 1629008, nbaPlayerId: 1629008, name: "Michael Porter Jr.", team: 'BKN' },
      { id: 1627742, nbaPlayerId: 1627742, name: "Brandon Ingram", team: 'TOR' },
      { id: 1631101, nbaPlayerId: 1631101, name: "Shaedon Sharpe", team: 'POR' },
      { id: 1629660, nbaPlayerId: 1629660, name: "Ty Jerome", team: 'MEM' },
      { id: 1626157, nbaPlayerId: 1626157, name: "Karl-Anthony Towns", team: 'NYK' },
    ],
  },
];
