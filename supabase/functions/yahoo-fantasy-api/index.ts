import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const GAME_ID = "466"; // NBA 2025-26 season

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ──────────────────────────────────────────────────────────────
// DTO INTERFACES (Typed responses from Yahoo)
// ──────────────────────────────────────────────────────────────

interface YahooLeagueDTO {
  leagueKey: string;
  leagueId: string;
  name: string;
  season: string;
  gameId: string;
}

interface YahooPlayerDTO {
  playerKey: string;
  yahooPlayerId: number;
  nbaPlayerId: number | null;
  name: string;
  position: string;
  selectedPosition: string | null;
  eligiblePositions: string[];
  team: string;
  status: string;
  injuryNote: string | null;
}

interface YahooTeamDTO {
  key: string;
  name: string;
  logo: string | null;
  players: YahooPlayerDTO[];
  is_owned_by_current_login?: boolean; // Added in response
}

interface YahooMatchupDTO {
  week: string;
  team1: YahooTeamDTO & { is_owned_by_current_login: true };
  team2: YahooTeamDTO & { is_owned_by_current_login: false };
}

interface YahooPlayerStatDTO {
  statId: string;
  value: string;
}

interface YahooPlayerWithStatsDTO {
  playerKey: string;
  playerId: number;
  name: string;
  stats: YahooPlayerStatDTO[];
}

// ──────────────────────────────────────────────────────────────
// Helper Functions
// ──────────────────────────────────────────────────────────────

async function getAccessToken(userId: string): Promise<string> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  const { data: tokenData, error } = await supabase
    .from("yahoo_tokens")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !tokenData) throw new Error("No valid token found");
  if (new Date(tokenData.expires_at) < new Date()) throw new Error("Token expired, please refresh");

  return tokenData.access_token;
}

