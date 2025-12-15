import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    Chip,
    Button,
} from '@mui/material';
import { supabase, CURRENT_SEASON } from '../utils/supabase';
import { useLeague } from '../contexts/LeagueContext';

const PUNT_CATEGORIES = [
    { key: 'points_z', label: 'PTS', fullName: 'Points' },
    { key: 'three_pointers_z', label: '3PM', fullName: 'Three Pointers' },
    { key: 'rebounds_z', label: 'REB', fullName: 'Rebounds' },
    { key: 'assists_z', label: 'AST', fullName: 'Assists' },
    { key: 'steals_z', label: 'STL', fullName: 'Steals' },
    { key: 'blocks_z', label: 'BLK', fullName: 'Blocks' },
    { key: 'fg_percentage_z', label: 'FG%', fullName: 'Field Goal %' },
    { key: 'ft_percentage_z', label: 'FT%', fullName: 'Free Throw %' },
    { key: 'turnovers_z', label: 'TO', fullName: 'Turnovers' },
];

const Rankings = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [periodType, setPeriodType] = useState('season');
    const [puntedCategories, setPuntedCategories] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState(new Set());
    const [showMyTeamOnly, setShowMyTeamOnly] = useState(false);
    const [teamFilter, setTeamFilter] = useState('all');
    const [positionFilter, setPositionFilter] = useState('all');
    const [orderBy, setOrderBy] = useState('total_value');
    const [order, setOrder] = useState('desc');
    const { userTeamPlayers } = useLeague();

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
    const isUserTeamPlayer = useCallback((player) => {
        return userTeamPlayerIds.has(player.player_id);
    }, [userTeamPlayerIds]);

    // Get unique teams and positions from players
    const { uniqueTeams, uniquePositions } = useMemo(() => {
        const teams = new Set();
        const positions = new Set();
        players.forEach(player => {
            if (player.team_abbreviation) teams.add(player.team_abbreviation);
            if (player.position && player.position !== '-') {
                const posArray = player.position.split(',');
                posArray.forEach(pos => positions.add(pos.trim()));
            }
        });
        console.log('Unique positions found:', Array.from(positions));
        return {
            uniqueTeams: Array.from(teams).sort(),
            uniquePositions: Array.from(positions).sort(),
        };
    }, [players]);

    // Calculate adjusted rankings based on punted categories
    const adjustedPlayers = useMemo(() => {
        let filtered = players;

        // Apply my team filter
        if (showMyTeamOnly) {
            filtered = filtered.filter(p => isUserTeamPlayer(p));
        }

        // Apply team filter
        if (teamFilter !== 'all') {
            filtered = filtered.filter(p => p.team_abbreviation === teamFilter);
        }

        // Apply position filter
        if (positionFilter !== 'all') {
            filtered = filtered.filter(p => p.position && p.position.includes(positionFilter));
        }

        if (!filtered.length || puntedCategories.length === 0) {
            return filtered.map((p) => ({
                ...p,
                originalRank: players.indexOf(p) + 1,
                adjustedTotalValue: p.total_value,
                adjustedRank: filtered.indexOf(p) + 1,
                rankChange: 0,
                valueChange: 0,
            }));
        }

        // Recalculate total_value excluding punted categories
        const allCategories = PUNT_CATEGORIES.map(c => c.key);
        const includedCategories = allCategories.filter(c => !puntedCategories.includes(c));
        const n = includedCategories.length;
        const sqrtN = Math.sqrt(n);

        const playersWithAdjusted = filtered.map((player) => {
            const sum = includedCategories.reduce((acc, cat) => acc + (player[cat] || 0), 0);
            const adjustedTotalValue = sum / sqrtN;

            return {
                ...player,
                originalRank: players.indexOf(player) + 1,
                adjustedTotalValue: Number(adjustedTotalValue.toFixed(2)),
                valueChange: Number((adjustedTotalValue - player.total_value).toFixed(2)),
            };
        });

        // Sort by adjusted total value (only when punting, otherwise apply user sorting)
        const sorted = [...playersWithAdjusted].sort((a, b) => b.adjustedTotalValue - a.adjustedTotalValue);

        // Calculate adjusted rank and rank change
        return sorted.map((player, idx) => ({
            ...player,
            adjustedRank: idx + 1,
            rankChange: player.originalRank - (idx + 1),
        }));
    }, [players, puntedCategories, showMyTeamOnly, teamFilter, positionFilter, isUserTeamPlayer]);

    // Apply sorting to the adjusted players
    const sortedPlayers = useMemo(() => {
        if (!adjustedPlayers.length) return [];

        const sorted = [...adjustedPlayers].sort((a, b) => {
            let aVal = a[orderBy];
            let bVal = b[orderBy];

            // Handle null/undefined values
            if (aVal === null || aVal === undefined) aVal = order === 'asc' ? Infinity : -Infinity;
            if (bVal === null || bVal === undefined) bVal = order === 'asc' ? Infinity : -Infinity;

            // Handle string vs number comparison
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return order === 'asc' 
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            // Numeric comparison
            return order === 'asc' ? aVal - bVal : bVal - aVal;
        });

        return sorted;
    }, [adjustedPlayers, orderBy, order]);

    // Calculate team impact when punting
    const teamImpact = useMemo(() => {
        if (!userTeamPlayers || userTeamPlayers.length === 0 || puntedCategories.length === 0) {
            return null;
        }

        const teamPlayers = sortedPlayers.filter(p => isUserTeamPlayer(p));
        
        if (teamPlayers.length === 0) return null;

        const totalValueChange = teamPlayers.reduce((sum, p) => sum + p.valueChange, 0);
        const avgValueChange = totalValueChange / teamPlayers.length;
        const playersImproved = teamPlayers.filter(p => p.valueChange > 0).length;
        const playersDeclined = teamPlayers.filter(p => p.valueChange < 0).length;

        return {
            totalValueChange: Number(totalValueChange.toFixed(2)),
            avgValueChange: Number(avgValueChange.toFixed(2)),
            playersImproved,
            playersDeclined,
            totalPlayers: teamPlayers.length,
        };
    }, [sortedPlayers, userTeamPlayers, puntedCategories.length, isUserTeamPlayer]);

    const handlePuntToggle = (categoryKey) => {
        setPuntedCategories(prev => {
            if (prev.includes(categoryKey)) {
                return prev.filter(c => c !== categoryKey);
            } else {
                return [...prev, categoryKey];
            }
        });
    };

    // Auto-select user's team players when data loads
    useEffect(() => {
        if (players.length > 0 && userTeamPlayerIds.size > 0) {
            const teamPlayerIds = new Set();
            players.forEach(player => {
                if (userTeamPlayerIds.has(player.player_id)) {
                    teamPlayerIds.add(player.player_id);
                }
            });
            setSelectedPlayers(teamPlayerIds);
        }
    }, [players, userTeamPlayerIds]);

    const handlePlayerToggle = (playerId) => {
        setSelectedPlayers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(playerId)) {
                newSet.delete(playerId);
            } else {
                newSet.add(playerId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedPlayers.size === sortedPlayers.length) {
            setSelectedPlayers(new Set());
        } else {
            setSelectedPlayers(new Set(sortedPlayers.map(p => p.player_id)));
        }
    };

    const handleSort = (columnId) => {
        // Don't allow sorting on these columns
        if (columnId === 'select' || columnId === 'rank') {
            return;
        }

        const isDesc = orderBy === columnId && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(columnId);
    };

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const { data: periodData, error: periodError } = await supabase
                    .from('player_period_averages')
                    .select('*')
                    .eq('season', CURRENT_SEASON)
                    .eq('period_type', periodType)
                    .limit(250)
                    .order('total_value', { ascending: false });

                if (periodError) throw periodError;

                const { data: yahooData, error: yahooError } = await supabase
                    .from('yahoo_nba_mapping')
                    .select('nba_id, position');

                if (yahooError) throw yahooError;

                const positionMap = new Map();
                yahooData.forEach(player => {
                    positionMap.set(player.nba_id, player.position);
                });

                const playersWithPosition = periodData.map(player => ({
                    ...player,
                    position: positionMap.get(player.player_id) || '-',
                }));

                console.log('Sample player with position:', playersWithPosition[0]);
                console.log('Position map size:', positionMap.size);
                
                setPlayers(playersWithPosition || []);
            } catch (error) {
                console.error('Error fetching player rankings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, [periodType]);

    const formatValue = (value, column, player) => {
        if (value === null || value === undefined || value === 0) return '-';

        // Format raw percentages as % with made/attempted ratio
        if (column === 'field_goal_percentage') {
            const fgm = player?.field_goals_per_game || 0;
            const fga = player?.field_goals_attempted_per_game || 0;
            return `${(value * 100).toFixed(1)}% (${fgm.toFixed(1)}/${fga.toFixed(1)})`;
        }
        if (column === 'free_throw_percentage') {
            const ftm = player?.free_throws_per_game || 0;
            const fta = player?.free_throws_attempted_per_game || 0;
            return `${(value * 100).toFixed(1)}% (${ftm.toFixed(1)}/${fta.toFixed(1)})`;
        }

        // Format z-scores and total value with 2 decimals
        if (column.endsWith('_z') || column === 'total_value' || column === 'adjustedTotalValue') {
            return typeof value === 'number' ? value.toFixed(2) : value;
        }

        // Format other numbers with 1 decimal
        if (typeof value === 'number') {
            return value.toFixed(1);
        }

        return value;
    };

    const getValueBackground = (value, isZScore = false) => {
        if (value === null || value === undefined) return 'transparent';
    
        const maxValue = isZScore ? 3 : 6;
        const minValue = -maxValue;
    
        const clamped = Math.max(minValue, Math.min(maxValue, value));
        const normalized = (clamped - minValue) / (maxValue - minValue); // 0 → 1
    
        // Hue: red (0°) → green (120°)
        const hue = normalized * 120;
    
        // Strength of the value (0 at center, 1 at extremes)
        const strength = Math.abs(clamped) / maxValue;
    
        // Saturation increases with strength
        const saturation = 30 + strength * 50; // 30% → 80%
    
        // Lightness decreases with strength (darker at extremes)
        const lightness = 85 - strength * 35; // 85% → 50%
    
        return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.45)`;
    };
    
    const columns = useMemo(() => {
        const baseColumns = [
            { id: 'select', label: '', sortable: false, align: 'center', width: 40 },
            { id: 'rank', label: 'Rank', sortable: false, align: 'center', width: 50 },
            { id: 'player_name', label: 'Name', sortable: true, align: 'left', width: 160 },
            { id: 'position', label: 'Pos', sortable: true, width: 50 },
            { id: 'team_abbreviation', label: 'Team', sortable: true, width: 55 },
            { id: 'total_value', label: 'Value', sortable: true, width: 60 },
        ];

        // Add punt-related columns if punting is active
        if (puntedCategories.length > 0) {
            baseColumns.push(
                { id: 'adjustedTotalValue', label: 'Adj Val', sortable: true, width: 60 },
                { id: 'valueChange', label: 'Δ', sortable: true, width: 50 },
                { id: 'rankChange', label: '±Rank', sortable: true, width: 55 }
            );
        }

        // Add stat columns (actual values + Z-scores)
        const statColumns = [
            { statKey: 'points_per_game', zKey: 'points_z', label: 'PTS', width: 50 },
            { statKey: 'three_pointers_per_game', zKey: 'three_pointers_z', label: '3PM', width: 50 },
            { statKey: 'rebounds_per_game', zKey: 'rebounds_z', label: 'REB', width: 50 },
            { statKey: 'assists_per_game', zKey: 'assists_z', label: 'AST', width: 50 },
            { statKey: 'steals_per_game', zKey: 'steals_z', label: 'STL', width: 50 },
            { statKey: 'blocks_per_game', zKey: 'blocks_z', label: 'BLK', width: 50 },
            { statKey: 'field_goal_percentage', zKey: 'fg_percentage_z', label: 'FG%', width: 110 },
            { statKey: 'free_throw_percentage', zKey: 'ft_percentage_z', label: 'FT%', width: 110 },
            { statKey: 'turnovers_per_game', zKey: 'turnovers_z', label: 'TO', width: 50 },
        ];

        statColumns.forEach(({ statKey, zKey, label, width }) => {
            baseColumns.push(
                { id: statKey, label: label, sortable: true, width: width },
                { id: zKey, label: `${label}Z`, sortable: true, width: 50, isZScore: true }
            );
        });

        return baseColumns;
    }, [puntedCategories.length]);

    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
                <CircularProgress />
            </Box>
        );
    }

    const getPeriodLabel = (period) => {
        const labels = {
            'season': 'Full Season',
            '60_days': 'Last 60 Days',
            '30_days': 'Last 30 Days',
            '7_days': 'Last 7 Days',
        };
        return labels[period] || period;
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
                    Player Rankings {CURRENT_SEASON}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                            value={periodType}
                            onChange={(e) => {
                                setPeriodType(e.target.value);
                                setLoading(true);
                            }}
                            sx={{ bgcolor: '#fff', fontSize: '0.875rem' }}
                        >
                            <MenuItem value="season">Full Season</MenuItem>
                            <MenuItem value="60_days">Last 60 Days</MenuItem>
                            <MenuItem value="30_days">Last 30 Days</MenuItem>
                            <MenuItem value="7_days">Last 7 Days</MenuItem>
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
                    
                    <Button
                        variant={showMyTeamOnly ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => setShowMyTeamOnly(!showMyTeamOnly)}
                        sx={{
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            bgcolor: showMyTeamOnly ? '#0066cc' : 'transparent',
                            color: showMyTeamOnly ? '#fff' : '#0066cc',
                            borderColor: '#0066cc',
                            '&:hover': {
                                bgcolor: showMyTeamOnly ? '#0052a3' : 'rgba(0, 102, 204, 0.08)',
                            },
                        }}
                    >
                        My Team
                    </Button>
                    
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                        {selectedPlayers.size} selected
                    </Typography>
                </Box>
            </Box>

            {/* Punt Categories - Compact Filter Bar */}
            <Box
                sx={{
                    mb: 2,
                    p: 1.5,
                    bgcolor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
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
                {puntedCategories.length > 0 && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666', fontSize: '0.75rem' }}>
                        Excluding: {PUNT_CATEGORIES.filter(c => puntedCategories.includes(c.key)).map(c => c.label).join(', ')}
                    </Typography>
                )}
                
                {/* Team Impact - Compact Display */}
                {teamImpact && (
                    <Box
                        sx={{
                            mb: 1,
                            p: 1,
                            bgcolor: teamImpact.totalValueChange >= 0 ? '#e8f5e9' : '#ffebee',
                            border: `1px solid ${teamImpact.totalValueChange >= 0 ? '#4caf50' : '#f44336'}`,
                            borderRadius: 1,
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Your Team:
                            </Typography>
                            <Typography variant="body2">
                                Total Change: <strong style={{ color: teamImpact.totalValueChange >= 0 ? '#2e7d32' : '#c62828' }}>
                                    {teamImpact.totalValueChange >= 0 ? '+' : ''}{teamImpact.totalValueChange}
                                </strong>
                            </Typography>
                            <Typography variant="body2">
                                Avg: <strong>{teamImpact.avgValueChange >= 0 ? '+' : ''}{teamImpact.avgValueChange}</strong>
                            </Typography>
                            <Typography variant="body2">
                                <span style={{ color: '#4caf50' }}>↑{teamImpact.playersImproved}</span>
                                {' / '}
                                <span style={{ color: '#f44336' }}>↓{teamImpact.playersDeclined}</span>
                                {' / '}
                                {teamImpact.totalPlayers}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            {adjustedPlayers.length === 0 && !loading ? (
                <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fff', border: '1px solid #ddd', borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                        No data available for {getPeriodLabel(periodType)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Period averages need to be calculated first.
                    </Typography>
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
                    <TableContainer
                        sx={{
                            maxHeight: '75vh',
                        }}
                    >
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align || 'center'}
                                        sx={{
                                            bgcolor: '#003366',
                                            color: '#fff',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            py: 1,
                                            px: 0.5,
                                            borderBottom: '1px solid #ddd',
                                            width: column.width || 'auto',
                                        }}
                                    >
                                        {column.id === 'select' ? (
                                            <Checkbox
                                                size="small"
                                                checked={selectedPlayers.size === sortedPlayers.length}
                                                indeterminate={selectedPlayers.size > 0 && selectedPlayers.size < sortedPlayers.length}
                                                onChange={handleSelectAll}
                                                sx={{
                                                    color: '#fff',
                                                    '&.Mui-checked': { color: '#fff' },
                                                    '&.MuiCheckbox-indeterminate': { color: '#fff' },
                                                    p: 0,
                                                }}
                                            />
                                        ) : column.sortable ? (
                                            <TableSortLabel
                                                active={orderBy === column.id}
                                                direction={orderBy === column.id ? order : 'asc'}
                                                onClick={() => handleSort(column.id)}
                                                sx={{
                                                    color: '#fff !important',
                                                    '& .MuiTableSortLabel-icon': {
                                                        color: '#fff !important',
                                                    },
                                                    '&:hover': {
                                                        color: '#fff',
                                                    },
                                                    '&.Mui-active': {
                                                        color: '#fff',
                                                    },
                                                }}
                                            >
                                                {column.label}
                                            </TableSortLabel>
                                        ) : (
                                            column.label
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedPlayers.map((player, index) => {
                                const isMyPlayer = isUserTeamPlayer(player);
                                const isSelected = selectedPlayers.has(player.player_id);
                                const displayRank = puntedCategories.length > 0 ? player.adjustedRank : (index + 1);
                                const hasMovedUp = player.rankChange > 0;
                                const hasMovedDown = player.rankChange < 0;
                                
                                return (
                                <TableRow
                                    key={player.id}
                                    onClick={() => handlePlayerToggle(player.player_id)}
                                    sx={{
                                        bgcolor: isSelected 
                                            ? 'rgba(0, 102, 204, 0.08)' 
                                            : index % 2 === 0 ? '#fff' : '#f9f9f9',
                                        '&:hover': {
                                            bgcolor: isSelected 
                                                ? 'rgba(0, 102, 204, 0.12)'
                                                : 'rgba(0, 0, 0, 0.03)',
                                            cursor: 'pointer',
                                        },
                                        borderLeft: isMyPlayer ? '3px solid #0066cc' : 'none',
                                    }}
                                >
                                    {columns.map((column) => {
                                        let value = column.id === 'rank' ? displayRank : player[column.id];
                                        let cellColor = '#000';
                                        let cellBg = 'transparent';
                                        
                                        // Determine cell styling
                                        if (puntedCategories.includes(column.id)) {
                                            cellColor = '#999';
                                            cellBg = '#f5f5f5';
                                        } else if (column.id === 'total_value') {
                                            cellBg = getValueBackground(value, false);
                                            cellColor = '#000';
                                        } else if (column.id === 'adjustedTotalValue') {
                                            value = player.adjustedTotalValue;
                                            cellBg = getValueBackground(value, false);
                                            cellColor = '#000';
                                        } else if (column.id === 'valueChange') {
                                            value = player.valueChange;
                                            cellColor = value > 0 ? '#4caf50' : value < 0 ? '#f44336' : '#000';
                                        } else if (column.id === 'rankChange') {
                                            value = player.rankChange;
                                            cellColor = hasMovedUp ? '#4caf50' : hasMovedDown ? '#f44336' : '#000';
                                        } else if (column.isZScore || column.id.endsWith('_z')) {
                                            const zValue = value || 0;
                                            cellBg = getValueBackground(zValue, true);
                                            cellColor = '#000';
                                        } else if (column.id === 'position') {
                                            cellColor = '#666';
                                        }

                                        return (
                                            <TableCell
                                                key={column.id}
                                                align={column.align || 'center'}
                                                sx={{
                                                    py: 0.75,
                                                    px: 0.5,
                                                    fontSize: '0.75rem',
                                                    borderBottom: '1px solid #eee',
                                                    color: cellColor,
                                                    bgcolor: cellBg,
                                                    fontWeight: column.id === 'player_name' ? 600 : 400,
                                                    width: column.width || 'auto',
                                                }}
                                            >
                                                {column.id === 'select' ? (
                                                    <Checkbox
                                                        size="small"
                                                        checked={isSelected}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={() => handlePlayerToggle(player.player_id)}
                                                        sx={{ p: 0 }}
                                                    />
                                                ) : column.id === 'rank' ? (
                                                    <Box>
                                                        {value}
                                                        {puntedCategories.length > 0 && player.originalRank !== displayRank && (
                                                            <Typography component="span" sx={{ fontSize: '0.65rem', color: '#999', ml: 0.5 }}>
                                                                ({player.originalRank})
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                ) : column.id === 'player_name' ? (
                                                    <Box sx={{ textAlign: 'left' }}>
                                                        {value}
                                                    </Box>
                                                ) : column.id === 'position' ? (
                                                    <Box sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                                                        {value || '-'}
                                                    </Box>
                                                ) : column.id === 'rankChange' ? (
                                                    <Box>
                                                        {value > 0 && '↑'}
                                                        {value < 0 && '↓'}
                                                        {value > 0 ? `+${value}` : value || '–'}
                                                    </Box>
                                                ) : column.id === 'valueChange' ? (
                                                    <Box>
                                                        {value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2)}
                                                    </Box>
                                                ) : column.id === 'adjustedTotalValue' ? (
                                                    <Box>
                                                        {value.toFixed(2)}
                                                    </Box>
                                                ) : (
                                                    formatValue(value, column.id, player)
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            )}

        </Box>
    );
};

export default Rankings;