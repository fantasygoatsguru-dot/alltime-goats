// ─────────────────────────────────────────────────────────────────────────────
// final-day-matchup-projection – Send final day projection for current matchup
// ─────────────────────────────────────────────────────────────────────────────
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
const resendSenderEmail = Deno.env.get('RESEND_SENDER_EMAIL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const YAHOO_CLIENT_ID = Deno.env.get('YAHOO_CLIENT_ID')!;
const YAHOO_CLIENT_SECRET = Deno.env.get('YAHOO_CLIENT_SECRET')!;
const GAME_ID = "466";           
const CURRENT_SEASON = "2025-26";
import SCHEDULE_DATA from "./schedule.json" with { type: "json" };

const supabase = createClient(supabaseUrl, serviceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// ───── Email template ─────
let EMAIL_TEMPLATE: string;
try {
  EMAIL_TEMPLATE = await Deno.readTextFile('./email-template.html');
  console.log('[TEMPLATE] Loaded email template');
} catch (e) {
  console.error('[TEMPLATE] Failed to load template:', e);
  EMAIL_TEMPLATE = '<!DOCTYPE html><html><body><p>Template error</p></body></html>';
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
}

function renderTemplate(tmpl: string, data: Record<string, any>) {
  const safe = new Set(['category_breakdown']);
  return Object.entries(data).reduce((r, [k, v]) => {
    const rep = safe.has(k) ? String(v) : escapeHtml(String(v));
    return r.replaceAll(`\${${k}}`, rep);
  }, tmpl);
}

// ───── Resend helper ─────
const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: `Fantasy Goats Guru <${resendSenderEmail}>`, to: [to], subject, html }),
    });
    if (!r.ok) { console.error('Resend error:', await r.text()); return false; }
    console.log('Email sent to', to);
    return true;
  } catch (e) {
    console.error('Email error:', e);
    return false;
  }
};

// ───── Yahoo token handling ─────
async function getAccessToken(userId: string, forceRefresh = false): Promise<string> {
  const { data: t, error } = await supabase
    .from('yahoo_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', userId)
    .single();

  if (error || !t) throw new Error(`No token found for user ${userId}`);

  const isExpired = new Date(t.expires_at) <= new Date();
  
  if (!forceRefresh && !isExpired) return t.access_token;

  console.log(`[TOKEN] Refreshing token for user ${userId} (expired: ${isExpired}, force: ${forceRefresh})`);
  
  const auth = btoa(`${YAHOO_CLIENT_ID}:${YAHOO_CLIENT_SECRET}`);
  const resp = await fetch('https://api.login.yahoo.com/oauth2/get_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: t.refresh_token }),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    console.error(`[TOKEN] Refresh failed for user ${userId}: ${resp.status} - ${errorText}`);
    throw new Error(`Token refresh failed: ${resp.status} - User needs to reconnect`);
  }
  
  const fresh = await resp.json();
  const expires = new Date(Date.now() + fresh.expires_in * 1000);

  await supabase.from('yahoo_tokens').update({
    access_token: fresh.access_token,
    refresh_token: fresh.refresh_token ?? t.refresh_token,
    expires_at: expires.toISOString(),
  }).eq('user_id', userId);

  console.log(`[TOKEN] Token refreshed successfully for user ${userId}`);
  return fresh.access_token;
}

// ───── Yahoo request helper ─────
async function makeYahooRequest(
  token: string, 
  endpoint: string, 
  userId?: string,
  retryCount = 0
): Promise<any> {
  const clean = endpoint.replace(/\?format=json_f$/, '');
  const url = `https://fantasysports.yahooapis.com/fantasy/v2${clean}?format=json_f`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  
  if (r.status === 401 && userId && retryCount === 0) {
    console.log(`[YAHOO] 401 error, attempting token refresh for user ${userId}`);
    try {
      const newToken = await getAccessToken(userId, true);
      return makeYahooRequest(newToken, endpoint, userId, 1);
    } catch (refreshError) {
      throw new Error(`Yahoo 401: Invalid token - User ${userId} needs to reconnect. ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`);
    }
  }
  
  if (!r.ok) {
    const errorText = await r.text();
    throw new Error(`Yahoo ${r.status}: ${errorText}`);
  }
  
  return r.json();
}

