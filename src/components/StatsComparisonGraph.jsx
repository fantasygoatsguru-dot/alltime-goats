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
    useTheme,
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
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

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

    const team1Color = "#4CAF50";
    const team2Color = "#ff6f61";

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

    const chartBg = isDark ? "#1e1e1e" : "#ffffff";
    const textColor = isDark ? "#e0e0e0" : "#212121";
    const gridColor = isDark ? "#444" : "#ddd";
    const axisColor = isDark ? "#aaa" : "#666";
    const tooltipBg = isDark ? "#2a2a2a" : "#ffffff";
    const tooltipBorder = "#4a90e2";
    const dialogBg = isDark ? "#2a2a2a" : "#ffffff";
    const dialogText = isDark ? "#e0e0e0" : "#212121";
    const noDataColor = isDark ? "#b0bec5" : "#666";

    // Custom tick formatter for round numbers (0, 1, 2, 3, 4)
    const radiusTickFormatter = (value) => {
        return Math.round(value); // Shows only whole numbers
    };

    return (
        <Box sx={{ 
            p: 3, 
            bgcolor: chartBg, 
            borderRadius: 2, 
            mt: 2,
            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.1)",
            border: `1px solid ${isDark ? "#333" : "#ddd"}`,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{
                        color: textColor,
                        fontFamily: '"Roboto Mono", monospace',
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    Team Strengths Comparison
                </Typography>
                <Tooltip 
                    title="Compare team strengths using aggregated z-scores. Click categories for player breakdowns."
                    arrow
                >
                    <Box 
                        sx={{ 
                            bgcolor: isDark ? "#444" : "#eee", 
                            borderRadius: '50%', 
                            width: 24, 
                            height: 24, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            cursor: 'help',
                            fontSize: '0.8rem',
                            color: "#4a90e2",
                            fontWeight: 'bold',
                            border: `1px solid ${isDark ? "#4a90e2" : "#666"}`,
                        }}
                    >
                        i
                    </Box>
                </Tooltip>
            </Box>

            {!hasData && (
                <Box sx={{ textAlign: "center", py: 6 }}>
                    <Typography sx={{ color: noDataColor, fontFamily: '"Roboto Mono", monospace', fontSize: "1.1rem" }}>
                        Loading team data or no active players selected...
                    </Typography>
                    <Typography sx={{ color: noDataColor, fontFamily: '"Roboto Mono", monospace', fontSize: "0.9rem", mt: 1, opacity: 0.8 }}>
                        Make sure both teams have active players enabled (eye icon)
                    </Typography>
                </Box>
            )}

            <Box sx={{ height: "440px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="78%" data={data}>
                        <PolarGrid stroke={gridColor} strokeDasharray="4 4" />
                        <PolarAngleAxis
                            dataKey="skill"
                            stroke={axisColor}
                            tick={{
                                fontFamily: '"Roboto Mono", monospace',
                                fontSize: 13,
                                fill: textColor,
                            }}
                            onClick={(e) => handleCategoryClick(e.value)}
                            style={{ cursor: "pointer" }}
                        />
                        <PolarRadiusAxis 
                            angle={90} 
                            domain={[0, 4]} 
                            tick={{ 
                                fill: axisColor, 
                                fontSize: 12,
                                fontFamily: '"Roboto Mono", monospace',
                            }} 
                            tickFormatter={radiusTickFormatter}
                            stroke={gridColor}
                        />
                        <Radar
                            name={team1Name}
                            dataKey={team1Name}
                            stroke={team1Color}
                            fill={team1Color}
                            fillOpacity={0.35}
                            animationDuration={900}
                        />
                        <Radar
                            name={team2Name}
                            dataKey={team2Name}
                            stroke={team2Color}
                            fill={team2Color}
                            fillOpacity={0.35}
                            animationDuration={900}
                        />
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: tooltipBg,
                                border: `1px solid ${tooltipBorder}`,
                                borderRadius: "8px",
                                padding: "12px",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                            }}
                            itemStyle={{ color: textColor }}
                            labelStyle={{ color: textColor, fontWeight: "bold", marginBottom: 8 }}
                            formatter={(value, name) => {
                                const category = data.find((d) => d[name] === value)?.skill;
                                const teamData = name === team1Name ? averages.team1Contributions : averages.team2Contributions;
                                const avgData = name === team1Name ? averages.team1Averages : averages.team2Averages;
                                const rawValue =
                                    category === "FG%" || category === "FT%"
                                        ? avgData?.[category] || 0
                                        : teamData?.[category]?.reduce((sum, player) => sum + (player.value || 0), 0) || 0;
                                return [`${formatValue(rawValue, category)} (Z: ${(value || 0).toFixed(2)})`, name];
                            }}
                            cursor={{ stroke: "#4a90e2", strokeWidth: 2, strokeDasharray: "6 6" }}
                        />
                        <Legend
                            wrapperStyle={{
                                fontFamily: '"Roboto Mono", monospace',
                                color: textColor,
                                paddingTop: "24px",
                            }}
                            iconType="circle"
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </Box>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        bgcolor: dialogBg,
                        borderRadius: 2,
                        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.6)" : "0 8px 32px rgba(0,0,0,0.15)",
                        border: `1px solid ${isDark ? "#444" : "#ddd"}`,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: textColor,
                        fontFamily: '"Roboto Mono", monospace',
                        fontWeight: "bold",
                        borderBottom: `1px solid ${isDark ? "#444" : "#ddd"}`,
                        pb: 2,
                    }}
                >
                    {selectedCategory} Breakdown
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {selectedCategory ? (
                        <Box>
                            {/* Team 1 */}
                            <Typography
                                variant="h6"
                                sx={{
                                    color: team1Color,
                                    fontFamily: '"Roboto Mono", monospace',
                                    mb: 1.5,
                                    fontWeight: "bold",
                                }}
                            >
                                {team1Name}
                            </Typography>
                            <List sx={{ bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)", borderRadius: 1, mb: 3 }}>
                                {averages.team1Contributions?.[selectedCategory]?.map((player, index) => (
                                    <ListItem key={index} sx={{ py: 0.8, borderBottom: index < averages.team1Contributions[selectedCategory].length - 1 ? `1px dashed ${team1Color}33` : "none" }}>
                                        <ListItemText
                                            primary={player.playerName}
                                            secondary={(player.value || 0).toFixed(2)}
                                            primaryTypographyProps={{
                                                sx: { color: dialogText, fontFamily: '"Roboto Mono", monospace', fontSize: "0.95rem" },
                                            }}
                                            secondaryTypographyProps={{
                                                sx: { color: team1Color, fontFamily: '"Roboto Mono", monospace', fontWeight: "bold" },
                                            }}
                                        />
                                    </ListItem>
                                ))}
                                <ListItem sx={{ py: 1, borderTop: `2px solid ${team1Color}`, bgcolor: isDark ? "rgba(76,175,80,0.1)" : "rgba(76,175,80,0.05)" }}>
                                    <ListItemText
                                        primary={selectedCategory === "FG%" || selectedCategory === "FT%" ? "Team Average" : "Team Total"}
                                        secondary={
                                            selectedCategory === "FG%" || selectedCategory === "FT%"
                                                ? getAverageForTeam(averages.team1Contributions?.[selectedCategory] || [])
                                                : getTotalForTeam(averages.team1Contributions?.[selectedCategory] || [])
                                        }
                                        primaryTypographyProps={{
                                            sx: { color: dialogText, fontFamily: '"Roboto Mono", monospace', fontWeight: "bold" },
                                        }}
                                        secondaryTypographyProps={{
                                            sx: { color: team1Color, fontFamily: '"Roboto Mono", monospace', fontWeight: "bold", fontSize: "1.1rem" },
                                        }}
                                    />
                                </ListItem>
                            </List>

                            {/* Team 2 */}
                            <Typography
                                variant="h6"
                                sx={{
                                    color: team2Color,
                                    fontFamily: '"Roboto Mono", monospace',
                                    mb: 1.5,
                                    fontWeight: "bold",
                                }}
                            >
                                {team2Name}
                            </Typography>
                            <List sx={{ bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)", borderRadius: 1 }}>
                                {averages.team2Contributions?.[selectedCategory]?.map((player, index) => (
                                    <ListItem key={index} sx={{ py: 0.8, borderBottom: index < averages.team2Contributions[selectedCategory].length - 1 ? `1px dashed ${team2Color}33` : "none" }}>
                                        <ListItemText
                                            primary={player.playerName}
                                            secondary={(player.value || 0).toFixed(2)}
                                            primaryTypographyProps={{
                                                sx: { color: dialogText, fontFamily: '"Roboto Mono", monospace', fontSize: "0.95rem" },
                                            }}
                                            secondaryTypographyProps={{
                                                sx: { color: team2Color, fontFamily: '"Roboto Mono", monospace', fontWeight: "bold" },
                                            }}
                                        />
                                    </ListItem>
                                ))}
                                <ListItem sx={{ py: 1, borderTop: `2px solid ${team2Color}`, bgcolor: isDark ? "rgba(255,111,97,0.1)" : "rgba(255,111,97,0.05)" }}>
                                    <ListItemText
                                        primary={selectedCategory === "FG%" || selectedCategory === "FT%" ? "Team Average" : "Team Total"}
                                        secondary={
                                            selectedCategory === "FG%" || selectedCategory === "FT%"
                                                ? getAverageForTeam(averages.team2Contributions?.[selectedCategory] || [])
                                                : getTotalForTeam(averages.team2Contributions?.[selectedCategory] || [])
                                        }
                                        primaryTypographyProps={{
                                            sx: { color: dialogText, fontFamily: '"Roboto Mono", monospace', fontWeight: "bold" },
                                        }}
                                        secondaryTypographyProps={{
                                            sx: { color: team2Color, fontFamily: '"Roboto Mono", monospace', fontWeight: "bold", fontSize: "1.1rem" },
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    ) : (
                        <Typography sx={{ color: noDataColor, fontFamily: '"Roboto Mono", monospace', fontStyle: "italic" }}>
                            Select a category on the chart to view details.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ borderTop: `1px solid ${isDark ? "#444" : "#ddd"}`, pt: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            color: "#4a90e2",
                            fontFamily: '"Roboto Mono", monospace',
                            fontWeight: "bold",
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