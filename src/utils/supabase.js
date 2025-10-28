import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CURRENT_SEASON = "2025-26";

export const fetchAllPlayersFromSupabase = async () => {
    try {
        const { data, error } = await supabase
            .from('player_season_averages')
            .select('player_id, player_name')
            .eq('season', CURRENT_SEASON)
            .order('player_name');

        if (error) throw error;

        return data.map(row => ({
            id: row.player_id,
            name: row.player_name
        }));
    } catch (error) {
        console.error('Error fetching players:', error);
        throw error;
    }
};

export const fetchPlayerStatsFromSupabase = async (players, team1Players, team2Players, team1Name, team2Name) => {
    try {
        if (!players || players.length === 0) return [];

        const team1PlayerList = players.filter(p => p.team === 'team1');
        const team2PlayerList = players.filter(p => p.team === 'team2');

        const playerIds = [...new Set(players.map(p => p.id).filter(id => id))];

        if (playerIds.length === 0) return [];

        const { data, error } = await supabase
            .from('player_season_averages')
            .select('*')
            .eq('season', CURRENT_SEASON)
            .in('player_id', playerIds);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log('Fetched player stats from Supabase:', data);

        const playerStats = data.map(row => ({
            playerId: row.player_id,
            playerName: row.player_name,
            stats: {
                points: row.points_per_game || 0,
                rebounds: row.rebounds_per_game || 0,
                assists: row.assists_per_game || 0,
                steals: row.steals_per_game || 0,
                blocks: row.blocks_per_game || 0,
                three_pointers: row.three_pointers_per_game || 0,
                field_goal_percentage: row.field_goal_percentage || 0,
                free_throw_percentage: row.free_throw_percentage || 0,
                turnovers: row.turnovers_per_game || 0,
                points_z: row.points_z || 0,
                rebounds_z: row.rebounds_z || 0,
                assists_z: row.assists_z || 0,
                steals_z: row.steals_z || 0,
                blocks_z: row.blocks_z || 0,
                three_pointers_z: row.three_pointers_z || 0,
                field_goal_percentage_z: row.fg_percentage_z || 0,
                free_throw_percentage_z: row.ft_percentage_z || 0,
                turnovers_z: row.turnovers_z || 0,
            }
        }));

        console.log('Processed player stats with z-scores:', playerStats);

        const calculateTeamStats = (teamPlayerList, statsResults) => {
            const teamStats = statsResults.filter(stat => 
                teamPlayerList.some(p => p.id === stat.playerId)
            );
            
            if (teamStats.length === 0) {
                return {
                    Points: 0, '3pt': 0, Assists: 0, Steals: 0, 'FT%': 0,
                    'FG%': 0, Turnovers: 0, Blocks: 0, Rebounds: 0
                };
            }
            
            const avgFG = teamStats.reduce((sum, s) => sum + (s.stats.field_goal_percentage || 0), 0) / teamStats.length;
            const avgFT = teamStats.reduce((sum, s) => sum + (s.stats.free_throw_percentage || 0), 0) / teamStats.length;
            
            return {
                Points: teamStats.reduce((sum, s) => sum + (s.stats.points || 0), 0),
                '3pt': teamStats.reduce((sum, s) => sum + (s.stats.three_pointers || 0), 0),
                Assists: teamStats.reduce((sum, s) => sum + (s.stats.assists || 0), 0),
                Steals: teamStats.reduce((sum, s) => sum + (s.stats.steals || 0), 0),
                'FT%': avgFT * 100,
                'FG%': avgFG * 100,
                Turnovers: teamStats.reduce((sum, s) => sum + (s.stats.turnovers || 0), 0),
                Blocks: teamStats.reduce((sum, s) => sum + (s.stats.blocks || 0), 0),
                Rebounds: teamStats.reduce((sum, s) => sum + (s.stats.rebounds || 0), 0)
            };
        };

        const calculateTeamZScores = (teamPlayerList, statsResults) => {
            const teamStats = statsResults.filter(stat => 
                teamPlayerList.some(p => p.id === stat.playerId)
            );
            
            if (teamStats.length === 0) {
                return {
                    Points: 0, '3pt': 0, Assists: 0, Steals: 0, 'FT%': 0,
                    'FG%': 0, Turnovers: 0, Blocks: 0, Rebounds: 0
                };
            }
            
            return {
                Points: teamStats.reduce((sum, s) => sum + (s.stats.points_z || 0), 0),
                '3pt': teamStats.reduce((sum, s) => sum + (s.stats.three_pointers_z || 0), 0),
                Assists: teamStats.reduce((sum, s) => sum + (s.stats.assists_z || 0), 0),
                Steals: teamStats.reduce((sum, s) => sum + (s.stats.steals_z || 0), 0),
                'FT%': teamStats.reduce((sum, s) => sum + (s.stats.free_throw_percentage_z || 0), 0),
                'FG%': teamStats.reduce((sum, s) => sum + (s.stats.field_goal_percentage_z || 0), 0),
                Turnovers: teamStats.reduce((sum, s) => sum + (s.stats.turnovers_z || 0), 0),
                Blocks: teamStats.reduce((sum, s) => sum + (s.stats.blocks_z || 0), 0),
                Rebounds: teamStats.reduce((sum, s) => sum + (s.stats.rebounds_z || 0), 0)
            };
        };

        const calculateTeamContributions = (teamPlayerList, statsResults) => {
            const teamStats = statsResults.filter(stat => 
                teamPlayerList.some(p => p.id === stat.playerId)
            );
            
            const contributions = {};
            const categories = ['Points', '3pt', 'Assists', 'Steals', 'FT%', 'FG%', 'Turnovers', 'Blocks', 'Rebounds'];
            
            categories.forEach(category => {
                contributions[category] = teamStats.map(stat => {
                    let value = 0;
                    switch (category) {
                        case 'Points': value = stat.stats.points || 0; break;
                        case '3pt': value = stat.stats.three_pointers || 0; break;
                        case 'Assists': value = stat.stats.assists || 0; break;
                        case 'Steals': value = stat.stats.steals || 0; break;
                        case 'FT%': value = (stat.stats.free_throw_percentage || 0) * 100; break;
                        case 'FG%': value = (stat.stats.field_goal_percentage || 0) * 100; break;
                        case 'Turnovers': value = stat.stats.turnovers || 0; break;
                        case 'Blocks': value = stat.stats.blocks || 0; break;
                        case 'Rebounds': value = stat.stats.rebounds || 0; break;
                    }
                    
                    return {
                        playerName: stat.playerName,
                        value: value
                    };
                });
            });
            
            return contributions;
        };

        console.log('Team1Players for calculations:', team1Players);
        console.log('Team2Players for calculations:', team2Players);

        const teamAverages = {
            team1Averages: calculateTeamStats(team1PlayerList, playerStats),
            team2Averages: calculateTeamStats(team2PlayerList, playerStats),
            team1ZScores: calculateTeamZScores(team1PlayerList, playerStats),
            team2ZScores: calculateTeamZScores(team2PlayerList, playerStats),
            team1Contributions: calculateTeamContributions(team1PlayerList, playerStats),
            team2Contributions: calculateTeamContributions(team2PlayerList, playerStats)
        };

        return [
            ...playerStats,
            { teamAverages }
        ];
    } catch (error) {
        console.error('Error fetching player stats:', error);
        throw error;
    }
};

