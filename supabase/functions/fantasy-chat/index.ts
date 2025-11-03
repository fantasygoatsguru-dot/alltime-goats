import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface LeagueContext {
  leagueId: string;
  leagueName: string;
  userTeam: {
    name: string;
    players: Array<{ name: string; stats?: any }>;
  };
  otherTeams: Array<{
    name: string;
    players: Array<{ name: string }>;
  }>;
  currentMatchup?: { opponent: string; weekNumber: number };
  leagueSettings?: {
    scoringType: string;
    usesPlayoff: boolean;
    numTeams: number;
    maxWeeklyAdds: number;
    enabledStatCategories: Array<{ statId: number; name: string; displayName: string; abbr: string }>;
  };
}

interface ChatRequest {
  userId: string;
  leagueId: string;
  userMessage: string;
  leagueContext: LeagueContext;
  includeHistory: boolean;
}

interface StructuredResponse {
  response: string;
  suggestions?: string[];
  stats?: any;
  reasoning?: string;
}

serve(async (req) => {
  console.log("[INFO] New request:", req.method, req.url);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required env vars");
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    let requestBody: ChatRequest;

    try {
      requestBody = await req.json();
      console.log("[INPUT] User:", requestBody.userId, "League:", requestBody.leagueId);
    } catch (e) {
      throw new Error("Invalid JSON");
    }

    const { userId, leagueId, userMessage, leagueContext, includeHistory } = requestBody;

    if (!userId || !leagueId || !userMessage?.trim()) {
      throw new Error("Missing fields");
    }

    // === Auth Check ===
    const { data: token } = await supabaseClient
      .from("yahoo_tokens")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (!token) throw new Error("Unauthorized");

    // === Load History (Only if includeHistory) ===
    let historyMessages: ChatMessage[] = [];
    if (includeHistory) {
      const { data } = await supabaseClient
        .from("fantasy_chat_messages")
        .select("message_role, message_content")
        .eq("user_id", userId)
        .eq("league_id", leagueId)
        .order("created_at", { ascending: true })
        .limit(8); // Last 4 exchanges

      if (data) {
        historyMessages = data.map(m => ({
          role: m.message_role as "user" | "assistant",
          content: m.message_content,
        }));
        console.log(`[HISTORY] Loaded ${historyMessages.length} messages`);
      }
    }

    // === Build FULL League Context ===
    const userPlayers = leagueContext.userTeam.players.map(p => p.name).join(", ");
    const opponentTeams = leagueContext.otherTeams
      .map(t => `${t.name}: ${t.players.map(p => p.name).join(", ")}`)
      .join("\n");

    const statCategories = leagueContext.leagueSettings?.enabledStatCategories
      .map(c => c.abbr || c.displayName)
      .join(", ") || "Standard 9-cat";

    const matchup = leagueContext.currentMatchup
      ? `Week ${leagueContext.currentMatchup.weekNumber} vs ${leagueContext.currentMatchup.opponent}`
      : "No matchup";

    // === SYSTEM PROMPT: Strict, Contextual, JSON-Only ===
    const systemPrompt = `You are a fantasy basketball expert AI. You have full context of the user's league.

CRITICAL RULES:
- NEVER refer to previous questions unless explicitly asked
- Answer ONLY the current user question
- Use the EXACT league data below
- Respond ONLY in valid JSON
- NO extra text, NO markdown

League: ${leagueContext.leagueName}
Your Team: ${leagueContext.userTeam.name}
Your Players: ${userPlayers}
Current Matchup: ${matchup}
Stat Categories: ${statCategories}

Opponent Rosters:
${opponentTeams}

Question: "${userMessage}"

Respond in this EXACT JSON format:
{
  "response": "Direct answer",
  "suggestions": ["Action 1", "Action 2"],
  "reasoning": "Why this works",
  "stats": {}
}`;

    // === Build Message Chain ===
    const messages: any[] = [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      { role: "user", content: userMessage },
    ];

    console.log("[OPENAI] Sending:", messages.length, "messages");

    // === Call OpenAI ===
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.6,
        max_tokens: 800,
        response_format: { type: "json_object" },
      }),
    });

    const raw = await response.text();
    console.log("[OPENAI STATUS]", response.status);
    console.log("[OPENAI RAW]", raw.substring(0, 600));

    if (!response.ok) throw new Error("OpenAI failed");

    const data = JSON.parse(raw);
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content");

    console.log("[OPENAI OUTPUT]", content.substring(0, 400));

    // === Parse JSON ===
    let result: StructuredResponse;
    try {
      result = JSON.parse(content);
      if (!result.response) throw new Error("No response field");
    } catch {
      result = {
        response: content,
        suggestions: [],
        reasoning: "Failed to parse JSON",
        stats: {},
      };
    }

    // === Save to DB ===
    await supabaseClient.from("fantasy_chat_messages").insert([
      { user_id: userId, league_id: leagueId, message_role: "user", message_content: userMessage },
      { user_id: userId, league_id: leagueId, message_role: "assistant", message_content: JSON.stringify(result) },
    ]);

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[ERROR]", error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});