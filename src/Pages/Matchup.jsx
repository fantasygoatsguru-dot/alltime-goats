import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Box,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Button,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Autocomplete,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Menu,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SwitchIcon from "@mui/icons-material/SwapHoriz";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import AddIcon from "@mui/icons-material/Add";
import RadarIcon from "@mui/icons-material/Radar";
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
import { useAuth } from "../contexts/AuthContext";
import { 
    supabase, 
    fetchAllPlayersFromSupabase as fetchAllPlayers,
    fetchPlayerStatsFromSupabase as fetchPlayerStats,
    fetchWeeklyMatchupResults as fetchWeeklyResults,
    CURRENT_SEASON
} from "../utils/supabase";

const DEFAULT_PLAYERS = {
    team1: [
        { nbaPlayerId: 201939, yahooPlayerId: 4612, name: "Stephen Curry" },
        { nbaPlayerId: 203076, yahooPlayerId: 5007, name: "Anthony Davis" }
    ],
    team2: [
        { nbaPlayerId: 1629029, yahooPlayerId: 6014, name: "Luka Doncic" },
        { nbaPlayerId: 201566, yahooPlayerId: 4563, name: "James Harden" }
    ]
};

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';


// StatsComparisonGraph Component for Team Comparison
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
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    color: "#e0e0e0",
                    fontFamily: '"Roboto Mono", monospace',
                    textAlign: "center",
                    fontWeight: "bold",
                }}
            >
                Team Strengths Comparison
            </Typography>
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

// PlayerComparisonGraph Component
const PlayerComparisonGraph = ({ 
    players = [], 
    playerNames = [], 
    onClearPlayers = () => {} 
}) => {
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

    console.log('PlayerComparisonGraph - players:', players);
    console.log('PlayerComparisonGraph - playerNames:', playerNames);
    
    const playerDataMap = players.reduce((acc, player) => {
        if (!player || !player.stats || !player.playerName) return acc;
        const playerIdentifier = player.playerName;
        acc[playerIdentifier] = player;
        return acc;
    }, {});

    console.log('PlayerComparisonGraph - playerDataMap:', playerDataMap);

    const validPlayerNames = playerNames.filter(name => 
        name && typeof name === "string" && playerDataMap[name]
    );
    
    console.log('PlayerComparisonGraph - validPlayerNames:', validPlayerNames);

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
                stroke="#4a90e2"
                fill="#4a90e2"
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

    return (
        <Box sx={{ p: 2, bgcolor: "#252525", borderRadius: 1, mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography
                    variant="h5"
                    sx={{
                        color: "#e0e0e0",
                        fontFamily: '"Roboto Mono", monospace',
                        fontWeight: "bold",
                    }}
                >
                    Player Comparison
                </Typography>
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
            <Box sx={{ height: "400px" }}>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart outerRadius="70%" data={playerData}>
                        <PolarGrid stroke="#4a90e2" />
                        <PolarAngleAxis
                            dataKey="skill"
                            stroke="#e0e0e0"
                            tick={{
                                fontFamily: '"Roboto Mono", monospace',
                                fontSize: 12,
                            }}
                            onClick={(e) => handleCategoryClick(e.value)}
                            style={{ cursor: "pointer" }}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 4]}
                            tick={false}
                            stroke="#4a90e2"
                        />
                        {radarComponents}
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: "#252525",
                                border: "1px solid #4a90e2",
                                borderRadius: "4px",
                            }}
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
                                return [`${formatValue(value, category)}`, name];
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
                PaperProps={{
                    sx: {
                        bgcolor: "#252525",
                        borderRadius: 1,
                    },
                }}
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

                                return (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: colors[index % colors.length],
                                                fontFamily: '"Roboto Mono", monospace',
                                                mb: 1,
                                            }}
                                        >
                                            {playerName}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: "#e0e0e0",
                                                fontFamily: '"Roboto Mono", monospace',
                                            }}
                                        >
                                            Value: {formatValue(value, selectedCategory)}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            color: "#4a90e2",
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

