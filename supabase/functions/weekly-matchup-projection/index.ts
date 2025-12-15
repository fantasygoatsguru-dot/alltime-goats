// ─────────────────────────────────────────────────────────────────────────────
// weekly-matchup-projection – rewritten to mirror the working handler
// ─────────────────────────────────────────────────────────────────────────────
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import SCHEDULE_DATA from "./schedule.json" with { type: "json" };

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
const resendSenderEmail = Deno.env.get('RESEND_SENDER_EMAIL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const YAHOO_CLIENT_ID = Deno.env.get('YAHOO_CLIENT_ID')!;
const YAHOO_CLIENT_SECRET = Deno.env.get('YAHOO_CLIENT_SECRET')!;
const GAME_ID = "466";           
const CURRENT_SEASON = "2025-26";

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
  const safe = new Set(['category_breakdown', 'daily_breakdown']);
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

// ───── Yahoo request helper (adds json_f, handles 401 with retry) ─────
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
  // parts = [MM, DD, YYYY]
  return `${parts[2]}-${parts[0]}-${parts[1]}`;
}

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

// ───── DTOs (exactly like the working file) ─────
interface YahooTeamDTO {
  key: string;
  name: string;
  logo: string | null;
  players: YahooPlayerDTO[];
  is_owned_by_current_login?: boolean;
}
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
interface YahooMatchupDTO {
  team1: YahooTeamDTO & { is_owned_by_current_login: true };
  team2: YahooTeamDTO & { is_owned_by_current_login: false };
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
  const roster = raw?.fantasy_content?.team?.roster;  // FIXED: removed .players
  if (!roster) return [];

  const players = roster.players || [];  // FIXED: access players here
  console.log(`[ROSTER] players: ${JSON.stringify(players)}`);
  return Promise.all(
    players
      .filter((item: any) => item?.player)  // FIXED: filter items
      .map(async (item: any) => {  // FIXED: map items
        const p = item.player;  // FIXED: access player from item
        const yahooId = p.player_id;
        const { nbaId, nbaTeam } = await getNbaIdAndTeam(yahooId);
        return {
          playerKey: p.player_key,
          yahooPlayerId: yahooId,
          nbaPlayerId: nbaId,
          name: p.name?.full ?? 'Unknown',
          position: p.primary_position,
          selectedPosition: p.selected_position?.position ?? null,  // FIXED: from item
          team: p.editorial_team_abbr,
          nbaTeam: nbaTeam,
          status: p.status ?? 'Active',
        };
      })
  );
}

// ───── NEW getCurrentMatchup (mirrors working code) ─────
async function getCurrentMatchup(userId: string, leagueId: string) {
  console.log(`[MATCHUP] user ${userId} – league ${leagueId}`);
  const token = await getAccessToken(userId);
  const leagueKey = `${GAME_ID}.l.${leagueId}`;


  // 2. Find user's team (teams endpoint has the flag)
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

  // 3. Get the matchup for that team
  const matchupResp = await makeYahooRequest(token, `/team/${userTeamKey}/matchups;weeks=current`, userId);  // FIXED: use "current"
  const matchup = matchupResp.fantasy_content?.team?.matchups?.[0]?.matchup;
  console.log(`[MATCHUP] matchup: ${JSON.stringify(matchup?.teams)}`);

  if (!matchup?.teams) throw new Error('No matchup data');

  const [rawA, rawB] = matchup.teams.map((t: any) => t.team);
  const team1Raw = rawA.is_owned_by_current_login === 1 ? rawA : rawB;
  const team2Raw = team1Raw === rawA ? rawB : rawA;
  console.log(`[MATCHUP] team1Raw: ${JSON.stringify(team1Raw)}`);
  console.log(`[MATCHUP] team2Raw: ${JSON.stringify(team2Raw)}`);

  // 4. Rosters
  const [team1Roster, team2Roster] = await Promise.all([
    makeYahooRequest(token, `/team/${team1Raw.team_key}/roster`, userId),  // FIXED: use "current"
    makeYahooRequest(token, `/team/${team2Raw.team_key}/roster`, userId),  // FIXED: use "current"
  ]);
  console.log(`[MATCHUP] team1Roster: ${JSON.stringify(team1Roster)}`);
  console.log(`[MATCHUP] team2Roster: ${JSON.stringify(team2Roster)}`);

  const [team1Players, team2Players] = await Promise.all([
    parseRoster(team1Roster),
    parseRoster(team2Roster),
  ]);

  return {
    team1: { name: team1Raw.name, players: team1Players },
    team2: { name: team2Raw.name, players: team2Players },
  };
}

