import React, { createContext, useContext } from 'react';

const LeagueContext = createContext();

export const useLeague = () => {
    const context = useContext(LeagueContext);
    if (!context) {
        return { 
            selectedLeague: "", 
            onLeagueChange: () => {}, 
            userLeagues: [],
            leagueTeams: [],
            userTeamPlayers: [],
            setLeagueTeams: () => {},
            currentMatchup: null,
            setCurrentMatchup: () => {},
            leagueSettings: null,
        };
    }
    return context;
};

export const LeagueProvider = ({ 
    children, 
    selectedLeague, 
    onLeagueChange, 
    userLeagues,
    leagueTeams = [],
    userTeamPlayers = [],
    setLeagueTeams = () => {},
    currentMatchup = null,
    setCurrentMatchup = () => {},
    leagueSettings = null,
}) => {
    return (
        <LeagueContext.Provider value={{ 
            selectedLeague, 
            onLeagueChange, 
            userLeagues,
            leagueTeams,
            userTeamPlayers,
            setLeagueTeams,
            currentMatchup,
            setCurrentMatchup,
            leagueSettings,
        }}>
            {children}
        </LeagueContext.Provider>
    );
};

