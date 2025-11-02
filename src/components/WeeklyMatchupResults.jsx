import React, { useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from "@mui/material";

const WeeklyMatchupResults = ({ 
    weeklyResults, 
    team1Name, 
    team2Name 
}) => {
    const [openWeekDialog, setOpenWeekDialog] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);

    const handleWeekClick = (week) => {
        setSelectedWeek(week);
        setOpenWeekDialog(true);
    };

    const handleCloseWeekDialog = () => {
        setOpenWeekDialog(false);
        setSelectedWeek(null);
    };

    const getCategoryBreakdown = (week) => {
        const weekResult = weeklyResults.find(r => r.week === week);
        if (!weekResult || !weekResult.categoryResults) return null;
        
        return Object.entries(weekResult.categoryResults).map(([category, data]) => ({
            category,
            t1Value: data.t1,
            t2Value: data.t2,
            winner: data.winner
        }));
    };

    const getMatchupColor = (result) => {
        const [team1Wins, team2Wins] = result.score.split('-').map(Number);
        const totalCategories = team1Wins + team2Wins;
        const margin = Math.abs(team1Wins - team2Wins);
        const opacity = 0.1 + (margin / totalCategories) * 0.3;
        
        if (team1Wins > team2Wins) return `rgba(76, 175, 80, ${opacity})`;
        if (team2Wins > team1Wins) return `rgba(244, 67, 54, ${opacity})`;
        return 'rgba(158, 158, 158, 0.1)';
    };

    const getTextColor = (result) => {
        const [team1Wins, team2Wins] = result.score.split('-').map(Number);
        const totalCategories = team1Wins + team2Wins;
        const margin = Math.abs(team1Wins - team2Wins);
        const opacity = 0.8 + (margin / totalCategories) * 0.2;
        
        if (team1Wins > team2Wins) return `rgba(76, 175, 80, ${opacity})`;
        if (team2Wins > team1Wins) return `rgba(244, 67, 54, ${opacity})`;
        return 'rgba(158, 158, 158, 0.8)';
    };

    if (weeklyResults.length === 0) return null;

    return (
        <>
            <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "bold",
                            color: "#4a90e2",
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Previous Weeks Matchup Results
                    </Typography>
                    <Tooltip 
                        title="If you had this lineup in previous weeks, what would the results have been?"
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
                <Grid container spacing={2}>
                    {weeklyResults.map((result) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={result.week}>
                            <Paper
                                onClick={() => handleWeekClick(result.week)}
                                sx={{
                                    p: 1.5,
                                    cursor: "pointer",
                                    transition: "transform 0.2s",
                                    "&:hover": {
                                        transform: "scale(1.02)",
                                    },
                                    bgcolor: getMatchupColor(result),
                                    border: `1px solid ${getMatchupColor(result).replace('0.1', '0.3')}`,
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: "#4a90e2",
                                            fontFamily: '"Roboto Mono", monospace',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        W{result.week}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "#b0bec5",
                                            fontFamily: '"Roboto Mono", monospace'
                                        }}
                                    >
                                        {result.weekStart ? result.weekStart.split('-')[1] + '/' + result.weekStart.split('-')[2] : ''}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: "#212121",
                                        fontFamily: '"Roboto Mono", monospace',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        mb: 0.5
                                    }}
                                >
                                    {result.score}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        textAlign: 'center',
                                        color: getTextColor(result),
                                        fontFamily: '"Roboto Mono", monospace',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {result.winner === "Tie" ? "TIE" : `${result.winner.split(' ')[0]} W`}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Week Detail Dialog */}
            <Dialog
                open={openWeekDialog}
                onClose={handleCloseWeekDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        bgcolor: "#f8f9fa",
                        borderRadius: 1,
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        color: "#4a90e2",
                        fontFamily: '"Roboto Mono", monospace',
                        fontWeight: 'bold',
                        pb: 1
                    }}
                >
                    W{selectedWeek} Breakdown
                </DialogTitle>
                <DialogContent>
                    {selectedWeek && getCategoryBreakdown(selectedWeek) && (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{
                                            color: "#b0bec5",
                                            fontFamily: '"Roboto Mono", monospace',
                                            fontWeight: 'bold'
                                        }}>Category</TableCell>
                                        <TableCell align="right" sx={{
                                            color: "#b0bec5",
                                            fontFamily: '"Roboto Mono", monospace',
                                            fontWeight: 'bold'
                                        }}>{team1Name}</TableCell>
                                        <TableCell align="right" sx={{
                                            color: "#b0bec5",
                                            fontFamily: '"Roboto Mono", monospace',
                                            fontWeight: 'bold'
                                        }}>{team2Name}</TableCell>
                                        <TableCell sx={{
                                            color: "#b0bec5",
                                            fontFamily: '"Roboto Mono", monospace',
                                            fontWeight: 'bold'
                                        }}>Winner</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getCategoryBreakdown(selectedWeek).map((row) => {
                                        const isTurnovers = row.category === "Turnovers";
                                        const team1Won = isTurnovers ? parseFloat(row.t1Value) < parseFloat(row.t2Value) : parseFloat(row.t1Value) > parseFloat(row.t2Value);
                                        const color = team1Won ? 'rgba(76, 175, 80, 0.2)' : row.winner === team1Name ? 'rgba(76, 175, 80, 0.1)' : row.winner === team2Name ? 'rgba(244, 67, 54, 0.1)' : 'rgba(158, 158, 158, 0.1)';
                                        const textColor = team1Won ? 'rgba(76, 175, 80, 0.9)' : row.winner === team1Name ? 'rgba(76, 175, 80, 0.8)' : row.winner === team2Name ? 'rgba(244, 67, 54, 0.8)' : 'rgba(158, 158, 158, 0.8)';
                                        return (
                                            <TableRow
                                                key={row.category}
                                                sx={{ bgcolor: color }}
                                            >
                                                <TableCell sx={{
                                                    fontFamily: '"Roboto Mono", monospace',
                                                    color: "#212121"
                                                }}>{row.category}</TableCell>
                                                <TableCell align="right" sx={{
                                                    fontFamily: '"Roboto Mono", monospace',
                                                    color: "#212121"
                                                }}>{row.t1Value}</TableCell>
                                                <TableCell align="right" sx={{
                                                    fontFamily: '"Roboto Mono", monospace',
                                                    color: "#212121"
                                                }}>{row.t2Value}</TableCell>
                                                <TableCell>
                                                    <Typography
                                                        sx={{
                                                            fontFamily: '"Roboto Mono", monospace',
                                                            fontWeight: 'bold'
                                                        }}
                                                        color={textColor}
                                                    >
                                                        {row.winner.split(' ')[0]}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 1 }}>
                    <Button
                        onClick={handleCloseWeekDialog}
                        size="small"
                        sx={{
                            fontFamily: '"Roboto Mono", monospace',
                            color: "#4a90e2"
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default WeeklyMatchupResults;

