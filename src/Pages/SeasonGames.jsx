import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
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
  Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { supabase, CURRENT_SEASON } from "../utils/supabase";
import { useLeague } from "../contexts/LeagueContext";
import { useAuth } from "../contexts/AuthContext";

const VALID_PERIOD_TYPES = ['season', 'last_day', '7_days', '30_days', '60_days'];

const PUNT_CATEGORIES = [
  { key: 'points', label: 'PTS', fullName: 'Points' },
  { key: 'rebounds', label: 'REB', fullName: 'Rebounds' },
  { key: 'assists', label: 'AST', fullName: 'Assists' },
  { key: 'steals', label: 'STL', fullName: 'Steals' },
  { key: 'blocks', label: 'BLK', fullName: 'Blocks' },
  { key: 'three_pointers_made', label: '3PM', fullName: 'Three Pointers' },
  { key: 'field_goals', label: 'FG', fullName: 'Field Goals', includesCategories: ['field_goals_made', 'field_goals_attempted'] },
  { key: 'free_throws', label: 'FT', fullName: 'Free Throws', includesCategories: ['free_throws_made', 'free_throws_attempted'] },
  { key: 'turnovers', label: 'TO', fullName: 'Turnovers' },
];

const SeasonGames = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gameStats, setGameStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [filterValue, setFilterValue] = useState([]);
  const [filterOperator, setFilterOperator] = useState("=");
  const [filterNumericValue, setFilterNumericValue] = useState("");
  const [filters, setFilters] = useState([]);
  const [sortColumn, setSortColumn] = useState("fantasy_points");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [latestGameDate, setLatestGameDate] = useState(null);
  const [teamFilter, setTeamFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [showMyTeamOnly, setShowMyTeamOnly] = useState(false);
  const [puntedCategories, setPuntedCategories] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const getInitialPeriodType = () => {
    const urlPeriod = searchParams.get('period');
    if (urlPeriod && VALID_PERIOD_TYPES.includes(urlPeriod)) {
      return urlPeriod;
    }
    return 'season';
  };

  const [periodType, setPeriodType] = useState(getInitialPeriodType);
  
  const { userTeamPlayers } = useLeague();
  const { isAuthenticated } = useAuth();

  const handlePeriodChange = (newPeriod) => {
    setPeriodType(newPeriod);
    setLoading(true);
    if (newPeriod === 'season') {
      searchParams.delete('period');
    } else {
      searchParams.set('period', newPeriod);
    }
    setSearchParams(searchParams, { replace: true });
  };

  // Create a Set of user's team player IDs for quick lookup
  const userTeamPlayerIds = useMemo(() => {
    const ids = new Set();
    if (userTeamPlayers && userTeamPlayers.length > 0) {
      userTeamPlayers.forEach(player => {
        if (player.nbaPlayerId) {
          ids.add(player.nbaPlayerId);
        }
      });
    }
    return ids;
  }, [userTeamPlayers]);

  // Check if a player belongs to user's team
  const isUserTeamPlayer = useCallback((playerId) => {
    return userTeamPlayerIds.has(playerId);
  }, [userTeamPlayerIds]);

  // Get unique teams and positions from game stats
  const { uniqueTeams, uniquePositions } = useMemo(() => {
    const teams = new Set();
    const positions = new Set();
    gameStats.forEach(game => {
      if (game.team) teams.add(game.team);
      if (game.position && game.position !== '-') {
        const posArray = game.position.split(',');
        posArray.forEach(pos => positions.add(pos.trim()));
      }
    });
    return {
      uniqueTeams: Array.from(teams).sort(),
      uniquePositions: Array.from(positions).sort(),
    };
  }, [gameStats]);

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
    { key: "field_goal_percentage", label: "FG%", isNumeric: true },
    { key: "free_throw_percentage", label: "FT%", isNumeric: true },
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

  // Safe number formatting helpers
  const formatNumber = (value, decimals = 0) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    return value.toFixed(decimals);
  };

  const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    return `${(value * 100).toFixed(decimals)}%`;
  };

  // Calculate fantasy points (optionally excluding punted categories)
  // Formula: PTS=1, REB=1.2, AST=1.5, STL=3, BLK=3, 3PM=0.5, FGM=1, FGA=-0.5, FTM=1, FTA=-0.5, TO=-1
  const calculateFantasyPoints = (game, excludeCategories = []) => {
    const stats = {
      points: game.points || 0,
      rebounds: game.rebounds || 0,
      assists: game.assists || 0,
      steals: game.steals || 0,
      blocks: game.blocks || 0,
      three_pointers_made: game.three_pointers_made || 0,
      field_goals_made: game.field_goals_made || 0,
      field_goals_attempted: game.field_goals_attempted || 0,
      free_throws_made: game.free_throws_made || 0,
      free_throws_attempted: game.free_throws_attempted || 0,
      turnovers: game.turnovers || 0,
    };

    // Expand grouped categories (FG includes both FGM and FGA, FT includes both FTM and FTA)
    const expandedExcludeCategories = [...excludeCategories];
    if (excludeCategories.includes('field_goals')) {
      expandedExcludeCategories.push('field_goals_made', 'field_goals_attempted');
    }
    if (excludeCategories.includes('free_throws')) {
      expandedExcludeCategories.push('free_throws_made', 'free_throws_attempted');
    }

    let total = 0;
    if (!expandedExcludeCategories.includes('points')) total += stats.points * 1;
    if (!expandedExcludeCategories.includes('rebounds')) total += stats.rebounds * 1.2;
    if (!expandedExcludeCategories.includes('assists')) total += stats.assists * 1.5;
    if (!expandedExcludeCategories.includes('steals')) total += stats.steals * 3;
    if (!expandedExcludeCategories.includes('blocks')) total += stats.blocks * 3;
    if (!expandedExcludeCategories.includes('three_pointers_made')) total += stats.three_pointers_made * 0.5;
    if (!expandedExcludeCategories.includes('field_goals_made')) total += stats.field_goals_made * 1;
    if (!expandedExcludeCategories.includes('field_goals_attempted')) total += stats.field_goals_attempted * -0.5;
    if (!expandedExcludeCategories.includes('free_throws_made')) total += stats.free_throws_made * 1;
    if (!expandedExcludeCategories.includes('free_throws_attempted')) total += stats.free_throws_attempted * -0.5;
    if (!expandedExcludeCategories.includes('turnovers')) total += stats.turnovers * -1;

    return total;
  };

  // Fetch game stats based on filters
  useEffect(() => {
    const loadGameStats = async () => {
      try {
        setLoading(true);

        // First, get all player mappings to create a lookup
        const { data: mappingData, error: mappingError } = await supabase
          .from('yahoo_nba_mapping')
          .select('nba_id, name, team, position');

        if (mappingError) throw mappingError;

        // Create a lookup map for player info
        const playerMap = {};
        mappingData.forEach(player => {
          playerMap[player.nba_id] = {
            name: player.name,
            team: player.team,
            position: player.position
          };
        });

        // Calculate date range based on period type
        let dateFilter = null;
        let exactDateFilter = null;
        const today = new Date();

        if (periodType === 'last_day') {
          const { data: latestDateData, error: latestDateError } = await supabase
            .from('player_game_logs')
            .select('game_date')
            .eq('season', CURRENT_SEASON)
            .order('game_date', { ascending: false })
            .limit(1);

          if (latestDateError) throw latestDateError;

          if (latestDateData && latestDateData.length > 0) {
            exactDateFilter = latestDateData[0].game_date;
            setLatestGameDate(exactDateFilter);
          }
        } else if (periodType === '7_days') {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          dateFilter = sevenDaysAgo.toISOString().split('T')[0];
        } else if (periodType === '30_days') {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          dateFilter = thirtyDaysAgo.toISOString().split('T')[0];
        } else if (periodType === '60_days') {
          const sixtyDaysAgo = new Date(today);
          sixtyDaysAgo.setDate(today.getDate() - 60);
          dateFilter = sixtyDaysAgo.toISOString().split('T')[0];
        }

        // Build query for game logs
        let query = supabase
          .from('player_game_logs')
          .select('*')
          .order('fantasy_points', { ascending: false })
          .eq('season', CURRENT_SEASON);

        // Apply date filter based on period
        if (exactDateFilter) {
          query = query.eq('game_date', exactDateFilter);
        } else if (dateFilter) {
          query = query.gte('game_date', dateFilter);
        }

        // Apply numeric/date filters
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
        });

        const { data, error } = await query.limit(1000);

        if (error) throw error;

        // Join with player mapping data and calculate fantasy points
        let statsWithFantasyPoints = data.map(game => {
          const playerInfo = playerMap[game.player_id] || { 
            name: game.player_name || 'Unknown', 
            team: 'Unknown',
            position: '-'
          };
          return {
            ...game,
            player_name: playerInfo.name,
            team: playerInfo.team,
            position: playerInfo.position,
            fantasy_points: calculateFantasyPoints(game),
            adjusted_fantasy_points: calculateFantasyPoints(game, puntedCategories),
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

        // Apply team filter
        if (teamFilter !== 'all') {
          statsWithFantasyPoints = statsWithFantasyPoints.filter(game => game.team === teamFilter);
        }

        // Apply position filter
        if (positionFilter !== 'all') {
          statsWithFantasyPoints = statsWithFantasyPoints.filter(game => 
            game.position && game.position.includes(positionFilter)
          );
        }

        // Apply "My Team" filter
        if (showMyTeamOnly) {
          statsWithFantasyPoints = statsWithFantasyPoints.filter(game => 
            isUserTeamPlayer(game.player_id)
          );
        }

        setGameStats(statsWithFantasyPoints);
      } catch (error) {
        console.error("Error loading game stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGameStats();
  }, [filters, periodType, teamFilter, positionFilter, showMyTeamOnly, puntedCategories, isUserTeamPlayer]);

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
  const sortedStats = useMemo(() => {
    return [...gameStats].sort((a, b) => {
    if (!sortColumn) return 0;
    let valueA, valueB;
      
      // Use adjusted_fantasy_points when punting categories
      if (sortColumn === 'fantasy_points' && puntedCategories.length > 0) {
        valueA = a.adjusted_fantasy_points || 0;
        valueB = b.adjusted_fantasy_points || 0;
      } else if (["player_name", "game_date", "team", "opponent"].includes(sortColumn)) {
      valueA = a[sortColumn] || "";
      valueB = b[sortColumn] || "";
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else {
      valueA = a[sortColumn] || 0;
      valueB = b[sortColumn] || 0;
    }
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
  });
  }, [gameStats, sortColumn, sortDirection, puntedCategories.length]);

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#003366',
              fontSize: '1.25rem',
            }}
          >
            {CURRENT_SEASON} Season - Top Games
          </Typography>
          <Tooltip
            title={
              <Box sx={{ p: 1, maxWidth: 280 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  How Fantasy Points are Calculated
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5, lineHeight: 1.5 }}>
                  Each stat contributes to the total:
                </Typography>
                <Typography variant="body2" component="div" sx={{ lineHeight: 1.8, fontSize: '0.8rem' }}>
                  <strong>Points:</strong> +1 per point scored<br />
                  <strong>Rebounds:</strong> +1.2 per rebound<br />
                  <strong>Assists:</strong> +1.5 per assist<br />
                  <strong>Steals:</strong> +3 per steal<br />
                  <strong>Blocks:</strong> +3 per block<br />
                  <strong>3-Pointers:</strong> +0.5 per make<br />
                  <strong>Field Goals:</strong> +1 made, -0.5 attempted<br />
                  <strong>Free Throws:</strong> +1 made, -0.5 attempted<br />
                  <strong>Turnovers:</strong> -1 per turnover
                </Typography>
              </Box>
            }
            arrow
            placement="bottom-start"
          >
            <InfoOutlinedIcon 
              sx={{ 
                fontSize: '1rem', 
                color: '#666', 
                cursor: 'help',
                '&:hover': { color: '#0066cc' },
              }} 
            />
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={periodType}
              onChange={(e) => handlePeriodChange(e.target.value)}
              sx={{ bgcolor: '#fff', fontSize: '0.875rem' }}
            >
              <MenuItem value="season">Full Season</MenuItem>
              <MenuItem value="60_days">Last 60 Days</MenuItem>
              <MenuItem value="30_days">Last 30 Days</MenuItem>
              <MenuItem value="7_days">Last 7 Days</MenuItem>
              <MenuItem value="last_day">
                {latestGameDate ? `Last Day (${latestGameDate})` : 'Last Day'}
              </MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              sx={{ bgcolor: '#fff', fontSize: '0.875rem' }}
            >
              <MenuItem value="all">All Teams</MenuItem>
              {uniqueTeams.map(team => (
                <MenuItem key={team} value={team}>{team}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              sx={{ bgcolor: '#fff', fontSize: '0.875rem' }}
            >
              <MenuItem value="all">All Pos</MenuItem>
              {uniquePositions.map(pos => (
                <MenuItem key={pos} value={pos}>{pos}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Tooltip 
            title={!isAuthenticated ? "Login to yahoo to load your team" : ""}
            arrow
          >
            <span>
              <Button
                variant={showMyTeamOnly ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setShowMyTeamOnly(!showMyTeamOnly)}
                disabled={!isAuthenticated}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  bgcolor: showMyTeamOnly ? '#0066cc' : 'transparent',
                  color: showMyTeamOnly ? '#fff' : '#0066cc',
                  borderColor: '#0066cc',
                  '&:hover': {
                    bgcolor: showMyTeamOnly ? '#0052a3' : 'rgba(0, 102, 204, 0.08)',
                  },
                  '&.Mui-disabled': {
                    borderColor: '#ccc',
                    color: '#ccc',
                  },
                }}
              >
                My Team
              </Button>
            </span>
          </Tooltip>
        </Box>
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
                    sx={{ '&.Mui-checked': { color: '#0066cc' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#000' }}>{cat.label}</Typography>}
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

            {filterType?.isNumeric && (
            <FormControl size="small" sx={{ width: 90 }}>
              <InputLabel>Operator</InputLabel>
                <Select
                  value={filterOperator}
                  onChange={(e) => setFilterOperator(e.target.value)}
                sx={{ backgroundColor: "#ffffff", fontSize: '0.875rem' }}
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
            size="small"
              disabled={!filterType}
              sx={{
              width: 180,
                backgroundColor: "#ffffff",
              "& .MuiInputBase-input": { fontSize: '0.875rem' },
              }}
            />

            <Button
              variant="contained"
              onClick={handleAddFilter}
              disabled={!filterType || !filterNumericValue}
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
                      active={sortColumn === "player_name"}
                      direction={sortColumn === "player_name" ? sortDirection : "asc"}
                      onClick={() => handleSort("player_name")}
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
                      bgcolor: '#003366',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      py: 1,
                      px: 0.5,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "game_date"}
                      direction={sortColumn === "game_date" ? sortDirection : "asc"}
                      onClick={() => handleSort("game_date")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      Date
                    </TableSortLabel>
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
                      active={sortColumn === "team"}
                      direction={sortColumn === "team" ? sortDirection : "asc"}
                      onClick={() => handleSort("team")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
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
                      fontSize: "0.75rem",
                      py: 1,
                      px: 0.5,
                    }}
                  >
                    <TableSortLabel
                      active={sortColumn === "opponent"}
                      direction={sortColumn === "opponent" ? sortDirection : "asc"}
                      onClick={() => handleSort("opponent")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      vs
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "points"}
                      direction={sortColumn === "points" ? sortDirection : "asc"}
                      onClick={() => handleSort("points")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      PTS
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "rebounds"}
                      direction={sortColumn === "rebounds" ? sortDirection : "asc"}
                      onClick={() => handleSort("rebounds")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      REB
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "assists"}
                      direction={sortColumn === "assists" ? sortDirection : "asc"}
                      onClick={() => handleSort("assists")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      AST
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "steals"}
                      direction={sortColumn === "steals" ? sortDirection : "asc"}
                      onClick={() => handleSort("steals")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      STL
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "blocks"}
                      direction={sortColumn === "blocks" ? sortDirection : "asc"}
                      onClick={() => handleSort("blocks")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      BLK
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "field_goals_made"}
                      direction={sortColumn === "field_goals_made" ? sortDirection : "asc"}
                      onClick={() => handleSort("field_goals_made")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      FGM
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "field_goals_attempted"}
                      direction={sortColumn === "field_goals_attempted" ? sortDirection : "asc"}
                      onClick={() => handleSort("field_goals_attempted")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      FGA
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "field_goal_percentage"}
                      direction={sortColumn === "field_goal_percentage" ? sortDirection : "asc"}
                      onClick={() => handleSort("field_goal_percentage")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      FG%
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "free_throws_made"}
                      direction={sortColumn === "free_throws_made" ? sortDirection : "asc"}
                      onClick={() => handleSort("free_throws_made")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      FTM
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "free_throws_attempted"}
                      direction={sortColumn === "free_throws_attempted" ? sortDirection : "asc"}
                      onClick={() => handleSort("free_throws_attempted")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      FTA
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "free_throw_percentage"}
                      direction={sortColumn === "free_throw_percentage" ? sortDirection : "asc"}
                      onClick={() => handleSort("free_throw_percentage")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      FT%
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "three_pointers_made"}
                      direction={sortColumn === "three_pointers_made" ? sortDirection : "asc"}
                      onClick={() => handleSort("three_pointers_made")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      3PT
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "turnovers"}
                      direction={sortColumn === "turnovers" ? sortDirection : "asc"}
                      onClick={() => handleSort("turnovers")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      TOV
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
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
                      active={sortColumn === "fantasy_points"}
                      direction={sortColumn === "fantasy_points" ? sortDirection : "asc"}
                      onClick={() => handleSort("fantasy_points")}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': {
                          color: '#fff !important',
                        },
                      }}
                    >
                      {puntedCategories.length > 0 ? 'Adj Fant Pts' : 'Fantasy Pts'}
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={19} align="center" sx={{ color: "#666", py: 4 }}>
                      No games found matching the selected filters
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStats.map((stat, index) => {
                    const isMyPlayer = isAuthenticated && isUserTeamPlayer(stat.player_id);
                    const displayFantasyPoints = puntedCategories.length > 0 
                      ? stat.adjusted_fantasy_points 
                      : stat.fantasy_points;
                    
                    const getRowBackground = () => {
                      if (isMyPlayer) return 'rgba(0, 102, 204, 0.08)';
                      return index % 2 === 0 ? '#fff' : '#f9f9f9';
                    };
                    
                    return (
                    <TableRow
                      key={`${stat.player_id}-${stat.game_date}-${index}`}
                      sx={{
                        bgcolor: getRowBackground(),
                        '&:hover': {
                          bgcolor: isMyPlayer ? 'rgba(0, 102, 204, 0.12)' : 'rgba(0, 102, 204, 0.04)',
                        },
                        borderLeft: isMyPlayer ? '3px solid #0066cc' : 'none',
                      }}
                    >
                      <TableCell
                        align="center"
                        sx={{
                          color: "#0066cc",
                          py: 0.75,
                          px: 0.5,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#212121",
                          py: 0.75,
                          px: 0.5,
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                          fontWeight: 600,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar
                            src={`https://cdn.nba.com/headshots/nba/latest/260x190/${stat.player_id}.png`}
                            onError={(e) => {
                              e.target.src = "https://www.basketball-reference.com/req/202106291/images/headshots/default.jpg";
                            }}
                            sx={{
                              width: 28,
                              height: 28,
                              border: isMyPlayer ? "2px solid #0066cc" : "1px solid #ddd",
                            }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {stat.player_name}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#212121",
                          py: 0.75,
                          px: 0.5,
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {stat.game_date}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#212121",
                          py: 0.75,
                          px: 0.5,
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {stat.team}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#212121",
                          py: 0.75,
                          px: 0.5,
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {stat.opponent || '-'}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: puntedCategories.includes('points') ? '#999' : '#212121',
                          bgcolor: puntedCategories.includes('points') ? '#f5f5f5' : 'transparent',
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {formatNumber(stat.points, 0)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: puntedCategories.includes('rebounds') ? '#999' : '#212121',
                          bgcolor: puntedCategories.includes('rebounds') ? '#f5f5f5' : 'transparent',
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {formatNumber(stat.rebounds, 0)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: puntedCategories.includes('assists') ? '#999' : '#212121',
                          bgcolor: puntedCategories.includes('assists') ? '#f5f5f5' : 'transparent',
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {formatNumber(stat.assists, 0)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: puntedCategories.includes('steals') ? '#999' : '#212121',
                          bgcolor: puntedCategories.includes('steals') ? '#f5f5f5' : 'transparent',
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {formatNumber(stat.steals, 0)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: puntedCategories.includes('blocks') ? '#999' : '#212121',
                          bgcolor: puntedCategories.includes('blocks') ? '#f5f5f5' : 'transparent',
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {formatNumber(stat.blocks, 0)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: puntedCategories.includes('field_goals') ? '#999' : '#212121',
                          bgcolor: puntedCategories.includes('field_goals') ? '#f5f5f5' : 'transparent',
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {formatNumber(stat.field_goals_made, 0)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: puntedCategories.includes('field_goals') ? '#999' : '#212121',
                          bgcolor: puntedCategories.includes('field_goals') ? '#f5f5f5' : 'transparent',
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {formatNumber(stat.field_goals_attempted, 0)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: puntedCategories.includes('field_goals') ? '#999' : '#212121',
                          bgcolor: puntedCategories.includes('field_goals') ? '#f5f5f5' : 'transparent',
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {formatPercentage(stat.field_goal_percentage)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: puntedCategories.includes('free_throws') ? '#999' : '#212121',
                          bgcolor: puntedCategories.includes('free_throws') ? '#f5f5f5' : 'transparent',
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {formatNumber(stat.free_throws_made, 0)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: puntedCategories.includes('free_throws') ? '#999' : '#212121',
                          bgcolor: puntedCategories.includes('free_throws') ? '#f5f5f5' : 'transparent',
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {formatNumber(stat.free_throws_attempted, 0)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: puntedCategories.includes('free_throws') ? '#999' : '#212121',
                          bgcolor: puntedCategories.includes('free_throws') ? '#f5f5f5' : 'transparent',
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {formatPercentage(stat.free_throw_percentage)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: puntedCategories.includes('three_pointers_made') ? '#999' : '#212121',
                          bgcolor: puntedCategories.includes('three_pointers_made') ? '#f5f5f5' : 'transparent',
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {formatNumber(stat.three_pointers_made, 0)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: puntedCategories.includes('turnovers') ? '#999' : '#212121',
                          bgcolor: puntedCategories.includes('turnovers') ? '#f5f5f5' : 'transparent',
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {formatNumber(stat.turnovers, 0)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "#212121",
                          py: 0.75,
                          px: 0.5,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: "0.75rem",
                          borderBottom: '1px solid #eee',
                          fontWeight: 600,
                          bgcolor: puntedCategories.length > 0 ? '#e3f2fd' : 'transparent',
                        }}
                      >
                        {formatNumber(displayFantasyPoints, 1)}
                        {puntedCategories.length > 0 && (
                          <Typography component="span" sx={{ fontSize: '0.65rem', color: '#666', ml: 0.5 }}>
                            ({formatNumber(stat.fantasy_points, 1)})
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
          <Box sx={{ bgcolor: '#fff', borderTop: '1px solid #ddd' }}>
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
                "& .MuiTablePagination-selectLabel": { color: "#666", fontSize: '0.875rem' },
                "& .MuiTablePagination-displayedRows": { color: "#666", fontSize: '0.875rem' },
                "& .MuiTablePagination-select": { fontSize: '0.875rem' },
            }}
          />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SeasonGames;

