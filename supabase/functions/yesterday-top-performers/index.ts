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
  const safe = new Set(['top_performers_table', 'user_players_highlight', 'affiliate_links_section']);
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

function calculateFantasyPoints(game: any): number {
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
    .select('*')
    .eq('game_date', gameDate)
    .eq('season', CURRENT_SEASON);

  if (error) throw error;
  if (!data) return [];

  const withFantasyPoints = data.map(row => ({
    ...row,
    calculatedFantasyPoints: calculateFantasyPoints(row),
  }));

  withFantasyPoints.sort((a, b) => b.calculatedFantasyPoints - a.calculatedFantasyPoints);

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
    const rowBackground = isUserPlayer ? '#e8f4fd' : (idx % 2 === 0 ? '#ffffff' : '#f9f9f9');
    const borderLeft = isUserPlayer ? 'border-left: 3px solid #1976d2;' : '';
    const highlightBadge = isUserPlayer 
      ? '<span style="background-color: #1976d2; color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 9px; margin-left: 6px; font-weight: 600;">MY TEAM</span>'
      : '';
    
    return `
    <tr style="background-color: ${rowBackground}; ${borderLeft}">
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #1976d2; font-weight: 600; font-size: 12px;">${p.rank}</td>
      <td style="padding: 9px 8px; border-bottom: 1px solid #e8e8e8; color: #333333;">
        <span style="font-weight: 500;">${escapeHtml(p.playerName)}</span>${highlightBadge}
        <div style="font-size: 11px; color: #777777; margin-top: 2px;">${escapeHtml(p.opponent)}</div>
      </td>
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #333333; font-family: monospace; font-size: 12px;">${p.points}</td>
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #333333; font-family: monospace; font-size: 12px;">${p.rebounds}</td>
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #333333; font-family: monospace; font-size: 12px;">${p.assists}</td>
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #333333; font-family: monospace; font-size: 12px;">${p.steals}</td>
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #333333; font-family: monospace; font-size: 12px;">${p.blocks}</td>
      <td style="padding: 9px 6px; border-bottom: 1px solid #e8e8e8; text-align: center; color: #003366; font-weight: 600; font-family: monospace; font-size: 12px;">${p.fantasyPoints.toFixed(1)}</td>
    </tr>`;
  }).join('');
}

function buildUserPlayersHighlight(performers: TopPerformer[], userPlayerIds: Set<number>): string {
  const userPerformers = performers.filter(p => userPlayerIds.has(p.playerId));
  if (userPerformers.length === 0) return '';
  const getSuffix = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  return userPerformers.map(p => {
    return `<strong style="color: #003366;">${escapeHtml(p.playerName)}</strong> had the <strong>${p.rank}${getSuffix(p.rank)}</strong> best line of the night with <strong style="color: #1976d2;">${p.fantasyPoints.toFixed(1)} fantasy points</strong>!`;
  }).join('<br>');
}

interface AffiliateLink {
  id: string;
  label: string;
  url: string;
  thumbnail_url: string | null;
}

async function getRandomAffiliateLinks(limit: number = 2): Promise<AffiliateLink[]> {
  const { data, error } = await supabase
    .from('affiliate_links')
    .select('id, label, url, thumbnail_url')
    .eq('is_active', true);

  if (error) {
    console.error('[AFFILIATE] Error fetching affiliate links:', error);
    return [];
  }
  if (!data || data.length === 0) return [];

  const shuffled = [...data];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, limit);
}

function buildAffiliateLinksSection(links: AffiliateLink[]): string {
  if (links.length === 0) return '';

  const columnsHtml = links.map(link => {
    const imageUrl = link.thumbnail_url || 'https://via.placeholder.com/300x200?text=Guru+Pick';
    return `
    <div style="display:inline-block; margin: 8px; width: 100%; max-width: 240px; vertical-align: top;">
      <a href="${escapeHtml(link.url)}" target="_blank" style="text-decoration: none; color: inherit; display: block;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; text-align: center;">
          <tr><td style="padding: 0;"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(link.label)}" style="width: 100%; height: auto; display: block; border-bottom: 1px solid #f0f0f0;"></td></tr>
          <tr><td style="padding: 14px 10px;"><span style="font-size: 13px; font-weight: 700; color: #1976d2; text-decoration: none; font-family: sans-serif; letter-spacing: 0.5px;">${escapeHtml(link.label).toUpperCase()}</span></td></tr>
        </table>
      </a>
    </div>
    `;
  }).join('');

  return `
  <tr>
    <td style="padding: 30px 20px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="margin: 0 0 5px; font-size: 12px; font-weight: 800; color: #999999; text-transform: uppercase; letter-spacing: 1.5px;">
        Guru's Daily Essentials
      </p>
      <p style="margin: 0 0 15px; font-size: 10px; color: #aaaaaa; font-style: italic;">
        As an Amazon Associate, I earn from qualifying purchases.
      </p>
      ${columnsHtml}
    </td>
  </tr>`;
}
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const latestDate = await getLatestGameDate();
    if (!latestDate) return new Response('No data', { headers: corsHeaders });

    const top10 = await getTopPerformers(latestDate, 10);
    const top3Ids = new Set(top10.slice(0, 3).map(p => p.playerId));

    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('user_id, name, email')
      .eq('send_news', true);

    if (!profiles?.length) return new Response('No users', { headers: corsHeaders });
    const affiliateLinks = await getRandomAffiliateLinks(2);

    const results = [];
    for (const profile of profiles) {
      try {
        const roster = await getUserRoster(profile.user_id);
        const userNbaIds = new Set(roster.map(p => p.nbaPlayerId).filter(id => id !== null));
        
        // Find the specific performers who are on the user's team
        const userPerformers = top10.filter(p => userNbaIds.has(p.playerId));
        const hasTop3 = userPerformers.some(p => p.rank <= 3);

        if (!hasTop3) continue;

        // Take the first (highest-ranking) user player for the subject line
        const topUserPlayer = userPerformers[0];
        const subject = `${topUserPlayer.playerName} had the #${topUserPlayer.rank} line of the night! 🔥`;

        const html = renderTemplate(EMAIL_TEMPLATE, {
          user_name: profile.name || 'Manager',
          game_date: new Date(latestDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
          user_players_highlight: buildUserPlayersHighlight(top10, userNbaIds),
          top_performers_table: buildTopPerformersTable(top10, userNbaIds),
          affiliate_links_section: buildAffiliateLinksSection(affiliateLinks),
        });

        const sent = await sendEmail(profile.email, subject, html);
        results.push({ email: profile.email, sent });
      } catch (err) {
        console.error(err);
      }
    }

    return new Response(JSON.stringify({ status: 'done', results }), { headers: corsHeaders });
  } catch (err) {
    return new Response(String(err), { status: 500, headers: corsHeaders });
  }
});