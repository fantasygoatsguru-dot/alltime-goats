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

    // Auto-load league when selected
    useEffect(() => {
        if (selectedLeague && userId && isConnected && allLeagueTeams.length === 0 && !loading) {
            handleLoadLeague();
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
                        Add your players load them from Yahoo Fantasy
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
        </Box>
    );
};

export default Matchup;