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
            isLoadingLeagueData: false,
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
    isLoadingLeagueData = false,
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
            isLoadingLeagueData,
        }}>
            {children}
        </LeagueContext.Provider>
    );
};

