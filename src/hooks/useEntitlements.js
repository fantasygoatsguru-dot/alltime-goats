import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { PASS_SEASON } from '../config/passes';

// Reads the signed-in user's purchased passes for the current pass season.
// A 'combo' row satisfies checks for both 'draft' and 'season'.
export const useEntitlements = () => {
  const { authUser } = useAuth();
  const [passTypes, setPassTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!authUser) {
      setPassTypes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .from('entitlements')
      .select('pass_type')
      .eq('auth_user_id', authUser.id)
      .eq('season', PASS_SEASON)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('Error fetching entitlements:', error);
          setPassTypes([]);
        } else {
          setPassTypes((data || []).map((row) => row.pass_type));
        }
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [authUser?.id]);

  const hasPass = (type) => passTypes.includes(type) || passTypes.includes('combo');

  // True if the user holds ANY pass for the season. Used for perks that come
  // with paying at all rather than with a specific pass — ad-free browsing.
  const hasAnyPass = passTypes.length > 0;

  return { hasPass, hasAnyPass, loading };
};
