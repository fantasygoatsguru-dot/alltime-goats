import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateEvent, WebhookVerificationError } from "https://esm.sh/@polar-sh/sdk@0.49.0/webhooks";

const POLAR_WEBHOOK_SECRET = Deno.env.get("POLAR_WEBHOOK_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Update each season alongside CURRENT_SEASON in src/utils/supabase.js and
// PASS_SEASON in src/config/passes.js.
const CURRENT_SEASON = "2026-27";

const VALID_PASS_TYPES = new Set(["draft", "season", "combo"]);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const rawBody = await req.text();
  const headers = Object.fromEntries(req.headers);

  let event: any;
  try {
    event = await validateEvent(rawBody, headers, POLAR_WEBHOOK_SECRET);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      console.error("Polar webhook: invalid signature", err.message);
      return new Response("Invalid signature", { status: 403 });
    }
    console.error("Polar webhook: failed to parse/verify event", err);
    return new Response("Invalid payload", { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  if (event?.type === "order.refunded") {
    // Revoke access immediately on refund. Polar can issue these at their
    // own discretion (chargeback prevention) as well as on buyer request,
    // so this can't be treated as a rare/manual case.
    const externalOrderId: string | undefined = event.data?.id;
    if (!externalOrderId) {
      return new Response("Ignored (no order id)", { status: 200 });
    }
    const { error } = await supabase
      .from("entitlements")
      .delete()
      .eq("external_order_id", externalOrderId)
      .eq("source", "polar");
    if (error) {
      console.error("Polar webhook: failed to revoke entitlement on refund", error);
      return new Response("Internal error", { status: 500 });
    }
    return new Response("OK", { status: 200 });
  }

  if (event?.type !== "order.paid") {
    // We only act on paid orders and refunds; everything else (subscription
    // events, etc.) is ignored since we only sell one-time passes.
    return new Response("Ignored", { status: 200 });
  }

  const order = event.data;

  // pass_type is set as static metadata on each Checkout Link in the Polar
  // dashboard (one link per pass); reference_id is passed dynamically per
  // buyer via the checkout URL's query param in buildCheckoutUrl() and
  // carries our Supabase auth_user_id. Field paths below are our best read
  // of Polar's docs at integration time (their published payload examples
  // were incomplete) — before relying on this in production, replay a real
  // test webhook from Polar's dashboard (Settings > Webhooks > your
  // endpoint > Replay) and confirm these paths against the actual payload,
  // adjusting the optional-chain fallbacks below if needed.
  const authUserId: string | undefined =
    order?.metadata?.reference_id ?? order?.reference_id ?? order?.checkout?.reference_id;
  const passType: string | undefined = order?.metadata?.pass_type;
  const externalOrderId: string | undefined = order?.id;

  if (!authUserId || !passType || !VALID_PASS_TYPES.has(passType) || !externalOrderId) {
    console.error("Polar webhook: missing or invalid required fields", {
      authUserId,
      passType,
      externalOrderId,
    });
    // Nothing a retry can fix here (bad/missing metadata), so acknowledge
    // with 200 to stop Polar from retrying indefinitely.
    return new Response("Missing required fields", { status: 200 });
  }

  const { error } = await supabase.from("entitlements").insert({
    auth_user_id: authUserId,
    pass_type: passType,
    season: CURRENT_SEASON,
    source: "polar",
    external_order_id: externalOrderId,
  });

  if (error) {
    if (error.code === "23505") {
      // Unique violation on external_order_id: this order was already recorded
      // (webhook retry). Not an error from Polar's point of view.
      return new Response("Already recorded", { status: 200 });
    }
    console.error("Polar webhook: failed to insert entitlement", error);
    return new Response("Internal error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
});
