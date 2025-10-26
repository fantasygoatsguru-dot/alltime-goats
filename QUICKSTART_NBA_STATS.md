# 🏀 NBA Stats System - Quick Start Guide

Get up and running in 5 minutes!

## 📦 **What Was Created**

### Database Tables (3)
1. ✅ `player_game_logs` - Individual game stats
2. ✅ `player_season_averages` - Season averages with z-scores
3. ✅ `yahoo_nba_mapping` - NBA ↔ Yahoo ID mapping

### Edge Functions (3)
1. ✅ `retrieve-nba-stats` - Fetch daily game stats from NBA API
2. ✅ `calculate-player-averages` - Calculate averages & z-scores
3. ✅ `update-nba-stats` - Orchestrator (runs both)

### Scripts & Tools (5)
1. ✅ `deploy-nba-stats.sh` - One-command deployment
2. ✅ `test-nba-stats.sh` - Test all functions
3. ✅ `import-yahoo-mapping.sql` - Load Yahoo mapping data
4. ✅ `sample-yahoo-mapping.csv` - Sample mapping file
5. ✅ `NBA_STATS_SYSTEM.md` - Complete documentation

---

## 🚀 **Deploy in 3 Steps**

### Step 1: Deploy Everything
```bash
cd supabase
./deploy-nba-stats.sh
```

This will:
- Apply database migrations
- Deploy all 3 Edge Functions
- Show you next steps

### Step 2: Import Yahoo Mapping (Optional)
In Supabase SQL Editor, run:
```sql
-- Copy contents from: supabase/import-yahoo-mapping.sql
-- Or upload CSV via dashboard
```

### Step 3: Test It
```bash
# Set environment variables
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"

# Run tests
./test-nba-stats.sh
```

---

## 💡 **Quick Usage**

### Fetch Yesterday's Games
```bash
curl -X POST $SUPABASE_URL/functions/v1/update-nba-stats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -d '{"daysBack": 1, "season": "2024-25"}'
```

### Backfill Last Week
```bash
curl -X POST $SUPABASE_URL/functions/v1/update-nba-stats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -d '{"daysBack": 7, "season": "2024-25"}'
```

### Query Top Players
```sql
SELECT 
  player_name,
  team_abbreviation,
  points_per_game,
  rebounds_per_game,
  assists_per_game,
  total_value
FROM player_season_averages
WHERE season = '2024-25'
  AND games_played >= 5
ORDER BY total_value DESC
LIMIT 20;
```

---

## 🤖 **Automate Daily Updates**

### Option 1: Supabase Cron (Easiest)
Dashboard → Database → Cron Jobs → Create:

```sql
SELECT net.http_post(
    url := 'https://YOUR-PROJECT.supabase.co/functions/v1/update-nba-stats',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR-SERVICE-KEY"}'::jsonb,
    body := '{"daysBack": 1, "season": "2024-25"}'::jsonb
);
```

Schedule: `0 12 * * *` (daily at noon)

### Option 2: GitHub Actions
Create `.github/workflows/update-nba-stats.yml`:

```yaml
name: Update NBA Stats
on:
  schedule:
    - cron: '0 12 * * *'
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X POST ${{ secrets.SUPABASE_URL }}/functions/v1/update-nba-stats \
            -H 'Content-Type: application/json' \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -d '{"daysBack": 1, "season": "2024-25"}'
```

---

## 📊 **Key Features**

### Anti-Duplicate Protection
The system uses `UPSERT` with unique constraints:
- Won't create duplicate game logs
- Safe to run multiple times
- Perfect for automated schedules

### Z-Score Fantasy Rankings
Players are ranked by **total_value** (sum of z-scores):
- Points, Rebounds, Assists, Steals, Blocks
- 3-Pointers, FG%, FT%
- Turnovers (negative scoring)

**Higher total_value = Better fantasy player**

### Retroactive Data Loading
Backfill any time period:
```json
{"daysBack": 30}  // Last month
{"daysBack": 7}   // Last week
{"daysBack": 1}   // Yesterday
```

---

## 🔍 **Common Queries**

### Player Game History
```sql
SELECT game_date, opponent, points, rebounds, assists, fantasy_points
FROM player_game_logs
WHERE player_name = 'LeBron James'
  AND season = '2024-25'
ORDER BY game_date DESC;
```

### League Leaders - Points
```sql
SELECT player_name, team_abbreviation, points_per_game, points_z
FROM player_season_averages
WHERE season = '2024-25' AND games_played >= 10
ORDER BY points_per_game DESC
LIMIT 10;
```

### Best Fantasy Players
```sql
SELECT 
  player_name,
  team_abbreviation,
  total_value,
  points_per_game,
  rebounds_per_game,
  assists_per_game
FROM player_season_averages
WHERE season = '2024-25'
  AND games_played >= 10
ORDER BY total_value DESC
LIMIT 50;
```

### Join with Yahoo IDs
```sql
SELECT 
  psa.player_name,
  psa.total_value,
  ynm.yahoo_id,
  ynm.position
FROM player_season_averages psa
JOIN yahoo_nba_mapping ynm ON psa.player_id = ynm.nba_id
WHERE psa.season = '2024-25'
  AND psa.games_played >= 10
ORDER BY psa.total_value DESC;
```

---

## 🐛 **Troubleshooting**

### "No games found"
→ Games might not be finished yet. Run the next day.

### "Duplicate key error"
→ Shouldn't happen with upsert. Check logs for actual issue.

### "Rate limit error"
→ Function includes delays. For large backfills, run in batches.

### Function logs
```bash
supabase functions logs retrieve-nba-stats --tail
supabase functions logs calculate-player-averages --tail
supabase functions logs update-nba-stats --tail
```

---

## 📚 **Documentation**

- **Complete Guide**: `NBA_STATS_SYSTEM.md`
- **Database Schema**: `supabase/migrations/20250103000000_create_nba_stats_tables.sql`
- **Sample Data**: `supabase/sample-yahoo-mapping.csv`

---

## 🎯 **Next Steps**

1. ✅ Deploy the system
2. ✅ Test with 1 day of data
3. ✅ Backfill last week
4. ✅ Import Yahoo mapping
5. ✅ Set up automated daily runs
6. ✅ Query player stats
7. ✅ Build your fantasy app!

---

## 💬 **Need Help?**

1. Check function logs in Supabase dashboard
2. Review `NBA_STATS_SYSTEM.md` for detailed info
3. Test with `./test-nba-stats.sh`
4. Verify migrations: `supabase db push`

**Ready to track every NBA stat automatically!** 🏀🔥

