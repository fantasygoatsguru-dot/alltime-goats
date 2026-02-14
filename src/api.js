import { supabase } from './utils/supabase';

export const fetchAllPlayers = async () => {
  try {
    const { data, error } = await supabase
      .from('alltime_player_season_averages')
      .select('player_id, player_name, season')
      .order('player_name', { ascending: true })
      .limit(1000);
    
    if (error) throw error;
    
    const playersMap = new Map();
    data.forEach(row => {
      if (!playersMap.has(row.player_id)) {
        playersMap.set(row.player_id, {
          id: row.player_id.toString(),
          name: row.player_name,
          seasons: []
        });
      }
      playersMap.get(row.player_id).seasons.push(row.season);
    });
    
    return Array.from(playersMap.values());
  } catch (error) {
    console.error('Error fetching all players:', error);
    throw error;
  }
};

export const fetchFilteredPlayerAverages = async (filterParams = {}) => {
  try {
    // Step 1: Filter players by demographic info (nationality, team, height, experience)
    let playerInfoQuery = supabase
      .from('alltime_player_info')
      .select('player_id');
    
    let applyPlayerInfoFilter = false;
    
    // Apply nationality filter
    if (filterParams.nationalities && filterParams.nationalities.length > 0) {
      playerInfoQuery = playerInfoQuery.in('nationality', filterParams.nationalities);
      applyPlayerInfoFilter = true;
    }
    
    // Apply team filter (use team_name from player_info, not team_abbreviation)
    if (filterParams.teamNames && filterParams.teamNames.length > 0) {
      playerInfoQuery = playerInfoQuery.in('team_name', filterParams.teamNames);
      applyPlayerInfoFilter = true;
    }
    
    // Apply height filter
    if (filterParams.height) {
      const { operand, value } = filterParams.height;
      switch (operand) {
        case '>': playerInfoQuery = playerInfoQuery.gt('height', value); break;
        case '>=': playerInfoQuery = playerInfoQuery.gte('height', value); break;
        case '<': playerInfoQuery = playerInfoQuery.lt('height', value); break;
        case '<=': playerInfoQuery = playerInfoQuery.lte('height', value); break;
        case '=': playerInfoQuery = playerInfoQuery.eq('height', value); break;
      }
      applyPlayerInfoFilter = true;
    }
    
    // Apply season experience filter
    if (filterParams.seasonExperience) {
      const { operand, value } = filterParams.seasonExperience;
      switch (operand) {
        case '>': playerInfoQuery = playerInfoQuery.gt('season_experience', value); break;
        case '>=': playerInfoQuery = playerInfoQuery.gte('season_experience', value); break;
        case '<': playerInfoQuery = playerInfoQuery.lt('season_experience', value); break;
        case '<=': playerInfoQuery = playerInfoQuery.lte('season_experience', value); break;
        case '=': playerInfoQuery = playerInfoQuery.eq('season_experience', value); break;
      }
      applyPlayerInfoFilter = true;
    }
    
    // Get filtered player IDs if we applied any player info filters
    let filteredPlayerIds = null;
    if (applyPlayerInfoFilter) {
      const { data: playerInfoData, error: playerInfoError } = await playerInfoQuery;
      if (playerInfoError) throw playerInfoError;
      filteredPlayerIds = playerInfoData.map(p => p.player_id);
      
      // If no players match the demographic filters, return empty
      if (filteredPlayerIds.length === 0) {
        return [];
      }
    }
    
    // Step 2: Query season averages with stat filters
    let seasonQuery = supabase
      .from('alltime_player_season_averages')
      .select('player_id, player_name, season, team_abbreviation, points_per_game, rebounds_per_game, assists_per_game, steals_per_game, blocks_per_game, three_pointers_per_game, field_goal_percentage, free_throw_percentage, turnovers_per_game, points_z, rebounds_z, assists_z, steals_z, blocks_z, three_pointers_z, fg_percentage_z, ft_percentage_z, turnovers_z, total_value');
    
    // Apply player ID filter if we have demographic filters
    if (filteredPlayerIds) {
      seasonQuery = seasonQuery.in('player_id', filteredPlayerIds);
    }
    
    // Apply season filter - convert year to season format (2020 -> "2019-20")
    if (filterParams.season) {
      const seasons = Array.isArray(filterParams.season) ? filterParams.season : [filterParams.season];
      // Each season string should be in format "YYYY-YY" where YYYY is the start year
      // So 2020 input means 2019-20 season, not 2020-21
      const convertedSeasons = seasons.map(s => {
        if (s.includes('-')) {
          return s; // Already in correct format
        }
        // Convert single year to season format
        const year = parseInt(s);
        const startYear = year - 1; // 2020 -> 2019
        const endYear = year % 100; // 2020 -> 20
        return `${startYear}-${endYear.toString().padStart(2, '0')}`;
      });
      seasonQuery = seasonQuery.in('season', convertedSeasons);
    }
    
    // Apply numeric filters with operators
    const numericFields = [
      { param: 'points', column: 'points_per_game' },
      { param: 'rebounds', column: 'rebounds_per_game' },
      { param: 'assists', column: 'assists_per_game' },
      { param: 'steals', column: 'steals_per_game' },
      { param: 'blocks', column: 'blocks_per_game' },
      { param: 'three_pointers', column: 'three_pointers_per_game' },
      { param: 'turnovers', column: 'turnovers_per_game' },
      { param: 'total_value', column: 'total_value' },
    ];
    
    numericFields.forEach(({ param, column }) => {
      if (filterParams[param]) {
        const { operand, value } = filterParams[param];
        switch (operand) {
          case '>':
            seasonQuery = seasonQuery.gt(column, value);
            break;
          case '>=':
            seasonQuery = seasonQuery.gte(column, value);
            break;
          case '<':
            seasonQuery = seasonQuery.lt(column, value);
            break;
          case '<=':
            seasonQuery = seasonQuery.lte(column, value);
            break;
          case '=':
            seasonQuery = seasonQuery.eq(column, value);
            break;
        }
      }
    });
    
    // Apply percentage filters
    if (filterParams.fgPercentage) {
      const { operand, value } = filterParams.fgPercentage;
      const percentValue = value / 100;
      switch (operand) {
        case '>': seasonQuery = seasonQuery.gt('field_goal_percentage', percentValue); break;
        case '>=': seasonQuery = seasonQuery.gte('field_goal_percentage', percentValue); break;
        case '<': seasonQuery = seasonQuery.lt('field_goal_percentage', percentValue); break;
        case '<=': seasonQuery = seasonQuery.lte('field_goal_percentage', percentValue); break;
        case '=': seasonQuery = seasonQuery.eq('field_goal_percentage', percentValue); break;
      }
    }
    
    if (filterParams.ftPercentage) {
      const { operand, value } = filterParams.ftPercentage;
      const percentValue = value / 100;
      switch (operand) {
        case '>': seasonQuery = seasonQuery.gt('free_throw_percentage', percentValue); break;
        case '>=': seasonQuery = seasonQuery.gte('free_throw_percentage', percentValue); break;
        case '<': seasonQuery = seasonQuery.lt('free_throw_percentage', percentValue); break;
        case '<=': seasonQuery = seasonQuery.lte('free_throw_percentage', percentValue); break;
        case '=': seasonQuery = seasonQuery.eq('free_throw_percentage', percentValue); break;
      }
    }
    
    // Order and limit to 200 results
    seasonQuery = seasonQuery.order('total_value', { ascending: false }).limit(200);
    
    const { data: seasonData, error: seasonError } = await seasonQuery;
    
    if (seasonError) throw seasonError;
    
    if (!seasonData || seasonData.length === 0) {
      return [];
    }
    
    // Get unique player IDs
    const playerIds = [...new Set(seasonData.map(row => row.player_id))];
    
    // Fetch player info for all players (with limit)
    const { data: playerInfo, error: playerInfoError } = await supabase
      .from('alltime_player_info')
      .select('player_id, position, nationality, height, season_experience')
      .in('player_id', playerIds.slice(0, 200));
    
    if (playerInfoError) {
      console.warn('Error fetching player info, using defaults:', playerInfoError);
    }
    
    // Create a map for quick lookup
    const playerInfoMap = (playerInfo || []).reduce((acc, info) => {
      acc[info.player_id] = info;
      return acc;
    }, {});
    
    // Transform data to match expected format
    return seasonData.map(row => {
      const info = playerInfoMap[row.player_id] || {};
      return {
        playerId: row.player_id,
        playerName: row.player_name,
        season: row.season,
        position: info.position || 'N/A',
        teamName: row.team_abbreviation,
        nationality: info.nationality || 'N/A',
        height: info.height || 'N/A',
        seasonExperience: info.season_experience || 0,
        stats: {
          points: row.points_per_game,
          rebounds: row.rebounds_per_game,
          assists: row.assists_per_game,
          steals: row.steals_per_game,
          blocks: row.blocks_per_game,
          three_pointers: row.three_pointers_per_game,
          field_goal_percentage: row.field_goal_percentage,
          free_throw_percentage: row.free_throw_percentage,
          turnovers: row.turnovers_per_game,
          points_z: row.points_z,
          rebounds_z: row.rebounds_z,
          assists_z: row.assists_z,
          steals_z: row.steals_z,
          blocks_z: row.blocks_z,
          three_pointers_z: row.three_pointers_z,
          field_goal_percentage_z: row.fg_percentage_z,
          free_throw_percentage_z: row.ft_percentage_z,
          turnovers_z: row.turnovers_z,
          total_value: row.total_value
        }
      };
    });
  } catch (error) {
    console.error('Error fetching filtered player averages:', error);
    throw error;
  }
};

