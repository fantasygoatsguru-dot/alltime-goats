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
  Collapse,
  IconButton,
  Checkbox,
  Tooltip,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useAuth } from "../contexts/AuthContext";
import { useLeague } from "../contexts/LeagueContext";
import { supabase } from "../utils/supabase";

const LeaguePlayoffs = () => {
  const { isAuthenticated } = useAuth();
  const { selectedLeague, leagueTeams } = useLeague();

  // ── State ───────────────────────────────────────────────────────
  const [playoffStartWeek, setPlayoffStartWeek] = useState(19);
  const [nbaTeamSchedule, setNbaTeamSchedule] = useState({});
  const [playoffsData, setPlayoffsData] = useState(null);
  const [leagueSettings, setLeagueSettings] = useState(null);
  const [playerStats, setPlayerStats] = useState({});
  const [expandedTeams, setExpandedTeams] = useState({});
  const [disabledPlayers, setDisabledPlayers] = useState({});
  const [sortBy, setSortBy] = useState({ column: 'total', type: 'games', direction: 'desc' }); // Default sort
  const [viewMode, setViewMode] = useState("nba");
  const [isLoadingLoggedInData, setIsLoadingLoggedInData] = useState(false);
  const [leagueSettingsLoaded, setLeagueSettingsLoaded] = useState(false);
  const [playerStatsLoaded, setPlayerStatsLoaded] = useState(false);

  // ── SEO Structured Data ───────────────────────────────────────────
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Fantasy Basketball Playoff Schedule Analyzer",
      "description": "Analyze your fantasy basketball playoff schedule. View NBA team schedules, calculate playoff strength, and optimize your roster for fantasy basketball playoffs.",
      "url": "https://fantasygoats.guru/playoffs",
      "applicationCategory": "SportsApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "NBA team playoff schedule analysis",
        "Fantasy league playoff strength calculator",
        "Player z-score based playoff optimization",
        "Weekly game count tracking",
        "Playoff roster optimization tool"
      ],
      "keywords": "fantasy basketball playoff schedule, playoff schedule analysis, fantasy basketball playoffs, NBA playoff schedule, fantasy playoff strength"
    };

    let scriptTag = document.getElementById('playoffs-structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'playoffs-structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      const tag = document.getElementById('playoffs-structured-data');
      if (tag) tag.remove();
    };
  }, []);

  // Update view mode when authentication changes
  useEffect(() => {
    if (isAuthenticated && Array.isArray(leagueTeams) && leagueTeams.length > 0) {
      setViewMode("fantasy");
    } else {
      setViewMode("nba");
    }
  }, [isAuthenticated, leagueTeams]);

  // Track loading state for logged-in data
  useEffect(() => {
    if (isAuthenticated && selectedLeague) {
      const hasLeagueTeams = Array.isArray(leagueTeams) && leagueTeams.length > 0;
      setIsLoadingLoggedInData(!hasLeagueTeams || !leagueSettingsLoaded || !playerStatsLoaded);
    } else {
      setIsLoadingLoggedInData(false);
      setLeagueSettingsLoaded(false);
      setPlayerStatsLoaded(false);
    }
  }, [isAuthenticated, selectedLeague, leagueTeams, leagueSettingsLoaded, playerStatsLoaded]);

  // ── Load static data ───────────────────────────────────────────
  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        const [scheduleRes, playoffsRes] = await Promise.all([
          fetch("/data/schedule.json"),
          fetch("/data/playoffs.json"),
        ]);
        const schedule = await scheduleRes.json();
        const playoffs = await playoffsRes.json();

        setNbaTeamSchedule(schedule);
        setPlayoffsData(playoffs);
      } catch (e) {
        console.error("Error loading schedule data:", e);
      }
    };
    loadScheduleData();
  }, []);

  // ── League settings (logged-in) ───────────────────────────────
  useEffect(() => {
    const loadLeagueSettings = async () => {
      if (!isAuthenticated || !selectedLeague) {
        setLeagueSettingsLoaded(false);
        return;
      }
      setLeagueSettingsLoaded(false);
      try {
        const { data, error } = await supabase
          .from("league_settings")
          .select("*")
          .eq("league_id", selectedLeague)
          .single();
        if (error) throw error;
        setLeagueSettings(data);
        if (data?.playoff_start_week) {
          setPlayoffStartWeek(parseInt(data.playoff_start_week, 10));
        }
      } catch (e) {
        console.error("Error loading league settings:", e);
      } finally {
        setLeagueSettingsLoaded(true);
      }
    };
    loadLeagueSettings();
  }, [isAuthenticated, selectedLeague]);

  // ── Initialize disabled players (IL, IL+, INJ) ──────────────────
  useEffect(() => {
    if (!isAuthenticated || !Array.isArray(leagueTeams) || leagueTeams.length === 0) {
      setDisabledPlayers({});
      return;
    }

    const initialDisabled = {};
    leagueTeams.forEach((team) => {
      if (!team || !Array.isArray(team.players)) return;
      team.players.forEach((p) => {
        // Use the same ID format as elsewhere: id, yahooPlayerId, or nbaPlayerId
        const playerId = p.id || p.yahooPlayerId || p.nbaPlayerId;
        if (!playerId) return;
        
        const selectedPosition = p.selectedPosition || p.selected_position;
        const status = p.status;
        
        // Only disable if explicitly IL, IL+, or INJ (case-sensitive check)
        const shouldDisable = 
          (selectedPosition && (selectedPosition === 'IL' || selectedPosition === 'IL+')) || 
          (status && status === 'INJ');
        
        if (shouldDisable) {
          initialDisabled[`${team.key}_${playerId}`] = true;
        }
      });
    });

    setDisabledPlayers(initialDisabled);
  }, [isAuthenticated, leagueTeams]);

  // ── Player stats (logged-in) ───────────────────────────────────
  useEffect(() => {
    const loadPlayerStats = async () => {
      if (!isAuthenticated || !Array.isArray(leagueTeams) || leagueTeams.length === 0) {
        setPlayerStatsLoaded(false);
        return;
      }
      
      setPlayerStatsLoaded(false);
      
      // Collect all player IDs (both NBA and Yahoo)
      const nbaIds = [];
      const yahooIds = [];
      leagueTeams.forEach((t) => {
        if (!t || !Array.isArray(t.players)) return;
        t.players.forEach((p) => {
          if (p?.nbaPlayerId) nbaIds.push(p.nbaPlayerId);
          if (p?.yahooPlayerId && !p?.nbaPlayerId) yahooIds.push(p.yahooPlayerId);
        });
      });
      
      if (nbaIds.length === 0 && yahooIds.length === 0) {
        setPlayerStatsLoaded(true);
        return;
      }

      try {
        // If we have Yahoo IDs, map them to NBA IDs first
        let allNbaIds = [...nbaIds];
        if (yahooIds.length > 0) {
          const { data: mappingData } = await supabase
            .from("yahoo_nba_mapping")
            .select("yahoo_id, nba_id")
            .in("yahoo_id", yahooIds);
          
          if (mappingData) {
            const mappedNbaIds = mappingData
              .map((m) => m.nba_id)
              .filter((id) => id != null);
            allNbaIds = [...allNbaIds, ...mappedNbaIds];
          }
        }
        
        // Remove duplicates
        const uniqueNbaIds = [...new Set(allNbaIds)];
        
        if (uniqueNbaIds.length === 0) {
          setPlayerStatsLoaded(true);
          return;
        }
        
        // Fetch stats using NBA IDs
        const { data, error } = await supabase
          .from("player_season_averages")
          .select("*")
          .in("player_id", uniqueNbaIds)
          .eq("season", "2025-26");
        if (error) throw error;
        
        const map = {};
        if (Array.isArray(data)) {
          data.forEach((s) => {
            map[s.player_id] = s;
          });
        }
        
        // Also create a reverse mapping from Yahoo IDs to stats
        if (yahooIds.length > 0) {
          const { data: mappingData } = await supabase
            .from("yahoo_nba_mapping")
            .select("yahoo_id, nba_id")
            .in("yahoo_id", yahooIds);
          
          if (mappingData) {
            mappingData.forEach((m) => {
              if (m.nba_id && map[m.nba_id]) {
                map[m.yahoo_id] = map[m.nba_id];
              }
            });
          }
        }
        
        setPlayerStats(map);
      } catch (e) {
        console.error("Error loading player stats:", e);
      } finally {
        setPlayerStatsLoaded(true);
      }
    };
    loadPlayerStats();
  }, [isAuthenticated, leagueTeams]);

  // ── Playoff weeks (defensive) ───────────────────────────────────
  const playoffWeeks = useMemo(() => {
    if (!playoffsData || typeof playoffStartWeek !== "number") return [];

    const weeks = [];
    for (let i = 0; i < 3; i++) {
      const weekNum = playoffStartWeek + i;
      const weekData = playoffsData.weeks?.[weekNum];

      if (
        weekData &&
        typeof weekData === "object" &&
        weekData.start &&
        weekData.end &&
        weekData.label
      ) {
        weeks.push({
          number: weekNum,
          ...weekData,
        });
      }
    }
    return weeks;
  }, [playoffsData, playoffStartWeek]);

  // ── NBA team games ─────────────────────────────────────────────
  const nbaTeamGames = useMemo(() => {
    if (!nbaTeamSchedule || !playoffWeeks.length) return [];

    const map = {};
    Object.entries(nbaTeamSchedule).forEach(([dateStr, teams]) => {
      const gameDate = new Date(dateStr);
      teams.forEach((abbr) => {
        if (!map[abbr]) map[abbr] = { team: abbr, weeks: {}, total: 0 };
        playoffWeeks.forEach((week) => {
          const s = new Date(week.start);
          const e = new Date(week.end);
          if (gameDate >= s && gameDate <= e) {
            map[abbr].weeks[week.number] = (map[abbr].weeks[week.number] || 0) + 1;
          }
        });
      });
    });
    Object.values(map).forEach((t) => {
      t.total = Object.values(t.weeks).reduce((a, b) => a + b, 0);
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [nbaTeamSchedule, playoffWeeks]);

  // ── Fantasy team data ──────────────────────────────────────────
  const fantasyTeamData = useMemo(() => {
    if (
      !isAuthenticated ||
      !Array.isArray(leagueTeams) ||
      leagueTeams.length === 0 ||
      !nbaTeamSchedule ||
      !Array.isArray(playoffWeeks) ||
      playoffWeeks.length === 0
    )
      return [];

    return leagueTeams.map((team) => {
      const players = Array.isArray(team.players) ? team.players : [];
      const weekData = {};
      let totalGames = 0,
        totalStrength = 0;

      playoffWeeks.forEach((week) => {
        let games = 0,
          strength = 0;
        const start = new Date(week.start),
          end = new Date(week.end);

        players.forEach((p) => {
          const playerId = p.id || p.yahooPlayerId || p.nbaPlayerId;
          if (!playerId) return;
          const disabled = disabledPlayers[`${team.key}_${playerId}`];
          if (disabled) return;
          const nbaTeam = p.team;

          let gamesInWeek = 0;
          Object.entries(nbaTeamSchedule).forEach(([d, ts]) => {
            if (Array.isArray(ts) && ts.includes(nbaTeam)) {
              const gd = new Date(d);
              if (gd >= start && gd <= end) gamesInWeek++;
            }
          });

          games += gamesInWeek;
          // Try nbaPlayerId first, then yahooPlayerId as fallback
          const stat = playerStats[p.nbaPlayerId] || playerStats[p.yahooPlayerId];
          if (stat?.total_value) strength += gamesInWeek * stat.total_value;
        });

        weekData[week.number] = { games, strength };
        totalGames += games;
        totalStrength += strength;
      });

      return {
        teamKey: team.key,
        teamName: team.name,
        managerNickname: team.managerNickname,
        isUserTeam: team.is_owned_by_current_login || false,
        players,
        weekData,
        totalGames,
        totalStrength: totalStrength.toFixed(2),
      };
    });
  }, [
    isAuthenticated,
    leagueTeams,
    nbaTeamSchedule,
    playoffWeeks,
    disabledPlayers,
    playerStats,
  ]);

  // Get league name
  const leagueName = useMemo(() => {
    if (leagueSettings?.leagueName) return leagueSettings.leagueName;
    if (Array.isArray(leagueTeams) && leagueTeams.length > 0) {
      return leagueTeams[0]?.league_name || "Your League";
    }
    return "Your League";
  }, [leagueSettings, leagueTeams]);

  const sortedFantasyTeams = useMemo(() => {
    const copy = [...fantasyTeamData];
    
    if (!sortBy) {
      copy.sort((a, b) => b.totalGames - a.totalGames);
      return copy;
    }
    
    const { column, type, direction } = sortBy;
    // multiplier: desc = 1 (highest first), asc = -1 (lowest first)
    const multiplier = direction === 'desc' ? 1 : -1;
    
    if (column === 'total') {
      if (type === 'games') {
        copy.sort((a, b) => multiplier * (b.totalGames - a.totalGames));
      } else {
        copy.sort((a, b) => multiplier * (+b.totalStrength - +a.totalStrength));
      }
    } else {
      const weekNum = parseInt(column);
      if (type === 'games') {
        copy.sort((a, b) => multiplier * ((b.weekData[weekNum]?.games || 0) - (a.weekData[weekNum]?.games || 0)));
      } else {
        copy.sort((a, b) => multiplier * ((b.weekData[weekNum]?.strength || 0) - (a.weekData[weekNum]?.strength || 0)));
      }
    }
    
    return copy;
  }, [fantasyTeamData, sortBy]);

  // ── Handlers ───────────────────────────────────────────────────
  const toggleTeam = (key) =>
    setExpandedTeams((p) => ({ ...p, [key]: !p[key] }));
  const togglePlayer = (teamKey, playerId) => {
    const k = `${teamKey}_${playerId}`;
    setDisabledPlayers((p) => ({ ...p, [k]: !p[k] }));
  };
  const handleSort = (column, type) => {
    setSortBy(prev => {
      if (prev && prev.column === column && prev.type === type) {
        return {
          column,
          type,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        column,
        type,
        direction: 'desc'
      };
    });
  };
  const handleWeekSelect = (e) => setPlayoffStartWeek(+e.target.value);
  const handleViewChange = (_, v) => v && setViewMode(v);

  // ── Loading guards ─────────────────────────────────────────────
  if (
    !playoffsData ||
    !nbaTeamSchedule ||
    !Array.isArray(playoffWeeks) ||
    playoffWeeks.length === 0
  ) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Loading playoff data…</Typography>
      </Box>
    );
  }

  if (isAuthenticated && isLoadingLoggedInData) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Loading league data…</Typography>
      </Box>
    );
  }

  // Helper to render sort indicator
  const SortIndicator = ({ isActive, direction }) => {
    if (!isActive) return null;
    return direction === 'desc' ? 
      <ArrowDownwardIcon sx={{ fontSize: '1rem', ml: 0.5 }} /> : 
      <ArrowUpwardIcon sx={{ fontSize: '1rem', ml: 0.5 }} />;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 1,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Fantasy Basketball Playoff Schedule Analyzer
        </Typography>
      </Box>

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        <FormControl sx={{ minWidth: 210 }}>
          <InputLabel>Playoff Start Week</InputLabel>
          <Select
            value={playoffStartWeek}
            label="Playoff Start Week"
            onChange={handleWeekSelect}
            disabled={isAuthenticated && !!leagueSettings}
          >
            {[19, 20, 21].map((n) => (
              <MenuItem key={n} value={n}>
                W{n} ({playoffsData.weeks?.[n]?.label ?? ""})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {playoffWeeks.map((w) => (
            <Chip
              key={w.number}
              label={`W${w.number}: ${w.label}`}
              color="default"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      {/* View Tabs (logged-in only) */}
      {isAuthenticated && leagueTeams?.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={viewMode}
            onChange={handleViewChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label={`${leagueName} Teams`} value="fantasy" />
            <Tab label="NBA Teams" value="nba" />
          </Tabs>
        </Box>
      )}

      {/* ── Fantasy View ──────────────────────────────────────────── */}
      {viewMode === "fantasy" && isAuthenticated && leagueTeams?.length > 0 && (
        <>
          <TableContainer 
            component={Paper} 
            elevation={3}
            sx={{
              overflowX: 'auto',
              '& .MuiTableCell-root': {
                whiteSpace: 'nowrap',
              }
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell sx={{ width: 50 }} />
                  <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>Team</TableCell>
                  {playoffWeeks.map((w) => {
                    const isGamesSorted = sortBy?.column === String(w.number) && sortBy?.type === 'games';
                    const isStrengthSorted = sortBy?.column === String(w.number) && sortBy?.type === 'strength';
                    
                    return (
                      <TableCell 
                        key={w.number} 
                        align="center" 
                        sx={{ 
                          fontWeight: 700,
                          minWidth: 140,
                          px: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>
                            Week {w.number}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box
                              onClick={() => handleSort(String(w.number), 'games')}
                              sx={{
                                cursor: 'pointer',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor: isGamesSorted ? 'primary.main' : 'grey.200',
                                color: isGamesSorted ? 'white' : 'text.primary',
                                fontSize: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                '&:hover': { 
                                  bgcolor: isGamesSorted ? 'primary.dark' : 'grey.300',
                                  transform: 'translateY(-1px)',
                                },
                              }}
                            >
                              Games
                              <SortIndicator isActive={isGamesSorted} direction={sortBy?.direction} />
                            </Box>
                            <Box
                              onClick={() => handleSort(String(w.number), 'strength')}
                              sx={{
                                cursor: 'pointer',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor: isStrengthSorted ? 'secondary.main' : 'grey.200',
                                color: isStrengthSorted ? 'white' : 'text.primary',
                                fontSize: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                '&:hover': { 
                                  bgcolor: isStrengthSorted ? 'secondary.dark' : 'grey.300',
                                  transform: 'translateY(-1px)',
                                },
                              }}
                            >
                              Strength
                              <SortIndicator isActive={isStrengthSorted} direction={sortBy?.direction} />
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                    );
                  })}
                  <TableCell
                    align="center"
                    sx={{ 
                      fontWeight: 700, 
                      bgcolor: "info.main", 
                      color: "white",
                      minWidth: 120,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'info.dark' },
                    }}
                    onClick={() => handleSort('total', 'games')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Total Games
                      <SortIndicator 
                        isActive={sortBy?.column === 'total' && sortBy?.type === 'games'} 
                        direction={sortBy?.direction} 
                      />
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ 
                      fontWeight: 700, 
                      bgcolor: "secondary.main", 
                      color: "white",
                      minWidth: 140,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'secondary.dark' },
                    }}
                    onClick={() => handleSort('total', 'strength')}
                  >
                    <Tooltip title="Sum of (games × player z-score) across all weeks">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Total Strength
                        <SortIndicator 
                          isActive={sortBy?.column === 'total' && sortBy?.type === 'strength'} 
                          direction={sortBy?.direction} 
                        />
                      </Box>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedFantasyTeams.map((team) => (
                  <React.Fragment key={team.teamKey}>
                    {/* Summary Row */}
                    <TableRow 
                      hover
                      sx={{
                        bgcolor: team.isUserTeam ? 'rgba(74, 144, 226, 0.08)' : 'transparent',
                        borderLeft: team.isUserTeam ? '4px solid #4a90e2' : 'none',
                        '&:hover': {
                          bgcolor: team.isUserTeam ? 'rgba(74, 144, 226, 0.12)' : undefined,
                        },
                      }}
                    >
                      <TableCell>
                        <IconButton size="small" onClick={() => toggleTeam(team.teamKey)}>
                          {expandedTeams[team.teamKey] ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {team.teamName}
                        </Typography>
                        {team.managerNickname && (
                          <Typography variant="caption" color="text.secondary">
                            {team.managerNickname}
                          </Typography>
                        )}
                      </TableCell>
                      {playoffWeeks.map((w) => (
                        <TableCell key={w.number} align="center">
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {team.weekData[w.number]?.games ?? 0}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ({(team.weekData[w.number]?.strength ?? 0).toFixed(1)})
                            </Typography>
                          </Box>
                        </TableCell>
                      ))}
                      <TableCell align="center" sx={{ bgcolor: "info.light", color: "white" }}>
                        <Typography sx={{ fontWeight: 700 }}>{team.totalGames}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ bgcolor: "secondary.light", color: "white" }}>
                        <Typography sx={{ fontWeight: 700 }}>{team.totalStrength}</Typography>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Player Details */}
                    <TableRow>
                      <TableCell colSpan={playoffWeeks.length + 5} sx={{ p: 0 }}>
                        <Collapse in={expandedTeams[team.teamKey]} timeout="auto" unmountOnExit>
                          <Box sx={{ m: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                              Players
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ bgcolor: "grey.50" }}>
                                  <TableCell sx={{ width: 50 }}>Active</TableCell>
                                  <TableCell>Player</TableCell>
                                  <TableCell>Team</TableCell>
                                  {playoffWeeks.map((w) => (
                                    <TableCell key={w.number} align="center">
                                      W{w.number}
                                    </TableCell>
                                  ))}
                                  <TableCell align="center">Total</TableCell>
                                  <TableCell align="center">Z-Score</TableCell>
                                  <TableCell align="center">Contribution</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {team.players.map((p) => {
                                  const playerId = p.id || p.yahooPlayerId || p.nbaPlayerId;
                                  const disabled = playerId ? disabledPlayers[`${team.teamKey}_${playerId}`] : false;
                                  // Try nbaPlayerId first, then yahooPlayerId as fallback
                                  const stat = playerStats[p.nbaPlayerId] || playerStats[p.yahooPlayerId];
                                  const z = stat?.total_value ?? 0;

                                  const weekGames = playoffWeeks.map((w) => {
                                    const start = new Date(w.start);
                                    const end = new Date(w.end);
                                    let cnt = 0;
                                    Object.entries(nbaTeamSchedule).forEach(([d, ts]) => {
                                      if (ts.includes(p.team) && new Date(d) >= start && new Date(d) <= end)
                                        cnt++;
                                    });
                                    return cnt;
                                  });

                                  const totalG = weekGames.reduce((a, b) => a + b, 0);
                                  const contrib = (totalG * z).toFixed(1);

                                  return (
                                    <TableRow
                                      key={playerId || p.yahooPlayerId || p.nbaPlayerId}
                                      sx={{
                                        opacity: disabled ? 0.45 : 1,
                                        textDecoration: disabled ? "line-through" : "none",
                                      }}
                                    >
                                      <TableCell>
                                        <Checkbox
                                          checked={!disabled}
                                          onChange={() => playerId && togglePlayer(team.teamKey, playerId)}
                                          size="small"
                                          disabled={!playerId}
                                        />
                                      </TableCell>
                                      <TableCell>{p.name}</TableCell>
                                      <TableCell>
                                        <Chip label={p.team} size="small" />
                                      </TableCell>
                                      {weekGames.map((g, i) => (
                                        <TableCell key={i} align="center">
                                          {g}
                                        </TableCell>
                                      ))}
                                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                                        {totalG}
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        sx={{
                                          color:
                                            z > 0 ? "success.main" : z < 0 ? "error.main" : "text.secondary",
                                        }}
                                      >
                                        {z.toFixed(2)}
                                      </TableCell>
                                      <TableCell align="center">{contrib}</TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* ── NBA View ──────────────────────────────────────────────── */}
      {viewMode === "nba" && (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                  {playoffWeeks.map((w) => (
                    <TableCell key={w.number} align="center" sx={{ fontWeight: 700 }}>
                      Week {w.number}
                    </TableCell>
                  ))}
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, bgcolor: "info.light", color: "white" }}
                  >
                    TOTAL
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nbaTeamGames.map((t) => (
                  <TableRow key={t.team} hover>
                    <TableCell>
                      <Chip label={t.team} size="small" />
                    </TableCell>
                    {playoffWeeks.map((w) => (
                      <TableCell key={w.number} align="center">
                        {t.weeks[w.number] ?? 0}
                      </TableCell>
                    ))}
                    <TableCell
                      align="center"
                      sx={{ bgcolor: "info.light", color: "white", fontWeight: 700 }}
                    >
                      {t.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default LeaguePlayoffs;