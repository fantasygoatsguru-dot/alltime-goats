// index.ts (Deno deploy / Supabase edge function)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

function safeJSONParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function extractJSONFromText(text: string) {
  // Try to extract first JSON object from text
  const m = text.match(/\{[\s\S]*\}$/m) || text.match(/\{[\s\S]*?\}/m);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch {
    // best-effort: sanitize common mistakes (single quotes -> double quotes)
    const replaced = m[0].replace(/(\r\n|\n|\r)/g, " ").replace(/'/g, '"');
    try {
      return JSON.parse(replaced);
    } catch {
      return null;
    }
  }
}

function normalizePlayerName(n: string) {
  return n ? n.toLowerCase().replace(/\./g, "").trim() : "";
}

function findMentionedPlayers(userMessage: string, allPlayers: string[]) {
  const msg = userMessage.toLowerCase();
  const found = new Set<string>();
  for (const p of allPlayers) {
    const n = p.toLowerCase();
    // simple contains — this will find "trey murphy" even if user typed "trade Trey Murphy"
    if (msg.includes(n) || msg.includes(n.split(" ")[n.split(" ").length - 1])) {
      found.add(p);
    }
  }
  return Array.from(found);
}

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
      match_count: 3,
    });

    if (!matches?.length) return "";
    return matches.map((m: any) => m.content.trim()).join("\n\n");
  } catch (e) {
    console.error("RAG failed:", e);
    return "";
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: "Invalid JSON body" }), { status: 400, headers: corsHeaders });
  }

  const { userId, leagueId, userMessage, leagueContext, includeHistory = true } = body;

  if (!userId || !leagueId || !userMessage) {
    return new Response(JSON.stringify({ success: false, error: "Missing parameters" }), { status: 400, headers: corsHeaders });
  }

  // === 1. Auth / quick guard
  try {
    const { data: token } = await supabase
      .from("yahoo_tokens")
      .select("user_id")
      .eq("user_id", userId)
      .single();
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
  } catch (e) {
    console.error("Auth check error:", e);
    // proceed but mark unauthorized (fail safe)
    return new Response(JSON.stringify({ success: false, error: "Auth failed" }), { status: 500, headers: corsHeaders });
  }

  // === 2. History
  let history: any[] = [];
  if (includeHistory) {
    try {
      const { data } = await supabase
        .from("fantasy_chat_messages")
        .select("message_role, message_content")
        .eq("user_id", userId)
        .eq("league_id", leagueId)
        .order("created_at", { ascending: false })
        .limit(6);

      if (data?.length) {
        history = data.reverse().map((m: any) => {
          if (m.message_role === "assistant") {
            const parsed = safeJSONParse(m.message_content);
            return { role: "assistant", content: parsed ? parsed : ({ response: m.message_content }) };
          }
          return { role: "user", content: m.message_content };
        });
      }
    } catch (e) {
      console.error("History load failed:", e);
    }
  }

  // === 3. Build player stats DB from leagueContext (UI store) but only keep relevant players
  const allPlayersList: string[] = [];
  try {
    const gather = (arr) => (arr || []).forEach(p => {
      if (p?.name && !allPlayersList.includes(p.name)) allPlayersList.push(p.name);
    });

    gather(leagueContext?.userTeam?.players || []);
    for (const t of (leagueContext?.otherTeams || [])) gather(t.players || []);
    gather(leagueContext?.currentMatchup?.team1?.players || []);
    gather(leagueContext?.currentMatchup?.team2?.players || []);
  } catch {
    // fallback empty
  }

  // determine mentioned players from user message
  const mentioned = findMentionedPlayers(userMessage || "", allPlayersList);

  // Always include:
  // - all players on user's team
  // - all players in current matchup
  const alwaysInclude = new Set<string>();
  (leagueContext?.userTeam?.players || []).forEach(p => p?.name && alwaysInclude.add(p.name));
  (leagueContext?.currentMatchup?.team1?.players || []).forEach(p => p?.name && alwaysInclude.add(p.name));
  (leagueContext?.currentMatchup?.team2?.players || []).forEach(p => p?.name && alwaysInclude.add(p.name));
  mentioned.forEach(p => alwaysInclude.add(p));

  // Build filtered player stats DB
  const playerStatsDb: Record<string, any> = {};
  try {
    const addIfPresent = (playerArray) => (playerArray || []).forEach(p => {
      if (!p || !p.name) return;
      if (!alwaysInclude.has(p.name)) return;
      if (!p.stats) return;
      playerStatsDb[p.name] = {
        points: (p.stats.points ?? 0),
        rebounds: (p.stats.rebounds ?? 0),
        assists: (p.stats.assists ?? 0),
        steals: (p.stats.steals ?? 0),
        blocks: (p.stats.blocks ?? 0),
        threePointers: (p.stats.threePointers ?? 0),
        fieldGoalPercentage: (p.stats.fieldGoalPercentage ?? 0),
        freeThrowPercentage: (p.stats.freeThrowPercentage ?? 0),
        turnovers: (p.stats.turnovers ?? 0),
        totalValue: (p.stats.totalValue ?? 0),
        pointsZ: (p.stats.pointsZ ?? 0),
        reboundsZ: (p.stats.reboundsZ ?? 0),
        assistsZ: (p.stats.assistsZ ?? 0),
        stealsZ: (p.stats.stealsZ ?? 0),
        blocksZ: (p.stats.blocksZ ?? 0),
        threePointersZ: (p.stats.threePointersZ ?? 0),
        fieldGoalPercentageZ: (p.stats.fieldGoalPercentageZ ?? 0),
        freeThrowPercentageZ: (p.stats.freeThrowPercentageZ ?? 0),
        turnoversZ: (p.stats.turnoversZ ?? 0),
      };
    });

    addIfPresent(leagueContext?.userTeam?.players || []);
    for (const t of (leagueContext?.otherTeams || [])) addIfPresent(t.players || []);
    addIfPresent(leagueContext?.currentMatchup?.team1?.players || []);
    addIfPresent(leagueContext?.currentMatchup?.team2?.players || []);
  } catch (e) {
    console.error("playerStatsDb build failed:", e);
  }

  // === 4. RAG: small / optional
  const rag = await getRelevantKnowledge(userMessage);

  // === 5. Build a concise structured system prompt
  const compactContext = {
    leagueName: leagueContext?.leagueName || "Your League",
    scoringType: leagueContext?.leagueSettings?.scoringType || "head-to-head",
    enabledCategories: (leagueContext?.leagueSettings?.enabledStatCategories || []).map((c: any) => c.abbr || c.displayName || c),
    userTeam: {
      name: leagueContext?.userTeam?.name || "Your Team",
      managerNickname: leagueContext?.userTeam?.managerNickname || null,
      players: (leagueContext?.userTeam?.players || []).map((p: any) => p?.name || null).filter(Boolean),
    },
    currentMatchup: leagueContext?.currentMatchup ? {
      week: leagueContext.currentMatchup.week || null,
      team1: { name: leagueContext.currentMatchup.team1?.name || null },
      team2: { name: leagueContext.currentMatchup.team2?.name || null },
      projection: leagueContext.currentMatchup.projection || null,
    } : null,
    playerStatsDbKeys: Object.keys(playerStatsDb),
  };

  // System prompt — short, precise, instructs to return strict JSON only
  const puntStrategy = leagueContext?.puntStrategy || null;
  
  const systemPrompt = `
You are an expert fantasy basketball assistant. Use only the structured context below to answer. NEVER invent player statistics. Respond STRICTLY with a JSON object (no extra commentary outside JSON).

---CONTEXT---
${JSON.stringify(compactContext)}
---PLAYER_STATS_DB---
(Only these players are available with precise numeric stats)
${JSON.stringify(playerStatsDb)}
---PUNT STRATEGIES---
${puntStrategy || "None - user is not punting any categories"}
---RAG---
${rag ? rag : "None"}
---END CONTEXT---

JSON schema required:
{
  "response": "string",                 // natural language answer (short paragraph(s))
  "suggestions": ["string"],            // actionable suggestions, e.g. "Trade X for Y", "Stream Z"
  "reasoning": "string (optional)",     // concise reasoning for suggestions
  "statTables": [                       // optional, include ONLY players you provide numeric stats for
     { "playerName": "string", "stats": { "points": number, "rebounds": number, "assists": number, "steals": number, "blocks": number, "totalValue": number (optional), "pointsZ": number (optional) } }
  ]
}

Rules:
- Only mention players present in the PLAYER_STATS_DB section above.
- When you include numeric stats, those numbers must come from PLAYER_STATS_DB exactly.
- ALWAYS include a statTable for EVERY player you mention with numbers, and the stats object MUST contain ALL fields from PLAYER_STATS_DB (points, rebounds, assists, steals, blocks, threePointers, fieldGoalPercentage, freeThrowPercentage, turnovers, totalValue, and all z-scores) — even if values are 0 or not directly relevant to the response.
- ALWAYS in a trade only suggest players from the user's team for players from the other team. NEVER suggest players from the same team.
* ALWAYS check ---PUNT STRATEGIES--- first when suggesting trades.
- For trades involving punt strategies:
  * When YOU are punting a category (e.g., assists), you want to RECEIVE players with low contribution in that category and are willing to GIVE AWAY players with high contribution in that category.
  * When the OPPONENT is punting a category (e.g., FG%), they do NOT value that category — they are willing to GIVE AWAY players with strong performance in it and prefer to RECEIVE players weak in it.
  * Adjust perceived value accordingly: A high-FG% player is worth MORE to a team punting FG% (because it doesn't hurt them), and worth LESS to a team that cares about FG%.
  * A low-assists player is ideal for a team punting assists — do NOT trade them away cheaply.
  * Always suggest trades where YOU (the user) benefit or at least break even given the punt strategies.
  * In suggestions and reasoning, clearly state how the punt strategies make the trade favorable for YOU.
- If asked for trades, produce reasonable value-similar trades: 
  * For 1-for-1, 2-for-2, 3-for-3, etc. totalValue difference must be <0.5. 
    * For larger differences, suggest multi-player packages (e.g., 2-for-1, 3-for-2, etc.) to balance totalValue within 0.5. In case of a discrepancy in totalValue, the team receiving more players in the trade should have the higher totalValue generally. 
  * Always explain fairness using totalValue comparisons in reasoning and suggestions.
- If the model cannot produce a valid JSON, return an object with "response" explaining the issue and empty arrays for suggestions/statTables.
`;

  // === 6. Build messages and call GPT
  const messagesToSend = [
    { role: "system", content: systemPrompt },
    ...history.map(h => ({ role: h.role, content: typeof h.content === "string" ? h.content : JSON.stringify(h.content) })),
    { role: "user", content: userMessage },
  ];

  try {
    const gptReq = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo", // use available modern model; replace with your preferred model
        messages: messagesToSend,
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!gptReq.ok) {
      const errText = await gptReq.text();
      console.error("GPT error:", errText);
      throw new Error("GPT call failed");
    }

    const gptJson = await gptReq.json();
    const raw = gptJson?.choices?.[0]?.message?.content || "";

    // Try parse JSON directly
    let result = safeJSONParse(raw);
    if (!result) {
      // Attempt to extract JSON object inside text
      result = extractJSONFromText(raw);
    }
    if (!result) {
      // As a last resort, return raw text inside response field
      result = {
        response: String(raw).slice(0, 1000),
        suggestions: [],
        reasoning: "Model did not return parseable JSON. Raw output provided.",
        statTables: [],
      };
    }

    // Validate statTables: ensure only players from our playerStatsDb are present and numeric values
    if (Array.isArray(result.statTables)) {
      result.statTables = result.statTables.filter((st: any) => {
        if (!st?.playerName || !playerStatsDb[st.playerName]) return false;
        // Ensure numeric stats only — coerce to numbers where possible
        const cleanStats: any = {};
        const allowedKeys = [
          "points", "rebounds", "assists", "steals", "blocks",
          "threePointers", "fieldGoalPercentage", "freeThrowPercentage", "turnovers",
          "totalValue",
          "pointsZ", "reboundsZ", "assistsZ", "stealsZ", "blocksZ",
          "threePointersZ", "fieldGoalPercentageZ", "freeThrowPercentageZ", "turnoversZ"
        ];
        for (const k of allowedKeys) {
          if (st.stats?.hasOwnProperty(k) && typeof st.stats[k] === "number") {
            cleanStats[k] = st.stats[k];
          }
        }
        if (Object.keys(cleanStats).length === 0) return false;
        st.stats = cleanStats;
        return true;
      });
    } else {
      result.statTables = [];
    }

    // === 7. Persist conversation — insert user then assistant message with timestamps to preserve order
    const now = new Date();
    const userTs = new Date(now.getTime()).toISOString();
    const assistantTs = new Date(now.getTime() + 1).toISOString();

    try {
      await supabase.from("fantasy_chat_messages").insert({
        user_id: userId,
        league_id: leagueId,
        message_role: "user",
        message_content: userMessage,
        created_at: userTs,
      });

      await supabase.from("fantasy_chat_messages").insert({
        user_id: userId,
        league_id: leagueId,
        message_role: "assistant",
        message_content: JSON.stringify(result),
        created_at: assistantTs,
      });
    } catch (e) {
      console.error("DB insert failed:", e);
    }

    // === 8. Update usage counts (best-effort)
    (async () => {
      try {
        const { data: usage } = await supabase.from("user_usage").select("chat_queries_count").eq("user_id", userId).single();
        const newCount = usage ? (usage.chat_queries_count || 0) + 1 : 1;
        if (usage) {
          await supabase.from("user_usage").update({ chat_queries_count: newCount, last_chat_query_at: new Date().toISOString() }).eq("user_id", userId);
        } else {
          await supabase.from("user_usage").insert({ user_id: userId, chat_queries_count: 1, last_chat_query_at: new Date().toISOString() });
        }
      } catch (err) {
        console.error("Usage update failed:", err);
      }
    })();

    return new Response(JSON.stringify({ success: true, data: result }), { headers: corsHeaders });
  } catch (error) {
    console.error("FATAL:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: corsHeaders });
  }
});
