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

const MyLeaguePlayoffs = () => {
  const { isAuthenticated } = useAuth();
  const { leagueTeams, leagueSettings } = useLeague();

  // ── State ───────────────────────────────────────────────────────
  const [playoffStartWeek, setPlayoffStartWeek] = useState(19);
  const [nbaTeamSchedule, setNbaTeamSchedule] = useState({});
  const [playoffsData, setPlayoffsData] = useState(null);
  const [playerStats, setPlayerStats] = useState({});
  const [expandedTeams, setExpandedTeams] = useState({});
  const [disabledPlayers, setDisabledPlayers] = useState({});
  const [sortBy, setSortBy] = useState({ column: 'total', type: 'games', direction: 'desc' });
  const [isLoadingLoggedInData, setIsLoadingLoggedInData] = useState(false);
  const [playerStatsLoaded, setPlayerStatsLoaded] = useState(false);

  // ── SEO Structured Data ───────────────────────────────────────────
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "My Fantasy League Playoff Schedule",
      "description": "Analyze your fantasy basketball league's playoff schedule. Calculate playoff strength and optimize your roster.",
      "url": "https://fantasygoats.guru/my-league-playoffs",
      "applicationCategory": "SportsApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Fantasy league playoff strength calculator",
        "Player z-score based playoff optimization",
        "Weekly game count tracking",
        "Playoff roster optimization tool"
      ],
      "keywords": "fantasy basketball playoff schedule, playoff schedule analysis, fantasy basketball playoffs, fantasy playoff strength"
    };

    let scriptTag = document.getElementById('my-league-playoffs-structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'my-league-playoffs-structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      const tag = document.getElementById('my-league-playoffs-structured-data');
      if (tag) tag.remove();
    };
  }, []);

  // Track loading state for logged-in data
  useEffect(() => {
    if (isAuthenticated) {
      const hasLeagueTeams = Array.isArray(leagueTeams) && leagueTeams.length > 0;
      setIsLoadingLoggedInData(!hasLeagueTeams || !playerStatsLoaded);
    } else {
      setIsLoadingLoggedInData(false);
      setPlayerStatsLoaded(false);
    }
  }, [isAuthenticated, leagueTeams, playerStatsLoaded]);

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

  // ── Update playoff start week from league settings ──────────────
  useEffect(() => {
    if (leagueSettings?.playoffStartWeek) {
      setPlayoffStartWeek(parseInt(leagueSettings.playoffStartWeek, 10));
    }
  }, [leagueSettings]);

  // ── Initialize disabled players (lowest z-score if over roster limit) ──────────────────
  useEffect(() => {
    if (!isAuthenticated || !Array.isArray(leagueTeams) || leagueTeams.length === 0 || Object.keys(playerStats).length === 0) {
      setDisabledPlayers({});
      return;
    }

    const initialDisabled = {};

    leagueTeams.forEach((team) => {
      if (!team || !Array.isArray(team.players)) return;

      const players = team.players;
      const totalRosterSize = players.length;

      // Count IL spots (players in IL or IL+ positions)
      const ilSpots = players.filter(p => {
        const selectedPosition = p.selectedPosition || p.selected_position;
        return selectedPosition === 'IL' || selectedPosition === 'IL+';
      }).length;

      // Calculate max active roster
      const maxActiveRoster = totalRosterSize - ilSpots;


      // If we have more active players than allowed, disable the lowest z-score players
      if (players.length > maxActiveRoster) {
        const playersToDisable = players.length - maxActiveRoster;

        // Sort active players by z-score (ascending, so lowest first)
        const sortedByZScore = [...players].sort((a, b) => {
          const statA = playerStats[a.nbaPlayerId] || playerStats[a.yahooPlayerId];
          const statB = playerStats[b.nbaPlayerId] || playerStats[b.yahooPlayerId];
          const zScoreA = statA?.total_value ?? -999;
          const zScoreB = statB?.total_value ?? -999;
          return zScoreA - zScoreB;
        });

        // Disable the lowest z-score players
        for (let i = 0; i < playersToDisable; i++) {
          const player = sortedByZScore[i];
          const playerId = player.id || player.yahooPlayerId || player.nbaPlayerId;
          if (playerId) {
            initialDisabled[`${team.key}_${playerId}`] = true;
          }
        }
      }
    });

    setDisabledPlayers(initialDisabled);
  }, [isAuthenticated, leagueTeams, playerStats]);

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

  // ── Playoff weeks ───────────────────────────────────────────────
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
          {leagueName} - Playoff Schedule
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
          >
            {[19, 20, 21].map((n) => {
              const isLeagueDefault = leagueSettings?.playoffStartWeek === n;
              return (
                <MenuItem key={n} value={n}>
                  W{n} ({playoffsData.weeks?.[n]?.label ?? ""})
                  {isLeagueDefault && (
                    <Chip
                      label="League Setting"
                      size="small"
                      sx={{
                        ml: 1,
                        height: 20,
                        fontSize: "0.65rem",
                        backgroundColor: "#4a90e2",
                        color: "#fff",
                      }}
                    />
                  )}
                </MenuItem>
              );
            })}
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
            Connect to Yahoo! to see your team's playoff strength
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

export default MyLeaguePlayoffs;

