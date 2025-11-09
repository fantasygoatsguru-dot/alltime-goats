// FantasyChat.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
  const { selectedLeague, leagueTeams, userTeamPlayers, currentMatchup } = useLeague();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showContext, setShowContext] = useState(true);
  const [leagueSettings, setLeagueSettings] = useState({});
  const [playerStats, setPlayerStats] = useState({});
  const [_matchupProjection, _setMatchupProjection] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChatHistory = useCallback(async () => {
    if (!user?.userId || !selectedLeague) return;
    try {
      const { data } = await supabase
        .from("fantasy_chat_messages")
        .select("id, message_role, message_content, created_at")
        .eq("user_id", user.userId)
        .eq("league_id", selectedLeague)
        .order("created_at", { ascending: true })
        .limit(50);

      if (data?.length) {
        const formatted = data
          .map((msg) => ({
            id: msg.id,
            role: msg.message_role,
            content: msg.message_role === "assistant"
              ? JSON.parse(msg.message_content)
              : msg.message_content,
            timestamp: msg.created_at,
          }))
          .sort((a, b) => {
            // First sort by timestamp
            const timeA = new Date(a.timestamp).getTime();
            const timeB = new Date(b.timestamp).getTime();
            if (timeA !== timeB) {
              return timeA - timeB;
            }
            // If timestamps are equal (or very close), sort by ID to maintain insertion order
            // UUIDs generated sequentially will maintain order
            return a.id.localeCompare(b.id);
          });
        setMessages(formatted);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("History error:", err);
    }
  }, [user?.userId, selectedLeague]);

  const loadLeagueSettings = useCallback(async () => {
    if (!user?.userId || !selectedLeague) return;
    try {
      const { data } = await supabase.functions.invoke("yahoo-fantasy-api", {
        body: { action: "getLeagueSettings", userId: user.userId, leagueId: selectedLeague },
      });
      setLeagueSettings(data || {});
    } catch {
      setLeagueSettings({});
    }
  }, [user?.userId, selectedLeague]);

  const loadPlayerStats = useCallback(async () => {
    if (!leagueTeams?.length) return;
    const ids = new Set();
    userTeamPlayers.forEach((p) => p.nbaPlayerId && ids.add(p.nbaPlayerId));
    leagueTeams.forEach((t) => t.players?.forEach((p) => p.nbaPlayerId && ids.add(p.nbaPlayerId)));

    if (!ids.size) return;

    const { data } = await supabase
      .from("player_season_averages")
      .select("player_id, points_per_game, rebounds_per_game, assists_per_game, steals_per_game, blocks_per_game, three_pointers_per_game, field_goal_percentage, free_throw_percentage, turnovers_per_game, total_value, points_z, rebounds_z, assists_z, steals_z, blocks_z, three_pointers_z, fg_percentage_z, ft_percentage_z, turnovers_z")
      .eq("season", CURRENT_SEASON)
      .in("player_id", Array.from(ids));

    const map = {};
    data?.forEach((r) => {
      map[r.player_id] = {
        points: r.points_per_game || 0,
        rebounds: r.rebounds_per_game || 0,
        assists: r.assists_per_game || 0,
        steals: r.steals_per_game || 0,
        blocks: r.blocks_per_game || 0,
        threePointers: r.three_pointers_per_game || 0,
        fieldGoalPercentage: r.field_goal_percentage || 0,
        freeThrowPercentage: r.free_throw_percentage || 0,
        turnovers: r.turnovers_per_game || 0,
        totalValue: r.total_value || 0,
        pointsZ: r.points_z || 0,
        reboundsZ: r.rebounds_z || 0,
        assistsZ: r.assists_z || 0,
        stealsZ: r.steals_z || 0,
        blocksZ: r.blocks_z || 0,
        threePointersZ: r.three_pointers_z || 0,
        fieldGoalPercentageZ: r.fg_percentage_z || 0,
        freeThrowPercentageZ: r.ft_percentage_z || 0,
        turnoversZ: r.turnovers_z || 0,
      };
    });
    setPlayerStats(map);
  }, [leagueTeams, userTeamPlayers]);

  useEffect(() => {
    if (user?.userId && selectedLeague) {
      loadChatHistory();
      loadLeagueSettings();
      loadPlayerStats();
    }
  }, [user?.userId, selectedLeague, loadChatHistory, loadLeagueSettings, loadPlayerStats]);

  const buildLeagueContext = () => {
    const userTeam = leagueTeams?.find((t) => t.is_owned_by_current_login);
    const others = leagueTeams?.filter((t) => !t.is_owned_by_current_login) || [];

    // Extract stat categories from league settings
    let enabledStatCategories = [];
    if (leagueSettings?.settings?.stat_categories?.stats) {
      enabledStatCategories = leagueSettings.settings.stat_categories.stats;
    } else if (leagueSettings?.stat_categories) {
      enabledStatCategories = Array.isArray(leagueSettings.stat_categories) 
        ? leagueSettings.stat_categories 
        : leagueSettings.stat_categories.stats || [];
    }

    // Build matchup context from fetched matchup data
    let matchupContext = null;
    if (currentMatchup) {
      matchupContext = {
        team1: {
          name: currentMatchup.team1?.name || "Team 1",
          players: (currentMatchup.team1?.players || []).map((p) => ({
            name: p.name,
            nbaPlayerId: p.nbaPlayerId,
            yahooPlayerId: p.yahooPlayerId,
            position: p.selectedPosition || p.selected_position,
            status: p.status,
          })),
        },
        team2: {
          name: currentMatchup.team2?.name || "Team 2",
          players: (currentMatchup.team2?.players || []).map((p) => ({
            name: p.name,
            nbaPlayerId: p.nbaPlayerId,
            yahooPlayerId: p.yahooPlayerId,
            position: p.selectedPosition || p.selected_position,
            status: p.status,
          })),
        },
        week: currentMatchup.week || null,
        isCurrent: currentMatchup.is_current || false,
      };
    }

    return {
      leagueName: leagueSettings?.leagueName || leagueSettings?.name || "Your League",
      leagueSettings: {
        scoringType: leagueSettings?.scoring_type || leagueSettings?.settings?.scoring_type || "head-to-head",
        enabledStatCategories: enabledStatCategories,
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
      currentMatchup: matchupContext,
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user?.userId || !selectedLeague) return;

    const userMsg = inputMessage.trim();
    setInputMessage("");
    setError(null);
    setIsLoading(true);

    // Add optimistic user message with temporary ID
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticUserMsg = { 
      id: tempId, 
      role: "user", 
      content: userMsg, 
      timestamp: new Date().toISOString() 
    };
    setMessages((prev) => {
      const updated = [...prev, optimisticUserMsg];
      // Sort to maintain order
      return updated.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        if (timeA !== timeB) return timeA - timeB;
        // For temp IDs, use the timestamp part for ordering
        if (a.id?.startsWith('temp') && b.id?.startsWith('temp')) {
          return a.id.localeCompare(b.id);
        }
        return a.id?.localeCompare(b.id) || 0;
      });
    });

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

      // Reload chat history to get messages in correct order from database
      // This ensures both user and assistant messages are properly ordered
      await loadChatHistory();
    } catch (err) {
      console.error("Send error:", err);
      setError(err.message || "Failed to get response");
      // Remove the optimistically added user message on error
      setMessages((prev) => {
        const sorted = [...prev].sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeA - timeB;
        });
        // Remove the last user message if it matches what we tried to send
        return sorted.filter((msg, idx, arr) => {
          if (idx === arr.length - 1 && msg.role === "user" && msg.content === userMsg) {
            return false;
          }
          return true;
        });
      });
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

  const renderStatTable = (statTable) => {
    if (!statTable || !statTable.stats) return null;
    
    const stats = statTable.stats;
    const statEntries = Object.entries(stats).filter(([, value]) => value !== null && value !== undefined);
    
    if (statEntries.length === 0) return null;

    const statLabels = {
      points: "PTS",
      rebounds: "REB",
      assists: "AST",
      steals: "STL",
      blocks: "BLK",
      threePointers: "3PM",
      fieldGoalPercentage: "FG%",
      freeThrowPercentage: "FT%",
      turnovers: "TO",
    };

    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: "block" }}>
          {statTable.playerName} - Averages
        </Typography>
        <Table size="small" sx={{ border: "1px solid #e0e0e0", borderRadius: 1, overflow: "hidden" }}>
          <TableHead>
            <TableRow sx={{ background: "#f5f5f5" }}>
              {statEntries.map(([key]) => (
                <TableCell key={key} sx={{ fontWeight: 600, py: 1, px: 1.5, fontSize: "0.75rem" }}>
                  {statLabels[key] || key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {statEntries.map(([key, value]) => (
                <TableCell key={key} sx={{ py: 1, px: 1.5, fontSize: "0.75rem", textAlign: "center" }}>
                  {typeof value === "number" ? (
                    key.includes("Percentage") ? `${value.toFixed(1)}%` : value.toFixed(1)
                  ) : value}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    );
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
            {ctx.userTeam.name} {ctx.currentMatchup && `vs ${ctx.currentMatchup.team2.name}`}
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
              <Chip 
                label={`${ctx.currentMatchup.week ? `Week ${ctx.currentMatchup.week} ` : ''}${ctx.currentMatchup.team1.name} vs ${ctx.currentMatchup.team2.name}`} 
                size="small" 
              />
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

        {messages.map((msg) => (
          <Box
            key={msg.id || `${msg.role}-${msg.timestamp}`}
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

                  {msg.content?.statTables?.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      {msg.content.statTables.map((statTable, idx) => (
                        <Box key={idx}>
                          {renderStatTable(statTable)}
                        </Box>
                      ))}
                    </Box>
                  )}

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