const Matchup = () => {
    // Team state
    const [team1Players, setTeam1Players] = useState(
        DEFAULT_PLAYERS.team1.map(p => ({ ...p, id: p.nbaPlayerId || p.yahooPlayerId, active: true }))
    );
    const [team2Players, setTeam2Players] = useState(
        DEFAULT_PLAYERS.team2.map(p => ({ ...p, id: p.nbaPlayerId || p.yahooPlayerId, active: true }))
    );
    const [team1Name, setTeam1Name] = useState("Team 1");
    const [team2Name, setTeam2Name] = useState("Team 2");
    
    // Player comparison state
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedPlayerNames, setSelectedPlayerNames] = useState([]);
    const [playerStats, setPlayerStats] = useState([]);
    
    // Player selection state for dropdowns
    const [allPlayers, setAllPlayers] = useState([]);
    const [team1AddPlayer, setTeam1AddPlayer] = useState("");
    const [team2AddPlayer, setTeam2AddPlayer] = useState("");
    
    // Weekly matchup results state
    const [weeklyResults, setWeeklyResults] = useState([]);
    const [openWeekDialog, setOpenWeekDialog] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);
    
    // Current matchup state
    const [currentMatchup, setCurrentMatchup] = useState(null);
    const [matchupProjection, setMatchupProjection] = useState(null);
    const [scheduleData, setScheduleData] = useState(null);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [disabledPlayers, setDisabledPlayers] = useState(() => {
        const saved = localStorage.getItem('disabledPlayers');
        return saved ? JSON.parse(saved) : {};
    });
    const [playerStatusMenu, setPlayerStatusMenu] = useState(null);
    const [selectedPlayerForMenu, setSelectedPlayerForMenu] = useState(null);
    
    // Player status handlers
    const handlePlayerClick = (event, player, dateStr) => {
        setPlayerStatusMenu(event.currentTarget);
        setSelectedPlayerForMenu({ ...player, dateStr });
    };

    const handleClosePlayerMenu = () => {
        setPlayerStatusMenu(null);
        setSelectedPlayerForMenu(null);
    };

    // Recalculate projections on the frontend only (no API calls)
    const recalculateProjectionWithDisabledPlayers = (updatedDisabledPlayers) => {
        if (!matchupProjection) return;

        const isPlayerAutoDisabled = (player) => {
            const position = player.selectedPosition || player.selected_position;
            const status = player.status;
            return position === 'IL+' || position === 'IL' || status === 'INJ' || status === 'OUT';
        };

        // Helper to recalculate daily projections for a team
        const recalculateDailyProjections = (dailyProjections) => {
            return dailyProjections.map(day => {
                const newTotals = {
                    points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
                    threePointers: 0, turnovers: 0,
                    fieldGoalsMade: 0, fieldGoalsAttempted: 0,
                    freeThrowsMade: 0, freeThrowsAttempted: 0
                };

                const updatedPlayers = day.players.map(player => {
                    const autoDisabled = isPlayerAutoDisabled(player);
                    const manuallyDisabled = updatedDisabledPlayers[player.id] === 'disabled' || updatedDisabledPlayers[player.id] === 'disabledForWeek';
                    const isDisabled = autoDisabled || manuallyDisabled;

                    // Only add to totals if player is enabled
                    if (!isDisabled) {
                        newTotals.points += player.stats.points || 0;
                        newTotals.rebounds += player.stats.rebounds || 0;
                        newTotals.assists += player.stats.assists || 0;
                        newTotals.steals += player.stats.steals || 0;
                        newTotals.blocks += player.stats.blocks || 0;
                        newTotals.threePointers += player.stats.threePointers || 0;
                        newTotals.turnovers += player.stats.turnovers || 0;
                        newTotals.fieldGoalsMade += player.stats.fieldGoalsMade || 0;
                        newTotals.fieldGoalsAttempted += player.stats.fieldGoalsAttempted || 0;
                        newTotals.freeThrowsMade += player.stats.freeThrowsMade || 0;
                        newTotals.freeThrowsAttempted += player.stats.freeThrowsAttempted || 0;
                    }

                    return { ...player, disabled: isDisabled };
                });

                return { ...day, players: updatedPlayers, totals: newTotals };
            });
        };

        // Recalculate both teams
        const team1Updated = {
            ...matchupProjection.team1,
            dailyProjections: recalculateDailyProjections(matchupProjection.team1.dailyProjections)
        };

        const team2Updated = {
            ...matchupProjection.team2,
            dailyProjections: recalculateDailyProjections(matchupProjection.team2.dailyProjections)
        };

        // Recalculate category results
        const categoryResults = {};
        let team1Score = 0;
        let team2Score = 0;

        const categories = ['points', 'rebounds', 'assists', 'steals', 'blocks', 'threePointers', 'turnovers'];
        
        categories.forEach(cat => {
            const team1Total = team1Updated.dailyProjections.reduce((sum, day) => sum + (day.totals[cat] || 0), 0);
            const team2Total = team2Updated.dailyProjections.reduce((sum, day) => sum + (day.totals[cat] || 0), 0);
            
            let winner = 'Tie';
            if (cat === 'turnovers') {
                if (team1Total < team2Total) { winner = team1Updated.name; team1Score++; }
                else if (team2Total < team1Total) { winner = team2Updated.name; team2Score++; }
            } else {
                if (team1Total > team2Total) { winner = team1Updated.name; team1Score++; }
                else if (team2Total > team1Total) { winner = team2Updated.name; team2Score++; }
            }
            
            categoryResults[cat] = { team1: team1Total, team2: team2Total, winner };
        });

        // FG%
        const team1FgMade = team1Updated.dailyProjections.reduce((sum, day) => sum + (day.totals.fieldGoalsMade || 0), 0);
        const team1FgAttempted = team1Updated.dailyProjections.reduce((sum, day) => sum + (day.totals.fieldGoalsAttempted || 0), 0);
        const team2FgMade = team2Updated.dailyProjections.reduce((sum, day) => sum + (day.totals.fieldGoalsMade || 0), 0);
        const team2FgAttempted = team2Updated.dailyProjections.reduce((sum, day) => sum + (day.totals.fieldGoalsAttempted || 0), 0);
        
        const t1FgPct = team1FgAttempted > 0 ? (team1FgMade / team1FgAttempted) * 100 : 0;
        const t2FgPct = team2FgAttempted > 0 ? (team2FgMade / team2FgAttempted) * 100 : 0;
        
        let fgWinner = 'Tie';
        if (t1FgPct > t2FgPct) { fgWinner = team1Updated.name; team1Score++; }
        else if (t2FgPct > t1FgPct) { fgWinner = team2Updated.name; team2Score++; }
        
        categoryResults.fieldGoalPercentage = {
            winner: fgWinner,
            team1: t1FgPct,
            team2: t2FgPct,
            team1Made: team1FgMade,
            team1Attempted: team1FgAttempted,
            team2Made: team2FgMade,
            team2Attempted: team2FgAttempted
        };

        // FT%
        const team1FtMade = team1Updated.dailyProjections.reduce((sum, day) => sum + (day.totals.freeThrowsMade || 0), 0);
        const team1FtAttempted = team1Updated.dailyProjections.reduce((sum, day) => sum + (day.totals.freeThrowsAttempted || 0), 0);
        const team2FtMade = team2Updated.dailyProjections.reduce((sum, day) => sum + (day.totals.freeThrowsMade || 0), 0);
        const team2FtAttempted = team2Updated.dailyProjections.reduce((sum, day) => sum + (day.totals.freeThrowsAttempted || 0), 0);
        
        const t1FtPct = team1FtAttempted > 0 ? (team1FtMade / team1FtAttempted) * 100 : 0;
        const t2FtPct = team2FtAttempted > 0 ? (team2FtMade / team2FtAttempted) * 100 : 0;
        
        let ftWinner = 'Tie';
        if (t1FtPct > t2FtPct) { ftWinner = team1Updated.name; team1Score++; }
        else if (t2FtPct > t1FtPct) { ftWinner = team2Updated.name; team2Score++; }
        
        categoryResults.freeThrowPercentage = {
            winner: ftWinner,
            team1: t1FtPct,
            team2: t2FtPct,
            team1Made: team1FtMade,
            team1Attempted: team1FtAttempted,
            team2Made: team2FtMade,
            team2Attempted: team2FtAttempted
        };

        // Update the matchup projection
        setMatchupProjection({
            ...matchupProjection,
            team1: team1Updated,
            team2: team2Updated,
            categoryResults,
            team1Score,
            team2Score
        });
    };

    const handlePlayerStatusChange = (newStatus) => {
        if (!selectedPlayerForMenu) return;
        
        const playerId = selectedPlayerForMenu.id;
        const updatedDisabledPlayers = { ...disabledPlayers };
        
        if (newStatus === 'enabled') {
            delete updatedDisabledPlayers[playerId];
        } else {
            updatedDisabledPlayers[playerId] = newStatus;
        }
        
        setDisabledPlayers(updatedDisabledPlayers);
        localStorage.setItem('disabledPlayers', JSON.stringify(updatedDisabledPlayers));
        
        // Recalculate projection with updated disabled players (frontend only, no API calls)
        recalculateProjectionWithDisabledPlayers(updatedDisabledPlayers);
        
        handleClosePlayerMenu();
    };
    
    // Auth context
    const { user, isAuthenticated, login } = useAuth();
    const userId = user?.userId || null;
    const isConnected = isAuthenticated;
    
    // Loading and error state
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Yahoo Fantasy state
    const [userLeagues, setUserLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState("");
    const [allLeagueTeams, setAllLeagueTeams] = useState([]);
    const [selectedTeam1, setSelectedTeam1] = useState("");
    const [selectedTeam2, setSelectedTeam2] = useState("");
    
    // Ref to prevent double-processing of OAuth callback
    const hasProcessedCallback = useRef(false);

    const fetchAllPlayersFromSupabase = useCallback(async () => {
        return await fetchAllPlayers();
    }, []);

    const fetchWeeklyMatchupResults = useCallback(async (team1PlayersList, team2PlayersList) => {
        return await fetchWeeklyResults(team1PlayersList, team2PlayersList, team1Name, team2Name);
    }, [team1Name, team2Name]);

    const fetchPlayerStatsFromSupabase = useCallback(async (players) => {
        return await fetchPlayerStats(players, team1Players, team2Players, team1Name, team2Name);
    }, [team1Players, team2Players, team1Name, team2Name]);

    const callSupabaseFunction = async (functionName, payload) => {
        const { data, error } = await supabase.functions.invoke(functionName, {
            body: payload,
        });

        if (error) throw error;
        return data;
    };

    const handleYahooConnect = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await callSupabaseFunction("yahoo-oauth", {
                action: "authorize",
                isDev: isDev,
            });

            if (data.authUrl) {
                window.location.href = data.authUrl;
            }
        } catch (err) {
            setError(err.message || "Failed to connect to Yahoo");
        } finally {
            setLoading(false);
        }
    };

    const handleFetchCurrentMatchup = async () => {
        if (!selectedLeague || !userId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await callSupabaseFunction("yahoo-fantasy-api", {
                action: "getCurrentMatchup",
                userId: userId,
                leagueId: selectedLeague,
            });

            if (data.matchup) {
                setCurrentMatchup(data.matchup);
                
                // Set the teams as default
                setTeam1Name(data.matchup.team1.name);
                setTeam2Name(data.matchup.team2.name);
                
                setSelectedTeam1(data.matchup.team1.name);
                setSelectedTeam2(data.matchup.team2.name);
                
                // Set the players for both teams
                setTeam1Players(
                    data.matchup.team1.players.map((p) => ({
                        id: p.nbaPlayerId || p.yahooPlayerId,
                        name: p.name,
                        yahooPlayerId: p.yahooPlayerId,
                        nbaPlayerId: p.nbaPlayerId,
                        active: true,
                    }))
                );
                
                setTeam2Players(
                    data.matchup.team2.players.map((p) => ({
                        id: p.nbaPlayerId || p.yahooPlayerId,
                        name: p.name,
                        yahooPlayerId: p.yahooPlayerId,
                        nbaPlayerId: p.nbaPlayerId,
                        active: true,
                    }))
                );

                // Calculate projection after setting matchup
                if (scheduleData) {
                    calculateMatchupProjection(data.matchup);
                }
            }
        } catch (err) {
            console.error("Error fetching current matchup:", err);
            setError(err.message || "Failed to fetch current matchup");
        } finally {
            setLoading(false);
        }
    };

    const calculateMatchupProjection = async (matchup) => {
        if (!scheduleData || !matchup) return;

        try {
            // Get current matchup week dates (Monday to Sunday)
            const getCurrentWeekDates = () => {
                const now = new Date();
                const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
                // Calculate days to Monday (if today is Monday, daysToMonday = 0; if Sunday, = -6)
                const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() + daysToMonday);
                weekStart.setHours(0, 0, 0, 0);
                
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6); // Sunday
                weekEnd.setHours(23, 59, 59, 999);
                
                return { weekStart, weekEnd, currentDate: now };
            };

            const { weekStart, weekEnd, currentDate } = getCurrentWeekDates();

            // Get player IDs and their NBA teams
            const getPlayerTeams = async (players) => {
                const playerIds = players.map(p => p.nbaPlayerId || p.yahooPlayerId || p.id).filter(Boolean);
                
                if (playerIds.length === 0) return [];

                // Try to get teams from yahoo_nba_mapping using both nba_id and yahoo_id
                const { data, error } = await supabase
                    .from('yahoo_nba_mapping')
                    .select('nba_id, yahoo_id, name, team')
                    .or(`nba_id.in.(${playerIds.join(',')}),yahoo_id.in.(${playerIds.join(',')})`);

                if (error) throw error;

                return players.map(p => {
                    const playerId = p.nbaPlayerId || p.yahooPlayerId || p.id;
                    // Try to find by nba_id first, then yahoo_id
                    const playerInfo = data.find(pi => pi.nba_id === playerId || pi.yahoo_id === playerId);
                    return {
                        ...p,
                        nbaTeam: playerInfo?.team || null,
                        playerName: playerInfo?.name || p.name
                    };
                });
            };

            // Get player averages
            const getPlayerAverages = async (players) => {
                const playerIds = players.map(p => p.nbaPlayerId || p.yahooPlayerId || p.id).filter(Boolean);
                
                if (playerIds.length === 0) return {};

                const { data, error } = await supabase
                    .from('player_season_averages')
                    .select('*')
                    .eq('season', CURRENT_SEASON)
                    .in('player_id', playerIds);

                if (error) throw error;

                const averages = {};
                data.forEach(row => {
                    averages[row.player_id] = {
                        points: row.points_per_game || 0,
                        rebounds: row.rebounds_per_game || 0,
                        assists: row.assists_per_game || 0,
                        steals: row.steals_per_game || 0,
                        blocks: row.blocks_per_game || 0,
                        threePointers: row.three_pointers_per_game || 0,
                        turnovers: row.turnovers_per_game || 0,
                        fieldGoalsMade: row.field_goals_per_game || 0,
                        fieldGoalsAttempted: row.field_goals_attempted_per_game || 0,
                        freeThrowsMade: row.free_throws_per_game || 0,
                        freeThrowsAttempted: row.free_throws_attempted_per_game || 0,
                    };
                });

                return averages;
            };

            // Get actual stats for games already played this week
            const getActualStats = async (players) => {
                const playerIds = players.map(p => p.nbaPlayerId || p.yahooPlayerId || p.id).filter(Boolean);
                
                if (playerIds.length === 0) return {};

                const { data, error } = await supabase
                    .from('player_game_logs')
                    .select('*')
                    .eq('season', CURRENT_SEASON)
                    .in('player_id', playerIds)
                    .gte('game_date', weekStart.toISOString().split('T')[0])
                    .lt('game_date', currentDate.toISOString().split('T')[0])
                    .order('game_date', { ascending: true });

                if (error) throw error;

                // Aggregate stats per player
                const stats = {};
                data.forEach(game => {
                    if (!stats[game.player_id]) {
                        stats[game.player_id] = {
                            points: 0,
                            rebounds: 0,
                            assists: 0,
                            steals: 0,
                            blocks: 0,
                            threePointers: 0,
                            turnovers: 0,
                            fieldGoalsMade: 0,
                            fieldGoalsAttempted: 0,
                            freeThrowsMade: 0,
                            freeThrowsAttempted: 0,
                            gamesPlayed: 0
                        };
                    }
                    stats[game.player_id].points += game.points || 0;
                    stats[game.player_id].rebounds += game.rebounds || 0;
                    stats[game.player_id].assists += game.assists || 0;
                    stats[game.player_id].steals += game.steals || 0;
                    stats[game.player_id].blocks += game.blocks || 0;
                    stats[game.player_id].threePointers += game.three_pointers_made || 0;
                    stats[game.player_id].turnovers += game.turnovers || 0;
                    stats[game.player_id].fieldGoalsMade += game.field_goals_made || 0;
                    stats[game.player_id].fieldGoalsAttempted += game.field_goals_attempted || 0;
                    stats[game.player_id].freeThrowsMade += game.free_throws_made || 0;
                    stats[game.player_id].freeThrowsAttempted += game.free_throws_attempted || 0;
                    stats[game.player_id].gamesPlayed += 1;
                });

                return stats;
            };

            // Process both teams
            const team1WithTeams = await getPlayerTeams(matchup.team1.players);
            const team2WithTeams = await getPlayerTeams(matchup.team2.players);

            const team1Averages = await getPlayerAverages(team1WithTeams);
            const team2Averages = await getPlayerAverages(team2WithTeams);

            const team1Actual = await getActualStats(team1WithTeams);
            const team2Actual = await getActualStats(team2WithTeams);

            // Helper to check if player should be auto-disabled
            const isPlayerAutoDisabled = (player) => {
                const position = player.selectedPosition || player.selected_position;
                const status = player.status;
                return position === 'IL+' || position === 'IL' || status === 'INJ' || status === 'OUT';
            };

            // Calculate projected stats with daily breakdown
            const calculateTeamProjection = (players, averages, actualStats) => {
                const actual = {
                    points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
                    threePointers: 0, turnovers: 0,
                    fieldGoalsMade: 0, fieldGoalsAttempted: 0,
                    freeThrowsMade: 0, freeThrowsAttempted: 0
                };
                
                // Daily projections - one for each day of the week
                const dailyProjections = [];
                const current = new Date(weekStart);
                const todayStr = currentDate.toISOString().split('T')[0];
                
                for (let i = 0; i < 7; i++) {
                    const dateStr = current.toISOString().split('T')[0];
                    const dayOfWeek = current.toLocaleDateString('en-US', { weekday: 'short' });
                    const monthDay = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const isToday = dateStr === todayStr;
                    // Compare dates properly, not strings
                    const currentDayStart = new Date(current);
                    currentDayStart.setHours(0, 0, 0, 0);
                    const todayStart = new Date(currentDate);
                    todayStart.setHours(0, 0, 0, 0);
                    const isPast = currentDayStart < todayStart;
                    
                    const dayStats = {
                        date: dateStr,
                        dayOfWeek,
                        monthDay,
                        isPast,
                        isToday,
                        players: [],
                        totals: {
                            points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
                            threePointers: 0, turnovers: 0,
                            fieldGoalsMade: 0, fieldGoalsAttempted: 0,
                            freeThrowsMade: 0, freeThrowsAttempted: 0
                        }
                    };
                    
                    if (!isPast) {
                        // Get players with games on this date (including today)
                        players.forEach(player => {
                            const playerId = player.nbaPlayerId || player.yahooPlayerId || player.id;
                            const playerKey = `${playerId}`;
                            const playerAvg = averages[playerId] || {};
                            const teamsPlaying = scheduleData[dateStr];
                            
                            if (teamsPlaying && player.nbaTeam && teamsPlaying.includes(player.nbaTeam)) {
                                const autoDisabled = isPlayerAutoDisabled(player);
                                const manuallyDisabled = disabledPlayers[playerKey] === 'disabled' || disabledPlayers[playerKey] === 'disabledForWeek';
                                const isDisabled = autoDisabled || manuallyDisabled;
                                
                                dayStats.players.push({
                                    id: playerKey,
                                    name: player.playerName || player.name,
                                    team: player.nbaTeam,
                                    stats: playerAvg,
                                    disabled: isDisabled,
                                    autoDisabled,
                                    status: player.status,
                                    selectedPosition: player.selectedPosition || player.selected_position
                                });
                                
                                // Only add to totals if player is enabled
                                if (!isDisabled) {
                                    dayStats.totals.points += playerAvg.points || 0;
                                    dayStats.totals.rebounds += playerAvg.rebounds || 0;
                                    dayStats.totals.assists += playerAvg.assists || 0;
                                    dayStats.totals.steals += playerAvg.steals || 0;
                                    dayStats.totals.blocks += playerAvg.blocks || 0;
                                    dayStats.totals.threePointers += playerAvg.threePointers || 0;
                                    dayStats.totals.turnovers += playerAvg.turnovers || 0;
                                    dayStats.totals.fieldGoalsMade += playerAvg.fieldGoalsMade || 0;
                                    dayStats.totals.fieldGoalsAttempted += playerAvg.fieldGoalsAttempted || 0;
                                    dayStats.totals.freeThrowsMade += playerAvg.freeThrowsMade || 0;
                                    dayStats.totals.freeThrowsAttempted += playerAvg.freeThrowsAttempted || 0;
                                }
                            }
                        });
                    }
                    
                    dailyProjections.push(dayStats);
                    current.setDate(current.getDate() + 1);
                }

                // Calculate actual stats from games already played
                players.forEach(player => {
                    const playerId = player.nbaPlayerId || player.yahooPlayerId || player.id;
                    const playerActual = actualStats[playerId] || {};

                    Object.keys(actual).forEach(key => {
                        actual[key] += playerActual[key] || 0;
                    });
                });

                // Sum up all projected stats from daily projections
                const projected = {
                    points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
                    threePointers: 0, turnovers: 0,
                    fieldGoalsMade: 0, fieldGoalsAttempted: 0,
                    freeThrowsMade: 0, freeThrowsAttempted: 0
                };
                
                dailyProjections.forEach(day => {
                    if (!day.isPast) {
                        Object.keys(projected).forEach(key => {
                            projected[key] += day.totals[key];
                        });
                    }
                });

                const total = {};
                Object.keys(actual).forEach(key => {
                    total[key] = actual[key] + projected[key];
                });

                return { actual, projected, total, dailyProjections };
            };

            const team1Projection = calculateTeamProjection(team1WithTeams, team1Averages, team1Actual);
            const team2Projection = calculateTeamProjection(team2WithTeams, team2Averages, team2Actual);

            // Calculate category winners
            const categories = ['points', 'rebounds', 'assists', 'steals', 'blocks', 'threePointers'];
            const categoryResults = {};
            let team1Score = 0;
            let team2Score = 0;

            categories.forEach(cat => {
                const t1 = team1Projection.total[cat];
                const t2 = team2Projection.total[cat];
                
                if (t1 > t2) {
                    categoryResults[cat] = { winner: matchup.team1.name, team1: t1, team2: t2 };
                    team1Score++;
                } else if (t2 > t1) {
                    categoryResults[cat] = { winner: matchup.team2.name, team1: t1, team2: t2 };
                    team2Score++;
                } else {
                    categoryResults[cat] = { winner: 'Tie', team1: t1, team2: t2 };
                }
            });

            // Handle percentages
            const t1FgPct = team1Projection.total.fieldGoalsAttempted > 0 
                ? (team1Projection.total.fieldGoalsMade / team1Projection.total.fieldGoalsAttempted) * 100 
                : 0;
            const t2FgPct = team2Projection.total.fieldGoalsAttempted > 0 
                ? (team2Projection.total.fieldGoalsMade / team2Projection.total.fieldGoalsAttempted) * 100 
                : 0;

            if (t1FgPct > t2FgPct) {
                categoryResults.fieldGoalPercentage = { 
                    winner: matchup.team1.name, 
                    team1: t1FgPct, 
                    team2: t2FgPct,
                    team1Made: team1Projection.total.fieldGoalsMade,
                    team1Attempted: team1Projection.total.fieldGoalsAttempted,
                    team2Made: team2Projection.total.fieldGoalsMade,
                    team2Attempted: team2Projection.total.fieldGoalsAttempted
                };
                team1Score++;
            } else if (t2FgPct > t1FgPct) {
                categoryResults.fieldGoalPercentage = { 
                    winner: matchup.team2.name, 
                    team1: t1FgPct, 
                    team2: t2FgPct,
                    team1Made: team1Projection.total.fieldGoalsMade,
                    team1Attempted: team1Projection.total.fieldGoalsAttempted,
                    team2Made: team2Projection.total.fieldGoalsMade,
                    team2Attempted: team2Projection.total.fieldGoalsAttempted
                };
                team2Score++;
            } else {
                categoryResults.fieldGoalPercentage = { 
                    winner: 'Tie', 
                    team1: t1FgPct, 
                    team2: t2FgPct,
                    team1Made: team1Projection.total.fieldGoalsMade,
                    team1Attempted: team1Projection.total.fieldGoalsAttempted,
                    team2Made: team2Projection.total.fieldGoalsMade,
                    team2Attempted: team2Projection.total.fieldGoalsAttempted
                };
            }

            const t1FtPct = team1Projection.total.freeThrowsAttempted > 0 
                ? (team1Projection.total.freeThrowsMade / team1Projection.total.freeThrowsAttempted) * 100 
                : 0;
            const t2FtPct = team2Projection.total.freeThrowsAttempted > 0 
                ? (team2Projection.total.freeThrowsMade / team2Projection.total.freeThrowsAttempted) * 100 
                : 0;

            if (t1FtPct > t2FtPct) {
                categoryResults.freeThrowPercentage = { 
                    winner: matchup.team1.name, 
                    team1: t1FtPct, 
                    team2: t2FtPct,
                    team1Made: team1Projection.total.freeThrowsMade,
                    team1Attempted: team1Projection.total.freeThrowsAttempted,
                    team2Made: team2Projection.total.freeThrowsMade,
                    team2Attempted: team2Projection.total.freeThrowsAttempted
                };
                team1Score++;
            } else if (t2FtPct > t1FtPct) {
                categoryResults.freeThrowPercentage = { 
                    winner: matchup.team2.name, 
                    team1: t1FtPct, 
                    team2: t2FtPct,
                    team1Made: team1Projection.total.freeThrowsMade,
                    team1Attempted: team1Projection.total.freeThrowsAttempted,
                    team2Made: team2Projection.total.freeThrowsMade,
                    team2Attempted: team2Projection.total.freeThrowsAttempted
                };
                team2Score++;
            } else {
                categoryResults.freeThrowPercentage = { 
                    winner: 'Tie', 
                    team1: t1FtPct, 
                    team2: t2FtPct,
                    team1Made: team1Projection.total.freeThrowsMade,
                    team1Attempted: team1Projection.total.freeThrowsAttempted,
                    team2Made: team2Projection.total.freeThrowsMade,
                    team2Attempted: team2Projection.total.freeThrowsAttempted
                };
            }

            // Turnovers (lower is better)
            const t1To = team1Projection.total.turnovers;
            const t2To = team2Projection.total.turnovers;
            if (t1To < t2To) {
                categoryResults.turnovers = { winner: matchup.team1.name, team1: t1To, team2: t2To };
                team1Score++;
            } else if (t2To < t1To) {
                categoryResults.turnovers = { winner: matchup.team2.name, team1: t1To, team2: t2To };
                team2Score++;
            } else {
                categoryResults.turnovers = { winner: 'Tie', team1: t1To, team2: t2To };
            }

            setMatchupProjection({
                weekStart: weekStart.toLocaleDateString(),
                weekEnd: weekEnd.toLocaleDateString(),
                currentDate: currentDate.toLocaleDateString(),
                team1: {
                    name: matchup.team1.name,
                    ...team1Projection
                },
                team2: {
                    name: matchup.team2.name,
                    ...team2Projection
                },
                categoryResults,
                team1Score,
                team2Score
            });

        } catch (error) {
            console.error('Error calculating matchup projection:', error);
        }
    };

    const handleLoadLeague = async () => {
        if (!selectedLeague || !userId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await callSupabaseFunction("yahoo-fantasy-api", {
                action: "getAllTeamsInLeague",
                userId: userId,
                leagueId: selectedLeague,
            });

            if (data.teams && data.teams.length > 0) {
                setAllLeagueTeams(data.teams);
                // Set first two teams as default
                setSelectedTeam1(data.teams[0].name);
                setSelectedTeam2(data.teams.length > 1 ? data.teams[1].name : data.teams[0].name);
                
                setTeam1Name(data.teams[0].name);
                setTeam2Name(data.teams.length > 1 ? data.teams[1].name : data.teams[0].name);
                
                setTeam1Players(
                    data.teams[0].players.map((p) => ({
                        id: p.nbaPlayerId || p.yahooPlayerId,
                        name: p.name,
                        yahooPlayerId: p.yahooPlayerId,
                        nbaPlayerId: p.nbaPlayerId,
                        active: true,
                    }))
                );
                
                setTeam2Players(
                    data.teams.length > 1 
                        ? data.teams[1].players.map((p) => ({
                            id: p.nbaPlayerId || p.yahooPlayerId,
                            name: p.name,
                            yahooPlayerId: p.yahooPlayerId,
                            nbaPlayerId: p.nbaPlayerId,
                            active: true,
                        }))
                        : []
                );
            }
        } catch (err) {
            setError(err.message || "Failed to load league");
        } finally {
            setLoading(false);
        }
    };

    const handleTeamSelect = async (teamPosition, teamName) => {
        if (teamPosition === "team1") {
            setSelectedTeam1(teamName);
        } else {
            setSelectedTeam2(teamName);
        }

        const selectedTeam = allLeagueTeams.find(t => t.name === teamName);
        if (!selectedTeam) return;

        const players = selectedTeam.players.map((p) => ({
            id: p.nbaPlayerId || p.yahooPlayerId,
            name: p.name,
            yahooPlayerId: p.yahooPlayerId,
            nbaPlayerId: p.nbaPlayerId,
            active: true,
        }));

        if (teamPosition === "team1") {
            setTeam1Name(teamName);
            setTeam1Players(players);
        } else {
            setTeam2Name(teamName);
            setTeam2Players(players);
        }
    };

    // Player manipulation handlers
    const handleToggleActive = (team, playerName) => {
        const updatePlayers = team === team1Name ? setTeam1Players : setTeam2Players;
        updatePlayers((prev) =>
            prev.map((player) =>
                player.name === playerName
                    ? { ...player, active: !player.active }
                    : player
            )
        );
    };

    const handleRemovePlayer = (team, playerName) => {
        const updatePlayers = team === team1Name ? setTeam1Players : setTeam2Players;
        updatePlayers((prev) => 
            prev.filter((player) => player.name !== playerName)
        );
    };

    const handleSwitchTeams = () => {
        const tempName = team1Name;
        setTeam1Name(team2Name);
        setTeam2Name(tempName);

        const tempSelected = selectedTeam1;
        setSelectedTeam1(selectedTeam2);
        setSelectedTeam2(tempSelected);

        const tempPlayers = team1Players;
        setTeam1Players(team2Players);
        setTeam2Players(tempPlayers);
    };

    const handleAddPlayerTeam1 = () => {
        if (team1AddPlayer) {
            const playerToAdd = allPlayers.find(p => p.name === team1AddPlayer);
            if (playerToAdd) {
                console.log('Adding player to team1:', playerToAdd);
                setTeam1Players(prev => [...prev, { 
                    id: playerToAdd.id,
                    name: playerToAdd.name,
                    nbaPlayerId: playerToAdd.id,
                    yahooPlayerId: null,
                    active: true 
                }]);
                setTeam1AddPlayer("");
            }
        }
    };

    const handleAddPlayerTeam2 = () => {
        if (team2AddPlayer) {
            const playerToAdd = allPlayers.find(p => p.name === team2AddPlayer);
            if (playerToAdd) {
                console.log('Adding player to team2:', playerToAdd);
                setTeam2Players(prev => [...prev, { 
                    id: playerToAdd.id,
                    name: playerToAdd.name,
                    nbaPlayerId: playerToAdd.id,
                    yahooPlayerId: null,
                    active: true 
                }]);
                setTeam2AddPlayer("");
            }
        }
    };

    const handleAddToComparison = (playerName, playerId, nbaPlayerId, yahooPlayerId) => {
        console.log('=== handleAddToComparison CALLED ===');
        console.log('Player Name:', playerName);
        console.log('Player ID:', playerId);
        console.log('NBA Player ID:', nbaPlayerId);
        console.log('Yahoo Player ID:', yahooPlayerId);
        console.log('Current selectedPlayerNames BEFORE:', selectedPlayerNames);
        console.log('Current selectedPlayers BEFORE:', selectedPlayers);
        
        const playerIdentifier = playerName;
        const existingIndex = selectedPlayerNames.indexOf(playerIdentifier);
        console.log('Player identifier:', playerIdentifier);
        console.log('Existing index:', existingIndex);

        if (existingIndex !== -1) {
            // Unselect player
            console.log('REMOVING player from comparison');
            const newPlayers = [...selectedPlayers];
            const newNames = [...selectedPlayerNames];
            newPlayers.splice(existingIndex, 1);
            newNames.splice(existingIndex, 1);
            console.log('New players AFTER removal:', newPlayers);
            console.log('New names AFTER removal:', newNames);
            setSelectedPlayers(newPlayers);
            setSelectedPlayerNames(newNames);
            return;
        }

        // Select player (max 4)
        const newPlayer = { 
            id: nbaPlayerId || yahooPlayerId || playerId, 
            name: playerName, 
            nbaPlayerId, 
            yahooPlayerId 
        };
        console.log('New player object created:', newPlayer);
        
        if (selectedPlayers.length < 4) {
            const updatedPlayers = [...selectedPlayers, newPlayer];
            const updatedNames = [...selectedPlayerNames, playerIdentifier];
            console.log('ADDING player to comparison (< 4 players)');
            console.log('Updated players:', updatedPlayers);
            console.log('Updated names:', updatedNames);
            setSelectedPlayers(updatedPlayers);
            setSelectedPlayerNames(updatedNames);
        } else {
            const updatedPlayers = [...selectedPlayers.slice(1), newPlayer];
            const updatedNames = [...selectedPlayerNames.slice(1), playerIdentifier];
            console.log('REPLACING player in comparison (>= 4 players)');
            console.log('Updated players:', updatedPlayers);
            console.log('Updated names:', updatedNames);
            setSelectedPlayers(updatedPlayers);
            setSelectedPlayerNames(updatedNames);
        }
    };

    // Load all players on mount
    useEffect(() => {
        const loadPlayers = async () => {
            try {
                const players = await fetchAllPlayersFromSupabase();
                setAllPlayers(players);
            } catch (error) {
                console.error("Error loading players:", error);
                setError("Failed to load players from database");
            }
        };
        loadPlayers();
    }, [fetchAllPlayersFromSupabase]);

    // Load schedule data
    useEffect(() => {
        const loadSchedule = async () => {
            try {
                const response = await fetch('/data/schedule.json');
                const data = await response.json();
                setScheduleData(data);
            } catch (error) {
                console.error('Failed to load schedule:', error);
            }
        };
        loadSchedule();
    }, []);

    // Recalculate projection when schedule data loads or matchup changes
    useEffect(() => {
        if (scheduleData && currentMatchup) {
            calculateMatchupProjection(currentMatchup);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduleData, currentMatchup]);

    // Auto-load league when selected
    useEffect(() => {
        if (selectedLeague && userId && isConnected && allLeagueTeams.length === 0 && !loading) {
            handleLoadLeague();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLeague, userId, isConnected]);

    // Auto-fetch current matchup when league is available
    useEffect(() => {
        if (selectedLeague && userId && isConnected && !currentMatchup && !loading) {
            handleFetchCurrentMatchup();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLeague, userId, isConnected]);

    // Fetch player stats whenever teams change
    useEffect(() => {
        console.log('=== useEffect TRIGGERED for player stats fetch ===');
        console.log('team1Players:', team1Players);
        console.log('team2Players:', team2Players);
        console.log('selectedPlayers:', selectedPlayers);
        
        const fetchStats = async () => {
            try {
                const activeTeam1Players = team1Players.filter((player) => player.active);
                const activeTeam2Players = team2Players.filter((player) => player.active);

                console.log('Active team1 players:', activeTeam1Players);
                console.log('Active team2 players:', activeTeam2Players);

                const allPlayersToFetch = [
                    ...activeTeam1Players.map((player) => ({
                        id: player.nbaPlayerId || player.yahooPlayerId || player.id,
                        team: "team1",
                    })),
                    ...activeTeam2Players.map((player) => ({
                        id: player.nbaPlayerId || player.yahooPlayerId || player.id,
                        team: "team2",
                    })),
                    ...selectedPlayers.map((player) => ({
                        id: player.nbaPlayerId || player.yahooPlayerId || player.id,
                        team: null,
                    })),
                ];

                const seen = new Set();
                const uniquePlayers = allPlayersToFetch.filter((player) => {
                    if (!seen.has(player.id)) {
                        seen.add(player.id);
                        return true;
                    }
                    return false;
                });

                console.log('Fetching stats for unique players:', uniquePlayers);
                console.log('Selected players:', selectedPlayers);
                console.log('Team1 players:', team1Players);
                console.log('Team2 players:', team2Players);
                
                const data = await fetchPlayerStatsFromSupabase(uniquePlayers);
                
                console.log('Fetched data:', data);
                
                const teamAveragesEntry = data.find((entry) => entry.teamAverages);
                const playerStatsData = data.filter((entry) => entry.stats && entry.playerName);
                
                console.log('Player stats data:', playerStatsData);
                console.log('Team averages:', teamAveragesEntry);
                
                setPlayerStats([
                    ...playerStatsData,
                    ...(teamAveragesEntry ? [{ teamAverages: teamAveragesEntry.teamAverages }] : []),
                ]);
            } catch (error) {
                console.error("Error fetching player stats:", error);
            } finally {
                if (initialLoading) {
                    setInitialLoading(false);
                }
            }
        };

        fetchStats();
    }, [team1Players, team2Players, selectedPlayers, fetchPlayerStatsFromSupabase, initialLoading]);

    // OAuth callback handler
    useEffect(() => {
        if (hasProcessedCallback.current) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code && !userId) {
            hasProcessedCallback.current = true;
            window.history.replaceState({}, document.title, "/matchup");
            
            setLoading(true);
            console.log("Processing OAuth callback with code:", code.substring(0, 10) + "...");
            
            callSupabaseFunction("yahoo-oauth", {
                action: "callback",
                code: code,
                isDev: isDev,
            })
                .then((data) => {
                    console.log("OAuth callback response:", data);
                    if (data.success) {
                        login({
                            userId: data.userId,
                            email: data.email,
                            name: data.name,
                            profilePicture: data.profilePicture,
                            expiresAt: data.expiresAt,
                        });
                        
                        console.log("Fetching user leagues for userId:", data.userId);
                        return callSupabaseFunction("yahoo-fantasy-api", {
                            action: "getUserLeagues",
                            userId: data.userId,
                        });
                    } else {
                        throw new Error("OAuth callback did not return success");
                    }
                })
                .then((data) => {
                    console.log("User leagues response:", data);
                    if (data?.leagues && data.leagues.length > 0) {
                        setUserLeagues(data.leagues);
                        // Auto-select first league
                        setSelectedLeague(data.leagues[0].leagueId);
                    }
                })
                .catch((err) => {
                    console.error("Authentication error:", err);
                    setError(err.message || "Failed to complete authentication");
                    hasProcessedCallback.current = false;
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [userId, login]);

    // Auto-fetch leagues when user is already authenticated
    useEffect(() => {
        if (isAuthenticated && userId && userLeagues.length === 0 && !loading && !hasProcessedCallback.current) {
            console.log("User is authenticated, fetching leagues for userId:", userId);
            setLoading(true);
            callSupabaseFunction("yahoo-fantasy-api", {
                action: "getUserLeagues",
                userId: userId,
            })
                .then((data) => {
                    console.log("User leagues response:", data);
                    if (data?.leagues && data.leagues.length > 0) {
                        setUserLeagues(data.leagues);
                        setSelectedLeague(data.leagues[0].leagueId);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching leagues:", err);
                    setError(err.message || "Failed to fetch leagues");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isAuthenticated, userId, userLeagues.length, loading]);

    // Fetch weekly matchup results when teams change
    useEffect(() => {
        const fetchWeeklyResults = async () => {
            try {
                const activeTeam1 = team1Players.filter(p => p.active);
                const activeTeam2 = team2Players.filter(p => p.active);

                if (activeTeam1.length > 0 && activeTeam2.length > 0) {
                    const results = await fetchWeeklyMatchupResults(team1Players, team2Players);
                    setWeeklyResults(results);
                } else {
                    setWeeklyResults([]);
                }
            } catch (error) {
                console.error("Error fetching weekly results:", error);
            }
        };

        fetchWeeklyResults();
    }, [team1Players, team2Players, fetchWeeklyMatchupResults]);

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

    // Show loading state on initial load
    if (initialLoading) {
        return (
            <Box
                sx={{
                    p: 2,
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)",
                    color: "#e0e0e0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: 2,
                minHeight: "100vh",
                background: "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)",
                color: "#e0e0e0",
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    mb: 3,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#4a90e2",
                    fontFamily: '"Roboto Mono", monospace',
                }}
            >
                Team Matchup Comparison
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Yahoo Fantasy Connection (Optional) */}
            {!isConnected && (
                <Box sx={{ mb: 4, p: 2, bgcolor: "#252525", borderRadius: 1, textAlign: "center" }}>
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 2,
                            color: "#e0e0e0",
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Add your players or load them from Yahoo Fantasy
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={handleYahooConnect}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <SportsBasketballIcon />}
                        sx={{
                            color: "#4a90e2",
                            borderColor: "#4a90e2",
                            "&:hover": {
                                borderColor: "#80deea",
                                bgcolor: "rgba(74, 144, 226, 0.1)",
                            },
                            fontFamily: '"Roboto Mono", monospace',
                            px: 4,
                            py: 1.5,
                        }}
                    >
                        {loading ? "Connecting..." : "Connect to Yahoo Fantasy"}
                    </Button>
                </Box>
            )}

            {/* Yahoo League Selection */}
            {isConnected && userLeagues.length > 0 && (
                    <Box sx={{ mb: 4, p: 2, bgcolor: "#252525", borderRadius: 1 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel
                                        sx={{
                                            color: "#b0bec5",
                                            "&.Mui-focused": { color: "#4a90e2" },
                                        }}
                                    >
                                        Select League
                                    </InputLabel>
                                    <Select
                                        value={selectedLeague}
                                        onChange={(e) => setSelectedLeague(e.target.value)}
                                        label="Select League"
                                        sx={{
                                            bgcolor: "#252525",
                                            color: "#e0e0e0",
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#4a90e2",
                                            },
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#80deea",
                                            },
                                            "& .MuiSelect-icon": { color: "#4a90e2" },
                                        }}
                                    >
                                        {userLeagues.map((league) => (
                                            <MenuItem key={league.leagueId} value={league.leagueId}>
                                                {league.name} ({league.season})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {loading && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2 }}>
                                        <CircularProgress size={20} />
                                        <Typography
                                            sx={{
                                                color: "#e0e0e0",
                                                fontFamily: '"Roboto Mono", monospace',
                                            }}
                                        >
                                            Loading league data...
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
            )}

            {/* Team Selection Dropdowns */}
            {isConnected && allLeagueTeams.length > 0 && (
                <Box sx={{ mb: 4, p: 2, bgcolor: "#252525", borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <FormControl fullWidth>
                                <InputLabel
                                    sx={{
                                        color: "#b0bec5",
                                        "&.Mui-focused": { color: "#4a90e2" },
                                        fontFamily: '"Roboto Mono", monospace',
                                    }}
                                >
                                    Team 1
                                </InputLabel>
                                <Select
                                    value={selectedTeam1}
                                    onChange={(e) => handleTeamSelect("team1", e.target.value)}
                                    label="Team 1"
                                    sx={{
                                        bgcolor: "#252525",
                                        color: "#e0e0e0",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#4a90e2",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#80deea",
                                        },
                                        "& .MuiSelect-icon": { color: "#4a90e2" },
                                        fontFamily: '"Roboto Mono", monospace',
                                    }}
                                >
                                    {allLeagueTeams.map((team) => (
                                        <MenuItem 
                                            key={team.key} 
                                            value={team.name}
                                            disabled={team.name === selectedTeam2}
                                            sx={{
                                                fontFamily: '"Roboto Mono", monospace',
                                                "&.Mui-disabled": { opacity: 0.5 },
                                            }}
                                        >
                                            {team.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={2}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <IconButton
                                onClick={handleSwitchTeams}
                                sx={{
                                    color: "#4a90e2",
                                    "&:hover": {
                                        color: "#80deea",
                                        backgroundColor: "rgba(74, 144, 226, 0.1)",
                                    },
                                }}
                            >
                                <SwitchIcon fontSize="large" />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <FormControl fullWidth>
                                <InputLabel
                                    sx={{
                                        color: "#b0bec5",
                                        "&.Mui-focused": { color: "#4a90e2" },
                                        fontFamily: '"Roboto Mono", monospace',
                                    }}
                                >
                                    Team 2
                                </InputLabel>
                                <Select
                                    value={selectedTeam2}
                                    onChange={(e) => handleTeamSelect("team2", e.target.value)}
                                    label="Team 2"
                                    sx={{
                                        bgcolor: "#252525",
                                        color: "#e0e0e0",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#4a90e2",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#80deea",
                                        },
                                        "& .MuiSelect-icon": { color: "#4a90e2" },
                                        fontFamily: '"Roboto Mono", monospace',
                                    }}
                                >
                                    {allLeagueTeams.map((team) => (
                                        <MenuItem 
                                            key={team.key} 
                                            value={team.name}
                                            disabled={team.name === selectedTeam1}
                                            sx={{
                                                fontFamily: '"Roboto Mono", monospace',
                                                "&.Mui-disabled": { opacity: 0.5 },
                                            }}
                                        >
                                            {team.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Loading Spinner Overlay */}
            {loading && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <Box sx={{ textAlign: "center" }}>
                        <CircularProgress size={60} sx={{ color: "#4a90e2" }} />
                        <Typography
                            sx={{
                                mt: 2,
                                color: "#e0e0e0",
                                fontFamily: '"Roboto Mono", monospace',
                            }}
                        >
                            Loading league data...
                        </Typography>
                    </Box>
                </Box>
            )}


            {/* Team Rosters */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <List
                                    sx={{
                                        bgcolor: "#252525",
                                        borderRadius: 1,
                                        p: 1,
                                        maxHeight: 400,
                                        overflow: "auto",
                                    }}
                        >
                            {team1Players.map((player, index) => {
                                console.log('Team1 Player:', player);
                                return (
                                <ListItem
                                    key={`${player.id}-${index}`}
                                    sx={{
                                        py: 0.5,
                                        px: 1,
                                        mb: 0.5,
                                        borderRadius: 1,
                                        bgcolor: player.active
                                            ? "rgba(74, 144, 226, 0.1)"
                                            : "rgba(158, 158, 158, 0.1)",
                                        border: `1px solid ${
                                            player.active
                                                ? "rgba(74, 144, 226, 0.2)"
                                                : "rgba(158, 158, 158, 0.2)"
                                        }`,
                                    }}
                                >
                                    <ListItemText
                                        primary={player.name}
                                        primaryTypographyProps={{
                                            fontFamily: '"Roboto Mono", monospace',
                                            color: "#e0e0e0",
                                            fontSize: "0.875rem",
                                        }}
                                    />
                                    <Tooltip
                                        title={
                                            player.active
                                                ? "Disable Player"
                                                : "Enable Player"
                                        }
                                        arrow
                                    >
                                        <IconButton
                                            edge="end"
                                            aria-label="toggle active"
                                            onClick={() =>
                                                handleToggleActive(
                                                    team1Name,
                                                    player.name
                                                )
                                            }
                                            size="small"
                                            sx={{
                                                color: player.active
                                                    ? "#4a90e2"
                                                    : "#b0bec5",
                                                "&:hover": {
                                                    bgcolor: "rgba(74, 144, 226, 0.2)",
                                                },
                                            }}
                                        >
                                            {player.active ? (
                                                <VisibilityIcon />
                                            ) : (
                                                <VisibilityOffIcon />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={selectedPlayerNames.includes(player.name) ? "Remove from Comparison" : "Add to Comparison"} arrow>
                                        <IconButton
                                            edge="end"
                                            aria-label="compare"
                                            onClick={() => handleAddToComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)}
                                            size="small"
                                            sx={{
                                                color: selectedPlayerNames.includes(player.name)
                                                    ? "#4a90e2"
                                                    : "#4CAF50",
                                                bgcolor: selectedPlayerNames.includes(player.name)
                                                    ? "rgba(74, 144, 226, 0.2)"
                                                    : "transparent",
                                                "&:hover": {
                                                    bgcolor: selectedPlayerNames.includes(player.name)
                                                        ? "rgba(74, 144, 226, 0.3)"
                                                        : "rgba(76, 175, 80, 0.2)",
                                                },
                                            }}
                                        >
                                            <RadarIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Remove Player" arrow>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() =>
                                                handleRemovePlayer(
                                                    team1Name,
                                                    player.name
                                                )
                                            }
                                            size="small"
                                            sx={{
                                                color: "#ff6f61",
                                                "&:hover": {
                                                    bgcolor: "rgba(255, 111, 97, 0.2)",
                                                },
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </ListItem>
                            )})}
                        </List>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2, p: 1 }}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel 
                                    sx={{ 
                                        color: "#b0bec5",
                                        fontFamily: "'Roboto Mono', monospace",
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Add Player
                                </InputLabel>
                                <Select
                                    value={team1AddPlayer}
                                    onChange={(e) => setTeam1AddPlayer(e.target.value)}
                                    label="Add Player"
                                    sx={{
                                        bgcolor: "#252525",
                                        color: "#e0e0e0",
                                        borderRadius: 1,
                                        fontFamily: "'Roboto Mono', monospace",
                                        fontSize: '0.875rem',
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#4a90e2" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#80deea" },
                                        "& .MuiSelect-icon": { color: "#4a90e2" }
                                    }}
                                >
                                    {allPlayers
                                        .filter(player => !team1Players.some(p => p.name === player.name))
                                        .map((player) => (
                                            <MenuItem 
                                                key={player.id} 
                                                value={player.name}
                                                sx={{
                                                    fontFamily: "'Roboto Mono', monospace",
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                {player.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                onClick={handleAddPlayerTeam1}
                                disabled={!team1AddPlayer}
                                sx={{
                                    bgcolor: "#4a90e2",
                                    color: "#e0e0e0",
                                    fontFamily: "'Roboto Mono', monospace",
                                    "&:hover": {
                                        bgcolor: "#80deea"
                                    },
                                    "&.Mui-disabled": {
                                        bgcolor: "#b0bec5",
                                        color: "#e0e0e0"
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <List
                                    sx={{
                                        bgcolor: "#252525",
                                        borderRadius: 1,
                                        p: 1,
                                        maxHeight: 400,
                                        overflow: "auto",
                                    }}
                        >
                            {team2Players.map((player, index) => {
                                console.log('Team2 Player:', player);
                                return (
                                <ListItem
                                    key={`${player.id}-${index}`}
                                    sx={{
                                        py: 0.5,
                                        px: 1,
                                        mb: 0.5,
                                        borderRadius: 1,
                                        bgcolor: player.active
                                            ? "rgba(74, 144, 226, 0.1)"
                                            : "rgba(158, 158, 158, 0.1)",
                                        border: `1px solid ${
                                            player.active
                                                ? "rgba(74, 144, 226, 0.2)"
                                                : "rgba(158, 158, 158, 0.2)"
                                        }`,
                                    }}
                                >
                                    <ListItemText
                                        primary={player.name}
                                        primaryTypographyProps={{
                                            fontFamily: '"Roboto Mono", monospace',
                                            color: "#e0e0e0",
                                            fontSize: "0.875rem",
                                        }}
                                    />
                                    <Tooltip
                                        title={
                                            player.active
                                                ? "Disable Player"
                                                : "Enable Player"
                                        }
                                        arrow
                                    >
                                        <IconButton
                                            edge="end"
                                            aria-label="toggle active"
                                            onClick={() =>
                                                handleToggleActive(
                                                    team2Name,
                                                    player.name
                                                )
                                            }
                                            size="small"
                                            sx={{
                                                color: player.active
                                                    ? "#4a90e2"
                                                    : "#b0bec5",
                                                "&:hover": {
                                                    bgcolor: "rgba(74, 144, 226, 0.2)",
                                                },
                                            }}
                                        >
                                            {player.active ? (
                                                <VisibilityIcon />
                                            ) : (
                                                <VisibilityOffIcon />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={selectedPlayerNames.includes(player.name) ? "Remove from Comparison" : "Add to Comparison"} arrow>
                                        <IconButton
                                            edge="end"
                                            aria-label="compare"
                                            onClick={() => handleAddToComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)}
                                            size="small"
                                            sx={{
                                                color: selectedPlayerNames.includes(player.name)
                                                    ? "#4a90e2"
                                                    : "#4CAF50",
                                                bgcolor: selectedPlayerNames.includes(player.name)
                                                    ? "rgba(74, 144, 226, 0.2)"
                                                    : "transparent",
                                                "&:hover": {
                                                    bgcolor: selectedPlayerNames.includes(player.name)
                                                        ? "rgba(74, 144, 226, 0.3)"
                                                        : "rgba(76, 175, 80, 0.2)",
                                                },
                                            }}
                                        >
                                            <RadarIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Remove Player" arrow>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() =>
                                                handleRemovePlayer(
                                                    team2Name,
                                                    player.name
                                                )
                                            }
                                            size="small"
                                            sx={{
                                                color: "#ff6f61",
                                                "&:hover": {
                                                    bgcolor: "rgba(255, 111, 97, 0.2)",
                                                },
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </ListItem>
                            )})}
                        </List>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2, p: 1 }}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel 
                                    sx={{ 
                                        color: "#b0bec5",
                                        fontFamily: "'Roboto Mono', monospace",
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Add Player
                                </InputLabel>
                                <Select
                                    value={team2AddPlayer}
                                    onChange={(e) => setTeam2AddPlayer(e.target.value)}
                                    label="Add Player"
                                    sx={{
                                        bgcolor: "#252525",
                                        color: "#e0e0e0",
                                        borderRadius: 1,
                                        fontFamily: "'Roboto Mono', monospace",
                                        fontSize: '0.875rem',
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#4a90e2" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#80deea" },
                                        "& .MuiSelect-icon": { color: "#4a90e2" }
                                    }}
                                >
                                    {allPlayers
                                        .filter(player => !team2Players.some(p => p.name === player.name))
                                        .map((player) => (
                                            <MenuItem 
                                                key={player.id} 
                                                value={player.name}
                                                sx={{
                                                    fontFamily: "'Roboto Mono', monospace",
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                {player.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                onClick={handleAddPlayerTeam2}
                                disabled={!team2AddPlayer}
                                sx={{
                                    bgcolor: "#4a90e2",
                                    color: "#e0e0e0",
                                    fontFamily: "'Roboto Mono', monospace",
                                    "&:hover": {
                                        bgcolor: "#80deea"
                                    },
                                    "&.Mui-disabled": {
                                        bgcolor: "#b0bec5",
                                        color: "#e0e0e0"
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Comparison Graphs */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <StatsComparisonGraph
                        teamAverages={playerStats.find((p) => p.teamAverages)?.teamAverages || null}
                        team1Name={team1Name}
                        team2Name={team2Name}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <PlayerComparisonGraph
                        players={playerStats.filter(p => p.stats && p.playerName)}
                        playerNames={selectedPlayerNames}
                        onClearPlayers={() => {
                            setSelectedPlayers([]);
                            setSelectedPlayerNames([]);
                        }}
                    />
                </Grid>
            </Grid>

            {/* Weekly Matchup Results */}
            {weeklyResults.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 3,
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "#4a90e2",
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Weekly Matchup Results
                    </Typography>
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
                                            color: "#e0e0e0",
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
            )}

            {/* Week Detail Dialog */}
            <Dialog
                open={openWeekDialog}
                onClose={handleCloseWeekDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        bgcolor: "#252525",
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
                                                    color: "#e0e0e0"
                                                }}>{row.category}</TableCell>
                                                <TableCell align="right" sx={{
                                                    fontFamily: '"Roboto Mono", monospace',
                                                    color: "#e0e0e0"
                                                }}>{row.t1Value}</TableCell>
                                                <TableCell align="right" sx={{
                                                    fontFamily: '"Roboto Mono", monospace',
                                                    color: "#e0e0e0"
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

            {/* Current Yahoo Matchup - Week Tracker */}
            {matchupProjection && (
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
                            Matchup Projection Tracker (Week {currentMatchup.week})
                        </Typography>
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
                            title="This tracker shows your matchup week (Monday-Sunday). Past days show '-', today and future days show projected stats based on scheduled games and player averages. Click any category to see player details. Click individual players to enable/disable them from projections."
                        >
                            i
                        </Box>
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
                                    color: matchupProjection.team1Score > matchupProjection.team2Score ? "#4CAF50" : matchupProjection.team1Score < matchupProjection.team2Score ? "#666" : "#b0bec5",
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
                                {/* Render each category with day-by-day breakdown */}
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
                                                                                            onClick={(e) => handlePlayerClick(e, player, day.date)}
                                                                                            sx={{ 
                                                                                                color: isDisabled ? '#666' : '#4CAF50', 
                                                                                                display: 'block', 
                                                                                                fontSize: '0.7rem', 
                                                                                                ml: 1,
                                                                                                cursor: 'pointer',
                                                                                                textDecoration: isDisabled ? 'line-through' : 'none',
                                                                                                opacity: isDisabled ? 0.6 : 1,
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
                                                                                            onClick={(e) => handlePlayerClick(e, player, day.date)}
                                                                                            sx={{ 
                                                                                                color: isDisabled ? '#666' : '#ff6f61', 
                                                                                                display: 'block', 
                                                                                                fontSize: '0.7rem', 
                                                                                                ml: 1,
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
            )}

            {/* Player Status Menu */}
            <Menu
                anchorEl={playerStatusMenu}
                open={Boolean(playerStatusMenu)}
                onClose={handleClosePlayerMenu}
                PaperProps={{
                    sx: {
                        bgcolor: '#252525',
                        border: '1px solid #333',
                        minWidth: 200
                    }
                }}
            >
                <MenuItem 
                    onClick={() => handlePlayerStatusChange('enabled')}
                    sx={{ 
                        color: '#e0e0e0',
                        '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.2)' }
                    }}
                >
                    ✓ Enable Player
                </MenuItem>
                <MenuItem 
                    onClick={() => handlePlayerStatusChange('disabled')}
                    sx={{ 
                        color: '#e0e0e0',
                        '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
                    }}
                >
                    ✗ Disable Player
                </MenuItem>
                <MenuItem 
                    onClick={() => handlePlayerStatusChange('disabledForWeek')}
                    sx={{ 
                        color: '#e0e0e0',
                        '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.2)' }
                    }}
                >
                    ⊗ Disable for Week
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Matchup;