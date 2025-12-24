import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Button,
  Collapse,
  IconButton,
  Tooltip,
  Menu,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useAuth } from "../contexts/AuthContext";
import { useLeague } from "../contexts/LeagueContext";
import { supabase } from "../utils/supabase";

const YAHOO_BLUE = "#4a90e2";
const YAHOO_BLUE_LIGHT = "#80deea";
const YAHOO_BLUE_BG = "rgba(74, 144, 226, 0.1)";
const getGameCountStyle = (count, isTotal = false) => {
  // TOTAL column (stronger contrast)
  if (isTotal) {
    if (count >= 14) return { backgroundColor: "#ffffff", color: "#000000", fontWeight: 800 };
    if (count >= 12) return { backgroundColor: "#ffffff", color: "#000000", fontWeight: 750 };
    if (count >= 10) return { backgroundColor: "#ffffff", color: "#000000", fontWeight: 700 };
    if (count >= 8)  return { backgroundColor: "#ffffff", color: "#000000", fontWeight: 650 };
    return { backgroundColor: "#ffffff", color: "#000000", fontWeight: 700 };
  }

  // Weekly columns
  if (count >= 5) return { backgroundColor: "#2E7D32", color: "#000", fontWeight: 700 };
  if (count === 4) return { backgroundColor: "#66BB6A", color: "#000", fontWeight: 600 };
  if (count === 3) return { backgroundColor: "#decacc", color: "#000", fontWeight: 500 };
  if (count === 2) return { backgroundColor: "#d15454", color: "#000", fontWeight: 500 };
  if (count === 1) return { backgroundColor: "#EF9A9A", color: "#000", fontWeight: 500 };

  return { backgroundColor: "#EEEEEE", color: "#ffffff", fontWeight: 400 };
};

