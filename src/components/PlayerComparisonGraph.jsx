import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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

const PlayerComparisonGraph = ({ 
    players = [], 
    playerNames = [], 
    onClearPlayers = () => {} 
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

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

    const colors = ["#4CAF50", "#ff6f61", "#4a90e2", "#ffc107"];

    const playerDataMap = players.reduce((acc, player) => {
        if (!player || !player.stats || !player.playerName) return acc;
        const playerIdentifier = player.playerName;
        acc[playerIdentifier] = player;
        return acc;
    }, {});

    const validPlayerNames = playerNames.filter(name => 
        name && typeof name === "string" && playerDataMap[name]
    );

    const playerData = categories.map((category) => {
        const dataPoint = { skill: category };
        validPlayerNames.forEach((playerName) => {
            const player = playerDataMap[playerName];
            if (!player || !player.stats) {
                dataPoint[playerName] = 0;
                return;
            }
            let zScore = 0;
            switch (category) {
                case "Points":
                    zScore = player.stats.points_z || 0;
                    break;
                case "3pt":
                    zScore = player.stats.three_pointers_z || 0;
                    break;
                case "Assists":
                    zScore = player.stats.assists_z || 0;
                    break;
                case "Steals":
                    zScore = player.stats.steals_z || 0;
                    break;
                case "FT%":
                    zScore = player.stats.free_throw_percentage_z || 0;
                    break;
                case "FG%":
                    zScore = player.stats.field_goal_percentage_z || 0;
                    break;
                case "Turnovers":
                    zScore = player.stats.turnovers_z || 0;
                    break;
                case "Blocks":
                    zScore = player.stats.blocks_z || 0;
                    break;
                case "Rebounds":
                    zScore = player.stats.rebounds_z || 0;
                    break;
            }
            dataPoint[playerName] = zScore;
        });
        return dataPoint;
    });

    const radarComponents = validPlayerNames.map((playerName, index) => {
        const player = playerDataMap[playerName];
        if (!player) return null;
        
        return (
            <Radar
                key={playerName}
                name={playerName}
                dataKey={playerName}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
                animationDuration={800}
                animationEasing="ease-in-out"
                animationBegin={index * 100}
            />
        );
    }).filter(Boolean);

    if (radarComponents.length === 0) {
        radarComponents.push(
            <Radar
                key="empty"
                name="Empty"
                dataKey="Empty"
                stroke={isDark ? "#666" : "#ccc"}
                fill={isDark ? "#666" : "#ccc"}
                fillOpacity={0.1}
            />
        );
    }

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
    };

    const formatValue = (value, category) => {
        const safeValue = value || 0;
        if (category === "FG%" || category === "FT%") {
            return `${safeValue.toFixed(2)}%`;
        }
        return safeValue.toFixed(2);
    };

    const chartBg = isDark ? "#1e1e1e" : "#ffffff";
    const textColor = isDark ? "#e0e0e0" : "#212121";
    const gridColor = isDark ? "#444" : "#ddd";
    const axisColor = isDark ? "#aaa" : "#666";
    const tooltipBg = isDark ? "#2a2a2a" : "#ffffff";
    const tooltipBorder = isDark ? "#4a90e2" : "#4a90e2";
    const dialogBg = isDark ? "#2a2a2a" : "#ffffff";
    const dialogText = isDark ? "#e0e0e0" : "#212121";

    return (
        <Box sx={{ 
            p: 3, 
            bgcolor: chartBg, 
            borderRadius: 2, 
            mt: 2,
            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.1)",
            border: `1px solid ${isDark ? "#333" : "#ddd"}`,
        }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: textColor,
                            fontFamily: '"Roboto Mono", monospace',
                            fontWeight: "bold",
                        }}
                    >
                        Player Comparison
                    </Typography>
                    <Tooltip 
                        title="Compare up to 4 players using standardized z-scores. Click categories for raw stats."
                        arrow
                        sx={{ 
                            bgcolor: isDark ? "#333" : "#666",
                        }}
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
                {validPlayerNames.length > 0 && (
                    <Button
                        variant="outlined"
                        onClick={onClearPlayers}
                        sx={{
                            color: "#ff6f61",
                            borderColor: "#ff6f61",
                            "&:hover": {
                                borderColor: "#ff6f61",
                                backgroundColor: "rgba(255, 111, 97, 0.1)",
                            },
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Clear All
                    </Button>
                )}
            </Box>

            <Box sx={{ height: "420px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="75%" data={playerData}>
                        <PolarGrid stroke={gridColor} strokeDasharray="3 3" />
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
                            tick={{ fill: axisColor, fontSize: 11 }}
                            stroke={gridColor}
                        />
                        {radarComponents}
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: tooltipBg,
                                border: `1px solid ${tooltipBorder}`,
                                borderRadius: "8px",
                                padding: "10px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            }}
                            itemStyle={{ color: textColor }}
                            labelStyle={{ color: textColor, fontWeight: "bold" }}
                            formatter={(value, name) => {
                                if (name === "Empty") return ["No players selected", name];
                                const category = playerData.find((d) => d[name] === value)?.skill;
                                const player = playerDataMap[name];
                                if (player && player.stats) {
                                    let rawValue = 0;
                                    switch (category) {
                                        case "Points":
                                            rawValue = player.stats.points || 0;
                                            break;
                                        case "3pt":
                                            rawValue = player.stats.three_pointers || 0;
                                            break;
                                        case "Assists":
                                            rawValue = player.stats.assists || 0;
                                            break;
                                        case "Steals":
                                            rawValue = player.stats.steals || 0;
                                            break;
                                        case "FT%":
                                            rawValue = (player.stats.free_throw_percentage || 0) * 100;
                                            break;
                                        case "FG%":
                                            rawValue = (player.stats.field_goal_percentage || 0) * 100;
                                            break;
                                        case "Turnovers":
                                            rawValue = player.stats.turnovers || 0;
                                            break;
                                        case "Blocks":
                                            rawValue = player.stats.blocks || 0;
                                            break;
                                        case "Rebounds":
                                            rawValue = player.stats.rebounds || 0;
                                            break;
                                    }
                                    return [`${formatValue(rawValue, category)} (Z: ${(value || 0).toFixed(2)})`, name];
                                }
                                return [`Z: ${(value || 0).toFixed(2)}`, name];
                            }}
                            cursor={{ stroke: "#4a90e2", strokeWidth: 2, strokeDasharray: "5 5" }}
                        />
                        <Legend
                            wrapperStyle={{
                                fontFamily: '"Roboto Mono", monospace',
                                color: textColor,
                                paddingTop: "20px",
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
                    {selectedCategory && validPlayerNames.length > 0 ? (
                        <Box>
                            {validPlayerNames.map((playerName, index) => {
                                const player = playerDataMap[playerName];
                                const stats = player?.stats || {};
                                let value = 0;

                                switch (selectedCategory) {
                                    case "Points":
                                        value = stats.points || 0;
                                        break;
                                    case "3pt":
                                        value = stats.three_pointers || 0;
                                        break;
                                    case "Assists":
                                        value = stats.assists || 0;
                                        break;
                                    case "Steals":
                                        value = stats.steals || 0;
                                        break;
                                    case "FT%":
                                        value = (stats.free_throw_percentage || 0) * 100;
                                        break;
                                    case "FG%":
                                        value = (stats.field_goal_percentage || 0) * 100;
                                        break;
                                    case "Turnovers":
                                        value = stats.turnovers || 0;
                                        break;
                                    case "Blocks":
                                        value = stats.blocks || 0;
                                        break;
                                    case "Rebounds":
                                        value = stats.rebounds || 0;
                                        break;
                                }

                                const zValue = playerData.find(d => d.skill === selectedCategory)?.[playerName] || 0;

                                return (
                                    <Box 
                                        key={index} 
                                        sx={{ 
                                            mb: 3, 
                                            p: 2, 
                                            bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                                            borderRadius: 1,
                                            border: `1px dashed ${colors[index % colors.length]}33`,
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: colors[index % colors.length],
                                                fontFamily: '"Roboto Mono", monospace',
                                                mb: 1,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {playerName}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: dialogText,
                                                fontFamily: '"Roboto Mono", monospace',
                                                mb: 0.5,
                                            }}
                                        >
                                            Raw: <strong>{formatValue(value, selectedCategory)}</strong>
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: "#4a90e2",
                                                fontFamily: '"Roboto Mono", monospace',
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Z-Score: <strong>{zValue.toFixed(2)}</strong>
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    ) : (
                        <Typography sx={{ color: dialogText, fontFamily: '"Roboto Mono", monospace' }}>
                            No player data available.
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

export default PlayerComparisonGraph;