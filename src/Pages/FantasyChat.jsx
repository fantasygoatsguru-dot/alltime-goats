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
  Switch,
  FormControlLabel,
  Divider,
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
  const [includeHistory, setIncludeHistory] = useState(true);
  const [error, setError] = useState(null);
  const [showContext, setShowContext] = useState(true);
  const [leagueSettings, setLeagueSettings] = useState(null);
  const [playerStats, setPlayerStats] = useState({}); // Map of nbaPlayerId -> stats
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history, league settings, and player stats on mount
  useEffect(() => {
    if (user?.userId && selectedLeague) {
      loadChatHistory();
      loadLeagueSettings();
      loadPlayerStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, selectedLeague, leagueTeams, userTeamPlayers]);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("fantasy_chat_messages")
        .select("*")
        .eq("user_id", user.userId)
        .eq("league_id", selectedLeague)
        .order("created_at", { ascending: true })
        .limit(20);

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedMessages = data.map((msg) => ({
          role: msg.message_role,
          content: msg.message_role === "assistant" 
            ? JSON.parse(msg.message_content) 
            : msg.message_content,
          timestamp: msg.created_at,
        }));
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
    }
  };

  const loadLeagueSettings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("yahoo-fantasy-api", {
        body: {
          action: "getLeagueSettings",
          userId: user.userId,
          leagueId: selectedLeague,
        },
      });

      if (error) throw error;

      if (data) {
        setLeagueSettings(data);
      }
    } catch (err) {
      console.error("Error loading league settings:", err);
      // Don't block chat if settings fail to load
      setLeagueSettings(null);
    }
  };

  const loadPlayerStats = async () => {
    if (!leagueTeams || leagueTeams.length === 0) return;

    try {
      // Collect all NBA player IDs from all teams
      const allPlayerIds = new Set();
      
      // Add user team players
      userTeamPlayers.forEach((p) => {
        if (p.nbaPlayerId) {
          allPlayerIds.add(p.nbaPlayerId);
        }
      });

      // Add other teams' players
      leagueTeams.forEach((team) => {
        if (team.players) {
          team.players.forEach((p) => {
            if (p.nbaPlayerId) {
              allPlayerIds.add(p.nbaPlayerId);
            }
          });
        }
      });

      const playerIdArray = Array.from(allPlayerIds);
      if (playerIdArray.length === 0) {
        setPlayerStats({});
        return;
      }

      // Fetch stats from Supabase
      const { data, error } = await supabase
        .from("player_season_averages")
        .select("*")
        .eq("season", CURRENT_SEASON)
        .in("player_id", playerIdArray);

      if (error) throw error;

      // Create a map of player_id -> stats
      const statsMap = {};
      if (data) {
        data.forEach((row) => {
          statsMap[row.player_id] = {
            points: row.points_per_game || 0,
            rebounds: row.rebounds_per_game || 0,
            assists: row.assists_per_game || 0,
            steals: row.steals_per_game || 0,
            blocks: row.blocks_per_game || 0,
            threePointers: row.three_pointers_per_game || 0,
            fieldGoalPercentage: row.field_goal_percentage || 0,
            freeThrowPercentage: row.free_throw_percentage || 0,
            turnovers: row.turnovers_per_game || 0,
          };
        });
      }

      setPlayerStats(statsMap);
    } catch (err) {
      console.error("Error loading player stats:", err);
      // Don't block chat if stats fail to load
      setPlayerStats({});
    }
  };

  const buildLeagueContext = () => {
    const userTeam = leagueTeams?.find((team) => team.is_owned_by_current_login);
    const otherTeams = leagueTeams?.filter((team) => !team.is_owned_by_current_login) || [];

    return {
      leagueId: selectedLeague,
      leagueName: leagueSettings?.leagueName || "Your League",
      userTeam: {
        name: userTeam?.name || "Your Team",
        managerNickname: userTeam?.managerNickname || null,
        players: userTeamPlayers.map((p) => ({
          name: p.name,
          nbaPlayerId: p.nbaPlayerId,
          stats: p.nbaPlayerId ? playerStats[p.nbaPlayerId] || null : null,
        })),
      },
      otherTeams: otherTeams.map((team) => ({
        name: team.name,
        managerNickname: team.managerNickname || null,
        players: team.players?.map((p) => ({
          name: p.name,
          nbaPlayerId: p.nbaPlayerId,
          stats: p.nbaPlayerId ? playerStats[p.nbaPlayerId] || null : null,
        })) || [],
      })),
      leagueSettings: leagueSettings ? {
        scoringType: leagueSettings.scoringType,
        usesPlayoff: leagueSettings.usesPlayoff,
        numTeams: leagueSettings.numTeams,
        maxWeeklyAdds: leagueSettings.maxWeeklyAdds,
        enabledStatCategories: leagueSettings.enabledStatCategories || [],
      } : undefined,
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user?.userId || !selectedLeague) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setError(null);
    setIsLoading(true);

    // Add user message to UI immediately
    const newUserMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const leagueContext = buildLeagueContext();

      const { data, error } = await supabase.functions.invoke("fantasy-chat", {
        body: {
          userId: user.userId,
          leagueId: selectedLeague,
          userMessage,
          leagueContext,
          includeHistory,
        },
      });

      if (error) throw error;

      if (data?.success) {
        const assistantMessage = {
          role: "assistant",
          content: data.data,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data?.error || "Failed to get response");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message. Please try again.");
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = async () => {
    if (!user?.userId || !selectedLeague) return;

    try {
      const { error } = await supabase
        .from("fantasy_chat_messages")
        .delete()
        .eq("user_id", user.userId)
        .eq("league_id", selectedLeague);

      if (error) throw error;

      setMessages([]);
      setIncludeHistory(false);
      setError(null);
    } catch (err) {
      console.error("Error resetting chat:", err);
      setError("Failed to reset chat. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedLeague) {
    return (
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert severity="info">
          Please select a league to use the Fantasy AI Assistant.
        </Alert>
      </Box>
    );
  }

  const leagueContext = buildLeagueContext();

  return (
    <Box
      sx={{
        p: 3,
        background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <BrainIcon sx={{ fontSize: 40, color: "#1976d2" }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h4"
            sx={{
              color: "#1976d2",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            Fantasy AI Assistant
          </Typography>
          <Typography variant="body2" sx={{ color: "#424242", mt: 0.5 }}>
            Get strategic advice for {leagueContext.userTeam.name}
          </Typography>
        </Box>
        <IconButton
          onClick={() => setShowContext(!showContext)}
          sx={{ color: "#1976d2" }}
        >
          <InfoIcon />
        </IconButton>
        <IconButton onClick={handleResetChat} sx={{ color: "#f44336" }}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* League Context Panel */}
      {showContext && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: "#1976d2", fontWeight: 600, mb: 1 }}
          >
            League Context
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
            <Chip
              label={`League: ${leagueContext.leagueName}`}
              size="small"
              sx={{ bgcolor: "rgba(25, 118, 210, 0.1)", color: "#1976d2" }}
            />
            <Chip
              label={`Your Team: ${leagueContext.userTeam.name}`}
              size="small"
              sx={{ bgcolor: "rgba(76, 175, 80, 0.1)", color: "#2e7d32" }}
            />
            <Chip
              label={`${leagueContext.userTeam.players.length} Players`}
              size="small"
              sx={{ bgcolor: "rgba(0, 0, 0, 0.05)", color: "#424242" }}
            />
          </Box>
        </Paper>
      )}

      {/* Suggested Questions */}
      {messages.length === 0 && (
        <Paper
          sx={{
            p: 3,
            mb: 2,
            bgcolor: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: "#1976d2", fontWeight: 600, mb: 2 }}
          >
            Try asking:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[
              "What punt strategy makes sense for my team?",
              `How is my matchup against ${leagueContext.otherTeams[0]?.name || "another team"}?`,
              "Which player should I trade for?",
              "Who should I stream this week?",
              "What are my team's strengths and weaknesses?",
            ].map((question, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => setInputMessage(question)}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  textTransform: "none",
                  color: "#424242",
                  borderColor: "rgba(0, 0, 0, 0.12)",
                  "&:hover": {
                    borderColor: "#1976d2",
                    bgcolor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                {question}
              </Button>
            ))}
          </Box>
        </Paper>
      )}

      {/* Chat Messages */}
      <Paper
        ref={chatContainerRef}
        sx={{
          flexGrow: 1,
          p: 2,
          mb: 2,
          bgcolor: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          maxHeight: "500px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.length === 0 && !isLoading && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#9e9e9e",
            }}
          >
            <Typography variant="body2">
              Start a conversation to get fantasy basketball advice!
            </Typography>
          </Box>
        )}

        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: message.role === "user" ? "row-reverse" : "row",
              gap: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                p: 2,
                borderRadius: 2,
                bgcolor:
                  message.role === "user"
                    ? "rgba(25, 118, 210, 0.1)"
                    : "#f8f9fa",
                border:
                  message.role === "user"
                    ? "1px solid rgba(25, 118, 210, 0.3)"
                    : "1px solid rgba(0, 0, 0, 0.08)",
              }}
            >
              {message.role === "user" ? (
                <Typography sx={{ color: "#212121", fontSize: "0.95rem" }}>
                  {message.content}
                </Typography>
              ) : (
                <Box>
                  <Typography
                    sx={{
                      color: "#212121",
                      fontSize: "0.95rem",
                      mb: message.content.suggestions ? 1.5 : 0,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {message.content.response}
                  </Typography>

                  {message.content.reasoning && (
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        bgcolor: "rgba(25, 118, 210, 0.05)",
                        borderRadius: 1,
                        borderLeft: "3px solid #1976d2",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#1976d2",
                          fontWeight: 600,
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        Reasoning
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#424242", fontSize: "0.85rem" }}
                      >
                        {message.content.reasoning}
                      </Typography>
                    </Box>
                  )}

                  {message.content.suggestions &&
                    message.content.suggestions.length > 0 && (
                      <Box sx={{ mt: 1.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#2e7d32",
                            fontWeight: 600,
                            display: "block",
                            mb: 1,
                          }}
                        >
                          Suggestions
                        </Typography>
                        <List dense sx={{ p: 0 }}>
                          {message.content.suggestions.map((suggestion, i) => (
                            <ListItem
                              key={i}
                              sx={{
                                p: 0.5,
                                pl: 2,
                                color: "#424242",
                                fontSize: "0.85rem",
                                "&::before": {
                                  content: '"•"',
                                  position: "absolute",
                                  left: 8,
                                  color: "#2e7d32",
                                  fontWeight: "bold",
                                },
                              }}
                            >
                              <ListItemText
                                primary={suggestion}
                                primaryTypographyProps={{
                                  fontSize: "0.85rem",
                                  color: "#424242",
                                }}
                              />
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
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <CircularProgress size={20} sx={{ color: "#1976d2" }} />
            <Typography variant="body2" sx={{ color: "#424242" }}>
              Thinking...
            </Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Input Area */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about punt strategies, matchups, trades, or players..."
          disabled={isLoading}
          sx={{
            bgcolor: "#ffffff",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(0, 0, 0, 0.12)" },
              "&:hover fieldset": { borderColor: "#1976d2" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
            },
            "& .MuiInputBase-input": { color: "#212121" },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          sx={{
            bgcolor: "#1976d2",
            color: "#ffffff",
            minWidth: "56px",
            "&:hover": { bgcolor: "#1565c0" },
            "&:disabled": { bgcolor: "#e0e0e0", color: "#9e9e9e" },
          }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default FantasyChat;

