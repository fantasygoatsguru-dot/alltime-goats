import React, { createContext, useContext, useState } from 'react';

const LeagueContext = createContext();

export const useLeague = () => {
    const context = useContext(LeagueContext);
    if (!context) {
        return { selectedLeague: "", onLeagueChange: () => {}, userLeagues: [] };
    }
    return context;
};

export const LeagueProvider = ({ children, selectedLeague, onLeagueChange, userLeagues }) => {
    return (
        <LeagueContext.Provider value={{ selectedLeague, onLeagueChange, userLeagues }}>
            {children}
        </LeagueContext.Provider>
    );
};

