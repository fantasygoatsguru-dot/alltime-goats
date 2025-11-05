import React, { useState, useMemo } from "react";
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

    // Recalculate accurate score based on Yahoo stats + projected stats
    const accurateScore = useMemo(() => {
        if (!matchupProjection || !currentMatchup) {
            return { team1Score: 0, team2Score: 0 };
        }
        let team1Score = 0;
        let team2Score = 0;

        const categories = ['points', 'rebounds', 'assists', 'steals', 'blocks', 'threePointers', 'turnovers', 'fieldGoalPercentage', 'freeThrowPercentage'];
        const yahooCategoryMap = {
            points: 'Points',
            rebounds: 'Rebounds',
            assists: 'Assists',
            steals: 'Steals',
            blocks: 'Blocks',
            threePointers: 'Three Pointers Made',
            turnovers: 'Turnovers',
            fieldGoalPercentage: 'Field Goal Percentage',
            freeThrowPercentage: 'Free Throw Percentage'
        };

        categories.forEach(catKey => {
            const catData = matchupProjection.categoryResults[catKey];
            if (!catData) return;

            const isPct = catKey === 'fieldGoalPercentage' || catKey === 'freeThrowPercentage';
            const yahooCategoryName = yahooCategoryMap[catKey];
            const yahooStats = currentMatchup?.stats?.categories?.[yahooCategoryName];

            // Calculate projected stats for remaining days
            let team1Projected = 0, team2Projected = 0;
            let team1ProjectedMade = 0, team1ProjectedAttempted = 0;
            let team2ProjectedMade = 0, team2ProjectedAttempted = 0;

            matchupProjection.team1.dailyProjections.forEach((day, idx) => {
                if (!day.isPast && day.totals) {
                    if (isPct) {
                        if (catKey === 'fieldGoalPercentage') {
                            team1ProjectedMade += day.totals.fieldGoalsMade || 0;
                            team1ProjectedAttempted += day.totals.fieldGoalsAttempted || 0;
                        } else if (catKey === 'freeThrowPercentage') {
                            team1ProjectedMade += day.totals.freeThrowsMade || 0;
                            team1ProjectedAttempted += day.totals.freeThrowsAttempted || 0;
                        }
                        const team2Day = matchupProjection.team2.dailyProjections[idx];
                        if (team2Day && team2Day.totals) {
                            if (catKey === 'fieldGoalPercentage') {
                                team2ProjectedMade += team2Day.totals.fieldGoalsMade || 0;
                                team2ProjectedAttempted += team2Day.totals.fieldGoalsAttempted || 0;
                            } else if (catKey === 'freeThrowPercentage') {
                                team2ProjectedMade += team2Day.totals.freeThrowsMade || 0;
                                team2ProjectedAttempted += team2Day.totals.freeThrowsAttempted || 0;
                            }
                        }
                    } else {
                        team1Projected += day.totals[catKey] || 0;
                        const team2Day = matchupProjection.team2.dailyProjections[idx];
                        if (team2Day && team2Day.totals) {
                            team2Projected += team2Day.totals[catKey] || 0;
                        }
                    }
                }
            });

            // Calculate total values (Yahoo current + projected future)
            let team1TotalNumeric, team2TotalNumeric;

            if (yahooStats) {
                if (isPct && yahooStats.team1?.nominator !== undefined) {
                    const totalMade1 = yahooStats.team1.nominator + team1ProjectedMade;
                    const totalAttempted1 = yahooStats.team1.denominator + team1ProjectedAttempted;
                    const totalMade2 = (yahooStats.team2?.nominator || 0) + team2ProjectedMade;
                    const totalAttempted2 = (yahooStats.team2?.denominator || 0) + team2ProjectedAttempted;
                    
                    team1TotalNumeric = totalAttempted1 > 0 ? (totalMade1 / totalAttempted1) * 100 : 0;
                    team2TotalNumeric = totalAttempted2 > 0 ? (totalMade2 / totalAttempted2) * 100 : 0;
                } else if (!isPct) {
                    team1TotalNumeric = (parseFloat(yahooStats.team1) || 0) + team1Projected;
                    team2TotalNumeric = (parseFloat(yahooStats.team2) || 0) + team2Projected;
                } else {
                    // Fallback for percentages
                    const made1 = catData.team1Made || 0;
                    const attempted1 = catData.team1Attempted || 0;
                    const made2 = catData.team2Made || 0;
                    const attempted2 = catData.team2Attempted || 0;
                    team1TotalNumeric = attempted1 > 0 ? (made1 / attempted1) * 100 : 0;
                    team2TotalNumeric = attempted2 > 0 ? (made2 / attempted2) * 100 : 0;
                }
            } else {
                // Fallback to calculated if Yahoo stats not available
                if (isPct) {
                    const made1 = catData.team1Made || 0;
                    const attempted1 = catData.team1Attempted || 0;
                    const made2 = catData.team2Made || 0;
                    const attempted2 = catData.team2Attempted || 0;
                    team1TotalNumeric = attempted1 > 0 ? (made1 / attempted1) * 100 : 0;
                    team2TotalNumeric = attempted2 > 0 ? (made2 / attempted2) * 100 : 0;
                } else {
                    team1TotalNumeric = catData.team1 || 0;
                    team2TotalNumeric = catData.team2 || 0;
                }
            }

            // Determine winner based on actual calculated totals
            if (catKey === 'turnovers') {
                // Lower is better for turnovers
                if (team1TotalNumeric < team2TotalNumeric) {
                    team1Score++;
                } else if (team2TotalNumeric < team1TotalNumeric) {
                    team2Score++;
                }
            } else {
                // Higher is better for everything else
                if (team1TotalNumeric > team2TotalNumeric) {
                    team1Score++;
                } else if (team2TotalNumeric > team1TotalNumeric) {
                    team2Score++;
                }
            }
        });

        return { team1Score, team2Score };
    }, [matchupProjection, currentMatchup]);

    if (!isConnected) {
        return (
            <Box sx={{ mt: 4, p: 4, bgcolor: "#f8f9fa", borderRadius: 1, textAlign: 'center', border: "1px solid rgba(0, 0, 0, 0.12)" }}>
                <Typography
                    variant="h6"
                    sx={{
                        color: "#424242",
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
            <Box sx={{ mt: 4, p: 2, bgcolor: "#f8f9fa", borderRadius: 1, border: "1px solid rgba(0, 0, 0, 0.12)" }}>
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
                        color: "#424242",
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
                            color: "#424242",
                            fontFamily: '"Roboto Mono", monospace',
                            mb: 1
                        }}
                    >
                        PROJECTED FINAL SCORE
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            color: "#212121",
                            fontFamily: '"Roboto Mono", monospace',
                            fontWeight: 'bold',
                            mb: 1
                        }}
                    >
                        {accurateScore.team1Score} - {accurateScore.team2Score}
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
                                color: "#424242",
                                fontFamily: '"Roboto Mono", monospace',
                            }}
                        >
                            vs
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: accurateScore.team2Score > accurateScore.team1Score ? "#ff6f61" : accurateScore.team2Score < accurateScore.team1Score ? "#666" : "#b0bec5",
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
                                <TableCell 
                                    align="center" 
                                    sx={{ 
                                        color: "#9c27b0", 
                                        fontFamily: '"Roboto Mono", monospace', 
                                        fontWeight: 'bold', 
                                        fontSize: '0.7rem',
                                        bgcolor: 'rgba(156, 39, 176, 0.1)'
                                    }}
                                >
                                    <Box>Current</Box>
                                    <Box sx={{ fontSize: '0.65rem', color: '#9c27b0' }}>
                                        So Far
                                    </Box>
                                </TableCell>
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
                                
                                const isExpanded = expandedCategory === catKey;
                                const isPct = catKey === 'fieldGoalPercentage' || catKey === 'freeThrowPercentage';
                                
                                // Map internal category keys to Yahoo category names
                                const yahooCategoryMap = {
                                    points: 'Points',
                                    rebounds: 'Rebounds',
                                    assists: 'Assists',
                                    steals: 'Steals',
                                    blocks: 'Blocks',
                                    threePointers: 'Three Pointers Made',
                                    turnovers: 'Turnovers',
                                    fieldGoalPercentage: 'Field Goal Percentage',
                                    freeThrowPercentage: 'Free Throw Percentage'
                                };
                                
                                // Get actual stats from Yahoo (currentMatchup.stats.categories)
                                const yahooCategoryName = yahooCategoryMap[catKey];
                                const yahooStats = currentMatchup?.stats?.categories?.[yahooCategoryName];
                                
                                // Calculate projected stats for remaining days
                                let team1Projected = 0, team2Projected = 0;
                                let team1ProjectedMade = 0, team1ProjectedAttempted = 0;
                                let team2ProjectedMade = 0, team2ProjectedAttempted = 0;
                                
                                matchupProjection.team1.dailyProjections.forEach((day, idx) => {
                                    if (!day.isPast && day.totals) {
                                        if (isPct) {
                                            if (catKey === 'fieldGoalPercentage') {
                                                team1ProjectedMade += day.totals.fieldGoalsMade || 0;
                                                team1ProjectedAttempted += day.totals.fieldGoalsAttempted || 0;
                                            } else if (catKey === 'freeThrowPercentage') {
                                                team1ProjectedMade += day.totals.freeThrowsMade || 0;
                                                team1ProjectedAttempted += day.totals.freeThrowsAttempted || 0;
                                            }
                                            const team2Day = matchupProjection.team2.dailyProjections[idx];
                                            if (team2Day && team2Day.totals) {
                                                if (catKey === 'fieldGoalPercentage') {
                                                    team2ProjectedMade += team2Day.totals.fieldGoalsMade || 0;
                                                    team2ProjectedAttempted += team2Day.totals.fieldGoalsAttempted || 0;
                                                } else if (catKey === 'freeThrowPercentage') {
                                                    team2ProjectedMade += team2Day.totals.freeThrowsMade || 0;
                                                    team2ProjectedAttempted += team2Day.totals.freeThrowsAttempted || 0;
                                                }
                                            }
                                        } else {
                                            team1Projected += day.totals[catKey] || 0;
                                            const team2Day = matchupProjection.team2.dailyProjections[idx];
                                            if (team2Day && team2Day.totals) {
                                                team2Projected += team2Day.totals[catKey] || 0;
                                            }
                                        }
                                    }
                                });
                                
                                // Calculate total values (Yahoo current + projected future)
                                let team1TotalNumeric, team2TotalNumeric;
                                
                                if (yahooStats) {
                                    if (isPct && yahooStats.team1?.nominator !== undefined) {
                                        const totalMade1 = yahooStats.team1.nominator + team1ProjectedMade;
                                        const totalAttempted1 = yahooStats.team1.denominator + team1ProjectedAttempted;
                                        const totalMade2 = (yahooStats.team2?.nominator || 0) + team2ProjectedMade;
                                        const totalAttempted2 = (yahooStats.team2?.denominator || 0) + team2ProjectedAttempted;
                                        
                                        team1TotalNumeric = totalAttempted1 > 0 ? (totalMade1 / totalAttempted1) * 100 : 0;
                                        team2TotalNumeric = totalAttempted2 > 0 ? (totalMade2 / totalAttempted2) * 100 : 0;
                                    } else if (!isPct) {
                                        team1TotalNumeric = (parseFloat(yahooStats.team1) || 0) + team1Projected;
                                        team2TotalNumeric = (parseFloat(yahooStats.team2) || 0) + team2Projected;
                                    } else {
                                        // Fallback for percentages
                                        const made1 = catData.team1Made || 0;
                                        const attempted1 = catData.team1Attempted || 0;
                                        const made2 = catData.team2Made || 0;
                                        const attempted2 = catData.team2Attempted || 0;
                                        team1TotalNumeric = attempted1 > 0 ? (made1 / attempted1) * 100 : 0;
                                        team2TotalNumeric = attempted2 > 0 ? (made2 / attempted2) * 100 : 0;
                                    }
                                } else {
                                    // Fallback to calculated if Yahoo stats not available
                                    if (isPct) {
                                        const made1 = catData.team1Made || 0;
                                        const attempted1 = catData.team1Attempted || 0;
                                        const made2 = catData.team2Made || 0;
                                        const attempted2 = catData.team2Attempted || 0;
                                        team1TotalNumeric = attempted1 > 0 ? (made1 / attempted1) * 100 : 0;
                                        team2TotalNumeric = attempted2 > 0 ? (made2 / attempted2) * 100 : 0;
                                    } else {
                                        team1TotalNumeric = catData.team1 || 0;
                                        team2TotalNumeric = catData.team2 || 0;
                                    }
                                }
                                
                                // Determine winner based on actual calculated totals
                                let isWin, isLoss;
                                if (catKey === 'turnovers') {
                                    // Lower is better for turnovers
                                    isWin = team1TotalNumeric < team2TotalNumeric;
                                    isLoss = team2TotalNumeric < team1TotalNumeric;
                                } else {
                                    // Higher is better for everything else
                                    isWin = team1TotalNumeric > team2TotalNumeric;
                                    isLoss = team2TotalNumeric > team1TotalNumeric;
                                }
                                
                                // Calculate margin intensity (0-1) based on how close the category is
                                let marginIntensity = 0;
                                if (isWin || isLoss) {
                                    const diff = Math.abs(team1TotalNumeric - team2TotalNumeric);
                                    const average = (team1TotalNumeric + team2TotalNumeric) / 2;
                                    
                                    if (average > 0) {
                                        // For percentages and large numbers, use percentage difference
                                        if (isPct || average > 10) {
                                            // Calculate percentage difference
                                            marginIntensity = Math.min(diff / Math.max(average, 0.1), 1);
                                        } else {
                                            // For small numbers, use absolute difference normalized
                                            // Scale based on typical ranges for each category
                                            const typicalRange = {
                                                points: 100,
                                                rebounds: 50,
                                                assists: 30,
                                                steals: 10,
                                                blocks: 10,
                                                threePointers: 20,
                                                turnovers: 10
                                            };
                                            const range = typicalRange[catKey] || 50;
                                            marginIntensity = Math.min(diff / range, 1);
                                        }
                                    }
                                    
                                    // Normalize intensity: map to 0.3-1.0 range for better visual distinction
                                    // Close categories (0-20% diff) -> 0.3 intensity
                                    // Moderate categories (20-50% diff) -> 0.5-0.7 intensity  
                                    // Blowouts (50%+ diff) -> 0.8-1.0 intensity
                                    if (marginIntensity < 0.2) {
                                        marginIntensity = 0.3; // Close categories
                                    } else if (marginIntensity < 0.5) {
                                        marginIntensity = 0.3 + (marginIntensity - 0.2) / 0.3 * 0.3; // 0.3 to 0.6
                                    } else {
                                        marginIntensity = 0.6 + (marginIntensity - 0.5) / 0.5 * 0.4; // 0.6 to 1.0
                                    }
                                }
                                
                                // Calculate color intensity: use different shades based on margin
                                // Close categories: lighter colors, Blowouts: darker/more saturated colors
                                let bgColor, textColor;
                                
                                if (isWin) {
                                    // Green shades: light green for close, dark green for blowouts
                                    if (marginIntensity < 0.4) {
                                        // Close win: light green
                                        bgColor = 'rgba(200, 230, 201, 0.3)';
                                        textColor = 'rgba(76, 175, 80, 0.8)';
                                    } else if (marginIntensity < 0.7) {
                                        // Moderate win: medium green
                                        bgColor = 'rgba(129, 199, 132, 0.4)';
                                        textColor = 'rgba(56, 142, 60, 1)';
                                    } else {
                                        // Blowout: dark green
                                        bgColor = 'rgba(76, 175, 80, 0.5)';
                                        textColor = 'rgba(27, 94, 32, 1)';
                                    }
                                } else if (isLoss) {
                                    // Red shades: light red for close, dark red for blowouts
                                    if (marginIntensity < 0.4) {
                                        // Close loss: light red
                                        bgColor = 'rgba(255, 205, 210, 0.3)';
                                        textColor = 'rgba(244, 67, 54, 0.8)';
                                    } else if (marginIntensity < 0.7) {
                                        // Moderate loss: medium red
                                        bgColor = 'rgba(239, 154, 154, 0.4)';
                                        textColor = 'rgba(211, 47, 47, 1)';
                                    } else {
                                        // Blowout: dark red
                                        bgColor = 'rgba(244, 67, 54, 0.5)';
                                        textColor = 'rgba(183, 28, 28, 1)';
                                    }
                                } else {
                                    // Tie: gray
                                    bgColor = 'rgba(158, 158, 158, 0.05)';
                                    textColor = 'rgba(158, 158, 158, 0.8)';
                                }
                                
                                // Use Yahoo stats if available, otherwise fall back to calculated
                                let team1CurrentValue, team2CurrentValue;
                                if (yahooStats) {
                                    if (isPct && yahooStats.team1?.nominator !== undefined) {
                                        // For percentages, use nominator/denominator from Yahoo
                                        team1CurrentValue = `${yahooStats.team1.nominator}/${yahooStats.team1.denominator}`;
                                        team2CurrentValue = `${yahooStats.team2?.nominator || 0}/${yahooStats.team2?.denominator || 0}`;
                                    } else if (!isPct) {
                                        // For other stats, use the numeric value
                                        team1CurrentValue = yahooStats.team1?.toFixed(1) || '0.0';
                                        team2CurrentValue = yahooStats.team2?.toFixed(1) || '0.0';
                                    } else {
                                        // Fallback for percentages
                                        team1CurrentValue = `${(matchupProjection.team1.actual?.[catKey === 'fieldGoalPercentage' ? 'fieldGoalsMade' : 'freeThrowsMade'] || 0).toFixed(0)}/${(matchupProjection.team1.actual?.[catKey === 'fieldGoalPercentage' ? 'fieldGoalsAttempted' : 'freeThrowsAttempted'] || 0).toFixed(0)}`;
                                        team2CurrentValue = `${(matchupProjection.team2.actual?.[catKey === 'fieldGoalPercentage' ? 'fieldGoalsMade' : 'freeThrowsMade'] || 0).toFixed(0)}/${(matchupProjection.team2.actual?.[catKey === 'fieldGoalPercentage' ? 'fieldGoalsAttempted' : 'freeThrowsAttempted'] || 0).toFixed(0)}`;
                                    }
                                } else {
                                    // Fallback to calculated values if Yahoo stats not available
                                    if (isPct) {
                                        team1CurrentValue = `${(matchupProjection.team1.actual?.[catKey === 'fieldGoalPercentage' ? 'fieldGoalsMade' : 'freeThrowsMade'] || 0).toFixed(0)}/${(matchupProjection.team1.actual?.[catKey === 'fieldGoalPercentage' ? 'fieldGoalsAttempted' : 'freeThrowsAttempted'] || 0).toFixed(0)}`;
                                        team2CurrentValue = `${(matchupProjection.team2.actual?.[catKey === 'fieldGoalPercentage' ? 'fieldGoalsMade' : 'freeThrowsMade'] || 0).toFixed(0)}/${(matchupProjection.team2.actual?.[catKey === 'fieldGoalPercentage' ? 'fieldGoalsAttempted' : 'freeThrowsAttempted'] || 0).toFixed(0)}`;
                                    } else {
                                        team1CurrentValue = (matchupProjection.team1.actual?.[catKey] || 0).toFixed(1);
                                        team2CurrentValue = (matchupProjection.team2.actual?.[catKey] || 0).toFixed(1);
                                    }
                                }
                                
                                // Format total values for display
                                let team1TotalDisplay, team2TotalDisplay;
                                if (isPct && yahooStats?.team1?.nominator !== undefined) {
                                    const totalMade1 = yahooStats.team1.nominator + team1ProjectedMade;
                                    const totalAttempted1 = yahooStats.team1.denominator + team1ProjectedAttempted;
                                    const totalMade2 = (yahooStats.team2?.nominator || 0) + team2ProjectedMade;
                                    const totalAttempted2 = (yahooStats.team2?.denominator || 0) + team2ProjectedAttempted;
                                    team1TotalDisplay = `${totalMade1.toFixed(0)}/${totalAttempted1.toFixed(0)} (${team1TotalNumeric.toFixed(1)}%)`;
                                    team2TotalDisplay = `${totalMade2.toFixed(0)}/${totalAttempted2.toFixed(0)} (${team2TotalNumeric.toFixed(1)}%)`;
                                } else if (isPct) {
                                    const made1 = catData.team1Made || 0;
                                    const attempted1 = catData.team1Attempted || 0;
                                    const made2 = catData.team2Made || 0;
                                    const attempted2 = catData.team2Attempted || 0;
                                    team1TotalDisplay = `${made1.toFixed(0)}/${attempted1.toFixed(0)} (${team1TotalNumeric.toFixed(1)}%)`;
                                    team2TotalDisplay = `${made2.toFixed(0)}/${attempted2.toFixed(0)} (${team2TotalNumeric.toFixed(1)}%)`;
                                } else {
                                    team1TotalDisplay = team1TotalNumeric.toFixed(1);
                                    team2TotalDisplay = team2TotalNumeric.toFixed(1);
                                }
                                
                                // Calculate hover color with slightly increased intensity
                                let hoverBgColor;
                                if (isWin) {
                                    if (marginIntensity < 0.4) {
                                        hoverBgColor = 'rgba(129, 199, 132, 0.4)';
                                    } else if (marginIntensity < 0.7) {
                                        hoverBgColor = 'rgba(76, 175, 80, 0.5)';
                                    } else {
                                        hoverBgColor = 'rgba(56, 142, 60, 0.6)';
                                    }
                                } else if (isLoss) {
                                    if (marginIntensity < 0.4) {
                                        hoverBgColor = 'rgba(239, 154, 154, 0.4)';
                                    } else if (marginIntensity < 0.7) {
                                        hoverBgColor = 'rgba(244, 67, 54, 0.5)';
                                    } else {
                                        hoverBgColor = 'rgba(211, 47, 47, 0.6)';
                                    }
                                } else {
                                    hoverBgColor = 'rgba(158, 158, 158, 0.1)';
                                }
                                
                                return (
                                    <React.Fragment key={catKey}>
                                        <TableRow 
                                            sx={{ 
                                                bgcolor: bgColor,
                                                cursor: 'pointer',
                                                '&:hover': { bgcolor: hoverBgColor }
                                            }}
                                            onClick={() => setExpandedCategory(isExpanded ? null : catKey)}
                                        >
                                            <TableCell sx={{ fontFamily: '"Roboto Mono", monospace', color: "#212121", fontWeight: 'bold' }}>
                                                {catLabels[catKey]} {isExpanded ? '▼' : '▶'}
                                            </TableCell>
                                            <TableCell 
                                                align="center" 
                                                sx={{ 
                                                    fontSize: '0.65rem', 
                                                    py: 0.5,
                                                    bgcolor: 'rgba(156, 39, 176, 0.05)'
                                                }}
                                            >
                                                <Box sx={{ color: "#4CAF50" }}>
                                                    {team1CurrentValue}
                                                </Box>
                                                <Box sx={{ color: "#ff6f61" }}>
                                                    {team2CurrentValue}
                                                </Box>
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
                                                    {team1TotalDisplay}
                                                </Box>
                                                <Box sx={{ color: "#ff6f61", fontWeight: 'bold' }}>
                                                    {team2TotalDisplay}
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
                                                <TableCell colSpan={10} sx={{ bgcolor: 'rgb(206, 195, 208)', p: 2 }}>
                                                    <Grid container spacing={2}>
                                                        {matchupProjection.team1.dailyProjections.map((day, idx) => {
                                                            if (day.isPast || (day.players.length === 0 && matchupProjection.team2.dailyProjections[idx]?.players.length === 0)) return null;
                                                            const team2Day = matchupProjection.team2.dailyProjections[idx];
                                                            
                                                            return (
                                                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                                                    <Box sx={{ bgcolor: '#ffffff', p: 1.5, borderRadius: 1, border: day.isToday ? '2px solid #4a90e2' : '1px solid rgba(0, 0, 0, 0.12)' }}>
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
                        bgcolor: '#ffffff',
                        border: '1px solid rgba(0, 0, 0, 0.12)',
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
                        color: '#212121',
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
                        color: '#212121',
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
                        color: '#212121',
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

