// ─────────────────────────────────────────────────────────────────────────────
// yesterday-top-performers – Notify users when their player has a top 3 game
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

const supabase = createClient(supabaseUrl, serviceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

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
  const safe = new Set(['top_performers_table', 'user_players_highlight']);
  return Object.entries(data).reduce((r, [k, v]) => {
    const rep = safe.has(k) ? String(v) : escapeHtml(String(v));
    return r.replaceAll(`\${${k}}`, rep);
  }, tmpl);
}

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

async function getAccessToken(userId: string, forceRefresh = false): Promise<string> {
  const { data: t, error } = await supabase
    .from('yahoo_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', userId)
    .single();

  if (error || !t) throw new Error(`No token found for user ${userId}`);

  const isExpired = new Date(t.expires_at) <= new Date();
  
  if (!forceRefresh && !isExpired) return t.access_token;

  console.log(`[TOKEN] Refreshing token for user ${userId}`);
  
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
    throw new Error(`Token refresh failed: ${resp.status}`);
  }
  
  const fresh = await resp.json();
  const expires = new Date(Date.now() + fresh.expires_in * 1000);

  await supabase.from('yahoo_tokens').update({
    access_token: fresh.access_token,
    refresh_token: fresh.refresh_token ?? t.refresh_token,
    expires_at: expires.toISOString(),
  }).eq('user_id', userId);

  return fresh.access_token;
}

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
    } catch {
      throw new Error(`Yahoo 401: User ${userId} needs to reconnect`);
    }
  }
  
  if (!r.ok) {
    const errorText = await r.text();
    throw new Error(`Yahoo ${r.status}: ${errorText}`);
  }
  
  return r.json();
}

async function getNbaIdAndTeam(yahooId: number): Promise<{ nbaId: number | null; nbaTeam: string | null }> {
  const { data, error } = await supabase
    .from('yahoo_nba_mapping')
    .select('nba_id, team')
    .eq('yahoo_id', yahooId)
    .single();
  if (error || !data) return { nbaId: null, nbaTeam: null };
  return { nbaId: data.nba_id, nbaTeam: data.team };
}

interface RosterPlayer {
  yahooPlayerId: number;
  nbaPlayerId: number | null;
  name: string;
  team: string;
}

async function parseRoster(raw: any): Promise<RosterPlayer[]> {
  const roster = raw?.fantasy_content?.team?.roster;
  if (!roster) return [];

  const players = roster.players || [];
  return Promise.all(
    players
      .filter((item: any) => item?.player)
      .map(async (item: any) => {
        const p = item.player;
        const yahooId = p.player_id;
        const { nbaId } = await getNbaIdAndTeam(yahooId);
        return {
          yahooPlayerId: yahooId,
          nbaPlayerId: nbaId,
          name: p.name?.full ?? 'Unknown',
          team: p.editorial_team_abbr,
        };
      })
  );
}

async function getUserRoster(userId: string): Promise<RosterPlayer[]> {
  console.log(`[ROSTER] Fetching roster for user ${userId}`);
  const token = await getAccessToken(userId);

  const gamesResp = await makeYahooRequest(token, `/users;use_login=1/games;game_keys=${GAME_ID}/leagues`, userId);
  const games = gamesResp?.fantasy_content?.users?.[0]?.user?.games;
  if (!games) throw new Error('No games found for user');

  let leagueKey: string | null = null;
  for (const game of games) {
    if (game?.game?.game_key === GAME_ID) {
      const leagues = game.game.leagues;
      if (leagues && leagues.length > 0) {
        leagueKey = leagues[0].league?.league_key;
        break;
      }
    }
  }
  if (!leagueKey) throw new Error('No league found for user');

  console.log(`[ROSTER] Found league: ${leagueKey}`);

  const teamsResp = await makeYahooRequest(token, `/league/${leagueKey}/teams`, userId);
  const teams = teamsResp.fantasy_content.league?.teams ?? {};
  let userTeamKey: string | null = null;

  for (const entry of Object.values(teams)) {
    if (entry === 'count') continue;
    const t = (entry as any).team;
    if (t.is_owned_by_current_login === 1) {
      userTeamKey = t.team_key;
      break;
    }
  }
  if (!userTeamKey) throw new Error('User team not found in league');

  console.log(`[ROSTER] User team key: ${userTeamKey}`);

  const rosterResp = await makeYahooRequest(token, `/team/${userTeamKey}/roster`, userId);
  return parseRoster(rosterResp);
}

interface TopPerformer {
  playerId: number;
  playerName: string;
  team: string;
  opponent: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  threePointersMade: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  turnovers: number;
  fantasyPoints: number;
  rank: number;
}

