import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Alert } from "@mui/material";
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
    
    const { selectedLeague, userLeagues, currentMatchup: contextMatchup, setCurrentMatchup: setContextMatchup } = useLeague();
    
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [currentMatchup, setCurrentMatchup] = useState(null);
    const [matchupProjection, setMatchupProjection] = useState(null);
    const [scheduleData, setScheduleData] = useState(null);
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
        const currentStatus = updatedDisabledPlayers[playerId];
        
        if (newStatus === 'enabled') {
            if (dateStr && typeof currentStatus === 'object' && currentStatus?.days) {
                const updatedDays = { ...currentStatus.days };
                delete updatedDays[dateStr];
                
                if (Object.keys(updatedDays).length === 0) {
                    if (currentStatus.week === 'disabled' || currentStatus.week === 'disabledForWeek') {
                        updatedDisabledPlayers[playerId] = { week: currentStatus.week };
                    } else {
                        delete updatedDisabledPlayers[playerId];
                    }
                } else {
                    updatedDisabledPlayers[playerId] = { 
                        ...currentStatus, 
                        days: updatedDays 
                    };
                }
            } else {
                updatedDisabledPlayers[playerId] = 'enabled';
            }
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
                console.log('Using matchup from context');
                setCurrentMatchup(contextMatchup);
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
                    if (setContextMatchup) {
                        setContextMatchup(data.matchup);
                    }
                    setCurrentMatchup(data.matchup);
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
    }, [isConnected, selectedLeague, userId, contextMatchup, setContextMatchup]);

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
            setInitialLoading(false);
    
        } catch (error) {
            console.error('Error calculating matchup projection:', error);
            setMatchupProjection(null);
            setInitialLoading(false);
        }
    };

    // Calculate projection when we have both matchup and schedule
    useEffect(() => {
        if (scheduleData && currentMatchup && !matchupProjection) {
            console.log('Triggering projection calculation');
            calculateMatchupProjection(currentMatchup);
        }
    }, [scheduleData, currentMatchup, matchupProjection]);

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

            {/* Matchup Projection Tracker */}
            <MatchupProjectionTracker
                matchupProjection={matchupProjection}
                currentMatchup={currentMatchup}
                onPlayerStatusChange={handlePlayerStatusChange}
                isConnected={isConnected}
            />
        </Box>
    );
};

export default MatchupProjection;

