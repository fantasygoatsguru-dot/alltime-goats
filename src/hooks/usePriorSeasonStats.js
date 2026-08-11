import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { PRIOR_SEASON } from '../config/top-150-2026-27';

// The guide projections are authored by hand, so accents and punctuation have
// to be normalised away before names can be matched against the database.
export const normName = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const COLUMNS =
  'player_name, team_abbreviation, games_played, points_per_game, three_pointers_per_game, rebounds_per_game, assists_per_game, steals_per_game, blocks_per_game, turnovers_per_game, field_goal_percentage, free_throw_percentage, total_value';

/**
 * Loads a season's per-game lines keyed by normalised player name, so an
 * authored projection can show the real production it is arguing with.
 *
 * Returns { statsFor, loading }. A miss from `statsFor` is meaningful rather
 * than an error: it means the player did not appear that season.
 */
export function usePriorSeasonStats(season = PRIOR_SEASON) {
  const [byName, setByName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('player_period_averages')
          .select(COLUMNS)
          .eq('season', season)
          .eq('period_type', 'season');
        if (error) throw error;
        if (active) setByName(new Map((data || []).map((r) => [normName(r.player_name), r])));
      } catch (e) {
        console.error('usePriorSeasonStats fetch failed:', e);
        // The write-ups still read fine without last season's numbers.
        if (active) setByName(new Map());
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [season]);

  return { statsFor: (name) => byName?.get(normName(name)), loading };
}
