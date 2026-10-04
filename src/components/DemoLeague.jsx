import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { AuthContext, useAuth } from '../contexts/AuthContext';
import { LeagueProvider } from '../contexts/LeagueContext';
import YahooConnect from './YahooConnect';
import { YAHOO_ENABLED } from '../config/yahoo';
import { DEMO_TEAMS, DEMO_LEAGUE_SETTINGS } from '../fixtures/demoLeague';

const ACCENT = '#4a90e2';

// Shows a league tool running on a fixed demo league instead of hiding it
// behind the connect gate. Visitors who have not connected Yahoo can see what a
// tool actually does before being asked for an OAuth grant — the gate used to
// replace the whole tool body with a 440px box, which asked for the connection
// while showing nothing to justify it.
//
// The tools inside are rendered COMPLETELY UNCHANGED. Two things make that work:
//
//   1. LeagueProvider is the app's real league context, so passing it the
//      fixture is indistinguishable from a Yahoo-loaded league.
//   2. The tools also check isAuthenticated before computing — several times
//      each — so a league alone is not enough. Rather than thread a demo flag
//      through every one of those checks, this re-publishes the auth context
//      for THIS SUBTREE ONLY with isAuthenticated forced true.
//
// That override is safe here specifically because these three tools make no
// Yahoo API calls at all — they use isAuthenticated purely as a "do I have a
// league to compute on" switch. Any tool that actually talks to
// yahoo-fantasy-api (MatchupProjection, UltimateWinner) must NOT be wrapped in
// this: it would fire a request with no token. Check before adding one.
const DemoLeague = ({ toolName, children }) => {
  const auth = useAuth();
  const [leagueTeams, setLeagueTeams] = useState(DEMO_TEAMS);
  const [currentMatchup, setCurrentMatchup] = useState(null);

  const demoAuth = useMemo(() => ({ ...auth, isAuthenticated: true }), [auth]);

  return (
    <AuthContext.Provider value={demoAuth}>
      <LeagueProvider
        selectedLeague="demo"
        onLeagueChange={() => {}}
        userLeagues={[]}
        leagueTeams={leagueTeams}
        setLeagueTeams={setLeagueTeams}
        userTeamPlayers={DEMO_TEAMS[0].players}
        currentMatchup={currentMatchup}
        setCurrentMatchup={setCurrentMatchup}
        leagueSettings={DEMO_LEAGUE_SETTINGS}
        isLoadingLeagueData={false}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
            maxWidth: 1100,
            mx: 'auto',
            mb: 2,
            px: 1.75,
            py: 1,
            borderRadius: 2,
            bgcolor: '#fff',
            border: `1px solid ${ACCENT}`,
          }}
        >
          <Typography variant="body2" sx={{ flex: 1, minWidth: 180, color: 'text.secondary' }}>
            <Box component="span" sx={{ fontWeight: 700, color: ACCENT }}>Demo league.</Box>{' '}
            Real players and live stats, sample rosters.{' '}
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {YAHOO_ENABLED
                ? `Connect your Yahoo league to run ${toolName || 'this tool'} on your own team.`
                : `Running ${toolName || 'this tool'} on your own Yahoo team will be back once Yahoo league sync returns.`}
            </Box>
          </Typography>
          <YahooConnect variant="button" label="Use my league" />
        </Box>

        {children}
      </LeagueProvider>
    </AuthContext.Provider>
  );
};

export default DemoLeague;
