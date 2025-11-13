import React, { useState, useEffect, useMemo } from 'react';
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
} from '@mui/material';
import { supabase, CURRENT_SEASON } from '../utils/supabase';
import { useLeague } from '../contexts/LeagueContext';

const Rankings = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
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
    const isUserTeamPlayer = (player) => {
        return userTeamPlayerIds.has(player.player_id);
    };

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const { data, error } = await supabase
                    .from('player_season_averages')
                    .select('*')
                    .eq('season', CURRENT_SEASON)
                    .limit(200)
                    .order(orderBy, { ascending: order === 'asc' });

                if (error) throw error;
                setPlayers(data || []);
            } catch (error) {
                console.error('Error fetching player rankings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, [orderBy, order]);

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

    const columns = [
        { id: 'rank', label: '#', sortable: false, align: 'center' },
        { id: 'player_name', label: 'Player', sortable: true, align: 'left' },
        { id: 'team_abbreviation', label: 'Team', sortable: true },
        { id: 'total_value', label: 'Total Value', sortable: true },

        // Z-scores first
        { id: 'points_z', label: 'PTS Z', sortable: true },
        { id: 'rebounds_z', label: 'REB Z', sortable: true },
        { id: 'assists_z', label: 'AST Z', sortable: true },
        { id: 'steals_z', label: 'STL Z', sortable: true },
        { id: 'blocks_z', label: 'BLK Z', sortable: true },
        { id: 'three_pointers_z', label: '3PM Z', sortable: true },
        { id: 'fg_percentage_z', label: 'FG% Z', sortable: true },
        { id: 'ft_percentage_z', label: 'FT% Z', sortable: true },
        { id: 'turnovers_z', label: 'TO Z', sortable: true },

        // Raw stats after
        { id: 'points_per_game', label: 'PTS', sortable: true },
        { id: 'rebounds_per_game', label: 'REB', sortable: true },
        { id: 'assists_per_game', label: 'AST', sortable: true },
        { id: 'steals_per_game', label: 'STL', sortable: true },
        { id: 'blocks_per_game', label: 'BLK', sortable: true },
        { id: 'three_pointers_per_game', label: '3PM', sortable: true },
        { id: 'field_goal_percentage', label: 'FG%', sortable: true },
        { id: 'free_throw_percentage', label: 'FT%', sortable: true },
        { id: 'turnovers_per_game', label: 'TO', sortable: true },
    ];

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

    return (
        <Box
            sx={{
                p: { xs: 1, md: 3 },
                minHeight: '100vh',
                overflow: 'hidden',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    mb: 4,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#1976d2',
                    textShadow: 'none',
                    fontFamily: '"Roboto Mono", monospace',
                    letterSpacing: '0.5px',
                }}
            >
                Player Rankings {CURRENT_SEASON}
            </Typography>

            <Box
                sx={{
                    overflowX: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    bgcolor: '#ffffff',
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
                            {players.map((player, index) => {
                                const isMyPlayer = isUserTeamPlayer(player);
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
                                        const value = column.id === 'rank' ? index + 1 : player[column.id];
                                        const bgColor = getColorForValue(value, column.id);
                                        const textColor = getTextColor(bgColor);

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
                                                    transition: 'background-color 0.4s ease',
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                                                }}
                                            >
                                                {column.id === 'rank' ? (
                                                    <Typography sx={{ 
                                                        fontWeight: 'bold', 
                                                        color: '#1976d2',
                                                    }}>
                                                        {value}
                                                    </Typography>
                                                ) : column.id === 'player_name' ? (
                                                    <Typography sx={{ 
                                                        fontWeight: 'bold', 
                                                        color: isMyPlayer ? '#1976d2' : '#1976d2',
                                                        textShadow: 'none',
                                                    }}>
                                                        {isMyPlayer && '⭐ '}
                                                        {value}
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
                Scroll horizontally to view all stats ↔
            </Typography>
        </Box>
    );
};

export default Rankings;