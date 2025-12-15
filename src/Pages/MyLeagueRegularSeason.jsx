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
  CircularProgress,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import { useAuth } from "../contexts/AuthContext";
import { useLeague } from "../contexts/LeagueContext";
import { supabase } from "../utils/supabase";

const MyLeagueRegularSeason = () => {
  const { isAuthenticated } = useAuth();
  const { selectedLeague, leagueTeams } = useLeague();

  // ── State ───────────────────────────────────────────────────────
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [nbaTeamSchedule, setNbaTeamSchedule] = useState({});
  const [allWeeks, setAllWeeks] = useState([]);
  const [leagueSettings, setLeagueSettings] = useState(null);
  const [playerStats, setPlayerStats] = useState({});
  const [expandedTeams, setExpandedTeams] = useState({});
  const [disabledPlayers, setDisabledPlayers] = useState({});
  const [sortBy, setSortBy] = useState({ column: 'total', type: 'games', direction: 'desc' });
  const [isLoadingLoggedInData, setIsLoadingLoggedInData] = useState(false);
  const [leagueSettingsLoaded, setLeagueSettingsLoaded] = useState(false);
  const [playerStatsLoaded, setPlayerStatsLoaded] = useState(false);

  // ── SEO Structured Data ───────────────────────────────────────────
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "My Fantasy League Regular Season Schedule",
      "description": "Analyze your fantasy basketball league's regular season schedule. Track weekly games and optimize your lineup throughout the season.",
      "url": "https://fantasygoats.guru/my-league-regular-season",
      "applicationCategory": "SportsApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Fantasy league regular season schedule",
        "Player z-score based optimization",
        "Weekly game count tracking",
        "Season-long roster planning"
      ],
      "keywords": "fantasy basketball schedule, regular season schedule, fantasy basketball optimization"
    };

    let scriptTag = document.getElementById('my-league-regular-season-structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'my-league-regular-season-structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      const tag = document.getElementById('my-league-regular-season-structured-data');
      if (tag) tag.remove();
    };
  }, []);

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
        const [scheduleRes, weeksRes] = await Promise.all([
          fetch("/data/schedule.json"),
          fetch("/data/weeks.json"),
        ]);
        const schedule = await scheduleRes.json();
        const weeksData = await weeksRes.json();

        setNbaTeamSchedule(schedule);
        
        // Generate all weeks from weeks data
        if (weeksData?.weeks) {
          const weeks = Object.entries(weeksData.weeks).map(([weekNum, weekData]) => ({
            number: parseInt(weekNum),
            ...weekData,
          })).sort((a, b) => a.number - b.number);
          setAllWeeks(weeks);
          
          // Set current week based on today's date
          const today = new Date();
          const currentWeek = weeks.find(w => {
            const start = new Date(w.start);
            const end = new Date(w.end);
            return today >= start && today <= end;
          });
          if (currentWeek) {
            setSelectedWeek(currentWeek.number);
          }
        }
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
        const playerId = p.id || p.yahooPlayerId || p.nbaPlayerId;
        if (!playerId) return;
        
        const selectedPosition = p.selectedPosition || p.selected_position;
        const status = p.status;
        
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
        
        const uniqueNbaIds = [...new Set(allNbaIds)];
        
        if (uniqueNbaIds.length === 0) {
          setPlayerStatsLoaded(true);
          return;
        }
        
        const { data, error } = await supabase
          .from("player_period_averages")
          .select("*")
          .in("player_id", uniqueNbaIds)
          .eq("season", "2025-26")
          .eq("period_type", "season");
        if (error) throw error;
        
        const map = {};
        if (Array.isArray(data)) {
          data.forEach((s) => {
            map[s.player_id] = s;
          });
        }
        
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

  // ── Current week data ─────────────────────────────────────────────
  const currentWeekData = useMemo(() => {
    return allWeeks.find(w => w.number === selectedWeek);
  }, [selectedWeek, allWeeks]);

  // Determine if selected week is current week
  const isCurrentWeek = useMemo(() => {
    if (!currentWeekData) return false;
    const today = new Date();
    const weekStart = new Date(currentWeekData.start);
    const weekEnd = new Date(currentWeekData.end);
    return today >= weekStart && today <= weekEnd;
  }, [currentWeekData]);

  // ── Fantasy team data ──────────────────────────────────────────
  const fantasyTeamData = useMemo(() => {
    if (
      !isAuthenticated ||
      !Array.isArray(leagueTeams) ||
      leagueTeams.length === 0 ||
      !nbaTeamSchedule ||
      !currentWeekData
    )
      return [];

    return leagueTeams.map((team) => {
      const players = Array.isArray(team.players) ? team.players : [];
      let weekGames = 0;
      let weekStrength = 0;

      const start = new Date(currentWeekData.start);
      const end = new Date(currentWeekData.end);

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

        weekGames += gamesInWeek;
        const stat = playerStats[p.nbaPlayerId] || playerStats[p.yahooPlayerId];
        if (stat?.total_value) weekStrength += gamesInWeek * stat.total_value;
      });

      return {
        teamKey: team.key,
        teamName: team.name,
        managerNickname: team.managerNickname,
        isUserTeam: team.is_owned_by_current_login || false,
        players,
        weekGames,
        weekStrength: weekStrength.toFixed(2),
      };
    });
  }, [
    isAuthenticated,
    leagueTeams,
    nbaTeamSchedule,
    currentWeekData,
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
      copy.sort((a, b) => b.weekGames - a.weekGames);
      return copy;
    }
    
    const { type, direction } = sortBy;
    const multiplier = direction === 'desc' ? 1 : -1;
    
    if (type === 'games') {
      copy.sort((a, b) => multiplier * (b.weekGames - a.weekGames));
    } else {
      copy.sort((a, b) => multiplier * (+b.weekStrength - +a.weekStrength));
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
  const handleSort = (type) => {
    setSortBy(prev => {
      if (prev && prev.type === type) {
        return {
          column: 'week',
          type,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        column: 'week',
        type,
        direction: 'desc'
      };
    });
  };
  const handleWeekSelect = (e) => setSelectedWeek(+e.target.value);
  const handleYahooConnect = async () => {
    try {
      const currentPath = window.location.pathname;
      sessionStorage.setItem('oauth_return_path', currentPath);
      
      const isDev = window.location.hostname === 'localhost';
      const { data } = await supabase.functions.invoke('yahoo-oauth', { body: { action: 'authorize', isDev } });
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── Loading guards ─────────────────────────────────────────────
  if (!nbaTeamSchedule || !allWeeks.length || !currentWeekData) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Loading schedule data…</Typography>
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
          {leagueName} - Regular Season Schedule
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
          <InputLabel>Week</InputLabel>
          <Select
            value={selectedWeek}
            label="Week"
            onChange={handleWeekSelect}
          >
            {allWeeks.map((w) => (
              <MenuItem key={w.number} value={w.number}>
                W{w.number} ({w.label})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Chip
          label={`${currentWeekData.label}${isCurrentWeek ? ' (Current Week)' : ''}`}
          color={isCurrentWeek ? "primary" : "default"}
          variant={isCurrentWeek ? "filled" : "outlined"}
          sx={{ fontWeight: isCurrentWeek ? 700 : 400 }}
        />
      </Box>

      {/* ── Fantasy View ──────────────────────────────────────────── */}
      {isAuthenticated && leagueTeams?.length > 0 ? (
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
                    onClick={() => handleSort('games')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Games
                      <SortIndicator 
                        isActive={sortBy?.type === 'games'} 
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
                    onClick={() => handleSort('strength')}
                  >
                    <Tooltip title="Sum of (games × player z-score) for the week">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Strength
                        <SortIndicator 
                          isActive={sortBy?.type === 'strength'} 
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
                      <TableCell align="center" sx={{ bgcolor: "info.light", color: "white" }}>
                        <Typography sx={{ fontWeight: 700 }}>{team.weekGames}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ bgcolor: "secondary.light", color: "white" }}>
                        <Typography sx={{ fontWeight: 700 }}>{team.weekStrength}</Typography>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Player Details */}
                    <TableRow>
                      <TableCell colSpan={4} sx={{ p: 0 }}>
                        <Collapse in={expandedTeams[team.teamKey]} timeout="auto" unmountOnExit>
                          <Box sx={{ m: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                              Players - Week {selectedWeek}
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ bgcolor: "grey.50" }}>
                                  <TableCell sx={{ width: 50 }}>Active</TableCell>
                                  <TableCell>Player</TableCell>
                                  <TableCell>Team</TableCell>
                                  <TableCell align="center">Games</TableCell>
                                  <TableCell align="center">Z-Score</TableCell>
                                  <TableCell align="center">Contribution</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {team.players.map((p) => {
                                  const playerId = p.id || p.yahooPlayerId || p.nbaPlayerId;
                                  const disabled = playerId ? disabledPlayers[`${team.teamKey}_${playerId}`] : false;
                                  const stat = playerStats[p.nbaPlayerId] || playerStats[p.yahooPlayerId];
                                  const z = stat?.total_value ?? 0;

                                  const start = new Date(currentWeekData.start);
                                  const end = new Date(currentWeekData.end);
                                  let gamesInWeek = 0;
                                  Object.entries(nbaTeamSchedule).forEach(([d, ts]) => {
                                    if (ts.includes(p.team) && new Date(d) >= start && new Date(d) <= end)
                                      gamesInWeek++;
                                  });

                                  const contrib = (gamesInWeek * z).toFixed(1);

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
                                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                                        {gamesInWeek}
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
      ) : (
        <Box
          sx={{
            mt: 4,
            p: 3,
            bgcolor: "primary.main",
            color: "white",
            borderRadius: 2,
            textAlign: "center",
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Connect to Yahoo! to see your team's schedule
          </Typography>
          <Button
            variant="contained"
            startIcon={<SportsBasketballIcon />}
            onClick={handleYahooConnect}
            sx={{
              bgcolor: "white",
              color: "primary.main",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            Connect to Yahoo
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MyLeagueRegularSeason;

