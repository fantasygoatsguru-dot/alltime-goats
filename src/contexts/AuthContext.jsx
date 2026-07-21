import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'yahoo_user_data';
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // Refresh 5 minutes before expiry

export const AuthProvider = ({ children }) => {
  // --- Yahoo layer (the "data source"): unchanged legacy identity ---
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef(null);
  const isRefreshingRef = useRef(false);

  // --- Supabase Auth layer (the "account"): who you are, owns entitlements ---
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setAuthUser(data?.session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + window.location.pathname },
    });
  };

  // Passwordless email magic link. Resolves once the email is sent; the session
  // arrives later when the user clicks the link and lands back on the site.
  const signInWithEmail = async (email) => {
    return supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname },
    });
  };

  const signOutAccount = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
  };

  const refreshToken = async (userData) => {
    if (isRefreshingRef.current) {
      console.log('Token refresh already in progress');
      return null;
    }

    try {
      isRefreshingRef.current = true;
      console.log('Refreshing Yahoo token...');
      
      const isDev = window.location.hostname === 'localhost';
      const { data, error } = await supabase.functions.invoke('yahoo-oauth', {
        body: { 
          action: 'refresh', 
          userId: userData.userId,
          isDev 
        }
      });

      if (error || !data?.success) {
        throw new Error('Token refresh failed');
      }

      const updatedUserData = {
        ...userData,
        expiresAt: data.expiresAt,
      };

      setUser(updatedUserData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUserData));
      
      scheduleTokenRefresh(updatedUserData);
      console.log('Token refreshed successfully');
      
      return updatedUserData;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return null;
    } finally {
      isRefreshingRef.current = false;
    }
  };

  const scheduleTokenRefresh = (userData) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const expiresAt = new Date(userData.expiresAt);
    const now = new Date();
    const timeUntilRefresh = expiresAt.getTime() - now.getTime() - TOKEN_REFRESH_BUFFER;

    if (timeUntilRefresh > 0) {
      console.log(`Token refresh scheduled in ${Math.round(timeUntilRefresh / 1000 / 60)} minutes`);
      refreshTimerRef.current = setTimeout(() => {
        refreshToken(userData);
      }, timeUntilRefresh);
    } else {
      console.log('Token needs immediate refresh');
      refreshToken(userData);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const expiresAt = new Date(userData.expiresAt);
          const now = new Date();
          
          if (expiresAt > now) {
            setUser(userData);
            setIsAuthenticated(true);
            scheduleTokenRefresh(userData);
          } else {
            console.log('Token expired, attempting refresh...');
            const refreshedUser = await refreshToken(userData);
            if (refreshedUser) {
              setIsAuthenticated(true);
            }
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
      setLoading(false);
    };

    initAuth();

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  const login = (userData) => {
    const userDataWithTimestamp = {
      ...userData,
      expiresAt: userData.expiresAt || new Date(Date.now() + 3600 * 1000).toISOString(),
    };
    
    setUser(userDataWithTimestamp);
    setIsAuthenticated(true);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userDataWithTimestamp));
    scheduleTokenRefresh(userDataWithTimestamp);
  };

  const logout = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const ensureValidToken = async () => {
    if (!user) return false;

    const expiresAt = new Date(user.expiresAt);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();

    if (timeUntilExpiry < TOKEN_REFRESH_BUFFER) {
      const refreshedUser = await refreshToken(user);
      return !!refreshedUser;
    }

    return true;
  };

  const value = {
    // Yahoo layer (data source) — unchanged
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    ensureValidToken,
    refreshToken: () => refreshToken(user),
    // Supabase Auth layer (account)
    authUser,
    authLoading,
    isSignedIn: !!authUser,
    signInWithGoogle,
    signInWithEmail,
    signOutAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