// ───── Date helpers (EST timezone) ─────
function getEasternDateString(date: Date): string {
  const parts = date.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split(',')[0].split('/');
  return `${parts[2]}-${parts[0]}-${parts[1]}`;
}

function getTodayEST(): string {
  const now = new Date();
  return getEasternDateString(now);
}

// ───── Load NBA schedule from remote source ─────


// ───── DTOs ─────
interface YahooPlayerDTO {
  playerKey: string;
  yahooPlayerId: number;
  nbaPlayerId: number | null;
  name: string;
  position: string;
  selectedPosition: string | null;
  team: string;
  nbaTeam: string | null;
  status: string;
}

// ───── Parsing helpers ─────
async function getNbaIdAndTeam(yahooId: number): Promise<{ nbaId: number | null; nbaTeam: string | null }> {
  const { data, error } = await supabase
    .from('yahoo_nba_mapping')
    .select('nba_id, team')
    .eq('yahoo_id', yahooId)
    .single();
  if (error || !data) return { nbaId: null, nbaTeam: null };
  return { nbaId: data.nba_id, nbaTeam: data.team };
}

async function parseRoster(raw: any): Promise<YahooPlayerDTO[]> {
  const roster = raw?.fantasy_content?.team?.roster;
  if (!roster) return [];

  const players = roster.players || [];
  return Promise.all(
    players
      .filter((item: any) => item?.player)
      .map(async (item: any) => {
        const p = item.player;
        const yahooId = p.player_id;
        const { nbaId, nbaTeam } = await getNbaIdAndTeam(yahooId);
        return {
          playerKey: p.player_key,
          yahooPlayerId: yahooId,
          nbaPlayerId: nbaId,
          name: p.name?.full ?? 'Unknown',
          position: p.primary_position,
          selectedPosition: p.selected_position?.position ?? null,
          team: p.editorial_team_abbr,
          nbaTeam: nbaTeam,
          status: p.status ?? 'Active',
        };
      })
  );
}

