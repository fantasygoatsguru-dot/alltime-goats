// ─────────────────────────────────────────────────────────────────────────────
// promotion-email – Send promotional emails to eligible users
// ─────────────────────────────────────────────────────────────────────────────
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
const resendSenderEmail = Deno.env.get('RESEND_SENDER_EMAIL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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

// ───── Helper functions ─────
const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Fantasy Goats Guru <${resendSenderEmail}>`,
        to: [to],
        subject,
        html,
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

// Throttle helper — sleep for ms milliseconds
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ───── Main handler ─────
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('[START] Promotion email function started');

    // Select up to 30 eligible users
    const { data: eligibleUsers, error: selectError } = await supabase
      .from('mailing_list')
      .select('email, manager_nickname')
      .eq('avoid_promotions', false)
      .eq('promotion_sent', false)
      .order('email', { descending: true })
      .limit(80);

    if (selectError) {
      console.error('[DB] Error selecting users:', selectError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch eligible users', details: selectError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!eligibleUsers || eligibleUsers.length === 0) {
      console.log('[INFO] No eligible users found');
      return new Response(
        JSON.stringify({ message: 'No eligible users to send emails to', sent: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[INFO] Found ${eligibleUsers.length} eligible users`);

    const results = {
      total: eligibleUsers.length,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Send emails sequentially with throttling (max 2/sec)
    for (const user of eligibleUsers) {
      const { email, manager_nickname } = user;

      console.log(`[PROCESS] Processing ${email}...`);

      const emailSent = await sendEmail(
        email,
        'Fantasy Goats Guru – your Yahoo fantasy basketball secret sauce',
        EMAIL_TEMPLATE
      );

      if (emailSent) {
        const { error: updateError } = await supabase
          .from('mailing_list')
          .update({ promotion_sent: true })
          .eq('email', email);

        if (updateError) {
          console.error(`[DB] Failed to update promotion_sent for ${email}:`, updateError);
          results.errors.push(`Failed to update ${email}: ${updateError.message}`);
        } else {
          console.log(`[SUCCESS] Email sent and flag updated for ${email}`);
          results.sent++;
        }
      } else {
        console.error(`[FAILED] Could not send email to ${email}`);
        results.failed++;
        results.errors.push(`Failed to send email to ${email}`);
      }

      // Throttle: 500ms pause = max 2 emails/sec
      await sleep(500);
    }

    console.log('[COMPLETE] Promotion email batch complete:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${results.sent} promotional emails`,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[ERROR] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