// Calculate fantasy points using the same formula as SeasonGames.jsx
// Formula: PTS=1, REB=1.2, AST=1.5, STL=3, BLK=3, 3PM=0.5, FGM=1, FGA=-0.5, FTM=1, FTA=-0.5, TO=-1
function calculateFantasyPoints(game: {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  three_pointers_made: number;
  field_goals_made: number;
  field_goals_attempted: number;
  free_throws_made: number;
  free_throws_attempted: number;
  turnovers: number;
}): number {
  let total = 0;
  total += (game.points || 0) * 1;
  total += (game.rebounds || 0) * 1.2;
  total += (game.assists || 0) * 1.5;
  total += (game.steals || 0) * 3;
  total += (game.blocks || 0) * 3;
  total += (game.three_pointers_made || 0) * 0.5;
  total += (game.field_goals_made || 0) * 1;
  total += (game.field_goals_attempted || 0) * -0.5;
  total += (game.free_throws_made || 0) * 1;
  total += (game.free_throws_attempted || 0) * -0.5;
  total += (game.turnovers || 0) * -1;
  return total;
}

async function getTopPerformers(gameDate: string, limit: number): Promise<TopPerformer[]> {
  const { data, error } = await supabase
    .from('player_game_logs')
    .select('player_id, player_name, team_abbreviation, opponent, points, rebounds, assists, steals, blocks, three_pointers_made, field_goals_made, field_goals_attempted, free_throws_made, free_throws_attempted, turnovers')
    .eq('game_date', gameDate)
    .eq('season', CURRENT_SEASON);

  if (error) throw error;
  if (!data) return [];

  // Calculate fantasy points and sort
  const withFantasyPoints = data.map(row => ({
    ...row,
    calculatedFantasyPoints: calculateFantasyPoints(row),
  }));

  // Sort by calculated fantasy points descending
  withFantasyPoints.sort((a, b) => b.calculatedFantasyPoints - a.calculatedFantasyPoints);

  // Take top N and add rank
  return withFantasyPoints.slice(0, limit).map((row, idx) => ({
    playerId: row.player_id,
    playerName: row.player_name,
    team: row.team_abbreviation,
    opponent: row.opponent || '-',
    points: row.points,
    rebounds: row.rebounds,
    assists: row.assists,
    steals: row.steals,
    blocks: row.blocks,
    threePointersMade: row.three_pointers_made,
    fieldGoalsMade: row.field_goals_made,
    fieldGoalsAttempted: row.field_goals_attempted,
    freeThrowsMade: row.free_throws_made,
    freeThrowsAttempted: row.free_throws_attempted,
    turnovers: row.turnovers,
    fantasyPoints: row.calculatedFantasyPoints,
    rank: idx + 1,
  }));
}

