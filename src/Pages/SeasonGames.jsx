import React, { useState, useEffect } from "react";
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
  TextField,
  Autocomplete,
  Chip,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TableSortLabel,
  Grid,
  Avatar,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { supabase, CURRENT_SEASON } from "../utils/supabase";

const SeasonGames = () => {
  const [gameStats, setGameStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(null);
  const [filterValue, setFilterValue] = useState([]);
  const [filterOperator, setFilterOperator] = useState("=");
  const [filterNumericValue, setFilterNumericValue] = useState("");
  const [filters, setFilters] = useState([]);
  const [sortColumn, setSortColumn] = useState("fantasy_points");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Available filter types
  const filterTypes = [
    { key: "player_name", label: "Player", isText: true },
    { key: "team", label: "Team", isText: true },
    { key: "game_date", label: "Game Date", isDate: true },
    { key: "points", label: "Points", isNumeric: true },
    { key: "rebounds", label: "Rebounds", isNumeric: true },
    { key: "assists", label: "Assists", isNumeric: true },
    { key: "steals", label: "Steals", isNumeric: true },
    { key: "blocks", label: "Blocks", isNumeric: true },
    { key: "three_pointers_made", label: "Three Pointers", isNumeric: true },
    { key: "turnovers", label: "Turnovers", isNumeric: true },
    { key: "fantasy_points", label: "Fantasy Points", isNumeric: true },
  ];

  // Operators for numerical filters
  const operators = [
    { value: ">", label: ">" },
    { value: ">=", label: ">=" },
    { value: "<", label: "<" },
    { value: "<=", label: "<=" },
    { value: "=", label: "=" },
  ];

  // Normalize player names for avatar URLs
  const normalizeName = (name) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z]/g, "")
      .toLowerCase();
  };

  // Safe number formatting helpers
  const formatNumber = (value, decimals = 0) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    return value.toFixed(decimals);
  };

  const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    return `${(value * 100).toFixed(decimals)}%`;
  };

  // Calculate fantasy points
  const calculateFantasyPoints = (game) => {
    const points = game.points || 0;
    const rebounds = game.rebounds || 0;
    const assists = game.assists || 0;
    const steals = game.steals || 0;
    const blocks = game.blocks || 0;
    const threePointers = game.three_pointers_made || 0;
    const turnovers = game.turnovers || 0;

    return points + rebounds + assists + (steals * 2) + (blocks * 2) + threePointers - turnovers;
  };

  // Fetch game stats based on filters
  useEffect(() => {
    const loadGameStats = async () => {
      try {
        setLoading(true);

        // First, get all player mappings to create a lookup
        const { data: mappingData, error: mappingError } = await supabase
          .from('yahoo_nba_mapping')
          .select('nba_id, name, team');

        if (mappingError) throw mappingError;

        // Create a lookup map for player info
        const playerMap = {};
        mappingData.forEach(player => {
          playerMap[player.nba_id] = {
            name: player.name,
            team: player.team
          };
        });

        // Build query for game logs
        let query = supabase
          .from('player_game_logs')
          .select('*')
          .eq('season', CURRENT_SEASON)
          .order('game_date', { ascending: false });

        // Apply filters
        filters.forEach(filter => {
          if (filter.isNumeric) {
            const value = parseFloat(filter.value);
            switch (filter.operator) {
              case '>':
                query = query.gt(filter.key, value);
                break;
              case '>=':
                query = query.gte(filter.key, value);
                break;
              case '<':
                query = query.lt(filter.key, value);
                break;
              case '<=':
                query = query.lte(filter.key, value);
                break;
              case '=':
                query = query.eq(filter.key, value);
                break;
              default:
                break;
            }
          } else if (filter.isDate) {
            query = query.eq(filter.key, filter.value);
          }
          // Text filters will be applied after joining with player data
        });

        const { data, error } = await query.limit(1000);

        if (error) throw error;

        // Join with player mapping data and calculate fantasy points
        let statsWithFantasyPoints = data.map(game => {
          const playerInfo = playerMap[game.player_id] || { name: game.player_name || 'Unknown', team: 'Unknown' };
          return {
            ...game,
            player_name: playerInfo.name,
            team: playerInfo.team,
            fantasy_points: calculateFantasyPoints(game),
            field_goal_percentage: game.field_goals_attempted > 0 
              ? game.field_goals_made / game.field_goals_attempted 
              : 0,
            free_throw_percentage: game.free_throws_attempted > 0 
              ? game.free_throws_made / game.free_throws_attempted 
              : 0,
          };
        });

        // Apply text filters after joining
        filters.forEach(filter => {
          if (filter.isText) {
            if (filter.key === 'player_name') {
              statsWithFantasyPoints = statsWithFantasyPoints.filter(game => 
                game.player_name.toLowerCase().includes(filter.value.toLowerCase())
              );
            } else if (filter.key === 'team') {
              statsWithFantasyPoints = statsWithFantasyPoints.filter(game => 
                game.team === filter.value
              );
            }
          }
        });

        setGameStats(statsWithFantasyPoints);
      } catch (error) {
        console.error("Error loading game stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGameStats();
  }, [filters]);

  // Handle column sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      if (sortDirection === "desc") {
        setSortDirection("asc");
      } else if (sortDirection === "asc") {
        setSortColumn("");
        setSortDirection("asc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort and paginate stats
  const sortedStats = [...gameStats].sort((a, b) => {
    if (!sortColumn) return 0;
    let valueA, valueB;
    if (["player_name", "game_date", "team", "opponent"].includes(sortColumn)) {
      valueA = a[sortColumn] || "";
      valueB = b[sortColumn] || "";
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else {
      valueA = a[sortColumn] || 0;
      valueB = b[sortColumn] || 0;
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  const paginatedStats = sortedStats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Handle filter type change
  const handleFilterTypeChange = (event, newValue) => {
    setFilterType(newValue);
    setFilterValue([]);
    setFilterNumericValue("");
    setFilterOperator(newValue?.isNumeric ? ">=" : "=");
  };

  // Handle adding a filter
  const handleAddFilter = () => {
    if (!filterType) return;

    let newFilter;
    if (filterType.isNumeric) {
      if (!filterNumericValue || isNaN(filterNumericValue)) {
        alert("Please enter a valid number for the filter value.");
        return;
      }
      newFilter = {
        key: filterType.key,
        value: filterNumericValue,
        operator: filterOperator,
        isNumeric: true,
        label: `${filterType.label}: ${filterOperator} ${filterNumericValue}`,
      };
    } else if (filterType.isText || filterType.isDate) {
      if (!filterNumericValue) {
        alert("Please enter a value for the filter.");
        return;
      }
      newFilter = {
        key: filterType.key,
        value: filterNumericValue,
        isText: filterType.isText,
        isDate: filterType.isDate,
        label: `${filterType.label}: ${filterNumericValue}`,
      };
    } else {
      alert("Please enter a filter value.");
      return;
    }

    setFilters([...filters, newFilter]);
    setFilterType(null);
    setFilterValue([]);
    setFilterOperator("=");
    setFilterNumericValue("");
  };

  // Handle removing a filter
  const handleDeleteFilter = (indexToDelete) => {
    setFilters(filters.filter((_, index) => index !== indexToDelete));
    setPage(0);
  };

  // Handle clearing all filters
  const handleClearFilters = () => {
    setFilters([]);
    setFilterType(null);
    setFilterValue([]);
    setFilterOperator("=");
    setFilterNumericValue("");
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)", minHeight: "100vh" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              color: "#212121",
              fontWeight: 500,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {CURRENT_SEASON} Season Top Games
          </Typography>

          {/* Filter Builder */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center", flexWrap: "wrap" }}>
            <Autocomplete
              options={filterTypes}
              getOptionLabel={(option) => option?.label || "Select filter type"}
              value={filterType}
              onChange={handleFilterTypeChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter Type"
                  placeholder="Select filter type"
                  variant="outlined"
                  sx={{
                    width: 200,
                    backgroundColor: "#ffffff",
                    "& .MuiInputBase-input": { color: "#212121" },
                    "& .MuiInputLabel-root": { color: "#424242" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "rgba(0, 0, 0, 0.12)" },
                      "&:hover fieldset": { borderColor: "#1976d2" },
                    },
                  }}
                />
              )}
              sx={{ width: 200 }}
            />

            {filterType?.isNumeric && (
              <FormControl sx={{ width: 100 }}>
                <InputLabel sx={{ color: "#424242" }}>Operator</InputLabel>
                <Select
                  value={filterOperator}
                  onChange={(e) => setFilterOperator(e.target.value)}
                  sx={{
                    backgroundColor: "#ffffff",
                    color: "#212121",
                    "& .MuiSvgIcon-root": { color: "#424242" },
                    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.12)" },
                    "&:hover fieldset": { borderColor: "#1976d2" },
                  }}
                >
                  {operators.map((op) => (
                    <MenuItem key={op.value} value={op.value}>
                      {op.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <TextField
              label={filterType?.isDate ? "Date (YYYY-MM-DD)" : "Value"}
              placeholder={filterType?.isDate ? "e.g. 2024-11-10" : "Enter value"}
              value={filterNumericValue}
              onChange={(e) => setFilterNumericValue(e.target.value)}
              type={filterType?.isNumeric ? "number" : "text"}
              variant="outlined"
              disabled={!filterType}
              sx={{
                width: 200,
                backgroundColor: "#ffffff",
                "& .MuiInputBase-input": { color: "#212121" },
                "& .MuiInputLabel-root": { color: "#424242" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(0, 0, 0, 0.12)" },
                  "&:hover fieldset": { borderColor: "#1976d2" },
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleAddFilter}
              disabled={!filterType || !filterNumericValue}
              sx={{
                backgroundColor: "#1976d2",
                color: "#ffffff",
                "&:hover": { backgroundColor: "#1565c0" },
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Add Filter
            </Button>

            <Button
              variant="outlined"
              onClick={handleClearFilters}
              sx={{
                color: "#424242",
                borderColor: "rgba(0, 0, 0, 0.12)",
                "&:hover": { borderColor: "#1976d2", backgroundColor: "rgba(25, 118, 210, 0.04)" },
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Clear Filters
            </Button>
          </Box>

          {/* Display Applied Filters */}
          <Box sx={{ mb: 3 }}>
            {filters.map((filter, index) => (
              <Chip
                key={index}
                label={filter.label}
                onDelete={() => handleDeleteFilter(index)}
                sx={{
                  mr: 1,
                  mb: 1,
                  backgroundColor: "#ffffff",
                  color: "#212121",
                  border: "1px solid #333333",
                }}
              />
            ))}
          </Box>

          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: "#f5f5f5", border: "1px solid rgba(0, 0, 0, 0.12)" }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#ffffff" }}>
                  <TableCell
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "player_name"}
                      direction={sortColumn === "player_name" ? sortDirection : "asc"}
                      onClick={() => handleSort("player_name")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      Player
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "game_date"}
                      direction={sortColumn === "game_date" ? sortDirection : "asc"}
                      onClick={() => handleSort("game_date")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "team"}
                      direction={sortColumn === "team" ? sortDirection : "asc"}
                      onClick={() => handleSort("team")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      Team
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "opponent"}
                      direction={sortColumn === "opponent" ? sortDirection : "asc"}
                      onClick={() => handleSort("opponent")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      vs
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "points"}
                      direction={sortColumn === "points" ? sortDirection : "asc"}
                      onClick={() => handleSort("points")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      PTS
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "rebounds"}
                      direction={sortColumn === "rebounds" ? sortDirection : "asc"}
                      onClick={() => handleSort("rebounds")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      REB
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "assists"}
                      direction={sortColumn === "assists" ? sortDirection : "asc"}
                      onClick={() => handleSort("assists")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      AST
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "steals"}
                      direction={sortColumn === "steals" ? sortDirection : "asc"}
                      onClick={() => handleSort("steals")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      STL
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "blocks"}
                      direction={sortColumn === "blocks" ? sortDirection : "asc"}
                      onClick={() => handleSort("blocks")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      BLK
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "field_goal_percentage"}
                      direction={sortColumn === "field_goal_percentage" ? sortDirection : "asc"}
                      onClick={() => handleSort("field_goal_percentage")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      FG%
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "free_throw_percentage"}
                      direction={sortColumn === "free_throw_percentage" ? sortDirection : "asc"}
                      onClick={() => handleSort("free_throw_percentage")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      FT%
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "three_pointers_made"}
                      direction={sortColumn === "three_pointers_made" ? sortDirection : "asc"}
                      onClick={() => handleSort("three_pointers_made")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      3PT
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "turnovers"}
                      direction={sortColumn === "turnovers" ? sortDirection : "asc"}
                      onClick={() => handleSort("turnovers")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      TOV
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "#212121",
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      p: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "fantasy_points"}
                      direction={sortColumn === "fantasy_points" ? sortDirection : "asc"}
                      onClick={() => handleSort("fantasy_points")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      Fantasy Pts
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={14} align="center">
                      <CircularProgress sx={{ color: "#1976d2" }} />
                    </TableCell>
                  </TableRow>
                ) : paginatedStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} align="center" sx={{ color: "#424242" }}>
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStats.map((stat, index) => (
                    <TableRow
                      key={`${stat.player_id}-${stat.game_date}-${index}`}
                      sx={{
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontSize: "0.85rem",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar
                            src={`https://www.basketball-reference.com/req/202106291/images/headshots/${(() => {
                              const names = stat.player_name.split(" ");
                              if (names.length < 2) return "default";
                              const firstName = names[0];
                              const lastName = names[names.length - 1];
                              const normalizedLastName = normalizeName(lastName);
                              const normalizedFirstName = normalizeName(firstName);
                              return `${normalizedLastName.substring(0, 5)}${normalizedFirstName.substring(0, 2)}01`;
                            })()}.jpg`}
                            onError={(e) => {
                              e.target.src = "https://www.basketball-reference.com/req/202106291/images/headshots/default.jpg";
                            }}
                            sx={{
                              width: 32,
                              height: 32,
                              border: "1px solid rgba(0, 0, 0, 0.12)",
                              "&:hover": { border: "1px solid #1976d2" },
                            }}
                          />
                          {stat.player_name}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontSize: "0.85rem",
                        }}
                      >
                        {stat.game_date}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontSize: "0.85rem",
                        }}
                      >
                        {stat.team}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontSize: "0.85rem",
                        }}
                      >
                        {stat.opponent || '-'}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.85rem",
                        }}
                      >
                        {formatNumber(stat.points, 0)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.85rem",
                        }}
                      >
                        {formatNumber(stat.rebounds, 0)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.85rem",
                        }}
                      >
                        {formatNumber(stat.assists, 0)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.85rem",
                        }}
                      >
                        {formatNumber(stat.steals, 0)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.85rem",
                        }}
                      >
                        {formatNumber(stat.blocks, 0)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.85rem",
                        }}
                      >
                        {formatPercentage(stat.field_goal_percentage)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.85rem",
                        }}
                      >
                        {formatPercentage(stat.free_throw_percentage)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.85rem",
                        }}
                      >
                        {formatNumber(stat.three_pointers_made, 0)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.85rem",
                        }}
                      >
                        {formatNumber(stat.turnovers, 0)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        {formatNumber(stat.fantasy_points, 1)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={sortedStats.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: "#212121",
              "& .MuiTablePagination-selectLabel": { color: "#424242" },
              "& .MuiTablePagination-displayedRows": { color: "#424242" },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SeasonGames;

