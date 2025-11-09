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

    // Debug: Log request data
    console.log("User message:", userMessage);
    console.log("Matchup data received:", JSON.stringify(leagueContext.currentMatchup, null, 2));

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
        .limit(6); // Reduce history to prevent confusion

      if (data?.length) {
        history = data.reverse().map(m => ({
          role: m.message_role,
          content: m.message_role === "assistant"
            ? JSON.parse(m.message_content).response || m.message_content
            : m.message_content,
        }));
      }
    }
    
    console.log("Chat history length:", history.length);

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

    // Build detailed matchup information
    let matchup = "No active matchup";
    let matchupDetails = "";
    
    if (leagueContext.currentMatchup) {
      const m = leagueContext.currentMatchup;
      const week = m.week || m.weekNumber || "Unknown";
      const team1Name = m.team1?.name || "Team 1";
      const team2Name = m.team2?.name || "Team 2";
      
      matchup = `Week ${week}: ${team1Name} vs ${team2Name}`;
      
      // Build detailed matchup breakdown
      if (m.team1 && m.team2) {
        const team1Players = m.team1.players || [];
        const team2Players = m.team2.players || [];
        
        const formatMatchupPlayer = (p: any) => {
          const pos = p.position ? ` [${p.position}]` : "";
          const status = p.status ? ` (${p.status})` : "";
          return `${p.name}${pos}${status}`;
        };
        
        const team1List = team1Players.map(formatMatchupPlayer).join(", ");
        const team2List = team2Players.map(formatMatchupPlayer).join(", ");
        
        // Determine which team is the user's team
        const userTeamName = leagueContext.userTeam.name;
        const isTeam1User = team1Name === userTeamName || team1Name.includes(userTeamName) || userTeamName.includes(team1Name);
        const userTeamInMatchup = isTeam1User ? team1Name : team2Name;
        const opponentTeamInMatchup = isTeam1User ? team2Name : team1Name;
        const userTeamPlayersList = isTeam1User ? team1List : team2List;
        const opponentPlayersList = isTeam1User ? team2List : team1List;
        
        matchupDetails = `\n\nCURRENT MATCHUP DETAILS:
Your Team (${userTeamInMatchup}): ${userTeamPlayersList || "No players"}
Opponent (${opponentTeamInMatchup}): ${opponentPlayersList || "No players"}`;
        
        // Include projection if available
        if (m.projection) {
          const proj = m.projection;
          const userScore = isTeam1User ? (proj.team1Score || 0) : (proj.team2Score || 0);
          const opponentScore = isTeam1User ? (proj.team2Score || 0) : (proj.team1Score || 0);
          
          matchupDetails += `\n\nPROJECTION:
Your Score: ${userScore}
Opponent Score: ${opponentScore}`;
          
          if (proj.categoryResults) {
            const cats = Object.entries(proj.categoryResults)
              .map(([cat, result]: [string, any]) => {
                const userValue = isTeam1User ? (result.team1 || 0) : (result.team2 || 0);
                const opponentValue = isTeam1User ? (result.team2 || 0) : (result.team1 || 0);
                let winner = "TIE";
                if (result.winner === userTeamInMatchup) {
                  winner = "YOU";
                } else if (result.winner === opponentTeamInMatchup) {
                  winner = "OPPONENT";
                }
                return `${cat}: ${winner} (You: ${userValue} vs Opponent: ${opponentValue})`;
              })
              .join("\n");
            matchupDetails += `\nCategory Breakdown:\n${cats}`;
          }
        }
      }
    }

    const cats = leagueContext.leagueSettings?.enabledStatCategories
      ?.map((c: any) => c.abbr || c.displayName)
      .join(", ") || "PTS, REB, AST, STL, BLK, 3PM, FG%, FT%, TO";

    const userPlayerList = leagueContext.userTeam.players.map((p: any) => p.name).join(", ");

    // Create structured player stats database for AI reference
    const createPlayerStatsDb = () => {
      const allPlayers = [
        ...leagueContext.userTeam.players,
        ...leagueContext.otherTeams.flatMap((t: any) => t.players)
      ];
      
      return allPlayers.reduce((db: any, player: any) => {
        if (player.name && player.stats) {
          db[player.name] = {
            points: player.stats.points || 0,
            rebounds: player.stats.rebounds || 0,
            assists: player.stats.assists || 0,
            steals: player.stats.steals || 0,
            blocks: player.stats.blocks || 0,
            threePointers: player.stats.threePointers || 0,
            fieldGoalPercentage: (player.stats.fieldGoalPercentage || 0) * 100,
            freeThrowPercentage: (player.stats.freeThrowPercentage || 0) * 100,
            turnovers: player.stats.turnovers || 0,
            totalValue: player.stats.totalValue || 0,
            pointsZ: player.stats.pointsZ || 0,
            reboundsZ: player.stats.reboundsZ || 0,
            assistsZ: player.stats.assistsZ || 0,
            stealsZ: player.stats.stealsZ || 0,
            blocksZ: player.stats.blocksZ || 0,
            threePointersZ: player.stats.threePointersZ || 0,
            fieldGoalPercentageZ: player.stats.fieldGoalPercentageZ || 0,
            freeThrowPercentageZ: player.stats.freeThrowPercentageZ || 0,
            turnoversZ: player.stats.turnoversZ || 0,
          };
        }
        return db;
      }, {});
    };

    const playerStatsDb = createPlayerStatsDb();
    console.log("Player stats DB sample:", Object.keys(playerStatsDb).slice(0, 3));

    // === 5. SYSTEM PROMPT — BEST OF BOTH WORLDS ===
    const systemPrompt = `You are the #1 fantasy basketball AI in the world.

CRITICAL LEAGUE DATA (USE THIS FIRST):
League: ${leagueContext.leagueName}
Your Team: ${leagueContext.userTeam.name}${userTeamMgr}
Your Players (NEVER suggest these): ${userPlayers}
Current Matchup: ${matchup}${matchupDetails}
IMPORTANT: When asked about the matchup, use the matchup details above. You have full information about both teams, their players, positions, and statuses. Use this data to provide specific matchup analysis.
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

PLAYER STATS DATABASE (use these exact numbers for statTables):
${JSON.stringify(playerStatsDb, null, 2)}

CRITICAL INSTRUCTIONS:
1. IGNORE previous conversation if it contradicts current question (focus on what user JUST asked)
2. Answer the EXACT question being asked (pay attention to punt strategy specified - punt FT%, punt assists, etc.)
3. When mentioning player statistics with numbers, ALWAYS include a statTable with exact stats from the database above
4. Use the exact player names and stat values from the database
5. Only mention players that exist in the database above

Respond ONLY in valid JSON:
{
  "response": "Natural answer with numbers and z-scores",
  "suggestions": ["Stream Jarrett Allen (TV:6.8, BLK:2.9z)"],
  "reasoning": "Detailed numerical breakdown",
  "statTables": [
    {
      "playerName": "Giannis Antetokounmpo",
      "stats": {
        "points": 27.0,
        "rebounds": 11.0,
        "assists": 8.0,
        "steals": 1.2,
        "blocks": 1.1
      }
    }
  ]
}

statTables is an array of objects. Each object has:
- playerName: string (exact player name)
- stats: object with numeric values for points, rebounds, assists, steals, blocks (include only stats you mention in your response)
Only include statTables when you mention specific numeric statistics for players.`;

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

    // Debug: Log response
    console.log("AI Response:", JSON.stringify(result, null, 2));

    // === 7. SAVE ===
    // Insert messages sequentially to ensure proper ordering
    // Use explicit timestamps to guarantee order
    const now = new Date();
    const userTimestamp = now.toISOString();
    const assistantTimestamp = new Date(now.getTime() + 1).toISOString(); // 1ms later
    
    // First insert user message
    await supabase.from("fantasy_chat_messages").insert({
      user_id: userId,
      league_id: leagueId,
      message_role: "user",
      message_content: userMessage,
      created_at: userTimestamp,
    });
    
    // Then insert assistant message with slightly later timestamp
    await supabase.from("fantasy_chat_messages").insert({
      user_id: userId,
      league_id: leagueId,
      message_role: "assistant",
      message_content: JSON.stringify(result),
      created_at: assistantTimestamp,
    });

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