import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const YAHOO_CLIENT_ID = Deno.env.get("YAHOO_CLIENT_ID") || "";
const YAHOO_CLIENT_SECRET = Deno.env.get("YAHOO_CLIENT_SECRET") || "";
const YAHOO_REDIRECT_URI = Deno.env.get("YAHOO_REDIRECT_URI") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("=== Yahoo OAuth Request ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Environment check:");
  console.log("- YAHOO_CLIENT_ID:", YAHOO_CLIENT_ID ? "Set" : "Missing");
  console.log("- YAHOO_CLIENT_SECRET:", YAHOO_CLIENT_SECRET ? "Set" : "Missing");
  console.log("- YAHOO_REDIRECT_URI:", YAHOO_REDIRECT_URI || "Missing");
  console.log("- SUPABASE_URL:", SUPABASE_URL ? "Set" : "Missing");
  console.log("- SUPABASE_SERVICE_ROLE_KEY:", SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing");
  
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    console.log("URL params:", Object.fromEntries(url.searchParams));
    
    // Try to get action from query params first, then from body
    let action = url.searchParams.get("action");
    let requestBody = null;
    
    if (!action && req.method === "POST") {
      try {
        const body = await req.text();
        console.log("Raw request body:", body);
        
        if (body) {
          requestBody = JSON.parse(body);
          console.log("Parsed request body:", requestBody);
          action = requestBody.action;
        }
      } catch (parseError) {
        console.error("Failed to parse request body:", parseError);
      }
    }
    
    console.log("Action determined:", action);

    if (!action) {
      console.error("No action provided in request");
      throw new Error("Action parameter is required");
    }

    if (action === "authorize") {
      console.log("Handling authorize action");
      
      // Request necessary scopes:
      // - openid: Required to access user info endpoint
      // - profile: Get user profile data
      // - fspt-w: Fantasy Sports read/write access
      const scopes = "fspt-r profile email openid";
      const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${YAHOO_CLIENT_ID}&redirect_uri=${encodeURIComponent(YAHOO_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes)}&language=en-us`;
      
      console.log("Generated auth URL with scopes:", scopes);
      
      return new Response(
        JSON.stringify({ authUrl }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === "callback") {
      console.log("Handling callback action");
      const code = url.searchParams.get("code") || requestBody?.code;
      console.log("Authorization code:", code ? "Present" : "Missing");
      
      if (!code) {
        console.error("No authorization code in request");
        throw new Error("No authorization code provided");
      }

      console.log("Exchanging code for tokens...");
      const tokenResponse = await fetch("https://api.login.yahoo.com/oauth2/get_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${btoa(`${YAHOO_CLIENT_ID}:${YAHOO_CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          redirect_uri: YAHOO_REDIRECT_URI,
          code: code,
        }),
      });

      console.log("Token response status:", tokenResponse.status);

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token exchange failed:", errorText);
        throw new Error(`Token exchange failed: ${errorText}`);
      }

      const tokenData = await tokenResponse.json();
      console.log("Token exchange successful");
      
      console.log("Fetching user info...");
      const userInfoResponse = await fetch("https://api.login.yahoo.com/openid/v1/userinfo", {
        headers: {
          "Authorization": `Bearer ${tokenData.access_token}`,
        },
      });

      console.log("User info response status:", userInfoResponse.status);

      if (!userInfoResponse.ok) {
        const errorText = await userInfoResponse.text();
        console.error("Failed to fetch user info:", errorText);
        throw new Error("Failed to fetch user info");
      }

      const userInfo = await userInfoResponse.json();
      console.log("User info received:", JSON.stringify(userInfo, null, 2));
      
      const userId = userInfo.sub;
      console.log("User ID:", userId);
      console.log("Email:", userInfo.email || "Not provided");
      console.log("Name:", userInfo.name || "Not provided");

      console.log("Storing tokens and user profile in database...");
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
      console.log("Token expires at:", expiresAt.toISOString());

      const { error: upsertError } = await supabase
        .from("yahoo_tokens")
        .upsert({
          user_id: userId,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_type: tokenData.token_type,
          expires_at: expiresAt.toISOString(),
          // Store user profile information
          email: userInfo.email || null,
          name: userInfo.name || null,
          given_name: userInfo.given_name || null,
          family_name: userInfo.family_name || null,
          nickname: userInfo.nickname || null,
          profile_picture: userInfo.picture || null,
          locale: userInfo.locale || null,
        }, {
          onConflict: "user_id",
        });

      if (upsertError) {
        console.error("Database error:", upsertError);
        throw new Error(`Database error: ${upsertError.message}`);
      }
      
      console.log("Tokens and user profile stored successfully");

      return new Response(
        JSON.stringify({
          success: true,
          userId: userId,
          email: userInfo.email || null,
          name: userInfo.name || null,
          expiresAt: expiresAt.toISOString(),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === "refresh") {
      console.log("Handling refresh action");
      const userId = requestBody?.userId;
      console.log("User ID for refresh:", userId);
      
      if (!userId) {
        console.error("No user ID provided for refresh");
        throw new Error("User ID is required");
      }

      console.log("Fetching existing tokens...");
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      const { data: tokenData, error: fetchError } = await supabase
        .from("yahoo_tokens")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (fetchError || !tokenData) {
        console.error("No tokens found:", fetchError);
        throw new Error("No tokens found for user");
      }
      
      console.log("Existing tokens found, refreshing...");

      const tokenResponse = await fetch("https://api.login.yahoo.com/oauth2/get_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${btoa(`${YAHOO_CLIENT_ID}:${YAHOO_CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          redirect_uri: YAHOO_REDIRECT_URI,
          refresh_token: tokenData.refresh_token,
        }),
      });

      console.log("Token refresh response status:", tokenResponse.status);

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token refresh failed:", errorText);
        throw new Error(`Token refresh failed: ${errorText}`);
      }

      const newTokenData = await tokenResponse.json();
      const expiresAt = new Date(Date.now() + newTokenData.expires_in * 1000);
      console.log("Token refresh successful, new expiry:", expiresAt.toISOString());

      console.log("Updating tokens in database...");
      const { error: updateError } = await supabase
        .from("yahoo_tokens")
        .update({
          access_token: newTokenData.access_token,
          refresh_token: newTokenData.refresh_token,
          expires_at: expiresAt.toISOString(),
        })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Database update error:", updateError);
        throw new Error(`Database update error: ${updateError.message}`);
      }
      
      console.log("Tokens updated successfully");

      return new Response(
        JSON.stringify({
          success: true,
          expiresAt: expiresAt.toISOString(),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    console.error("Invalid action provided:", action);
    throw new Error(`Invalid action: ${action}. Valid actions are: authorize, callback, refresh`);
  } catch (error) {
    console.error("=== Error in Yahoo OAuth ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Check Supabase function logs for more information"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

