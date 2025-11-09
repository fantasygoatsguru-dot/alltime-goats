import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'yahoo_user_data';
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // Refresh 5 minutes before expiry

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef(null);
  const isRefreshingRef = useRef(false);

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
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    ensureValidToken,
    refreshToken: () => refreshToken(user),
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

