import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
    players: Array<{
      name: string;
      stats?: any;
    }>;
  };
  otherTeams: Array<{
    name: string;
    players: Array<{
      name: string;
    }>;
  }>;
  currentMatchup?: {
    opponent: string;
    weekNumber: number;
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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    // Use service role key to bypass RLS (security is handled by verifying userId exists in yahoo_tokens)
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const requestBody: ChatRequest = await req.json();
    const { userId, leagueId, userMessage, leagueContext, includeHistory } = requestBody;

    // Verify userId is provided
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Verify user has a valid Yahoo token (this confirms they're authenticated)
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from("yahoo_tokens")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (tokenError || !tokenData) {
      throw new Error("Unauthorized: No valid Yahoo token found for user");
    }

    // Get chat history if requested (last 10 messages)
    let chatHistory: ChatMessage[] = [];
    if (includeHistory) {
      const { data: messages, error } = await supabaseClient
        .from("fantasy_chat_messages")
        .select("message_role, message_content")
        .eq("user_id", userId)
        .eq("league_id", leagueId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && messages) {
        chatHistory = messages
          .reverse()
          .map((msg) => ({
            role: msg.message_role as "user" | "assistant" | "system",
            content: msg.message_content,
          }));
      }
    }

    // Build system prompt with league context
    const systemPrompt = `You are an expert fantasy basketball assistant. You help users make strategic decisions about their fantasy team.

League Context:
- League: ${leagueContext.leagueName} (ID: ${leagueContext.leagueId})
- User's Team: ${leagueContext.userTeam.name}
- User's Players: ${leagueContext.userTeam.players.map(p => p.name).join(", ")}
${leagueContext.currentMatchup ? `- Current Matchup: vs ${leagueContext.currentMatchup.opponent} (Week ${leagueContext.currentMatchup.weekNumber})` : ''}
- Other Teams: ${leagueContext.otherTeams.map(t => t.name).join(", ")}

Your responses should be:
1. Specific to the user's league and team
2. Data-driven and strategic
3. Actionable and clear
4. Formatted in a structured JSON format

Always respond in this JSON structure:
{
  "response": "Your main answer here",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "reasoning": "Brief explanation of your logic",
  "stats": {} // Optional: relevant stats if applicable
}

Focus on:
- Punt strategies (identifying categories to give up for dominance in others)
- Player valuations and trade recommendations
- Matchup analysis
- Streaming opportunities
- Statistical trends`;

    // Build messages array for Gemini
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...chatHistory,
      { role: "user", content: userMessage },
    ];

    // Call Gemini API
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    // Convert messages to Gemini format
    const geminiMessages = messages
      .filter(m => m.role !== "system")
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Add system prompt as first user message
    geminiMessages.unshift({
      role: "user",
      parts: [{ text: systemPrompt }],
    });
    geminiMessages.push({
      role: "model",
      parts: [{ text: "I understand. I'll provide fantasy basketball advice in the specified JSON format." }],
    });

    const geminiResponse = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,       {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const assistantMessage = geminiData.candidates[0]?.content?.parts[0]?.text || "I apologize, I couldn't generate a response.";

    // Try to parse as JSON, if it fails, wrap it in a structured format
    let structuredResponse: StructuredResponse;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = assistantMessage.match(/```json\n([\s\S]*?)\n```/) || 
                       assistantMessage.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : assistantMessage;
      
      structuredResponse = JSON.parse(jsonText);
    } catch (e) {
      // If parsing fails, create a structured response
      structuredResponse = {
        response: assistantMessage,
        suggestions: [],
        reasoning: "Generated response based on league context",
      };
    }

    // Save user message to database
    await supabaseClient.from("fantasy_chat_messages").insert({
      user_id: userId,
      league_id: leagueId,
      message_role: "user",
      message_content: userMessage,
    });

    // Save assistant response to database
    await supabaseClient.from("fantasy_chat_messages").insert({
      user_id: userId,
      league_id: leagueId,
      message_role: "assistant",
      message_content: JSON.stringify(structuredResponse),
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: structuredResponse,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in fantasy-chat function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