// ───── Day-by-day projection calculation ─────
async function calculateDayByDayProjection(matchup: any) {
  console.log('[PROJ] Starting day-by-day projection calculation');
  const allPlayers = [...matchup.team1.players, ...matchup.team2.players];
  const yahooIds = allPlayers.map(p => p.yahooPlayerId);
  console.log(`[PROJ] Total players: ${allPlayers.length}, Yahoo IDs: ${yahooIds.join(', ')}`);

  // Get week dates
  const { weekStart, todayDateStr } = getCurrentWeekDates();
  console.log(`[PROJ] Week start: ${getEasternDateString(weekStart)}, Today: ${todayDateStr}`);

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
    return createEmptyDayByDayProjection(matchup, weekStart);
  }

  const { data: averages } = await supabase
    .from('player_period_averages')
    .select('*')
    .eq('season', CURRENT_SEASON)
    .eq('period_type', 'season')
    .in('player_id', nbaIds);

  const avgMap = new Map(averages?.map(a => [a.player_id, a]) || []);
  console.log(`[PROJ] Loaded ${avgMap.size} averages`);

  // Calculate day-by-day
  const dailyProjections: any[] = [];
  let team1TotalStats = { points: 0, threePointers: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fgMade: 0, fgAttempted: 0, ftMade: 0, ftAttempted: 0 };
  let team2TotalStats = { ...team1TotalStats };

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + i);
    const dateStr = getEasternDateString(dayDate);
    const isPast = dateStr < todayDateStr;
    const teamsPlaying = SCHEDULE_DATA[dateStr] || [];

    console.log(`[PROJ] ${dateStr}: ${teamsPlaying.length} teams playing`);

    let team1DayStats = { points: 0, threePointers: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fgMade: 0, fgAttempted: 0, ftMade: 0, ftAttempted: 0 };
    let team2DayStats = { ...team1DayStats };

    // Process team 1 players
    for (const player of matchup.team1.players) {
      if (player.status === 'INJ' || player.status === 'OUT' || player.selectedPosition === 'IL' || player.selectedPosition === 'IL+') continue;
      
      const nbaTeam = player.nbaTeam || teamMap.get(String(player.yahooPlayerId));
      if (!nbaTeam || !teamsPlaying.includes(nbaTeam)) continue;

      const nbaId = idMap.get(String(player.yahooPlayerId));
      const avg = nbaId ? avgMap.get(nbaId) : null;
      if (!avg) continue;

      team1DayStats.points += (avg as any).points_per_game || 0;
      team1DayStats.threePointers += (avg as any).three_pointers_per_game || 0;
      team1DayStats.rebounds += (avg as any).rebounds_per_game || 0;
      team1DayStats.assists += (avg as any).assists_per_game || 0;
      team1DayStats.steals += (avg as any).steals_per_game || 0;
      team1DayStats.blocks += (avg as any).blocks_per_game || 0;
      team1DayStats.turnovers += (avg as any).turnovers_per_game || 0;
      team1DayStats.fgMade += (avg as any).field_goals_per_game || 0;
      team1DayStats.fgAttempted += (avg as any).field_goals_attempted_per_game || 0;
      team1DayStats.ftMade += (avg as any).free_throws_per_game || 0;
      team1DayStats.ftAttempted += (avg as any).free_throws_attempted_per_game || 0;
    }

    // Process team 2 players
    for (const player of matchup.team2.players) {
      if (player.status === 'INJ' || player.status === 'OUT' || player.selectedPosition === 'IL' || player.selectedPosition === 'IL+') continue;
      
      const nbaTeam = player.nbaTeam || teamMap.get(String(player.yahooPlayerId));
      if (!nbaTeam || !teamsPlaying.includes(nbaTeam)) continue;

      const nbaId = idMap.get(String(player.yahooPlayerId));
      const avg = nbaId ? avgMap.get(nbaId) : null;
      if (!avg) continue;

      team2DayStats.points += (avg as any).points_per_game || 0;
      team2DayStats.threePointers += (avg as any).three_pointers_per_game || 0;
      team2DayStats.rebounds += (avg as any).rebounds_per_game || 0;
      team2DayStats.assists += (avg as any).assists_per_game || 0;
      team2DayStats.steals += (avg as any).steals_per_game || 0;
      team2DayStats.blocks += (avg as any).blocks_per_game || 0;
      team2DayStats.turnovers += (avg as any).turnovers_per_game || 0;
      team2DayStats.fgMade += (avg as any).field_goals_per_game || 0;
      team2DayStats.fgAttempted += (avg as any).field_goals_attempted_per_game || 0;
      team2DayStats.ftMade += (avg as any).free_throws_per_game || 0;
      team2DayStats.ftAttempted += (avg as any).free_throws_attempted_per_game || 0;
    }

    // Add to totals
    Object.keys(team1TotalStats).forEach(key => {
      team1TotalStats[key] += team1DayStats[key];
      team2TotalStats[key] += team2DayStats[key];
    });

    dailyProjections.push({
      date: dateStr,
      isPast,
      team1: team1DayStats,
      team2: team2DayStats
    });
  }

  // Calculate winners
  const categories = ['points', 'threePointers', 'rebounds', 'assists', 'steals', 'blocks'];
  let team1Score = 0, team2Score = 0;
  const categoryResults: Record<string, any> = {};

  for (const cat of categories) {
    const t1 = team1TotalStats[cat];
    const t2 = team2TotalStats[cat];
    if (t1 > t2) { team1Score++; categoryResults[cat] = { team1: t1, team2: t2, winner: matchup.team1.name }; }
    else if (t2 > t1) { team2Score++; categoryResults[cat] = { team1: t1, team2: t2, winner: matchup.team2.name }; }
    else { categoryResults[cat] = { team1: t1, team2: t2, winner: 'Tie' }; }
  }

  // FG%
  const t1FgPct = team1TotalStats.fgAttempted > 0 ? (team1TotalStats.fgMade / team1TotalStats.fgAttempted) * 100 : 0;
  const t2FgPct = team2TotalStats.fgAttempted > 0 ? (team2TotalStats.fgMade / team2TotalStats.fgAttempted) * 100 : 0;
  if (t1FgPct > t2FgPct) team1Score++;
  else if (t2FgPct > t1FgPct) team2Score++;
  categoryResults.fieldGoalPercentage = { team1: t1FgPct, team2: t2FgPct, winner: t1FgPct > t2FgPct ? matchup.team1.name : t2FgPct > t1FgPct ? matchup.team2.name : 'Tie' };

  // FT%
  const t1FtPct = team1TotalStats.ftAttempted > 0 ? (team1TotalStats.ftMade / team1TotalStats.ftAttempted) * 100 : 0;
  const t2FtPct = team2TotalStats.ftAttempted > 0 ? (team2TotalStats.ftMade / team2TotalStats.ftAttempted) * 100 : 0;
  if (t1FtPct > t2FtPct) team1Score++;
  else if (t2FtPct > t1FtPct) team2Score++;
  categoryResults.freeThrowPercentage = { team1: t1FtPct, team2: t2FtPct, winner: t1FtPct > t2FtPct ? matchup.team1.name : t2FtPct > t1FtPct ? matchup.team2.name : 'Tie' };

  // Turnovers (lower is better)
  if (team1TotalStats.turnovers < team2TotalStats.turnovers) team1Score++;
  else if (team2TotalStats.turnovers < team1TotalStats.turnovers) team2Score++;
  categoryResults.turnovers = {
    team1: team1TotalStats.turnovers,
    team2: team2TotalStats.turnovers,
    winner: team1TotalStats.turnovers < team2TotalStats.turnovers ? matchup.team1.name : team2TotalStats.turnovers < team1TotalStats.turnovers ? matchup.team2.name : 'Tie'
  };

  console.log(`[PROJ] Final: ${matchup.team1.name} ${team1Score} – ${team2Score} ${matchup.team2.name}`);

  return {
    team1: matchup.team1.name,
    team2: matchup.team2.name,
    team1Score,
    team2Score,
    team1TotalStats,
    team2TotalStats,
    categoryResults,
    dailyProjections
  };
}

