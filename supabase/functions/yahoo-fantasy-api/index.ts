import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const GAME_ID = "466"; // NBA 2025-26 season

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getAccessToken(userId: string) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  const { data: tokenData, error } = await supabase
    .from("yahoo_tokens")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !tokenData) {
    throw new Error("No valid token found");
  }

  const expiresAt = new Date(tokenData.expires_at);
  if (expiresAt < new Date()) {
    throw new Error("Token expired, please refresh");
  }

  return tokenData.access_token;
}

async function getNbaIdFromYahooId(supabase: any, yahooId: number) {
  const { data, error } = await supabase
    .from("yahoo_nba_mapping")
    .select("nba_id")
    .eq("yahoo_id", yahooId)
    .single();

  if (error || !data) {
    console.warn(`No NBA ID found for Yahoo ID ${yahooId}`);
    return null;
  }

  return data.nba_id;
}

async function makeYahooRequest(accessToken: string, endpoint: string) {
  // Remove ?format=json_f from endpoint if already present to avoid duplication
  const cleanEndpoint = endpoint.replace(/\?format=json_f$/, "");
  const response = await fetch(`https://fantasysports.yahooapis.com/fantasy/v2${cleanEndpoint}?format=json_f`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Yahoo API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

serve(async (req) => {
  console.log("=== Yahoo Fantasy API Request ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    
    const { action, userId, leagueId, teamKey, week } = requestBody;

    if (!userId) {
      console.error("No userId provided");
      throw new Error("User ID is required");
    }

    console.log("Action:", action);
    console.log("User ID:", userId);
    console.log("League ID:", leagueId);

    const accessToken = await getAccessToken(userId);
    console.log("Access token retrieved:", accessToken ? "Yes" : "No");
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (action === "getUserLeagues") {
      console.log("Fetching user leagues...");
      const data = await makeYahooRequest(accessToken, `/users;use_login=1/games;game_keys=nba/leagues`);
      
      console.log("Raw leagues response:", JSON.stringify(data, null, 2));
      
      // Corrected parsing logic
      const leagues = data?.fantasy_content?.users?.[0]?.user?.games?.[0]?.game?.leagues || [];
      console.log("Leagues found:", leagues.length);
      
      const leagueList = leagues
        .filter((item: any) => item?.league && typeof item.league === 'object')
        .map((item: any) => {
          const league = item.league;
          return {
            leagueKey: league.league_key,
            leagueId: league.league_id,
            name: league.name,
            season: league.season,
            gameId: league.game_id,
          };
        });

      console.log("Processed leagues:", JSON.stringify(leagueList, null, 2));

      return new Response(
        JSON.stringify({ leagues: leagueList }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === "getCurrentMatchup") {
      console.log("=== Getting Current Matchup ===");
      
      if (!leagueId) {
        console.error("No league ID provided");
        throw new Error("League ID is required");
      }

      const leagueKey = `${GAME_ID}.l.${leagueId}`;
      console.log("League key:", leagueKey);
      
      console.log("Fetching teams in league...");
      const userTeamsData = await makeYahooRequest(accessToken, `/league/${leagueKey}/teams`);
      
      console.log("Raw teams response:", JSON.stringify(userTeamsData, null, 2));
      
      // Access the teams array directly from fantasy_content.league.teams
      const teams = userTeamsData?.fantasy_content?.league?.teams || [];
      console.log("Number of teams:", teams.length);
      
      // Filter out any invalid entries
      const allTeams = teams.filter((item) => item?.team);
      
      console.log("Filtered teams count:", allTeams.length);
      
      // Iterate over the teams array
      allTeams.forEach((item, index) => {
        const team = item.team;
        console.log(`Team ${index + 1}:`, {
          name: team.name,
          teamKey: team.team_key,
          isOwnedByCurrentLogin: team.is_owned_by_current_login || false,
          owners: team.managers
            ? team.managers.map((manager) => manager.manager.nickname).join(", ")
            : "No managers info",
        });
      });
      const userTeam = allTeams.find((item: any) => item.team?.is_owned_by_current_login === 1);

      if (!userTeam) {
        console.error("Could not find team owned by current user");
        console.error("Looking for is_owned_by_current_login === 1");
        console.error("All teams ownership status:", allTeams.map((item: any) => ({
          name: item.team?.name,
          isOwned: item.team?.is_owned_by_current_login || false
        })));
        throw new Error("Could not find your team in this league");
      }

      const userTeamKey = userTeam.team?.team_key;
      console.log("Found user team:", userTeam.team?.name);
      console.log("User team key:", userTeamKey);
      
      console.log("Fetching matchup data...");
      const matchupData = await makeYahooRequest(
        accessToken, 
        `/team/${userTeamKey}/matchups;weeks=current`
      );

      console.log("Raw matchup response:", JSON.stringify(matchupData, null, 2));
      // Access the matchups array directly from fantasy_content.team.matchups
      const matchups = matchupData?.fantasy_content?.team?.matchups || [];
      console.log("Number of matchups:", matchups.length);

      // Ensure we have at least one matchup
      if (!matchups.length || !matchups[0]?.matchup) {
        console.error("No current matchup found in response");
        throw new Error("No current matchup found");
      }

      // Get the first matchup (since we're querying for the current week)
      const currentMatchup = matchups[0].matchup;
      console.log("Current week:", currentMatchup.week);

      // Access the teams in the matchup
      const matchupTeams = currentMatchup.teams || [];
      console.log("Number of teams in matchup:", matchupTeams.length);

      if (matchupTeams.length < 2) {
        console.error("Expected two teams in matchup, found:", matchupTeams.length);
        throw new Error("Incomplete matchup data");
      }

      // Extract team data
      const team1 = matchupTeams[0]?.team;
      const team2 = matchupTeams[1]?.team;

      console.log("Team 1:", {
        name: team1?.name,
        teamKey: team1?.team_key,
        points: team1?.team_points?.total,
        stats: team1?.team_stats?.stats?.map((stat) => ({
          stat_id: stat.stat.stat_id,
          value: stat.stat.value,
        })),
      });

      console.log("Team 2:", {
        name: team2?.name,
        teamKey: team2?.team_key,
        points: team2?.team_points?.total,
        stats: team2?.team_stats?.stats?.map((stat) => ({
          stat_id: stat.stat.stat_id,
          value: stat.stat.value,
        })),
      });

      console.log("Matchup Details:", {
        week: currentMatchup.week,
        startDate: currentMatchup.week_start,
        endDate: currentMatchup.week_end,
        status: currentMatchup.status,
        isPlayoffs: currentMatchup.is_playoffs,
        winnerTeamKey: currentMatchup.winner_team_key,
        statWinners: currentMatchup.stat_winners?.map((winner) => ({
          stat_id: winner.stat_winner.stat_id,
          winner_team_key: winner.stat_winner.winner_team_key,
        })),
      });

      console.log("Team 1:", team1?.name);
      console.log("Team 2:", team2?.name);

      console.log("Fetching team 1 roster...");
      const team1Roster = await makeYahooRequest(
        accessToken,
        `/team/${team1?.team_key}/roster;week=current`
      );
      console.log("Team 1 roster fetched");
      
      console.log("Fetching team 2 roster...");
      const team2Roster = await makeYahooRequest(
        accessToken,
        `/team/${team2?.team_key}/roster;week=current`
      );
      console.log("Team 2 roster fetched");
      
      const extractPlayers = async (rosterData) => {
        // Access the roster object directly
        const roster = rosterData?.fantasy_content?.team?.roster;
        if (!roster) {
          console.error("No roster found in response");
          return [];
        }
      
        // Access the players array
        const players = roster.players || [];
        console.log(`Number of players: ${players.length}`);
      
        return await Promise.all(
          players
            .filter((item) => item?.player) // Ensure player object exists
            .map(async (item) => {
              const player = item.player;
              const yahooId = player.player_id;
              const nbaId = await getNbaIdFromYahooId(supabase, yahooId);
              return {
                playerKey: player.player_key,
                yahooPlayerId: yahooId,
                nbaPlayerId: nbaId,
                name: player.name?.full,
                position: player.primary_position,
                selectedPosition: player.selected_position?.position,
                eligiblePositions: player.eligible_positions?.map((pos) => pos.position) || [],
                team: player.editorial_team_abbr,
                status: player.status || "Active",
                injuryNote: player.injury_note || null,
              };
            })
        );
      };
      
      const team1Players = await extractPlayers(team1Roster);
      const team2Players = await extractPlayers(team2Roster);
      
      console.log("Team 1 Players:", team1Players);
      console.log("Team 2 Players:", team2Players);
      
      console.log("Team 1 players count:", team1Players.length);
      console.log("Team 2 players count:", team2Players.length);

      const matchupResult = {
        week,
        team1: {
          key: team1?.team_key,
          name: team1?.name,
          logo: team1?.team_logos?.team_logo?.url,
          players: team1Players,
        },
        team2: {
          key: team2?.team_key,
          name: team2?.name,
          logo: team2?.team_logos?.team_logo?.url,
          players: team2Players,
        },
      };
      
      console.log("Matchup result prepared successfully");

      const { error: saveError } = await supabase
        .from("yahoo_matchups")
        .upsert({
          user_id: userId,
          league_id: leagueId,
          matchup_week: week,
          team1_key: matchupResult.team1.key,
          team1_name: matchupResult.team1.name,
          team2_key: matchupResult.team2.key,
          team2_name: matchupResult.team2.name,
          matchup_data: matchupResult,
        }, {
          onConflict: "user_id,league_id,matchup_week",
        });

      if (saveError) {
        console.error("Error saving matchup:", saveError);
      }

      return new Response(
        JSON.stringify({ matchup: matchupResult }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === "getPlayerStats") {
      const { playerKeys } = requestBody;
      
      if (!playerKeys || !Array.isArray(playerKeys)) {
        throw new Error("Player keys array is required");
      }

      const playerKeysParam = playerKeys.join(",");
      const statsData = await makeYahooRequest(
        accessToken,
        `/players;player_keys=${playerKeysParam}/stats`
      );

      const players = statsData?.fantasy_content?.players || {};
      const playerStats = Object.values(players)
        .filter((item: any) => item?.player)
        .map((item: any) => {
          const player = item.player[0];
          const stats = item.player[1]?.player_stats?.stats || [];
          
          return {
            playerKey: player.player_key,
            playerId: player.player_id,
            name: player.name?.full,
            stats: stats.map((s: any) => ({
              statId: s.stat?.stat_id,
              value: s.stat?.value,
            })),
          };
        });

      return new Response(
        JSON.stringify({ players: playerStats }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === "getAllTeamsInLeague") {
      console.log("=== Getting All Teams in League ===");
      
      if (!leagueId) {
        console.error("No league ID provided");
        throw new Error("League ID is required");
      }

      const leagueKey = `${GAME_ID}.l.${leagueId}`;
      console.log("League key:", leagueKey);
      
      console.log("Fetching all teams in league...");
      const teamsData = await makeYahooRequest(accessToken, `/league/${leagueKey}/teams`);
      
      console.log("Raw teams response:", JSON.stringify(teamsData, null, 2));
      
      const teams = teamsData?.fantasy_content?.league?.teams || [];
      console.log("Number of teams:", teams.length);
      
      const allTeams = teams.filter((item: any) => item?.team);
      console.log("Filtered teams count:", allTeams.length);
      
      const extractPlayers = async (rosterData: any) => {
        const roster = rosterData?.fantasy_content?.team?.roster;
        if (!roster) {
          console.error("No roster found in response");
          return [];
        }
      
        const players = roster.players || [];
        console.log(`Number of players: ${players.length}`);
      
        return await Promise.all(
          players
            .filter((item: any) => item?.player)
            .map(async (item: any) => {
              const player = item.player;
              const yahooId = player.player_id;
              const nbaId = await getNbaIdFromYahooId(supabase, yahooId);
              return {
                playerKey: player.player_key,
                yahooPlayerId: yahooId,
                nbaPlayerId: nbaId,
                name: player.name?.full,
                position: player.primary_position,
                selectedPosition: player.selected_position?.position,
                eligiblePositions: player.eligible_positions?.map((pos: any) => pos.position) || [],
                team: player.editorial_team_abbr,
                status: player.status || "Active",
                injuryNote: player.injury_note || null,
              };
            })
        );
      };

      const teamsWithRosters = await Promise.all(
        allTeams.map(async (item: any) => {
          const team = item.team;
          const teamKey = team.team_key;
          
          console.log(`Fetching roster for team: ${team.name} (${teamKey})`);
          const rosterData = await makeYahooRequest(
            accessToken,
            `/team/${teamKey}/roster;week=current`
          );
          
          const players = await extractPlayers(rosterData);
          
          return {
            key: team.team_key,
            name: team.name,
            logo: team.team_logos?.team_logo?.url,
            players: players,
          };
        })
      );

      console.log("Teams with rosters prepared successfully");

      return new Response(
        JSON.stringify({ teams: teamsWithRosters }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    console.error("Invalid action provided:", action);
    throw new Error(`Invalid action: ${action}`);
  } catch (error) {
    console.error("=== Error in Yahoo Fantasy API ===");
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