export const fetchFilteredPlayerGameStats = async (filterParams = {}) => {
  try {
    // Step 1: Filter players by demographic info (nationality, team, height, experience)
    let playerInfoQuery = supabase
      .from('alltime_player_info')
      .select('player_id');
    
    let applyPlayerInfoFilter = false;
    
    // Apply nationality filter
    if (filterParams.nationalities && filterParams.nationalities.length > 0) {
      playerInfoQuery = playerInfoQuery.in('nationality', filterParams.nationalities);
      applyPlayerInfoFilter = true;
    }

    // Apply team filter (use team_name from player_info, not team_abbreviation)
    if (filterParams.teamNames && filterParams.teamNames.length > 0) {
      playerInfoQuery = playerInfoQuery.in('team_name', filterParams.teamNames);
      applyPlayerInfoFilter = true;
    }
    
    // Apply height filter
    if (filterParams.height) {
      const { operand, value } = filterParams.height;
      switch (operand) {
        case '>': playerInfoQuery = playerInfoQuery.gt('height', value); break;
        case '>=': playerInfoQuery = playerInfoQuery.gte('height', value); break;
        case '<': playerInfoQuery = playerInfoQuery.lt('height', value); break;
        case '<=': playerInfoQuery = playerInfoQuery.lte('height', value); break;
        case '=': playerInfoQuery = playerInfoQuery.eq('height', value); break;
      }
      applyPlayerInfoFilter = true;
    }
    
    // Apply season experience filter
    if (filterParams.seasonExperience) {
      const { operand, value } = filterParams.seasonExperience;
      switch (operand) {
        case '>': playerInfoQuery = playerInfoQuery.gt('season_experience', value); break;
        case '>=': playerInfoQuery = playerInfoQuery.gte('season_experience', value); break;
        case '<': playerInfoQuery = playerInfoQuery.lt('season_experience', value); break;
        case '<=': playerInfoQuery = playerInfoQuery.lte('season_experience', value); break;
        case '=': playerInfoQuery = playerInfoQuery.eq('season_experience', value); break;
      }
      applyPlayerInfoFilter = true;
    }
    
    // Get filtered player IDs if we applied any player info filters
    let filteredPlayerIds = null;
    if (applyPlayerInfoFilter) {
      const { data: playerInfoData, error: playerInfoError } = await playerInfoQuery;
      if (playerInfoError) throw playerInfoError;
      filteredPlayerIds = playerInfoData.map(p => p.player_id);
      
      // If no players match the demographic filters, return empty
      if (filteredPlayerIds.length === 0) {
        return [];
      }
    }
    
    // Step 2: Query game logs with stat filters
    let query = supabase
      .from('alltime_player_game_logs')
      .select('player_id, player_name, season, team_abbreviation, points, rebounds, assists, steals, blocks, three_pointers_made, field_goals_made, field_goals_attempted, free_throws_made, free_throws_attempted, turnovers, fantasy_points');
    
    // Apply player ID filter if we have demographic filters
    if (filteredPlayerIds) {
      query = query.in('player_id', filteredPlayerIds);
    }
    
    // Apply season filter - convert year to season format (2020 -> "2019-20")
    if (filterParams.season) {
      const seasons = Array.isArray(filterParams.season) ? filterParams.season : [filterParams.season];
      // Each season string should be in format "YYYY-YY" where YYYY is the start year
      // So 2020 input means 2019-20 season, not 2020-21
      const convertedSeasons = seasons.map(s => {
        if (s.includes('-')) {
          return s; // Already in correct format
        }
        // Convert single year to season format
        const year = parseInt(s);
        const startYear = year - 1; // 2020 -> 2019
        const endYear = year % 100; // 2020 -> 20
        return `${startYear}-${endYear.toString().padStart(2, '0')}`;
      });
      query = query.in('season', convertedSeasons);
    }
    
    // Apply numeric filters with operators
    const numericFields = [
      { param: 'points', column: 'points' },
      { param: 'rebounds', column: 'rebounds' },
      { param: 'assists', column: 'assists' },
      { param: 'steals', column: 'steals' },
      { param: 'blocks', column: 'blocks' },
      { param: 'three_pointers', column: 'three_pointers_made' },
      { param: 'turnovers', column: 'turnovers' },
      { param: 'fantasy_points', column: 'fantasy_points' },
    ];
    
    numericFields.forEach(({ param, column }) => {
      if (filterParams[param]) {
        const { operand, value } = filterParams[param];
        switch (operand) {
          case '>':
            query = query.gt(column, value);
            break;
          case '>=':
            query = query.gte(column, value);
            break;
          case '<':
            query = query.lt(column, value);
            break;
          case '<=':
            query = query.lte(column, value);
            break;
          case '=':
            query = query.eq(column, value);
            break;
        }
      }
    });
    
    // Order and limit to 200 results
    query = query.order('fantasy_points', { ascending: false }).limit(200);
    
    const { data: gameData, error: gameError } = await query;
    
    if (gameError) throw gameError;
    
    if (!gameData || gameData.length === 0) {
      return [];
    }
    
    // Get unique player IDs
    const playerIds = [...new Set(gameData.map(row => row.player_id))];
    
    // Fetch player info for all players (with limit)
    const { data: playerInfo, error: playerInfoError } = await supabase
      .from('alltime_player_info')
      .select('player_id, position, nationality, height, season_experience')
      .in('player_id', playerIds.slice(0, 500));
    
    if (playerInfoError) {
      console.warn('Error fetching player info, using defaults:', playerInfoError);
    }
    
    // Create a map for quick lookup
    const playerInfoMap = (playerInfo || []).reduce((acc, info) => {
      acc[info.player_id] = info;
      return acc;
    }, {});
    
    // Transform data and calculate percentages
    return gameData.map(row => {
      const info = playerInfoMap[row.player_id] || {};
      return {
        playerId: row.player_id,
        playerName: row.player_name,
        season: row.season,
        position: info.position || 'N/A',
        teamName: row.team_abbreviation,
        nationality: info.nationality || 'N/A',
        height: info.height || 'N/A',
        seasonExperience: info.season_experience || 0,
        stats: {
          points: row.points,
          rebounds: row.rebounds,
          assists: row.assists,
          steals: row.steals,
          blocks: row.blocks,
          three_pointers: row.three_pointers_made,
          field_goal_percentage: row.field_goals_attempted > 0 
            ? row.field_goals_made / row.field_goals_attempted 
            : 0,
          free_throw_percentage: row.free_throws_attempted > 0 
            ? row.free_throws_made / row.free_throws_attempted 
            : 0,
          turnovers: row.turnovers,
          fantasy_points: row.fantasy_points
        }
      };
    });
  } catch (error) {
    console.error('Error fetching filtered player game stats:', error);
    throw error;
  }
};

