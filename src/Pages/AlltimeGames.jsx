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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { fetchAllPlayers, fetchFilteredPlayerGameStats } from "../api";

const PUNT_CATEGORIES = [
  { key: 'points', label: 'PTS', fullName: 'Points' },
  { key: 'rebounds', label: 'REB', fullName: 'Rebounds' },
  { key: 'assists', label: 'AST', fullName: 'Assists' },
  { key: 'steals', label: 'STL', fullName: 'Steals' },
  { key: 'blocks', label: 'BLK', fullName: 'Blocks' },
  { key: 'three_pointers', label: '3PM', fullName: 'Three Pointers' },
  { key: 'field_goals', label: 'FG', fullName: 'Field Goals', includesCategories: ['field_goals_made', 'field_goals_attempted'] },
  { key: 'free_throws', label: 'FT', fullName: 'Free Throws', includesCategories: ['free_throws_made', 'free_throws_attempted'] },
  { key: 'turnovers', label: 'TO', fullName: 'Turnovers' },
];

const AlltimeGames = () => {
  // eslint-disable-next-line no-unused-vars
  const [players, setPlayers] = useState([]);
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
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [puntedCategories, setPuntedCategories] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Generate seasons from 1960-61 to 2023-24
  const seasons = Array.from({ length: 2024 - 1960 }, (_, i) => {
    const startYear = 1960 + i;
    const endYear = (startYear + 1) % 100;
    return `${startYear}-${endYear.toString().padStart(2, '0')}`;
  }).reverse();

  // Available filter types
  const filterTypes = [
    { key: "season", label: "Season", isNumeric: true },
    { key: "positions", label: "Position", isMulti: true },
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
    { key: "fantasy_points", label: "Fantasy Points", isNumeric: true },
  ];

  // Suggestions for non-numeric filter values
  const filterValueSuggestions = {
    positions: [
      { value: "PG", label: "Point Guard" },
      { value: "SG", label: "Shooting Guard" },
      { value: "SF", label: "Small Forward" },
      { value: "PF", label: "Power Forward" },
      { value: "C", label: "Center" },
    ],
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
    if (excludeCategories.includes('field_goals')) {
      expandedExcludeCategories.push('field_goals_made', 'field_goals_attempted');
    }
    if (excludeCategories.includes('free_throws')) {
      expandedExcludeCategories.push('free_throws_made', 'free_throws_attempted');
    }

    let total = 0;
    if (!expandedExcludeCategories.includes('points')) total += statValues.points * 1;
    if (!expandedExcludeCategories.includes('rebounds')) total += statValues.rebounds * 1.2;
    if (!expandedExcludeCategories.includes('assists')) total += statValues.assists * 1.5;
    if (!expandedExcludeCategories.includes('steals')) total += statValues.steals * 3;
    if (!expandedExcludeCategories.includes('blocks')) total += statValues.blocks * 3;
    if (!expandedExcludeCategories.includes('three_pointers')) total += statValues.three_pointers * 0.5;
    if (!expandedExcludeCategories.includes('field_goals_made')) total += statValues.field_goals_made * 1;
    if (!expandedExcludeCategories.includes('field_goals_attempted')) total += statValues.field_goals_attempted * -0.5;
    if (!expandedExcludeCategories.includes('free_throws_made')) total += statValues.free_throws_made * 1;
    if (!expandedExcludeCategories.includes('free_throws_attempted')) total += statValues.free_throws_attempted * -0.5;
    if (!expandedExcludeCategories.includes('turnovers')) total += statValues.turnovers * -1;

    return total;
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

  // Fetch players for avatar data
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const data = await fetchAllPlayers();
        setPlayers(data);
      } catch (error) {
        console.error("Error loading players:", error);
      }
    };
    loadPlayers();
  }, []);

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
        const statsWithAdjusted = stats.map(stat => ({
          ...stat,
          adjustedFantasyPoints: calculateFantasyPoints(stat.stats, puntedCategories)
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
    <Box sx={{ p: 2, minHeight: "100vh", bgcolor: '#f5f5f5' }}>
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
          All Time Game Stats (1960-2024)
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          {/* Punt Categories */}
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

          {/* Advanced Filters Toggle */}
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            sx={{
              textTransform: 'none',
              fontSize: '0.875rem',
              color: '#0066cc',
              borderColor: '#0066cc',
              '&:hover': {
                borderColor: '#0052a3',
                backgroundColor: 'rgba(0, 102, 204, 0.04)',
              },
            }}
          >
            {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
          </Button>
        </Box>

        {puntedCategories.length > 0 && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666', fontSize: '0.75rem' }}>
            Excluding: {PUNT_CATEGORIES.filter(c => puntedCategories.includes(c.key)).map(c => {
              if (c.includesCategories) {
                return `${c.label} (${c.includesCategories.map(cat => cat.replace('_', ' ').toUpperCase()).join(', ')})`;
              }
              return c.label;
            }).join(', ')}
          </Typography>
        )}

        {/* Advanced Filter Builder - Collapsible */}
        {showAdvancedFilters && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #ddd' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#003366', mb: 1 }}>
              Advanced Filters:
            </Typography>
          {/* Filter Builder */}
          <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center", flexWrap: "wrap" }}>
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
                    width: 180,
                    backgroundColor: "#ffffff",
                    "& .MuiInputBase-input": { fontSize: '0.875rem' },
                  }}
                />
              )}
              sx={{ width: 180 }}
            />

            {(filterType?.isNumeric || filterType?.isHeight) ? (
              <>
                <FormControl size="small" sx={{ width: 90 }}>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    value={filterOperator}
                    onChange={(e) => setFilterOperator(e.target.value)}
                    sx={{
                      backgroundColor: "#ffffff",
                      fontSize: '0.875rem',
                    }}
                  >
                    {operators.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
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
                    backgroundColor: "#ffffff",
                    "& .MuiInputBase-input": { fontSize: '0.875rem' },
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
                      width: 220,
                      backgroundColor: "#ffffff",
                      "& .MuiInputBase-input": { fontSize: '0.875rem' },
                    }}
                  />
                )}
                sx={{ width: 220 }}
              />
            )}

            <Button
              variant="contained"
              onClick={handleAddFilter}
              disabled={!filterType || (!filterValue?.length && !filterNumericValue)}
              size="small"
              sx={{
                backgroundColor: "#0066cc",
                color: "#ffffff",
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
              onClick={handleClearFilters}
              size="small"
              sx={{
                color: "#0066cc",
                borderColor: "#0066cc",
                "&:hover": { borderColor: "#0052a3", backgroundColor: "rgba(0, 102, 204, 0.04)" },
                textTransform: "none",
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              Clear All
            </Button>
          </Box>

          {/* Display Applied Filters */}
          {filters.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {filters.map((filter, index) => (
                <Chip
                  key={index}
                  label={filter.label}
                  onDelete={() => handleDeleteFilter(index)}
                  size="small"
                  sx={{
                    backgroundColor: "#e3f2fd",
                    color: "#0066cc",
                    border: "1px solid #0066cc",
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Box>
          )}
          </Box>
        )}
      </Box>

      {/* Table */}
      {loading ? (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#fff', border: '1px solid #ddd', borderRadius: 1 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            bgcolor: '#fff',
            border: '1px solid #ddd',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <TableContainer sx={{ maxHeight: '65vh' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: '#003366',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      py: 1,
                      px: 0.5,
                      width: "50px",
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
                      fontSize: "0.75rem",
                      py: 1,
                      px: 0.5,
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
                      }}
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
                      active={sortColumn === "season"}
                      direction={sortColumn === "season" ? sortDirection : "asc"}
                      onClick={() => handleSort("season")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      Season
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
                      active={sortColumn === "position"}
                      direction={sortColumn === "position" ? sortDirection : "asc"}
                      onClick={() => handleSort("position")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      Position
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
                      active={sortColumn === "teamName"}
                      direction={sortColumn === "teamName" ? sortDirection : "asc"}
                      onClick={() => handleSort("teamName")}
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
                      active={sortColumn === "nationality"}
                      direction={sortColumn === "nationality" ? sortDirection : "asc"}
                      onClick={() => handleSort("nationality")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      Nationality
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
                      active={sortColumn === "height"}
                      direction={sortColumn === "height" ? sortDirection : "asc"}
                      onClick={() => handleSort("height")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      Height
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
                      active={sortColumn === "seasonExperience"}
                      direction={sortColumn === "seasonExperience" ? sortDirection : "asc"}
                      onClick={() => handleSort("seasonExperience")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                    >
                      Exp
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
                      Points
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
                      Rebounds
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
                      Assists
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
                      Steals
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
                      Blocks
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
                      active={sortColumn === "three_pointers"}
                      direction={sortColumn === "three_pointers" ? sortDirection : "asc"}
                      onClick={() => handleSort("three_pointers")}
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
                      {puntedCategories.length > 0 ? 'Adj Fant Pts' : 'Fantasy Pts'}
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={18} align="center">
                      <CircularProgress sx={{ color: "#1976d2" }} />
                    </TableCell>
                  </TableRow>
                ) : paginatedStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={18} align="center" sx={{ color: "#424242" }}>
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStats.map((stat, index) => {
                    const displayFantasyPoints = puntedCategories.length > 0 
                      ? stat.adjustedFantasyPoints 
                      : stat.stats?.fantasy_points;
                    
                    return (
                    <TableRow
                      key={`${stat.playerId}-${stat.season}-${index}`}
                      sx={{
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      <TableCell
                        align="center"
                        sx={{
                          color: "#1976d2",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontSize: "0.85rem",
                          fontWeight: 700,
                        }}
                      >
                        {page * rowsPerPage + index + 1}
                      </TableCell>
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
                              const [firstName, lastName] = stat.playerName.split(" ");
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
                          {stat.playerName}
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
                        {stat.season}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontSize: "0.85rem",
                        }}
                      >
                        {stat.position}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontSize: "0.85rem",
                        }}
                      >
                        {stat.teamName}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontSize: "0.85rem",
                        }}
                      >
                        {stat.nationality}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontSize: "0.85rem",
                        }}
                      >
                        {stat.height}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#212121",
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          fontSize: "0.85rem",
                        }}
                      >
                        {stat.seasonExperience}
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
                        {formatNumber(stat.stats?.points, 0)}
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
                        {formatNumber(stat.stats?.rebounds, 0)}
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
                        {formatNumber(stat.stats?.assists, 0)}
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
                        {formatNumber(stat.stats?.steals, 0)}
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
                        {formatNumber(stat.stats?.blocks, 0)}
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
                        {formatPercentage(stat.stats?.field_goal_percentage)}
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
                        {formatPercentage(stat.stats?.free_throw_percentage)}
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
                        {formatNumber(stat.stats?.three_pointers, 0)}
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
                        {formatNumber(stat.stats?.turnovers, 0)}
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
                          bgcolor: puntedCategories.length > 0 ? '#e3f2fd' : 'transparent',
                        }}
                      >
                        {formatNumber(displayFantasyPoints, 1)}
                        {puntedCategories.length > 0 && (
                          <Typography component="span" sx={{ fontSize: '0.65rem', color: '#666', ml: 0.5 }}>
                            ({formatNumber(stat.stats?.fantasy_points, 1)})
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
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
    )};
    </Box>
  );  
};

export default AlltimeGames;