import { supabase } from './supabase';

export const callYahooApi = async (action, params, ensureValidToken) => {
  if (ensureValidToken) {
    const isValid = await ensureValidToken();
    if (!isValid) {
      throw new Error('Unable to refresh authentication. Please log in again.');
    }
  }

  const { data, error } = await supabase.functions.invoke('yahoo-fantasy-api', {
    body: { action, ...params }
  });

  if (error) {
    console.error('Yahoo API error:', error);
    throw error;
  }

  return data;
};

export const callYahooOAuth = async (action, params) => {
  const { data, error } = await supabase.functions.invoke('yahoo-oauth', {
    body: { action, ...params }
  });

  if (error) {
    console.error('Yahoo OAuth error:', error);
    throw error;
  }

  return data;
};