// ───── Get current matchup ─────
async function getCurrentMatchup(userId: string, leagueId: string) {
  console.log(`[MATCHUP] user ${userId} – league ${leagueId}`);
  const token = await getAccessToken(userId);
  const leagueKey = `${GAME_ID}.l.${leagueId}`;

  // Find user's team
  const teamsResp = await makeYahooRequest(token, `/league/${leagueKey}/teams`, userId);
  const teams = teamsResp.fantasy_content.league?.teams ?? {};
  let userTeamKey = null;
  let userTeamName = null;

  for (const entry of Object.values(teams)) {
    if (entry === 'count') continue;
    const t = (entry as any).team;
    if (t.is_owned_by_current_login === 1) {
      userTeamKey = t.team_key;
      userTeamName = t.name;
      break;
    }
  }
  if (!userTeamKey) throw new Error('User team not found in league');

  console.log(`[MATCHUP] user team: ${userTeamName} (${userTeamKey})`);

  // Get the matchup for that team
  const matchupResp = await makeYahooRequest(token, `/team/${userTeamKey}/matchups;weeks=current`, userId);
  const matchup = matchupResp.fantasy_content?.team?.matchups?.[0]?.matchup;

  if (!matchup?.teams) throw new Error('No matchup data');

  const [rawA, rawB] = matchup.teams.map((t: any) => t.team);
  const team1Raw = rawA.is_owned_by_current_login === 1 ? rawA : rawB;
  const team2Raw = team1Raw === rawA ? rawB : rawA;

  // Get rosters
  const [team1Roster, team2Roster] = await Promise.all([
    makeYahooRequest(token, `/team/${team1Raw.team_key}/roster`, userId),
    makeYahooRequest(token, `/team/${team2Raw.team_key}/roster`, userId),
  ]);

  const [team1Players, team2Players] = await Promise.all([
    parseRoster(team1Roster),
    parseRoster(team2Roster),
  ]);

  // Parse matchup stats (similar to yahoo-fantasy-api)
  const statIdToName: Record<string, string> = {
    '12': 'Points',
    '15': 'Rebounds',
    '16': 'Assists',
    '17': 'Steals',
    '18': 'Blocks',
    '19': 'Turnovers',
    '10': 'Three Pointers Made',
    '9004003': 'Field Goal Percentage',
    '9007006': 'Free Throw Percentage',
  };

  const team1Stats = team1Raw.team_stats?.stats || [];
  const team2Stats = team2Raw.team_stats?.stats || [];

  const stats = {
    team1Score: 0,
    team2Score: 0,
    categories: {} as Record<string, { team1: any; team2: any; winner: string }>,
  };

  team1Stats.forEach((wrapper: any) => {
    const stat = wrapper.stat;
    const statId = stat.stat_id;
    const name = statIdToName[statId];
    if (!name) return;

    const team2Wrapper = team2Stats.find((w: any) => w.stat.stat_id === statId);

    if (statId === '9004003' || statId === '9007006') {
      // FG% or FT% → split "11/22" into nominator/denominator
      const parseFraction = (value: string) => {
        const [n, d] = value.split('/').map(Number);
        return { nominator: n || 0, denominator: d || 0 };
      };

      const team1Obj = parseFraction(stat.value);
      const team2Obj = team2Wrapper ? parseFraction(team2Wrapper.stat.value) : { nominator: 0, denominator: 0 };

      const pct1 = team1Obj.denominator === 0 ? 0 : team1Obj.nominator / team1Obj.denominator;
      const pct2 = team2Obj.denominator === 0 ? 0 : team2Obj.nominator / team2Obj.denominator;

      let winner = 'TIE';
      if (pct1 > pct2) {
        winner = team1Raw.name;
        stats.team1Score++;
      } else if (pct2 > pct1) {
        winner = team2Raw.name;
        stats.team2Score++;
      }

      stats.categories[name] = {
        team1: team1Obj,
        team2: team2Obj,
        winner,
      };
    } else {
      // All other stats (Points, Rebounds, etc.)
      const team1Value = parseFloat(stat.value) || 0;
      const team2Value = team2Wrapper ? parseFloat(team2Wrapper.stat.value) || 0 : 0;

      let winner = 'TIE';
      if (statId === '19') { // Turnovers – lower wins
        if (team1Value < team2Value) { winner = team1Raw.name; stats.team1Score++; }
        else if (team2Value < team1Value) { winner = team2Raw.name; stats.team2Score++; }
      } else {
        if (team1Value > team2Value) { winner = team1Raw.name; stats.team1Score++; }
        else if (team2Value > team1Value) { winner = team2Raw.name; stats.team2Score++; }
      }

      stats.categories[name] = {
        team1: team1Value,
        team2: team2Value,
        winner,
      };
    }
  });

  return {
    team1: { name: team1Raw.name, players: team1Players },
    team2: { name: team2Raw.name, players: team2Players },
    stats,
  };
}

// ───── Get week dates helper ─────
function getCurrentWeekDates() {
  const now = new Date();
  const easternTimeString = now.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const [datePart, timePart] = easternTimeString.split(', ');
  const [month, day, year] = datePart.split('/');
  const [hour, minute, second] = timePart.split(':');
  const easternNow = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));

  const dayOfWeek = easternNow.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weekStart = new Date(easternNow);
  weekStart.setDate(easternNow.getDate() + daysToMonday + 1); // Tuesday start
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // Monday end
  weekEnd.setHours(23, 59, 59, 999);

  const todayDateStr = getEasternDateString(now);

  return { weekStart, weekEnd, currentDate: easternNow, todayDateStr };
}

