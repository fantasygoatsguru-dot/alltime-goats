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
}) => {
    return (
        <LeagueContext.Provider value={{ 
            selectedLeague, 
            onLeagueChange, 
            userLeagues,
            leagueTeams,
            userTeamPlayers,
            setLeagueTeams,
        }}>
            {children}
        </LeagueContext.Provider>
    );
};

