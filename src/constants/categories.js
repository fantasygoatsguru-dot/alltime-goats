export const PUNT_CATEGORIES = [
  { key: "points_z", label: "PTS", fullName: "Points" },
  { key: "rebounds_z", label: "REB", fullName: "Rebounds" },
  { key: "assists_z", label: "AST", fullName: "Assists" },
  { key: "steals_z", label: "STL", fullName: "Steals" },
  { key: "blocks_z", label: "BLK", fullName: "Blocks" },
  { key: "three_pointers_z", label: "3PM", fullName: "Three Pointers" },
  { key: "field_goal_percentage_z", label: "FG%", fullName: "Field Goal %" },
  { key: "free_throw_percentage_z", label: "FT%", fullName: "Free Throw %" },
  { key: "turnovers_z", label: "TO", fullName: "Turnovers" },
];

export const FILTER_TYPES = [
  { key: "playerNames", label: "Player", isMulti: true },
  { key: "season", label: "Season", isNumeric: true },
  { key: "teamNames", label: "Team", isMulti: true },
  { key: "nationalities", label: "Nationality", isMulti: true },
  { key: "seasonExperience", label: "Experience (Years)", isNumeric: true },
  { key: "height", label: "Height (ft-in)", isHeight: true },
  { key: "rebounds", label: "Rebounds", isNumeric: true },
  { key: "points", label: "Points", isNumeric: true },
  { key: "assists", label: "Assists", isNumeric: true },
  { key: "steals", label: "Steals", isNumeric: true },
  { key: "blocks", label: "Blocks", isNumeric: true },
  { key: "fgPercentage", label: "FG%", isNumeric: true },
  { key: "ftPercentage", label: "FT%", isNumeric: true },
  { key: "three_pointers", label: "Three Pointers", isNumeric: true },
  { key: "turnovers", label: "Turnovers", isNumeric: true },
  { key: "total_value", label: "Total Value", isNumeric: true },
];

export const FILTER_VALUE_SUGGESTIONS = {
  playerNames: [], // Populated dynamically from players data
  teamNames: [
    { value: "Lakers", label: "Los Angeles Lakers" },
    { value: "Celtics", label: "Boston Celtics" },
    { value: "Warriors", label: "Golden State Warriors" },
    { value: "Bulls", label: "Chicago Bulls" },
    { value: "Spurs", label: "San Antonio Spurs" },
  ],
  nationalities: [
    { value: "USA", label: "USA" },
    { value: "Canada", label: "Canada" },
    { value: "France", label: "France" },
    { value: "Spain", label: "Spain" },
    { value: "Serbia", label: "Serbia" },
    { value: "Israel", label: "Israel" },
    { value: "Argentina", label: "Argentina" },
    { value: "Australia", label: "Australia" },
    { value: "Brazil", label: "Brazil" },
    { value: "China", label: "China" },
  ],
};

export const OPERATORS = [
  { value: ">", label: ">" },
  { value: ">=", label: ">=" },
  { value: "<", label: "<" },
  { value: "<=", label: "<=" },
  { value: "=", label: "=" },
];

export const GAME_PUNT_CATEGORIES = [
  { key: 'points', label: 'PTS', fullName: 'Points' },
  { key: 'rebounds', label: 'REB', fullName: 'Rebounds' },
  { key: 'assists', label: 'AST', fullName: 'Assists' },
  { key: 'steals', label: 'STL', fullName: 'Steals' },
  { key: 'blocks', label: 'BLK', fullName: 'Blocks' },
  { key: 'three_pointers', label: '3PM', fullName: 'Three Pointers' },
  { key: 'field_goals', label: 'FG', fullName: 'Field Goals', includesCategories: ['field_goals_made', 'field_goals_attempted'] },
  { key: 'free_throws', label: 'FT', fullName: 'Free Throws', includesCategories: ['free_throws_made', 'free_throws_attempted'] },
  { key: 'turnovers', label: 'TO', fullName: 'Turnovers' },
];

export const GAME_FILTER_TYPES = [
  { key: "playerNames", label: "Player", isMulti: true },
  { key: "season", label: "Season", isNumeric: true },
  { key: "positions", label: "Position", isMulti: true },
  { key: "teamNames", label: "Team", isMulti: true },
  { key: "nationalities", label: "Nationality", isMulti: true },
  { key: "seasonExperience", label: "Experience (Years)", isNumeric: true },
  { key: "height", label: "Height (ft-in)", isHeight: true },
  { key: "rebounds", label: "Rebounds", isNumeric: true },
  { key: "points", label: "Points", isNumeric: true },
  { key: "assists", label: "Assists", isNumeric: true },
  { key: "steals", label: "Steals", isNumeric: true },
  { key: "blocks", label: "Blocks", isNumeric: true },
  { key: "fgPercentage", label: "FG%", isNumeric: true },
  { key: "ftPercentage", label: "FT%", isNumeric: true },
  { key: "three_pointers", label: "Three Pointers", isNumeric: true },
  { key: "turnovers", label: "Turnovers", isNumeric: true },
  { key: "fantasy_points", label: "Fantasy Points", isNumeric: true },
];

export const GAME_FILTER_VALUE_SUGGESTIONS = {
  playerNames: [], // Populated dynamically from players data
  positions: [
    { value: "PG", label: "Point Guard" },
    { value: "SG", label: "Shooting Guard" },
    { value: "SF", label: "Small Forward" },
    { value: "PF", label: "Power Forward" },
    { value: "C", label: "Center" },
  ],
  teamNames: [
    { value: "Lakers", label: "Los Angeles Lakers" },
    { value: "Celtics", label: "Boston Celtics" },
    { value: "Warriors", label: "Golden State Warriors" },
    { value: "Bulls", label: "Chicago Bulls" },
    { value: "Spurs", label: "San Antonio Spurs" },
  ],
  nationalities: [
    { value: "USA", label: "USA" },
    { value: "Canada", label: "Canada" },
    { value: "France", label: "France" },
    { value: "Spain", label: "Spain" },
    { value: "Serbia", label: "Serbia" },
    { value: "Israel", label: "Israel" },
    { value: "Argentina", label: "Argentina" },
    { value: "Australia", label: "Australia" },
    { value: "Brazil", label: "Brazil" },
    { value: "China", label: "China" },
  ],
};