// ───── Calculate final-day projection ─────
async function calculateFinalDayProjection(matchup: any, currentStats: any) {
  console.log('[PROJ] Starting final-day projection calculation');
  const allPlayers = [...matchup.team1.players, ...matchup.team2.players];
  const yahooIds = allPlayers.map(p => p.yahooPlayerId);
  console.log(`[PROJ] Total players: ${allPlayers.length}, Yahoo IDs: ${yahooIds.join(', ')}`);

  // Get week dates
  const { todayDateStr } = getCurrentWeekDates();
  console.log(`[PROJ] Today (EST): ${todayDateStr}`);

  // Load schedule for today
  const teamsPlayingToday = SCHEDULE_DATA[todayDateStr] || [];
  console.log(`[PROJ] ${teamsPlayingToday.length} teams playing today: ${teamsPlayingToday.join(', ')}`);

  // Map Yahoo → NBA
  const { data: mappingData } = await supabase
    .from('yahoo_nba_mapping')
    .select('yahoo_id, nba_id, team')
    .in('yahoo_id', yahooIds);

  const idMap = new Map(mappingData?.map(m => [String(m.yahoo_id), m.nba_id]) || []);
  const teamMap = new Map(mappingData?.map(m => [String(m.yahoo_id), m.team]) || []);
  console.log(`[PROJ] Mapped ${idMap.size} players`);

  // Fetch averages
  const nbaIds = Array.from(idMap.values()).filter(Boolean);
  if (!nbaIds.length) {
    console.warn('[PROJ] No NBA IDs found');
    return createEmptyProjection(matchup);
  }

  const { data: averages } = await supabase
    .from('player_season_averages')
    .select('*')
    .eq('season', CURRENT_SEASON)
    .in('player_id', nbaIds);

  const avgMap = new Map(averages?.map(a => [a.player_id, a]) || []);
  console.log(`[PROJ] Loaded ${avgMap.size} averages`);

  // Use current stats from Yahoo matchup API
  console.log('[PROJ] Using current stats from Yahoo API');

  // Parse current stats from Yahoo categories
  const team1CurrentStats = {
    points: currentStats.categories['Points']?.team1 || 0,
    threePointers: currentStats.categories['Three Pointers Made']?.team1 || 0,
    rebounds: currentStats.categories['Rebounds']?.team1 || 0,
    assists: currentStats.categories['Assists']?.team1 || 0,
    steals: currentStats.categories['Steals']?.team1 || 0,
    blocks: currentStats.categories['Blocks']?.team1 || 0,
    turnovers: currentStats.categories['Turnovers']?.team1 || 0,
    fgMade: currentStats.categories['Field Goal Percentage']?.team1?.nominator || 0,
    fgAttempted: currentStats.categories['Field Goal Percentage']?.team1?.denominator || 0,
    ftMade: currentStats.categories['Free Throw Percentage']?.team1?.nominator || 0,
    ftAttempted: currentStats.categories['Free Throw Percentage']?.team1?.denominator || 0,
  };

  const team2CurrentStats = {
    points: currentStats.categories['Points']?.team2 || 0,
    threePointers: currentStats.categories['Three Pointers Made']?.team2 || 0,
    rebounds: currentStats.categories['Rebounds']?.team2 || 0,
    assists: currentStats.categories['Assists']?.team2 || 0,
    steals: currentStats.categories['Steals']?.team2 || 0,
    blocks: currentStats.categories['Blocks']?.team2 || 0,
    turnovers: currentStats.categories['Turnovers']?.team2 || 0,
    fgMade: currentStats.categories['Field Goal Percentage']?.team2?.nominator || 0,
    fgAttempted: currentStats.categories['Field Goal Percentage']?.team2?.denominator || 0,
    ftMade: currentStats.categories['Free Throw Percentage']?.team2?.nominator || 0,
    ftAttempted: currentStats.categories['Free Throw Percentage']?.team2?.denominator || 0,
  };

  let team1TodayStats = { points: 0, threePointers: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fgMade: 0, fgAttempted: 0, ftMade: 0, ftAttempted: 0 };
  let team2TodayStats = { ...team1TodayStats };

  // Process team 1 players - calculate today's projected stats
  for (const player of matchup.team1.players) {
    const yahooId = player.yahooPlayerId;
    const nbaId = idMap.get(String(yahooId));

    // Add today's projected stats if player is playing today
    if (player.status === 'INJ' || player.status === 'OUT' || player.selectedPosition === 'IL' || player.selectedPosition === 'IL+') continue;
    
    const nbaTeam = player.nbaTeam || teamMap.get(String(yahooId));
    if (!nbaTeam || !teamsPlayingToday.includes(nbaTeam)) continue;

    const avg = nbaId ? avgMap.get(nbaId) : null;
    if (!avg) continue;

    team1TodayStats.points += (avg as any).points_per_game || 0;
    team1TodayStats.threePointers += (avg as any).three_pointers_per_game || 0;
    team1TodayStats.rebounds += (avg as any).rebounds_per_game || 0;
    team1TodayStats.assists += (avg as any).assists_per_game || 0;
    team1TodayStats.steals += (avg as any).steals_per_game || 0;
    team1TodayStats.blocks += (avg as any).blocks_per_game || 0;
    team1TodayStats.turnovers += (avg as any).turnovers_per_game || 0;
    team1TodayStats.fgMade += (avg as any).field_goals_per_game || 0;
    team1TodayStats.fgAttempted += (avg as any).field_goals_attempted_per_game || 0;
    team1TodayStats.ftMade += (avg as any).free_throws_per_game || 0;
    team1TodayStats.ftAttempted += (avg as any).free_throws_attempted_per_game || 0;
  }

  // Process team 2 players - calculate today's projected stats
  for (const player of matchup.team2.players) {
    const yahooId = player.yahooPlayerId;
    const nbaId = idMap.get(String(yahooId));

    // Add today's projected stats if player is playing today
    if (player.status === 'INJ' || player.status === 'OUT' || player.selectedPosition === 'IL' || player.selectedPosition === 'IL+') continue;
    
    const nbaTeam = player.nbaTeam || teamMap.get(String(yahooId));
    if (!nbaTeam || !teamsPlayingToday.includes(nbaTeam)) continue;

    const avg = nbaId ? avgMap.get(nbaId) : null;
    if (!avg) continue;

    team2TodayStats.points += (avg as any).points_per_game || 0;
    team2TodayStats.threePointers += (avg as any).three_pointers_per_game || 0;
    team2TodayStats.rebounds += (avg as any).rebounds_per_game || 0;
    team2TodayStats.assists += (avg as any).assists_per_game || 0;
    team2TodayStats.steals += (avg as any).steals_per_game || 0;
    team2TodayStats.blocks += (avg as any).blocks_per_game || 0;
    team2TodayStats.turnovers += (avg as any).turnovers_per_game || 0;
    team2TodayStats.fgMade += (avg as any).field_goals_per_game || 0;
    team2TodayStats.fgAttempted += (avg as any).field_goals_attempted_per_game || 0;
    team2TodayStats.ftMade += (avg as any).free_throws_per_game || 0;
    team2TodayStats.ftAttempted += (avg as any).free_throws_attempted_per_game || 0;
  }

  // Calculate final totals (current + today)
  const team1FinalStats = {
    points: team1CurrentStats.points + team1TodayStats.points,
    threePointers: team1CurrentStats.threePointers + team1TodayStats.threePointers,
    rebounds: team1CurrentStats.rebounds + team1TodayStats.rebounds,
    assists: team1CurrentStats.assists + team1TodayStats.assists,
    steals: team1CurrentStats.steals + team1TodayStats.steals,
    blocks: team1CurrentStats.blocks + team1TodayStats.blocks,
    turnovers: team1CurrentStats.turnovers + team1TodayStats.turnovers,
    fgMade: team1CurrentStats.fgMade + team1TodayStats.fgMade,
    fgAttempted: team1CurrentStats.fgAttempted + team1TodayStats.fgAttempted,
    ftMade: team1CurrentStats.ftMade + team1TodayStats.ftMade,
    ftAttempted: team1CurrentStats.ftAttempted + team1TodayStats.ftAttempted,
  };

  const team2FinalStats = {
    points: team2CurrentStats.points + team2TodayStats.points,
    threePointers: team2CurrentStats.threePointers + team2TodayStats.threePointers,
    rebounds: team2CurrentStats.rebounds + team2TodayStats.rebounds,
    assists: team2CurrentStats.assists + team2TodayStats.assists,
    steals: team2CurrentStats.steals + team2TodayStats.steals,
    blocks: team2CurrentStats.blocks + team2TodayStats.blocks,
    turnovers: team2CurrentStats.turnovers + team2TodayStats.turnovers,
    fgMade: team2CurrentStats.fgMade + team2TodayStats.fgMade,
    fgAttempted: team2CurrentStats.fgAttempted + team2TodayStats.fgAttempted,
    ftMade: team2CurrentStats.ftMade + team2TodayStats.ftMade,
    ftAttempted: team2CurrentStats.ftAttempted + team2TodayStats.ftAttempted,
  };

  // Calculate winners based on final stats
  const categories = ['points', 'threePointers', 'rebounds', 'assists', 'steals', 'blocks'];
  let team1Score = 0, team2Score = 0;
  const categoryResults: Record<string, any> = {};

  for (const cat of categories) {
    const t1 = team1FinalStats[cat];
    const t2 = team2FinalStats[cat];
    if (t1 > t2) { 
      team1Score++; 
      categoryResults[cat] = { 
        current1: team1CurrentStats[cat], current2: team2CurrentStats[cat],
        today1: team1TodayStats[cat], today2: team2TodayStats[cat],
        final1: t1, final2: t2, 
        winner: matchup.team1.name 
      }; 
    } else if (t2 > t1) { 
      team2Score++; 
      categoryResults[cat] = { 
        current1: team1CurrentStats[cat], current2: team2CurrentStats[cat],
        today1: team1TodayStats[cat], today2: team2TodayStats[cat],
        final1: t1, final2: t2, 
        winner: matchup.team2.name 
      }; 
    } else { 
      categoryResults[cat] = { 
        current1: team1CurrentStats[cat], current2: team2CurrentStats[cat],
        today1: team1TodayStats[cat], today2: team2TodayStats[cat],
        final1: t1, final2: t2, 
        winner: 'Tie' 
      }; 
    }
  }

  // FG%
  const t1FgPct = team1FinalStats.fgAttempted > 0 ? (team1FinalStats.fgMade / team1FinalStats.fgAttempted) * 100 : 0;
  const t2FgPct = team2FinalStats.fgAttempted > 0 ? (team2FinalStats.fgMade / team2FinalStats.fgAttempted) * 100 : 0;
  const t1CurrentFgPct = team1CurrentStats.fgAttempted > 0 ? (team1CurrentStats.fgMade / team1CurrentStats.fgAttempted) * 100 : 0;
  const t2CurrentFgPct = team2CurrentStats.fgAttempted > 0 ? (team2CurrentStats.fgMade / team2CurrentStats.fgAttempted) * 100 : 0;
  const t1TodayFgPct = team1TodayStats.fgAttempted > 0 ? (team1TodayStats.fgMade / team1TodayStats.fgAttempted) * 100 : 0;
  const t2TodayFgPct = team2TodayStats.fgAttempted > 0 ? (team2TodayStats.fgMade / team2TodayStats.fgAttempted) * 100 : 0;
  
  if (t1FgPct > t2FgPct) team1Score++;
  else if (t2FgPct > t1FgPct) team2Score++;
  categoryResults.fieldGoalPercentage = { 
    current1: t1CurrentFgPct, current2: t2CurrentFgPct,
    today1: t1TodayFgPct, today2: t2TodayFgPct,
    final1: t1FgPct, final2: t2FgPct, 
    winner: t1FgPct > t2FgPct ? matchup.team1.name : t2FgPct > t1FgPct ? matchup.team2.name : 'Tie' 
  };

  // FT%
  const t1FtPct = team1FinalStats.ftAttempted > 0 ? (team1FinalStats.ftMade / team1FinalStats.ftAttempted) * 100 : 0;
  const t2FtPct = team2FinalStats.ftAttempted > 0 ? (team2FinalStats.ftMade / team2FinalStats.ftAttempted) * 100 : 0;
  const t1CurrentFtPct = team1CurrentStats.ftAttempted > 0 ? (team1CurrentStats.ftMade / team1CurrentStats.ftAttempted) * 100 : 0;
  const t2CurrentFtPct = team2CurrentStats.ftAttempted > 0 ? (team2CurrentStats.ftMade / team2CurrentStats.ftAttempted) * 100 : 0;
  const t1TodayFtPct = team1TodayStats.ftAttempted > 0 ? (team1TodayStats.ftMade / team1TodayStats.ftAttempted) * 100 : 0;
  const t2TodayFtPct = team2TodayStats.ftAttempted > 0 ? (team2TodayStats.ftMade / team2TodayStats.ftAttempted) * 100 : 0;
  
  if (t1FtPct > t2FtPct) team1Score++;
  else if (t2FtPct > t1FtPct) team2Score++;
  categoryResults.freeThrowPercentage = { 
    current1: t1CurrentFtPct, current2: t2CurrentFtPct,
    today1: t1TodayFtPct, today2: t2TodayFtPct,
    final1: t1FtPct, final2: t2FtPct, 
    winner: t1FtPct > t2FtPct ? matchup.team1.name : t2FtPct > t1FtPct ? matchup.team2.name : 'Tie' 
  };

  // Turnovers (lower is better)
  if (team1FinalStats.turnovers < team2FinalStats.turnovers) team1Score++;
  else if (team2FinalStats.turnovers < team1FinalStats.turnovers) team2Score++;
  categoryResults.turnovers = {
    current1: team1CurrentStats.turnovers, current2: team2CurrentStats.turnovers,
    today1: team1TodayStats.turnovers, today2: team2TodayStats.turnovers,
    final1: team1FinalStats.turnovers, final2: team2FinalStats.turnovers,
    winner: team1FinalStats.turnovers < team2FinalStats.turnovers ? matchup.team1.name : team2FinalStats.turnovers < team1FinalStats.turnovers ? matchup.team2.name : 'Tie'
  };

  console.log(`[PROJ] Final: ${matchup.team1.name} ${team1Score} – ${team2Score} ${matchup.team2.name}`);

  return {
    team1: matchup.team1.name,
    team2: matchup.team2.name,
    team1Score,
    team2Score,
    team1CurrentStats,
    team1TodayStats,
    team1FinalStats,
    team2CurrentStats,
    team2TodayStats,
    team2FinalStats,
    categoryResults,
  };
}

