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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Team identity colors — used throughout the dense stats table so a team's
// numbers stay glanceable without re-reading the header each row.
const TEAM1_COLOR = "#1e8e5a";
const TEAM2_COLOR = "#d9534f";

// Win/loss cell shading: a single hue per outcome, three intensities to
// encode margin size (close / moderate / blowout) — the intensity math is
// unchanged, only the color values were unified into one coherent palette.
const winCellStyle = (intensity) => {
    if (intensity < 0.4) return { bg: "rgba(30, 142, 90, 0.08)", text: "#1e8e5a", hoverBg: "rgba(30, 142, 90, 0.14)" };
    if (intensity < 0.7) return { bg: "rgba(30, 142, 90, 0.14)", text: "#187249", hoverBg: "rgba(30, 142, 90, 0.2)" };
    return { bg: "rgba(30, 142, 90, 0.2)", text: "#14603c", hoverBg: "rgba(30, 142, 90, 0.26)" };
};
const lossCellStyle = (intensity) => {
    if (intensity < 0.4) return { bg: "rgba(217, 83, 79, 0.08)", text: "#d9534f", hoverBg: "rgba(217, 83, 79, 0.14)" };
    if (intensity < 0.7) return { bg: "rgba(217, 83, 79, 0.14)", text: "#c0392b", hoverBg: "rgba(217, 83, 79, 0.2)" };
    return { bg: "rgba(217, 83, 79, 0.2)", text: "#a5281c", hoverBg: "rgba(217, 83, 79, 0.26)" };
};
const tieCellStyle = { bg: "rgba(90, 100, 114, 0.05)", text: "#8595ad", hoverBg: "rgba(90, 100, 114, 0.1)" };

// Day-by-day columns only show on tablet/desktop, where there's room for
// 7+ extra columns. On mobile the same numbers move into the expand panel
// below, so nothing is lost — it just stops forcing a horizontal scroll.
const dayColSx = { display: { xs: 'none', md: 'table-cell' } };

const formatDayValue = (day, catKey, isPct) => {
    if (!day || !day.totals) return '0.0';
    if (isPct) {
        const madeKey = catKey === 'fieldGoalPercentage' ? 'fieldGoalsMade' : 'freeThrowsMade';
        const attemptedKey = catKey === 'fieldGoalPercentage' ? 'fieldGoalsAttempted' : 'freeThrowsAttempted';
        return `${(day.totals[madeKey] || 0).toFixed(0)}/${(day.totals[attemptedKey] || 0).toFixed(0)}`;
    }
    return (day.totals[catKey] || 0).toFixed(1);
};

