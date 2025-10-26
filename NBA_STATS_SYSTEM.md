# NBA Stats System Documentation

Complete system for tracking NBA player statistics, calculating fantasy values, and mapping Yahoo Fantasy IDs.

## 🏀 **System Overview**

This system consists of:
1. **3 Database Tables** - Store game logs, season averages, and ID mappings
2. **3 Edge Functions** - Fetch stats, calculate averages, orchestrate updates
3. **Automated Workflows** - Daily stats updates with z-score calculations

## 📊 **Database Tables**

### 1. `player_game_logs`
Stores individual game statistics for each player.

**Key Fields:**
- `player_id` (INTEGER) - NBA API player ID
- `game_date` (TEXT) - Game date (YYYY-MM-DD)
- `season` (TEXT) - Season (e.g., "2024-25")
- Stats: points, rebounds, assists, steals, blocks, turnovers, minutes, etc.
- `fantasy_points` (REAL) - Calculated fantasy points

**Unique Constraint:** `(player_id, game_date, season)` - Prevents duplicates

### 2. `player_season_averages`
Stores calculated per-game averages and z-scores.

**Key Fields:**
- `player_id` (INTEGER) - NBA API player ID
- `season` (TEXT) - Season
- Per-game averages: `points_per_game`, `rebounds_per_game`, etc.
- Shooting percentages: `field_goal_percentage`, `free_throw_percentage`
- **Z-scores**: `points_z`, `rebounds_z`, `assists_z`, etc.
- `total_value` (REAL) - Sum of all z-scores (fantasy value metric)

**Unique Constraint:** `(player_id, season)`

### 3. `yahoo_nba_mapping`
Maps NBA API player IDs to Yahoo Fantasy IDs.

**Key Fields:**
- `nba_id` (INTEGER) - NBA API player ID (unique)
- `yahoo_id` (INTEGER) - Yahoo Fantasy player ID
- `name` (TEXT) - Player name
- `team` (TEXT) - Current team abbreviation
- `position` (TEXT) - Position(s)

## ⚡ **Edge Functions**

### 1. `retrieve-nba-stats`
Fetches game logs from NBA API and stores them in the database.

**Endpoint:** `/functions/v1/retrieve-nba-stats`

**Request:**
```json
{
  "daysBack": 1,        // Number of days to fetch (1-30)
  "season": "2024-25"   // NBA season
}
```

**Response:**
```json
{
  "success": true,
  "datesProcessed": ["2024-10-25"],
  "totalInserted": 287,
  "totalErrors": 0,
  "message": "Processed 1 date(s). Inserted/updated 287 records."
}
```

