import fetch from 'node-fetch';

// Function to fetch last night's NBA stats
async function getLastNightStats(useTestDate = false) {
  try {
    // Calculate yesterday's date (last night)
    const today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // For testing: Use a known date with games (Oct 25, 2024)
    if (useTestDate) {
      yesterday = new Date('2024-10-25');
    }

    const yesterdayStr = yesterday.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD format
    const yesterdayIso = yesterday.toISOString().slice(0, 10); // YYYY-MM-DD for matching
    console.log(`Fetching NBA data for ${yesterdayStr}...`);

    // Step 1: Fetch scoreboard for yesterday using stats.nba.com endpoint
    const scoreboardUrl = `https://stats.nba.com/stats/scoreboardV2?DayOffset=0&GameDate=${yesterdayIso}&LeagueID=00`;
    const fetchOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.nba.com/',
        'Origin': 'https://www.nba.com',
      },
    };

    const scoreboardRes = await fetch(scoreboardUrl, fetchOptions);
    if (!scoreboardRes.ok) {
      const errorBody = await scoreboardRes.text();
      throw new Error(`Scoreboard fetch failed: ${scoreboardRes.status} - ${errorBody.substring(0, 200)}...`); // Truncate for logging
    }
    const scoreboardData = await scoreboardRes.json();

    // Extract games from resultSet (robust check)
    const gameHeaderResultSet = scoreboardData.resultSets?.find(rs => rs.name === 'GameHeader');
    const games = gameHeaderResultSet ? gameHeaderResultSet.rowSet : [];
    if (games.length === 0) {
      console.log(`No games found for ${yesterdayStr}`);
      return { date: yesterdayStr, games: 0, playerStats: [] };
    }

    console.log(`Found ${games.length} games.`);

    // Step 2: For each game, fetch boxscore and extract player stats
    const allPlayerStats = [];
    for (const gameRow of games) {
      const gameId = gameRow[2]; // GAME_ID index 2
      const boxscoreUrl = `https://stats.nba.com/stats/boxscoretraditionalv2?EndPeriod=14&GameID=${gameId}&RangeType=0&Season=2024-25&SeasonType=Regular Season&StartPeriod=1`;
      const boxscoreRes = await fetch(boxscoreUrl, fetchOptions);
      if (!boxscoreRes.ok) {
        console.warn(`Boxscore fetch failed for game ${gameId}: ${boxscoreRes.status}`);
        continue;
      }
      const boxscoreData = await boxscoreRes.json();

      // Extract player stats resultSet
      const playerStatsResultSet = boxscoreData.resultSets?.find(rs => rs.name === 'PlayerStats');
      if (!playerStatsResultSet) {
        console.warn(`No player stats for game ${gameId}`);
        continue;
      }

      const headers = playerStatsResultSet.headers;
      const playerRows = playerStatsResultSet.rowSet;

      for (const playerRow of playerRows) {
        const stat = {};
        headers.forEach((header, index) => {
          stat[header] = playerRow[index];
        });

        // Skip if no player ID or invalid row (e.g., totals)
        if (!stat.PLAYER_ID || stat.PLAYER_ID === 'TOTALS') continue;

        allPlayerStats.push({
          gameId,
          teamId: stat.TEAM_ID,
          playerId: stat.PLAYER_ID,
          firstName: stat.PLAYER_NAME ? stat.PLAYER_NAME.split(' ')[0] : 'Unknown',
          lastName: stat.PLAYER_NAME ? stat.PLAYER_NAME.split(' ').slice(1).join(' ') : 'Unknown',
          position: stat.POSITION || 'N/A',
          minutesPlayed: stat.MIN || '0:00',
          fieldGoalsMade: stat.FGM,
          fieldGoalsAttempted: stat.FGA,
          fieldGoalPercentage: stat.FG_PCT,
          threePointersMade: stat.FG3M,
          threePointersAttempted: stat.FG3A,
          threePointPercentage: stat.FG3_PCT,
          freeThrowsMade: stat.FTM,
          freeThrowsAttempted: stat.FTA,
          freeThrowPercentage: stat.FT_PCT,
          offensiveRebounds: stat.OREB,
          defensiveRebounds: stat.DREB,
          totalRebounds: stat.REB,
          assists: stat.AST,
          steals: stat.STL,
          blocks: stat.BLK,
          turnovers: stat.TO,
          personalFouls: stat.PF,
          points: stat.PTS,
        });
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 100));
    }

    const result = {
      date: yesterdayStr,
      games: games.length,
      playerStats: allPlayerStats,
    };

    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Error fetching NBA stats:', error.message);
    return { error: error.message };
  }
}

// Main function to run the script
async function main() {
  // Set to true to test with Oct 25, 2024 (known games)
  await getLastNightStats(true);
  // For real "last night" (Oct 25, 2025), use: await getLastNightStats(false);
}

main();