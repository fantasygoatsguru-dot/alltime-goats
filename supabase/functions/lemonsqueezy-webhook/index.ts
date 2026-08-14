import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ENTITLEMENT_SEASON } from "../_shared/season.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LEMONSQUEEZY_WEBHOOK_SECRET = Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// The season a purchased pass unlocks — see _shared/season.ts. Leads the stats
// season by design; keep in sync with PASS_SEASON in src/config/passes.js.
const CURRENT_SEASON = ENTITLEMENT_SEASON;

// LemonSqueezy variant id -> pass type. Test-mode and live-mode products have
// different variant ids, so this map must be updated when switching to live.
const VARIANT_PASS_MAP: Record<number, "draft" | "season" | "combo"> = {
  1946286: "draft",
  1946299: "season",
  1946301: "combo",
};

async function verifySignature(rawBody: string, signatureHeader: string | null): Promise<boolean> {
  if (!signatureHeader || !LEMONSQUEEZY_WEBHOOK_SECRET) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(LEMONSQUEEZY_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const digest = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (digest.length !== signatureHeader.length) return false;
  let mismatch = 0;
  for (let i = 0; i < digest.length; i++) {
    mismatch |= digest.charCodeAt(i) ^ signatureHeader.charCodeAt(i);
  }
  return mismatch === 0;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("X-Signature");

  if (!(await verifySignature(rawBody, signature))) {
    console.error("LemonSqueezy webhook: invalid signature");
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch (_e) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const eventName = payload?.meta?.event_name;
  if (eventName !== "order_created") {
    // We only sell one-time passes, so order_created is the only event we act on.
    return new Response("Ignored", { status: 200 });
  }

  const authUserId: string | undefined = payload?.meta?.custom_data?.auth_user_id;
  const variantId: number | undefined = payload?.data?.attributes?.first_order_item?.variant_id;
  const externalOrderId: string | undefined = payload?.data?.id;
  const status: string | undefined = payload?.data?.attributes?.status;

  if (status !== "paid") {
    return new Response("Ignored (not paid)", { status: 200 });
  }

  const passType = variantId !== undefined ? VARIANT_PASS_MAP[variantId] : undefined;

  if (!authUserId || !passType || !externalOrderId) {
    console.error("LemonSqueezy webhook: missing required fields", {
      authUserId,
      variantId,
      passType,
      externalOrderId,
    });
    // Nothing a retry can fix here (bad/missing custom data or unknown variant),
    // so acknowledge with 200 to stop LemonSqueezy from retrying indefinitely.
    return new Response("Missing required fields", { status: 200 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { error } = await supabase.from("entitlements").insert({
    auth_user_id: authUserId,
    pass_type: passType,
    season: CURRENT_SEASON,
    source: "lemonsqueezy",
    external_order_id: externalOrderId,
  });

  if (error) {
    if (error.code === "23505") {
      // Unique violation on external_order_id: this order was already recorded
      // (webhook retry). Not an error from LemonSqueezy's point of view.
      return new Response("Already recorded", { status: 200 });
    }
    console.error("LemonSqueezy webhook: failed to insert entitlement", error);
    return new Response("Internal error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
});
