// ─────────────────────────────────────────────────────────────────────────────
// unsubscribe – one-click opt-out for every outbound email
// ─────────────────────────────────────────────────────────────────────────────
//
// Public by design (verify_jwt = false): the caller is either a mail client's
// one-click unsubscribe robot or a recipient who is, by definition, not signed
// in. Authorisation is the unguessable per-row token from
// 20260905120000_add_unsubscribe_tokens.sql — knowing it is the proof.
//
// Two entry points, deliberately different:
//
//   POST ?t=<token>&l=<list>  — performs the unsubscribe, returns 204.
//     This is what Gmail and Yahoo call for List-Unsubscribe-Post one-click.
//
//   GET  ?t=<token>&l=<list>  — renders a page with a single button that POSTs.
//     The GET must NOT act on its own: Outlook Safe Links, corporate mail
//     scanners and inbox preview crawlers all fetch link targets, and a GET
//     that unsubscribes would silently drop those recipients off the list
//     without them ever clicking.
//
// The response is identical for a valid and an invalid token so that this
// endpoint cannot be used to probe whether an address is on a list.

import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

const SITE_URL = 'https://fantasygoats.guru';

// Which list each `l` value maps to. The token says who; this says what they
// are leaving. Keep the keys in sync with the ${unsubscribe_url} built by each
// sender — promotion-email uses 'promotions', the two projection jobs use
// 'projections', and yesterday-top-performers uses 'news'.
const LISTS = {
  promotions: {
    table: 'mailing_list',
    column: 'avoid_promotions',
    // mailing_list.avoid_promotions is inverted relative to the user_profiles
    // flags: true means "do not send", where send_news = true means "do send".
    value: true,
    label: 'promotional emails',
  },
  projections: {
    table: 'user_profiles',
    column: 'send_weekly_projections',
    value: false,
    label: 'weekly matchup projections',
  },
  news: {
    table: 'user_profiles',
    column: 'send_news',
    value: false,
    label: 'daily top performers',
  },
} as const;

type ListKey = keyof typeof LISTS;

const isListKey = (v: string | null): v is ListKey =>
  v !== null && Object.hasOwn(LISTS, v);

// A UUID token is the only thing we will look up. Anything else is rejected
// before it reaches the database.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&#39;');

const page = (title: string, body: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${escapeHtml(title)} – Fantasy Goats Guru</title>
  <style>
    body { margin: 0; background: #1a1a1a; color: #e0e0e0;
           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
           display: flex; align-items: center; justify-content: center;
           min-height: 100vh; padding: 24px; }
    .card { background: #252525; border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px; padding: 40px; max-width: 460px; text-align: center; }
    h1 { margin: 0 0 12px; font-size: 20px; font-weight: 700; }
    p { margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #b0bec5; }
    button { background: #4a90e2; color: #fff; border: 0; border-radius: 8px;
             padding: 12px 28px; font-size: 15px; font-weight: 600; cursor: pointer; }
    button:hover { background: #3a7bc8; }
    a { color: #4a90e2; text-decoration: none; font-size: 13px; }
  </style>
</head>
<body><div class="card">${body}</div></body>
</html>`;

const confirmPage = (listLabel: string) =>
  page('Unsubscribe', `
    <h1>Unsubscribe</h1>
    <p>You will stop receiving ${escapeHtml(listLabel)} from Fantasy Goats Guru.</p>
    <form method="POST">
      <button type="submit">Unsubscribe</button>
    </form>
  `);

// Shown after a successful POST from the confirm page, and for any token that
// does not resolve. Identical in both cases on purpose — see the header note.
const donePage = () =>
  page('Unsubscribed', `
    <h1>You're unsubscribed</h1>
    <p>You won't receive these emails again. It can take a few minutes to take effect.</p>
    <a href="${SITE_URL}">Back to Fantasy Goats Guru</a>
  `);

const html = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });

serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get('t');
  const list = url.searchParams.get('l');

  // A malformed link is a dead end, not an error page — whoever clicked it
  // still wants out, and the useful thing to show them is where to say so.
  if (!token || !UUID_RE.test(token) || !isListKey(list)) {
    return html(page('Unsubscribe', `
      <h1>This link isn't valid</h1>
      <p>It may have been truncated by your mail client. Reply to any of our emails
      and we'll take you off the list by hand.</p>
      <a href="${SITE_URL}">Back to Fantasy Goats Guru</a>
    `), 400);
  }

  const target = LISTS[list];

  if (req.method === 'GET') {
    return html(confirmPage(target.label));
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { error } = await supabase
    .from(target.table)
    .update({ [target.column]: target.value })
    .eq('unsubscribe_token', token);

  if (error) {
    // Do not report success we did not achieve: a recipient who is told they
    // are unsubscribed and then keeps receiving mail marks it as spam, which
    // is the outcome this whole endpoint exists to prevent.
    console.error(`[UNSUBSCRIBE] Failed to update ${target.table}.${target.column}:`, error);
    return html(page('Something went wrong', `
      <h1>We couldn't complete that</h1>
      <p>Please try the link again, or reply to any of our emails and we'll take
      you off the list by hand.</p>
      <a href="${SITE_URL}">Back to Fantasy Goats Guru</a>
    `), 500);
  }

  // A token that matches no row updates nothing and still lands here. That is
  // intentional: an already-unsubscribed or stale token gets the same page as
  // a fresh one, so this cannot be used to test whether an address is on file.
  console.log(`[UNSUBSCRIBE] Processed opt-out from '${list}'`);

  // Mail-client robots want an empty 2xx and never render a body; humans
  // arriving from the confirm form get the page.
  const wantsHtml = (req.headers.get('accept') || '').includes('text/html');
  return wantsHtml ? html(donePage()) : new Response(null, { status: 204 });
});