**Features:**
- Fetches scoreboard and boxscores from stats.nba.com
- Calculates fantasy points for each game
- Upserts data (won't create duplicates)
- Can run retroactively for multiple days

### 2. `calculate-player-averages`
Calculates per-game averages and z-scores for all players.

**Endpoint:** `/functions/v1/calculate-player-averages`

**Request:**
```json
{
  "season": "2024-25",
  "playerIds": []       // Optional: specific players to update
}
```

**Response:**
```json
{
  "success": true,
  "season": "2024-25",
  "playersProcessed": 287,
  "successCount": 287,
  "errorCount": 0,
  "leagueAverages": {
    "points": 12.5,
    "rebounds": 4.8,
    "assists": 2.9,
    "steals": 0.9,
    "blocks": 0.6
  }
}
```

**Features:**
- Calculates per-game averages from game logs
- Computes z-scores for each statistical category
- Filters players with minimum 5 games played
- Calculates `total_value` (sum of z-scores)

### 3. `update-nba-stats` (Orchestrator)
Runs both functions in sequence.

**Endpoint:** `/functions/v1/update-nba-stats`

**Request:**
```json
{
  "daysBack": 1,
  "season": "2024-25"
}
```

**Response:**
```json
{
  "success": true,
  "daysBack": 1,
  "season": "2024-25",
  "retrieve": {
    "datesProcessed": ["2024-10-25"],
    "totalInserted": 287,
    "totalErrors": 0
  },
  "calculate": {
    "playersProcessed": 287,
    "successCount": 287,
    "errorCount": 0
  },
  "message": "Successfully updated NBA stats..."
}
```

## 🚀 **Deployment**

### Quick Deployment:
```bash
./supabase/deploy-nba-stats.sh
```

### Manual Deployment:
```bash
# 1. Apply migrations
supabase db push

# 2. Deploy functions
supabase functions deploy retrieve-nba-stats
supabase functions deploy calculate-player-averages
supabase functions deploy update-nba-stats
```

## 📖 **Usage Examples**

### Example 1: Daily Update (Yesterday's Games)
```bash
curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/update-nba-stats \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR-ANON-KEY' \
  -d '{"daysBack": 1, "season": "2024-25"}'
```

### Example 2: Backfill Last Week
```bash
curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/update-nba-stats \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR-ANON-KEY' \
  -d '{"daysBack": 7, "season": "2024-25"}'
```

### Example 3: Backfill Last Month
```bash
curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/update-nba-stats \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR-ANON-KEY' \
  -d '{"daysBack": 30, "season": "2024-25"}'
```

### Example 4: Only Calculate Averages (After Manual Data Insert)
```bash
curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/calculate-player-averages \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR-ANON-KEY' \
  -d '{"season": "2024-25"}'
```

## 🤖 **Automated Daily Updates**

### Option 1: Supabase Cron (Recommended)
Create a cron job in your Supabase dashboard:

1. Go to Database → Cron Jobs
2. Create new job:
```sql
SELECT net.http_post(
    url := 'https://YOUR-PROJECT.supabase.co/functions/v1/update-nba-stats',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR-SERVICE-KEY"}'::jsonb,
    body := '{"daysBack": 1, "season": "2024-25"}'::jsonb
) AS request_id;
```
3. Schedule: `0 12 * * *` (daily at 12 PM)

### Option 2: GitHub Actions
Create `.github/workflows/update-nba-stats.yml`:
```yaml
name: Update NBA Stats
on:
  schedule:
    - cron: '0 12 * * *'  # Daily at 12 PM UTC
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Call Supabase Function
        run: |
          curl -X POST ${{ secrets.SUPABASE_URL }}/functions/v1/update-nba-stats \
            -H 'Content-Type: application/json' \
            -H 'Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}' \
            -d '{"daysBack": 1, "season": "2024-25"}'
```

## 📈 **Z-Score Calculation**

Z-scores measure how many standard deviations a player's stat is from the league average:

```
z = (value - mean) / standard_deviation
```

**Categories:**
- Points per game
- Rebounds per game
- Assists per game
- Steals per game
- Blocks per game
- Three-pointers per game
- Field goal percentage
- Free throw percentage
- Turnovers per game (negative - fewer is better)

**Total Value:**
Sum of all z-scores. Higher = better fantasy player.

## 🗺️ **Yahoo NBA Mapping**

### Importing Mapping Data

Create a CSV file (`yahoo_nba_mapping.csv`):
```csv
nba_id,name,yahoo_id,team,position
1630173,Precious Achiuwa,6412,MIA,"PF,C"
203076,Anthony Davis,4558,LAL,"PF,C"
...
```

Import via Supabase dashboard or SQL:
```sql
INSERT INTO yahoo_nba_mapping (nba_id, name, yahoo_id, team, position)
VALUES 
  (1630173, 'Precious Achiuwa', 6412, 'MIA', 'PF,C'),
  (203076, 'Anthony Davis', 4558, 'LAL', 'PF,C');
```

### Using in Queries

Join with player stats:
```sql
SELECT 
  psa.*,
  ynm.yahoo_id,
  ynm.position
FROM player_season_averages psa
LEFT JOIN yahoo_nba_mapping ynm ON psa.player_id = ynm.nba_id
WHERE psa.season = '2024-25'
ORDER BY psa.total_value DESC
LIMIT 50;
```

## 🔍 **Useful Queries**

### Top 50 Fantasy Players by Z-Score
```sql
SELECT 
  player_name,
  team_abbreviation,
  games_played,
  points_per_game,
  rebounds_per_game,
  assists_per_game,
  total_value
FROM player_season_averages
WHERE season = '2024-25'
  AND games_played >= 5
ORDER BY total_value DESC
LIMIT 50;
```

### Player Game Log History
```sql
SELECT 
  game_date,
  opponent,
  points,
  rebounds,
  assists,
  fantasy_points
FROM player_game_logs
WHERE player_id = 2544  -- LeBron James
  AND season = '2024-25'
ORDER BY game_date DESC;
```

### League Leaders by Category
```sql
SELECT 
  player_name,
  team_abbreviation,
  points_per_game,
  points_z
FROM player_season_averages
WHERE season = '2024-25'
  AND games_played >= 10
ORDER BY points_per_game DESC
LIMIT 10;
```

## 🐛 **Troubleshooting**

### No Games Found
- NBA API might not have data yet (games finish late)
- Run the next day or adjust `daysBack`
- Check NBA season dates

### Duplicate Key Errors
- Shouldn't happen with upsert
- Check unique constraints
- Verify `player_id`, `game_date`, `season`combination

### Rate Limiting
- NBA API has rate limits
- Function includes 100ms delays between requests
- For large backfills, run in batches

### Missing Yahoo IDs
- Import mapping data from CSV
- Build mapping by matching names
- Yahoo IDs change between seasons

## 📚 **Data Sources**

- **NBA Stats API**: `stats.nba.com`
- **Yahoo Fantasy API**: For Yahoo ID mapping
- **Endpoints Used**:
  - `/stats/scoreboardV2` - Game schedule
  - `/stats/boxscoretraditionalv2` - Player game stats

## 🎯 **Future Enhancements**

- [ ] Add player projections
- [ ] Include advanced stats (PER, USG%, etc.)
- [ ] Historical season data
- [ ] Injury status tracking
- [ ] Trade impact analysis
- [ ] Schedule difficulty ratings
- [ ] Automated Yahoo ID scraping

---

## 📞 **Support**

For issues or questions:
1. Check Supabase function logs
2. Verify database migrations applied
3. Test with single day first (`daysBack: 1`)
4. Review NBA API documentation

**Logs:**
```bash
supabase functions logs retrieve-nba-stats
supabase functions logs calculate-player-averages
supabase functions logs update-nba-stats
```