async function getLatestGameDate(): Promise<string | null> {
  const { data, error } = await supabase
    .from('player_game_logs')
    .select('game_date')
    .eq('season', CURRENT_SEASON)
    .order('game_date', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return null;
  return data[0].game_date;
}

function buildTopPerformersTable(performers: TopPerformer[], userPlayerIds: Set<number>): string {
  return performers.map((p, idx) => {
    const isUserPlayer = userPlayerIds.has(p.playerId);
    const isEvenRow = idx % 2 === 0;
    const baseBackground = isEvenRow ? '#ffffff' : '#f9f9f9';
    const rowBackground = isUserPlayer ? '#e8f4fd' : baseBackground;
    const borderLeft = isUserPlayer ? 'border-left: 3px solid #0066cc;' : '';
    const highlightBadge = isUserPlayer 
      ? '<span style="background-color: #0066cc; color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 9px; margin-left: 6px; font-weight: 600;">MY TEAM</span>'
      : '';
    
    return `
    <tr style="background-color: ${rowBackground}; ${borderLeft}">
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #0066cc; font-weight: 600; font-size: 12px;">${p.rank}</td>
      <td style="padding: 9px 8px; border-bottom: 1px solid #e8e8e8; color: #333333;">
        <span style="font-weight: 500;">${escapeHtml(p.playerName)}</span>${highlightBadge}
        <div style="font-size: 11px; color: #777777; margin-top: 2px;">${escapeHtml(p.opponent)}</div>
      </td>
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #333333; font-family: 'Roboto Mono', monospace; font-size: 12px;">${p.points}</td>
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #333333; font-family: 'Roboto Mono', monospace; font-size: 12px;">${p.rebounds}</td>
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #333333; font-family: 'Roboto Mono', monospace; font-size: 12px;">${p.assists}</td>
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #333333; font-family: 'Roboto Mono', monospace; font-size: 12px;">${p.steals}</td>
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #333333; font-family: 'Roboto Mono', monospace; font-size: 12px;">${p.blocks}</td>
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #003366; font-weight: 600; font-family: 'Roboto Mono', monospace; font-size: 12px;">${p.fantasyPoints.toFixed(1)}</td>
    </tr>`;
  }).join('');
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function buildUserPlayersHighlight(performers: TopPerformer[], userPlayerIds: Set<number>): string {
  const userPerformers = performers.filter(p => userPlayerIds.has(p.playerId));
  if (userPerformers.length === 0) return '';

  return userPerformers.map(p => {
    const ordinal = `${p.rank}${getOrdinalSuffix(p.rank)}`;
    return `<strong style="color: #003366;">${escapeHtml(p.playerName)}</strong> had the <strong>${ordinal}</strong> best line of the night with <strong style="color: #0066cc;">${p.fantasyPoints.toFixed(1)} fantasy points</strong>!`;
  }).join('<br>');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    console.log('=== Yesterday Top Performers ===');

    const latestDate = await getLatestGameDate();
    if (!latestDate) {
      return new Response(JSON.stringify({ message: 'No game data available' }), { headers: corsHeaders });
    }
    console.log(`[DATA] Latest game date: ${latestDate}`);

    const top10Performers = await getTopPerformers(latestDate, 10);
    if (top10Performers.length === 0) {
      return new Response(JSON.stringify({ message: 'No performers found' }), { headers: corsHeaders });
    }
    console.log(`[DATA] Found ${top10Performers.length} top performers`);

    const top3PlayerIds = new Set(top10Performers.slice(0, 3).map(p => p.playerId));

    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('user_id, name, email')
      .eq('send_news', true)
      .eq('is_premium', true)
      .eq('user_id', 'GWASQZPEY3BTQW7JSFYBX2VUEQ')
      .not('email', 'ilike', '%yahoo%');

    if (error) {
      console.error('Error fetching profiles:', error);
      return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 });
    }

    if (!profiles?.length) {
      return new Response(JSON.stringify({ message: 'No users with send_news enabled' }), { headers: corsHeaders });
    }

    console.log(`[USERS] Found ${profiles.length} users with send_news=true`);

    const results: { userId: string; email: string; sent: boolean; reason?: string }[] = [];
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
        }
      }
    };

    for (const profile of profiles) {
      const { user_id: userId, name, email } = profile;
      console.log(`[PROCESS] User ${userId} (${name})`);

      try {
        const roster = await getUserRoster(userId);
        const userNbaPlayerIds = new Set(roster.map(p => p.nbaPlayerId).filter((id): id is number => id !== null));

        const hasTop3Player = [...top3PlayerIds].some(id => userNbaPlayerIds.has(id));
        
        if (!hasTop3Player) {
          console.log(`[SKIP] User ${userId} has no top 3 players`);
          results.push({ userId, email, sent: false, reason: 'No top 3 players on roster' });
          continue;
        }

        console.log(`[MATCH] User ${userId} has a top 3 player!`);

        const userPlayersHighlight = buildUserPlayersHighlight(top10Performers, userNbaPlayerIds);
        const topPerformersTable = buildTopPerformersTable(top10Performers, userNbaPlayerIds);

        const formattedDate = new Date(latestDate + 'T00:00:00').toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });

        const html = renderTemplate(EMAIL_TEMPLATE, {
          user_name: name || 'Fantasy Manager',
          game_date: formattedDate,
          user_players_highlight: userPlayersHighlight,
          top_performers_table: topPerformersTable,
        });

        const topUserPerformer = top10Performers.find(p => userNbaPlayerIds.has(p.playerId));
        const subject = topUserPerformer
          ? `🔥 ${topUserPerformer.playerName} had the #${topUserPerformer.rank} line of the night!`
          : `🏀 Your player made the top 3 last night!`;

        await waitForRateLimit();
        const sent = await sendEmail(email, subject, html);
        emailTimestamps.push(Date.now());
        
        results.push({ userId, email, sent });

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`[ERROR] User ${userId}: ${errorMessage}`);
        results.push({ userId, email, sent: false, reason: errorMessage });
      }
    }

    const summary = {
      date: latestDate,
      top3: top10Performers.slice(0, 3).map(p => ({ name: p.playerName, fantasyPoints: p.fantasyPoints })),
      usersProcessed: profiles.length,
      emailsSent: results.filter(r => r.sent).length,
      results,
    };

    console.log(`[DONE] Sent ${summary.emailsSent} emails out of ${summary.usersProcessed} users`);

    return new Response(JSON.stringify(summary), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('[FATAL]', err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      headers: corsHeaders,
      status: 500,
    });
  }
});