async function getNbaIdFromYahooId(supabase: any, yahooId: number): Promise<number | null> {
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

async function makeYahooRequest(accessToken: string, endpoint: string): Promise<any> {
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

// ──────────────────────────────────────────────────────────────
// Parsing Functions (Typed)
// ──────────────────────────────────────────────────────────────

function parseLeagues(raw: any): YahooLeagueDTO[] {
  const leagues = raw?.fantasy_content?.users?.[0]?.user?.games?.[0]?.game?.leagues || [];
  return leagues
    .filter((item: any) => item?.league && typeof item.league === 'object')
    .map((item: any): YahooLeagueDTO => {
      const l = item.league;
      return {
        leagueKey: l.league_key,
        leagueId: l.league_id,
        name: l.name,
        season: l.season,
        gameId: l.game_id,
      };
    });
}

async function parseRoster(supabase: any, rosterData: any): Promise<YahooPlayerDTO[]> {
  const roster = rosterData?.fantasy_content?.team?.roster;
  if (!roster) return [];

  const players = roster.players || [];
  return await Promise.all(
    players
      .filter((item: any) => item?.player)
      .map(async (item: any): Promise<YahooPlayerDTO> => {
        const p = item.player;
        const yahooId = p.player_id;
        const nbaId = await getNbaIdFromYahooId(supabase, yahooId);
        return {
          playerKey: p.player_key,
          yahooPlayerId: yahooId,
          nbaPlayerId: nbaId,
          name: p.name?.full || "Unknown",
          position: p.primary_position,
          selectedPosition: p.selected_position?.position || null,
          eligiblePositions: p.eligible_positions?.map((pos: any) => pos.position) || [],
          team: p.editorial_team_abbr,
          status: p.status || "Active",
          injuryNote: p.injury_note || null,
        };
      })
  );
}

function parsePlayerStats(raw: any): YahooPlayerWithStatsDTO[] {
  const players = raw?.fantasy_content?.players || {};
  return Object.values(players)
    .filter((item: any): item is any => item?.player)
    .map((item: any): YahooPlayerWithStatsDTO => {
      const [info, statsObj] = item.player;
      const stats = statsObj?.player_stats?.stats || [];
      return {
        playerKey: info.player_key,
        playerId: info.player_id,
        name: info.name?.full || "Unknown",
        stats: stats.map((s: any) => ({
          statId: s.stat.stat_id,
          value: s.stat.value,
        })),
      };
    });
}

// ──────────────────────────────────────────────────────────────
// Main Handler
// ──────────────────────────────────────────────────────────────

serve(async (req) => {
  console.log("=== Yahoo Fantasy API Request ===");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { action, userId, leagueId, week } = await req.json();

    if (!userId) throw new Error("User ID is required");

    const accessToken = await getAccessToken(userId);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // ──────────────────────────────────────────────────────────
    // 1. Get User Leagues
    // ──────────────────────────────────────────────────────────
    if (action === "getUserLeagues") {
      const raw = await makeYahooRequest(accessToken, `/users;use_login=1/games;game_keys=nba/leagues`);
      const leagues = parseLeagues(raw);

      return new Response(
        JSON.stringify({ leagues }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // ──────────────────────────────────────────────────────────
    // 2. Get Current Matchup (team1 = user's team)
    // ──────────────────────────────────────────────────────────
    if (action === "getCurrentMatchup") {
      if (!leagueId) throw new Error("League ID is required");

      const leagueKey = `${GAME_ID}.l.${leagueId}`;
      const teamsData = await makeYahooRequest(accessToken, `/league/${leagueKey}/teams`);
      const allTeams = (teamsData?.fantasy_content?.league?.teams || [])
        .filter((t: any) => t?.team);

      const userTeamEntry = allTeams.find((t: any) => t.team.is_owned_by_current_login === 1);
      if (!userTeamEntry) throw new Error("Could not find your team in this league");

      const userTeamKey = userTeamEntry.team.team_key;
      const matchupData = await makeYahooRequest(accessToken, `/team/${userTeamKey}/matchups;weeks=current`);
      const currentMatchup = matchupData?.fantasy_content?.team?.matchups?.[0]?.matchup;
      if (!currentMatchup) throw new Error("No current matchup found");

      const matchupTeams = currentMatchup.teams || [];
      if (matchupTeams.length < 2) throw new Error("Incomplete matchup data");

      const [rawA, rawB] = matchupTeams.map((t: any) => t.team);
      const team1Raw = rawA.is_owned_by_current_login === 1 ? rawA : rawB;
      const team2Raw = team1Raw === rawA ? rawB : rawA;

      if (team1Raw.is_owned_by_current_login !== 1) {
        throw new Error("Could not determine your team in matchup");
      }

      const team1Roster = await makeYahooRequest(accessToken, `/team/${team1Raw.team_key}/roster;week=current`);
      const team2Roster = await makeYahooRequest(accessToken, `/team/${team2Raw.team_key}/roster;week=current`);

      const [team1Players, team2Players] = await Promise.all([
        parseRoster(supabase, team1Roster),
        parseRoster(supabase, team2Roster),
      ]);

      const team1: YahooTeamDTO & { is_owned_by_current_login: true } = {
        key: team1Raw.team_key,
        name: team1Raw.name,
        logo: team1Raw.team_logos?.team_logo?.url || null,
        players: team1Players,
        is_owned_by_current_login: true,
      };

      const team2: YahooTeamDTO & { is_owned_by_current_login: false } = {
        key: team2Raw.team_key,
        name: team2Raw.name,
        logo: team2Raw.team_logos?.team_logo?.url || null,
        players: team2Players,
        is_owned_by_current_login: false,
      };

      const matchup: YahooMatchupDTO = { week, team1, team2 };

      // Save to Supabase
      await supabase.from("yahoo_matchups").upsert({
        user_id: userId,
        league_id: leagueId,
        matchup_week: week,
        team1_key: team1.key,
        team1_name: team1.name,
        team2_key: team2.key,
        team2_name: team2.name,
        matchup_data: matchup,
      }, { onConflict: "user_id,league_id,matchup_week" });

      return new Response(
        JSON.stringify({ matchup }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // ──────────────────────────────────────────────────────────
    // 3. Get Player Stats
    // ──────────────────────────────────────────────────────────
    if (action === "getPlayerStats") {
      const { playerKeys } = await req.json();
      if (!Array.isArray(playerKeys)) throw new Error("playerKeys array required");

      const statsData = await makeYahooRequest(accessToken, `/players;player_keys=${playerKeys.join(",")}/stats`);
      const players = parsePlayerStats(statsData);

      return new Response(
        JSON.stringify({ players }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }
      // ──────────────────────────────────────────────────────────
    // 4. Get All Teams in League (User's team first)
    // ──────────────────────────────────────────────────────────
    if (action === "getAllTeamsInLeague") {
      if (!leagueId) throw new Error("League ID is required");

      const leagueKey = `${GAME_ID}.l.${leagueId}`;
      const teamsData = await makeYahooRequest(accessToken, `/league/${leagueKey}/teams`);
      const allTeamsRaw = (teamsData?.fantasy_content?.league?.teams || [])
        .filter((t: any) => t?.team);

      // Separate user's team and others
      const userTeamIndex = allTeamsRaw.findIndex((t: any) => t.team.is_owned_by_current_login === 1);
      const userTeam = userTeamIndex !== -1 ? allTeamsRaw.splice(userTeamIndex, 1)[0] : null;

      // Fetch rosters in parallel
      const teamsWithRosters = await Promise.all(
        allTeamsRaw.map(async (item: any): Promise<YahooTeamDTO> => {
          const team = item.team;
          const rosterData = await makeYahooRequest(accessToken, `/team/${team.team_key}/roster;week=current`);
          const players = await parseRoster(supabase, rosterData);

          return {
            key: team.team_key,
            name: team.name,
            logo: team.team_logos?.team_logo?.url || null,
            players,
            is_owned_by_current_login: team.is_owned_by_current_login === 1,
          };
        })
      );

      // Build final list: user's team first, then others
      const teams: YahooTeamDTO[] = [];

      if (userTeam) {
        const userRosterData = await makeYahooRequest(accessToken, `/team/${userTeam.team.team_key}/roster;week=current`);
        const userPlayers = await parseRoster(supabase, userRosterData);
        teams.push({
          key: userTeam.team.team_key,
          name: userTeam.team.name,
          logo: userTeam.team.team_logos?.team_logo?.url || null,
          players: userPlayers,
          is_owned_by_current_login: true,
        });
      }

      // Append other teams
      teams.push(...teamsWithRosters);

      return new Response(
        JSON.stringify({ teams }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    throw new Error(`Invalid action: ${action}`);
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});