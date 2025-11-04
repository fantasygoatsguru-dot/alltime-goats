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

interface PlayerStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  threePointers: number;
  fieldGoalPercentage: number;
  freeThrowPercentage: number;
  turnovers: number;
  // Z-scores (standard deviations from mean)
  pointsZ?: number;
  reboundsZ?: number;
  assistsZ?: number;
  stealsZ?: number;
  blocksZ?: number;
  threePointersZ?: number;
  fgPercentageZ?: number;
  ftPercentageZ?: number;
  turnoversZ?: number;
  totalValue?: number; // Overall fantasy value score
}

interface LeagueContext {
  leagueId: string;
  leagueName: string;
  userTeam: {
    name: string;
    managerNickname?: string | null;
    players: Array<{ 
      name: string; 
      nbaPlayerId?: number | null;
      stats?: PlayerStats | null;
    }>;
  };
  otherTeams: Array<{
    name: string;
    managerNickname?: string | null;
    players: Array<{ 
      name: string; 
      nbaPlayerId?: number | null;
      stats?: PlayerStats | null;
    }>;
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
    const formatPlayerWithStats = (p: { name: string; stats?: PlayerStats | null }) => {
      if (p.stats) {
        const basicStats = `${p.stats.points.toFixed(1)} PTS, ${p.stats.rebounds.toFixed(1)} REB, ${p.stats.assists.toFixed(1)} AST, ${p.stats.steals.toFixed(1)} STL, ${p.stats.blocks.toFixed(1)} BLK`;
        
        // Include z-scores and total value if available
        if (p.stats.totalValue !== undefined && p.stats.totalValue !== null) {
          const zScores: string[] = [];
          if (p.stats.pointsZ !== undefined && p.stats.pointsZ !== null) zScores.push(`PTS z:${p.stats.pointsZ.toFixed(2)}`);
          if (p.stats.reboundsZ !== undefined && p.stats.reboundsZ !== null) zScores.push(`REB z:${p.stats.reboundsZ.toFixed(2)}`);
          if (p.stats.assistsZ !== undefined && p.stats.assistsZ !== null) zScores.push(`AST z:${p.stats.assistsZ.toFixed(2)}`);
          if (p.stats.stealsZ !== undefined && p.stats.stealsZ !== null) zScores.push(`STL z:${p.stats.stealsZ.toFixed(2)}`);
          if (p.stats.blocksZ !== undefined && p.stats.blocksZ !== null) zScores.push(`BLK z:${p.stats.blocksZ.toFixed(2)}`);
          if (p.stats.threePointersZ !== undefined && p.stats.threePointersZ !== null) zScores.push(`3PT z:${p.stats.threePointersZ.toFixed(2)}`);
          if (p.stats.fgPercentageZ !== undefined && p.stats.fgPercentageZ !== null) zScores.push(`FG% z:${p.stats.fgPercentageZ.toFixed(2)}`);
          if (p.stats.ftPercentageZ !== undefined && p.stats.ftPercentageZ !== null) zScores.push(`FT% z:${p.stats.ftPercentageZ.toFixed(2)}`);
          if (p.stats.turnoversZ !== undefined && p.stats.turnoversZ !== null) zScores.push(`TO z:${p.stats.turnoversZ.toFixed(2)}`);
          
          const zScoreStr = zScores.length > 0 ? ` [${zScores.join(', ')}]` : '';
          return `${p.name} (${basicStats}, Total Value: ${p.stats.totalValue.toFixed(2)}${zScoreStr})`;
        }
        
        return `${p.name} (${basicStats})`;
      }
      return p.name;
    };

    const userPlayers = leagueContext.userTeam.players.map(formatPlayerWithStats).join(", ");
    const userTeamManager = leagueContext.userTeam.managerNickname 
      ? ` (Manager: ${leagueContext.userTeam.managerNickname})` 
      : "";
    const opponentTeams = leagueContext.otherTeams
      .map(t => {
        const manager = t.managerNickname ? ` (Manager: ${t.managerNickname})` : "";
        const playersList = t.players.map(formatPlayerWithStats).join(", ");
        return `${t.name}${manager}: ${playersList}`;
      })
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

    // Build list of user's current players for exclusion
    const userPlayerNames = new Set(leagueContext.userTeam.players.map(p => p.name.toLowerCase()));
    const userPlayerList = leagueContext.userTeam.players.map(p => p.name).join(", ");

    const systemPrompt = `You are a fantasy basketball expert AI assistant. You have access to the user's league data and the full conversation history.

${historyNote}

CRITICAL RULES:
- When the user uses ANY pronoun (his, her, him, them, it, that, this, their, etc.), ALWAYS look at the conversation history to find what they're referring to
- The MOST RECENT mention in the conversation (especially in YOUR previous response) is what pronouns refer to

TRADE TARGET RULES (CRITICAL):
- When the user asks about "trade targets", "players to target", "who should I trade for", etc., you MUST ONLY suggest players from OTHER TEAMS (Opponent Rosters section below)
- NEVER suggest players that the user already owns (Your Players section below)
- The user's current players are: ${userPlayerList}
- If a player is in "Your Players", they CANNOT be a trade target - they are already on the user's team
- Trade targets must ONLY come from the "Opponent Rosters" section
- Always check if a player is already on the user's team before suggesting them as a trade target

NUMERICAL JUSTIFICATION RULES (CRITICAL):
- ALWAYS include numerical data and statistics when making recommendations or justifying answers
- When suggesting players, include their key stats (points, rebounds, assists, steals, blocks, percentages)
- When comparing players, provide specific numbers showing why one is better than another
- When recommending strategies, use numerical analysis (e.g., "Player X averages 25.3 PTS vs your team average of 20.1 PTS")
- Include percentages, averages, totals, or any relevant metrics that support your recommendations
- Use the player stats provided in the context to make data-driven recommendations
- Never make vague claims - always back them up with specific numbers from the available data

Z-SCORE AND TOTAL VALUE ANALYSIS (CRITICAL):
- Each player has z-scores (standard deviations from mean) for each stat category - these show how exceptional a player is in each category
- A positive z-score means the player is above average, negative means below average
- Example: points_z of 2.0 means the player scores 2 standard deviations above the mean (exceptional scorer)
- Each player also has a total_value score - this is their overall fantasy value across all categories
- When recommending players for trades, streaming, or punting strategies:
  - PRIORITIZE players with HIGH total_value scores - these are the most valuable overall
  - For PUNTING strategies: Look for players with HIGH z-scores in categories you're keeping, and LOW/NEGATIVE z-scores in categories you're punting. Mention values in the punting category in you response.
  - Example: If punting assists, target players with high points_z, rebounds_z, steals_z, blocks_z but low/negative assists_z
  - When comparing players, use total_value as the primary metric, then examine specific z-scores for category-specific needs
  - Players with high total_value but low z-scores in specific categories may be perfect for punting strategies
- ALWAYS mention z-scores and total_value when making player recommendations
- Example: "Player X has a total_value of 5.02 with excellent blocks_z (8.07) and rebounds_z (3.52), with a low assists_z (-0.52), making them ideal for a punt assists build"
- When user asks for team analysis, ensure to take into account all the players in the user's team, and it's z-scores. Be sure to mention explicit players and total values. When comparing to an opponent team mention the opponent team's numbers as well.
- Be conversational and natural while maintaining accuracy
- Use the EXACT league data below
- Respond ONLY in valid JSON
- NO extra text, NO markdown

League: ${leagueContext.leagueName}
Your Team: ${leagueContext.userTeam.name}${userTeamManager}
Your Players (YOU ALREADY OWN THESE - DO NOT SUGGEST THEM AS TRADE TARGETS): ${userPlayers}
Current Matchup: ${matchup}
Stat Categories: ${statCategories}

Opponent Rosters (THESE ARE TRADE TARGETS - ONLY SUGGEST PLAYERS FROM HERE):
${opponentTeams}

Respond in this EXACT JSON format:
{
  "response": "Direct answer with numerical justifications (include stats, averages, percentages, etc.)",
  "suggestions": ["Action 1 with numbers", "Action 2 with numbers"],
  "reasoning": "Why this works - include specific stats and numerical comparisons",
  "stats": {
    "comparisons": {},
    "averages": {},
    "percentages": {}
  }
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