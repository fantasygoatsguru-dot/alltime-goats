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
    Paper,
    Grid,
    Menu,
    MenuItem,
    Chip,
    Collapse,
    IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";

const MatchupProjectionTracker = ({ 
    matchupProjection, 
    currentMatchup, 
    onPlayerStatusChange,
    isConnected 
}) => {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [playerStatusMenu, setPlayerStatusMenu] = useState(null);
    const [selectedPlayerForMenu, setSelectedPlayerForMenu] = useState(null);

    const team1Color = "#32a852"; // Green
    const team2Color = "#ba3030"; // Red
    const winColor = "#10b981";   // Emerald green
    const lossColor = "#ef4444";  // Red

    const handlePlayerClick = (event, player, dateStr) => {
        event.stopPropagation();
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

    // Format percentages to 3 decimals
    const formatPct = (value) => value.toFixed(3);

    // Format made/attempted as integers
    const formatMadeAtt = (value) => Math.round(value).toString();

    // Calculate percentage from made/attempted
    const calculatePct = (made, attempted) => {
        return attempted > 0 ? (made / attempted) * 100 : 0;
    };

    // Format non-percentage stats (points, etc.) to 1 decimal
    const formatStat = (value) => value.toFixed(1);

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
                        if (team2Day?.totals) {
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
                        if (team2Day?.totals) team2Projected += team2Day.totals[catKey] || 0;
                    }
                }
            });

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
                    const made1 = catData.team1Made || 0;
                    const attempted1 = catData.team1Attempted || 0;
                    const made2 = catData.team2Made || 0;
                    const attempted2 = catData.team2Attempted || 0;
                    team1TotalNumeric = attempted1 > 0 ? (made1 / attempted1) * 100 : 0;
                    team2TotalNumeric = attempted2 > 0 ? (made2 / attempted2) * 100 : 0;
                }
            } else {
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

            if (catKey === 'turnovers') {
                if (team1TotalNumeric < team2TotalNumeric) team1Score++;
                else if (team2TotalNumeric < team1TotalNumeric) team2Score++;
            } else {
                if (team1TotalNumeric > team2TotalNumeric) team1Score++;
                else if (team2TotalNumeric > team1TotalNumeric) team2Score++;
            }
        });

        return { team1Score, team2Score };
    }, [matchupProjection, currentMatchup]);

    if (!isConnected) {
        return (
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h5" fontWeight="bold" color="text.secondary" gutterBottom>
                    Matchup Projection Tracker
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Connect to your Yahoo account to view live projections
                </Typography>
            </Paper>
        );
    }

    if (!matchupProjection) return null;

    const categories = ['points', 'rebounds', 'assists', 'steals', 'blocks', 'threePointers', 'turnovers', 'fieldGoalPercentage', 'freeThrowPercentage'];
    const catLabels = {
        points: 'PTS', rebounds: 'REB', assists: 'AST', steals: 'STL',
        blocks: 'BLK', threePointers: '3PT', turnovers: 'TO',
        fieldGoalPercentage: 'FG%', freeThrowPercentage: 'FT%'
    };

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            {/* Header Score Card */}
            <Paper 
                elevation={6} 
                sx={{ 
                    p: 4, 
                    mb: 4, 
                    borderRadius: 4,
                    bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    textAlign: 'center'
                }}
            >
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
                    PROJECTED FINAL SCORE 
                </Typography>
                <Typography 
                    variant="h1" 
                    fontWeight="bold" 
                    sx={{ my: 2, fontSize: { xs: '3rem', md: '4.5rem' } }}
                >
                    {accurateScore.team1Score} – {accurateScore.team2Score}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
                    <Typography variant="h5" fontWeight="bold" color={team1Color}>
                        {matchupProjection.team1.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">vs</Typography>
                    <Typography variant="h5" fontWeight="bold" color={team2Color}>
                        {matchupProjection.team2.name}
                    </Typography>
                </Box>
            </Paper>

            {/* Main Table */}
            <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Table size="medium">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Category</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'grey.700' }}>
                                Current
                            </TableCell>
                            {matchupProjection.team1.dailyProjections.map((day, idx) => (
                                <TableCell 
                                    key={idx}
                                    align="center"
                                    sx={{ 
                                        fontWeight: 'bold',
                                        fontSize: '0.8rem',
                                        bgcolor: day.isToday ? 'primary.50' : 'transparent',
                                        color: day.isToday ? 'primary.main' : 'text.secondary'
                                    }}
                                >
                                    {day.dayOfWeek}<br/>
                                    <Box component="span" sx={{ fontWeight: 'normal', fontSize: '0.7rem' }}>
                                        {day.monthDay}{day.isToday && ' (Today)'}
                                    </Box>
                                </TableCell>
                            ))}
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Projected</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Winner</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((catKey) => {
                            const catData = matchupProjection.categoryResults[catKey];
                            if (!catData) return null;

                            const isPct = catKey.includes('Percentage');
                            const isExpanded = expandedCategory === catKey;

                            const yahooCategoryName = {
                                points: 'Points', rebounds: 'Rebounds', assists: 'Assists',
                                steals: 'Steals', blocks: 'Blocks', threePointers: 'Three Pointers Made',
                                turnovers: 'Turnovers', fieldGoalPercentage: 'Field Goal Percentage',
                                freeThrowPercentage: 'Free Throw Percentage'
                            }[catKey];

                            const yahooStats = currentMatchup?.stats?.categories?.[yahooCategoryName];

                            let team1Proj = 0, team2Proj = 0, team1Made = 0, team1Att = 0, team2Made = 0, team2Att = 0;
                            matchupProjection.team1.dailyProjections.forEach((day, i) => {
                                if (!day.isPast && day.totals) {
                                    if (isPct) {
                                        const keyMade = catKey === 'fieldGoalPercentage' ? 'fieldGoalsMade' : 'freeThrowsMade';
                                        const keyAtt = catKey === 'fieldGoalPercentage' ? 'fieldGoalsAttempted' : 'freeThrowsAttempted';
                                        team1Made += day.totals[keyMade] || 0;
                                        team1Att += day.totals[keyAtt] || 0;
                                        const t2 = matchupProjection.team2.dailyProjections[i];
                                        if (t2?.totals) {
                                            team2Made += t2.totals[keyMade] || 0;
                                            team2Att += t2.totals[keyAtt] || 0;
                                        }
                                    } else {
                                        team1Proj += day.totals[catKey] || 0;
                                        const t2 = matchupProjection.team2.dailyProjections[i];
                                        if (t2?.totals) team2Proj += t2.totals[catKey] || 0;
                                    }
                                }
                            });

                            let team1Total = 0, team2Total = 0;
                            if (yahooStats && isPct && yahooStats.team1?.nominator !== undefined) {
                                team1Total = (yahooStats.team1.nominator + team1Made) / (yahooStats.team1.denominator + team1Att || 1) * 100;
                                team2Total = ((yahooStats.team2?.nominator || 0) + team2Made) / ((yahooStats.team2?.denominator || 0) + team2Att || 1) * 100;
                            } else if (yahooStats && !isPct) {
                                team1Total = (parseFloat(yahooStats.team1) || 0) + team1Proj;
                                team2Total = (parseFloat(yahooStats.team2) || 0) + team2Proj;
                            } else {
                                team1Total = isPct ? (catData.team1Made / (catData.team1Attempted || 1)) * 100 : catData.team1;
                                team2Total = isPct ? (catData.team2Made / (catData.team2Attempted || 1)) * 100 : catData.team2;
                            }

                            const isWin = catKey === 'turnovers' ? team1Total < team2Total : team1Total > team2Total;
                            const isTie = team1Total === team2Total;

                            const rowBg = isWin 
                                ? 'rgba(16, 185, 129, 0.12)' 
                                : isTie 
                                ? 'rgba(156, 163, 175, 0.08)' 
                                : 'rgba(239, 68, 68, 0.12)';

                            const hoverBg = isWin 
                                ? 'rgba(16, 185, 129, 0.2)' 
                                : isTie 
                                ? 'rgba(156, 163, 175, 0.15)' 
                                : 'rgba(239, 68, 68, 0.2)';

                            return (
                                <React.Fragment key={catKey}>
                                    <TableRow 
                                        sx={{ 
                                            bgcolor: rowBg,
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: hoverBg }
                                        }}
                                        onClick={() => setExpandedCategory(isExpanded ? null : catKey)}
                                    >
                                        <TableCell sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {isExpanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                                            {catLabels[catKey]}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '0.85rem', color: 'grey.700' }}>
                                            <Box sx={{ color: team1Color, fontWeight: 600 }}>
                                                {yahooStats && isPct 
                                                    ? `${formatMadeAtt(yahooStats.team1.nominator)}/${formatMadeAtt(yahooStats.team1.denominator)}`
                                                    : yahooStats?.team1 || '0'
                                                }
                                            </Box>
                                            <Box sx={{ color: team2Color, fontWeight: 600 }}>
                                                {yahooStats && isPct 
                                                    ? `${formatMadeAtt(yahooStats.team2?.nominator || 0)}/${formatMadeAtt(yahooStats.team2?.denominator || 0)}`
                                                    : yahooStats?.team2 || '0'
                                                }
                                            </Box>
                                        </TableCell>

                                        {/* Daily Projections */}
                                        {matchupProjection.team1.dailyProjections.map((day, idx) => {
                                            const t2Day = matchupProjection.team2.dailyProjections[idx];
                                            const madeKey = catKey === 'fieldGoalPercentage' ? 'fieldGoalsMade' : 'freeThrowsMade';
                                            const attKey = catKey === 'fieldGoalPercentage' ? 'fieldGoalsAttempted' : 'freeThrowsAttempted';

                                            const t1Made = day.totals?.[madeKey] || 0;
                                            const t1Att = day.totals?.[attKey] || 0;
                                            const t2Made = t2Day?.totals?.[madeKey] || 0;
                                            const t2Att = t2Day?.totals?.[attKey] || 0;

                                            const t1Pct = calculatePct(t1Made, t1Att);
                                            const t2Pct = calculatePct(t2Made, t2Att);

                                            return (
                                                <TableCell key={idx} align="center" sx={{ fontSize: '0.8rem' }}>
                                                    {!day.isPast ? (
                                                        <>
                                                            <Box sx={{ color: team1Color }}>
                                                                {isPct 
                                                                    ? `${formatMadeAtt(t1Made)}/${formatMadeAtt(t1Att)}`
                                                                    : formatStat(day.totals?.[catKey] || 0)
                                                                }
                                                                {isPct && (
                                                                    <Box component="span" sx={{ fontSize: '0.7rem', opacity: 0.8, ml: 0.5 }}>
                                                                        ({formatPct(t1Pct)}%)
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                            <Box sx={{ color: team2Color }}>
                                                                {isPct 
                                                                    ? `${formatMadeAtt(t2Made)}/${formatMadeAtt(t2Att)}`
                                                                    : formatStat(t2Day?.totals?.[catKey] || 0)
                                                                }
                                                                {isPct && (
                                                                    <Box component="span" sx={{ fontSize: '0.7rem', opacity: 0.8, ml: 0.5 }}>
                                                                        ({formatPct(t2Pct)}%)
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        </>
                                                    ) : <Box sx={{ color: 'grey.400' }}>-</Box>}
                                                </TableCell>
                                            );
                                        })}

                                        {/* Projected Total */}
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            <Box sx={{ color: team1Color }}>
                                                {formatPct(team1Total)}%
                                            </Box>
                                            <Box sx={{ color: team2Color }}>
                                                {formatPct(team2Total)}%
                                            </Box>
                                        </TableCell>

                                        {/* Winner */}
                                        <TableCell align="center">
                                            <Chip 
                                                label={isWin ? matchupProjection.team1.name.split(' ')[0] : isTie ? 'TIE' : matchupProjection.team2.name.split(' ')[0]}
                                                size="small"
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    bgcolor: isWin ? winColor : isTie ? 'grey.400' : lossColor,
                                                    color: 'white'
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>

                                    {/* Expanded Player Breakdown */}
                                    <TableRow>
                                        <TableCell style={{ padding: 0 }} colSpan={matchupProjection.team1.dailyProjections.length + 4}>
                                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
                                                    <Grid container spacing={3}>
                                                        {matchupProjection.team1.dailyProjections.map((day, idx) => {
                                                            const team2Day = matchupProjection.team2.dailyProjections[idx];
                                                            if (day.isPast || (!day.players.length && !team2Day?.players.length)) return null;

                                                            return (
                                                                <Grid item xs={12} md={6} lg={4} key={idx}>
                                                                    <Paper 
                                                                        elevation={day.isToday ? 8 : 2}
                                                                        sx={{ 
                                                                            p: 2, 
                                                                            borderRadius: 2,
                                                                            border: day.isToday ? `2px solid ${team1Color}` : 'none',
                                                                            bgcolor: 'white'
                                                                        }}
                                                                    >
                                                                        <Typography 
                                                                            variant="subtitle2" 
                                                                            fontWeight="bold" 
                                                                            textAlign="center"
                                                                            color={day.isToday ? team1Color : 'text.primary'}
                                                                            gutterBottom
                                                                        >
                                                                            {day.dayOfWeek} {day.monthDay} {day.isToday && '(Today)'}
                                                                        </Typography>

                                                                        <Box sx={{ mb: 2 }}>
                                                                            <Typography variant="body2" fontWeight="bold" color={team1Color} gutterBottom>
                                                                                {matchupProjection.team1.name}
                                                                            </Typography>
                                                                            {day.players.length ? day.players.map((p, i) => (
                                                                                <Typography 
                                                                                    key={i}
                                                                                    variant="body2"
                                                                                    sx={{ 
                                                                                        ml: 1, 
                                                                                        cursor: 'pointer',
                                                                                        color: p.disabled ? 'grey.500' : team1Color,
                                                                                        textDecoration: p.disabled ? 'line-through' : 'none',
                                                                                        '&:hover': { bgcolor: 'action.hover', borderRadius: 1 }
                                                                                    }}
                                                                                    onMouseDown={(e) => handlePlayerClick(e, p, day.date)}
                                                                                >
                                                                                    • {p.name} {p.status && `[${p.status}]`} {p.selectedPosition && ['IL', 'IL+'].includes(p.selectedPosition) && `[${p.selectedPosition}]`}: {' '}
                                                                                    {isPct 
                                                                                        ? `${formatMadeAtt(p.stats[catKey === 'fieldGoalPercentage' ? 'fieldGoalsMade' : 'freeThrowsMade'] || 0)}/${formatMadeAtt(p.stats[catKey === 'fieldGoalPercentage' ? 'fieldGoalsAttempted' : 'freeThrowsAttempted'] || 0)}`
                                                                                        : formatStat(p.stats[catKey] || 0)
                                                                                    }
                                                                                </Typography>
                                                                            )) : <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>No games</Typography>}
                                                                        </Box>

                                                                        <Box>
                                                                            <Typography variant="body2" fontWeight="bold" color={team2Color} gutterBottom>
                                                                                {matchupProjection.team2.name}
                                                                            </Typography>
                                                                            {team2Day?.players.length ? team2Day.players.map((p, i) => (
                                                                                <Typography 
                                                                                    key={i}
                                                                                    variant="body2"
                                                                                    sx={{ 
                                                                                        ml: 1, 
                                                                                        cursor: 'pointer',
                                                                                        color: p.disabled ? 'grey.500' : team2Color,
                                                                                        textDecoration: p.disabled ? 'line-through' : 'none',
                                                                                        '&:hover': { bgcolor: 'action.hover', borderRadius: 1 }
                                                                                    }}
                                                                                    onMouseDown={(e) => handlePlayerClick(e, p, day.date)}
                                                                                >
                                                                                    • {p.name} {p.status && `[${p.status}]`} {p.selectedPosition && ['IL', 'IL+'].includes(p.selectedPosition) && `[${p.selectedPosition}]`}: {' '}
                                                                                    {isPct 
                                                                                        ? `${formatMadeAtt(p.stats[catKey === 'fieldGoalPercentage' ? 'fieldGoalsMade' : 'freeThrowsMade'] || 0)}/${formatMadeAtt(p.stats[catKey === 'fieldGoalPercentage' ? 'fieldGoalsAttempted' : 'freeThrowsAttempted'] || 0)}`
                                                                                        : formatStat(p.stats[catKey] || 0)
                                                                                    }
                                                                                </Typography>
                                                                            )) : <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>No games</Typography>}
                                                                        </Box>
                                                                    </Paper>
                                                                </Grid>
                                                            );
                                                        })}
                                                    </Grid>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Player Status Menu */}
            <Menu
                anchorEl={playerStatusMenu}
                open={Boolean(playerStatusMenu)}
                onClose={handleClosePlayerMenu}
                PaperProps={{ sx: { mt: 1, boxShadow: 3 } }}
            >
                <MenuItem onClick={() => handlePlayerStatusChange('enabled')}>
                    <Typography color="success.main" fontWeight="medium">Enable Player</Typography>
                </MenuItem>
                <MenuItem onClick={() => handlePlayerStatusChange('disabledForDay')}>
                    <Typography color="warning.main" fontWeight="medium">Disable for Day</Typography>
                </MenuItem>
                <MenuItem onClick={() => handlePlayerStatusChange('disabledForWeek')}>
                    <Typography color="error.main" fontWeight="medium">Disable for Week</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default MatchupProjectionTracker;