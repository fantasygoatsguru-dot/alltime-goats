// FantasyChat.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  IconButton,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Send as SendIcon,
  Refresh as RefreshIcon,
  Psychology as BrainIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useLeague } from "../contexts/LeagueContext";
import { supabase, CURRENT_SEASON } from "../utils/supabase";

const FantasyChat = () => {
  const { user } = useAuth();
  const { selectedLeague, leagueTeams, userTeamPlayers } = useLeague();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showContext, setShowContext] = useState(true);
  const [leagueSettings, setLeagueSettings] = useState({});
  const [playerStats, setPlayerStats] = useState({});

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (user?.userId && selectedLeague) {
      loadChatHistory();
      loadLeagueSettings();
      loadPlayerStats();
    }
  }, [user?.userId, selectedLeague, leagueTeams, userTeamPlayers]);

  const loadChatHistory = async () => {
    try {
      const { data } = await supabase
        .from("fantasy_chat_messages")
        .select("*")
        .eq("user_id", user.userId)
        .eq("league_id", selectedLeague)
        .order("created_at", { ascending: true })
        .limit(50);

      if (data?.length) {
        const formatted = data.map((msg) => ({
          role: msg.message_role,
          content: msg.message_role === "assistant"
            ? JSON.parse(msg.message_content)
            : msg.message_content,
          timestamp: msg.created_at,
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.error("History error:", err);
    }
  };

  const loadLeagueSettings = async () => {
    try {
      const { data } = await supabase.functions.invoke("yahoo-fantasy-api", {
        body: { action: "getLeagueSettings", userId: user.userId, leagueId: selectedLeague },
      });
      setLeagueSettings(data || {});
    } catch {
      setLeagueSettings({});
    }
  };

  const loadPlayerStats = async () => {
    if (!leagueTeams?.length) return;
    const ids = new Set();
    userTeamPlayers.forEach((p) => p.nbaPlayerId && ids.add(p.nbaPlayerId));
    leagueTeams.forEach((t) => t.players?.forEach((p) => p.nbaPlayerId && ids.add(p.nbaPlayerId)));

    if (!ids.size) return;

    const { data } = await supabase
      .from("player_season_averages")
      .select("player_id, points_per_game, total_value")
      .eq("season", CURRENT_SEASON)
      .in("player_id", Array.from(ids));

    const map = {};
    data?.forEach((r) => {
      map[r.player_id] = { points: r.points_per_game || 0, totalValue: r.total_value || 0 };
    });
    setPlayerStats(map);
  };

  const buildLeagueContext = () => {
    const userTeam = leagueTeams?.find((t) => t.is_owned_by_current_login);
    const others = leagueTeams?.filter((t) => !t.is_owned_by_current_login) || [];

    // Find current matchup
    const currentMatchupObj = userTeam?.matchups?.find(m => m.is_current) ||
                               userTeam?.matchups?.[0];

    return {
      leagueName: leagueSettings?.leagueName || "Your League",
      leagueSettings: {
        scoringType: leagueSettings?.scoring_type || "head-to-head",
        enabledStatCategories: leagueSettings?.settings?.stat_categories?.stats || [],
      },
      userTeam: {
        name: userTeam?.name || "Your Team",
        managerNickname: userTeam?.manager_nickname,
        players: userTeamPlayers.map((p) => ({
          name: p.name,
          nbaPlayerId: p.nbaPlayerId,
          stats: playerStats[p.nbaPlayerId] || null,
        })),
      },
      otherTeams: others.map((t) => ({
        name: t.name,
        managerNickname: t.manager_nickname,
        players: (t.players || []).map((p) => ({
          name: p.name,
          nbaPlayerId: p.nbaPlayerId,
          stats: playerStats[p.nbaPlayerId] || null,
        })),
      })),
      currentMatchup: currentMatchupObj ? {
        weekNumber: currentMatchupObj.week,
        opponent: currentMatchupObj.opponent_team_name || "Unknown Opponent",
      } : null,
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user?.userId || !selectedLeague) return;

    const userMsg = inputMessage.trim();
    setInputMessage("");
    setError(null);
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: userMsg, timestamp: new Date().toISOString() }]);

    try {
      const context = buildLeagueContext();

      const { data: res, error: invokeErr } = await supabase.functions.invoke("fantasy-chat", {
        body: {
          userId: user.userId,
          leagueId: selectedLeague,
          userMessage: userMsg,
          leagueContext: context,
          includeHistory: true,
        },
      });

      if (invokeErr) throw invokeErr;
      if (!res?.success) throw new Error(res?.error || "AI failed");

      const aiContent = res.data;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiContent, timestamp: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error("Send error:", err);
      setError(err.message || "Failed to get response");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = async () => {
    await supabase
      .from("fantasy_chat_messages")
      .delete()
      .eq("user_id", user.userId)
      .eq("league_id", selectedLeague);
    setMessages([]);
  };

  if (!selectedLeague) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Alert severity="info">Connect to Yahoo Fantasy to use AI Assistant</Alert>
      </Box>
    );
  }

  const ctx = buildLeagueContext();

  // CLEAN & SAFE TEXT EXTRACTOR
  const safeText = (obj) => {
    if (!obj) return "No response";
    if (typeof obj === "string") return obj;
    if (obj.response) return obj.response;
    if (obj.answer) return obj.answer;
    if (obj.message) return obj.message;
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return "[Response]";
    }
  };

  return (
    <Box sx={{ p: 3, background: "#fafafa", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <BrainIcon sx={{ fontSize: 40, color: "#1976d2" }} />
        <Box>
          <Typography variant="h4" sx={{ color: "#1976d2", fontWeight: 600 }}>
            Fantasy AI Assistant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {ctx.userTeam.name} {ctx.currentMatchup && `vs ${ctx.currentMatchup.opponent}`}
          </Typography>
        </Box>
        <IconButton onClick={() => setShowContext(!showContext)}>
          <InfoIcon />
        </IconButton>
        <IconButton onClick={handleResetChat} color="error">
          <RefreshIcon />
        </IconButton>
      </Box>

      {showContext && (
        <Paper sx={{ p: 2, mb: 2, background: "#e3f2fd" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1976d2" }}>
            Current Context
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
            <Chip label={ctx.leagueName} color="primary" size="small" />
            {ctx.currentMatchup && (
              <Chip label={`Week ${ctx.currentMatchup.weekNumber} vs ${ctx.currentMatchup.opponent}`} size="small" />
            )}
            <Chip label={`${ctx.userTeam.players.length} players`} size="small" />
          </Box>
        </Paper>
      )}

      {messages.length === 0 && !isLoading && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: "#1976d2", fontWeight: 600, mb: 2 }}>
            Try asking:
          </Typography>
          {[
            "How’s my matchup this week?",
            "What punt strategy should I use?",
            "Who should I trade for?",
            "Who should I stream?",
            "What are my team’s biggest weaknesses?",
          ].map((q) => (
            <Button
              key={q}
              variant="outlined"
              fullWidth
              sx={{ mb: 1, justifyContent: "flex-start", textTransform: "none" }}
              onClick={() => setInputMessage(q)}
            >
              {q}
            </Button>
          ))}
        </Paper>
      )}

      <Paper sx={{ flexGrow: 1, p: 2, mb: 2, maxHeight: "60vh", overflowY: "auto", background: "#fff" }}>
        {messages.length === 0 && !isLoading && (
          <Typography color="text.secondary" textAlign="center" mt={10}>
            Start chatting!
          </Typography>
        )}

        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              mb: 2,
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
            }}
          >
            <Box
              sx={{
                maxWidth: "80%",
                p: 2,
                borderRadius: 2,
                background: msg.role === "user" ? "#e3f2fd" : "#f5f5f5",
                border: "1px solid",
                borderColor: msg.role === "user" ? "#1976d2" : "#e0e0e0",
              }}
            >
              {msg.role === "user" ? (
                <Typography>{msg.content}</Typography>
              ) : (
                <Box>
                  <Typography sx={{ whiteSpace: "pre-wrap", mb: 2 }}>
                    {safeText(msg.content)}
                  </Typography>

                  {msg.content?.suggestions?.length > 0 && (
                    <Box sx={{ mt: 2, p: 2, background: "#e8f5e8", borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "#2e7d32" }}>
                        Suggestions
                      </Typography>
                      <List dense>
                        {msg.content.suggestions.map((s, idx) => (
                          <ListItem key={idx} sx={{ py: 0 }}>
                            <ListItemText primary={`• ${s}`} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} />
            <Typography>Thinking...</Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Paper>

      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
          placeholder="Ask anything about your fantasy team..."
          disabled={isLoading}
          multiline
          maxRows={3}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          sx={{ px: 4 }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default FantasyChat;