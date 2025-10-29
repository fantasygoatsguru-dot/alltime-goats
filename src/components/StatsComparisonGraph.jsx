import React, { useState } from "react";
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    Tooltip,
} from "@mui/material";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    Legend,
} from "recharts";

const StatsComparisonGraph = ({ teamAverages, team1Name, team2Name }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const averages = teamAverages || {
        team1Averages: {},
        team2Averages: {},
        team1ZScores: {},
        team2ZScores: {},
        team1Contributions: {},
        team2Contributions: {}
    };

    const categories = [
        "Points",
        "3pt",
        "Assists",
        "Steals",
        "FT%",
        "FG%",
        "Turnovers",
        "Blocks",
        "Rebounds",
    ];

    const formatValue = (value, category) => {
        if (category === "FG%" || category === "FT%") {
            return `${value.toFixed(2)}%`;
        }
        return value.toFixed(2);
    };

    const data = categories.map((category) => ({
        skill: category,
        [team1Name]: averages.team1ZScores?.[category] || 0,
        [team2Name]: averages.team2ZScores?.[category] || 0,
    }));

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
    };

    const getTotalForTeam = (contributions) => {
        return contributions.reduce((sum, player) => sum + (player.value || 0), 0).toFixed(2);
    };

    const getAverageForTeam = (contributions) => {
        if (contributions.length === 0) return "0.00";
        const sum = contributions.reduce((sum, player) => sum + (player.value || 0), 0);
        return (sum / contributions.length).toFixed(2);
    };

    const hasData = teamAverages && (
        Object.keys(averages.team1ZScores || {}).length > 0 ||
        Object.keys(averages.team2ZScores || {}).length > 0
    );

    return (
        <Box sx={{ p: 2, bgcolor: "#252525", borderRadius: 1, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Typography
                    variant="h5"
                    sx={{
                        color: "#e0e0e0",
                        fontFamily: '"Roboto Mono", monospace',
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    Team Strengths Comparison
                </Typography>
                <Tooltip 
                    title="This radar chart compares both teams' strengths across 9 categories using z-scores. The larger the area for a category, the stronger that team is in that area. Click on any category label to see detailed player contributions."
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
            {!hasData && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography sx={{ color: "#b0bec5", fontFamily: '"Roboto Mono", monospace' }}>
                        Loading team data or no active players selected...
                    </Typography>
                    <Typography sx={{ color: "#666", fontFamily: '"Roboto Mono", monospace', fontSize: "0.875rem", mt: 1 }}>
                        Make sure both teams have active players enabled (eye icon)
                    </Typography>
                </Box>
            )}
            <Box sx={{ height: "400px" }}>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart outerRadius="70%" data={data}>
                        <PolarGrid stroke="#4a90e2" />
                        <PolarAngleAxis
                            dataKey="skill"
                            stroke="#e0e0e0"
                            tick={{ fontFamily: '"Roboto Mono", monospace', fontSize: 12 }}
                            onClick={(e) => handleCategoryClick(e.value)}
                            style={{ cursor: "pointer" }}
                        />
                        <PolarRadiusAxis angle={90} domain={[0, 4]} tick={false} stroke="#4a90e2" />
                        <Radar
                            name={team1Name}
                            dataKey={team1Name}
                            stroke="#4CAF50"
                            fill="#4CAF50"
                            fillOpacity={0.3}
                        />
                        <Radar
                            name={team2Name}
                            dataKey={team2Name}
                            stroke="#ff6f61"
                            fill="#ff6f61"
                            fillOpacity={0.3}
                        />
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: "#252525",
                                border: "1px solid #4a90e2",
                                borderRadius: "4px",
                            }}
                            formatter={(value, name) => {
                                const category = data.find((d) => d[name] === value)?.skill;
                                const teamData = name === team1Name ? averages.team1Contributions : averages.team2Contributions;
                                const rawValue =
                                    category === "FG%" || category === "FT%"
                                        ? (name === team1Name ? averages.team1Averages : averages.team2Averages)?.[category] || 0
                                        : teamData?.[category]?.reduce((sum, player) => sum + (player.value || 0), 0) || 0;
                                return [`${formatValue(rawValue, category)} (Z: ${(value || 0).toFixed(2)})`, name];
                            }}
                            labelStyle={{ color: "#e0e0e0", display: "none" }}
                            cursor={{ stroke: "#4a90e2", strokeWidth: 1 }}
                        />
                        <Legend
                            wrapperStyle={{
                                fontFamily: '"Roboto Mono", monospace',
                                color: "#e0e0e0",
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </Box>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                PaperProps={{ sx: { bgcolor: "#252525", borderRadius: 1 } }}
            >
                <DialogTitle
                    sx={{
                        color: "#e0e0e0",
                        fontFamily: '"Roboto Mono", monospace',
                        fontWeight: "bold",
                    }}
                >
                    {selectedCategory} Breakdown
                </DialogTitle>
                <DialogContent>
                    {selectedCategory && (
                        <Box sx={{ mt: 2 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#4CAF50",
                                    fontFamily: '"Roboto Mono", monospace',
                                    mb: 1,
                                }}
                            >
                                {team1Name}
                            </Typography>
                            <List>
                                {averages.team1Contributions?.[selectedCategory]?.map((player, index) => (
                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={player.playerName}
                                            secondary={(player.value || 0).toFixed(2)}
                                            primaryTypographyProps={{
                                                sx: {
                                                    color: "#e0e0e0",
                                                    fontFamily: '"Roboto Mono", monospace',
                                                },
                                            }}
                                            secondaryTypographyProps={{
                                                sx: {
                                                    color: "#4CAF50",
                                                    fontFamily: '"Roboto Mono", monospace',
                                                },
                                            }}
                                        />
                                    </ListItem>
                                ))}
                                <ListItem sx={{ py: 0.5, borderTop: "1px solid #4CAF50" }}>
                                    <ListItemText
                                        primary={selectedCategory === "FG%" || selectedCategory === "FT%" ? "Average" : "Total"}
                                        secondary={
                                            selectedCategory === "FG%" || selectedCategory === "FT%"
                                                ? getAverageForTeam(averages.team1Contributions?.[selectedCategory] || [])
                                                : getTotalForTeam(averages.team1Contributions?.[selectedCategory] || [])
                                        }
                                        primaryTypographyProps={{
                                            sx: {
                                                color: "#e0e0e0",
                                                fontFamily: '"Roboto Mono", monospace',
                                                fontWeight: "bold",
                                            },
                                        }}
                                        secondaryTypographyProps={{
                                            sx: {
                                                color: "#4CAF50",
                                                fontFamily: '"Roboto Mono", monospace',
                                                fontWeight: "bold",
                                            },
                                        }}
                                    />
                                </ListItem>
                            </List>

                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#ff6f61",
                                    fontFamily: '"Roboto Mono", monospace',
                                    mt: 2,
                                    mb: 1,
                                }}
                            >
                                {team2Name}
                            </Typography>
                            <List>
                                {averages.team2Contributions?.[selectedCategory]?.map((player, index) => (
                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={player.playerName}
                                            secondary={(player.value || 0).toFixed(2)}
                                            primaryTypographyProps={{
                                                sx: {
                                                    color: "#e0e0e0",
                                                    fontFamily: '"Roboto Mono", monospace',
                                                },
                                            }}
                                            secondaryTypographyProps={{
                                                sx: {
                                                    color: "#ff6f61",
                                                    fontFamily: '"Roboto Mono", monospace',
                                                },
                                            }}
                                        />
                                    </ListItem>
                                ))}
                                <ListItem sx={{ py: 0.5, borderTop: "1px solid #ff6f61" }}>
                                    <ListItemText
                                        primary={selectedCategory === "FG%" || selectedCategory === "FT%" ? "Average" : "Total"}
                                        secondary={
                                            selectedCategory === "FG%" || selectedCategory === "FT%"
                                                ? getAverageForTeam(averages.team2Contributions?.[selectedCategory] || [])
                                                : getTotalForTeam(averages.team2Contributions?.[selectedCategory] || [])
                                        }
                                        primaryTypographyProps={{
                                            sx: {
                                                color: "#e0e0e0",
                                                fontFamily: '"Roboto Mono", monospace',
                                                fontWeight: "bold",
                                            },
                                        }}
                                        secondaryTypographyProps={{
                                            sx: {
                                                color: "#ff6f61",
                                                fontFamily: '"Roboto Mono", monospace',
                                                fontWeight: "bold",
                                            },
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            color: "#4CAF50",
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StatsComparisonGraph;

