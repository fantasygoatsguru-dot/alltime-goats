// fantasy-chat — FULLY RESTORED + RAG + BULLETPROOF
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// === RAG ===
async function getRelevantKnowledge(query: string): Promise<string> {
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: query,
      }),
    });
    if (!res.ok) return "";
    const { data } = await res.json();
    const embedding = data[0].embedding;

    const { data: matches } = await supabase.rpc("match_knowledge", {
      query_embedding: embedding,
      match_count: 4,
    });

    if (!matches?.length) return "";
    return matches.map((m: any) => m.content.trim()).join("\n\n");
  } catch (e) {
    console.error("RAG failed:", e);
    return "";
  }
}

// === MAIN ===
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  let body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ success: false, error: "Invalid JSON" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { userId, leagueId, userMessage, leagueContext, includeHistory = true } = body;

  try {
    // === 1. Auth ===
    const { data: token } = await supabase
      .from("yahoo_tokens")
      .select("user_id")
      .eq("user_id", userId)
      .single();
    if (!token) throw new Error("Unauthorized");

    // === 2. History ===
    let history: any[] = [];
    if (includeHistory) {
      const { data } = await supabase
        .from("fantasy_chat_messages")
        .select("message_role, message_content")
        .eq("user_id", userId)
        .eq("league_id", leagueId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data?.length) {
        history = data.reverse().map(m => ({
          role: m.message_role,
          content: m.message_role === "assistant"
            ? JSON.parse(m.message_content).response || m.message_content
            : m.message_content,
        }));
      }
    }

    // === 3. RAG ===
    const rag = await getRelevantKnowledge(userMessage);
    const formatPlayer = (p: any) => {
      // Safety first — if no player or no name, just return "Unknown"
      if (!p || !p.name) return "Unknown Player";
    
      // If no stats at all → just return name
      if (!p.stats) return p.name;
    
      const s = p.stats;
    
      // Helper to safely get number with fallback
      const num = (val: any, fallback = 0) => {
        if (val === null || val === undefined) return fallback;
        return typeof val === "number" ? val : fallback;
      };
    
      // Base stats
      const points = num(s.points, 0).toFixed(1);
      const reb = num(s.rebounds, 0).toFixed(1);
      const ast = num(s.assists, 0).toFixed(1);
      const stl = num(s.steals, 0).toFixed(1);
      const blk = num(s.blocks, 0).toFixed(1);
    
      const basic = `${points}p ${reb}r ${ast}a ${stl}s ${blk}b`;
    
      // Z-scores and totalValue (only if they exist)
      const extras: string[] = [];
    
      if (s.totalValue !== null && s.totalValue !== undefined) {
        extras.push(`TV:${num(s.totalValue).toFixed(2)}`);
      }
    
      const z = (val: any, label: string) => {
        const n = num(val);
        if (n !== 0) extras.push(`${label}:${n.toFixed(1)}z`);
      };
    
      z(s.pointsZ, "PTS");
      z(s.reboundsZ, "REB");
      z(s.assistsZ, "AST");
      z(s.stealsZ, "STL");
      z(s.blocksZ, "BLK");
      z(s.threePointersZ, "3PM");
      z(s.fgPercentageZ, "FG%");
      z(s.ftPercentageZ, "FT%");
      z(s.turnoversZ, "TO");
    
      const extraStr = extras.length > 0 ? ` [${extras.join(" ")}]` : "";
    
      return `${p.name} (${basic}${extraStr})`;
    };

    const userPlayers = leagueContext.userTeam.players.map(formatPlayer).join(", ");
    const userTeamMgr = leagueContext.userTeam.managerNickname ? ` (${leagueContext.userTeam.managerNickname})` : "";
    
    const opponentTeams = leagueContext.otherTeams
      .map((t: any) => {
        const mgr = t.managerNickname ? ` (${t.managerNickname})` : "";
        const players = t.players.map(formatPlayer).join(", ");
        return `${t.name}${mgr}: ${players}`;
      })
      .join("\n");

    const matchup = leagueContext.currentMatchup
      ? `Week ${leagueContext.currentMatchup.weekNumber} vs ${leagueContext.currentMatchup.opponent}`
      : "No active matchup";

    const cats = leagueContext.leagueSettings?.enabledStatCategories
      ?.map((c: any) => c.abbr || c.displayName)
      .join(", ") || "PTS, REB, AST, STL, BLK, 3PM, FG%, FT%, TO";

    const userPlayerList = leagueContext.userTeam.players.map((p: any) => p.name).join(", ");

    // === 5. SYSTEM PROMPT — BEST OF BOTH WORLDS ===
    const systemPrompt = `You are the #1 fantasy basketball AI in the world.

CRITICAL LEAGUE DATA (USE THIS FIRST):
League: ${leagueContext.leagueName}
Your Team: ${leagueContext.userTeam.name}${userTeamMgr}
Your Players (NEVER suggest these): ${userPlayers}
Current Matchup: ${matchup}
Scoring Categories: ${cats}

TRADE/STREAM TARGETS ONLY FROM THESE TEAMS:
${opponentTeams}

PRONOUN RULES:
- "he/him/his/that/this/them" = most recent player/team mentioned in conversation
- NEVER ask "who do you mean?" — use history

NUMBERS RULES:
- Always use totalValue and z-scores
- Example: "Jalen Brunson (TV:7.2, PTS:2.1z, AST:3.0z)"

RAG KNOWLEDGE (use only if relevant):
${rag || "None"}

YOUR OWN PLAYERS: ${userPlayerList}

Respond ONLY in valid JSON:
{
  "response": "Natural answer with numbers and z-scores",
  "suggestions": ["Stream Jarrett Allen (TV:6.8, BLK:2.9z)"],
  "reasoning": "Detailed numerical breakdown"
}`;

    // === 6. GPT CALL ===
    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: userMessage },
    ];

    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 1200,
        response_format: { type: "json_object" },
      }),
    });

    if (!gptRes.ok) {
      const err = await gptRes.text();
      throw new Error("GPT failed: " + err);
    }

    const { choices } = await gptRes.json();
    const content = choices[0].message.content;

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { response: content, suggestions: [], reasoning: "JSON parse failed" };
    }

    // === 7. SAVE ===
    await supabase.from("fantasy_chat_messages").insert([
      { user_id: userId, league_id: leagueId, message_role: "user", message_content: userMessage },
      { user_id: userId, league_id: leagueId, message_role: "assistant", message_content: JSON.stringify(result) },
    ]);

    // === 8. USAGE (FIXED) ===
    try {
      const { data: usage } = await supabase
        .from("user_usage")
        .select("chat_queries_count")
        .eq("user_id", userId)
        .single();

      const newCount = usage ? (usage.chat_queries_count || 0) + 1 : 1;

      if (usage) {
        await supabase
          .from("user_usage")
          .update({ chat_queries_count: newCount, last_chat_query_at: new Date().toISOString() })
          .eq("user_id", userId);
      } else {
        await supabase
          .from("user_usage")
          .insert({ user_id: userId, chat_queries_count: 1, last_chat_query_at: new Date().toISOString() });
      }
    } catch (e) {
      console.error("Usage update failed (non-critical):", e);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("FATAL:", error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});