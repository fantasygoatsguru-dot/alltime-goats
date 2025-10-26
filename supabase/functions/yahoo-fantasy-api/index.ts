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

async function makeYahooRequest(accessToken: string, endpoint: string) {
  const response = await fetch(`https://fantasysports.yahooapis.com/fantasy/v2${endpoint}?format=json`, {
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
      
      const leagues = data?.fantasy_content?.users?.[0]?.user?.[1]?.games?.[0]?.game?.[1]?.leagues || [];
      console.log("Leagues found:", Object.keys(leagues).length);
      
      const leagueList = Object.values(leagues)
        .filter((item: any) => item?.league)
        .map((item: any) => {
          const league = item.league[0];
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
      
      const teams = userTeamsData?.fantasy_content?.league?.[1]?.teams || {};
      console.log("Teams object keys:", Object.keys(teams));
      console.log("Number of teams:", Object.keys(teams).length);
      
      const allTeams = Object.values(teams)
        .filter((item: any) => item?.team);
      
      console.log("Filtered teams count:", allTeams.length);
      
      // Log each team's ownership status
      allTeams.forEach((item: any, index: number) => {
        const team = item.team[0];
        console.log(`Team ${index + 1}:`, {
          name: team.name,
          teamKey: team.team_key,
          isOwnedByCurrentLogin: team.is_owned_by_current_login,
          owners: team.managers || "No managers info"
        });
      });
      
      const userTeam = allTeams.find((item: any) => item.team[0].is_owned_by_current_login === 1);

      if (!userTeam) {
        console.error("Could not find team owned by current user");
        console.error("Looking for is_owned_by_current_login === 1");
        console.error("All teams ownership status:", allTeams.map((item: any) => ({
          name: item.team[0].name,
          isOwned: item.team[0].is_owned_by_current_login
        })));
        throw new Error("Could not find your team in this league");
      }

      const userTeamKey = userTeam.team[0].team_key;
      console.log("Found user team:", userTeam.team[0].name);
      console.log("User team key:", userTeamKey);
      
      console.log("Fetching matchup data...");
      const matchupData = await makeYahooRequest(
        accessToken, 
        `/team/${userTeamKey}/matchups;weeks=current?format=json_f`
      );

      console.log("Raw matchup response:", JSON.stringify(matchupData, null, 2));

      const matchups = matchupData?.fantasy_content?.team?.[1]?.matchups || {};
      console.log("Matchups object keys:", Object.keys(matchups));
      
      const currentMatchup = Object.values(matchups)
        .filter((item: any) => item?.matchup)
        .map((item: any) => item.matchup)[0];

      if (!currentMatchup) {
        console.error("No current matchup found in response");
        throw new Error("No current matchup found");
      }

      const week = currentMatchup[0]?.week;
      console.log("Current week:", week);
      
      const matchupTeams = currentMatchup[0]?.teams || {};
      console.log("Matchup teams:", Object.keys(matchupTeams));
      
      const team1 = matchupTeams[0]?.team;
      const team2 = matchupTeams[1]?.team;
      
      console.log("Team 1:", team1?.[0]?.name);
      console.log("Team 2:", team2?.[0]?.name);

      console.log("Fetching team 1 roster...");
      const team1Roster = await makeYahooRequest(
        accessToken,
        `/team/${team1[0].team_key}/roster;week=${week}`
      );
      console.log("Team 1 roster fetched");

      console.log("Fetching team 2 roster...");
      const team2Roster = await makeYahooRequest(
        accessToken,
        `/team/${team2[0].team_key}/roster;week=${week}`
      );
      console.log("Team 2 roster fetched");

      const extractPlayers = (rosterData: any) => {
        const roster = rosterData?.fantasy_content?.team?.[1]?.roster;
        if (!roster) return [];
        
        const players = roster[0]?.players || {};
        return Object.values(players)
          .filter((item: any) => item?.player)
          .map((item: any) => {
            const player = item.player[0];
            const stats = item.player[1]?.player_stats?.stats || [];
            
            return {
              playerKey: player.player_key,
              playerId: player.player_id,
              name: player.name?.full,
              position: player.primary_position,
              eligiblePositions: player.eligible_positions,
              team: player.editorial_team_abbr,
              stats: stats.map((s: any) => ({
                statId: s.stat?.stat_id,
                value: s.stat?.value,
              })),
            };
          });
      };

      const team1Players = extractPlayers(team1Roster);
      const team2Players = extractPlayers(team2Roster);
      
      console.log("Team 1 players count:", team1Players.length);
      console.log("Team 2 players count:", team2Players.length);

      const matchupResult = {
        week,
        team1: {
          key: team1[0].team_key,
          name: team1[0].name,
          logo: team1[0].team_logos?.[0]?.team_logo?.url,
          players: team1Players,
        },
        team2: {
          key: team2[0].team_key,
          name: team2[0].name,
          logo: team2[0].team_logos?.[0]?.team_logo?.url,
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
      const { playerKeys } = await req.json();
      
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

