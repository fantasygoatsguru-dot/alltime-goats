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
  CircularProgress,
  Button,
  Tooltip,
  TableSortLabel,
} from "@mui/material";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import InfoIcon from "@mui/icons-material/Info";
import { useAuth } from "../contexts/AuthContext";
import { useLeague } from "../contexts/LeagueContext";
import { supabase } from "../utils/supabase";

const CURRENT_SEASON = "2025-26";

const CATEGORIES = [
  { key: "points", label: "PTS", zKey: "points_z" },
  { key: "rebounds", label: "REB", zKey: "rebounds_z" },
  { key: "assists", label: "AST", zKey: "assists_z" },
  { key: "steals", label: "STL", zKey: "steals_z" },
  { key: "blocks", label: "BLK", zKey: "blocks_z" },
  { key: "threePointers", label: "3PM", zKey: "three_pointers_z" },
  { key: "fieldGoalPercentage", label: "FG%", zKey: "fg_percentage_z" },
  { key: "freeThrowPercentage", label: "FT%", zKey: "ft_percentage_z" },
  { key: "turnovers", label: "TO", zKey: "turnovers_z" },
];

const CategoryBreakdown = () => {
  const { isAuthenticated, user } = useAuth();
  const { leagueTeams, leagueSettings } = useLeague();

  const [playerStats, setPlayerStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "desc" });

  const handleYahooConnect = async () => {
    try {
      const currentPath = window.location.pathname;
      sessionStorage.setItem("oauth_return_path", currentPath);

      const isDev = window.location.hostname === "localhost";
      const { data } = await supabase.functions.invoke("yahoo-oauth", {
        body: { action: "authorize", isDev },
      });
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Load player stats
  useEffect(() => {
    const loadPlayerStats = async () => {
      if (!isAuthenticated || !Array.isArray(leagueTeams) || leagueTeams.length === 0) {
        setPlayerStats({});
        return;
      }

      setIsLoading(true);

      try {
        const nbaIds = [];
        const yahooIds = [];

        leagueTeams.forEach((team) => {
          if (!team || !Array.isArray(team.players)) return;
          team.players.forEach((player) => {
            if (player?.nbaPlayerId) nbaIds.push(player.nbaPlayerId);
            if (player?.yahooPlayerId && !player?.nbaPlayerId) yahooIds.push(player.yahooPlayerId);
          });
        });

        if (nbaIds.length === 0 && yahooIds.length === 0) {
          setPlayerStats({});
          return;
        }

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
          setPlayerStats({});
          return;
        }

        const { data, error } = await supabase
          .from("player_period_averages")
          .select("*")
          .in("player_id", uniqueNbaIds)
          .eq("season", CURRENT_SEASON)
          .eq("period_type", "season");

        if (error) throw error;

        const statsMap = {};
        if (Array.isArray(data)) {
          data.forEach((stat) => {
            statsMap[stat.player_id] = {
              points: stat.points_per_game || 0,
              rebounds: stat.rebounds_per_game || 0,
              assists: stat.assists_per_game || 0,
              steals: stat.steals_per_game || 0,
              blocks: stat.blocks_per_game || 0,
              threePointers: stat.three_pointers_per_game || 0,
              fieldGoalPercentage: stat.field_goal_percentage || 0,
              freeThrowPercentage: stat.free_throw_percentage || 0,
              turnovers: stat.turnovers_per_game || 0,
              points_z: stat.points_z || 0,
              rebounds_z: stat.rebounds_z || 0,
              assists_z: stat.assists_z || 0,
              steals_z: stat.steals_z || 0,
              blocks_z: stat.blocks_z || 0,
              three_pointers_z: stat.three_pointers_z || 0,
              fg_percentage_z: stat.fg_percentage_z || 0,
              ft_percentage_z: stat.ft_percentage_z || 0,
              turnovers_z: stat.turnovers_z || 0,
            };
          });
        }

        if (yahooIds.length > 0) {
          const { data: mappingData } = await supabase
            .from("yahoo_nba_mapping")
            .select("yahoo_id, nba_id")
            .in("yahoo_id", yahooIds);

          if (mappingData) {
            mappingData.forEach((mapping) => {
              if (mapping.nba_id && statsMap[mapping.nba_id]) {
                statsMap[mapping.yahoo_id] = statsMap[mapping.nba_id];
              }
            });
          }
        }

        setPlayerStats(statsMap);
      } catch (error) {
        console.error("Error loading player stats:", error);
        setPlayerStats({});
      } finally {
        setIsLoading(false);
      }
    };

    loadPlayerStats();
  }, [isAuthenticated, leagueTeams]);

  // Calculate team category scores
  const teamCategoryScores = useMemo(() => {
    if (!leagueTeams || leagueTeams.length === 0 || Object.keys(playerStats).length === 0) {
      return [];
    }

    return leagueTeams.map((team) => {
      const teamData = {
        teamName: team.name,
        managerNickname: team.managerNickname,
        isUserTeam: team.is_owned_by_current_login || false,
      };

      CATEGORIES.forEach((category) => {
        let totalZScore = 0;
        let playerCount = 0;

        if (Array.isArray(team.players)) {
          team.players.forEach((player) => {
            const stats = playerStats[player.nbaPlayerId] || playerStats[player.yahooPlayerId];
            if (stats && stats[category.zKey] !== undefined) {
              totalZScore += stats[category.zKey];
              playerCount++;
            }
          });
        }

        teamData[category.key] = playerCount > 0 ? totalZScore : 0;
      });

      return teamData;
    });
  }, [leagueTeams, playerStats]);

  // Sorted teams
  const sortedTeams = useMemo(() => {
    if (!sortConfig.key) return teamCategoryScores;

    const sorted = [...teamCategoryScores].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.direction === "asc") {
        return aValue - bValue;
      }
      return bValue - aValue;
    });

    return sorted;
  }, [teamCategoryScores, sortConfig]);

  const handleSort = (categoryKey) => {
    setSortConfig((prev) => ({
      key: categoryKey,
      direction: prev.key === categoryKey && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const leagueName = useMemo(() => {
    if (leagueSettings?.leagueName) return leagueSettings.leagueName;
    if (Array.isArray(leagueTeams) && leagueTeams.length > 0) {
      return leagueTeams[0]?.league_name || "Your League";
    }
    return "Your League";
  }, [leagueSettings, leagueTeams]);

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
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
            Connect to Yahoo to view category breakdown
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
      </Box>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Loading league data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {leagueName} - Category Breakdown
          </Typography>
          <Tooltip
            title={
              <Box sx={{ p: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  How are scores calculated?
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Each team's score for a category is the <strong>sum of all z-scores</strong> from their players in that category.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Z-scores</strong> measure how many standard deviations a player's performance is above or below the league average.
                </Typography>
                <Typography variant="body2">
                  Higher positive z-scores = better performance. Negative z-scores = below average performance.
                </Typography>
              </Box>
            }
            arrow
            placement="right"
          >
            <InfoIcon sx={{ color: "#4a90e2", cursor: "help", fontSize: "1.5rem" }} />
          </Tooltip>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Click column headers to sort by category
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 700, minWidth: 180, position: "sticky", left: 0, bgcolor: "grey.100", zIndex: 100 }}>
                Team
              </TableCell>
              {CATEGORIES.map((category) => (
                <TableCell
                  key={category.key}
                  align="center"
                  sx={{
                    fontWeight: 700,
                    minWidth: 100,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "rgba(74, 144, 226, 0.08)" },
                  }}
                >
                  <TableSortLabel
                    active={sortConfig.key === category.key}
                    direction={sortConfig.key === category.key ? sortConfig.direction : "desc"}
                    onClick={() => handleSort(category.key)}
                  >
                    {category.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTeams.map((team, index) => (
              <TableRow
                key={index}
                hover
                sx={{
                  bgcolor: "rgba(74, 144, 226, 0.08)" ,
                  borderLeft: team.isUserTeam ? "4px solid #4a90e2" : "none",
                  "&:hover": {
                    bgcolor: team.isUserTeam ? "rgba(74, 144, 226, 0.12)" : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <TableCell sx={{ position: "sticky", left: 0, bgcolor:  "white", zIndex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: team.isUserTeam ? 700 : 600 }}>
                    {team.teamName}
                  </Typography>
                  {team.managerNickname && (
                    <Typography variant="caption" color="text.secondary">
                      {team.managerNickname}
                    </Typography>
                  )}
                </TableCell>
                {CATEGORIES.map((category) => {
                  const value = team[category.key] || 0;
                  const isPositive = value > 0;
                  const isNegative = value < 0;

                  return (
                    <TableCell
                      key={category.key}
                      align="center"
                      sx={{
                        color: isPositive ? "success.main" : isNegative ? "error.main" : "text.secondary",
                        fontWeight: Math.abs(value) > 2 ? 700 : 500,
                      }}
                    >
                      {value > 0 ? "+" : ""}
                      {value.toFixed(2)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {sortedTeams.length === 0 && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography color="text.secondary">No team data available</Typography>
        </Box>
      )}
    </Box>
  );
};

export default CategoryBreakdown;

