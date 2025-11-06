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
import { useLeague } from "../contexts/LeagueContext";
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
        { nbaPlayerId: 1628378, yahooPlayerId: 1628378, name: "Donovan Mitchell" },
        { nbaPlayerId: 1630166, yahooPlayerId: 1630166, name: "Deni Avdija" }
    ]
};

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const Matchup = () => {
    // Team state
    const [team1Players, setTeam1Players] = useState([]);
    const [team2Players, setTeam2Players] = useState([]);
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
    const handlePlayerStatusChange = (playerId, newStatus, dateStr = null) => {
        const updatedDisabledPlayers = { ...disabledPlayers };
        const currentStatus = updatedDisabledPlayers[playerId];
        
        if (newStatus === 'enabled') {
            if (dateStr && typeof currentStatus === 'object' && currentStatus?.days) {
                // Enable player for specific day by removing that day from disabled days
                const updatedDays = { ...currentStatus.days };
                delete updatedDays[dateStr];
                
                if (Object.keys(updatedDays).length === 0) {
                    // No more day-specific disables
                    if (currentStatus.week === 'disabled' || currentStatus.week === 'disabledForWeek') {
                        // Still disabled for week, keep week status only
                        updatedDisabledPlayers[playerId] = { week: currentStatus.week };
                    } else {
                        // No week disable either, remove the whole entry (fully enabled)
                        delete updatedDisabledPlayers[playerId];
                    }
                } else {
                    // Still has other day-specific disables
                    updatedDisabledPlayers[playerId] = { 
                        ...currentStatus, 
                        days: updatedDays 
                    };
                }
            } else {
                // Explicitly enable player globally (overrides auto-disabled IL/IL+ status and removes all disables)
                updatedDisabledPlayers[playerId] = 'enabled';
            }
        } else if (newStatus === 'disabledForDay' && dateStr) {
            // Store day-specific disabling
            if (!updatedDisabledPlayers[playerId] || typeof updatedDisabledPlayers[playerId] === 'string') {
                // Convert existing string value to object or create new object
                const existingStatus = updatedDisabledPlayers[playerId];
                updatedDisabledPlayers[playerId] = existingStatus === 'enabled' ? {} : (existingStatus ? { week: existingStatus } : {});
            }
            updatedDisabledPlayers[playerId] = {
                ...(typeof updatedDisabledPlayers[playerId] === 'object' ? updatedDisabledPlayers[playerId] : {}),
                days: {
                    ...(updatedDisabledPlayers[playerId]?.days || {}),
                    [dateStr]: true
                }
            };
            // Remove 'enabled' if it was set
            if (updatedDisabledPlayers[playerId].enabled) {
                delete updatedDisabledPlayers[playerId].enabled;
            }
        } else {
            // For 'disabled' or 'disabledForWeek', store at player level
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
                    
                    // Check manual disable status
                    const playerDisableStatus = updatedDisabledPlayers[player.id];
                    let manuallyDisabled = false;
                    let manuallyEnabled = false;
                    
                    if (playerDisableStatus === 'enabled') {
                        manuallyEnabled = true;
                    } else if (playerDisableStatus === 'disabled' || playerDisableStatus === 'disabledForWeek') {
                        manuallyDisabled = true;
                    } else if (typeof playerDisableStatus === 'object' && playerDisableStatus) {
                        // Check if disabled for this specific day
                        if (playerDisableStatus.days && playerDisableStatus.days[day.date]) {
                            manuallyDisabled = true;
                        } else if (playerDisableStatus.week === 'disabled' || playerDisableStatus.week === 'disabledForWeek') {
                            manuallyDisabled = true;
                        }
                    }
                    
                    // If manually enabled, override auto-disabled. Otherwise, respect both auto and manual disabled.
                    const isDisabled = manuallyEnabled ? false : (autoDisabled || manuallyDisabled);

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
    
    // League context
    const { selectedLeague, onLeagueChange, userLeagues, leagueTeams, setLeagueTeams } = useLeague();
    
    // Loading and error state
    const [loading, setLoading] = useState(false);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Yahoo Fantasy state - use global context if available, fallback to local state
    const [allLeagueTeams, setAllLeagueTeams] = useState([]);
    const [selectedTeam1, setSelectedTeam1] = useState("");
    const [selectedTeam2, setSelectedTeam2] = useState("");
    
    // Ref to prevent double-processing of OAuth callback
    const hasProcessedCallback = useRef(false);
    const hasInitializedDefaults = useRef(false);

    const fetchAllPlayersFromSupabase = useCallback(async () => {
        return await fetchAllPlayers();
    }, []);

    const fetchWeeklyMatchupResults = useCallback(async (team1PlayersList, team2PlayersList) => {
        return await fetchWeeklyResults(team1PlayersList, team2PlayersList, team1Name, team2Name);
    }, [team1Name, team2Name]);

    const fetchPlayerStatsFromSupabase = useCallback(async (players) => {
        return await fetchPlayerStats(players, team1Players, team2Players);
    }, [team1Players, team2Players]);

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
                
                // Set currentMatchup last - the useEffect will handle projection calculation
                // This ensures all state is set before projection calculation
                setCurrentMatchup(data.matchup);
            }
        } catch (err) {
            console.error("Error fetching current matchup:", err);
            setError(err.message || "Failed to fetch current matchup");
        } finally {
            setLoading(false);
            // If user is connected, keep spinner until teams are loaded
            if (initialLoading && isConnected && team1Players.length > 0) {
                setInitialLoading(false);
            }
        }
    };
    const calculateMatchupProjection = async (matchup) => {
        if (!scheduleData || !matchup) {
            console.log('Cannot calculate projection:', { hasScheduleData: !!scheduleData, hasMatchup: !!matchup });
            return;
        }
        
        console.log('Calculating matchup projection for:', matchup.team1.name, 'vs', matchup.team2.name);
    
        try {
            // Get YYYY-MM-DD directly in Eastern Time
            const getEasternDateString = (date) => {
                const parts = date.toLocaleString('en-US', {
                    timeZone: 'America/New_York',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).split(',')[0].split('/');
                // parts = [MM, DD, YYYY]
                return `${parts[2]}-${parts[0]}-${parts[1]}`;
            };
    
    // Get current matchup week dates (Monday to Sunday) in Eastern Time
const getCurrentWeekDates = () => {
    const now = new Date();
    
    // Get current date/time components in Eastern Time
    const easternTimeString = now.toLocaleString('en-US', { 
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const [datePart, timePart] = easternTimeString.split(', ');
    const [month, day, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    
    // Create date object representing "today" in Eastern Time
    const easternNow = new Date(year, month - 1, day, hour, minute, second);
    
    const dayOfWeek = easternNow.getDay();
    // Monday = 1, Sunday = 0 → move so that Monday is start of week
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const weekStart = new Date(easternNow);
    weekStart.setDate(easternNow.getDate() + daysToMonday + 1); // ✅ Shift forward by 1 day
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const todayDateStr = getEasternDateString(now);

    return { weekStart, weekEnd, currentDate: easternNow, todayDateStr };
};
;
    
            const { weekStart, weekEnd, currentDate, todayDateStr } = getCurrentWeekDates();
            
            console.log('=== EASTERN TIME DEBUG ===');
            console.log('Current Eastern Date:', todayDateStr);
            console.log('Current Eastern Day:', currentDate.toLocaleDateString('en-US', { weekday: 'long' }));
            console.log('Week Start:', weekStart.toISOString().split('T')[0]);
            console.log('Week End:', weekEnd.toISOString().split('T')[0]);
    
            // Get player IDs and their NBA teams
            const getPlayerTeams = async (players) => {
                const playerIds = players.map(p => p.nbaPlayerId || p.yahooPlayerId || p.id).filter(Boolean);
            if (playerIds.length === 0) return [];

                const { data, error } = await supabase
                    .from('yahoo_nba_mapping')
                    .select('nba_id, yahoo_id, name, team')
                    .or(`nba_id.in.(${playerIds.join(',')}),yahoo_id.in.(${playerIds.join(',')})`);
    
                if (error) throw error;
    
                return players.map(p => {
                    const playerId = p.nbaPlayerId || p.yahooPlayerId || p.id;
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
    
            // Get actual stats for games already played this week (BEFORE today)
            const getActualStats = async (players) => {
                const playerIds = players.map(p => p.nbaPlayerId || p.yahooPlayerId || p.id).filter(Boolean);
                if (playerIds.length === 0) return {};
    
                const { data, error } = await supabase
                    .from('player_game_logs')
                    .select('*')
                    .eq('season', CURRENT_SEASON)
                    .in('player_id', playerIds)
                    .gte('game_date', weekStart.toISOString().split('T')[0])
                    .lt('game_date', todayDateStr)
                    .order('game_date', { ascending: true });
    
                if (error) throw error;
    
                const stats = {};
                data.forEach(game => {
                    if (!stats[game.player_id]) {
                        stats[game.player_id] = {
                            points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
                            threePointers: 0, turnovers: 0,
                            fieldGoalsMade: 0, fieldGoalsAttempted: 0,
                            freeThrowsMade: 0, freeThrowsAttempted: 0,
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
    
            const team1WithTeams = await getPlayerTeams(matchup.team1.players);
            const team2WithTeams = await getPlayerTeams(matchup.team2.players);
    
            const team1Averages = await getPlayerAverages(team1WithTeams);
            const team2Averages = await getPlayerAverages(team2WithTeams);
    
            const team1Actual = await getActualStats(team1WithTeams);
            const team2Actual = await getActualStats(team2WithTeams);
    
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
                
                const dailyProjections = [];
                
                // Create all 7 days, using weekStart as the base
                for (let i = 0; i < 7; i++) {
                    const dayDate = new Date(weekStart);
                    dayDate.setDate(weekStart.getDate() + i);
                    
                    // Get date string in Eastern Time for this day
                    const dateStr = getEasternDateString(dayDate);
                    const dayOfWeek = dayDate.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/New_York' });
                    const monthDay = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/New_York' });
                    
                    // Compare date strings directly
                    const isToday = dateStr === todayDateStr;
                    const isPast = dateStr < todayDateStr;
                    
                    console.log(`Day ${i}: ${dateStr} (${dayOfWeek} ${monthDay}), isToday: ${isToday}, isPast: ${isPast}, today: ${todayDateStr}`);
                    
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
                    
                    // Only process today and future days (not past days)
                    if (!isPast) {
                        players.forEach(player => {
                            const playerId = player.nbaPlayerId || player.yahooPlayerId || player.id;
                            const playerKey = `${playerId}`;
                            const playerAvg = averages[playerId] || {};
                            const teamsPlaying = scheduleData[dateStr];
                            
                            if (teamsPlaying && player.nbaTeam && teamsPlaying.includes(player.nbaTeam)) {
                                const autoDisabled = isPlayerAutoDisabled(player);
                                
                                const playerDisableStatus = disabledPlayers[playerKey];
                                let manuallyDisabled = false;
                                let manuallyEnabled = false;
                                
                                if (playerDisableStatus === 'enabled') {
                                    manuallyEnabled = true;
                                } else if (playerDisableStatus === 'disabled' || playerDisableStatus === 'disabledForWeek') {
                                    manuallyDisabled = true;
                                } else if (typeof playerDisableStatus === 'object' && playerDisableStatus) {
                                    if (playerDisableStatus.days && playerDisableStatus.days[dateStr]) {
                                        manuallyDisabled = true;
                                    } else if (playerDisableStatus.week === 'disabled' || playerDisableStatus.week === 'disabledForWeek') {
                                        manuallyDisabled = true;
                                    }
                                }
                                
                                const isDisabled = manuallyEnabled ? false : (autoDisabled || manuallyDisabled);
                                
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
                }
    
                // Calculate actual stats from games already played (before today)
                players.forEach(player => {
                    const playerId = player.nbaPlayerId || player.yahooPlayerId || player.id;
                    const playerActual = actualStats[playerId] || {};
    
                    Object.keys(actual).forEach(key => {
                        actual[key] += playerActual[key] || 0;
                    });
                });
    
                // Sum up projected stats from today onwards
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
    
            // FG%
            const t1FgPct = team1Projection.total.fieldGoalsAttempted > 0 
                ? (team1Projection.total.fieldGoalsMade / team1Projection.total.fieldGoalsAttempted) * 100 
                : 0;
            const t2FgPct = team2Projection.total.fieldGoalsAttempted > 0 
                ? (team2Projection.total.fieldGoalsMade / team2Projection.total.fieldGoalsAttempted) * 100 
                : 0;
    
            if (t1FgPct > t2FgPct) {
                categoryResults.fieldGoalPercentage = { 
                    winner: matchup.team1.name, team1: t1FgPct, team2: t2FgPct,
                    team1Made: team1Projection.total.fieldGoalsMade,
                    team1Attempted: team1Projection.total.fieldGoalsAttempted,
                    team2Made: team2Projection.total.fieldGoalsMade,
                    team2Attempted: team2Projection.total.fieldGoalsAttempted
                };
                team1Score++;
            } else if (t2FgPct > t1FgPct) {
                categoryResults.fieldGoalPercentage = { 
                    winner: matchup.team2.name, team1: t1FgPct, team2: t2FgPct,
                    team1Made: team1Projection.total.fieldGoalsMade,
                    team1Attempted: team1Projection.total.fieldGoalsAttempted,
                    team2Made: team2Projection.total.fieldGoalsMade,
                    team2Attempted: team2Projection.total.fieldGoalsAttempted
                };
                team2Score++;
            } else {
                categoryResults.fieldGoalPercentage = { 
                    winner: 'Tie', team1: t1FgPct, team2: t2FgPct,
                    team1Made: team1Projection.total.fieldGoalsMade,
                    team1Attempted: team1Projection.total.fieldGoalsAttempted,
                    team2Made: team2Projection.total.fieldGoalsMade,
                    team2Attempted: team2Projection.total.fieldGoalsAttempted
                };
            }
    
            // FT%
            const t1FtPct = team1Projection.total.freeThrowsAttempted > 0 
                ? (team1Projection.total.freeThrowsMade / team1Projection.total.freeThrowsAttempted) * 100 
                : 0;
            const t2FtPct = team2Projection.total.freeThrowsAttempted > 0 
                ? (team2Projection.total.freeThrowsMade / team2Projection.total.freeThrowsAttempted) * 100 
                : 0;
    
            if (t1FtPct > t2FtPct) {
                categoryResults.freeThrowPercentage = { 
                    winner: matchup.team1.name, team1: t1FtPct, team2: t2FtPct,
                    team1Made: team1Projection.total.freeThrowsMade,
                    team1Attempted: team1Projection.total.freeThrowsAttempted,
                    team2Made: team2Projection.total.freeThrowsMade,
                    team2Attempted: team2Projection.total.freeThrowsAttempted
                };
                team1Score++;
            } else if (t2FtPct > t1FtPct) {
                categoryResults.freeThrowPercentage = { 
                    winner: matchup.team2.name, team1: t1FtPct, team2: t2FtPct,
                    team1Made: team1Projection.total.freeThrowsMade,
                    team1Attempted: team1Projection.total.freeThrowsAttempted,
                    team2Made: team2Projection.total.freeThrowsMade,
                    team2Attempted: team2Projection.total.freeThrowsAttempted
                };
                team2Score++;
            } else {
                categoryResults.freeThrowPercentage = { 
                    winner: 'Tie', team1: t1FtPct, team2: t2FtPct,
                    team1Made: team1Projection.total.freeThrowsMade,
                    team1Attempted: team1Projection.total.freeThrowsAttempted,
                    team2Made: team2Projection.total.freeThrowsMade,
                    team2Attempted: team2Projection.total.freeThrowsAttempted
                };
            }
    
            // Turnovers
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
    
            const projectionData = {
                weekStart: weekStart.toLocaleDateString('en-US', { timeZone: 'America/New_York' }),
                weekEnd: weekEnd.toLocaleDateString('en-US', { timeZone: 'America/New_York' }),
                currentDate: currentDate.toLocaleDateString('en-US', { timeZone: 'America/New_York' }),
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
            };
            
            console.log('Setting matchup projection:', projectionData);
            setMatchupProjection(projectionData);
    
        } catch (error) {
            console.error('Error calculating matchup projection:', error);
            setMatchupProjection(null);
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
                // Update global context with league teams
                if (setLeagueTeams) {
                    setLeagueTeams(data.teams);
                }
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
                
                // If user is connected, mark initial loading as complete once teams are loaded
                if (initialLoading && isConnected) {
                    setInitialLoading(false);
                }
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

    // Helper function to normalize player ID for comparison
    const normalizePlayerId = (id) => {
        if (id === null || id === undefined) return null;
        const numId = typeof id === 'string' ? parseInt(id, 10) : id;
        return isNaN(numId) ? null : numId;
    };

    // Helper function to check if a player is in comparison by name or ID
    const isPlayerInComparison = (playerName, playerId, nbaPlayerId, yahooPlayerId) => {
        const idToCheck = normalizePlayerId(nbaPlayerId || yahooPlayerId || playerId);
        
        return selectedPlayers.some(sp => {
            const spId = normalizePlayerId(sp.nbaPlayerId || sp.yahooPlayerId || sp.id);
            // Match by ID (primary)
            if (idToCheck && spId && idToCheck === spId) {
                return true;
            }
            // Match by name (fallback) - check both the stored name and against selectedPlayerNames
            return sp.name === playerName || selectedPlayerNames.includes(playerName);
        });
    };

    const handleAddToComparison = (playerName, playerId, nbaPlayerId, yahooPlayerId) => {
        // Always allow manual selection/unselection - don't rely on auto-selection state
        const idToCheck = normalizePlayerId(nbaPlayerId || yahooPlayerId || playerId);
        
        // Find existing player by ID or name
        const existingIndex = selectedPlayers.findIndex(sp => {
            const spId = normalizePlayerId(sp.nbaPlayerId || sp.yahooPlayerId || sp.id);
            // Match by ID (primary) - compare normalized IDs
            if (idToCheck && spId && idToCheck === spId) {
                return true;
            }
            // Match by name (fallback) - exact name match
            if (sp.name === playerName) {
                return true;
            }
            return false;
        });

        if (existingIndex !== -1) {
            // Unselect player
            const newPlayers = [...selectedPlayers];
            const newNames = [...selectedPlayerNames];
            newPlayers.splice(existingIndex, 1);
            newNames.splice(existingIndex, 1);
            setSelectedPlayers(newPlayers);
            setSelectedPlayerNames(newNames);
            return;
        }

        // Select player (max 4)
        // Try to find matching player in stats to get the correct database name, but fallback to provided name
        let nameToUse = playerName;
        if (playerStats.length > 0) {
            const matchingStat = playerStats.find(stat => {
                if (!stat || !stat.playerId) return false;
                const statPlayerId = normalizePlayerId(stat.playerId);
                
                // Match by ID (primary)
                if (idToCheck && statPlayerId && idToCheck === statPlayerId) {
                    return true;
                }
                // Match by name (fallback)
                return stat.playerName === playerName;
            });
            
            if (matchingStat?.playerName) {
                nameToUse = matchingStat.playerName;
            }
        }
        
        const newPlayer = { 
            id: idToCheck || playerId, 
            name: nameToUse, 
            nbaPlayerId: nbaPlayerId || null, 
            yahooPlayerId: yahooPlayerId || null 
        };
        
        if (selectedPlayers.length < 4) {
            setSelectedPlayers([...selectedPlayers, newPlayer]);
            setSelectedPlayerNames([...selectedPlayerNames, nameToUse]);
        } else {
            // Replace oldest player (first in array)
            setSelectedPlayers([...selectedPlayers.slice(1), newPlayer]);
            setSelectedPlayerNames([...selectedPlayerNames.slice(1), nameToUse]);
        }
    };

    // Initialize DEFAULT_PLAYERS if teams are empty (only if not connected to Yahoo)
    useEffect(() => {
        if (!hasInitializedDefaults.current && !isConnected && team1Players.length === 0 && team2Players.length === 0 && !initialLoading) {
            hasInitializedDefaults.current = true;
            const team1Default = DEFAULT_PLAYERS.team1.map((p) => ({
                id: p.nbaPlayerId || p.yahooPlayerId,
                name: p.name,
                yahooPlayerId: p.yahooPlayerId,
                nbaPlayerId: p.nbaPlayerId,
                active: true,
            }));
            const team2Default = DEFAULT_PLAYERS.team2.map((p) => ({
                id: p.nbaPlayerId || p.yahooPlayerId,
                name: p.name,
                yahooPlayerId: p.yahooPlayerId,
                nbaPlayerId: p.nbaPlayerId,
                active: true,
            }));
            setTeam1Players(team1Default);
            setTeam2Players(team2Default);
        }
    }, [isConnected, initialLoading, team1Players.length, team2Players.length]);

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
            // Reset projection first to ensure fresh calculation
            setMatchupProjection(null);
            // Use a small delay to ensure all state updates have been processed
            const timer = setTimeout(() => {
                calculateMatchupProjection(currentMatchup);
            }, 100);
            return () => clearTimeout(timer);
        } else if (currentMatchup && !scheduleData) {
            // If we have matchup but no schedule yet, wait for schedule to load
            console.log('Waiting for schedule data to calculate projection...');
            setMatchupProjection(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduleData, currentMatchup]);

    // Auto-load league when selected (reload when league changes)
    const previousLeagueRef = useRef(null);
    useEffect(() => {
        // When league changes, clear everything immediately
        if (previousLeagueRef.current !== null && previousLeagueRef.current !== selectedLeague) {
            previousLeagueRef.current = selectedLeague;
            // Clear teams and matchup when league changes
            setTeam1Players([]);
            setTeam2Players([]);
            setTeam1Name("Team 1");
            setTeam2Name("Team 2");
            setCurrentMatchup(null);
            setMatchupProjection(null);
            setAllLeagueTeams([]);
            setSelectedTeam1("");
            setSelectedTeam2("");
        }
        
        // Initialize previousLeagueRef if not set
        if (previousLeagueRef.current === null && selectedLeague) {
            previousLeagueRef.current = selectedLeague;
        }
        
        // Use global league teams if available
        if (leagueTeams && leagueTeams.length > 0 && previousLeagueRef.current === selectedLeague) {
            // Only update if teams haven't been set yet or if they're different
            const teamsAreDifferent = allLeagueTeams.length === 0 || 
                allLeagueTeams.length !== leagueTeams.length ||
                (allLeagueTeams.length > 0 && allLeagueTeams[0].name !== leagueTeams[0].name);
            
            if (teamsAreDifferent) {
                setAllLeagueTeams(leagueTeams);
                // Set first two teams as default
                setSelectedTeam1(leagueTeams[0].name);
                setSelectedTeam2(leagueTeams.length > 1 ? leagueTeams[1].name : leagueTeams[0].name);
                setTeam1Name(leagueTeams[0].name);
                setTeam2Name(leagueTeams.length > 1 ? leagueTeams[1].name : leagueTeams[0].name);
                
                setTeam1Players(
                    leagueTeams[0].players.map((p) => ({
                        id: p.nbaPlayerId || p.yahooPlayerId,
                        name: p.name,
                        yahooPlayerId: p.yahooPlayerId,
                        nbaPlayerId: p.nbaPlayerId,
                        active: true,
                    }))
                );
                
                setTeam2Players(
                    leagueTeams.length > 1 
                        ? leagueTeams[1].players.map((p) => ({
                            id: p.nbaPlayerId || p.yahooPlayerId,
                            name: p.name,
                            yahooPlayerId: p.yahooPlayerId,
                            nbaPlayerId: p.nbaPlayerId,
                            active: true,
                        }))
                        : []
                );
            }
        } else if (selectedLeague && userId && isConnected && !loadingTeams && !leagueTeams?.length) {
            // If league changed or teams haven't been loaded, and context doesn't have teams yet, reload
            if (previousLeagueRef.current === selectedLeague) {
                handleLoadLeague();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLeague, userId, isConnected, leagueTeams]);

    // Auto-fetch current matchup when league is available
    useEffect(() => {
        if (selectedLeague && userId && isConnected && !currentMatchup && !loading && allLeagueTeams.length > 0) {
            handleFetchCurrentMatchup();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLeague, userId, isConnected, allLeagueTeams.length]);

    // Fetch player stats whenever teams change
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const activeTeam1Players = team1Players.filter((player) => player.active);
                const activeTeam2Players = team2Players.filter((player) => player.active);

                // If no players to fetch, mark loading as complete
                if (activeTeam1Players.length === 0 && activeTeam2Players.length === 0 && selectedPlayers.length === 0) {
                    if (initialLoading) {
                        setInitialLoading(false);
                    }
                    return;
                }

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

                if (uniquePlayers.length > 0) {
                const data = await fetchPlayerStatsFromSupabase(uniquePlayers);
                
                const teamAveragesEntry = data.find((entry) => entry.teamAverages);
                const playerStatsData = data.filter((entry) => entry.stats && entry.playerName);
                
                setPlayerStats([
                    ...playerStatsData,
                    ...(teamAveragesEntry ? [{ teamAverages: teamAveragesEntry.teamAverages }] : []),
                ]);
                }
            } catch (error) {
                console.error("Error fetching player stats:", error);
            } finally {
                if (initialLoading) {
                    setInitialLoading(false);
                }
            }
        };

        fetchStats();
    }, [team1Players, team2Players, selectedPlayers, fetchPlayerStatsFromSupabase, initialLoading, isConnected]);

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
                .then(async (data) => {
                    console.log("OAuth callback response:", data);
                    if (data.success) {
                        login({
                            userId: data.userId,
                            email: data.email,
                            name: data.name,
                            profilePicture: data.profilePicture,
                            expiresAt: data.expiresAt,
                        });
                        
                        // Navigate to return path if stored, otherwise stay on matchup
                        const returnPath = sessionStorage.getItem('oauth_return_path') || '/matchup';
                        sessionStorage.removeItem('oauth_return_path');
                        if (window.location.pathname !== returnPath) {
                            window.location.href = returnPath;
                        }
                        
                        // Create or update user_profile with defaults from OAuth data
                        try {
                            const { data: existingProfile, error: profileError } = await supabase
                                .from('user_profiles')
                                .select('user_id, name, email')
                                .eq('user_id', data.userId)
                                .single();
                            
                            // PGRST116 means no rows found - that's OK, we'll create a new profile
                            if (profileError && profileError.code !== 'PGRST116') {
                                throw profileError;
                            }
                            
                            if (existingProfile && !profileError) {
                                // Update existing profile only if name/email are empty
                                const updateData = {};
                                if (!existingProfile.name && data.name) {
                                    updateData.name = data.name;
                                }
                                if (!existingProfile.email && data.email) {
                                    updateData.email = data.email;
                                }
                                
                                if (Object.keys(updateData).length > 0) {
                                    await supabase
                                        .from('user_profiles')
                                        .update(updateData)
                                        .eq('user_id', data.userId);
                                }
                            } else {
                                // Create new profile with defaults from OAuth
                                await supabase
                                    .from('user_profiles')
                                    .insert({
                                        user_id: data.userId,
                                        name: data.name || '',
                                        email: data.email || '',
                                        send_weekly_projections: true,
                                        send_news: true,
                                        is_premium: false,
                                    });
                            }
                        } catch (profileError) {
                            console.error('Error creating/updating user profile:', profileError);
                            // Don't fail the login if profile creation fails
                        }
                        
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
                        // Auto-select first league via context
                        if (onLeagueChange && !selectedLeague) {
                            onLeagueChange(data.leagues[0].leagueId);
                        }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    if (data?.leagues && data.leagues.length > 0 && onLeagueChange && !selectedLeague) {
                        // Auto-select first league via context
                        onLeagueChange(data.leagues[0].leagueId);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                    color: "#212121",
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
                Fantasy Goats Comparison
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
                                        bgcolor: "#f5f5f5",
                                        borderRadius: 1,
                                        p: 1,
                                        maxHeight: 400,
                                        overflow: "auto",
                                    }}
                        >
                            {team1Players.map((player, index) => {
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
                                            color: "#212121",
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
                                    <Tooltip title={isPlayerInComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId) ? "Remove from Comparison" : "Add to Comparison"} arrow>
                                        <IconButton
                                            edge="end"
                                            aria-label="compare"
                                            onClick={() => handleAddToComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)}
                                            size="small"
                                            sx={{
                                                color: isPlayerInComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)
                                                    ? "#4a90e2"
                                                    : "#4CAF50",
                                                bgcolor: isPlayerInComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)
                                                    ? "rgba(74, 144, 226, 0.2)"
                                                    : "transparent",
                                                "&:hover": {
                                                    bgcolor: isPlayerInComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)
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
                                        color: "#424242",
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
                                    color: "#212121",
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
                                        bgcolor: "#f5f5f5",
                                        borderRadius: 1,
                                        p: 1,
                                        maxHeight: 400,
                                        overflow: "auto",
                                    }}
                        >
                            {team2Players.map((player, index) => {
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
                                            color: "#212121",
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
                                    <Tooltip title={isPlayerInComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId) ? "Remove from Comparison" : "Add to Comparison"} arrow>
                                        <IconButton
                                            edge="end"
                                            aria-label="compare"
                                            onClick={() => handleAddToComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)}
                                            size="small"
                                            sx={{
                                                color: isPlayerInComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)
                                                    ? "#4a90e2"
                                                    : "#4CAF50",
                                                bgcolor: isPlayerInComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)
                                                    ? "rgba(74, 144, 226, 0.2)"
                                                    : "transparent",
                                                "&:hover": {
                                                    bgcolor: isPlayerInComparison(player.name, player.id, player.nbaPlayerId, player.yahooPlayerId)
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
                                        color: "#424242",
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
                                    color: "#212121",
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
            {(isConnected || matchupProjection) && (
                <MatchupProjectionTracker
                    matchupProjection={matchupProjection}
                    currentMatchup={currentMatchup}
                    onPlayerStatusChange={handlePlayerStatusChange}
                    isConnected={isConnected}
                />
            )}
        </Box>
    );
};

export default Matchup;
