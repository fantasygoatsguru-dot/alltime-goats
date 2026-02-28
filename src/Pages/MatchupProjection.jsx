import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Alert, FormControl, Select, MenuItem, CircularProgress, Tooltip, Grid } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useLeague } from "../contexts/LeagueContext";
import { supabase, CURRENT_SEASON } from "../utils/supabase";
import MatchupProjectionTracker from "../components/MatchupProjectionTracker";
import YahooConnectionSection from "../components/YahooConnectionSection";
import ReassuringLoader from "../components/ReassuringLoader";

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const MatchupProjection = () => {
    const { user, isAuthenticated, ensureValidToken } = useAuth();
    const userId = user?.userId || null;
    const isConnected = isAuthenticated;

    const { selectedLeague, userLeagues, currentMatchup: contextMatchup, setCurrentMatchup: setContextMatchup, leagueTeams, setLeagueTeams, leagueSettings } = useLeague();

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [periodLoading, setPeriodLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentMatchup, setCurrentMatchup] = useState(null);
    const [matchupProjection, setMatchupProjection] = useState(null);
    const [scheduleData, setScheduleData] = useState(null);
    const [periodType, setPeriodType] = useState('season');

    const [allLeagueTeams, setAllLeagueTeams] = useState([]);
    const [selectedTeam1, setSelectedTeam1] = useState("");
    const [selectedTeam2, setSelectedTeam2] = useState("");
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [currentYahooWeek, setCurrentYahooWeek] = useState(null);
    const availableWeeks = Array.from({ length: 24 }, (_, i) => i + 1);
    const [disabledPlayers, setDisabledPlayers] = useState(() => {
        const saved = localStorage.getItem('disabledPlayers');
        return saved ? JSON.parse(saved) : {};
    });

    const hasInitialized = useRef(false);
    const loadingTimeoutRef = useRef(null);

    // Safety timeout
    useEffect(() => {
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
            sessionStorage.setItem('oauth_return_path', '/matchup-projection');

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

    const handlePlayerStatusChange = (playerId, newStatus, dateStr = null) => {

        const updatedDisabledPlayers = { ...disabledPlayers };

        if (newStatus === 'enabled') {
            updatedDisabledPlayers[playerId] = 'enabled';
        } else if (newStatus === 'disabledForDay' && dateStr) {
            if (!updatedDisabledPlayers[playerId] || typeof updatedDisabledPlayers[playerId] === 'string') {
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
            if (updatedDisabledPlayers[playerId].enabled) {
                delete updatedDisabledPlayers[playerId].enabled;
            }
        } else {
            updatedDisabledPlayers[playerId] = newStatus;
        }

        setDisabledPlayers(updatedDisabledPlayers);
        localStorage.setItem('disabledPlayers', JSON.stringify(updatedDisabledPlayers));

        recalculateProjectionWithDisabledPlayers(updatedDisabledPlayers);
    };

    const recalculateProjectionWithDisabledPlayers = (updatedDisabledPlayers) => {
        if (!matchupProjection) return;

        const isPlayerAutoDisabled = (player) => {
            const position = player.selectedPosition || player.selected_position;
            const status = player.status;
            return position === 'IL+' || position === 'IL' || status === 'INJ' || status === 'OUT';
        };

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

                    const playerDisableStatus = updatedDisabledPlayers[player.id];
                    let manuallyDisabled = false;
                    let manuallyEnabled = false;

                    if (playerDisableStatus === 'enabled') {
                        manuallyEnabled = true;
                    } else if (playerDisableStatus === 'disabled' || playerDisableStatus === 'disabledForWeek') {
                        manuallyDisabled = true;
                    } else if (typeof playerDisableStatus === 'object' && playerDisableStatus) {
                        if (playerDisableStatus.days && playerDisableStatus.days[day.date]) {
                            manuallyDisabled = true;
                        } else if (playerDisableStatus.week === 'disabled' || playerDisableStatus.week === 'disabledForWeek') {
                            manuallyDisabled = true;
                        }
                    }

                    const isDisabled = manuallyEnabled ? false : (autoDisabled || manuallyDisabled);

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

        const team1Updated = {
            ...matchupProjection.team1,
            dailyProjections: recalculateDailyProjections(matchupProjection.team1.dailyProjections)
        };

        const team2Updated = {
            ...matchupProjection.team2,
            dailyProjections: recalculateDailyProjections(matchupProjection.team2.dailyProjections)
        };

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

        setMatchupProjection({
            ...matchupProjection,
            team1: team1Updated,
            team2: team2Updated,
            categoryResults,
            team1Score,
            team2Score
        });
    };

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

    // Fetch current matchup from context or API
    useEffect(() => {
        const fetchMatchup = async () => {
            if (!isConnected || !selectedLeague || !userId) {
                setInitialLoading(false);
                return;
            }

            if (hasInitialized.current) return;
            hasInitialized.current = true;

            // Use matchup from context if available
            if (contextMatchup) {
                setCurrentMatchup(contextMatchup);
                setSelectedTeam1(contextMatchup.team1.name);
                setSelectedTeam2(contextMatchup.team2.name);
                setInitialLoading(false);
                return;
            }

            // Otherwise fetch it
            setLoading(true);
            try {
                const data = await callSupabaseFunction("yahoo-fantasy-api", {
                    action: "getCurrentMatchup",
                    userId: userId,
                    leagueId: selectedLeague,
                });

                if (data.matchup) {
                    if (setContextMatchup && (!selectedWeek || selectedWeek === parseInt(data.matchup.week, 10))) {
                        setContextMatchup(data.matchup);
                    }
                    setCurrentMatchup(data.matchup);
                    setSelectedTeam1(data.matchup.team1.name);
                    setSelectedTeam2(data.matchup.team2.name);

                    let weekNum = parseInt(data.matchup.week, 10);
                    if (Number.isNaN(weekNum) && leagueSettings?.currentWeek) {
                        weekNum = parseInt(leagueSettings.currentWeek, 10);
                    }

                    if (!currentYahooWeek && weekNum) {
                        setCurrentYahooWeek(weekNum);
                        setSelectedWeek(weekNum);
                    }
                }
            } catch (err) {
                console.error("Error fetching current matchup:", err);
                setError(err.message || "Failed to fetch current matchup");
            } finally {
                setLoading(false);
                setInitialLoading(false);
            }
        };

        fetchMatchup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, selectedLeague, userId, contextMatchup, setContextMatchup]);

    // Fetch all league teams for dropdowns
    useEffect(() => {
        const fetchAllTeams = async () => {
            if (!isConnected || !selectedLeague || !userId) return;

            // Use leagueTeams from context if available
            if (leagueTeams && leagueTeams.length > 0) {
                setAllLeagueTeams(leagueTeams);
                return;
            }

            setLoadingTeams(true);
            try {
                const data = await callSupabaseFunction("yahoo-fantasy-api", {
                    action: "getAllTeamsInLeague",
                    userId: userId,
                    leagueId: selectedLeague,
                });

                if (data.teams && data.teams.length > 0) {
                    setAllLeagueTeams(data.teams);
                    if (setLeagueTeams) {
                        setLeagueTeams(data.teams);
                    }
                }
            } catch (err) {
                console.error("Error fetching all league teams:", err);
            } finally {
                setLoadingTeams(false);
            }
        };

        if (isConnected && selectedLeague && userId) {
            fetchAllTeams();
        }
    }, [isConnected, selectedLeague, userId, leagueTeams, setLeagueTeams]);

    const handleTeamSelect = async (teamPosition, teamName) => {
        if (!currentMatchup || !allLeagueTeams.length) return;

        setLoading(true);

        const newTeam1Name = teamPosition === "team1" ? teamName : (selectedTeam1 || currentMatchup.team1.name);
        const newTeam2Name = teamPosition === "team2" ? teamName : (selectedTeam2 || currentMatchup.team2.name);

        setSelectedTeam1(newTeam1Name);
        setSelectedTeam2(newTeam2Name);

        // Check if we reverted back to the exact original matchup
        if (contextMatchup && newTeam1Name === contextMatchup.team1.name && newTeam2Name === contextMatchup.team2.name) {
            setCurrentMatchup(contextMatchup);
            setLoading(false);
            return;
        }

        const team1Data = allLeagueTeams.find(t => t.name === newTeam1Name);
        const team2Data = allLeagueTeams.find(t => t.name === newTeam2Name);

        if (!team1Data || !team2Data) {
            setLoading(false);
            return;
        }


        try {
            const data = await callSupabaseFunction("yahoo-fantasy-api", {
                action: "getCustomMatchup",
                userId: userId,
                leagueId: selectedLeague,
                team1Key: team1Data.key,
                team2Key: team2Data.key,
                week: selectedWeek ? String(selectedWeek) : currentMatchup.week
            });

            if (data.matchup) {
                setCurrentMatchup(data.matchup);
            }
        } catch (err) {
            console.error("Error fetching custom matchup:", err);
            setError(err.message || "Failed to fetch custom matchup");
        } finally {
            setLoading(false);
        }
    };

    const handleWeekSelect = async (e) => {
        const week = e.target.value;
        setSelectedWeek(week);

        if (!currentMatchup || !allLeagueTeams.length) return;

        setLoading(true);

        const team1Data = allLeagueTeams.find(t => t.name === (selectedTeam1 || currentMatchup.team1.name));
        const team2Data = allLeagueTeams.find(t => t.name === (selectedTeam2 || currentMatchup.team2.name));

        if (!team1Data || !team2Data) {
            setLoading(false);
            return;
        }

        try {
            const data = await callSupabaseFunction("yahoo-fantasy-api", {
                action: "getCustomMatchup",
                userId: userId,
                leagueId: selectedLeague,
                team1Key: team1Data.key,
                team2Key: team2Data.key,
                week: String(week)
            });

            if (data.matchup) {
                setCurrentMatchup(data.matchup);
            }
        } catch (err) {
            console.error("Error fetching generic weekly matchup:", err);
            setError(err.message || "Failed to fetch matchup for week.");
        } finally {
            setLoading(false);
        }
    };

    // Calculate matchup projection
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

            // Calculate explicit week dates based on API response
            const getExplicitWeekDates = () => {
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
                const todayDateStr = getEasternDateString(now);

                let weekStart, weekEnd;

                if (matchup.week_start && matchup.week_end) {
                    const [sYear, sMonth, sDay] = matchup.week_start.split('-');
                    weekStart = new Date(sYear, sMonth - 1, sDay, 0, 0, 0);

                    const [eYear, eMonth, eDay] = matchup.week_end.split('-');
                    weekEnd = new Date(eYear, eMonth - 1, eDay, 23, 59, 59, 999);
                } else {
                    // Fallback to old behavior if missing format
                    const dayOfWeek = easternNow.getDay();
                    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                    weekStart = new Date(easternNow);
                    weekStart.setDate(easternNow.getDate() + daysToMonday + 1);
                    weekStart.setHours(0, 0, 0, 0);
                    weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    weekEnd.setHours(23, 59, 59, 999);
                }

                return { weekStart, weekEnd, currentDate: easternNow, todayDateStr };
            };

            const { weekStart, weekEnd, currentDate, todayDateStr } = getExplicitWeekDates();

            // Matchups differ in length (e.g., All Star week is 14 days)
            const diffTime = Math.abs(weekEnd - weekStart);
            const numDaysInWeek = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));


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
                    .from('player_period_averages')
                    .select('*')
                    .eq('season', CURRENT_SEASON)
                    .eq('period_type', periodType)
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

                // Create all days in the matchup duration, using weekStart as the base
                for (let i = 0; i < numDaysInWeek; i++) {
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

            setMatchupProjection(projectionData);
            setInitialLoading(false);
            setPeriodLoading(false);

        } catch (error) {
            console.error('Error calculating matchup projection:', error);
            setMatchupProjection(null);
            setInitialLoading(false);
            setPeriodLoading(false);
        }
    };

    // Calculate projection when we have both matchup and schedule, or when period type changes
    useEffect(() => {
        if (scheduleData && currentMatchup) {
            setPeriodLoading(true);
            calculateMatchupProjection(currentMatchup).finally(() => {
                setPeriodLoading(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduleData, currentMatchup, periodType]);

    if (initialLoading) {
        return (
            <ReassuringLoader
                type="matchup"
                customMessage="Loading your matchup projection"
                customSubtext="Gathering player stats, projections, and team data"
                minHeight="100vh"
            />
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

            {/* Header with Title, Tooltip, and Filters */}
            {isConnected && currentMatchup && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    pb: 2,
                    borderBottom: '2px solid #ddd',
                    flexWrap: 'wrap',
                    gap: 2,
                    mt: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#003366', fontSize: '1.25rem' }}>
                            Matchup Projection
                        </Typography>
                        <Tooltip title="If players give their average stats for the rest of the week, how will the week end?" arrow>
                            <Box sx={{ bgcolor: '#003366', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help', fontSize: '0.75rem', color: '#fff', fontWeight: 600 }}>
                                i
                            </Box>
                        </Tooltip>
                        {periodLoading && <CircularProgress size={20} sx={{ color: '#003366', ml: 1 }} />}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select
                                value={periodType}
                                onChange={(e) => setPeriodType(e.target.value)}
                                disabled={periodLoading}
                                sx={{ bgcolor: '#fff', fontSize: '0.875rem' }}
                            >
                                <MenuItem value="season">Full Season</MenuItem>
                                <MenuItem value="60_days">Last 60 Days</MenuItem>
                                <MenuItem value="30_days">Last 30 Days</MenuItem>
                                <MenuItem value="7_days">Last 7 Days</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select
                                value={selectedTeam1 || currentMatchup.team1.name}
                                onChange={(e) => handleTeamSelect("team1", e.target.value)}
                                disabled={loadingTeams || periodLoading || loading}
                                sx={{ bgcolor: '#fff', fontSize: '0.875rem' }}
                            >
                                {allLeagueTeams.map((team) => (
                                    <MenuItem key={`team1-${team.key}`} value={team.name}>{team.name}</MenuItem>
                                ))}
                                {allLeagueTeams.length === 0 && (
                                    <MenuItem value={currentMatchup.team1.name}>{currentMatchup.team1.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                            {loadingTeams || loading ? <CircularProgress size={16} /> : "VS"}
                        </Typography>

                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select
                                value={selectedTeam2 || currentMatchup.team2.name}
                                onChange={(e) => handleTeamSelect("team2", e.target.value)}
                                disabled={loadingTeams || periodLoading || loading}
                                sx={{ bgcolor: '#fff', fontSize: '0.875rem' }}
                            >
                                {allLeagueTeams.map((team) => (
                                    <MenuItem key={`team2-${team.key}`} value={team.name}>{team.name}</MenuItem>
                                ))}
                                {allLeagueTeams.length === 0 && (
                                    <MenuItem value={currentMatchup.team2.name}>{currentMatchup.team2.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <Select
                                value={selectedWeek || currentYahooWeek || ""}
                                onChange={handleWeekSelect}
                                disabled={loadingTeams || periodLoading || loading || !currentYahooWeek}
                                sx={{ bgcolor: '#fff', fontSize: '0.875rem' }}
                            >
                                {availableWeeks
                                    .filter((w) => !leagueSettings?.playoffStartWeek || w < leagueSettings.playoffStartWeek + 3)
                                    .map((w) => {
                                        const isPlayoff = leagueSettings?.playoffStartWeek && w >= leagueSettings.playoffStartWeek;
                                        return (
                                            <MenuItem key={`week-${w}`} value={w}>
                                                Week {w} {isPlayoff ? "(Playoffs)" : ""}
                                            </MenuItem>
                                        );
                                    })}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            )}

            {/* Matchup Projection Tracker */}
            <Box sx={{ position: 'relative' }}>
                {periodLoading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '400px'
                        }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <CircularProgress size={40} sx={{ color: '#003366', mb: 2 }} />
                            <Typography sx={{ color: '#003366', fontWeight: 600 }}>
                                Updating projections...
                            </Typography>
                        </Box>
                    </Box>
                )}
                <MatchupProjectionTracker
                    matchupProjection={matchupProjection}
                    currentMatchup={currentMatchup}
                    onPlayerStatusChange={handlePlayerStatusChange}
                    isConnected={isConnected}
                    isFutureWeek={parseInt(selectedWeek, 10) > parseInt(currentYahooWeek, 10)}
                />
            </Box>
        </Box>
    );
};

export default MatchupProjection;

