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
        .limit(10); // Last 5 exchanges

      if (data && data.length > 0) {
        historyMessages = data.map(m => {
          let content = m.message_content;
          // Parse assistant messages (stored as JSON) back to readable text
          if (m.message_role === "assistant") {
            try {
              const parsed = JSON.parse(content);
              // Extract the main response - include key player/team names for context
              content = parsed.response || content;
              // If the response mentions a player name, include it for better context
              // This helps with pronoun resolution
            } catch {
              // If parsing fails, use the content as-is
              content = m.message_content;
            }
          }
          return {
            role: m.message_role as "user" | "assistant",
            content: content.trim(),
          };
        }).filter(m => m.content.length > 0); // Remove empty messages
        
        console.log(`[HISTORY] Loaded ${historyMessages.length} messages`);
        historyMessages.forEach((m, i) => {
          console.log(`[HISTORY ${i}] ${m.role}: ${m.content.substring(0, 80)}...`);
        });
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

    // === SYSTEM PROMPT: Contextual, Conversation-Aware, JSON-Only ===
    const historyNote = historyMessages.length > 0 
      ? `\n\nCRITICAL: You will see conversation history below. When the user uses pronouns (his, her, him, them, it, that, this, their), they ALWAYS refer to the most recently mentioned entity in the conversation history.

EXAMPLE:
- User: "Who is the best player on my team?"
- Assistant: "Donovan Mitchell is the best player..."
- User: "what are his stats?" → "his" = Donovan Mitchell (from the previous assistant message)

RULE: If you mentioned a player/team/entity in your previous response, and the user asks about "him", "his", "their", "that", etc., they're referring to what you just mentioned. NEVER ask for clarification - use the conversation history to identify the referent.` 
      : "";

    const systemPrompt = `You are a fantasy basketball expert AI assistant. You have access to the user's league data and the full conversation history.

${historyNote}

CRITICAL RULES:
- When the user uses ANY pronoun (his, her, him, them, it, that, this, their, etc.), ALWAYS look at the conversation history to find what they're referring to
- The MOST RECENT mention in the conversation (especially in YOUR previous response) is what pronouns refer to
- Be conversational and natural while maintaining accuracy
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

Respond in this EXACT JSON format:
{
  "response": "Direct answer that uses conversation context when needed",
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
    if (historyMessages.length > 0) {
      console.log("[OPENAI] History included:", historyMessages.map(m => `${m.role}: ${m.content.substring(0, 50)}...`).join(" | "));
    }

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