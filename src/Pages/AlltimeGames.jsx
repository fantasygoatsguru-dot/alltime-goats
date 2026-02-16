import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableBody,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { searchPlayers, fetchFilteredPlayerGameStats } from "../api";
import GameFilterSection from "./GameFilterSection";
import GameTableHeader from "./GameTableHeader";
import GameRow from "./GameRow";
import { GAME_PUNT_CATEGORIES, GAME_FILTER_TYPES, GAME_FILTER_VALUE_SUGGESTIONS, OPERATORS } from "../constants/categories";
import { parseQueryFilters, filtersToQueryParams } from "../utils/queryParams";

const AlltimeGames = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [players, setPlayers] = useState([]);
  const [gameStats, setGameStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(null);
  const [filterValue, setFilterValue] = useState([]);
  const [filterOperator, setFilterOperator] = useState("=");
  const [filterNumericValue, setFilterNumericValue] = useState("");
  const [filters, setFilters] = useState(() => parseQueryFilters(searchParams, GAME_FILTER_TYPES, GAME_FILTER_VALUE_SUGGESTIONS, OPERATORS));
  const [sortColumn, setSortColumn] = useState("fantasy_points");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [puntedCategories, setPuntedCategories] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [playerSearchTerm, setPlayerSearchTerm] = useState("");
  const [playerSearchResults, setPlayerSearchResults] = useState([]);

  // Generate seasons from 1960-61 to 2023-24
  const seasons = Array.from({ length: 2024 - 1960 }, (_, i) => {
    const startYear = 1960 + i;
    const endYear = (startYear + 1) % 100;
    return `${startYear}-${endYear.toString().padStart(2, "0")}`;
  }).reverse();

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
    if (value === null || value === undefined || isNaN(value)) return "-";
    return value.toFixed(decimals);
  };

  const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined || isNaN(value)) return "-";
    return `${(value * 100).toFixed(decimals)}%`;
  };

  // Calculate fantasy points with new formula
  // Formula: PTS=1, REB=1.2, AST=1.5, STL=3, BLK=3, 3PM=0.5, FGM=1, FGA=-0.5, FTM=1, FTA=-0.5, TO=-1
  const calculateFantasyPoints = (stats, excludeCategories = []) => {
    if (!stats) return 0;

    const statValues = {
      points: stats.points || 0,
      rebounds: stats.rebounds || 0,
      assists: stats.assists || 0,
      steals: stats.steals || 0,
      blocks: stats.blocks || 0,
      three_pointers: stats.three_pointers || 0,
      field_goals_made: stats.field_goals_made || 0,
      field_goals_attempted: stats.field_goals_attempted || 0,
      free_throws_made: stats.free_throws_made || 0,
      free_throws_attempted: stats.free_throws_attempted || 0,
      turnovers: stats.turnovers || 0,
    };

    // Expand grouped categories
    const expandedExcludeCategories = [...excludeCategories];
    if (excludeCategories.includes("field_goals")) {
      expandedExcludeCategories.push("field_goals_made", "field_goals_attempted");
    }
    if (excludeCategories.includes("free_throws")) {
      expandedExcludeCategories.push("free_throws_made", "free_throws_attempted");
    }

    let total = 0;
    if (!expandedExcludeCategories.includes("points")) total += statValues.points * 1;
    if (!expandedExcludeCategories.includes("rebounds")) total += statValues.rebounds * 1.2;
    if (!expandedExcludeCategories.includes("assists")) total += statValues.assists * 1.5;
    if (!expandedExcludeCategories.includes("steals")) total += statValues.steals * 3;
    if (!expandedExcludeCategories.includes("blocks")) total += statValues.blocks * 3;
    if (!expandedExcludeCategories.includes("three_pointers")) total += statValues.three_pointers * 0.5;
    if (!expandedExcludeCategories.includes("field_goals_made")) total += statValues.field_goals_made * 1;
    if (!expandedExcludeCategories.includes("field_goals_attempted")) total += statValues.field_goals_attempted * -0.5;
    if (!expandedExcludeCategories.includes("free_throws_made")) total += statValues.free_throws_made * 1;
    if (!expandedExcludeCategories.includes("free_throws_attempted")) total += statValues.free_throws_attempted * -0.5;
    if (!expandedExcludeCategories.includes("turnovers")) total += statValues.turnovers * -1;

    return total;
  };

  // Handle punt toggle
  const handlePuntToggle = (categoryKey) => {
    setPuntedCategories((prev) => {
      if (prev.includes(categoryKey)) {
        return prev.filter((c) => c !== categoryKey);
      } else {
        return [...prev, categoryKey];
      }
    });
  };

  // Sync filters with query parameters
  useEffect(() => {
    const newParams = filtersToQueryParams(filters);
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  // Fetch players for avatar data
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const data = await searchPlayers(playerSearchTerm);
        const playerSuggestions = data.map((player) => ({
          value: player.name,
          label: player.name,
        }));
        setPlayerSearchResults(playerSuggestions);
        // Update player name suggestions in constants dynamically
        GAME_FILTER_VALUE_SUGGESTIONS.playerNames = playerSuggestions;
      } catch (error) {
        console.error("Error searching players:", error);
      }
    };

    // Debounce the search
    const timer = setTimeout(() => {
      loadPlayers();
    }, 300);

    return () => clearTimeout(timer);
  }, [playerSearchTerm]);

  // Fetch game stats based on filters
  useEffect(() => {
    const loadGameStats = async () => {
      try {
        setLoading(true);
        const filterParams = filters.length > 0
          ? filters.reduce((acc, filter) => {
              if (filter.isMulti) {
                acc[filter.key] = filter.value;
              } else if (filter.key === "season") {
                acc[filter.key] = filter.value;
              } else if (filter.isNumeric || filter.isHeight) {
                acc[filter.key] = {
                  operand: filter.operator,
                  value: filter.value,
                };
              }
              return acc;
            }, {})
          : {};
        const stats = await fetchFilteredPlayerGameStats(filterParams);

        // Add adjusted fantasy points to each stat
        const statsWithAdjusted = stats.map((stat) => ({
          ...stat,
          adjustedFantasyPoints: calculateFantasyPoints(stat.stats, puntedCategories),
        }));

        setGameStats(statsWithAdjusted);
      } catch (error) {
        console.error("Error loading game stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGameStats();
  }, [filters, puntedCategories]);

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
    if (["playerName", "season", "position", "teamName", "nationality", "height"].includes(sortColumn)) {
      valueA = a[sortColumn] || "";
      valueB = b[sortColumn] || "";
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else if (sortColumn === "seasonExperience") {
      valueA = a[sortColumn] || 0;
      valueB = b[sortColumn] || 0;
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    } else if (sortColumn === "fantasy_points" && puntedCategories.length > 0) {
      // Use adjusted fantasy points when punting
      valueA = a.adjustedFantasyPoints || 0;
      valueB = b.adjustedFantasyPoints || 0;
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    } else {
      valueA = a.stats[sortColumn] || 0;
      valueB = b.stats[sortColumn] || 0;
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  const paginatedStats = sortedStats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Translate season comparison to season list
  // Input year represents the END year of the season (e.g., 2020 means 2019-20 season)
  const translateSeasonComparison = (operator, year) => {
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear < 1961 || parsedYear > 2024) {
      return [];
    }

    // Convert input year to start year (2020 -> 2019)
    const startYear = parsedYear - 1;

    if (operator === "=") {
      const endYear = parsedYear % 100;
      return [`${startYear}-${endYear.toString().padStart(2, "0")}`];
    }
    if (operator === ">=") {
      return seasons.filter((season) => parseInt(season.split("-")[0], 10) >= startYear);
    }
    if (operator === ">") {
      return seasons.filter((season) => parseInt(season.split("-")[0], 10) > startYear);
    }
    if (operator === "<=") {
      return seasons.filter((season) => parseInt(season.split("-")[0], 10) <= startYear);
    }
    if (operator === "<") {
      return seasons.filter((season) => parseInt(season.split("-")[0], 10) < startYear);
    }
    return [];
  };

  // Handle filter type change
  const handleFilterTypeChange = (event, newValue) => {
    setFilterType(newValue);
    setFilterValue([]);
    if (newValue?.key === "season") {
      setFilterNumericValue("2020");
      setFilterOperator("=");
    } else if (newValue?.isHeight) {
      setFilterNumericValue("6-0");
      setFilterOperator(">=");
    } else {
      setFilterNumericValue("");
      setFilterOperator("=");
    }
  };

  // Validate height format
  const validateHeight = (value) => {
    return /^\d+-\d+$/.test(value);
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
      if (filterType.key === "season") {
        const year = parseInt(filterNumericValue, 10);
        if (year < 1961 || year > 2024) {
          alert("Please enter a year between 1961 and 2024.");
          return;
        }
        const seasonList = translateSeasonComparison(filterOperator, filterNumericValue);
        if (seasonList.length === 0) {
          alert("Invalid season comparison.");
          return;
        }

        const existingSeasonFilter = filters.find((f) => f.key === "season");
        if (existingSeasonFilter) {
          const newSeasonList = existingSeasonFilter.value.filter((season) =>
            seasonList.includes(season)
          );
          if (newSeasonList.length === 0) {
            alert("No seasons match both conditions.");
            return;
          }
          setFilters(
            filters.map((f) =>
              f.key === "season"
                ? {
                    ...f,
                    value: newSeasonList,
                    label: `${f.label} AND Season: ${filterOperator} ${filterNumericValue}`,
                  }
                : f
            )
          );
          return;
        }

        newFilter = {
          key: filterType.key,
          value: seasonList,
          operator: filterOperator,
          isNumeric: true,
          label: `Season: ${filterOperator} ${filterNumericValue}`,
        };
      } else {
        newFilter = {
          key: filterType.key,
          value: filterNumericValue,
          operator: filterOperator,
          isNumeric: true,
          label: `${filterType.label}: ${filterOperator} ${filterNumericValue}${
            filterType.key.includes("Percentage") ? "%" : ""
          }`,
        };
      }
    } else if (filterType.isHeight) {
      if (!filterNumericValue || !validateHeight(filterNumericValue)) {
        alert("Please enter a valid height in the format 'X-Y' (e.g., '6-10').");
        return;
      }
      newFilter = {
        key: filterType.key,
        value: filterNumericValue,
        operator: filterOperator,
        isHeight: true,
        label: `Height: ${filterOperator} ${filterNumericValue}`,
      };
    } else if (filterValue && filterValue.length > 0) {
      newFilter = {
        key: filterType.key,
        value: filterValue.map((v) => v.value),
        isMulti: filterType.isMulti,
        label: `${filterType.label}: ${filterValue.map((v) => v.label).join(", ")}`,
      };
    } else {
      alert("Please select at least one filter value.");
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
    <Box sx={{ p: 2, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pb: 2,
          borderBottom: "2px solid #ddd",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#003366",
            fontSize: "1.25rem",
          }}
        >
          All Time Game Stats (1960-2024)
        </Typography>
      </Box>

      {/* Filter Section */}
      <GameFilterSection
        puntedCategories={puntedCategories}
        onPuntToggle={handlePuntToggle}
        showAdvancedFilters={showAdvancedFilters}
        onToggleAdvanced={setShowAdvancedFilters}
        filterType={filterType}
        onFilterTypeChange={handleFilterTypeChange}
        filterValue={filterValue}
        onFilterValueChange={setFilterValue}
        filterOperator={filterOperator}
        onFilterOperatorChange={setFilterOperator}
        filterNumericValue={filterNumericValue}
        onFilterNumericValueChange={setFilterNumericValue}
        filters={filters}
        onAddFilter={handleAddFilter}
        onDeleteFilter={handleDeleteFilter}
        onClearFilters={handleClearFilters}
        filterTypes={GAME_FILTER_TYPES}
        filterValueSuggestions={GAME_FILTER_VALUE_SUGGESTIONS}
        operators={OPERATORS}
        onPlayerSearch={setPlayerSearchTerm}
      />

      {/* Table */}
      {loading ? (
        <Box
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#fff",
            border: "1px solid #ddd",
            borderRadius: 1,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            bgcolor: "#fff",
            border: "1px solid #ddd",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <TableContainer sx={{ maxHeight: "65vh" }}>
            <Table size="small" stickyHeader>
              <GameTableHeader
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                puntedCategories={puntedCategories}
              />
              <TableBody>
                {paginatedStats.length === 0 ? (
                  <tr>
                    <td colSpan={18} align="center" sx={{ color: "#424242", p: 2 }}>
                      No data available
                    </td>
                  </tr>
                ) : (
                  paginatedStats.map((stat, index) => {
                    const displayFantasyPoints =
                      puntedCategories.length > 0 ? stat.adjustedFantasyPoints : stat.stats?.fantasy_points;

                    return (
                      <GameRow
                        key={`${stat.playerId}-${stat.season}-${index}`}
                        stat={stat}
                        index={index}
                        displayFantasyPoints={displayFantasyPoints}
                        puntedCategories={puntedCategories}
                        formatNumber={formatNumber}
                        formatPercentage={formatPercentage}
                        normalizeName={normalizeName}
                        pageRowsPerPage={rowsPerPage}
                        page={page}
                      />
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={gameStats.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: "#212121",
              "& .MuiTablePagination-selectLabel": { color: "#E0E0E0" },
              "& .MuiTablePagination-displayedRows": { color: "#E0E0E0" },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default AlltimeGames;