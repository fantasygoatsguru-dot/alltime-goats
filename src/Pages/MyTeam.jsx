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
    Tooltip,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import AddIcon from "@mui/icons-material/Add";
import RadarIcon from "@mui/icons-material/Radar";
import { useAuth } from "../contexts/AuthContext";
import { useLeague } from "../contexts/LeagueContext";
import { 
    supabase, 
    fetchAllPlayersFromSupabase as fetchAllPlayers,
    fetchPlayerStatsFromSupabase as fetchPlayerStats,
    CURRENT_SEASON
} from "../utils/supabase";
import YahooConnectionSection from "../components/YahooConnectionSection";
import StatsComparisonGraph from "../components/StatsComparisonGraph";
import PlayerComparisonGraph from "../components/PlayerComparisonGraph";
import ReassuringLoader from "../components/ReassuringLoader";

const DEFAULT_TEAM_PLAYERS = [
    { nbaPlayerId: 201939, yahooPlayerId: 4612, name: "Stephen Curry" },
    { nbaPlayerId: 203076, yahooPlayerId: 5007, name: "Anthony Davis" },
    { nbaPlayerId: 1628378, yahooPlayerId: 1628378, name: "Donovan Mitchell" },
    { nbaPlayerId: 1630166, yahooPlayerId: 1630166, name: "Deni Avdija" },
    { nbaPlayerId: 203507, yahooPlayerId: 4896, name: "Giannis Antetokounmpo" },
];

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const MyTeam = () => {
    // Team state
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [teamName, setTeamName] = useState("My Team");
    
    // Player comparison state
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedPlayerNames, setSelectedPlayerNames] = useState([]);
    const [playerStats, setPlayerStats] = useState([]);
    
    // Player selection state for dropdown
    const [allPlayers, setAllPlayers] = useState([]);
    const [addPlayer, setAddPlayer] = useState("");
    
    // Auth context
    const { isAuthenticated, ensureValidToken } = useAuth();
    const isConnected = isAuthenticated;
    
    // League context
    const { userLeagues, leagueTeams } = useLeague();
    
    // Loading and error state
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Ref to prevent double-processing
    const hasInitializedDefaults = useRef(false);
    const loadingTimeoutRef = useRef(null);

    // Safety timeout to ensure loading doesn't get stuck
    useEffect(() => {
        // Set a maximum timeout for initial loading (3 seconds)
        loadingTimeoutRef.current = setTimeout(() => {
            if (initialLoading) {
                console.warn('Loading timeout reached, forcing completion');
                setInitialLoading(false);
            }
        }, 3000);

        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, [initialLoading]);

    const fetchAllPlayersFromSupabase = useCallback(async () => {
        return await fetchAllPlayers();
    }, []);

    const fetchPlayerStatsFromSupabase = useCallback(async (players) => {
        return await fetchPlayerStats(players, teamPlayers, []);
    }, [teamPlayers]);

    const callSupabaseFunction = async (functionName, payload) => {
        if (functionName === "yahoo-fantasy-api" && ensureValidToken) {
            const isValid = await ensureValidToken();
            if (!isValid) {
                throw new Error("Unable to refresh authentication. Please log in again.");
            }
        }

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
            // Store current path for OAuth return
            sessionStorage.setItem('oauth_return_path', '/my-team');
            
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

    // Player manipulation handlers
    const handleToggleActive = (playerName) => {
        setTeamPlayers((prev) =>
            prev.map((player) =>
                player.name === playerName
                    ? { ...player, active: !player.active }
                    : player
            )
        );
    };

    const handleRemovePlayer = (playerName) => {
        setTeamPlayers((prev) => 
            prev.filter((player) => player.name !== playerName)
        );
    };

    const handleAddPlayer = () => {
        if (addPlayer) {
            const playerToAdd = allPlayers.find(p => p.name === addPlayer);
            if (playerToAdd) {
                console.log('Adding player to team:', playerToAdd);
                setTeamPlayers(prev => [...prev, { 
                    id: playerToAdd.id,
                    name: playerToAdd.name,
                    nbaPlayerId: playerToAdd.id,
                    yahooPlayerId: null,
                    active: true 
                }]);
                setAddPlayer("");
            }
        }
    };

    // Helper function to check if a player is in comparison
    const isPlayerInComparison = (playerName, playerId, nbaPlayerId, yahooPlayerId) => {
        return selectedPlayers.some(sp => {
            return sp.name === playerName || 
                   sp.id === (nbaPlayerId || yahooPlayerId || playerId) ||
                   selectedPlayerNames.includes(playerName);
        });
    };

    const handleAddToComparison = (playerName, playerId, nbaPlayerId, yahooPlayerId) => {
        const existingIndex = selectedPlayers.findIndex(sp => 
            sp.name === playerName || sp.id === (nbaPlayerId || yahooPlayerId || playerId)
        );

        if (existingIndex !== -1) {
            // Remove player
            const newPlayers = [...selectedPlayers];
            const newNames = [...selectedPlayerNames];
            newPlayers.splice(existingIndex, 1);
            newNames.splice(existingIndex, 1);
            setSelectedPlayers(newPlayers);
            setSelectedPlayerNames(newNames);
            return;
        }

        // Add player (max 4)
        const newPlayer = { 
            id: nbaPlayerId || yahooPlayerId || playerId, 
            name: playerName, 
            nbaPlayerId: nbaPlayerId || null, 
            yahooPlayerId: yahooPlayerId || null 
        };
        
        if (selectedPlayers.length < 4) {
            setSelectedPlayers([...selectedPlayers, newPlayer]);
            setSelectedPlayerNames([...selectedPlayerNames, playerName]);
        } else {
            // Replace oldest player
            setSelectedPlayers([...selectedPlayers.slice(1), newPlayer]);
            setSelectedPlayerNames([...selectedPlayerNames.slice(1), playerName]);
        }
    };

    // Initialize DEFAULT_TEAM_PLAYERS if team is empty (only if not connected to Yahoo)
    useEffect(() => {
        if (!hasInitializedDefaults.current && !isConnected && teamPlayers.length === 0) {
            hasInitializedDefaults.current = true;
            const defaultTeam = DEFAULT_TEAM_PLAYERS.map((p) => ({
                id: p.nbaPlayerId || p.yahooPlayerId,
                name: p.name,
                yahooPlayerId: p.yahooPlayerId,
                nbaPlayerId: p.nbaPlayerId,
                active: true,
            }));
            setTeamPlayers(defaultTeam);
            // Stop initial loading after setting default players
            if (initialLoading) {
                setTimeout(() => setInitialLoading(false), 500);
            }
        }
    }, [isConnected, initialLoading, teamPlayers.length]);

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

    // Load user's team when connected and league is selected - USE CONTEXT DATA
    useEffect(() => {
        if (!isConnected || !leagueTeams || leagueTeams.length === 0) {
            return;
        }
        
        try {
            // Get the user's team from league teams context (no API call needed)
            const myTeam = leagueTeams.find(team => team.is_owned_by_current_login);
            if (myTeam) {
                console.log('Loading user team from context:', myTeam.name);
                setTeamName(myTeam.name);
                setTeamPlayers(
                    myTeam.players.map((p) => ({
                        id: p.nbaPlayerId || p.yahooPlayerId,
                        name: p.name,
                        yahooPlayerId: p.yahooPlayerId,
                        nbaPlayerId: p.nbaPlayerId,
                        active: true,
                    }))
                );
                // Stop loading after team is loaded
                if (initialLoading) {
                    setTimeout(() => setInitialLoading(false), 500);
                }
            }
        } catch (err) {
            console.error("Error loading user team:", err);
            setError(err.message || "Failed to load your team");
            setInitialLoading(false);
        }
    }, [isConnected, leagueTeams, initialLoading]);

    // Fetch player stats whenever team changes
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const activeTeamPlayers = teamPlayers.filter((player) => player.active);

                if (activeTeamPlayers.length === 0 && selectedPlayers.length === 0) {
                    // No players to fetch, stop loading
                    setInitialLoading(false);
                    return;
                }

                const allPlayersToFetch = [
                    ...activeTeamPlayers.map((player) => ({
                        id: player.nbaPlayerId || player.yahooPlayerId || player.id,
                        team: "team1",
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

                if (uniquePlayers.length > 0) {
                    const data = await fetchPlayerStatsFromSupabase(uniquePlayers);
                    
                    const teamAveragesEntry = data.find((entry) => entry.teamAverages);
                    const playerStatsData = data.filter((entry) => entry.stats && entry.playerName);
                    
                    setPlayerStats([
                        ...playerStatsData,
                        ...(teamAveragesEntry ? [{ teamAverages: teamAveragesEntry.teamAverages }] : []),
                    ]);
                }
                
                // Always stop loading after stats are fetched
                setInitialLoading(false);
            } catch (error) {
                console.error("Error fetching player stats:", error);
                setInitialLoading(false);
            }
        };

        // Only fetch if we have players
        if (teamPlayers.length > 0) {
            fetchStats();
        }
    }, [teamPlayers, selectedPlayers, fetchPlayerStatsFromSupabase]);

    // Calculate team totals
    const calculateTeamTotals = () => {
        const activePlayerStats = playerStats.filter(p => 
            p.stats && p.playerName && 
            teamPlayers.some(tp => tp.active && tp.name === p.playerName)
        );

        const totals = {
            points: 0,
            rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            threePointers: 0,
            turnovers: 0,
            fieldGoalPercentage: 0,
            freeThrowPercentage: 0,
            gamesPlayed: 0
        };

        let fgMadeTotal = 0;
        let fgAttemptedTotal = 0;
        let ftMadeTotal = 0;
        let ftAttemptedTotal = 0;

        activePlayerStats.forEach(player => {
            if (player.stats) {
                totals.points += player.stats.points || 0;
                totals.rebounds += player.stats.rebounds || 0;
                totals.assists += player.stats.assists || 0;
                totals.steals += player.stats.steals || 0;
                totals.blocks += player.stats.blocks || 0;
                totals.threePointers += player.stats.threePointers || 0;
                totals.turnovers += player.stats.turnovers || 0;
                totals.gamesPlayed += player.stats.gamesPlayed || 0;
                
                fgMadeTotal += player.stats.fieldGoalsMade || 0;
                fgAttemptedTotal += player.stats.fieldGoalsAttempted || 0;
                ftMadeTotal += player.stats.freeThrowsMade || 0;
                ftAttemptedTotal += player.stats.freeThrowsAttempted || 0;
            }
        });

        totals.fieldGoalPercentage = fgAttemptedTotal > 0 ? (fgMadeTotal / fgAttemptedTotal) * 100 : 0;
        totals.freeThrowPercentage = ftAttemptedTotal > 0 ? (ftMadeTotal / ftAttemptedTotal) * 100 : 0;

        return totals;
    };

    // Show loading state on initial load
    if (initialLoading) {
        return (
            <ReassuringLoader 
                type={isConnected ? 'team' : 'default'}
                customMessage={isConnected ? 'Loading your team' : 'Preparing your team view'}
                customSubtext={isConnected 
                    ? 'Gathering your players and their stats' 
                    : 'Setting up the team analysis for you'}
                minHeight="100vh"
            />
        );
    }

    const teamTotals = calculateTeamTotals();

    return (
        <Box
            sx={{
                p: 2,
                minHeight: "100vh",
                color: "#212121",
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
                My Team
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Yahoo Connection Section */}
            <YahooConnectionSection
                isConnected={isConnected}
                loading={loading}
                userLeagues={userLeagues}
                onYahooConnect={handleYahooConnect}
                showTeamSelectors={false}
            />

            <Grid container spacing={3}>
                {/* Team Players List */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    fontWeight: "bold",
                                    color: "#4a90e2",
                                    fontFamily: '"Roboto Mono", monospace',
                                }}
                            >
                                {teamName}
                            </Typography>
                            <List
                                sx={{
                                    bgcolor: "#f5f5f5",
                                    borderRadius: 1,
                                    p: 1,
                                    maxHeight: 400,
                                    overflow: "auto",
                                }}
                            >
                                {teamPlayers.map((player, index) => (
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
                                                color: "#212121",
                                                fontSize: "0.875rem",
                                            }}
                                        />
                                        <Tooltip
                                            title={player.active ? "Disable Player" : "Enable Player"}
                                            arrow
                                        >
                                            <IconButton
                                                edge="end"
                                                aria-label="toggle active"
                                                onClick={() => handleToggleActive(player.name)}
                                                size="small"
                                                sx={{
                                                    color: player.active ? "#4a90e2" : "#b0bec5",
                                                    "&:hover": {
                                                        bgcolor: "rgba(74, 144, 226, 0.2)",
                                                    },
                                                }}
                                            >
                                                {player.active ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip 
                                            title={isPlayerInComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId) 
                                                ? "Remove from Comparison" : "Add to Comparison"} 
                                            arrow
                                        >
                                            <IconButton
                                                edge="end"
                                                aria-label="compare"
                                                onClick={() => handleAddToComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)}
                                                size="small"
                                                sx={{
                                                    color: isPlayerInComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)
                                                        ? "#4a90e2" : "#4CAF50",
                                                    bgcolor: isPlayerInComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)
                                                        ? "rgba(74, 144, 226, 0.2)" : "transparent",
                                                    "&:hover": {
                                                        bgcolor: isPlayerInComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)
                                                            ? "rgba(74, 144, 226, 0.3)" : "rgba(76, 175, 80, 0.2)",
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
                                                onClick={() => handleRemovePlayer(player.name)}
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
                            
                            {/* Add Player Section */}
                            <Box sx={{ display: 'flex', gap: 1, mt: 2, p: 1 }}>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel 
                                        sx={{ 
                                            color: "#424242",
                                            fontFamily: "'Roboto Mono', monospace",
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        Add Player
                                    </InputLabel>
                                    <Select
                                        value={addPlayer}
                                        onChange={(e) => setAddPlayer(e.target.value)}
                                        label="Add Player"
                                        sx={{
                                            color: "#212121",
                                            borderRadius: 1,
                                            fontFamily: "'Roboto Mono', monospace",
                                            fontSize: '0.875rem',
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#4a90e2" },
                                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#80deea" },
                                            "& .MuiSelect-icon": { color: "#4a90e2" }
                                        }}
                                    >
                                        {allPlayers
                                            .filter(player => !teamPlayers.some(p => p.name === player.name))
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
                                    onClick={handleAddPlayer}
                                    disabled={!addPlayer}
                                    sx={{
                                        bgcolor: "#4a90e2",
                                        color: "#212121",
                                        fontFamily: "'Roboto Mono', monospace",
                                        "&:hover": { bgcolor: "#80deea" },
                                        "&.Mui-disabled": {
                                            bgcolor: "#b0bec5",
                                            color: "#e0e0e0"
                                        }
                                    }}
                                >
                                    Add
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Team Stats */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    fontWeight: "bold",
                                    color: "#4a90e2",
                                    fontFamily: '"Roboto Mono", monospace',
                                }}
                            >
                                Team Statistics
                            </Typography>
                            <TableContainer component={Paper} sx={{ bgcolor: "#f5f5f5" }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#4a90e2' }}>Player</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a90e2' }}>PTS</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a90e2' }}>REB</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a90e2' }}>AST</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a90e2' }}>STL</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a90e2' }}>BLK</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a90e2' }}>3PT</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {playerStats
                                            .filter(p => p.stats && p.playerName && 
                                                teamPlayers.some(tp => tp.active && tp.name === p.playerName))
                                            .map((player) => (
                                                <TableRow key={player.playerName}>
                                                    <TableCell sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.875rem' }}>
                                                        {player.playerName}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                                                        {(player.stats.points || 0).toFixed(1)}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                                                        {(player.stats.rebounds || 0).toFixed(1)}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                                                        {(player.stats.assists || 0).toFixed(1)}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                                                        {(player.stats.steals || 0).toFixed(1)}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                                                        {(player.stats.blocks || 0).toFixed(1)}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                                                        {(player.stats.threePointers || 0).toFixed(1)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        {/* Totals Row */}
                                        <TableRow sx={{ bgcolor: 'rgba(74, 144, 226, 0.1)' }}>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#4a90e2', fontFamily: '"Roboto Mono", monospace' }}>
                                                TOTALS
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a90e2', fontFamily: '"Roboto Mono", monospace' }}>
                                                {teamTotals.points.toFixed(1)}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a90e2', fontFamily: '"Roboto Mono", monospace' }}>
                                                {teamTotals.rebounds.toFixed(1)}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a90e2', fontFamily: '"Roboto Mono", monospace' }}>
                                                {teamTotals.assists.toFixed(1)}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a90e2', fontFamily: '"Roboto Mono", monospace' }}>
                                                {teamTotals.steals.toFixed(1)}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a90e2', fontFamily: '"Roboto Mono", monospace' }}>
                                                {teamTotals.blocks.toFixed(1)}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a90e2', fontFamily: '"Roboto Mono", monospace' }}>
                                                {teamTotals.threePointers.toFixed(1)}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Team Strengths Radar Chart */}
                <Grid item xs={12} md={6}>
                    <StatsComparisonGraph
                        teamAverages={playerStats.find((p) => p.teamAverages)?.teamAverages || null}
                        team1Name={teamName}
                        team2Name={null}
                    />
                </Grid>

                {/* Player Comparison Radar Chart */}
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
        </Box>
    );
};

export default MyTeam;
