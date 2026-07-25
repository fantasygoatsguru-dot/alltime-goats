import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';

export const FREE_USES_PER_WEEK = 5;

// Monday 00:00 of the current calendar week, as a YYYY-MM-DD string. A
// generic trial cadence — deliberately not the NBA-schedule fantasy week
// used elsewhere in the app.
function startOfWeek() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday ... 6 = Saturday
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

// Free-usage quota shared across all premium-gated tools: FREE_USES_PER_WEEK
// distinct tool-days per calendar week before a pass is required. Repeat
// visits to the same tool on the same day only ever count once (enforced by
// a unique index in the tool_usage_events migration), so refreshing a page
// can't burn the quota.
export const useToolUsage = () => {
  const { authUser } = useAuth();
  const [usedThisWeek, setUsedThisWeek] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!authUser) {
      setUsedThisWeek(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('tool_usage_events')
      .select('id')
      .eq('auth_user_id', authUser.id)
      .gte('used_on', startOfWeek())
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching tool usage:', error);
          setUsedThisWeek(0);
        } else {
          setUsedThisWeek((data || []).length);
        }
        setLoading(false);
      });
  }, [authUser?.id]);

  useEffect(() => { refresh(); }, [refresh]);

  const recordUse = useCallback(async (toolId) => {
    if (!authUser) return;
    const { error } = await supabase
      .from('tool_usage_events')
      .insert({ auth_user_id: authUser.id, tool_id: toolId });
    if (!error) {
      setUsedThisWeek((prev) => prev + 1);
    } else if (error.code !== '23505') {
      // 23505 = unique violation = this tool was already used today, not a real error.
      console.error('Error recording tool usage:', error);
    }
  }, [authUser]);

  const remainingUses = Math.max(0, FREE_USES_PER_WEEK - usedThisWeek);

  return { hasQuota: remainingUses > 0, remainingUses, loading, recordUse };
};
