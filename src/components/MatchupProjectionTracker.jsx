import React, { useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Menu,
    MenuItem,
    Tooltip,
} from "@mui/material";

const MatchupProjectionTracker = ({ 
    matchupProjection, 
    currentMatchup, 
    onPlayerStatusChange,
    isConnected 
}) => {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [playerStatusMenu, setPlayerStatusMenu] = useState(null);
    const [selectedPlayerForMenu, setSelectedPlayerForMenu] = useState(null);

    const handlePlayerClick = (event, player, dateStr) => {
        setPlayerStatusMenu(event.currentTarget);
        setSelectedPlayerForMenu({ ...player, dateStr });
    };

    const handleClosePlayerMenu = () => {
        setPlayerStatusMenu(null);
        setSelectedPlayerForMenu(null);
    };

    const handlePlayerStatusChange = (newStatus) => {
        if (!selectedPlayerForMenu) return;
        const dateStr = selectedPlayerForMenu.dateStr;
        onPlayerStatusChange(selectedPlayerForMenu.id, newStatus, dateStr);
        handleClosePlayerMenu();
    };

    if (!isConnected) {
        return (
            <Box sx={{ mt: 4, p: 4, bgcolor: "#252525", borderRadius: 1, textAlign: 'center' }}>
                <Typography
                    variant="h6"
                    sx={{
                        color: "#b0bec5",
                        fontFamily: '"Roboto Mono", monospace',
                        mb: 2
                    }}
                >
                    Matchup Projection Tracker (Week {currentMatchup?.week || 'N/A'})
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: "#666",
                        fontFamily: '"Roboto Mono", monospace',
                        fontStyle: 'italic'
                    }}
                >
                    Connect to Yahoo account to see projected matchup results
                </Typography>
            </Box>
        );
    }

    if (!matchupProjection) return null;

    return (
        <>
            <Box sx={{ mt: 4, p: 2, bgcolor: "#252525", borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "bold",
                            color: "#4a90e2",
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Weekly Matchup Projection
                    </Typography>
                    <Tooltip
                        title="If players give their average stats for the rest of the week, how will the week end?"
                        arrow
                    >
                        <Box 
                            sx={{ 
                                bgcolor: '#333', 
                                borderRadius: '50%', 
                                width: 20, 
                                height: 20, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '0.75rem',
                                color: '#4a90e2',
                                fontWeight: 'bold',
                                border: '1px solid #4a90e2'
                            }}
                        >
                            i
                        </Box>
                    </Tooltip>
                </Box>
                <Typography
                    variant="body2"
                    sx={{
                        mb: 3,
                        textAlign: "center",
                        color: "#b0bec5",
                        fontFamily: '"Roboto Mono", monospace',
                    }}
                >
                    {matchupProjection.weekStart} - {matchupProjection.weekEnd} (Today: {matchupProjection.currentDate})
                </Typography>
                
                {/* Projected Score Display */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#b0bec5",
                            fontFamily: '"Roboto Mono", monospace',
                            mb: 1
                        }}
                    >
                        PROJECTED FINAL SCORE
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            color: "#e0e0e0",
                            fontFamily: '"Roboto Mono", monospace',
                            fontWeight: 'bold',
                            mb: 1
                        }}
                    >
                        {matchupProjection.team1Score} - {matchupProjection.team2Score}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#4CAF50",
                                fontFamily: '"Roboto Mono", monospace',
                                fontWeight: 'bold'
                            }}
                        >
                            {matchupProjection.team1.name}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#b0bec5",
                                fontFamily: '"Roboto Mono", monospace',
                            }}
                        >
                            vs
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: matchupProjection.team2Score > matchupProjection.team1Score ? "#ff6f61" : matchupProjection.team2Score < matchupProjection.team1Score ? "#666" : "#b0bec5",
                                fontFamily: '"Roboto Mono", monospace',
                                fontWeight: 'bold'
                            }}
                        >
                            {matchupProjection.team2.name}
                        </Typography>
                    </Box>
                </Box>

                {/* Day-by-Day Stats Breakdown */}
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: "#b0bec5", fontFamily: '"Roboto Mono", monospace', fontWeight: 'bold' }}>Category</TableCell>
                                {matchupProjection.team1.dailyProjections && matchupProjection.team1.dailyProjections.map((day, idx) => (
                                    <TableCell 
                                        key={idx} 
                                        align="center" 
                                        sx={{ 
                                            color: day.isToday ? "#4a90e2" : "#b0bec5", 
                                            fontFamily: '"Roboto Mono", monospace', 
                                            fontWeight: 'bold', 
                                            fontSize: '0.7rem',
                                            bgcolor: day.isToday ? 'rgba(74, 144, 226, 0.1)' : 'transparent'
                                        }}
                                    >
                                        <Box>{day.dayOfWeek}</Box>
                                        <Box sx={{ fontSize: '0.65rem', color: day.isToday ? '#4a90e2' : '#888' }}>
                                            {day.monthDay}
                                            {day.isToday && ' (Today)'}
                                        </Box>
                                    </TableCell>
                                ))}
                                <TableCell align="center" sx={{ color: "#b0bec5", fontFamily: '"Roboto Mono", monospace', fontWeight: 'bold' }}>Total</TableCell>
                                <TableCell sx={{ color: "#b0bec5", fontFamily: '"Roboto Mono", monospace', fontWeight: 'bold' }}>Winner</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {['points', 'rebounds', 'assists', 'steals', 'blocks', 'threePointers', 'turnovers', 'fieldGoalPercentage', 'freeThrowPercentage'].map((catKey) => {
                                const catLabels = {
                                    points: 'Points',
                                    rebounds: 'Rebounds',
                                    assists: 'Assists',
                                    steals: 'Steals',
                                    blocks: 'Blocks',
                                    threePointers: '3PT',
                                    turnovers: 'TO',
                                    fieldGoalPercentage: 'FG%',
                                    freeThrowPercentage: 'FT%'
                                };
                                
                                const catData = matchupProjection.categoryResults[catKey];
                                if (!catData) return null;
                                
                                const isWin = catData.winner === matchupProjection.team1.name;
                                const isLoss = catData.winner === matchupProjection.team2.name;
                                const bgColor = isWin ? 'rgba(76, 175, 80, 0.1)' : isLoss ? 'rgba(244, 67, 54, 0.1)' : 'rgba(158, 158, 158, 0.05)';
                                const textColor = isWin ? 'rgba(76, 175, 80, 0.9)' : isLoss ? 'rgba(244, 67, 54, 0.9)' : 'rgba(158, 158, 158, 0.8)';
                                const isExpanded = expandedCategory === catKey;
                                const isPct = catKey === 'fieldGoalPercentage' || catKey === 'freeThrowPercentage';
                                
                                return (
                                    <React.Fragment key={catKey}>
                                        <TableRow 
                                            sx={{ 
                                                bgcolor: bgColor,
                                                cursor: 'pointer',
                                                '&:hover': { bgcolor: isWin ? 'rgba(76, 175, 80, 0.15)' : isLoss ? 'rgba(244, 67, 54, 0.15)' : 'rgba(158, 158, 158, 0.1)' }
                                            }}
                                            onClick={() => setExpandedCategory(isExpanded ? null : catKey)}
                                        >
                                            <TableCell sx={{ fontFamily: '"Roboto Mono", monospace', color: "#e0e0e0", fontWeight: 'bold' }}>
                                                {catLabels[catKey]} {isExpanded ? '▼' : '▶'}
                                            </TableCell>
                                            {matchupProjection.team1.dailyProjections.map((day, idx) => (
                                                <TableCell 
                                                    key={idx} 
                                                    align="center" 
                                                    sx={{ 
                                                        fontSize: '0.65rem', 
                                                        py: 0.5,
                                                        bgcolor: day.isToday ? 'rgba(74, 144, 226, 0.05)' : 'transparent'
                                                    }}
                                                >
                                                    {day.isPast ? (
                                                        <Box sx={{ color: '#666' }}>-</Box>
                                                    ) : (
                                                        <>
                                                            <Box sx={{ color: "#4CAF50" }}>
                                                                {isPct 
                                                                    ? `${(day.totals[catKey === 'fieldGoalPercentage' ? 'fieldGoalsMade' : 'freeThrowsMade'] || 0).toFixed(0)}/${(day.totals[catKey === 'fieldGoalPercentage' ? 'fieldGoalsAttempted' : 'freeThrowsAttempted'] || 0).toFixed(0)}`
                                                                    : (day.totals[catKey] || 0).toFixed(1)
                                                                }
                                                            </Box>
                                                            <Box sx={{ color: "#ff6f61" }}>
                                                                {isPct 
                                                                    ? `${(matchupProjection.team2.dailyProjections[idx]?.totals[catKey === 'fieldGoalPercentage' ? 'fieldGoalsMade' : 'freeThrowsMade'] || 0).toFixed(0)}/${(matchupProjection.team2.dailyProjections[idx]?.totals[catKey === 'fieldGoalPercentage' ? 'fieldGoalsAttempted' : 'freeThrowsAttempted'] || 0).toFixed(0)}`
                                                                    : (matchupProjection.team2.dailyProjections[idx]?.totals[catKey] || 0).toFixed(1)
                                                                }
                                                            </Box>
                                                        </>
                                                    )}
                                                </TableCell>
                                            ))}
                                            <TableCell align="center">
                                                <Box sx={{ color: "#4CAF50", fontWeight: 'bold' }}>
                                                    {isPct 
                                                        ? `${(catData.team1Made || 0).toFixed(0)}/${(catData.team1Attempted || 0).toFixed(0)} (${catData.team1Attempted > 0 ? ((catData.team1Made / catData.team1Attempted) * 100).toFixed(1) : 0}%)`
                                                        : (catData.team1 || 0).toFixed(1)
                                                    }
                                                </Box>
                                                <Box sx={{ color: "#ff6f61", fontWeight: 'bold' }}>
                                                    {isPct 
                                                        ? `${(catData.team2Made || 0).toFixed(0)}/${(catData.team2Attempted || 0).toFixed(0)} (${catData.team2Attempted > 0 ? ((catData.team2Made / catData.team2Attempted) * 100).toFixed(1) : 0}%)`
                                                        : (catData.team2 || 0).toFixed(1)
                                                    }
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontFamily: '"Roboto Mono", monospace', fontWeight: 'bold', fontSize: '0.75rem' }} style={{ color: textColor }}>
                                                    {isWin ? matchupProjection.team1.name.split(' ')[0] : isLoss ? matchupProjection.team2.name.split(' ')[0] : 'TIE'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        {isExpanded && (
                                            <TableRow>
                                                <TableCell colSpan={10} sx={{ bgcolor: '#1a1a1a', p: 2 }}>
                                                    <Grid container spacing={2}>
                                                        {matchupProjection.team1.dailyProjections.map((day, idx) => {
                                                            if (day.isPast || (day.players.length === 0 && matchupProjection.team2.dailyProjections[idx]?.players.length === 0)) return null;
                                                            const team2Day = matchupProjection.team2.dailyProjections[idx];
                                                            
                                                            return (
                                                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                                                    <Box sx={{ bgcolor: '#252525', p: 1.5, borderRadius: 1, border: day.isToday ? '2px solid #4a90e2' : '1px solid #333' }}>
                                                                        <Typography variant="caption" sx={{ color: day.isToday ? '#4a90e2' : '#888', fontWeight: 'bold', display: 'block', mb: 1, textAlign: 'center' }}>
                                                                            {day.dayOfWeek} {day.monthDay} {day.isToday ? '(Today)' : ''}
                                                                        </Typography>
                                                                        <Box sx={{ mb: 1.5 }}>
                                                                            <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                                                                                {matchupProjection.team1.name}
                                                                            </Typography>
                                                                            {day.players.length > 0 ? day.players.map((player, pidx) => {
                                                                                const statValue = isPct 
                                                                                    ? `${(player.stats[catKey === 'fieldGoalPercentage' ? 'fieldGoalsMade' : 'freeThrowsMade'] || 0).toFixed(1)}/${(player.stats[catKey === 'fieldGoalPercentage' ? 'fieldGoalsAttempted' : 'freeThrowsAttempted'] || 0).toFixed(1)}`
                                                                                    : (player.stats[catKey] || 0).toFixed(1);
                                                                                
                                                                                const isDisabled = player.disabled;
                                                                                const statusText = player.status ? ` [${player.status}]` : '';
                                                                                const posText = player.selectedPosition && (player.selectedPosition === 'IL' || player.selectedPosition === 'IL+') ? ` [${player.selectedPosition}]` : '';
                                                                                
                                                                                return (
                                                                                    <Typography 
                                                                                        key={pidx} 
                                                                                        variant="caption" 
                                                                                        onMouseDown={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handlePlayerClick(e, player, day.date);
                                                                                        }}
                                                                                        sx={{ 
                                                                                            color: isDisabled ? '#666' : '#4CAF50', 
                                                                                            display: 'block', 
                                                                                            fontSize: '0.7rem', 
                                                                                            ml: 1,
                                                                                            cursor: 'pointer',
                                                                                            textDecoration: isDisabled ? 'line-through' : 'none',
                                                                                            opacity: isDisabled ? 0.6 : 1,
                                                                                            userSelect: 'none',
                                                                                            WebkitUserSelect: 'none',
                                                                                            '&:hover': {
                                                                                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                                                                borderRadius: '4px',
                                                                                                px: 0.5
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        • {player.name}{statusText}{posText}: {statValue}
                                                                                    </Typography>
                                                                                );
                                                                            }) : (
                                                                                <Typography variant="caption" sx={{ color: '#666', display: 'block', fontSize: '0.7rem', ml: 1 }}>
                                                                                    No games
                                                                                </Typography>
                                                                            )}
                                                                        </Box>
                                                                        <Box>
                                                                            <Typography variant="caption" sx={{ color: '#ff6f61', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                                                                                {matchupProjection.team2.name}
                                                                            </Typography>
                                                                            {team2Day && team2Day.players.length > 0 ? team2Day.players.map((player, pidx) => {
                                                                                const statValue = isPct 
                                                                                    ? `${(player.stats[catKey === 'fieldGoalPercentage' ? 'fieldGoalsMade' : 'freeThrowsMade'] || 0).toFixed(1)}/${(player.stats[catKey === 'fieldGoalPercentage' ? 'fieldGoalsAttempted' : 'freeThrowsAttempted'] || 0).toFixed(1)}`
                                                                                    : (player.stats[catKey] || 0).toFixed(1);
                                                                                
                                                                                const isDisabled = player.disabled;
                                                                                const statusText = player.status ? ` [${player.status}]` : '';
                                                                                const posText = player.selectedPosition && (player.selectedPosition === 'IL' || player.selectedPosition === 'IL+') ? ` [${player.selectedPosition}]` : '';
                                                                                
                                                                                return (
                                                                                    <Typography 
                                                                                        key={pidx} 
                                                                                        variant="caption" 
                                                                                        onMouseDown={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handlePlayerClick(e, player, day.date);
                                                                                        }}
                                                                                        sx={{ 
                                                                                            color: isDisabled ? '#666' : '#ff6f61', 
                                                                                            display: 'block', 
                                                                                            fontSize: '0.7rem', 
                                                                                            ml: 1,
                                                                                            userSelect: 'none',
                                                                                            WebkitUserSelect: 'none',
                                                                                            cursor: 'pointer',
                                                                                            textDecoration: isDisabled ? 'line-through' : 'none',
                                                                                            opacity: isDisabled ? 0.6 : 1,
                                                                                            '&:hover': {
                                                                                                bgcolor: 'rgba(255, 111, 97, 0.1)',
                                                                                                borderRadius: '4px',
                                                                                                px: 0.5
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        • {player.name}{statusText}{posText}: {statValue}
                                                                                    </Typography>
                                                                                );
                                                                            }) : (
                                                                                <Typography variant="caption" sx={{ color: '#666', display: 'block', fontSize: '0.7rem', ml: 1 }}>
                                                                                    No games
                                                                                </Typography>
                                                                            )}
                                                                        </Box>
                                                                    </Box>
                                                                </Grid>
                                                            );
                                                        })}
                                                    </Grid>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Player Status Menu */}
            <Menu
                anchorEl={playerStatusMenu}
                open={Boolean(playerStatusMenu)}
                onClose={handleClosePlayerMenu}
                onClick={(e) => e.stopPropagation()}
                PaperProps={{
                    sx: {
                        bgcolor: '#252525',
                        border: '1px solid #333',
                        minWidth: 200,
                        zIndex: 9999
                    }
                }}
                MenuListProps={{
                    onClick: (e) => e.stopPropagation()
                }}
            >
                <MenuItem 
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePlayerStatusChange('enabled');
                    }}
                    sx={{ 
                        color: '#e0e0e0',
                        py: 1.5,
                        '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.2)' },
                        '&:active': { bgcolor: 'rgba(76, 175, 80, 0.3)' }
                    }}
                >
                    ✓ Enable Player
                </MenuItem>
                <MenuItem 
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePlayerStatusChange('disabledForDay');
                    }}
                    sx={{ 
                        color: '#e0e0e0',
                        py: 1.5,
                        '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.2)' },
                        '&:active': { bgcolor: 'rgba(255, 152, 0, 0.3)' }
                    }}
                >
                    ⊗ Disable for Day
                </MenuItem>
                <MenuItem 
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePlayerStatusChange('disabledForWeek');
                    }}
                    sx={{ 
                        color: '#e0e0e0',
                        py: 1.5,
                        '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' },
                        '&:active': { bgcolor: 'rgba(244, 67, 54, 0.3)' }
                    }}
                >
                    ✗ Disable for Week
                </MenuItem>
            </Menu>
        </>
    );
};

export default MatchupProjectionTracker;