export const fetchAllTimePlayerStats = async (players) => {
  try {
    if (!players || players.length === 0) {
      return [];
    }
    
    const team1Players = players.filter(p => p.team === 'team1');
    const team2Players = players.filter(p => p.team === 'team2');
    
    // Limit to 200 players max for safety
    const limitedPlayers = players.slice(0, 500);
    
    // Fetch all player stats from Supabase
    // We need to query each player-season combination
    const fetchPromises = limitedPlayers.map(async (player) => {
      const { data, error } = await supabase
        .from('alltime_player_season_averages')
        .select('*')
        .eq('player_id', parseInt(player.id))
        .eq('season', player.season)
        .single();
      
      if (error) {
        console.error(`Error fetching player ${player.id} season ${player.season}:`, error);
        return null;
      }
      
      return data;
    });
    
    const results = await Promise.all(fetchPromises);
    const validResults = results.filter(r => r !== null);
    
    // Fetch player info for additional data
    const playerIds = [...new Set(validResults.map(r => r.player_id))];
    const { data: playerInfo } = await supabase
      .from('alltime_player_info')
      .select('player_id, position')
      .in('player_id', playerIds.slice(0, 200));
    
    const playerInfoMap = (playerInfo || []).reduce((acc, info) => {
      acc[info.player_id] = info;
      return acc;
    }, {});
    
    const playerStats = validResults.map(row => {
      const info = playerInfoMap[row.player_id] || {};
      return {
        playerId: row.player_id,
        playerName: row.player_name,
        season: row.season,
        position: info.position || 'N/A',
        teamName: row.team_abbreviation,
        stats: {
          points: row.points_per_game,
          rebounds: row.rebounds_per_game,
          assists: row.assists_per_game,
          steals: row.steals_per_game,
          blocks: row.blocks_per_game,
          three_pointers: row.three_pointers_per_game,
          field_goal_percentage: row.field_goal_percentage,
          free_throw_percentage: row.free_throw_percentage,
          turnovers: row.turnovers_per_game,
          points_z: row.points_z,
          rebounds_z: row.rebounds_z,
          assists_z: row.assists_z,
          steals_z: row.steals_z,
          blocks_z: row.blocks_z,
          three_pointers_z: row.three_pointers_z,
          field_goal_percentage_z: row.fg_percentage_z,
          free_throw_percentage_z: row.ft_percentage_z,
          turnovers_z: row.turnovers_z,
          total_value: row.total_value
        }
      };
    });
    
    const calculateTeamStats = (teamPlayers, statsResults) => {
      const teamStats = statsResults.filter(stat => 
        teamPlayers.some(p => parseInt(p.id) === stat.playerId && p.season === stat.season)
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
    
    const calculateTeamZScores = (teamPlayers, statsResults) => {
      const teamStats = statsResults.filter(stat => 
        teamPlayers.some(p => parseInt(p.id) === stat.playerId && p.season === stat.season)
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
    
    const calculateTeamContributions = (teamPlayers, statsResults) => {
      const teamStats = statsResults.filter(stat => 
        teamPlayers.some(p => parseInt(p.id) === stat.playerId && p.season === stat.season)
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
    
    const teamAverages = {
      team1Averages: calculateTeamStats(team1Players, playerStats),
      team2Averages: calculateTeamStats(team2Players, playerStats),
      team1ZScores: calculateTeamZScores(team1Players, playerStats),
      team2ZScores: calculateTeamZScores(team2Players, playerStats),
      team1Contributions: calculateTeamContributions(team1Players, playerStats),
      team2Contributions: calculateTeamContributions(team2Players, playerStats)
    };
    
    console.log('Final teamAverages:', teamAverages);
    
    return [
      ...playerStats,
      { teamAverages }
    ];
  } catch (error) {
    console.error('Error fetching all time player stats:', error);
    throw error;
  }
};

const AFFILIATE_LINKS_MAX = 3;

export const fetchAffiliateLinks = async () => {
  try {
    const { data, error } = await supabase
      .from('affiliate_links')
      .select('id, label, url, thumbnail_url')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(AFFILIATE_LINKS_MAX);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching affiliate links:', error);
    return [];
  }
};

export const recordAffiliateClick = async (affiliateLinkId) => {
  try {
    await supabase.from('affiliate_clicks').insert({ affiliate_link_id: affiliateLinkId });
  } catch (error) {
    console.error('Error recording affiliate click:', error);
  }
};

const getBrowserId = () => {
  let id = localStorage.getItem('site_browser_id');
  if (!id) {
    id = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('site_browser_id', id);
  }
  return id;
};

// 1. Fetch Comments
export const fetchCommentsForPost = async (sanityPostId) => {
  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('sanity_post_id', sanityPostId)
    .eq('approved', true) // Only show approved
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

// 2. Submit Comment
export const submitComment = async ({ sanityPostId, authorName, authorEmail, body }) => {
  const { data, error } = await supabase
    .from('post_comments')
    .insert([
      {
        sanity_post_id: sanityPostId,
        author_name: authorName,
        author_email: authorEmail,
        body: body,
      },
    ]);

  if (error) throw error;
  return data;
};

// 3. Fetch Likes Count
export const fetchLikesCount = async (sanityPostId) => {
  const { count, error } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true }) // 'head' means don't download data, just count
    .eq('sanity_post_id', sanityPostId);

  if (error) throw error;
  return count || 0;
};

// 4. Add Like (with Deduplication)
export const addLike = async ({ sanityPostId }) => {
  const userId = getBrowserId();
  
  const { data, error } = await supabase
    .from('post_likes')
    .insert([
      { sanity_post_id: sanityPostId, user_identifier: userId }
    ]);

  // If error code is 23505 (Unique Violation), the user already liked it. 
  // We can ignore this error.
  if (error && error.code !== '23505') throw error;
  
  return data;
};