const NBAPlayoffs = () => {
  const { isAuthenticated } = useAuth();
  const { leagueTeams } = useLeague();

  const [playoffStartWeek, setPlayoffStartWeek] = useState(19);
  const [nbaTeamSchedule, setNbaTeamSchedule] = useState({});
  const [playoffsData, setPlayoffsData] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "total",
    direction: "desc",
  });
  const [expandedTeams, setExpandedTeams] = useState({});
  const [isLoadingLeagueData, setIsLoadingLeagueData] = useState(false);
  const [showMyTeamsOnly, setShowMyTeamsOnly] = useState(false);
  const [selectedOpponentTeam, setSelectedOpponentTeam] = useState(null);
  const [teamMenuAnchor, setTeamMenuAnchor] = useState(null);

  // ── SEO Structured Data ───────────────────────────────────────────
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "NBA Playoff Schedule Analyzer",
      description:
        "Analyze NBA team playoff schedules. View game counts by week and plan your fantasy basketball strategy.",
      url: "https://fantasygoats.guru/nba-playoffs",
      applicationCategory: "SportsApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => document.head.removeChild(script);
  }, []);

  // ── Load data ────────────────────────────────────────────────────
  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        const [scheduleRes, playoffsRes] = await Promise.all([
          fetch("/data/schedule.json"),
          fetch("/data/playoffs.json"),
        ]);
        setNbaTeamSchedule(await scheduleRes.json());
        setPlayoffsData(await playoffsRes.json());
      } catch (e) {
        console.error("Error loading schedule data:", e);
      }
    };
    loadScheduleData();
  }, []);

  // ── Track league data loading ────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoadingLeagueData(true);
      if (leagueTeams && leagueTeams.length > 0) {
        setIsLoadingLeagueData(false);
      }
    } else {
      setIsLoadingLeagueData(false);
    }
  }, [isAuthenticated, leagueTeams]);

  // ── Playoff weeks ────────────────────────────────────────────────
  const playoffWeeks = useMemo(() => {
    if (!playoffsData) return [];
    return [playoffStartWeek, playoffStartWeek + 1, playoffStartWeek + 2]
      .map((num) => {
        const week = playoffsData.weeks?.[num];
        return week ? { number: num, ...week } : null;
      })
      .filter(Boolean);
  }, [playoffsData, playoffStartWeek]);

  const parseEasternDate = (dateStr) =>
    new Date(dateStr + "T00:00:00-05:00");

  // ── Calculate games ──────────────────────────────────────────────
  const nbaTeamGamesRaw = useMemo(() => {
    if (!Object.keys(nbaTeamSchedule).length || !playoffWeeks.length) return [];

    const map = {};
    Object.entries(nbaTeamSchedule).forEach(([dateStr, teams]) => {
      const gameDate = parseEasternDate(dateStr);

      teams.forEach((abbr) => {
        if (!map[abbr]) map[abbr] = { team: abbr, weeks: {}, total: 0 };

        playoffWeeks.forEach((week) => {
          const s = parseEasternDate(week.start);
          const e = parseEasternDate(week.end);
          e.setHours(23, 59, 59, 999);

          if (gameDate >= s && gameDate <= e) {
            map[abbr].weeks[week.number] =
              (map[abbr].weeks[week.number] || 0) + 1;
          }
        });
      });
    });

    return Object.values(map).map((t) => ({
      ...t,
      total: Object.values(t.weeks).reduce((a, b) => a + b, 0),
    }));
  }, [nbaTeamSchedule, playoffWeeks]);

  // ── Map NBA teams to user's and opponent's players ──────────────
  const nbaTeamPlayersMap = useMemo(() => {
    if (!isAuthenticated || !Array.isArray(leagueTeams) || leagueTeams.length === 0) {
      return { userPlayers: {}, opponentPlayers: {}, hasAnyPlayers: {} };
    }

    const userPlayersMap = {};
    const opponentPlayersMap = {};
    const hasAnyPlayersMap = {};

    // Get user's team players
    const userTeam = leagueTeams.find((team) => team.is_owned_by_current_login);
    if (userTeam) {
      const players = Array.isArray(userTeam.players) ? userTeam.players : [];
      players.forEach((player) => {
        const nbaTeam = player.team;
        if (!nbaTeam) return;

        if (!userPlayersMap[nbaTeam]) {
          userPlayersMap[nbaTeam] = [];
        }

        userPlayersMap[nbaTeam].push({
          name: player.name,
          position: player.position,
          fantasyTeam: userTeam.name,
          isUserTeam: true,
        });

        hasAnyPlayersMap[nbaTeam] = true;
      });
    }

    // Get opponent team players if selected
    if (selectedOpponentTeam) {
      const opponentTeam = leagueTeams.find(
        (team) => team.name === selectedOpponentTeam
      );
      if (opponentTeam) {
        const players = Array.isArray(opponentTeam.players)
          ? opponentTeam.players
          : [];
        players.forEach((player) => {
          const nbaTeam = player.team;
          if (!nbaTeam) return;

          if (!opponentPlayersMap[nbaTeam]) {
            opponentPlayersMap[nbaTeam] = [];
          }

          opponentPlayersMap[nbaTeam].push({
            name: player.name,
            position: player.position,
            fantasyTeam: opponentTeam.name,
            isUserTeam: false,
          });

          hasAnyPlayersMap[nbaTeam] = true;
        });
      }
    }

    return {
      userPlayers: userPlayersMap,
      opponentPlayers: opponentPlayersMap,
      hasAnyPlayers: hasAnyPlayersMap,
    };
  }, [isAuthenticated, leagueTeams, selectedOpponentTeam]);

  // ── Sorting & Filtering ──────────────────────────────────────────
  const sortedTeams = useMemo(() => {
    let data = [...nbaTeamGamesRaw];
    
    // Filter to show only teams with user/opponent players if filter is active
    if (showMyTeamsOnly && isAuthenticated) {
      data = data.filter((team) => nbaTeamPlayersMap.hasAnyPlayers[team.team]);
    }
    
    const { key, direction } = sortConfig;

    return data.sort((a, b) => {
      const aVal = key === "total" ? a.total : (a.weeks[key] ?? 0);
      const bVal = key === "total" ? b.total : (b.weeks[key] ?? 0);
      return direction === "desc" ? bVal - aVal : aVal - bVal;
    });
  }, [nbaTeamGamesRaw, sortConfig, showMyTeamsOnly, isAuthenticated, nbaTeamPlayersMap]);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const SortIcon = ({ columnKey }) =>
    sortConfig.key === columnKey ? (
      sortConfig.direction === "desc" ? (
        <ArrowDownwardIcon fontSize="small" />
      ) : (
        <ArrowUpwardIcon fontSize="small" />
      )
    ) : null;

  const handleMyLeagueClick = async () => {
    if (!isAuthenticated) {
      try {
        sessionStorage.setItem("oauth_return_path", "/nba-playoffs");
        const isDev = window.location.hostname === "localhost";
        const { data } = await supabase.functions.invoke("yahoo-oauth", {
          body: { action: "authorize", isDev },
        });
        if (data?.authUrl) {
          window.location.href = data.authUrl;
        }
      } catch (err) {
        console.error("Failed to connect to Yahoo:", err);
      }
      return;
    }
  };

  // ── Loading ──────────────────────────────────────────────────────
  if (!playoffsData || !Object.keys(nbaTeamSchedule).length || isLoadingLeagueData) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress size={60} />
        {isLoadingLeagueData && (
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            Loading your players...
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700} color="primary.main">
          NBA Fantasy Playoff Schedule
        </Typography>

        {!isAuthenticated ? (
        <Button
          variant="outlined"
          onClick={handleMyLeagueClick}
            startIcon={<SportsBasketballIcon />}
          sx={{
            color: YAHOO_BLUE,
            borderColor: YAHOO_BLUE,
            borderRadius: 2,
            fontFamily: '"Roboto Mono", monospace',
            textTransform: "none",
            px: 4,
            py: 1.2,
            "&:hover": {
              borderColor: YAHOO_BLUE_LIGHT,
              backgroundColor: YAHOO_BLUE_BG,
            },
          }}
        >
            Load your players from Yahoo
        </Button>
        ) : null}
      </Box>

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: { xs: 2, sm: 3 },
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: { xs: 180, sm: 220 } }}>
          <InputLabel>Championship Start Week</InputLabel>
          <Select
            value={playoffStartWeek}
            label="Championship Start Week"
            onChange={(e) => setPlayoffStartWeek(+e.target.value)}
          >
            {[19, 20, 21].map((n) => (
              <MenuItem key={n} value={n}>
                Week {n}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

          <Tooltip
            title={
              !isAuthenticated
                ? "Connect to Yahoo to filter your teams"
                : showMyTeamsOnly
                ? "Showing only teams with your players"
                : "Filter to show only teams with your players"
            }
            arrow
          >
            <span>
              <IconButton
                size="small"
                onClick={() => setShowMyTeamsOnly(!showMyTeamsOnly)}
                disabled={!isAuthenticated}
                sx={{
                  bgcolor: showMyTeamsOnly ? YAHOO_BLUE : "transparent",
                  color: showMyTeamsOnly ? "#fff" : YAHOO_BLUE,
                  border: "2px solid",
                  borderColor: showMyTeamsOnly ? YAHOO_BLUE : YAHOO_BLUE,
                  "&:hover": {
                    bgcolor: showMyTeamsOnly ? "#357abd" : YAHOO_BLUE_BG,
                  },
                  "&.Mui-disabled": {
                    borderColor: "#ccc",
                    color: "#ccc",
                  },
                }}
              >
                <FilterListIcon sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip
            title={
              !isAuthenticated
                ? "Login to yahoo to load league teams"
                : selectedOpponentTeam
                ? `Highlighting: ${selectedOpponentTeam}`
                : "Click to select an opponent team"
            }
            arrow
          >
            <span>
              <Button
                variant={selectedOpponentTeam ? "contained" : "outlined"}
                size="small"
                onClick={(e) => setTeamMenuAnchor(e.currentTarget)}
                disabled={!isAuthenticated || !leagueTeams || leagueTeams.length === 0}
                sx={{
                  textTransform: "none",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  bgcolor: selectedOpponentTeam ? "#ff6b35" : "transparent",
                  color: selectedOpponentTeam ? "#fff" : "#ff6b35",
                  borderColor: "#ff6b35",
                  border: "2px solid #ff6b35",
                  px: { xs: 1.5, sm: 2 },
                  whiteSpace: "nowrap",
                  "&:hover": {
                    bgcolor: selectedOpponentTeam
                      ? "#e55a2b"
                      : "rgba(255, 107, 53, 0.1)",
                  },
                  "&.Mui-disabled": {
                    borderColor: "#ccc",
                    color: "#ccc",
                  },
                }}
              >
                {selectedOpponentTeam || "Opponent Team"}
              </Button>
            </span>
          </Tooltip>
        </Box>
        <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 }, flexWrap: "wrap", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
          {playoffWeeks.map((w) => (
            <Chip
              key={w.number}
              label={`W${w.number}: ${w.label}`}
              variant="outlined"
              color="primary"
              sx={{
                fontSize: { xs: "0.7rem", sm: "0.8125rem" },
                height: { xs: 28, sm: 32 },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Opponent Team Selector Menu */}
      <Menu
        anchorEl={teamMenuAnchor}
        open={Boolean(teamMenuAnchor)}
        onClose={() => setTeamMenuAnchor(null)}
        PaperProps={{
          style: { maxHeight: 400 },
        }}
      >
        <MenuItem
          onClick={() => {
            setSelectedOpponentTeam(null);
            setTeamMenuAnchor(null);
          }}
          sx={{
            fontWeight: !selectedOpponentTeam ? 700 : 400,
            color: !selectedOpponentTeam ? "#ff6b35" : "inherit",
          }}
        >
          None
        </MenuItem>
        {leagueTeams
          ?.filter((team) => !team.is_owned_by_current_login)
          .map((team) => (
            <MenuItem
              key={team.key}
              onClick={() => {
                setSelectedOpponentTeam(team.name);
                setTeamMenuAnchor(null);
              }}
              sx={{
                fontWeight: selectedOpponentTeam === team.name ? 700 : 400,
                color: selectedOpponentTeam === team.name ? "#ff6b35" : "inherit",
              }}
            >
              {team.name}
            </MenuItem>
          ))}
      </Menu>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "auto", maxWidth: "100%" }}>
        <Table size="small" sx={{ minWidth: 650, tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  minWidth: { xs: 100, sm: 160 },
                  width: { xs: 100, sm: 160 },
                  position: "sticky", 
                  left: 0, 
                  backgroundColor: "#fff", 
                  zIndex: 10,
                  px: { xs: 1, sm: 2 },
                  boxShadow: "2px 0 4px -2px rgba(0,0,0,0.1)",
                }}
              >
                TEAM
              </TableCell>
              {playoffWeeks.map((w) => (
                <TableCell
                  key={w.number}
                  align="center"
                  onClick={() => requestSort(w.number)}
                  sx={{
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    minWidth: { xs: 70, sm: 90 },
                    width: { xs: 70, sm: 90 },
                    px: { xs: 1, sm: 2 },
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                  }}
                >
                  W{w.number} <SortIcon columnKey={w.number} />
                </TableCell>
              ))}
              <TableCell
                align="center"
                onClick={() => requestSort("total")}
                sx={{
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  minWidth: { xs: 80, sm: 100 },
                  width: { xs: 80, sm: 100 },
                  position: { xs: "relative", sm: "sticky" },
                  right: { xs: "auto", sm: 0 },
                  backgroundColor: "#fff",
                  zIndex: { xs: 1, sm: 3 },
                  boxShadow: { xs: "none", sm: "-4px 0 8px -4px rgba(0,0,0,0.1)" },
                  px: { xs: 1, sm: 2 },
                }}
              >
                TOTAL <SortIcon columnKey="total" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTeams.map((t) => {
              const hasUserPlayers = nbaTeamPlayersMap.userPlayers[t.team]?.length > 0;
              const hasOpponentPlayers = nbaTeamPlayersMap.opponentPlayers[t.team]?.length > 0;
              const hasAnyPlayers = hasUserPlayers || hasOpponentPlayers;
              const isExpanded = expandedTeams[t.team];

              return (
                <React.Fragment key={t.team}>
                  <TableRow
                    hover
                    onClick={
                      hasAnyPlayers
                        ? () =>
                            setExpandedTeams((prev) => ({
                              ...prev,
                              [t.team]: !prev[t.team],
                            }))
                        : undefined
                    }
                    sx={{
                      backgroundColor: hasAnyPlayers ? "rgba(74, 144, 226, 0.06)" : "inherit",
                      borderLeft: hasAnyPlayers ? `4px solid ${YAHOO_BLUE}` : "none",
                      cursor: hasAnyPlayers ? "pointer" : "default",
                      "&:hover": hasAnyPlayers
                        ? { backgroundColor: "rgba(74, 144, 226, 0.12)" }
                        : {},
                    }}
                  >
                    <TableCell 
                      sx={{ 
                        fontWeight: hasAnyPlayers ? 700 : 500, 
                        position: "sticky", 
                        left: 0, 
                        backgroundColor: hasAnyPlayers ? "#e3f2fd" : "#fff",
                        zIndex: 10,
                        fontSize: { xs: "0.8rem", sm: "0.95rem" },
                        px: { xs: 1, sm: 2 },
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        boxShadow: "2px 0 4px -2px rgba(0,0,0,0.1)",
                      }}
                    >
                      {t.team}
                      {hasUserPlayers && (
                        <Chip
                          label={nbaTeamPlayersMap.userPlayers[t.team].length}
                          size="small"
                          sx={{
                            ml: { xs: 0.5, sm: 1.5 },
                            height: { xs: 18, sm: 20 },
                            fontSize: { xs: "0.65rem", sm: "0.7rem" },
                            backgroundColor: YAHOO_BLUE,
                            color: "#fff",
                          }}
                        />
                      )}
                      {hasOpponentPlayers && (
                        <Chip
                          label={nbaTeamPlayersMap.opponentPlayers[t.team].length}
                          size="small"
                          sx={{
                            ml: 0.5,
                            height: { xs: 18, sm: 20 },
                            fontSize: { xs: "0.65rem", sm: "0.7rem" },
                            backgroundColor: "#ff6b35",
                            color: "#fff",
                          }}
                        />
                      )}
                    </TableCell>

                    {playoffWeeks.map((w) => {
                      const count = t.weeks[w.number] ?? 0;
                      return (
                        <TableCell
                          key={w.number}
                          align="center"
                          sx={{
                            ...getGameCountStyle(count),
                            fontSize: { xs: "0.85rem", sm: "0.95rem" },
                            px: { xs: 1, sm: 2 },
                          }}
                        >
                          {count}
                  </TableCell>
                      );
                    })}

                    <TableCell
                      align="center"
                      sx={{
                        ...getGameCountStyle(t.total, true),
                        position: { xs: "relative", sm: "sticky" },
                        right: { xs: "auto", sm: 0 },
                        zIndex: { xs: 1, sm: 2 },
                        boxShadow: { xs: "none", sm: "-3px 0 6px -2px rgba(0,0,0,0.06)" },
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        px: { xs: 1, sm: 2 },
                      }}
                    >
                  {t.total}
                </TableCell>
              </TableRow>

                  {hasAnyPlayers && (
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={playoffWeeks.length + 2}
                      >
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ py: 2, pl: 5 }}>
                            {hasUserPlayers && (
                              <Box sx={{ mb: hasOpponentPlayers ? 2 : 0 }}>
                                <Typography variant="subtitle2" fontWeight={700} gutterBottom color={YAHOO_BLUE}>
                                  Your Players on {t.team}:
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                  {nbaTeamPlayersMap.userPlayers[t.team].map((player, idx) => (
                                    <Chip
                                      key={idx}
                                      label={`${player.name} (${player.position})`}
                                      size="small"
                                      sx={{ 
                                        fontFamily: '"Roboto Mono", monospace',
                                        backgroundColor: YAHOO_BLUE,
                                        color: "#fff",
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                            {hasOpponentPlayers && (
                              <Box>
                                <Typography variant="subtitle2" fontWeight={700} gutterBottom color="#ff6b35">
                                  {selectedOpponentTeam} Players on {t.team}:
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                  {nbaTeamPlayersMap.opponentPlayers[t.team].map((player, idx) => (
                                    <Chip
                                      key={idx}
                                      label={`${player.name} (${player.position})`}
                                      size="small"
                                      sx={{ 
                                        fontFamily: '"Roboto Mono", monospace',
                                        backgroundColor: "#ff6b35",
                                        color: "#fff",
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default NBAPlayoffs;