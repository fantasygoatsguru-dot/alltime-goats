import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { YAHOO_ENABLED } from '../config/yahoo';

// Shared Yahoo "connect your league" action. Yahoo is a per-tool data-source
// integration (not the app login), so this is invoked contextually from the
// tools that need league data and from the profile menu — never the header.
export const useYahooConnect = () => {
  const location = useLocation();
  const [connecting, setConnecting] = useState(false);

  const connect = async () => {
    if (!YAHOO_ENABLED) return;
    setConnecting(true);
    try {
      // Remember where to come back to after the Yahoo round-trip.
      sessionStorage.setItem('oauth_return_path', location.pathname);
      const isDev = window.location.hostname === 'localhost';
      const { data } = await supabase.functions.invoke('yahoo-oauth', {
        body: { action: 'authorize', isDev },
      });
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setConnecting(false);
      }
    } catch (e) {
      console.error('Yahoo connect failed:', e);
      setConnecting(false);
    }
  };

  return { connect, connecting };
};
