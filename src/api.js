import { executeQuery } from './utils/database';

export const fetchAllPlayers = async () => {
  try {
    const query = `
      SELECT DISTINCT player_id as id, player_name as name, season
      FROM player_season_averages 
      ORDER BY player_name ASC
    `;
    
    const results = await executeQuery(query);
    
    const playersMap = new Map();
    results.forEach(row => {
      if (!playersMap.has(row.id)) {
        playersMap.set(row.id, {
          id: row.id,
          name: row.name,
          seasons: []
        });
      }
      playersMap.get(row.id).seasons.push(row.season);
    });
    
    return Array.from(playersMap.values());
  } catch (error) {
    console.error('Error fetching all players:', error);
    throw error;
  }
};

export const fetchFilteredPlayerAverages = async (filterParams = {}) => {
  try {
    let query = `
      SELECT 
        pi.player_id as playerId,
        pi.player_name as playerName,
        psa.season,
        pi.position,
        pi.team_name as teamName,
        pi.nationality,
        pi.height,
        pi.season_experience as seasonExperience,
        psa.points_per_game as points,
        psa.rebounds_per_game as rebounds,
        psa.assists_per_game as assists,
        psa.steals_per_game as steals,
        psa.blocks_per_game as blocks,
        psa.three_pointers_per_game as three_pointers,
        psa.field_goal_percentage,
        psa.free_throw_percentage,
        psa.turnovers_per_game as turnovers,
        psa.points_z,
        psa.rebounds_z,
        psa.assists_z,
        psa.steals_z,
        psa.blocks_z,
        psa.three_pointers_z,
        psa.fg_percentage_z as field_goal_percentage_z,
        psa.ft_percentage_z as free_throw_percentage_z,
        psa.turnovers_z,
        psa.total_value
      FROM player_season_averages psa
      JOIN player_general_info pi ON psa.player_id = pi.player_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filterParams.season) {
      const seasons = Array.isArray(filterParams.season) ? filterParams.season : [filterParams.season];
      const placeholders = seasons.map(() => '?').join(',');
      query += ` AND psa.season IN (${placeholders})`;
      params.push(...seasons);
    }
    
    if (filterParams.teamNames && filterParams.teamNames.length > 0) {
      const placeholders = filterParams.teamNames.map(() => '?').join(',');
      query += ` AND pi.team_name IN (${placeholders})`;
      params.push(...filterParams.teamNames);
    }
    
    if (filterParams.nationalities && filterParams.nationalities.length > 0) {
      const placeholders = filterParams.nationalities.map(() => '?').join(',');
      query += ` AND pi.nationality IN (${placeholders})`;
      params.push(...filterParams.nationalities);
    }
    
    if (filterParams.seasonExperience) {
      query += ` AND pi.season_experience ${filterParams.seasonExperience.operand} ?`;
      params.push(filterParams.seasonExperience.value);
    }
    
    if (filterParams.height) {
      query += ` AND pi.height ${filterParams.height.operand} ?`;
      params.push(filterParams.height.value);
    }
    
    const numericFields = ['rebounds', 'points', 'assists', 'steals', 'blocks', 'three_pointers', 'turnovers', 'total_value'];
    numericFields.forEach(field => {
      if (filterParams[field]) {
        const dbField = field === 'three_pointers' ? 'three_pointers_per_game' : 
                        field === 'total_value' ? 'total_value' : `${field}_per_game`;
        query += ` AND psa.${dbField} ${filterParams[field].operand} ?`;
        params.push(filterParams[field].value);
      }
    });
    
    if (filterParams.fgPercentage) {
      query += ` AND psa.field_goal_percentage ${filterParams.fgPercentage.operand} ?`;
      params.push(filterParams.fgPercentage.value / 100);
    }
    
    if (filterParams.ftPercentage) {
      query += ` AND psa.free_throw_percentage ${filterParams.ftPercentage.operand} ?`;
      params.push(filterParams.ftPercentage.value / 100);
    }
    
    query += ' ORDER BY psa.total_value DESC LIMIT 1000';
    
    const results = await executeQuery(query, params);
    
    return results.map(row => ({
      playerId: row.playerId,
      playerName: row.playerName,
      season: row.season,
      position: row.position,
      teamName: row.teamName,
      nationality: row.nationality,
      height: row.height,
      seasonExperience: row.seasonExperience,
      stats: {
        points: row.points,
        rebounds: row.rebounds,
        assists: row.assists,
        steals: row.steals,
        blocks: row.blocks,
        three_pointers: row.three_pointers,
        field_goal_percentage: row.field_goal_percentage,
        free_throw_percentage: row.free_throw_percentage,
        turnovers: row.turnovers,
        points_z: row.points_z,
        rebounds_z: row.rebounds_z,
        assists_z: row.assists_z,
        steals_z: row.steals_z,
        blocks_z: row.blocks_z,
        three_pointers_z: row.three_pointers_z,
        field_goal_percentage_z: row.field_goal_percentage_z,
        free_throw_percentage_z: row.free_throw_percentage_z,
        turnovers_z: row.turnovers_z,
        total_value: row.total_value
      }
    }));
  } catch (error) {
    console.error('Error fetching filtered player averages:', error);
    throw error;
  }
};

export const fetchFilteredPlayerGameStats = async (filterParams = {}) => {
  try {
    let query = `
      SELECT 
        pgl.player_id as playerId,
        pgl.player_name as playerName,
        pgl.season,
        pi.position,
        pi.team_name as teamName,
        pi.nationality,
        pi.height,
        pi.season_experience as seasonExperience,
        pgl.points,
        pgl.rebounds,
        pgl.assists,
        pgl.steals,
        pgl.blocks,
        pgl.three_pointers_made as three_pointers,
        pgl.field_goal_percentage,
        pgl.free_throw_percentage,
        pgl.turnovers,
        pgl.fantasy_points
      FROM player_game_logs pgl
      JOIN player_general_info pi ON pgl.player_id = pi.player_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filterParams.season) {
      const seasons = Array.isArray(filterParams.season) ? filterParams.season : [filterParams.season];
      const placeholders = seasons.map(() => '?').join(',');
      query += ` AND pgl.season IN (${placeholders})`;
      params.push(...seasons);
    }
    
    if (filterParams.teamNames && filterParams.teamNames.length > 0) {
      const placeholders = filterParams.teamNames.map(() => '?').join(',');
      query += ` AND pi.team_name IN (${placeholders})`;
      params.push(...filterParams.teamNames);
    }
    
    if (filterParams.nationalities && filterParams.nationalities.length > 0) {
      const placeholders = filterParams.nationalities.map(() => '?').join(',');
      query += ` AND pi.nationality IN (${placeholders})`;
      params.push(...filterParams.nationalities);
    }
    
    if (filterParams.positions && filterParams.positions.length > 0) {
      const placeholders = filterParams.positions.map(() => '?').join(',');
      query += ` AND pi.position IN (${placeholders})`;
      params.push(...filterParams.positions);
    }
    
    if (filterParams.seasonExperience) {
      query += ` AND pi.season_experience ${filterParams.seasonExperience.operand} ?`;
      params.push(filterParams.seasonExperience.value);
    }
    
    if (filterParams.height) {
      query += ` AND pi.height ${filterParams.height.operand} ?`;
      params.push(filterParams.height.value);
    }
    
    const numericFields = ['points', 'rebounds', 'assists', 'steals', 'blocks', 'three_pointers', 'turnovers', 'fantasy_points'];
    numericFields.forEach(field => {
      if (filterParams[field]) {
        const dbField = field === 'three_pointers' ? 'three_pointers_made' : field;
        query += ` AND pgl.${dbField} ${filterParams[field].operand} ?`;
        params.push(filterParams[field].value);
      }
    });
    
    if (filterParams.fgPercentage) {
      query += ` AND pgl.field_goal_percentage ${filterParams.fgPercentage.operand} ?`;
      params.push(filterParams.fgPercentage.value / 100);
    }
    
    if (filterParams.ftPercentage) {
      query += ` AND pgl.free_throw_percentage ${filterParams.ftPercentage.operand} ?`;
      params.push(filterParams.ftPercentage.value / 100);
    }
    
    query += ' ORDER BY pgl.fantasy_points DESC LIMIT 1000';
    
    const results = await executeQuery(query, params);
    
    return results.map(row => ({
      playerId: row.playerId,
      playerName: row.playerName,
      season: row.season,
      position: row.position,
      teamName: row.teamName,
      nationality: row.nationality,
      height: row.height,
      seasonExperience: row.seasonExperience,
      stats: {
        points: row.points,
        rebounds: row.rebounds,
        assists: row.assists,
        steals: row.steals,
        blocks: row.blocks,
        three_pointers: row.three_pointers,
        field_goal_percentage: row.field_goal_percentage,
        free_throw_percentage: row.free_throw_percentage,
        turnovers: row.turnovers,
        fantasy_points: row.fantasy_points
      }
    }));
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
    
    const allPlayerConditions = players.map(() => '(psa.player_id = ? AND psa.season = ?)');
    const allParams = players.flatMap(p => [p.id, p.season]);
    
    const query = `
      SELECT 
        psa.player_id as playerId,
        pi.player_name as playerName,
        psa.season,
        pi.position,
        pi.team_name as teamName,
        psa.points_per_game as points,
        psa.rebounds_per_game as rebounds,
        psa.assists_per_game as assists,
        psa.steals_per_game as steals,
        psa.blocks_per_game as blocks,
        psa.three_pointers_per_game as three_pointers,
        psa.field_goal_percentage,
        psa.free_throw_percentage,
        psa.turnovers_per_game as turnovers,
        psa.points_z,
        psa.rebounds_z,
        psa.assists_z,
        psa.steals_z,
        psa.blocks_z,
        psa.three_pointers_z,
        psa.fg_percentage_z as field_goal_percentage_z,
        psa.ft_percentage_z as free_throw_percentage_z,
        psa.turnovers_z,
        psa.total_value
      FROM player_season_averages psa
      JOIN player_general_info pi ON psa.player_id = pi.player_id
      WHERE ${allPlayerConditions.join(' OR ')}
    `;
    
    const results = await executeQuery(query, allParams);
    
    const playerStats = results.map(row => ({
      playerId: row.playerId,
      playerName: row.playerName,
      season: row.season,
      position: row.position,
      teamName: row.teamName,
      stats: {
        points: row.points,
        rebounds: row.rebounds,
        assists: row.assists,
        steals: row.steals,
        blocks: row.blocks,
        three_pointers: row.three_pointers,
        field_goal_percentage: row.field_goal_percentage,
        free_throw_percentage: row.free_throw_percentage,
        turnovers: row.turnovers,
        points_z: row.points_z,
        rebounds_z: row.rebounds_z,
        assists_z: row.assists_z,
        steals_z: row.steals_z,
        blocks_z: row.blocks_z,
        three_pointers_z: row.three_pointers_z,
        field_goal_percentage_z: row.field_goal_percentage_z,
        free_throw_percentage_z: row.free_throw_percentage_z,
        turnovers_z: row.turnovers_z,
        total_value: row.total_value
      }
    }));
    
    const calculateTeamStats = (teamPlayers, statsResults) => {
      const teamStats = statsResults.filter(stat => 
        teamPlayers.some(p => p.id === stat.playerId && p.season === stat.season)
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
        teamPlayers.some(p => p.id === stat.playerId && p.season === stat.season)
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
        teamPlayers.some(p => p.id === stat.playerId && p.season === stat.season)
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
    
    return [
      ...playerStats,
      { teamAverages }
    ];
  } catch (error) {
    console.error('Error fetching all time player stats:', error);
    throw error;
  }
};
