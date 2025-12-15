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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
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
  const [puntCategories, setPuntCategories] = useState([]);
  const availableCategories = [
    { value: "points", label: "Points (PTS)" },
    { value: "rebounds", label: "Rebounds (REB)" },
    { value: "assists", label: "Assists (AST)" },
    { value: "steals", label: "Steals (STL)" },
    { value: "blocks", label: "Blocks (BLK)" },
    { value: "threePointers", label: "Three Pointers (3PM)" },
    { value: "fieldGoalPercentage", label: "Field Goal % (FG%)" },
    { value: "freeThrowPercentage", label: "Free Throw % (FT%)" },
    { value: "turnovers", label: "Turnovers (TO)" },
  ];
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
            const timeA = new Date(a.timestamp).getTime();
            const timeB = new Date(b.timestamp).getTime();
            if (timeA !== timeB) return timeA - timeB;
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
      .from("player_period_averages")
      .select("player_id, points_per_game, rebounds_per_game, assists_per_game, steals_per_game, blocks_per_game, three_pointers_per_game, field_goal_percentage, free_throw_percentage, turnovers_per_game, total_value, points_z, rebounds_z, assists_z, steals_z, blocks_z, three_pointers_z, fg_percentage_z, ft_percentage_z, turnovers_z")
      .eq("season", CURRENT_SEASON)
      .eq("period_type", "season")
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
    let enabledStatCategories = [];
    if (leagueSettings?.settings?.stat_categories?.stats) {
      enabledStatCategories = leagueSettings.settings.stat_categories.stats;
    } else if (leagueSettings?.stat_categories) {
      enabledStatCategories = Array.isArray(leagueSettings.stat_categories)
        ? leagueSettings.stat_categories
        : leagueSettings.stat_categories.stats || [];
    }
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
    const puntStrategy = puntCategories.length > 0
      ? `USER PUNT STRATEGY: You are actively punting ${puntCategories.map(val => {
          const cat = availableCategories.find(c => c.value === val);
          return cat ? cat.label : val;
        }).join(', ')}. This means you are intentionally ignoring these categories and should prioritize players who excel in other categories while being weak in these punted categories.`
      : null;
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
      puntStrategy: puntStrategy,
    };
  };
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user?.userId || !selectedLeague) return;
    const userMsg = inputMessage.trim();
    setInputMessage("");
    setError(null);
    setIsLoading(true);
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticUserMsg = {
      id: tempId,
      role: "user",
      content: userMsg,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, optimisticUserMsg]);
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
      await loadChatHistory();
    } catch (err) {
      console.error("Send error:", err);
      setError(err.message || "Failed to get response");
      setMessages((prev) => prev.filter(m => m.id !== tempId));
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
  
    const categories = [
      { key: "points", label: "PTS", zKey: "pointsZ", format: (v) => v.toFixed(1) },
      { key: "rebounds", label: "REB", zKey: "reboundsZ", format: (v) => v.toFixed(1) },
      { key: "assists", label: "AST", zKey: "assistsZ", format: (v) => v.toFixed(1) },
      { key: "steals", label: "STL", zKey: "stealsZ", format: (v) => v.toFixed(1) },
      { key: "blocks", label: "BLK", zKey: "blocksZ", format: (v) => v.toFixed(1) },
      { key: "threePointers", label: "3PM", zKey: "threePointersZ", format: (v) => v.toFixed(1) },
      { key: "fieldGoalPercentage", label: "FG%", zKey: "fieldGoalPercentageZ", format: (v) => `${(v * 100).toFixed(2)}%` },
      { key: "freeThrowPercentage", label: "FT%", zKey: "freeThrowPercentageZ", format: (v) => `${(v * 100).toFixed(2)}%` },
      { key: "turnovers", label: "TO", zKey: "turnoversZ", format: (v) => v.toFixed(1) },
      { key: "totalValue", label: "TV", format: (v) => v.toFixed(2) },
    ];
  
    // 7-tier color scale
    const getCellColor = (z) => {
      if (z >= 3.0)   return "#0d470d";   // ultra dark green
      if (z >= 2.0)   return "#1b5e20";   // dark green
      if (z >= 1.0)   return "#2e7d32";   // medium green
      if (z > 0)      return "#81c784";   // light green
      if (z >= -1.0)  return "#ffccbc";   // light red
      if (z >= -2.0)  return "#e57373";   // medium red
      return "#c62828";                   // dark red
    };
  
    return (
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#1976d2" }}>
          {statTable.playerName} — Stats & Z-Scores
        </Typography>
  
        <Table size="small" sx={{ border: "1px solid #ddd", borderRadius: 2, overflow: "hidden" }}>
          <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1, backgroundColor: "#bbdefb" }}>
                Row
              </TableCell>
              {categories.map(({ label }) => (
                <TableCell key={label} align="center" sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
  
          <TableBody>
            {/* VAL row */}
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontWeight: 600, fontSize: "0.8rem", backgroundColor: "#e8f5e9", color: "#2e7d32" }}
              >
                VAL
              </TableCell>
              {categories.map((cat) => {
                const value = stats[cat.key] ?? 0;
                const formatted = cat.format ? cat.format(value) : value;
                const z = cat.zKey ? (stats[cat.zKey] ?? 0) : (stats[cat.key] ?? 0);
                const bg = getCellColor(z);
                return (
                  <TableCell
                    key={`${cat.label}-val`}
                    align="center"
                    sx={{ fontSize: "0.85rem", py: 1.5, backgroundColor: bg, color: z >= 2 || z <= -2 ? "white" : "inherit" }}
                  >
                    <strong>{formatted}</strong>
                  </TableCell>
                );
              })}
            </TableRow>
  
            {/* Z row */}
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontWeight: 600, fontSize: "0.8rem", backgroundColor: "#ffebee", color: "#c62828" }}
              >
                Z
              </TableCell>
              {categories.map((cat) => {
                if (!cat.zKey) {
                  return <TableCell key={`${cat.label}-z`} />;
                }
                const z = stats[cat.zKey] ?? 0;
                const bg = getCellColor(z);
                const textColor = z >= 2 || z <= -2 ? "white" : "inherit";
                return (
                  <TableCell
                    key={`${cat.label}-z`}
                    align="center"
                    sx={{
                      fontSize: "0.85rem",
                      py: 1.5,
                      backgroundColor: bg,
                      color: textColor,
                      fontWeight: 600,
                    }}
                  >
                    {z >= 0 ? "+" : ""}{z.toFixed(2)}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
  
        {/* Optional legend (uncomment if you want it visible) */}
        {false && (
          <Box sx={{ mt: 1, fontSize: "0.65rem", color: "#555", textAlign: "center" }}>
            Z-Score colors: &ge;3.0 very dark green | &ge;2.0 dark green | &ge;1.0 medium green | &gt;0 light green | &lt;0 light red | &le;-1.0 medium red | &le;-2.0 dark red
          </Box>
        )}
      </Box>
    );
  };


  return (
    <Box sx={{ p: 3, background: "#fafafa", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
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
      {/* Context Row — Compact punt selector on same line */}
      {showContext && (
        <Paper sx={{ p: 2, mb: 2, background: "#e3f2fd" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
            Current Context
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
            <Chip label={ctx.leagueName} color="primary" size="small" />
            {ctx.currentMatchup && (
              <Chip
                label={`${ctx.currentMatchup.week ? `Week ${ctx.currentMatchup.week} ` : ''}${ctx.currentMatchup.team1.name} vs ${ctx.currentMatchup.team2.name}`}
                size="small"
              />
            )}
            <Chip label={`${ctx.userTeam.players.length} players`} size="small" />
            {/* Compact Punt Selector */}
            <FormControl size="small" sx={{ minWidth: 180, ml: "auto" }}>
              <InputLabel id="punt-categories-label">Punt Categories</InputLabel>
              <Select
                labelId="punt-categories-label"
                multiple
                value={puntCategories}
                onChange={(e) => setPuntCategories(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label="Punt Categories" />}
                renderValue={(selected) => {
                  if (selected.length === 0) return <em>None</em>;
                  return selected.map(val => {
                    const cat = availableCategories.find(c => c.value === val);
                    return cat ? cat.label.split(' ')[0] : val; // Short: PTS, REB, etc.
                  }).join(', ');
                }}
                sx={{ bgcolor: '#fff', fontSize: '0.875rem' }}
              >
                {availableCategories.map((category) => (
                  <MenuItem key={category.value} value={category.value} sx={{ fontSize: '0.875rem' }}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {puntCategories.length > 0 && (
            <Typography variant="caption" sx={{ color: "#1565c0", fontStyle: "italic", mt: 1, display: "block" }}>
              Punting: {puntCategories.map(val => {
                const cat = availableCategories.find(c => c.value === val);
                return cat ? cat.label : val;
              }).join(', ')}
            </Typography>
          )}
        </Paper>
      )}
      {/* Suggested Questions */}
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
      {/* Messages */}
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
              mb: 3,
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
            }}
          >
            <Box
              sx={{
                maxWidth: "85%",
                p: 2.5,
                borderRadius: 3,
                background: msg.role === "user" ? "#e3f2fd" : "#f5f5f5",
                border: "1px solid",
                borderColor: msg.role === "user" ? "#1976d2" : "#e0e0e0",
              }}
            >
              {msg.role === "user" ? (
                <Typography variant="body1">{msg.content}</Typography>
              ) : (
                <Box>
                  <ReactMarkdown
                    components={{
                      strong: ({ children }) => <strong style={{ fontWeight: 700, color: "#1565c0" }}>{children}</strong>,
                      em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
                      ul: ({ children }) => <ul style={{ paddingLeft: "24px", margin: "8px 0" }}>{children}</ul>,
                      ol: ({ children }) => <ol style={{ paddingLeft: "24px", margin: "8px 0" }}>{children}</ol>,
                      li: ({ children }) => <li style={{ margin: "4px 0" }}>{children}</li>,
                    }}
                  >
                    {safeText(msg.content)}
                  </ReactMarkdown>
                  {msg.content?.statTables?.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      {msg.content.statTables.map((statTable, idx) => (
                        <div key={idx}>{renderStatTable(statTable)}</div>
                      ))}
                    </Box>
                  )}
                  {msg.content?.suggestions?.length > 0 && (
                    <Box sx={{ mt: 3, p: 2.5, background: "#e8f5e8", borderRadius: 2, border: "1px solid #c8e6c9" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#2e7d32", mb: 1 }}>
                        Suggestions
                      </Typography>
                      <List dense>
                        {msg.content.suggestions.map((s, idx) => (
                          <ListItem key={idx} sx={{ py: 0.5 }}>
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 3 }}>
            <CircularProgress size={20} />
            <Typography>Thinking...</Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>}
      {/* Input */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
          placeholder="Ask anything about your fantasy team..."
          disabled={isLoading}
          multiline
          maxRows={4}
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