function createEmptyProjection(matchup: any) {
  const emptyStats = { points: 0, threePointers: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fgMade: 0, fgAttempted: 0, ftMade: 0, ftAttempted: 0 };
  return {
    team1: matchup.team1.name,
    team2: matchup.team2.name,
    team1Score: 0,
    team2Score: 0,
    team1CurrentStats: { ...emptyStats },
    team1TodayStats: { ...emptyStats },
    team1FinalStats: { ...emptyStats },
    team2CurrentStats: { ...emptyStats },
    team2TodayStats: { ...emptyStats },
    team2FinalStats: { ...emptyStats },
    categoryResults: {},
  };
}

// Generate email HTML with Current, Today, and Final columns
function generateEmailHTML(userName: string, projection: any): string {
  const getWinnerDisplay = (winner: string | undefined, team1: string, team2: string): string => {
    if (!winner || winner === 'Tie') return 'Tie';
    if (winner === team1) return team1;
    if (winner === team2) return team2;
    return winner;
  };

  const getWinnerColor = (winner: string | undefined, team1: string, team2: string): string => {
    if (!winner || winner === 'Tie') return '#b0bec5';
    if (winner === team1) return '#4CAF50';
    if (winner === team2) return '#ff6f61';
    return '#b0bec5';
  };

  const buildCategoryRow = (catName: string, cat: any, isPercentage = false, lowerIsBetter = false) => {
    const suffix = isPercentage ? '%' : '';
    const current1 = (cat.current1 || 0).toFixed(1) + suffix;
    const current2 = (cat.current2 || 0).toFixed(1) + suffix;
    const today1 = (cat.today1 || 0).toFixed(1) + suffix;
    const today2 = (cat.today2 || 0).toFixed(1) + suffix;
    const final1 = (cat.final1 || 0).toFixed(1) + suffix;
    const final2 = (cat.final2 || 0).toFixed(1) + suffix;
    
    const winner = cat.winner;
    const winnerColor = getWinnerColor(winner, projection.team1, projection.team2);
    const winnerDisplay = getWinnerDisplay(winner, projection.team1, projection.team2);

    // Only color the winner's final stat - others stay default gray
    const final1Color = winner === projection.team1 ? '#4CAF50' : '#e0e0e0';
    const final2Color = winner === projection.team2 ? '#ff6f61' : '#e0e0e0';

    return `
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: left; color: #e0e0e0; font-weight: bold;">${catName}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: #e0e0e0;">${current1}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: #e0e0e0;">${current2}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: #e0e0e0;">${today1}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: #e0e0e0;">${today2}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${final1Color}; font-weight: bold;">${final1}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${final2Color}; font-weight: bold;">${final2}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${winnerColor}; font-weight: bold;">${winnerDisplay}</td>
    </tr>`;
  };

  const categoryBreakdown = `
    ${buildCategoryRow('Points', projection.categoryResults.points)}
    ${buildCategoryRow('3-Pointers', projection.categoryResults.threePointers)}
    ${buildCategoryRow('Rebounds', projection.categoryResults.rebounds)}
    ${buildCategoryRow('Assists', projection.categoryResults.assists)}
    ${buildCategoryRow('Steals', projection.categoryResults.steals)}
    ${buildCategoryRow('Blocks', projection.categoryResults.blocks)}
    ${buildCategoryRow('FG%', projection.categoryResults.fieldGoalPercentage, true)}
    ${buildCategoryRow('FT%', projection.categoryResults.freeThrowPercentage, true)}
    ${buildCategoryRow('Turnovers', projection.categoryResults.turnovers, false, true)}
  `;

  return renderTemplate(EMAIL_TEMPLATE, {
    user_name: userName,
    team1_name: projection.team1,
    team2_name: projection.team2,
    team1_score: projection.team1Score,
    team2_score: projection.team2Score,
    category_breakdown: categoryBreakdown,
  });
}

