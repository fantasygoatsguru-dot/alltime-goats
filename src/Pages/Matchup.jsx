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
import MatchupProjectionTracker from "../components/MatchupProjectionTracker";
import WeeklyMatchupResults from "../components/WeeklyMatchupResults";
import YahooConnectionSection from "../components/YahooConnectionSection";
import StatsComparisonGraph from "../components/StatsComparisonGraph";
import PlayerComparisonGraph from "../components/PlayerComparisonGraph";

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
    
    // Current matchup state
    const [currentMatchup, setCurrentMatchup] = useState(null);
    const [matchupProjection, setMatchupProjection] = useState(null);
    const [scheduleData, setScheduleData] = useState(null);
    const [disabledPlayers, setDisabledPlayers] = useState(() => {
        const saved = localStorage.getItem('disabledPlayers');
        return saved ? JSON.parse(saved) : {};
    });
    
    // Player status handler for projection tracker
    const handlePlayerStatusChange = (playerId, newStatus) => {
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

    
    // Auth context
    const { user, isAuthenticated, login } = useAuth();
    const userId = user?.userId || null;
    const isConnected = isAuthenticated;
    
    // Loading and error state
    const [loading, setLoading] = useState(false);
    const [loadingTeams, setLoadingTeams] = useState(false);
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
                
                for (let i = 0; i < 7; i++) {
                    const dateStr = current.toISOString().split('T')[0];
                    const dayOfWeek = current.toLocaleDateString('en-US', { weekday: 'short' });
                    const monthDay = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    
                    // Compare dates properly - use yesterday as "today" for highlighting
                    const yesterday = new Date(currentDate);
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split('T')[0];
                    const isToday = dateStr === yesterdayStr;
                    
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

        setLoadingTeams(true);
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
            setLoadingTeams(false);
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
        if (selectedLeague && userId && isConnected && allLeagueTeams.length === 0 && !loadingTeams) {
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
                FantasyGoatsGuru Comparison
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Yahoo Connection Section */}
            <YahooConnectionSection
                isConnected={isConnected}
                loading={loadingTeams || (isConnected && allLeagueTeams.length === 0 && selectedLeague)}
                userLeagues={userLeagues}
                selectedLeague={selectedLeague}
                onLeagueChange={setSelectedLeague}
                onYahooConnect={handleYahooConnect}
                allLeagueTeams={allLeagueTeams}
                selectedTeam1={selectedTeam1}
                selectedTeam2={selectedTeam2}
                onTeamSelect={handleTeamSelect}
                onSwitchTeams={handleSwitchTeams}
            />



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
            <WeeklyMatchupResults
                weeklyResults={weeklyResults}
                team1Name={team1Name}
                team2Name={team2Name}
            />

            {/* Current Yahoo Matchup - Week Tracker */}
            <MatchupProjectionTracker
                matchupProjection={matchupProjection}
                currentMatchup={currentMatchup}
                disabledPlayers={disabledPlayers}
                onPlayerStatusChange={handlePlayerStatusChange}
                isConnected={isConnected}
            />
        </Box>
    );
};

export default Matchup;