export const fetchWeeklyMatchupResults = async (team1PlayersList, team2PlayersList, team1Name, team2Name) => {
    try {
        const activeTeam1Players = team1PlayersList.filter(p => p.active).map(p => p.nbaPlayerId || p.yahooPlayerId || p.id);
        const activeTeam2Players = team2PlayersList.filter(p => p.active).map(p => p.nbaPlayerId || p.yahooPlayerId || p.id);

        if (activeTeam1Players.length === 0 || activeTeam2Players.length === 0) {
            return [];
        }

        const allPlayerIds = [...activeTeam1Players, ...activeTeam2Players];
        
        const { data, error } = await supabase
            .from('player_game_logs')
            .select('*')
            .eq('season', CURRENT_SEASON)
            .in('player_id', allPlayerIds)
            .order('game_date', { ascending: true });

        if (error) throw error;

        const getWeekFromDate = (dateStr) => {
            const date = new Date(dateStr);
            const startDate = new Date('2025-10-20');
            const diffTime = date - startDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return Math.floor(diffDays / 7) + 1;
        };

        const weeksData = {};
        
        data.forEach(game => {
            const week = getWeekFromDate(game.game_date);
            if (!weeksData[week]) {
                weeksData[week] = { 
                    week, 
                    weekStart: game.game_date,
                    team1Stats: {}, 
                    team2Stats: {} 
                };
            }

            const playerTeam = activeTeam1Players.includes(game.player_id) ? 'team1' : 'team2';
            const stats = playerTeam === 'team1' ? weeksData[week].team1Stats : weeksData[week].team2Stats;

            stats.Points = (stats.Points || 0) + (game.points || 0);
            stats['3pt'] = (stats['3pt'] || 0) + (game.three_pointers_made || 0);
            stats.Assists = (stats.Assists || 0) + (game.assists || 0);
            stats.Steals = (stats.Steals || 0) + (game.steals || 0);
            stats.Blocks = (stats.Blocks || 0) + (game.blocks || 0);
            stats.Rebounds = (stats.Rebounds || 0) + (game.rebounds || 0);
            stats.Turnovers = (stats.Turnovers || 0) + (game.turnovers || 0);

            stats.FGMade = (stats.FGMade || 0) + (game.field_goals_made || 0);
            stats.FGAttempted = (stats.FGAttempted || 0) + (game.field_goals_attempted || 0);
            stats.FTMade = (stats.FTMade || 0) + (game.free_throws_made || 0);
            stats.FTAttempted = (stats.FTAttempted || 0) + (game.free_throws_attempted || 0);
        });

        const results = Object.values(weeksData).map(weekData => {
            const team1FG = weekData.team1Stats.FGAttempted > 0 
                ? (weekData.team1Stats.FGMade / weekData.team1Stats.FGAttempted) * 100 
                : 0;
            const team2FG = weekData.team2Stats.FGAttempted > 0 
                ? (weekData.team2Stats.FGMade / weekData.team2Stats.FGAttempted) * 100 
                : 0;
            const team1FT = weekData.team1Stats.FTAttempted > 0 
                ? (weekData.team1Stats.FTMade / weekData.team1Stats.FTAttempted) * 100 
                : 0;
            const team2FT = weekData.team2Stats.FTAttempted > 0 
                ? (weekData.team2Stats.FTMade / weekData.team2Stats.FTAttempted) * 100 
                : 0;

            const finalTeam1Stats = { ...weekData.team1Stats, 'FG%': team1FG.toFixed(2), 'FT%': team1FT.toFixed(2) };
            const finalTeam2Stats = { ...weekData.team2Stats, 'FG%': team2FG.toFixed(2), 'FT%': team2FT.toFixed(2) };

            let team1Wins = 0;
            const categoryResults = {};
            
            ['Points', '3pt', 'Assists', 'Steals', 'Blocks', 'Rebounds'].forEach(cat => {
                if (finalTeam1Stats[cat] > finalTeam2Stats[cat]) {
                    team1Wins++;
                    categoryResults[cat] = { winner: team1Name, t1: finalTeam1Stats[cat], t2: finalTeam2Stats[cat] };
                } else if (finalTeam2Stats[cat] > finalTeam1Stats[cat]) {
                    categoryResults[cat] = { winner: team2Name, t1: finalTeam1Stats[cat], t2: finalTeam2Stats[cat] };
                } else {
                    categoryResults[cat] = { winner: 'Tie', t1: finalTeam1Stats[cat], t2: finalTeam2Stats[cat] };
                }
            });

            ['FG%', 'FT%'].forEach(cat => {
                if (parseFloat(finalTeam1Stats[cat]) > parseFloat(finalTeam2Stats[cat])) {
                    team1Wins++;
                    categoryResults[cat] = { winner: team1Name, t1: finalTeam1Stats[cat], t2: finalTeam2Stats[cat] };
                } else if (parseFloat(finalTeam2Stats[cat]) > parseFloat(finalTeam1Stats[cat])) {
                    categoryResults[cat] = { winner: team2Name, t1: finalTeam1Stats[cat], t2: finalTeam2Stats[cat] };
                } else {
                    categoryResults[cat] = { winner: 'Tie', t1: finalTeam1Stats[cat], t2: finalTeam2Stats[cat] };
                }
            });

            const team2Wins = 9 - team1Wins - 1;
            
            const turn1Won = finalTeam1Stats.Turnovers < finalTeam2Stats.Turnovers;
            const turnWinner = turn1Won ? team1Name : finalTeam2Stats.Turnovers < finalTeam1Stats.Turnovers ? team2Name : 'Tie';
            categoryResults['Turnovers'] = { winner: turnWinner, t1: finalTeam1Stats.Turnovers, t2: finalTeam2Stats.Turnovers };
            
            if (turn1Won) team1Wins++;
            
            return {
                week: weekData.week,
                weekStart: weekData.weekStart,
                teams: [team1Name, team2Name],
                stats: {
                    ...finalTeam1Stats,
                    ...Object.fromEntries(['Points', '3pt', 'Assists', 'Steals', 'FT%', 'FG%', 'Turnovers', 'Blocks', 'Rebounds'].map(c => {
                        const t1 = c === 'FG%' || c === 'FT%' ? parseFloat(finalTeam1Stats[c]).toFixed(2) : Math.round(finalTeam1Stats[c] || 0);
                        const t2 = c === 'FG%' || c === 'FT%' ? parseFloat(finalTeam2Stats[c]).toFixed(2) : Math.round(finalTeam2Stats[c] || 0);
                        return [c, { [team1Name]: t1, [team2Name]: t2 }];
                    }))
                },
                score: `${team1Wins}-${team2Wins}`,
                winner: team1Wins > team2Wins ? team1Name : team2Wins > team1Wins ? team2Name : 'Tie',
                categoryResults
            };
        });

        return results;
    } catch (error) {
        console.error('Error fetching weekly matchup results:', error);
        throw error;
    }
};

export { supabase, CURRENT_SEASON };

