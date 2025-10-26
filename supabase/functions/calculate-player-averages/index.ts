import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PlayerAverage {
  player_id: number;
  player_name: string;
  team_abbreviation: string;
  games_played: number;
  minutes_per_game: number;
  points_per_game: number;
  rebounds_per_game: number;
  assists_per_game: number;
  steals_per_game: number;
  blocks_per_game: number;
  three_pointers_per_game: number;
  field_goals_per_game: number;
  field_goals_attempted_per_game: number;
  field_goal_percentage: number;
  free_throws_per_game: number;
  free_throws_attempted_per_game: number;
  free_throw_percentage: number;
  turnovers_per_game: number;
}

// Calculate mean and standard deviation for z-score calculation
function calculateStats(values: number[]) {
  if (values.length === 0) return { mean: 0, stdDev: 0 };
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return { mean, stdDev };
}

// Calculate z-score for a value
function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}

serve(async (req) => {
  console.log("=== Calculate Player Averages Request ===");
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { season = "2025-26", playerIds = [] } = await req.json();
    
    console.log("Season:", season);
    console.log("Player IDs filter:", playerIds.length > 0 ? playerIds : "All players");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Step 1: Calculate per-game averages for each player
    console.log("\n=== Step 1: Calculating Player Averages ===");
    
    let query = supabase
      .from("player_game_logs")
      .select("*")
      .eq("season", season);
    
    // If specific player IDs provided, filter for those
    if (playerIds.length > 0) {
      query = query.in("player_id", playerIds);
    }
    
    const { data: gameLogs, error: fetchError } = await query;
    
    if (fetchError) {
      throw new Error(`Failed to fetch game logs: ${fetchError.message}`);
    }

    console.log(`Retrieved ${gameLogs?.length || 0} game logs`);

    if (!gameLogs || gameLogs.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "No game logs found to process",
          playersProcessed: 0,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Group by player
    const playerGames = new Map<number, any[]>();
    
    for (const log of gameLogs) {
      const playerId = log.player_id;
      if (!playerGames.has(playerId)) {
        playerGames.set(playerId, []);
      }
      playerGames.get(playerId)!.push(log);
    }

    console.log(`Found ${playerGames.size} unique players`);

    // Calculate averages for each player
    const playerAverages: PlayerAverage[] = [];
    
    for (const [playerId, games] of playerGames) {
      const gamesPlayed = games.length;
      
      // Sum all stats
      const totals = games.reduce((acc, game) => ({
        minutes: acc.minutes + (game.minutes || 0),
        points: acc.points + (game.points || 0),
        rebounds: acc.rebounds + (game.rebounds || 0),
        assists: acc.assists + (game.assists || 0),
        steals: acc.steals + (game.steals || 0),
        blocks: acc.blocks + (game.blocks || 0),
        three_pointers: acc.three_pointers + (game.three_pointers_made || 0),
        field_goals_made: acc.field_goals_made + (game.field_goals_made || 0),
        field_goals_attempted: acc.field_goals_attempted + (game.field_goals_attempted || 0),
        free_throws_made: acc.free_throws_made + (game.free_throws_made || 0),
        free_throws_attempted: acc.free_throws_attempted + (game.free_throws_attempted || 0),
        turnovers: acc.turnovers + (game.turnovers || 0),
      }), {
        minutes: 0,
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        three_pointers: 0,
        field_goals_made: 0,
        field_goals_attempted: 0,
        free_throws_made: 0,
        free_throws_attempted: 0,
        turnovers: 0,
      });

      // Calculate percentages
      const fgPct = totals.field_goals_attempted > 0 
        ? totals.field_goals_made / totals.field_goals_attempted 
        : 0;
      
      const ftPct = totals.free_throws_attempted > 0 
        ? totals.free_throws_made / totals.free_throws_attempted 
        : 0;

      // Most recent game for player name and team
      const mostRecentGame = games.sort((a, b) => 
        b.game_date.localeCompare(a.game_date)
      )[0];

      playerAverages.push({
        player_id: playerId,
        player_name: mostRecentGame.player_name,
        team_abbreviation: mostRecentGame.team_abbreviation,
        games_played: gamesPlayed,
        minutes_per_game: totals.minutes / gamesPlayed,
        points_per_game: totals.points / gamesPlayed,
        rebounds_per_game: totals.rebounds / gamesPlayed,
        assists_per_game: totals.assists / gamesPlayed,
        steals_per_game: totals.steals / gamesPlayed,
        blocks_per_game: totals.blocks / gamesPlayed,
        three_pointers_per_game: totals.three_pointers / gamesPlayed,
        field_goals_per_game: totals.field_goals_made / gamesPlayed,
        field_goals_attempted_per_game: totals.field_goals_attempted / gamesPlayed,
        field_goal_percentage: fgPct,
        free_throws_per_game: totals.free_throws_made / gamesPlayed,
        free_throws_attempted_per_game: totals.free_throws_attempted / gamesPlayed,
        free_throw_percentage: ftPct,
        turnovers_per_game: totals.turnovers / gamesPlayed,
      });
    }

    console.log(`Calculated averages for ${playerAverages.length} players`);

    // Step 2: Calculate z-scores
    console.log("\n=== Step 2: Calculating Z-Scores ===");
    
    // Filter players with minimum games played (e.g., at least 5 games)
    const MIN_GAMES = 5;
    const qualifiedPlayers = playerAverages.filter(p => p.games_played >= MIN_GAMES);
    
    console.log(`${qualifiedPlayers.length} players qualify for z-score calculation (${MIN_GAMES}+ games)`);

    // Calculate league stats for z-scores
    const leagueStats = {
      points: calculateStats(qualifiedPlayers.map(p => p.points_per_game)),
      rebounds: calculateStats(qualifiedPlayers.map(p => p.rebounds_per_game)),
      assists: calculateStats(qualifiedPlayers.map(p => p.assists_per_game)),
      steals: calculateStats(qualifiedPlayers.map(p => p.steals_per_game)),
      blocks: calculateStats(qualifiedPlayers.map(p => p.blocks_per_game)),
      three_pointers: calculateStats(qualifiedPlayers.map(p => p.three_pointers_per_game)),
      fg_percentage: calculateStats(qualifiedPlayers.map(p => p.field_goal_percentage)),
      ft_percentage: calculateStats(qualifiedPlayers.map(p => p.free_throw_percentage)),
      turnovers: calculateStats(qualifiedPlayers.map(p => p.turnovers_per_game)),
    };

    console.log("League averages:", {
      points: leagueStats.points.mean.toFixed(2),
      rebounds: leagueStats.rebounds.mean.toFixed(2),
      assists: leagueStats.assists.mean.toFixed(2),
    });

    // Step 3: Insert/update player season averages with z-scores
    console.log("\n=== Step 3: Updating Database ===");
    
    let successCount = 0;
    let errorCount = 0;

    for (const player of playerAverages) {
      const points_z = calculateZScore(player.points_per_game, leagueStats.points.mean, leagueStats.points.stdDev);
      const rebounds_z = calculateZScore(player.rebounds_per_game, leagueStats.rebounds.mean, leagueStats.rebounds.stdDev);
      const assists_z = calculateZScore(player.assists_per_game, leagueStats.assists.mean, leagueStats.assists.stdDev);
      const steals_z = calculateZScore(player.steals_per_game, leagueStats.steals.mean, leagueStats.steals.stdDev);
      const blocks_z = calculateZScore(player.blocks_per_game, leagueStats.blocks.mean, leagueStats.blocks.stdDev);
      const three_pointers_z = calculateZScore(player.three_pointers_per_game, leagueStats.three_pointers.mean, leagueStats.three_pointers.stdDev);
      const fg_percentage_z = calculateZScore(player.field_goal_percentage, leagueStats.fg_percentage.mean, leagueStats.fg_percentage.stdDev);
      const ft_percentage_z = calculateZScore(player.free_throw_percentage, leagueStats.ft_percentage.mean, leagueStats.ft_percentage.stdDev);
      
      // Turnovers are negative (lower is better)
      const turnovers_z = -calculateZScore(player.turnovers_per_game, leagueStats.turnovers.mean, leagueStats.turnovers.stdDev);
      
      // Total value is the sum of all z-scores
      const total_value = points_z + rebounds_z + assists_z + steals_z + blocks_z + 
                          three_pointers_z + fg_percentage_z + ft_percentage_z + turnovers_z;

      const { error } = await supabase
        .from("player_season_averages")
        .upsert({
          season,
          player_id: player.player_id,
          player_name: player.player_name,
          team_abbreviation: player.team_abbreviation,
          games_played: player.games_played,
          minutes_per_game: player.minutes_per_game,
          points_per_game: player.points_per_game,
          rebounds_per_game: player.rebounds_per_game,
          assists_per_game: player.assists_per_game,
          steals_per_game: player.steals_per_game,
          blocks_per_game: player.blocks_per_game,
          three_pointers_per_game: player.three_pointers_per_game,
          field_goals_per_game: player.field_goals_per_game,
          field_goals_attempted_per_game: player.field_goals_attempted_per_game,
          field_goal_percentage: player.field_goal_percentage,
          free_throws_per_game: player.free_throws_per_game,
          free_throws_attempted_per_game: player.free_throws_attempted_per_game,
          free_throw_percentage: player.free_throw_percentage,
          turnovers_per_game: player.turnovers_per_game,
          points_z,
          rebounds_z,
          assists_z,
          steals_z,
          blocks_z,
          three_pointers_z,
          fg_percentage_z,
          ft_percentage_z,
          turnovers_z,
          total_value,
        }, {
          onConflict: "player_id,season",
        });

      if (error) {
        console.error(`Error updating ${player.player_name}:`, error);
        errorCount++;
      } else {
        successCount++;
      }
    }

    const result = {
      success: true,
      season,
      playersProcessed: playerAverages.length,
      successCount,
      errorCount,
      leagueAverages: {
        points: leagueStats.points.mean,
        rebounds: leagueStats.rebounds.mean,
        assists: leagueStats.assists.mean,
        steals: leagueStats.steals.mean,
        blocks: leagueStats.blocks.mean,
      },
      message: `Calculated averages for ${successCount} players. ${errorCount} errors.`,
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

