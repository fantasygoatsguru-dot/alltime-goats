import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SwitchIcon from "@mui/icons-material/SwapHoriz";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
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
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STAT_CATEGORIES = {
    "5": "FG%",
    "8": "FT%",
    "10": "3PT",
    "12": "PTS",
    "15": "REB",
    "16": "AST",
    "17": "ST",
    "18": "BLK",
    "19": "TO",
};

const StatsComparisonGraph = ({ team1Data, team2Data, team1Name, team2Name }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = ["PTS", "3PT", "AST", "ST", "FT%", "FG%", "TO", "BLK", "REB"];

    const calculateTeamAverage = (players, statId) => {
        if (!players || players.length === 0) return 0;
        const activeP = players.filter((p) => p.active);
        if (activeP.length === 0) return 0;
        
        const sum = activeP.reduce((acc, player) => {
            const stat = player.stats?.find((s) => s.statId === statId);
            return acc + (parseFloat(stat?.value) || 0);
        }, 0);
        
        return statId === "5" || statId === "8" ? sum / activeP.length : sum;
    };

    const normalizeValue = (value, category) => {
        const ranges = {
            PTS: [0, 150],
            "3PT": [0, 15],
            AST: [0, 30],
            ST: [0, 10],
            "FT%": [0, 1],
            "FG%": [0, 1],
            TO: [0, 20],
            BLK: [0, 10],
            REB: [0, 50],
        };
        
        const [min, max] = ranges[category] || [0, 100];
        return ((value - min) / (max - min)) * 4;
    };

    const getStatId = (category) => {
        const mapping = {
            PTS: "12",
            "3PT": "10",
            AST: "16",
            ST: "17",
            "FT%": "8",
            "FG%": "5",
            TO: "19",
            BLK: "18",
            REB: "15",
        };
        return mapping[category];
    };

    const data = categories.map((category) => {
        const statId = getStatId(category);
        const team1Value = calculateTeamAverage(team1Data, statId);
        const team2Value = calculateTeamAverage(team2Data, statId);
        
        return {
            skill: category,
            [team1Name]: normalizeValue(team1Value, category),
            [team2Name]: normalizeValue(team2Value, category),
            team1Raw: team1Value,
            team2Raw: team2Value,
        };
    });

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
    };

    const hasData = team1Data?.length > 0 || team2Data?.length > 0;

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
                Team Comparison
            </Typography>
            {!hasData && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography sx={{ color: "#b0bec5", fontFamily: '"Roboto Mono", monospace' }}>
                        Add players to both teams to see comparison
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
                            formatter={(value, name, props) => {
                                const rawValue = name === team1Name ? props.payload.team1Raw : props.payload.team2Raw;
                                return [
                                    `${rawValue.toFixed(2)} (Normalized: ${value.toFixed(2)})`,
                                    name,
                                ];
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
                                {team1Data?.filter((p) => p.active).map((player, index) => {
                                    const statId = getStatId(selectedCategory);
                                    const stat = player.stats?.find((s) => s.statId === statId);
                                    return (
                                        <ListItem key={index} sx={{ py: 0.5 }}>
                                            <ListItemText
                                                primary={player.name}
                                                secondary={(parseFloat(stat?.value) || 0).toFixed(2)}
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
                                    );
                                })}
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
                                {team2Data?.filter((p) => p.active).map((player, index) => {
                                    const statId = getStatId(selectedCategory);
                                    const stat = player.stats?.find((s) => s.statId === statId);
                                    return (
                                        <ListItem key={index} sx={{ py: 0.5 }}>
                                            <ListItemText
                                                primary={player.name}
                                                secondary={(parseFloat(stat?.value) || 0).toFixed(2)}
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
                                    );
                                })}
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

const Matchup = () => {
    const [team1Players, setTeam1Players] = useState([]);
    const [team2Players, setTeam2Players] = useState([]);
    const [team1Name, setTeam1Name] = useState("Team 1");
    const [team2Name, setTeam2Name] = useState("Team 2");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userLeagues, setUserLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    
    // Ref to prevent double-processing of OAuth callback
    const hasProcessedCallback = useRef(false);

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

    const handleLoadMatchup = async () => {
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
                const { team1, team2 } = data.matchup;
                
                setTeam1Name(team1.name);
                setTeam2Name(team2.name);
                
                setTeam1Players(
                    team1.players.map((p) => ({
                        ...p,
                        active: true,
                    }))
                );
                
                setTeam2Players(
                    team2.players.map((p) => ({
                        ...p,
                        active: true,
                    }))
                );
            }
        } catch (err) {
            setError(err.message || "Failed to load matchup");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Prevent double-processing in React Strict Mode
        if (hasProcessedCallback.current) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code && !userId) {
            // Mark as processing immediately
            hasProcessedCallback.current = true;
            
            // Clear the URL immediately to prevent reuse
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
                        setUserId(data.userId);
                        setIsConnected(true);
                        
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
                    if (data?.leagues) {
                        setUserLeagues(data.leagues);
                    }
                })
                .catch((err) => {
                    console.error("Authentication error:", err);
                    setError(err.message || "Failed to complete authentication");
                    // Reset the flag on error so user can retry
                    hasProcessedCallback.current = false;
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [userId]);

    const handleToggleActive = (team, playerKey) => {
        const updatePlayers = team === team1Name ? setTeam1Players : setTeam2Players;
        updatePlayers((prev) =>
            prev.map((player) =>
                player.playerKey === playerKey
                    ? { ...player, active: !player.active }
                    : player
            )
        );
    };

    const handleRemovePlayer = (team, playerKey) => {
        const updatePlayers = team === team1Name ? setTeam1Players : setTeam2Players;
        updatePlayers((prev) => prev.filter((player) => player.playerKey !== playerKey));
    };

    const handleSwitchTeams = () => {
        const tempName = team1Name;
        setTeam1Name(team2Name);
        setTeam2Name(tempName);

        const tempPlayers = team1Players;
        setTeam1Players(team2Players);
        setTeam2Players(tempPlayers);
    };

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
                Yahoo Fantasy Matchup Comparison
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!isConnected ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            color: "#e0e0e0",
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Connect to Yahoo Fantasy to load your current matchup
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleYahooConnect}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <SportsBasketballIcon />}
                        sx={{
                            bgcolor: "#4a90e2",
                            "&:hover": { bgcolor: "#80deea" },
                            fontFamily: '"Roboto Mono", monospace',
                            px: 4,
                            py: 1.5,
                        }}
                    >
                        {loading ? "Connecting..." : "Connect to Yahoo Fantasy"}
                    </Button>
                </Box>
            ) : (
                <>
                    <Box sx={{ mb: 4, p: 2, bgcolor: "#252525", borderRadius: 1 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={8}>
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
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    variant="contained"
                                    onClick={handleLoadMatchup}
                                    disabled={loading || !selectedLeague}
                                    fullWidth
                                    sx={{
                                        bgcolor: "#4a90e2",
                                        "&:hover": { bgcolor: "#80deea" },
                                        height: "56px",
                                        fontFamily: '"Roboto Mono", monospace',
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} /> : "Load Matchup"}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={5}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#4a90e2",
                                    fontFamily: '"Roboto Mono", monospace',
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                {team1Name}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={2}
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
                        <Grid item xs={5}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#4a90e2",
                                    fontFamily: '"Roboto Mono", monospace',
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                {team2Name}
                            </Typography>
                        </Grid>
                    </Grid>

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
                                    {team1Players.map((player) => (
                                        <ListItem
                                            key={player.playerKey}
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
                                                primary={`${player.name} (${player.position})`}
                                                secondary={player.team}
                                                primaryTypographyProps={{
                                                    fontFamily: '"Roboto Mono", monospace',
                                                    color: "#e0e0e0",
                                                }}
                                                secondaryTypographyProps={{
                                                    fontFamily: '"Roboto Mono", monospace',
                                                    color: "#b0bec5",
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
                                                            player.playerKey
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
                                            <Tooltip title="Remove Player" arrow>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() =>
                                                        handleRemovePlayer(
                                                            team1Name,
                                                            player.playerKey
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
                                    ))}
                                </List>
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
                                    {team2Players.map((player) => (
                                        <ListItem
                                            key={player.playerKey}
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
                                                primary={`${player.name} (${player.position})`}
                                                secondary={player.team}
                                                primaryTypographyProps={{
                                                    fontFamily: '"Roboto Mono", monospace',
                                                    color: "#e0e0e0",
                                                }}
                                                secondaryTypographyProps={{
                                                    fontFamily: '"Roboto Mono", monospace',
                                                    color: "#b0bec5",
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
                                                            player.playerKey
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
                                            <Tooltip title="Remove Player" arrow>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() =>
                                                        handleRemovePlayer(
                                                            team2Name,
                                                            player.playerKey
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
                                    ))}
                                </List>
                            </Box>
                        </Grid>
                    </Grid>

                    <StatsComparisonGraph
                        team1Data={team1Players}
                        team2Data={team2Players}
                        team1Name={team1Name}
                        team2Name={team2Name}
                    />
                </>
            )}
        </Box>
    );
};

export default Matchup;

