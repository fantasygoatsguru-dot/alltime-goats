import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PlayerStat {
  gameId: string;
  teamId: string;
  playerId: string;
  playerName: string;
  position: string;
  minutesPlayed: string;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  fieldGoalPercentage: number;
  threePointersMade: number;
  threePointersAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  totalRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  points: number;
  teamAbbr: string;
  opponent: string;
}

async function fetchNBAStatsForDate(dateStr: string, season = "2024-25") {
  console.log(`Fetching NBA stats for ${dateStr}...`);
  
  const fetchOptions = {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://www.nba.com/",
      "Origin": "https://www.nba.com",
      "Connection": "keep-alive",
      "sec-ch-ua": '"Chromium";v="141", "Not:A-Brand";v="99"',
      "sec-ch-ua-platform": '"Windows"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
    },
  };

  const scoreboardUrl = `https://stats.nba.com/stats/scoreboardV2?DayOffset=0&GameDate=${dateStr}&LeagueID=00`;
  console.log("Fetching scoreboard:", scoreboardUrl);

  // Retry logic for network issues
  let attempts = 0;
  const maxAttempts = 3;
  while (attempts < maxAttempts) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      const scoreboardRes = await fetch(scoreboardUrl, {
        ...fetchOptions,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!scoreboardRes.ok) {
        const errorText = await scoreboardRes.text();
        throw new Error(`Scoreboard fetch failed: ${scoreboardRes.status} - ${errorText.substring(0, 200)}`);
      }

      const scoreboardData = await scoreboardRes.json();
      console.log("Scoreboard response received:", JSON.stringify(scoreboardData, null, 2).substring(0, 200)); // Log partial response

      const gameHeaderResultSet = scoreboardData.resultSets?.find((rs: any) => rs.name === "GameHeader");
      const games = gameHeaderResultSet ? gameHeaderResultSet.rowSet : [];
      
      if (games.length === 0) {
        console.log(`No games found for ${dateStr}`);
        return [];
      }

      console.log(`Found ${games.length} games`);

      const allPlayerStats: PlayerStat[] = [];
      
      for (const gameRow of games) {
        const gameId = gameRow[2];
        const homeTeamId = gameRow[6];
        const awayTeamId = gameRow[7];
        
        console.log(`Fetching boxscore for game ${gameId}...`);
        
        const boxscoreUrl = `https://stats.nba.com/stats/boxscoretraditionalv2?EndPeriod=14&GameID=${gameId}&RangeType=0&Season=${season}&SeasonType=Regular%20Season&StartPeriod=1`;
        
        try {
          const boxscoreRes = await fetch(boxscoreUrl, fetchOptions);
          if (!boxscoreRes.ok) {
            console.warn(`Boxscore fetch failed for game ${gameId}: ${boxscoreRes.status}`);
            continue;
          }
          
          const boxscoreData = await boxscoreRes.json();
          const playerStatsResultSet = boxscoreData.resultSets?.find((rs: any) => rs.name === "PlayerStats");
          
          if (!playerStatsResultSet) {
            console.warn(`No player stats for game ${gameId}`);
            continue;
          }

          const headers = playerStatsResultSet.headers;
          const playerRows = playerStatsResultSet.rowSet;

          const teamDetailsSet = boxscoreData.resultSets?.find((rs: any) => rs.name === "TeamStats");
          const teamRows = teamDetailsSet ? teamDetailsSet.rowSet : [];
          const homeTeam = teamRows.find((t: any) => t[1] === homeTeamId);
          const awayTeam = teamRows.find((t: any) => t[1] === awayTeamId);
          const homeTeamAbbr = homeTeam ? homeTeam[2] : "UNK";
          const awayTeamAbbr = awayTeam ? awayTeam[2] : "UNK";

          for (const playerRow of playerRows) {
            const stat: any = {};
            headers.forEach((header: string, index: number) => {
              stat[header] = playerRow[index];
            });

            if (!stat.PLAYER_ID || !stat.PLAYER_NAME) continue;

            const playerTeamId = stat.TEAM_ID;
            const teamAbbr = playerTeamId === homeTeamId ? homeTeamAbbr : awayTeamAbbr;
            const opponent = playerTeamId === homeTeamId ? awayTeamAbbr : homeTeamAbbr;

            allPlayerStats.push({
              gameId,
              teamId: stat.TEAM_ID,
              playerId: stat.PLAYER_ID.toString(),
              playerName: stat.PLAYER_NAME,
              position: stat.START_POSITION || "Bench",
              minutesPlayed: stat.MIN || "0:00",
              fieldGoalsMade: stat.FGM || 0,
              fieldGoalsAttempted: stat.FGA || 0,
              fieldGoalPercentage: stat.FG_PCT || 0,
              threePointersMade: stat.FG3M || 0,
              threePointersAttempted: stat.FG3A || 0,
              freeThrowsMade: stat.FTM || 0,
              freeThrowsAttempted: stat.FTA || 0,
              totalRebounds: stat.REB || 0,
              assists: stat.AST || 0,
              steals: stat.STL || 0,
              blocks: stat.BLK || 0,
              turnovers: stat.TO || 0,
              points: stat.PTS || 0,
              teamAbbr,
              opponent,
            });
          }

          await new Promise((r) => setTimeout(r, 100)); // Avoid rate limiting
        } catch (error) {
          console.error(`Error fetching boxscore for game ${gameId}:`, error.message);
        }
      }

      return allPlayerStats;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed:`, error.message);
      if (attempts < maxAttempts) {
        console.log(`Retrying in 2 seconds...`);
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        throw new Error(`Failed after ${maxAttempts} attempts: ${error.message}`);
      }
    }
  }
}

function minutesToDecimal(minutesStr: string): number {
  if (!minutesStr || minutesStr === "0:00") return 0;
  const parts = minutesStr.split(":");
  if (parts.length !== 2) return 0;
  const mins = parseInt(parts[0]) || 0;
  const secs = parseInt(parts[1]) || 0;
  return mins + secs / 60;
}

function calculateFantasyPoints(stat: PlayerStat): number {
  return (
    stat.points * 1.0 +
    stat.totalRebounds * 1.2 +
    stat.assists * 1.5 +
    stat.steals * 3.0 +
    stat.blocks * 3.0 +
    stat.turnovers * -1.0
  );
}

serve(async (req) => {
  console.log("=== Retrieve NBA Stats Request ===");
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { daysBack = 1, season = "2024-25" } = await req.json();
    
    console.log("Days back:", daysBack);
    console.log("Season:", season);
    console.log("Supabase URL:", SUPABASE_URL);
    console.log("Service Role Key:", SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 1; i <= daysBack; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().slice(0, 10));
    }

    console.log("Dates to fetch:", dates);

    let totalInserted = 0;
    let totalErrors = 0;

    for (const dateStr of dates) {
      console.log(`\n=== Processing ${dateStr} ===`);
      
      try {
        const stats = await fetchNBAStatsForDate(dateStr, season);
        
        if (stats.length === 0) {
          console.log(`No stats for ${dateStr}`);
          continue;
        }

        console.log(`Retrieved ${stats.length} player stats`);

        for (const stat of stats) {
          const minutes = minutesToDecimal(stat.minutesPlayed);
          const fantasyPoints = calculateFantasyPoints(stat);

          const { error } = await supabase
            .from("player_game_logs")
            .upsert({
              season,
              player_id: parseInt(stat.playerId),
              player_name: stat.playerName,
              game_date: dateStr,
              team_abbreviation: stat.teamAbbr,
              opponent: stat.opponent,
              points: stat.points,
              rebounds: stat.totalRebounds,
              assists: stat.assists,
              field_goals_attempted: stat.fieldGoalsAttempted,
              field_goals_made: stat.fieldGoalsMade,
              free_throws_attempted: stat.freeThrowsAttempted,
              free_throws_made: stat.freeThrowsMade,
              three_pointers_made: stat.threePointersMade,
              blocks: stat.blocks,
              turnovers: stat.turnovers,
              steals: stat.steals,
              minutes,
              fantasy_points: fantasyPoints,
            }, {
              onConflict: ["player_id", "game_date", "season"],
            });

          if (error) {
            console.error(`Upsert error for ${stat.playerName}:`, error.message, error.details);
            totalErrors++;
          } else {
            totalInserted++;
          }
        }

        console.log(`Inserted/updated ${stats.length} records for ${dateStr}`);
      } catch (error) {
        console.error(`Error processing ${dateStr}:`, error.message);
        totalErrors++;
      }
    }

    const result = {
      success: true,
      datesProcessed: dates,
      totalInserted,
      totalErrors,
      message: `Processed ${dates.length} date(s). Inserted/updated ${totalInserted} records with ${totalErrors} errors.`,
    };

    console.log("\n=== Summary ===");
    console.log(JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("=== Error ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Check Supabase function logs for more information"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});