const MatchupProjectionTracker = ({
    matchupProjection,
    currentMatchup,
    onPlayerStatusChange,
    isConnected,
    isFutureWeek = false
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
            const yahooStats = isFutureWeek ? null : currentMatchup?.stats?.categories?.[yahooCategoryName];

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
            <Box sx={{ mt: 4, p: 4, bgcolor: "#fff", borderRadius: 3, textAlign: 'center', border: "1px solid #e6e9ee" }}>
                <Typography
                    variant="h6"
                    sx={{
                        color: "#0f2340",
                        fontWeight: 600,
                        mb: 2
                    }}
                >
                    Matchup Projection Tracker (Week {currentMatchup?.week || 'N/A'})
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: "#5a6472",
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
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
                {/* Scoreboard */}
                <Box sx={{
                    mb: 2.5, bgcolor: '#fff', border: '1px solid #e6e9ee', borderRadius: 3,
                    display: 'flex', alignItems: 'center', overflow: 'hidden',
                }}>
                    <Box sx={{ flex: 1, py: 2.5, px: 2, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: 0.4, color: '#5a6472', mb: 0.5 }}>
                            {matchupProjection.team1.name}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '1.8rem', sm: '2.2rem' },
                                fontWeight: 900,
                                lineHeight: 1,
                                color: accurateScore.team1Score > accurateScore.team2Score ? TEAM1_COLOR : accurateScore.team1Score < accurateScore.team2Score ? TEAM2_COLOR : '#0f2340',
                            }}
                        >
                            {accurateScore.team1Score}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: { xs: 1, sm: 2 } }}>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1, color: '#8595ad', textTransform: 'uppercase' }}>
                            Projected
                        </Typography>
                        <Box sx={{ width: 1, height: 28, bgcolor: '#e6e9ee', my: 0.5 }} />
                    </Box>

                    <Box sx={{ flex: 1, py: 2.5, px: 2, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: 0.4, color: '#5a6472', mb: 0.5 }}>
                            {matchupProjection.team2.name}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '1.8rem', sm: '2.2rem' },
                                fontWeight: 900,
                                lineHeight: 1,
                                color: accurateScore.team2Score > accurateScore.team1Score ? TEAM1_COLOR : accurateScore.team2Score < accurateScore.team1Score ? TEAM2_COLOR : '#0f2340',
                            }}
                        >
                            {accurateScore.team2Score}
                        </Typography>
                    </Box>
                </Box>

                {/* Day-by-Day Stats Breakdown */}
                <Box sx={{ bgcolor: '#fff', border: '1px solid #e6e9ee', borderRadius: 3, overflow: 'hidden' }}>
                    <Typography
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            px: 1.5, pt: 1.25, pb: 0.25,
                            fontSize: '0.7rem', fontWeight: 600, color: '#8595ad',
                        }}
                    >
                        Tap a category for the day-by-day breakdown
                    </Typography>
                    <Box
                        sx={{
                            // Only tablet/desktop actually need to scroll — mobile hides the
                            // day columns entirely, so pan-x here would just eat mobile taps
                            // meant to expand a row.
                            overflowX: { xs: 'visible', md: 'auto' },
                            overflowY: 'hidden',
                            WebkitOverflowScrolling: 'touch',
                            overscrollBehaviorX: 'contain',
                            touchAction: { xs: 'auto', md: 'pan-x pinch-zoom' },
                            '&::-webkit-scrollbar': {
                                height: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#c1c1c1',
                                borderRadius: '4px',
                                '&:hover': {
                                    background: '#a8a8a8',
                                },
                            },
                        }}
                    >
                        <TableContainer sx={{ minWidth: { xs: 'auto', md: 1000 } }}>
                            <Table size="small" stickyHeader sx={{ width: '100%' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: "#5a6472", fontWeight: 700, fontSize: { xs: '0.7rem', md: '0.72rem' }, textTransform: 'uppercase', letterSpacing: 0.4, bgcolor: '#f8f9fb', borderBottom: '1px solid #e6e9ee', whiteSpace: 'nowrap' }}>Category</TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                color: "#9c27b0",
                                                fontWeight: 700,
                                                fontSize: '0.7rem',
                                                bgcolor: 'rgba(156, 39, 176, 0.08)',
                                                borderBottom: '1px solid #e6e9ee',
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
                                                    ...dayColSx,
                                                    color: day.isToday ? "#0f2340" : "#5a6472",
                                                    fontWeight: 700,
                                                    fontSize: '0.7rem',
                                                    bgcolor: day.isToday ? 'rgba(47, 128, 237, 0.08)' : '#f8f9fb',
                                                    borderBottom: '1px solid #e6e9ee',
                                                }}
                                            >
                                                <Box>{day.dayOfWeek}</Box>
                                                <Box sx={{ fontSize: '0.65rem', color: day.isToday ? '#0f2340' : '#8595ad' }}>
                                                    {day.monthDay}
                                                    {day.isToday && ' (Today)'}
                                                </Box>
                                            </TableCell>
                                        ))}
                                        <TableCell align="center" sx={{ color: "#5a6472", fontWeight: 700, fontSize: { xs: '0.7rem', md: '0.72rem' }, textTransform: 'uppercase', letterSpacing: 0.4, bgcolor: '#f8f9fb', borderBottom: '1px solid #e6e9ee' }}>Total</TableCell>
                                        <TableCell sx={{ color: "#5a6472", fontWeight: 700, fontSize: { xs: '0.7rem', md: '0.72rem' }, textTransform: 'uppercase', letterSpacing: 0.4, bgcolor: '#f8f9fb', borderBottom: '1px solid #e6e9ee' }}>Winner</TableCell>
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

                                        // Get actual stats from Yahoo (currentMatchup.stats.categories) unless it's a future week
                                        const yahooCategoryName = yahooCategoryMap[catKey];
                                        const yahooStats = isFutureWeek ? null : currentMatchup?.stats?.categories?.[yahooCategoryName];

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

                                        // Cell shading: one hue per outcome, intensity encodes margin size.
                                        const cellStyle = isWin ? winCellStyle(marginIntensity) : isLoss ? lossCellStyle(marginIntensity) : tieCellStyle;
                                        const bgColor = cellStyle.bg;
                                        const textColor = cellStyle.text;

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

                                        const hoverBgColor = cellStyle.hoverBg;

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
                                                    <TableCell sx={{ color: "#0f2340", fontWeight: 700, fontSize: { xs: '0.78rem', md: '0.8rem' }, display: 'flex', alignItems: 'center', gap: 0.5, border: 'none', whiteSpace: 'nowrap' }}>
                                                        {isExpanded ? <ExpandMoreIcon sx={{ fontSize: 16, color: '#8595ad' }} /> : <ChevronRightIcon sx={{ fontSize: 16, color: '#8595ad' }} />}
                                                        {catLabels[catKey]}
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            fontSize: { xs: '0.72rem', md: '0.68rem' },
                                                            py: 0.75,
                                                            bgcolor: 'rgba(156, 39, 176, 0.05)'
                                                        }}
                                                    >
                                                        <Box sx={{ color: "#1e8e5a" }}>
                                                            {team1CurrentValue}
                                                        </Box>
                                                        <Box sx={{ color: "#d9534f" }}>
                                                            {team2CurrentValue}
                                                        </Box>
                                                    </TableCell>
                                                    {matchupProjection.team1.dailyProjections.map((day, idx) => (
                                                        <TableCell
                                                            key={idx}
                                                            align="center"
                                                            sx={{
                                                                ...dayColSx,
                                                                fontSize: '0.65rem',
                                                                py: 0.5,
                                                                bgcolor: day.isToday ? 'rgba(47, 128, 237, 0.05)' : 'transparent'
                                                            }}
                                                        >
                                                            {day.isPast ? (
                                                                <Box sx={{ color: '#5a6472' }}>-</Box>
                                                            ) : (
                                                                <>
                                                                    <Box sx={{ color: "#1e8e5a" }}>
                                                                        {formatDayValue(day, catKey, isPct)}
                                                                    </Box>
                                                                    <Box sx={{ color: "#d9534f" }}>
                                                                        {formatDayValue(matchupProjection.team2.dailyProjections[idx], catKey, isPct)}
                                                                    </Box>
                                                                </>
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                    <TableCell align="center" sx={{ fontSize: { xs: '0.72rem', md: '0.75rem' }, py: 0.75 }}>
                                                        <Box sx={{ color: "#1e8e5a", fontWeight: 600 }}>
                                                            {team1TotalDisplay}
                                                        </Box>
                                                        <Box sx={{ color: "#d9534f", fontWeight: 600 }}>
                                                            {team2TotalDisplay}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ py: 0.75 }}>
                                                        <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.72rem', md: '0.75rem' }, whiteSpace: 'nowrap' }} style={{ color: textColor }}>
                                                            {isWin ? matchupProjection.team1.name.split(' ')[0] : isLoss ? matchupProjection.team2.name.split(' ')[0] : 'TIE'}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                {isExpanded && (
                                                    <TableRow>
                                                        <TableCell colSpan={100} sx={{ bgcolor: '#f8f9fb', p: { xs: 1.5, sm: 2 } }}>
                                                            <Grid container spacing={2}>
                                                                {matchupProjection.team1.dailyProjections.map((day, idx) => {
                                                                    if (day.isPast || (day.players.length === 0 && matchupProjection.team2.dailyProjections[idx]?.players.length === 0)) return null;
                                                                    const team2Day = matchupProjection.team2.dailyProjections[idx];

                                                                    return (
                                                                        <Grid item xs={12} sm={6} md={4} key={idx}>
                                                                            <Box sx={{ bgcolor: '#ffffff', p: 1.5, borderRadius: 2, border: day.isToday ? '1.5px solid #2f80ed' : '1px solid #e6e9ee' }}>
                                                                                <Typography variant="caption" sx={{ color: day.isToday ? '#0f2340' : '#5a6472', fontWeight: 600, display: 'block', mb: 0.5, textAlign: 'center' }}>
                                                                                    {day.dayOfWeek} {day.monthDay} {day.isToday ? '(Today)' : ''}
                                                                                </Typography>
                                                                                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', fontWeight: 700, mb: 1.5, fontSize: '0.75rem' }}>
                                                                                    <span style={{ color: '#1e8e5a' }}>{formatDayValue(day, catKey, isPct)}</span>
                                                                                    <span style={{ color: '#8595ad', fontWeight: 500 }}> vs </span>
                                                                                    <span style={{ color: '#d9534f' }}>{formatDayValue(team2Day, catKey, isPct)}</span>
                                                                                </Typography>
                                                                                <Box sx={{ mb: 1.5 }}>
                                                                                    <Typography variant="caption" sx={{ color: '#1e8e5a', fontWeight: 600, display: 'block', mb: 0.5 }}>
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
                                                                                                    color: isDisabled ? '#5a6472' : '#1e8e5a',
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
                                                                                        <Typography variant="caption" sx={{ color: '#5a6472', display: 'block', fontSize: '0.7rem', ml: 1 }}>
                                                                                            No games
                                                                                        </Typography>
                                                                                    )}
                                                                                </Box>
                                                                                <Box>
                                                                                    <Typography variant="caption" sx={{ color: '#d9534f', fontWeight: 600, display: 'block', mb: 0.5 }}>
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
                                                                                                    color: isDisabled ? '#5a6472' : '#d9534f',
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
                                                                                        <Typography variant="caption" sx={{ color: '#5a6472', display: 'block', fontSize: '0.7rem', ml: 1 }}>
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
                </Box>
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
                        border: '1px solid #e6e9ee',
                        borderRadius: 2,
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
                        color: '#0f2340',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        py: 1.5,
                        '&:hover': { bgcolor: 'rgba(30, 142, 90, 0.1)' },
                        '&:active': { bgcolor: 'rgba(30, 142, 90, 0.16)' }
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
                        color: '#0f2340',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        py: 1.5,
                        '&:hover': { bgcolor: 'rgba(224, 168, 0, 0.12)' },
                        '&:active': { bgcolor: 'rgba(224, 168, 0, 0.18)' }
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
                        color: '#0f2340',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        py: 1.5,
                        '&:hover': { bgcolor: 'rgba(217, 83, 79, 0.1)' },
                        '&:active': { bgcolor: 'rgba(217, 83, 79, 0.16)' }
                    }}
                >
                    ✗ Disable for Week
                </MenuItem>
            </Menu>
        </>
    );
};

export default MatchupProjectionTracker;

