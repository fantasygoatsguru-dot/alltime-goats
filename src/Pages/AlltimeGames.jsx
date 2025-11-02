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
import { fetchAllPlayers, fetchFilteredPlayerGameStats } from "../api";

const AlltimeGames = () => {
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
        setGameStats(stats);
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
    if (["playerName", "season", "position", "teamName", "nationality", "height"].includes(sortColumn)) {
      valueA = a[sortColumn] || "";
      valueB = b[sortColumn] || "";
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else if (sortColumn === "seasonExperience") {
      valueA = a[sortColumn] || 0;
      valueB = b[sortColumn] || 0;
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    } else {
      valueA = a.stats[sortColumn] || 0;
      valueB = b.stats[sortColumn] || 0;
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  const paginatedStats = sortedStats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Translate season comparison to season list
  const translateSeasonComparison = (operator, year) => {
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear < 1960 || parsedYear > 2023) {
      return [];
    }
    if (operator === "=") {
      return [`${parsedYear}-${(parsedYear + 1) % 100}`];
    }
    if (operator === ">=") {
      return seasons.filter((season) => parseInt(season.split("-")[0], 10) >= parsedYear);
    }
    if (operator === ">") {
      return seasons.filter((season) => parseInt(season.split("-")[0], 10) > parsedYear);
    }
    if (operator === "<=") {
      return seasons.filter((season) => parseInt(season.split("-")[0], 10) <= parsedYear);
    }
    if (operator === "<") {
      return seasons.filter((season) => parseInt(season.split("-")[0], 10) < parsedYear);
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
        if (year < 1960 || year > 2023) {
          alert("Please enter a year between 1960 and 2023.");
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
    <Box sx={{ p: 3, backgroundColor: "#121212", minHeight: "100vh" }}>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              color: "#E0E0E0",
              fontWeight: 500,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            All Time Game Stats
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
                    "& .MuiInputBase-input": { color: "#E0E0E0" },
                    "& .MuiInputLabel-root": { color: "#B0B0B0" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "rgba(0, 0, 0, 0.12)" },
                      "&:hover fieldset": { borderColor: "#555555" },
                    },
                  }}
                />
              )}
              sx={{ width: 200 }}
            />

            {(filterType?.isNumeric || filterType?.isHeight) ? (
              <>
                <FormControl sx={{ width: 100 }}>
                  <InputLabel sx={{ color: "#B0B0B0" }}>Operator</InputLabel>
                  <Select
                    value={filterOperator}
                    onChange={(e) => setFilterOperator(e.target.value)}
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#212121",
                      "& .MuiSvgIcon-root": { color: "#E0E0E0" },
                      "& fieldset": { borderColor: "rgba(0, 0, 0, 0.12)" },
                      "&:hover fieldset": { borderColor: "#555555" },
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
                    "& .MuiInputBase-input": { color: "#E0E0E0" },
                    "& .MuiInputLabel-root": { color: "#B0B0B0" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "rgba(0, 0, 0, 0.12)" },
                      "&:hover fieldset": { borderColor: "#555555" },
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
                    sx={{
                      width: 250,
                      backgroundColor: "#ffffff",
                      "& .MuiInputBase-input": { color: "#E0E0E0" },
                      "& .MuiInputLabel-root": { color: "#B0B0B0" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "rgba(0, 0, 0, 0.12)" },
                        "&:hover fieldset": { borderColor: "#555555" },
                      },
                    }}
                  />
                )}
                sx={{ width: 250 }}
              />
            )}

            <Button
              variant="contained"
              onClick={handleAddFilter}
              disabled={!filterType || (!filterValue?.length && !filterNumericValue)}
              sx={{
                backgroundColor: "#424242",
                color: "#E0E0E0",
                "&:hover": { backgroundColor: "#616161" },
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
                color: "#E0E0E0",
                borderColor: "rgba(0, 0, 0, 0.12)",
                "&:hover": { borderColor: "#bdbdbd", backgroundColor: "#f5f5f5" },
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
                  color: "#E0E0E0",
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
                      active={sortColumn === "playerName"}
                      direction={sortColumn === "playerName" ? sortDirection : "asc"}
                      onClick={() => handleSort("playerName")}
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
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
                      sx={{ color: "#E0E0E0", "&:hover": { color: "#FFFFFF" } }}
                    >
                      Fantasy Pts
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={17} align="center">
                      <CircularProgress sx={{ color: "#E0E0E0" }} />
                    </TableCell>
                  </TableRow>
                ) : paginatedStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={17} align="center" sx={{ color: "#E0E0E0" }}>
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStats.map((stat, index) => (
                    <TableRow
                      key={`${stat.playerId}-${stat.season}-${index}`}
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
                              "&:hover": { border: "1px solid #555555" },
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
                        }}
                      >
                        {formatNumber(stat.stats?.fantasy_points, 1)}
                      </TableCell>
                    </TableRow>
                  ))
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
              color: "#E0E0E0",
              "& .MuiTablePagination-selectLabel": { color: "#E0E0E0" },
              "& .MuiTablePagination-displayedRows": { color: "#E0E0E0" },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AlltimeGames;