function createEmptyDayByDayProjection(matchup: any, weekStart: Date) {
  const dailyProjections: any[] = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + i);
    dailyProjections.push({
      date: getEasternDateString(dayDate),
      isPast: false,
      team1: { points: 0, threePointers: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fgMade: 0, fgAttempted: 0, ftMade: 0, ftAttempted: 0 },
      team2: { points: 0, threePointers: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fgMade: 0, fgAttempted: 0, ftMade: 0, ftAttempted: 0 }
    });
  }
  return {
    team1: matchup.team1.name,
    team2: matchup.team2.name,
    team1Score: 0,
    team2Score: 0,
    team1TotalStats: { points: 0, threePointers: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fgMade: 0, fgAttempted: 0, ftMade: 0, ftAttempted: 0 },
    team2TotalStats: { points: 0, threePointers: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fgMade: 0, fgAttempted: 0, ftMade: 0, ftAttempted: 0 },
    categoryResults: {},
    dailyProjections
  };
}

// Generate email HTML with day-by-day breakdown
function generateEmailHTML(userName: string, projection: any): string {
  // Category breakdown for totals
  const t1FgPct = projection.team1TotalStats.fgAttempted > 0 ? (projection.team1TotalStats.fgMade / projection.team1TotalStats.fgAttempted) * 100 : 0;
  const t2FgPct = projection.team2TotalStats.fgAttempted > 0 ? (projection.team2TotalStats.fgMade / projection.team2TotalStats.fgAttempted) * 100 : 0;
  const t1FtPct = projection.team1TotalStats.ftAttempted > 0 ? (projection.team1TotalStats.ftMade / projection.team1TotalStats.ftAttempted) * 100 : 0;
  const t2FtPct = projection.team2TotalStats.ftAttempted > 0 ? (projection.team2TotalStats.ftMade / projection.team2TotalStats.ftAttempted) * 100 : 0;

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

  const categoryBreakdown = `
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: left; color: #e0e0e0;">Points</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.points?.winner === projection.team1 ? '#4CAF50' : '#ff6f61'};">${projection.team1TotalStats.points.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.points?.winner === projection.team2 ? '#4CAF50' : '#ff6f61'};">${projection.team2TotalStats.points.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${getWinnerColor(projection.categoryResults.points?.winner, projection.team1, projection.team2)}; font-weight: bold;">${getWinnerDisplay(projection.categoryResults.points?.winner, projection.team1, projection.team2)}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: left; color: #e0e0e0;">3-Pointers</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.threePointers?.winner === projection.team1 ? '#4CAF50' : '#ff6f61'};">${projection.team1TotalStats.threePointers.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.threePointers?.winner === projection.team2 ? '#4CAF50' : '#ff6f61'};">${projection.team2TotalStats.threePointers.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${getWinnerColor(projection.categoryResults.threePointers?.winner, projection.team1, projection.team2)}; font-weight: bold;">${getWinnerDisplay(projection.categoryResults.threePointers?.winner, projection.team1, projection.team2)}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: left; color: #e0e0e0;">Rebounds</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.rebounds?.winner === projection.team1 ? '#4CAF50' : '#ff6f61'};">${projection.team1TotalStats.rebounds.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.rebounds?.winner === projection.team2 ? '#4CAF50' : '#ff6f61'};">${projection.team2TotalStats.rebounds.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${getWinnerColor(projection.categoryResults.rebounds?.winner, projection.team1, projection.team2)}; font-weight: bold;">${getWinnerDisplay(projection.categoryResults.rebounds?.winner, projection.team1, projection.team2)}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: left; color: #e0e0e0;">Assists</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.assists?.winner === projection.team1 ? '#4CAF50' : '#ff6f61'};">${projection.team1TotalStats.assists.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.assists?.winner === projection.team2 ? '#4CAF50' : '#ff6f61'};">${projection.team2TotalStats.assists.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${getWinnerColor(projection.categoryResults.assists?.winner, projection.team1, projection.team2)}; font-weight: bold;">${getWinnerDisplay(projection.categoryResults.assists?.winner, projection.team1, projection.team2)}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: left; color: #e0e0e0;">Steals</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.steals?.winner === projection.team1 ? '#4CAF50' : '#ff6f61'};">${projection.team1TotalStats.steals.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.steals?.winner === projection.team2 ? '#4CAF50' : '#ff6f61'};">${projection.team2TotalStats.steals.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${getWinnerColor(projection.categoryResults.steals?.winner, projection.team1, projection.team2)}; font-weight: bold;">${getWinnerDisplay(projection.categoryResults.steals?.winner, projection.team1, projection.team2)}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: left; color: #e0e0e0;">Blocks</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.blocks?.winner === projection.team1 ? '#4CAF50' : '#ff6f61'};">${projection.team1TotalStats.blocks.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.blocks?.winner === projection.team2 ? '#4CAF50' : '#ff6f61'};">${projection.team2TotalStats.blocks.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${getWinnerColor(projection.categoryResults.blocks?.winner, projection.team1, projection.team2)}; font-weight: bold;">${getWinnerDisplay(projection.categoryResults.blocks?.winner, projection.team1, projection.team2)}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: left; color: #e0e0e0;">FG%</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.fieldGoalPercentage?.winner === projection.team1 ? '#4CAF50' : '#ff6f61'};">${t1FgPct.toFixed(1)}%</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.fieldGoalPercentage?.winner === projection.team2 ? '#4CAF50' : '#ff6f61'};">${t2FgPct.toFixed(1)}%</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${getWinnerColor(projection.categoryResults.fieldGoalPercentage?.winner, projection.team1, projection.team2)}; font-weight: bold;">${getWinnerDisplay(projection.categoryResults.fieldGoalPercentage?.winner, projection.team1, projection.team2)}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: left; color: #e0e0e0;">FT%</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.freeThrowPercentage?.winner === projection.team1 ? '#4CAF50' : '#ff6f61'};">${t1FtPct.toFixed(1)}%</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.freeThrowPercentage?.winner === projection.team2 ? '#4CAF50' : '#ff6f61'};">${t2FtPct.toFixed(1)}%</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${getWinnerColor(projection.categoryResults.freeThrowPercentage?.winner, projection.team1, projection.team2)}; font-weight: bold;">${getWinnerDisplay(projection.categoryResults.freeThrowPercentage?.winner, projection.team1, projection.team2)}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: left; color: #e0e0e0;">Turnovers</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.turnovers?.winner === projection.team1 ? '#4CAF50' : '#ff6f61'};">${projection.team1TotalStats.turnovers.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${projection.categoryResults.turnovers?.winner === projection.team2 ? '#4CAF50' : '#ff6f61'};">${projection.team2TotalStats.turnovers.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: ${getWinnerColor(projection.categoryResults.turnovers?.winner, projection.team1, projection.team2)}; font-weight: bold;">${getWinnerDisplay(projection.categoryResults.turnovers?.winner, projection.team1, projection.team2)}</td>
    </tr>
  `;

  // Day-by-day breakdown
  const dayNames = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];
  const dailyBreakdown = projection.dailyProjections.map((day: any, idx: number) => {
    const dayName = dayNames[idx];
    return `
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: #e0e0e0;">${dayName}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: #4CAF50;">${day.team1.points.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: #ff6f61;">${day.team2.points.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: #4CAF50;">${day.team1.threePointers.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: #ff6f61;">${day.team2.threePointers.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: #4CAF50;">${day.team1.rebounds.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: #ff6f61;">${day.team2.rebounds.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: #4CAF50;">${day.team1.assists.toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; color: #ff6f61;">${day.team2.assists.toFixed(1)}</td>
    </tr>`;
  }).join('');

  return renderTemplate(EMAIL_TEMPLATE, {
    user_name: userName,
    team1_name: projection.team1,
    team2_name: projection.team2,
    team1_score: projection.team1Score,
    team2_score: projection.team2Score,
    category_breakdown: categoryBreakdown,
    daily_breakdown: dailyBreakdown,
  });
}
// ───── Main handler (only the loop changes) ─────
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    console.log('=== Weekly Matchup Projection ===');
    const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select('user_id, name, email')
    .eq('send_weekly_projections', true)
    .not('email', 'ilike', '%yahoo%');
  
    if (error) { console.error('Error fetching profiles:', error); return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 }); }
    if (!profiles?.length) return new Response(JSON.stringify({ message: 'No users' }), { headers: corsHeaders });

    // Rate limiting: track email send timestamps (max 2 per second)
    const emailTimestamps: number[] = [];
    const RATE_LIMIT_EMAILS_PER_SECOND = 2;
    
    const waitForRateLimit = async () => {
      const now = Date.now();
      const oneSecondAgo = now - 1000;
      
      // Remove timestamps older than 1 second
      while (emailTimestamps.length > 0 && emailTimestamps[0] < oneSecondAgo) {
        emailTimestamps.shift();
      }
      
      // If we've sent 2 emails in the last second, wait
      if (emailTimestamps.length >= RATE_LIMIT_EMAILS_PER_SECOND) {
        const oldestTimestamp = emailTimestamps[0];
        const waitTime = 1000 - (now - oldestTimestamp) + 50; // Add 50ms buffer
        if (waitTime > 0) {
          console.log(`[RATE LIMIT] Waiting ${waitTime}ms (${emailTimestamps.length} emails in last second)`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          // Remove old timestamps after waiting
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
        console.log(`Processing ${p.user_id}`);

        // verify Yahoo connection
        const { data: tok } = await supabase.from('yahoo_tokens').select('user_id').eq('user_id', p.user_id).single();
        if (!tok) { console.log('no token'); continue; }

        // get first league
        const token = await getAccessToken(p.user_id);
        const leaguesResp = await makeYahooRequest(token, `/users;use_login=1/games;game_keys=nba/leagues`, p.user_id);
        
        const user = leaguesResp?.fantasy_content?.users?.[0]?.user;
        if (!user) { console.log('no user found'); continue; }
        
        const game = user.games?.[0]?.game;
        if (!game) { console.log('no game found'); continue; }
        
        const leagues = game.leagues;
        if (!leagues || leagues.length === 0) { console.log('no leagues'); continue; }

        const leagueId = leagues[0].league.league_key.split('.l.')[1];

        const matchup = await getCurrentMatchup(p.user_id, leagueId);
        console.log(`[MATCHUP] matchup: ${JSON.stringify(matchup)}`);
        const projection = await calculateDayByDayProjection(matchup);
        console.log(`[MATCHUP] projection: ${JSON.stringify(projection)}`);
        const html = generateEmailHTML(p.name ?? 'Manager', projection);
        console.log(`[MATCHUP] html: ${html}`);
        
        // Rate limit before sending email
        await waitForRateLimit();
        
        const sent = await sendEmail(p.email, `Weekly Projection: ${projection.team1} vs ${projection.team2}`, html);
        
        // Record timestamp after sending (success or failure)
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