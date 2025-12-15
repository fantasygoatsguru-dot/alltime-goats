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
    const [orderBy, setOrderBy] = useState('total_value');
    const [order, setOrder] = useState('desc');
    const [periodType, setPeriodType] = useState('season');
    const [puntedCategories, setPuntedCategories] = useState([]);
    const [isAdjusting, setIsAdjusting] = useState(false);
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

    // Calculate adjusted rankings based on punted categories
    const adjustedPlayers = useMemo(() => {
        if (!players.length || puntedCategories.length === 0) {
            return players.map((p, idx) => ({
                ...p,
                originalRank: idx + 1,
                adjustedTotalValue: p.total_value,
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

        const playersWithAdjusted = players.map((player, idx) => {
            const sum = includedCategories.reduce((acc, cat) => acc + (player[cat] || 0), 0);
            const adjustedTotalValue = sum / sqrtN;

            return {
                ...player,
                originalRank: idx + 1,
                adjustedTotalValue: Number(adjustedTotalValue.toFixed(2)),
                valueChange: Number((adjustedTotalValue - player.total_value).toFixed(2)),
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
    }, [players, puntedCategories]);

    // Calculate team impact when punting
    const teamImpact = useMemo(() => {
        if (!userTeamPlayers || userTeamPlayers.length === 0 || puntedCategories.length === 0) {
            return null;
        }

        const teamPlayers = adjustedPlayers.filter(p => isUserTeamPlayer(p));
        
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
    }, [adjustedPlayers, userTeamPlayers, puntedCategories.length, isUserTeamPlayer]);

    const handlePuntToggle = (categoryKey) => {
        setIsAdjusting(true);
        setPuntedCategories(prev => {
            if (prev.includes(categoryKey)) {
                return prev.filter(c => c !== categoryKey);
            } else {
                return [...prev, categoryKey];
            }
        });
        
        // Reset adjusting state after a brief delay for smooth transition
        setTimeout(() => setIsAdjusting(false), 300);
    };

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const { data, error } = await supabase
                    .from('player_period_averages')
                    .select('*')
                    .eq('season', CURRENT_SEASON)
                    .eq('period_type', periodType)
                    .limit(200)
                    .order('total_value', { ascending: false });

                if (error) throw error;
                setPlayers(data || []);
            } catch (error) {
                console.error('Error fetching player rankings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, [periodType]);

    const handleSort = (column) => {
        const isAsc = orderBy === column && order === 'desc';
        setOrder(isAsc ? 'asc' : 'desc');
        setOrderBy(column);
    };

    // Delicate red → green with softer tones and lower saturation
    const getRedGreenColor = (score) => {
        const baseR = 198; // from #c62828
        const baseG = 40;
        const baseB = 40;

        const targetR = 165; // toward #a5d6a7
        const targetG = 214;
        const targetB = 167;

        const mid = 0.5 * (score + 1); // 0 to 1

        const r = Math.round(baseR + (targetR - baseR) * mid);
        const g = Math.round(baseG + (targetG - baseG) * mid);
        const b = Math.round(baseB + (targetB - baseB) * mid);

        return `rgba(${r}, ${g}, ${b}, 0.35)`;
    };

    const getColorForValue = (value, column) => {
        if (value === null || value === undefined) return 'transparent';

        let score = 0;

        if (column.endsWith('_z')) {
            score = Math.min(Math.max(value / 3, -1), 1);
            return getRedGreenColor(score);
        }

        switch (column) {
            case 'total_value':
                score = Math.min(Math.max(value / 8, -1), 1);
                break;
            case 'points_per_game':
                score = Math.min(Math.max((value - 15) / 15, -1), 1);
                break;
            case 'rebounds_per_game':
                score = Math.min(Math.max((value - 5) / 8, -1), 1);
                break;
            case 'assists_per_game':
                score = Math.min(Math.max((value - 3) / 7, -1), 1);
                break;
            case 'steals_per_game':
                score = Math.min(Math.max((value - 0.8) / 1.5, -1), 1);
                break;
            case 'blocks_per_game':
                score = Math.min(Math.max((value - 0.5) / 2, -1), 1);
                break;
            case 'three_pointers_per_game':
                score = Math.min(Math.max((value - 1.5) / 3, -1), 1);
                break;
            case 'field_goal_percentage':
                score = Math.min(Math.max((value - 0.45) / 0.15, -1), 1);
                break;
            case 'free_throw_percentage':
                score = Math.min(Math.max((value - 0.75) / 0.2, -1), 1);
                break;
            case 'turnovers_per_game':
                score = Math.min(Math.max((3 - value) / 2.5, -1), 1);
                break;
            default:
                return 'transparent';
        }

        return getRedGreenColor(score);
    };

    const getTextColor = (bgColor) => {
        if (!bgColor || bgColor === 'transparent') return '#212121';
        return '#212121';
    };

    const formatValue = (value, column) => {
        if (value === null || value === undefined) return '-';

        // Only format raw percentages as %
        if (
            (column === 'field_goal_percentage' || column === 'free_throw_percentage') ||
            column.includes('_percentage') && !column.endsWith('_z')
        ) {
            return `${(value * 100).toFixed(1)}%`;
        }

        if (typeof value === 'number') {
            return column.endsWith('_z') || column === 'total_value'
                ? value.toFixed(2)
                : value.toFixed(1);
        }

        return value;
    };

    const columns = useMemo(() => {
        const baseColumns = [
            { id: 'rank', label: '#', sortable: false, align: 'center' },
            { id: 'player_name', label: 'Player', sortable: false, align: 'left' },
            { id: 'team_abbreviation', label: 'Team', sortable: false },
            { id: 'total_value', label: 'Total Value', sortable: false },
        ];

        // Add punt-related columns if punting is active
        if (puntedCategories.length > 0) {
            baseColumns.push(
                { id: 'adjustedTotalValue', label: 'Adj. Value', sortable: false },
                { id: 'valueChange', label: 'Δ Value', sortable: false },
                { id: 'rankChange', label: 'Δ Rank', sortable: false }
            );
        }

        // Add Z-scores
        baseColumns.push(
            { id: 'points_z', label: 'PTS Z', sortable: false },
            { id: 'rebounds_z', label: 'REB Z', sortable: false },
            { id: 'assists_z', label: 'AST Z', sortable: false },
            { id: 'steals_z', label: 'STL Z', sortable: false },
            { id: 'blocks_z', label: 'BLK Z', sortable: false },
            { id: 'three_pointers_z', label: '3PM Z', sortable: false },
            { id: 'fg_percentage_z', label: 'FG% Z', sortable: false },
            { id: 'ft_percentage_z', label: 'FT% Z', sortable: false },
            { id: 'turnovers_z', label: 'TO Z', sortable: false }
        );

        // Add raw stats
        baseColumns.push(
            { id: 'points_per_game', label: 'PTS', sortable: false },
            { id: 'rebounds_per_game', label: 'REB', sortable: false },
            { id: 'assists_per_game', label: 'AST', sortable: false },
            { id: 'steals_per_game', label: 'STL', sortable: false },
            { id: 'blocks_per_game', label: 'BLK', sortable: false },
            { id: 'three_pointers_per_game', label: '3PM', sortable: false },
            { id: 'field_goal_percentage', label: 'FG%', sortable: false },
            { id: 'free_throw_percentage', label: 'FT%', sortable: false },
            { id: 'turnovers_per_game', label: 'TO', sortable: false }
        );

        return baseColumns;
    }, [puntedCategories.length]);

    if (loading) {
        return (
            <Box
                sx={{
                    p: 2,
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
                    color: '#212121',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress sx={{ color: '#4a90e2' }} />
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
                p: { xs: 1, md: 3 },
                minHeight: '100vh',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 4,
                gap: 2,
            }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: '#1976d2',
                        textShadow: 'none',
                        fontFamily: '"Roboto Mono", monospace',
                        letterSpacing: '0.5px',
                    }}
                >
                    Player Rankings {CURRENT_SEASON}
                </Typography>
                
                <FormControl 
                    sx={{ 
                        minWidth: 200,
                        bgcolor: '#ffffff',
                        borderRadius: 1,
                    }}
                    size="small"
                >
                    <InputLabel 
                        id="period-select-label"
                        sx={{
                            color: '#1976d2',
                            fontFamily: '"Roboto Mono", monospace',
                            '&.Mui-focused': {
                                color: '#1976d2',
                            },
                        }}
                    >
                        Time Period
                    </InputLabel>
                    <Select
                        labelId="period-select-label"
                        id="period-select"
                        value={periodType}
                        label="Time Period"
                        onChange={(e) => {
                            setPeriodType(e.target.value);
                            setLoading(true);
                        }}
                        sx={{
                            fontFamily: '"Roboto Mono", monospace',
                            color: '#1976d2',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#1976d2',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#2e7d32',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#2e7d32',
                            },
                        }}
                    >
                        <MenuItem value="season" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                            Full Season
                        </MenuItem>
                        <MenuItem value="60_days" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                            Last 60 Days
                        </MenuItem>
                        <MenuItem value="30_days" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                            Last 30 Days
                        </MenuItem>
                        <MenuItem value="7_days" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                            Last 7 Days
                        </MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Punt Categories Section */}
            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: '#ffffff',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: '"Roboto Mono", monospace',
                            color: '#1976d2',
                            fontWeight: 'bold',
                        }}
                    >
                        Punt Categories
                    </Typography>
                    {puntedCategories.length > 0 && (
                        <Chip
                            label={puntedCategories.length}
                            size="small"
                            sx={{
                                bgcolor: '#2e7d32',
                                color: '#ffffff',
                                fontFamily: '"Roboto Mono", monospace',
                                fontWeight: 'bold',
                            }}
                        />
                    )}
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                    }}
                >
                    {PUNT_CATEGORIES.map((cat) => (
                        <FormControlLabel
                            key={cat.key}
                            control={
                                <Checkbox
                                    checked={puntedCategories.includes(cat.key)}
                                    onChange={() => handlePuntToggle(cat.key)}
                                    sx={{
                                        color: '#1976d2',
                                        '&.Mui-checked': {
                                            color: '#2e7d32',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        fontFamily: '"Roboto Mono", monospace',
                                        fontSize: '0.9rem',
                                        color: puntedCategories.includes(cat.key) ? '#2e7d32' : '#212121',
                                        fontWeight: puntedCategories.includes(cat.key) ? 'bold' : 'normal',
                                    }}
                                >
                                    {cat.label}
                                </Typography>
                            }
                            sx={{
                                bgcolor: puntedCategories.includes(cat.key) 
                                    ? 'rgba(46, 125, 50, 0.08)' 
                                    : 'transparent',
                                borderRadius: 1,
                                px: 1,
                                m: 0,
                                transition: 'background-color 0.2s',
                            }}
                        />
                    ))}
                </Box>
                {puntedCategories.length > 0 && (
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            mt: 2,
                            color: '#666',
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Rankings adjusted to exclude: {PUNT_CATEGORIES.filter(c => puntedCategories.includes(c.key)).map(c => c.label).join(', ')}
                    </Typography>
                )}
                
                {/* Team Impact Display */}
                {teamImpact && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            bgcolor: teamImpact.totalValueChange >= 0 
                                ? 'rgba(46, 125, 50, 0.08)' 
                                : 'rgba(198, 40, 40, 0.08)',
                            borderRadius: 2,
                            border: `2px solid ${teamImpact.totalValueChange >= 0 ? '#2e7d32' : '#c62828'}`,
                            transition: 'all 0.3s ease',
                            animation: 'slideIn 0.4s ease-out',
                            '@keyframes slideIn': {
                                '0%': {
                                    opacity: 0,
                                    transform: 'translateY(-10px)',
                                },
                                '100%': {
                                    opacity: 1,
                                    transform: 'translateY(0)',
                                },
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: '"Roboto Mono", monospace',
                                    color: teamImpact.totalValueChange >= 0 ? '#2e7d32' : '#c62828',
                                    fontWeight: 'bold',
                                }}
                            >
                                ⭐ Your Team Impact
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            <Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontFamily: '"Roboto Mono", monospace',
                                        color: '#666',
                                        display: 'block',
                                    }}
                                >
                                    Total Value Change
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontFamily: '"Roboto Mono", monospace',
                                        fontWeight: 'bold',
                                        color: teamImpact.totalValueChange >= 0 ? '#2e7d32' : '#c62828',
                                    }}
                                >
                                    {teamImpact.totalValueChange >= 0 ? '+' : ''}{teamImpact.totalValueChange}
                                </Typography>
                            </Box>
                            
                            <Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontFamily: '"Roboto Mono", monospace',
                                        color: '#666',
                                        display: 'block',
                                    }}
                                >
                                    Avg per Player
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontFamily: '"Roboto Mono", monospace',
                                        fontWeight: 'bold',
                                        color: teamImpact.avgValueChange >= 0 ? '#2e7d32' : '#c62828',
                                    }}
                                >
                                    {teamImpact.avgValueChange >= 0 ? '+' : ''}{teamImpact.avgValueChange}
                                </Typography>
                            </Box>
                            
                            <Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontFamily: '"Roboto Mono", monospace',
                                        color: '#666',
                                        display: 'block',
                                    }}
                                >
                                    Players
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: '"Roboto Mono", monospace',
                                        fontWeight: 'bold',
                                        color: '#212121',
                                    }}
                                >
                                    <span style={{ color: '#2e7d32' }}>↑{teamImpact.playersImproved}</span>
                                    {' / '}
                                    <span style={{ color: '#c62828' }}>↓{teamImpact.playersDeclined}</span>
                                    {' / '}
                                    {teamImpact.totalPlayers}
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                mt: 1.5,
                                color: '#666',
                                fontFamily: '"Roboto Mono", monospace',
                                fontStyle: 'italic',
                            }}
                        >
                            {teamImpact.totalValueChange >= 0 
                                ? '✓ This punt strategy benefits your team!' 
                                : '✗ This punt strategy hurts your team.'}
                        </Typography>
                    </Box>
                )}
            </Box>

            {adjustedPlayers.length === 0 && !loading ? (
                <Box
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        bgcolor: '#ffffff',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#1976d2',
                            fontFamily: '"Roboto Mono", monospace',
                            mb: 2,
                        }}
                    >
                        No data available for {getPeriodLabel(periodType)}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#666',
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Period averages need to be calculated by running the calculate-period-averages function.
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        overflowX: 'auto',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        bgcolor: '#ffffff',
                        transition: 'all 0.3s ease',
                        opacity: isAdjusting ? 0.85 : 1,
                        transform: isAdjusting ? 'scale(0.995)' : 'scale(1)',
                        animation: puntedCategories.length > 0 && !isAdjusting ? 'fadeIn 0.4s ease-in-out' : 'none',
                        '@keyframes fadeIn': {
                            '0%': {
                                opacity: 0.7,
                            },
                            '100%': {
                                opacity: 1,
                            },
                        },
                    }}
                >
                    <TableContainer
                    sx={{
                        maxHeight: '78vh',
                        '&::-webkit-scrollbar': {
                            height: 10,
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#e0e0e0',
                            borderRadius: 5,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#2e7d32',
                            borderRadius: 5,
                            '&:hover': {
                                background: '#4caf50',
                            },
                        },
                    }}
                >
                    <Table size="small" stickyHeader sx={{ minWidth: 2400 }}>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align || 'center'}
                                        sx={{
                                            bgcolor: '#f5f5f5',
                                            color: '#1976d2',
                                            fontFamily: '"Roboto Mono", monospace',
                                            fontWeight: 'bold',
                                            fontSize: '0.82rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.8px',
                                            borderBottom: '2px solid rgba(165, 214, 167, 0.2)',
                                            py: 1.5,
                                        }}
                                    >
                                        {column.sortable ? (
                                            <TableSortLabel
                                                active={orderBy === column.id}
                                                direction={orderBy === column.id ? order : 'desc'}
                                                onClick={() => handleSort(column.id)}
                                                sx={{
                                                    color: '#1976d2 !important',
                                                    '&.Mui-active': {
                                                        color: '#2e7d32 !important',
                                                    },
                                                    '& .MuiTableSortLabel-icon': {
                                                        color: '#2e7d32 !important',
                                                    },
                                                    '&:hover': {
                                                        color: '#4caf50 !important',
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
                            {adjustedPlayers.map((player, index) => {
                                const isMyPlayer = isUserTeamPlayer(player);
                                const displayRank = puntedCategories.length > 0 ? player.adjustedRank : (index + 1);
                                const hasMovedUp = player.rankChange > 0;
                                const hasMovedDown = player.rankChange < 0;
                                
                                return (
                                <TableRow
                                    key={player.id}
                                    sx={{
                                        '&:nth-of-type(odd)': {
                                            bgcolor: isMyPlayer 
                                                ? 'rgba(25, 118, 210, 0.05)' 
                                                : '#fafafa',
                                        },
                                        '&:nth-of-type(even)': {
                                            bgcolor: isMyPlayer 
                                                ? 'rgba(25, 118, 210, 0.08)' 
                                                : '#ffffff',
                                        },
                                        borderLeft: isMyPlayer ? '4px solid #1976d2' : 'none',
                                        borderRight: isMyPlayer ? '4px solid #1976d2' : 'none',
                                        '&:hover': {
                                            bgcolor: isMyPlayer
                                                ? 'rgba(25, 118, 210, 0.08) !important'
                                                : 'rgba(0, 0, 0, 0.04) !important',
                                            transform: 'translateY(-1px)',
                                            boxShadow: isMyPlayer
                                                ? '0 4px 12px rgba(25, 118, 210, 0.2)'
                                                : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        },
                                        transition: 'all 0.25s ease',
                                    }}
                                >
                                    {columns.map((column) => {
                                        let value = column.id === 'rank' ? displayRank : player[column.id];
                                        let bgColor = getColorForValue(value, column.id);
                                        let textColor = getTextColor(bgColor);
                                        
                                        // Override colors for punt-specific columns
                                        if (column.id === 'adjustedTotalValue') {
                                            value = player.adjustedTotalValue;
                                            bgColor = getColorForValue(value, 'total_value');
                                        } else if (column.id === 'valueChange') {
                                            value = player.valueChange;
                                            bgColor = value > 0 ? 'rgba(165, 214, 167, 0.5)' : value < 0 ? 'rgba(198, 40, 40, 0.3)' : 'transparent';
                                        } else if (column.id === 'rankChange') {
                                            value = player.rankChange;
                                            bgColor = hasMovedUp ? 'rgba(165, 214, 167, 0.5)' : hasMovedDown ? 'rgba(198, 40, 40, 0.3)' : 'transparent';
                                        }
                                        
                                        // Gray out punted categories
                                        if (puntedCategories.includes(column.id)) {
                                            bgColor = 'rgba(0, 0, 0, 0.05)';
                                            textColor = '#999';
                                        }

                                        return (
                                            <TableCell
                                                key={column.id}
                                                align={column.align || 'center'}
                                                sx={{
                                                    bgcolor: bgColor,
                                                    color: textColor,
                                                    fontFamily: '"Roboto Mono", monospace',
                                                    fontSize: '0.8rem',
                                                    fontWeight: column.id === 'player_name' ? 'bold' : column.id === 'rank' ? 'bold' : 'medium',
                                                    transition: 'all 0.3s ease',
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                                                }}
                                            >
                                                {column.id === 'rank' ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                        <Typography sx={{ 
                                                            fontWeight: 'bold', 
                                                            color: '#1976d2',
                                                        }}>
                                                            {value}
                                                        </Typography>
                                                        {puntedCategories.length > 0 && player.originalRank !== displayRank && (
                                                            <Typography sx={{ 
                                                                fontSize: '0.7rem',
                                                                color: '#999',
                                                            }}>
                                                                ({player.originalRank})
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                ) : column.id === 'player_name' ? (
                                                    <Typography sx={{ 
                                                        fontWeight: 'bold', 
                                                        color: isMyPlayer ? '#1976d2' : '#1976d2',
                                                        textShadow: 'none',
                                                    }}>
                                                        {isMyPlayer && '⭐ '}
                                                        {value}
                                                    </Typography>
                                                ) : column.id === 'rankChange' ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                        {value > 0 && <span style={{ color: '#2e7d32' }}>↑</span>}
                                                        {value < 0 && <span style={{ color: '#c62828' }}>↓</span>}
                                                        <Typography sx={{ 
                                                            fontWeight: 'bold',
                                                            color: value > 0 ? '#2e7d32' : value < 0 ? '#c62828' : '#666',
                                                        }}>
                                                            {value > 0 ? `+${value}` : value}
                                                        </Typography>
                                                    </Box>
                                                ) : column.id === 'valueChange' ? (
                                                    <Typography sx={{ 
                                                        fontWeight: 'bold',
                                                        color: value > 0 ? '#2e7d32' : value < 0 ? '#c62828' : '#666',
                                                    }}>
                                                        {value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2)}
                                                    </Typography>
                                                ) : column.id === 'adjustedTotalValue' ? (
                                                    <Typography sx={{ 
                                                        fontWeight: 'bold',
                                                    }}>
                                                        {value.toFixed(2)}
                                                    </Typography>
                                                ) : (
                                                    formatValue(value, column.id)
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

            <Typography
                variant="caption"
                sx={{
                    display: 'block',
                    textAlign: 'center',
                    mt: 2,
                    color: '#424242',
                    fontFamily: '"Roboto Mono", monospace',
                    opacity: 0.7,
                }}
            >
                {adjustedPlayers.length > 0 ? 'Scroll horizontally to view all stats ↔' : ''}
            </Typography>
        </Box>
    );
};

export default Rankings;