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
} from "@mui/material";
import { fetchFilteredPlayerAverages } from "../api";

const AlltimeTable = () => {
  const [loading, setLoading] = useState(false);
  const [playerStats, setPlayerStats] = useState([]);
  const [filterType, setFilterType] = useState(null);
  const [filterValue, setFilterValue] = useState([]); // For multiselect (e.g., position, teamNames, nationalities)
  const [filterOperator, setFilterOperator] = useState("=");
  const [filterNumericValue, setFilterNumericValue] = useState("");
  const [filters, setFilters] = useState([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

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

        console.log("Filter params:", filterParams);
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

  // Memoize sorted stats
  const sortedPlayerStats = useMemo(() => {
    if (playerStats.length === 0) return [];
    
    let sortedStats = [...playerStats];
    
    if (sortColumn && sortDirection) {
      sortedStats.sort((a, b) => {
        let valueA, valueB;
        if (
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
          valueA = a.stats[sortColumn] || 0;
          valueB = b.stats[sortColumn] || 0;
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        }
      });
    }
    
    return sortedStats;
  }, [playerStats, sortColumn, sortDirection]);

  // Translate numeric season comparison to season list
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
        if (year < 1960 || year > 2023) {
          alert("Please enter a year between 1960 and 2023.");
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

  return (
    <Box sx={{ p: 3, background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)", minHeight: "100vh" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
              Player Statistics
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

              {(filterType?.isNumeric || filterType?.isHeight) ? (
                <>
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
                    "& .MuiInputBase-input": { color: "#212121" },
                    "& .MuiInputLabel-root": { color: "#424242" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "rgba(0, 0, 0, 0.12)" },
                        "&:hover fieldset": { borderColor: "#1976d2" },
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
                    "& .MuiInputBase-input": { color: "#212121" },
                    "& .MuiInputLabel-root": { color: "#424242" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "rgba(0, 0, 0, 0.12)" },
                          "&:hover fieldset": { borderColor: "#1976d2" },
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
          </Box>
        </Grid>
        {/* <Grid item xs={12} md={3}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 1,
            height: '100%'
          }}>
            <Typography
              variant="h6"
              sx={{
                color: "#212121",
                fontWeight: 500,
                letterSpacing: 1,
                textTransform: "uppercase",
                mb: 2
              }}
            >
              Top Players
            </Typography>
            <Box sx={{ 
              position: 'relative',
              height: '120px',
              width: '300px',
              margin: '0 auto'
            }}>
              {                             
              topPlayers.map((player, index) => {
                // Construct the player ID in basketball-reference format
                const [firstName, lastName] = player.playerName.split(' ');
                const normalizedLastName = normalizeName(lastName);
                const normalizedFirstName = normalizeName(firstName);
                const formattedId = `${normalizedLastName.substring(0, 5)}${normalizedFirstName.substring(0, 2)}01`;
                const avatarUrl = `https://www.basketball-reference.com/req/202106291/images/headshots/${formattedId}.jpg`;
                
                // More detailed logging
                console.log('Player:', {
                  name: player.playerName,
                  firstName,
                  lastName,
                  normalizedFirstName,
                  normalizedLastName,
                  formattedId,
                  avatarUrl
                });

                return (
                  <Box 
                    key={`${player.playerId}-${index}`}
                    sx={{ 
                      position: 'absolute',
                      left: `${index * 60}px`,
                      zIndex: topPlayers.length - index,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        zIndex: topPlayers.length + 1
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      width: '80px'
                    }}>
                      <Avatar
                        src={avatarUrl}
                        onError={(e) => {
                          console.log('Avatar load error:', {
                            player: player.playerName,
                            url: avatarUrl,
                            error: e
                          });
                          // Try alternative URL format
                          const altUrl = `https://www.basketball-reference.com/req/202106291/images/players/${formattedId}.jpg`;
                          console.log('Trying alternative URL:', altUrl);
                          e.target.src = altUrl;
                        }}
                        onLoad={() => {
                          console.log('Avatar loaded successfully:', {
                            player: player.playerName,
                            url: avatarUrl
                          });
                        }}
                        sx={{ 
                          width: 80, 
                          height: 80,
                          border: '2px solid #424242',
                          '&:hover': {
                            border: '2px solid #616161',
                          }
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#212121",
                          mt: 0.5,
                          textAlign: 'center',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          padding: '2px 4px',
                          borderRadius: '4px'
                        }}
                      >
                        {player.playerName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#B0B0B0",
                          textAlign: 'center',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {player.teamName} | {player.position}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Grid> */}
      </Grid>

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
                      border: "1px solid rgba(0, 0, 0, 0.12)",
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
                  active={sortColumn === "points_z"}
                  direction={sortColumn === "points_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("points_z")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                >
                  Points Z
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
                  active={sortColumn === "rebounds_z"}
                  direction={sortColumn === "rebounds_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("rebounds_z")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                >
                  Reb Z
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
                  active={sortColumn === "assists_z"}
                  direction={sortColumn === "assists_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("assists_z")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                >
                  Ast Z
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
                  active={sortColumn === "steals_z"}
                  direction={sortColumn === "steals_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("steals_z")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                >
                  Stl Z
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
                  active={sortColumn === "blocks_z"}
                  direction={sortColumn === "blocks_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("blocks_z")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                >
                  Blk Z
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
                  active={sortColumn === "field_goal_percentage_z"}
                  direction={sortColumn === "field_goal_percentage_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("field_goal_percentage_z")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                >
                  FG% Z
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
                  active={sortColumn === "free_throw_percentage_z"}
                  direction={sortColumn === "free_throw_percentage_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("free_throw_percentage_z")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                >
                  FT% Z
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
                  active={sortColumn === "turnovers_z"}
                  direction={sortColumn === "turnovers_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("turnovers_z")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                >
                  TOV Z
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
                  active={sortColumn === "three_pointers_z"}
                  direction={sortColumn === "three_pointers_z" ? sortDirection : "asc"}
                  onClick={() => handleSort("three_pointers_z")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                >
                  3PT Z
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
                  active={sortColumn === "total_value"}
                  direction={sortColumn === "total_value" ? sortDirection : "asc"}
                  onClick={() => handleSort("total_value")}
                      sx={{ color: "#424242", "&:hover": { color: "#1976d2" } }}
                >
                  Total Val
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={26} align="center" sx={{ py: 4 }}>
                      <CircularProgress sx={{ color: "#1976d2" }} />
                      <Typography sx={{ mt: 2, color: "#424242" }}>
                    Loading player statistics...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : sortedPlayerStats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={26} align="center" sx={{ py: 4, color: "#424242" }}>
                  No players found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              sortedPlayerStats.map((stat, index) => (
              <TableRow
                key={index}
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
                    bgcolor: getColorForValue(stat.stats?.points_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.points_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.points)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.rebounds_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.rebounds_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.rebounds)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.assists_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.assists_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.assists)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.steals_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.steals_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.steals)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.blocks_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.blocks_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.blocks)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.field_goal_percentage_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.field_goal_percentage_z || 0)),
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
                    bgcolor: getColorForValue(stat.stats?.free_throw_percentage_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.free_throw_percentage_z || 0)),
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
                    bgcolor: getColorForValue(stat.stats?.three_pointers_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.three_pointers_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.three_pointers)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.points_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.points_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.points_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.rebounds_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.rebounds_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.rebounds_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.assists_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.assists_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.assists_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.steals_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.steals_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.steals_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.blocks_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.blocks_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.blocks_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.field_goal_percentage_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.field_goal_percentage_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.field_goal_percentage_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.free_throw_percentage_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.free_throw_percentage_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.free_throw_percentage_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.turnovers_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.turnovers_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.turnovers)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.turnovers_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.turnovers_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.turnovers_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.three_pointers_z || 0),
                    color: getTextColor(getColorForValue(stat.stats?.three_pointers_z || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.three_pointers_z, 2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: getColorForValue(stat.stats?.total_value || 0),
                    color: getTextColor(getColorForValue(stat.stats?.total_value || 0)),
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatNumber(stat.stats?.total_value, 2)}
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default React.memo(AlltimeTable);