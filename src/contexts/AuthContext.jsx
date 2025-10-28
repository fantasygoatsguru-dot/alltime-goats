import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'yahoo_user_data';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const expiresAt = new Date(userData.expiresAt);
        
        if (expiresAt > new Date()) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userDataWithTimestamp = {
      ...userData,
      expiresAt: userData.expiresAt || new Date(Date.now() + 3600 * 1000).toISOString(),
    };
    
    setUser(userDataWithTimestamp);
    setIsAuthenticated(true);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userDataWithTimestamp));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
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

