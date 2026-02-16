import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { searchPlayers, fetchFilteredPlayerAverages } from "../api";
import FilterSection from "./FilterSection";
import TableHeader from "./TableHeader";
import PlayerRow from "./PlayerRow";
import { PUNT_CATEGORIES, FILTER_TYPES, FILTER_VALUE_SUGGESTIONS, OPERATORS } from "../constants/categories";
import { parseQueryFilters, filtersToQueryParams } from "../utils/queryParams";

const AlltimeTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [playerStats, setPlayerStats] = useState([]);
  const [filterType, setFilterType] = useState(null);
  const [filterValue, setFilterValue] = useState([]);
  const [filterOperator, setFilterOperator] = useState("=");
  const [filterNumericValue, setFilterNumericValue] = useState("");
  const [filters, setFilters] = useState(() => parseQueryFilters(searchParams, FILTER_TYPES, FILTER_VALUE_SUGGESTIONS, OPERATORS));
  const [sortColumn, setSortColumn] = useState("total_value");
  const [sortDirection, setSortDirection] = useState("desc");
  const [puntedCategories, setPuntedCategories] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [playerSearchTerm, setPlayerSearchTerm] = useState("");
  const [playerSearchResults, setPlayerSearchResults] = useState([]);

  // Generate seasons from 1960-61 to 2023-24
  const seasons = Array.from({ length: 2024 - 1960 }, (_, i) => {
    const startYear = 1960 + i;
    const endYear = (startYear + 1) % 100;
    return `${startYear}-${endYear.toString().padStart(2, "0")}`;
  }).reverse(); // Latest seasons first

  // Color coding based on z-scores (light mode friendly)
  const getColorForValue = (value) => {
    if (value < -5) return "#ffebee"; // Very light red
    if (value >= -5 && value < -4) return "#ffcdd2";
    if (value >= -4 && value < -3) return "#ef9a9a";
    if (value >= -3 && value < -2) return "#e57373";
    if (value >= -2 && value < -1) return "#ef5350";
    if (value >= -1 && value <= 1) return "#ffffff"; // Neutral
    if (value > 1 && value <= 2) return "#c8e6c9";
    if (value > 2 && value <= 3) return "#a5d6a7";
    if (value > 3 && value <= 4) return "#81c784";
    if (value > 4 && value <= 5) return "#66bb6a";
    return "#4caf50"; // Green (> 5)
  };

  // Get appropriate text color based on background
  const getTextColor = (bgColor) => {
    // For light backgrounds, use dark text
    const lightBgs = ["#ffffff", "#ffebee", "#ffcdd2", "#c8e6c9", "#a5d6a7"];
    if (lightBgs.includes(bgColor)) {
      return "#212121";
    }
    // For medium backgrounds, use dark text
    const mediumBgs = ["#ef9a9a", "#e57373", "#81c784", "#66bb6a"];
    if (mediumBgs.includes(bgColor)) {
      return "#212121";
    }
    // For darker backgrounds, use white text
    return "#ffffff";
  };

  // Function to normalize player names by removing special characters
  const normalizeName = (name) => {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-zA-Z]/g, '') // Remove any remaining non-alphabetic characters
      .toLowerCase();
  };

  // Safe number formatting helper
  const formatNumber = (value, decimals = 1) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    return value.toFixed(decimals);
  };

  const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    return `${(value * 100).toFixed(decimals)}%`;
  };


  // Sync filters with query parameters
  useEffect(() => {
    const newParams = filtersToQueryParams(filters);
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  // Search players with debounce
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
        FILTER_VALUE_SUGGESTIONS.playerNames = playerSuggestions;
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

  useEffect(() => {
    const loadPlayerStats = async () => {
      setLoading(true);
      try {
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

        const stats = await fetchFilteredPlayerAverages(filterParams);
        setPlayerStats(stats);
      } catch (error) {
        console.error("Error loading player stats:", error);
        setPlayerStats([]);
      } finally {
        setLoading(false);
      }
    };
    loadPlayerStats();
  }, [filters]);

  // Handle column sorting
  const handleSort = useCallback((column) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortColumn("");
        setSortDirection("asc");
      } else if (sortDirection === "desc") {
        setSortDirection("asc");
      } else {
        setSortDirection("desc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  }, [sortColumn, sortDirection]);

  // Calculate adjusted players based on punted categories
  const adjustedPlayers = useMemo(() => {
    if (playerStats.length === 0) return [];

    if (puntedCategories.length === 0) {
      return playerStats.map((p, idx) => ({
        ...p,
        originalRank: idx + 1,
        adjustedTotalValue: p.stats?.total_value || 0,
        adjustedRank: idx + 1,
        rankChange: 0,
        valueChange: 0,
      }));
    }

    // Recalculate total_value excluding punted categories
    const allCategories = PUNT_CATEGORIES.map(c => c.key);
    const includedCategories = allCategories.filter(c => !puntedCategories.includes(c));
    const n = includedCategories.length;
    const sqrtN = Math.sqrt(n);

    const playersWithAdjusted = playerStats.map((player, idx) => {
      const sum = includedCategories.reduce((acc, cat) => acc + (player.stats?.[cat] || 0), 0);
      const adjustedTotalValue = sum / sqrtN;

      return {
        ...player,
        originalRank: idx + 1,
        adjustedTotalValue: Number(adjustedTotalValue.toFixed(2)),
        valueChange: Number((adjustedTotalValue - (player.stats?.total_value || 0)).toFixed(2)),
      };
    });

    // Sort by adjusted total value
    const sorted = [...playersWithAdjusted].sort((a, b) => b.adjustedTotalValue - a.adjustedTotalValue);

    // Calculate adjusted rank and rank change
    return sorted.map((player, idx) => ({
      ...player,
      adjustedRank: idx + 1,
      rankChange: player.originalRank - (idx + 1),
    }));
  }, [playerStats, puntedCategories]);

  // Memoize sorted stats
  const sortedPlayerStats = useMemo(() => {
    if (adjustedPlayers.length === 0) return [];
    
    let sortedStats = [...adjustedPlayers];
    
    if (sortColumn && sortDirection) {
      sortedStats.sort((a, b) => {
        let valueA, valueB;
        
        // Handle special columns for punting
        if (sortColumn === 'total_value' && puntedCategories.length > 0) {
          valueA = a.adjustedTotalValue || 0;
          valueB = b.adjustedTotalValue || 0;
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        } else if (sortColumn === 'adjustedTotalValue') {
          valueA = a.adjustedTotalValue || 0;
          valueB = b.adjustedTotalValue || 0;
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        } else if (sortColumn === 'valueChange') {
          valueA = a.valueChange || 0;
          valueB = b.valueChange || 0;
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        } else if (sortColumn === 'rankChange') {
          valueA = a.rankChange || 0;
          valueB = b.rankChange || 0;
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        } else if (
          ["playerName", "season", "teamName", "nationality", "height"].includes(sortColumn)
        ) {
          valueA = a[sortColumn] || "";
          valueB = b[sortColumn] || "";
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else if (sortColumn === "seasonExperience") {
          valueA = a[sortColumn] || 0;
          valueB = b[sortColumn] || 0;
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        } else {
          valueA = a.stats?.[sortColumn] || 0;
          valueB = b.stats?.[sortColumn] || 0;
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        }
      });
    }
    
    return sortedStats;
  }, [adjustedPlayers, sortColumn, sortDirection, puntedCategories.length]);

  // Translate numeric season comparison to season list
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
      return [`${startYear}-${endYear.toString().padStart(2, '0')}`];
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

  // Validate height format (e.g., "6-10")
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

        // Check if there's already a season filter
        const existingSeasonFilter = filters.find(f => f.key === "season");
        if (existingSeasonFilter) {
          // Intersect the new season list with the existing one
          const newSeasonList = existingSeasonFilter.value.filter(season => 
            seasonList.includes(season)
          );
          if (newSeasonList.length === 0) {
            alert("No seasons match both conditions.");
            return;
          }
          // Update the existing filter
          setFilters(filters.map(f => 
            f.key === "season" 
              ? { ...f, value: newSeasonList, label: `${f.label} AND Season: ${filterOperator} ${filterNumericValue}` }
              : f
          ));
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
  };

  // Handle clearing all filters
  const handleClearFilters = () => {
    setFilters([]);
    setFilterType(null);
    setFilterValue([]);
    setFilterOperator("=");
    setFilterNumericValue("");
  };

  // Handle punt toggle
  const handlePuntToggle = (categoryKey) => {
    setPuntedCategories(prev => {
      if (prev.includes(categoryKey)) {
        return prev.filter(c => c !== categoryKey);
      } else {
        return [...prev, categoryKey];
      }
    });
  };

  return (
    <Box
      sx={{
        p: 2,
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
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
          All-Time Player Statistics
        </Typography>
      </Box>

      {/* Filter Section */}
      <FilterSection
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
        seasons={seasons}
        filterTypes={FILTER_TYPES}
        filterValueSuggestions={FILTER_VALUE_SUGGESTIONS}
        operators={OPERATORS}
        onPlayerSearch={setPlayerSearchTerm}
      />

      {/* Table */}
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid #ddd",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <TableContainer sx={{ maxHeight: "75vh" }}>
          <Table size="small" stickyHeader>
            <TableHeader
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableBody>
              {loading ? (
                <tr>
                  <td colSpan={27} align="center" sx={{ py: 4 }}>
                    <CircularProgress sx={{ color: "#0066cc" }} />
                    <Typography sx={{ mt: 2, color: "#666", fontSize: "0.875rem" }}>
                      Loading player statistics...
                    </Typography>
                  </td>
                </tr>
              ) : sortedPlayerStats.length === 0 ? (
                <tr>
                  <td colSpan={27} align="center" sx={{ py: 4, color: "#666", fontSize: "0.875rem" }}>
                    No players found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                sortedPlayerStats.map((stat, index) => {
                  const isPunted = puntedCategories.length > 0;
                  const displayRank = isPunted ? stat.adjustedRank : index + 1;
                  const displayValue = isPunted
                    ? stat.adjustedTotalValue
                    : stat.stats?.total_value || 0;

                  return (
                    <PlayerRow
                      key={index}
                      stat={stat}
                      index={index}
                      displayRank={displayRank}
                      displayValue={displayValue}
                      puntedCategories={puntedCategories}
                      getColorForValue={getColorForValue}
                      getTextColor={getTextColor}
                      formatNumber={formatNumber}
                      formatPercentage={formatPercentage}
                      normalizeName={normalizeName}
                    />
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default React.memo(AlltimeTable);