// ───── Main handler ─────
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    console.log('=== Final Day Matchup Projection ===');
    
    // Fetch users with send_weekly_projections enabled and non-yahoo emails
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('user_id, name, email')
      .eq('send_weekly_projections', true)
      .not('email', 'ilike', '%yahoo%');
  
    if (error) { 
      console.error('Error fetching profiles:', error); 
      return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 }); 
    }
    
    if (!profiles?.length) {
      return new Response(JSON.stringify({ message: 'No users with send_weekly_projections enabled' }), { headers: corsHeaders });
    }

    console.log(`[INFO] Found ${profiles.length} users with projections enabled`);

    // Rate limiting: max 2 emails per second
    const emailTimestamps: number[] = [];
    const RATE_LIMIT_EMAILS_PER_SECOND = 2;
    
    const waitForRateLimit = async () => {
      const now = Date.now();
      const oneSecondAgo = now - 1000;
      
      while (emailTimestamps.length > 0 && emailTimestamps[0] < oneSecondAgo) {
        emailTimestamps.shift();
      }
      
      if (emailTimestamps.length >= RATE_LIMIT_EMAILS_PER_SECOND) {
        const oldestTimestamp = emailTimestamps[0];
        const waitTime = 1000 - (now - oldestTimestamp) + 50;
        if (waitTime > 0) {
          console.log(`[RATE LIMIT] Waiting ${waitTime}ms`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          const afterWait = Date.now();
          while (emailTimestamps.length > 0 && emailTimestamps[0] < afterWait - 1000) {
            emailTimestamps.shift();
          }
        }
      }
    };

    let ok = 0, fail = 0;
    for (const p of profiles) {
      try {
        console.log(`Processing ${p.user_id} (${p.email})`);

        // Verify Yahoo connection
        const { data: tok } = await supabase.from('yahoo_tokens').select('user_id').eq('user_id', p.user_id).single();
        if (!tok) { console.log('No token'); continue; }

        // Get first league
        const token = await getAccessToken(p.user_id);
        const leaguesResp = await makeYahooRequest(token, `/users;use_login=1/games;game_keys=nba/leagues`, p.user_id);
        
        const user = leaguesResp?.fantasy_content?.users?.[0]?.user;
        if (!user) { console.log('No user found'); continue; }
        
        const game = user.games?.[0]?.game;
        if (!game) { console.log('No game found'); continue; }
        
        const leagues = game.leagues;
        if (!leagues || leagues.length === 0) { console.log('No leagues'); continue; }

        const leagueId = leagues[0].league.league_key.split('.l.')[1];

        // Get current matchup with stats from Yahoo API
        const matchup = await getCurrentMatchup(p.user_id, leagueId);
        
        // Extract current stats from matchup
        const currentStats = matchup.stats || { categories: {} };
        
        const projection = await calculateFinalDayProjection(matchup, currentStats);
        const html = generateEmailHTML(p.name ?? 'Manager', projection);
        
        await waitForRateLimit();
        
        const sent = await sendEmail(p.email, `🔥 Final Day: ${projection.team1} vs ${projection.team2}`, html);
        
        emailTimestamps.push(Date.now());
        
        sent ? ok++ : fail++;
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error(`[ERROR] User ${p.user_id} (${p.email || 'no email'}): ${errorMessage}`);
        fail++;
      }
    }

    console.log(`=== Done: ${ok} sent, ${fail} failed ===`);
    return new Response(JSON.stringify({ success: true, sent: ok, failed: fail }), { headers: corsHeaders });
  } catch (e) {
    console.error('Fatal:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'unknown' }), { headers: corsHeaders, status: 500 });
  }
});
