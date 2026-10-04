// ─────────────────────────────────────────────────────────────────────────────
// promotion-email – Season-launch campaign: 2026-27 rankings + draft guide
//
// Run once a day by pg_cron (job 'promotion-email-daily'). Each run mails the
// next BATCH_SIZE addresses on mailing_list that have not unsubscribed and have
// not yet received CAMPAIGN, then stamps them with it. The list drains itself;
// once it is empty, runs return sent: 0 and the cron job can be unscheduled.
//
// Audience: with SITE_USERS_ONLY on, only people who used the site
// (mailing_list.is_site_user) are mailed. When a run returns sent: 0, flip it to
// false and the same cron job carries on with the league-mate addresses; anyone
// already mailed is skipped by CAMPAIGN.
//
// To start a future campaign, change CAMPAIGN (and the template/subject) — every
// row becomes eligible again without touching the database.
// ─────────────────────────────────────────────────────────────────────────────
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
const resendSenderEmail = Deno.env.get('RESEND_SENDER_EMAIL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// CAN-SPAM requires a valid postal address in every commercial email (a P.O.
// box or registered mailbox is fine). The function refuses to send without it.
const mailingAddress = Deno.env.get('MAILING_ADDRESS')?.trim() ?? '';
// Optional: where replies go. Without it, replies hit the sender address.
const replyTo = Deno.env.get('RESEND_REPLY_TO')?.trim() || undefined;

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Stored in mailing_list.last_campaign_sent once a row has been mailed.
const CAMPAIGN = 'rankings-guide-2026-27';
const SUBJECT = '2026-27 fantasy basketball rankings & draft guide are live';
const BATCH_SIZE = 100;
const SITE_USERS_ONLY = true;

// Why this person is getting the email, by how their address reached the list.
// Accurate reasons cut spam complaints, and the two groups really did differ.
const REASON_SITE_USER = "You're receiving this because you've used Fantasy Goats Guru with your Yahoo account.";
const REASON_LEAGUE_MATE = "You're receiving this because your email appears in a Yahoo fantasy basketball league connected to Fantasy Goats Guru.";

// Where the unsubscribe link points. The `unsubscribe` edge function is public
// (verify_jwt = false) because it is reached from an email, not from a session.
const UNSUBSCRIBE_ENDPOINT = `${supabaseUrl}/functions/v1/unsubscribe`;

const buildUnsubscribeUrl = (token: string) =>
  `${UNSUBSCRIBE_ENDPOINT}?t=${encodeURIComponent(token)}&l=promotions`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// ───── Email templates ─────
// HTML plus a plain-text alternative: multipart mail scores better with spam
// filters and is what text-only clients and screen readers fall back to.
const loadTemplate = async (path: string) => {
  try {
    const t = await Deno.readTextFile(path);
    console.log(`[TEMPLATE] Loaded ${path}`);
    return t;
  } catch (e) {
    console.error(`[TEMPLATE] Failed to load ${path}:`, e);
    return '';
  }
};
const HTML_TEMPLATE = await loadTemplate('./email-template.html');
const TEXT_TEMPLATE = await loadTemplate('./email-template.txt');

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Yahoo nicknames are free text and often useless as a name ("--hidden--",
// "Team 4", an email handle). Only use one that looks like a name; a generic
// greeting beats "Hi --hidden--,".
const greetingFor = (nickname: string | null) => {
  const n = (nickname ?? '').trim();
  const usable = n.length >= 2 && n.length <= 30 && /^[\p{L}][\p{L}\p{M} .'-]*$/u.test(n);
  return usable ? `Hi ${n},` : 'Hi there,';
};

const fill = (template: string, vars: Record<string, string>, html: boolean) =>
  Object.entries(vars).reduce(
    (out, [key, value]) => out.replaceAll('${' + key + '}', html ? escapeHtml(value) : value),
    template
  );

// ───── Helper functions ─────
const sendEmail = async (to: string, subject: string, html: string, text: string, unsubscribeUrl: string) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        // If a run is retried after a timeout, Resend drops the duplicate
        // instead of mailing the same person twice (keys last 24h).
        'Idempotency-Key': `${CAMPAIGN}/${to}`,
      },
      body: JSON.stringify({
        from: `Fantasy Goats Guru <${resendSenderEmail}>`,
        to: [to],
        subject,
        html,
        text,
        reply_to: replyTo,
        // Lets Resend's dashboard split opens/clicks/bounces by campaign.
        tags: [{ name: 'campaign', value: CAMPAIGN.replace(/[^A-Za-z0-9_-]/g, '_') }],
        // Gmail and Yahoo both require one-click unsubscribe from bulk senders.
        // Without these headers the recipient's only exit is the spam button,
        // which is the complaint rate that gets a sending domain throttled.
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[EMAIL] Failed to send to ${to}:`, errorText);
      return false;
    }

    const result = await response.json();
    console.log(`[EMAIL] Successfully sent to ${to}, ID: ${result.id}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Error sending to ${to}:`, error);
    return false;
  }
};

// Last-moment opt-out check, run right before each send. Covers two gaps the
// batch query cannot: someone who unsubscribes while the batch is mid-run (it
// takes ~50s), and the same address stored twice in different case, where one
// copy is opted out — mailing_list.email is a case-sensitive key. ilike is
// case-insensitive; % and _ are escaped so they match literally (_ is common
// in addresses). Any error, or no row at all, counts as "do not send".
const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);
const isOptedOut = async (email: string) => {
  const { data, error } = await supabase
    .from('mailing_list')
    .select('avoid_promotions')
    .ilike('email', escapeLike(email.trim()));
  if (error || !data || data.length === 0) return true;
  return data.some((row) => row.avoid_promotions !== false);
};

// Throttle helper — sleep for ms milliseconds
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ───── Main handler ─────
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log(`[START] Campaign ${CAMPAIGN} started`);

    // A broken template must not go out to 100 people.
    if (!HTML_TEMPLATE || !TEXT_TEMPLATE) {
      return jsonResponse({ error: 'Email template failed to load — nothing sent' }, 500);
    }
    if (!mailingAddress) {
      return jsonResponse({ error: 'MAILING_ADDRESS secret is not set (required by CAN-SPAM) — nothing sent' }, 500);
    }

    let query = supabase
      .from('mailing_list')
      .select('email, manager_nickname, is_site_user, avoid_promotions, unsubscribe_token')
      .eq('avoid_promotions', false)
      .or(`last_campaign_sent.is.null,last_campaign_sent.neq.${CAMPAIGN}`);
    if (SITE_USERS_ONLY) query = query.eq('is_site_user', true);

    const { data: eligibleUsers, error: selectError } = await query
      .order('email', { ascending: true })
      .limit(BATCH_SIZE);

    if (selectError) {
      console.error('[DB] Error selecting users:', selectError);
      return jsonResponse({ error: 'Failed to fetch eligible users', details: selectError.message }, 500);
    }

    if (!eligibleUsers || eligibleUsers.length === 0) {
      console.log('[INFO] No eligible users left — campaign complete');
      return jsonResponse({ message: SITE_USERS_ONLY
          ? `All site users have ${CAMPAIGN}; set SITE_USERS_ONLY = false to continue with league-mates`
          : `Campaign ${CAMPAIGN} complete, no one left to email`,
        sent: 0 });
    }

    console.log(`[INFO] Found ${eligibleUsers.length} eligible users`);

    const results = {
      campaign: CAMPAIGN,
      siteUsersOnly: SITE_USERS_ONLY,
      total: eligibleUsers.length,
      sent: 0,
      failed: 0,
      skippedOptedOut: 0,
      errors: [] as string[],
    };

    // Send emails sequentially with throttling (max 2/sec)
    for (const { email, manager_nickname, is_site_user, avoid_promotions, unsubscribe_token } of eligibleUsers) {
      // Opted-out addresses are never mailed, site user or not. The query
      // already filters them; these two checks hold even if it is edited.
      if (avoid_promotions !== false || await isOptedOut(email)) {
        console.log(`[SKIP] ${email} has opted out of promotions`);
        results.skippedOptedOut++;
        continue;
      }

      // No token means no way out of the list, so this row must not be mailed.
      if (!unsubscribe_token) {
        console.error(`[SKIP] No unsubscribe token for ${email} — not sending`);
        results.failed++;
        results.errors.push(`No unsubscribe token for ${email}`);
        continue;
      }

      const unsubscribeUrl = buildUnsubscribeUrl(unsubscribe_token);
      const vars = {
        greeting: greetingFor(manager_nickname),
        unsubscribe_url: unsubscribeUrl,
        mailing_address: mailingAddress,
        reason: is_site_user ? REASON_SITE_USER : REASON_LEAGUE_MATE,
      };

      const emailSent = await sendEmail(
        email,
        SUBJECT,
        fill(HTML_TEMPLATE, vars, true),
        fill(TEXT_TEMPLATE, vars, false),
        unsubscribeUrl
      );

      if (emailSent) {
        const { error: updateError } = await supabase
          .from('mailing_list')
          .update({ last_campaign_sent: CAMPAIGN })
          .eq('email', email);

        if (updateError) {
          // The mail went out but the row isn't stamped, so tomorrow's run
          // would send it again. Stop here rather than repeat that 100 times.
          console.error(`[DB] Failed to stamp ${email}, aborting batch:`, updateError);
          results.sent++;
          results.errors.push(`Failed to update ${email}: ${updateError.message}`);
          return jsonResponse({ success: false, message: 'Aborted: could not record sends', results }, 500);
        }

        results.sent++;
      } else {
        results.failed++;
        results.errors.push(`Failed to send email to ${email}`);
      }

      // Throttle: 500ms pause = max 2 emails/sec
      await sleep(500);
    }

    console.log('[COMPLETE] Batch complete:', results);

    return jsonResponse({
      success: true,
      message: `Sent ${results.sent} ${CAMPAIGN} emails`,
      results,
    });

  } catch (error) {
    console.error('[ERROR] Unexpected error:', error);
    return jsonResponse({ error: 'Internal server error', details: (error as Error).message }, 500);
  }
});
