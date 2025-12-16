import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { fetchFilteredPlayerAverages } from "../api";

const PUNT_CATEGORIES = [
  { key: 'points_z', label: 'PTS', fullName: 'Points' },
  { key: 'rebounds_z', label: 'REB', fullName: 'Rebounds' },
  { key: 'assists_z', label: 'AST', fullName: 'Assists' },
  { key: 'steals_z', label: 'STL', fullName: 'Steals' },
  { key: 'blocks_z', label: 'BLK', fullName: 'Blocks' },
  { key: 'three_pointers_z', label: '3PM', fullName: 'Three Pointers' },
  { key: 'field_goal_percentage_z', label: 'FG%', fullName: 'Field Goal %' },
  { key: 'free_throw_percentage_z', label: 'FT%', fullName: 'Free Throw %' },
  { key: 'turnovers_z', label: 'TO', fullName: 'Turnovers' },
];

const AlltimeTable = () => {
  const [loading, setLoading] = useState(false);
  const [playerStats, setPlayerStats] = useState([]);
  const [filterType, setFilterType] = useState(null);
  const [filterValue, setFilterValue] = useState([]); // For multiselect (e.g., position, teamNames, nationalities)
  const [filterOperator, setFilterOperator] = useState("=");
  const [filterNumericValue, setFilterNumericValue] = useState("");
  const [filters, setFilters] = useState([]);
  const [sortColumn, setSortColumn] = useState("total_value");
  const [sortDirection, setSortDirection] = useState("desc");
  const [puntedCategories, setPuntedCategories] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Generate seasons from 1960-61 to 2023-24
  const seasons = Array.from({ length: 2024 - 1960 }, (_, i) => {
    const startYear = 1960 + i;
    const endYear = (startYear + 1) % 100;
    return `${startYear}-${endYear.toString().padStart(2, '0')}`;
  }).reverse(); // Latest seasons first

  // Available filter types
  const filterTypes = [
    { key: "season", label: "Season", isNumeric: true },
    { key: "teamNames", label: "Team", isMulti: true },
    { key: "nationalities", label: "Nationality", isMulti: true },
    { key: "seasonExperience", label: "Experience (Years)", isNumeric: true },
    { key: "height", label: "Height (ft-in)", isHeight: true },
    { key: "rebounds", label: "Rebounds", isNumeric: true },
    { key: "points", label: "Points", isNumeric: true },
    { key: "assists", label: "Assists", isNumeric: true },
    { key: "steals", label: "Steals", isNumeric: true },
    { key: "blocks", label: "Blocks", isNumeric: true },
    { key: "fgPercentage", label: "FG%", isNumeric: true },
    { key: "ftPercentage", label: "FT%", isNumeric: true },
    { key: "three_pointers", label: "Three Pointers", isNumeric: true },
    { key: "turnovers", label: "Turnovers", isNumeric: true },
    { key: "total_value", label: "Total Value", isNumeric: true },
  ];

  // Suggestions for non-numeric filter values
  const filterValueSuggestions = {
    teamNames: [
      { value: "Lakers", label: "Los Angeles Lakers" },
      { value: "Celtics", label: "Boston Celtics" },
      { value: "Warriors", label: "Golden State Warriors" },
      { value: "Bulls", label: "Chicago Bulls" },
      { value: "Spurs", label: "San Antonio Spurs" },
    ],
    nationalities: [
      { value: "USA", label: "USA" },
      { value: "Canada", label: "Canada" },
      { value: "France", label: "France" },
      { value: "Spain", label: "Spain" },
      { value: "Serbia", label: "Serbia" },
      { value: "Israel", label: "Israel" },
      { value: "Argentina", label: "Argentina" },
      { value: "Australia", label: "Australia" },
      { value: "Brazil", label: "Brazil" },
      { value: "China", label: "China" },
    ],
  };

  // Operators for numerical filters
  const operators = [
    { value: ">", label: ">" },
    { value: ">=", label: ">=" },
    { value: "<", label: "<" },
    { value: "<=", label: "<=" },
    { value: "=", label: "=" },
  ];

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
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
      }}
    >
      {/* Header Bar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        pb: 2,
        borderBottom: '2px solid #ddd',
        flexWrap: 'wrap',
        gap: 2,
      }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: '#003366',
            fontSize: '1.25rem',
          }}
        >
          All-Time Player Statistics
        </Typography>
      </Box>

      {/* Punt Categories and Advanced Filters */}
      <Box
        sx={{
          mb: 2,
          p: 1.5,
          bgcolor: '#fff',
          border: '1px solid #ddd',
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', mb: puntedCategories.length > 0 ? 1 : 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#003366', minWidth: '100px' }}>
              Punt Categories:
            </Typography>
            {PUNT_CATEGORIES.map((cat) => (
              <FormControlLabel
                key={cat.key}
                control={
                  <Checkbox
                    checked={puntedCategories.includes(cat.key)}
                    onChange={() => handlePuntToggle(cat.key)}
                    size="small"
                    sx={{
                      '&.Mui-checked': {
                        color: '#0066cc',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    {cat.label}
                  </Typography>
                }
                sx={{ m: 0 }}
              />
            ))}
          </Box>
          
          <Button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: '#003366',
              fontSize: '0.875rem',
              minWidth: 'fit-content',
            }}
          >
            {showAdvancedFilters ? '▼' : '►'} Advanced Filters
          </Button>
        </Box>
        
        {puntedCategories.length > 0 && (
          <Typography variant="caption" sx={{ display: 'block', mb: showAdvancedFilters ? 1 : 0, color: '#666', fontSize: '0.75rem' }}>
            Excluding: {PUNT_CATEGORIES.filter(c => puntedCategories.includes(c.key)).map(c => c.label).join(', ')}
          </Typography>
        )}

        {showAdvancedFilters && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", marginTop: 2 }}>
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
                    size="small"
                    sx={{
                      width: 200,
                      backgroundColor: "#fff",
                      "& .MuiInputBase-input": { color: "#000", fontSize: '0.875rem' },
                      "& .MuiInputLabel-root": { color: '#666', fontSize: '0.875rem' },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#ddd" },
                        "&:hover fieldset": { borderColor: "#0066cc" },
                      },
                    }}
                  />
                )}
                sx={{ width: 200 }}
              />

              {(filterType?.isNumeric || filterType?.isHeight) ? (
                <>
                  <FormControl size="small" sx={{ width: 100 }}>
                    <InputLabel sx={{ color: '#666', fontSize: '0.875rem' }}>Operator</InputLabel>
                    <Select
                      value={filterOperator}
                      onChange={(e) => setFilterOperator(e.target.value)}
                      sx={{
                        backgroundColor: "#fff",
                        color: "#000",
                        fontSize: '0.875rem',
                        "& .MuiSvgIcon-root": { color: '#666' },
                        "& fieldset": { borderColor: "#ddd" },
                        "&:hover fieldset": { borderColor: "#0066cc" },
                      }}
                    >
                      {operators.map((op) => (
                        <MenuItem key={op.value} value={op.value} sx={{ fontSize: '0.875rem' }}>
                          {op.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label={filterType.key === "season" ? "Year" : filterType.isHeight ? "Height (ft-in)" : "Value"}
                    placeholder={filterType.key === "season" ? "e.g. 2020" : filterType.isHeight ? "e.g. 6-10" : "Enter value"}
                    value={filterNumericValue}
                    onChange={(e) => setFilterNumericValue(e.target.value)}
                    type={filterType.isHeight ? "text" : "number"}
                    variant="outlined"
                    size="small"
                    inputProps={
                      filterType.key === "season"
                        ? { min: 1960, max: 2023 }
                        : filterType.key === "seasonExperience"
                        ? { min: 0 }
                        : {}
                    }
                    sx={{
                      width: 150,
                      backgroundColor: "#fff",
                      "& .MuiInputBase-input": { color: "#000", fontSize: '0.875rem' },
                      "& .MuiInputLabel-root": { color: '#666', fontSize: '0.875rem' },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#ddd" },
                        "&:hover fieldset": { borderColor: "#0066cc" },
                      },
                    }}
                  />
                </>
              ) : (
                <Autocomplete
                  multiple={filterType?.isMulti}
                  options={filterValueSuggestions[filterType?.key] || []}
                  getOptionLabel={(option) => option?.label || "Select value"}
                  value={filterValue}
                  onChange={(event, newValue) => setFilterValue(newValue || [])}
                  disabled={!filterType}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Filter Value"
                      placeholder={filterType ? "Select value" : "Select filter type first"}
                      variant="outlined"
                      size="small"
                      sx={{
                        width: 250,
                        backgroundColor: "#fff",
                        "& .MuiInputBase-input": { color: "#000", fontSize: '0.875rem' },
                        "& .MuiInputLabel-root": { color: '#666', fontSize: '0.875rem' },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#ddd" },
                          "&:hover fieldset": { borderColor: "#0066cc" },
                        },
                      }}
                    />
                  )}
                  sx={{ width: 250 }}
                />
              )}

              <Button
                variant="contained"
                size="small"
                onClick={handleAddFilter}
                disabled={!filterType || (!filterValue?.length && !filterNumericValue)}
                sx={{
                  backgroundColor: "#0066cc",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#0052a3" },
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}
              >
                Add Filter
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={handleClearFilters}
                sx={{
                  color: '#666',
                  borderColor: "#ddd",
                  "&:hover": { borderColor: "#0066cc", backgroundColor: "rgba(0, 102, 204, 0.04)" },
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}
              >
                Clear Filters
              </Button>
            </Box>
            {/* Display Applied Filters */}
            <Box sx={{ mt: 2 }}>
              {filters.map((filter, index) => (
                <Chip
                  key={index}
                  label={filter.label}
                  onDelete={() => handleDeleteFilter(index)}
                  size="small"
                  sx={{
                    mr: 1,
                    mb: 1,
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "1px solid #ddd",
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Table */}
      <Box
        sx={{
          bgcolor: '#fff',
          border: '1px solid #ddd',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <TableContainer
          sx={{
            maxHeight: '75vh',
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                    width: 50,
                  }}
                  align="center"
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <TableSortLabel
                    active={sortColumn === "playerName"}
                    direction={sortColumn === "playerName" ? sortDirection : "asc"}
                    onClick={() => handleSort("playerName")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': {
                        color: '#fff !important',
                      },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                  >
                    Player
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <TableSortLabel
                    active={sortColumn === "season"}
                    direction={sortColumn === "season" ? sortDirection : "asc"}
                    onClick={() => handleSort("season")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                  >
                    Season
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <TableSortLabel
                    active={sortColumn === "position"}
                    direction={sortColumn === "position" ? sortDirection : "asc"}
                    onClick={() => handleSort("position")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                  >
                    Position
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <TableSortLabel
                    active={sortColumn === "teamName"}
                    direction={sortColumn === "teamName" ? sortDirection : "asc"}
                    onClick={() => handleSort("teamName")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                  >
                    Team
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <TableSortLabel
                    active={sortColumn === "nationality"}
                    direction={sortColumn === "nationality" ? sortDirection : "asc"}
                    onClick={() => handleSort("nationality")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                  >
                    Nationality
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <TableSortLabel
                    active={sortColumn === "height"}
                    direction={sortColumn === "height" ? sortDirection : "asc"}
                    onClick={() => handleSort("height")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                  >
                    Height
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <TableSortLabel
                    active={sortColumn === "seasonExperience"}
                    direction={sortColumn === "seasonExperience" ? sortDirection : "asc"}
                    onClick={() => handleSort("seasonExperience")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                  >
                    Exp
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <TableSortLabel
                    active={sortColumn === "points"}
                    direction={sortColumn === "points" ? sortDirection : "asc"}
                    onClick={() => handleSort("points")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                  >
                    Points
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <TableSortLabel
                    active={sortColumn === "rebounds"}
                    direction={sortColumn === "rebounds" ? sortDirection : "asc"}
                    onClick={() => handleSort("rebounds")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                  >
                    Rebounds
                  </TableSortLabel>
                </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "assists"}
                  direction={sortColumn === "assists" ? sortDirection : "asc"}
                  onClick={() => handleSort("assists")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  Assists
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "steals"}
                  direction={sortColumn === "steals" ? sortDirection : "asc"}
                  onClick={() => handleSort("steals")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  Steals
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "blocks"}
                  direction={sortColumn === "blocks" ? sortDirection : "asc"}
                  onClick={() => handleSort("blocks")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  Blocks
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "field_goal_percentage"}
                  direction={sortColumn === "field_goal_percentage" ? sortDirection : "asc"}
                  onClick={() => handleSort("field_goal_percentage")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  FG%
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "free_throw_percentage"}
                  direction={sortColumn === "free_throw_percentage" ? sortDirection : "asc"}
                  onClick={() => handleSort("free_throw_percentage")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  FT%
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "three_pointers"}
                  direction={sortColumn === "three_pointers" ? sortDirection : "asc"}
                  onClick={() => handleSort("three_pointers")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  3PT
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "points_z"}
                  direction={sortColumn === "points_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("points_z")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  Points Z
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "rebounds_z"}
                  direction={sortColumn === "rebounds_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("rebounds_z")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  Reb Z
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "assists_z"}
                  direction={sortColumn === "assists_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("assists_z")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  Ast Z
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "steals_z"}
                  direction={sortColumn === "steals_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("steals_z")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  Stl Z
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "blocks_z"}
                  direction={sortColumn === "blocks_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("blocks_z")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  Blk Z
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "field_goal_percentage_z"}
                  direction={sortColumn === "field_goal_percentage_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("field_goal_percentage_z")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  FG% Z
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "free_throw_percentage_z"}
                  direction={sortColumn === "free_throw_percentage_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("free_throw_percentage_z")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  FT% Z
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "turnovers"}
                  direction={sortColumn === "turnovers" ? sortDirection : "asc"}
                  onClick={() => handleSort("turnovers")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  TOV
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "turnovers_z"}
                  direction={sortColumn === "turnovers_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("turnovers_z")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  TOV Z
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "three_pointers_z"}
                  direction={sortColumn === "three_pointers_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("three_pointers_z")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  3PT Z
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                    bgcolor: '#003366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 1,
                    px: 0.5,
                    borderBottom: '1px solid #ddd',
                }}
              >
                <TableSortLabel
                  active={sortColumn === "total_value"}
                  direction={sortColumn === "total_value" ? sortDirection : "asc"}
                  onClick={() => handleSort("total_value")}
                    sx={{
                      color: '#fff !important',
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' },
                      '&:hover': { color: '#fff' },
                      '&.Mui-active': { color: '#fff' },
                    }}
                >
                  Total Val
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={27} align="center" sx={{ py: 4 }}>
                  <CircularProgress sx={{ color: '#0066cc' }} />
                  <Typography sx={{ mt: 2, color: '#666', fontSize: '0.875rem' }}>
                    Loading player statistics...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : sortedPlayerStats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={27} align="center" sx={{ py: 4, color: '#666', fontSize: '0.875rem' }}>
                  No players found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              sortedPlayerStats.map((stat, index) => {
                const isPunted = puntedCategories.length > 0;
                const displayRank = isPunted ? stat.adjustedRank : (index + 1);
                const displayValue = isPunted ? stat.adjustedTotalValue : (stat.stats?.total_value || 0);
                
                return (
                <TableRow
                  key={index}
                  sx={{
                    bgcolor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.03)',
                    },
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{
                      color: '#0066cc',
                      py: 0.75,
                      px: 0.5,
                      fontSize: '0.75rem',
                      borderBottom: '1px solid #eee',
                      fontWeight: 600,
                    }}
                  >
                    {displayRank}
                  </TableCell>
                <TableCell
                  sx={{
                    color: '#000',
                    py: 0.75,
                    px: 0.5,
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      src={`https://www.basketball-reference.com/req/202106291/images/headshots/${(() => {
                        const [firstName, lastName] = stat.playerName.split(' ');
                        const normalizedLastName = normalizeName(lastName);
                        const normalizedFirstName = normalizeName(firstName);
                        return `${normalizedLastName.substring(0, 5)}${normalizedFirstName.substring(0, 2)}01`;
                      })()}.jpg`}
                      onError={(e) => {
                        e.target.src = 'https://www.basketball-reference.com/req/202106291/images/headshots/default.jpg';
                      }}
                      sx={{ 
                        width: 32, 
                        height: 32,
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        '&:hover': {
                          border: '1px solid #1976d2',
                        }
                      }}
                    />
                    {stat.playerName}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    color: '#000',
                    py: 0.75,
                    px: 0.5,
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {stat.season}
                </TableCell>
                <TableCell
                  sx={{
                    color: '#000',
                    py: 0.75,
                    px: 0.5,
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {stat.position}
                </TableCell>
                <TableCell
                  sx={{
                    color: '#000',
                    py: 0.75,
                    px: 0.5,
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {stat.teamName}
                </TableCell>
                <TableCell
                  sx={{
                    color: '#000',
                    py: 0.75,
                    px: 0.5,
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {stat.nationality}
                </TableCell>
                <TableCell
                  sx={{
                    color: '#000',
                    py: 0.75,
                    px: 0.5,
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {stat.height}
                </TableCell>
                <TableCell
                  sx={{
                    color: '#000',
                    py: 0.75,
                    px: 0.5,
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {stat.seasonExperience}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('points_z') ? '#f5f5f5' : getColorForValue(stat.stats?.points_z || 0),
                    color: puntedCategories.includes('points_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.points_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.points)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('rebounds_z') ? '#f5f5f5' : getColorForValue(stat.stats?.rebounds_z || 0),
                    color: puntedCategories.includes('rebounds_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.rebounds_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.rebounds)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('assists_z') ? '#f5f5f5' : getColorForValue(stat.stats?.assists_z || 0),
                    color: puntedCategories.includes('assists_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.assists_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.assists)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('steals_z') ? '#f5f5f5' : getColorForValue(stat.stats?.steals_z || 0),
                    color: puntedCategories.includes('steals_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.steals_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.steals)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('blocks_z') ? '#f5f5f5' : getColorForValue(stat.stats?.blocks_z || 0),
                    color: puntedCategories.includes('blocks_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.blocks_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.blocks)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('field_goal_percentage_z') ? '#f5f5f5' : getColorForValue(stat.stats?.field_goal_percentage_z || 0),
                    color: puntedCategories.includes('field_goal_percentage_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.field_goal_percentage_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatPercentage(stat.stats?.field_goal_percentage)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('free_throw_percentage_z') ? '#f5f5f5' : getColorForValue(stat.stats?.free_throw_percentage_z || 0),
                    color: puntedCategories.includes('free_throw_percentage_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.free_throw_percentage_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatPercentage(stat.stats?.free_throw_percentage)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('three_pointers_z') ? '#f5f5f5' : getColorForValue(stat.stats?.three_pointers_z || 0),
                    color: puntedCategories.includes('three_pointers_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.three_pointers_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.three_pointers)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('points_z') ? '#f5f5f5' : getColorForValue(stat.stats?.points_z || 0),
                    color: puntedCategories.includes('points_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.points_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.points_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('rebounds_z') ? '#f5f5f5' : getColorForValue(stat.stats?.rebounds_z || 0),
                    color: puntedCategories.includes('rebounds_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.rebounds_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.rebounds_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('assists_z') ? '#f5f5f5' : getColorForValue(stat.stats?.assists_z || 0),
                    color: puntedCategories.includes('assists_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.assists_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.assists_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('steals_z') ? '#f5f5f5' : getColorForValue(stat.stats?.steals_z || 0),
                    color: puntedCategories.includes('steals_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.steals_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.steals_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('blocks_z') ? '#f5f5f5' : getColorForValue(stat.stats?.blocks_z || 0),
                    color: puntedCategories.includes('blocks_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.blocks_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.blocks_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('field_goal_percentage_z') ? '#f5f5f5' : getColorForValue(stat.stats?.field_goal_percentage_z || 0),
                    color: puntedCategories.includes('field_goal_percentage_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.field_goal_percentage_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.field_goal_percentage_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('free_throw_percentage_z') ? '#f5f5f5' : getColorForValue(stat.stats?.free_throw_percentage_z || 0),
                    color: puntedCategories.includes('free_throw_percentage_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.free_throw_percentage_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.free_throw_percentage_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('turnovers_z') ? '#f5f5f5' : getColorForValue(stat.stats?.turnovers_z || 0),
                    color: puntedCategories.includes('turnovers_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.turnovers_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.turnovers)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('turnovers_z') ? '#f5f5f5' : getColorForValue(stat.stats?.turnovers_z || 0),
                    color: puntedCategories.includes('turnovers_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.turnovers_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.turnovers_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: puntedCategories.includes('three_pointers_z') ? '#f5f5f5' : getColorForValue(stat.stats?.three_pointers_z || 0),
                    color: puntedCategories.includes('three_pointers_z') ? '#999' : getTextColor(getColorForValue(stat.stats?.three_pointers_z || 0)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(stat.stats?.three_pointers_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(displayValue),
                    color: getTextColor(getColorForValue(displayValue)),
                    py: 0.75,
                    px: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {formatNumber(displayValue, 2)}
                </TableCell>
              </TableRow>
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