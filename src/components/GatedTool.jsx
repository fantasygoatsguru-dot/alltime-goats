import React, { useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useLeague } from '../contexts/LeagueContext';
import { useEntitlements } from '../hooks/useEntitlements';
import { useToolUsage, FREE_USES_PER_WEEK } from '../hooks/useToolUsage';
import YahooConnect from './YahooConnect';
import PremiumGate from './PremiumGate';
import UsageNudge from './UsageNudge';
import DemoLeague from './DemoLeague';

// Tools that can run on the demo league when Yahoo is not connected, so the
// visitor sees the tool working instead of a bare connect box. Restricted to
// tools that read league state and make NO yahoo-fantasy-api calls of their
// own — see the note in DemoLeague.jsx. MatchupProjection and UltimateWinner
// call the edge function directly and would fire tokenless requests, so they
// keep the plain gate until their fetches are made injectable.
const DEMO_CAPABLE_TOOLS = new Set([
  'category-breakdown',
  'my-league-playoffs',
  'my-league-regular-season',
]);

// Wraps a premium tool page with all three access gates, in order:
//   1. Yahoo connection required (unchanged "gate" pattern)
//   2. Season Pass holders get unlimited access
//   3. Everyone else gets FREE_USES_PER_WEEK free visits (shared across all
//      gated tools), shown via a nudge banner, then hits PremiumGate.
const GatedTool = ({ toolId, toolName, children }) => {
  const { isAuthenticated } = useAuth();
  const { leagueTeams, isLoadingLeagueData } = useLeague();
  const { hasPass } = useEntitlements();
  const { hasQuota, remainingUses, loading: usageLoading, recordUse } = useToolUsage();
  const isPremium = hasPass('season');
  const recordedForRef = useRef(null);

  // A free visit is only spent once the tool can actually show something. It
  // used to be charged on mount, so a user whose league data was still loading
  // — or who had no league at all — paid for a page that never rendered.
  const leagueReady = !isLoadingLeagueData && Array.isArray(leagueTeams) && leagueTeams.length > 0;

  useEffect(() => {
    if (!isAuthenticated || isPremium || usageLoading || !hasQuota) return;
    if (!leagueReady) return;
    if (recordedForRef.current === toolId) return;
    recordedForRef.current = toolId;
    recordUse(toolId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isPremium, usageLoading, hasQuota, leagueReady, toolId]);

  // No Yahoo: show the tool on the demo league where we safely can, otherwise
  // fall back to the connect gate. Either way the quota effect above has
  // already returned early, so browsing the demo never spends a free use.
  if (!isAuthenticated) {
    if (DEMO_CAPABLE_TOOLS.has(toolId)) {
      return <DemoLeague toolName={toolName}>{children}</DemoLeague>;
    }
    return <YahooConnect variant="gate" toolName={toolName} />;
  }

  if (!isPremium) {
    if (usageLoading) {
      return (
        <Box sx={{ p: 8, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      );
    }
    if (!hasQuota) {
      return <PremiumGate toolName={toolName} reason="quota" freeLimit={FREE_USES_PER_WEEK} />;
    }
  }

  return (
    <>
      {/* Only nudge once the quota is actually running down. Leading with
          "5 of 5 free visits left" asks for money before showing any value. */}
      {!isPremium && leagueReady && remainingUses < FREE_USES_PER_WEEK && (
        <UsageNudge remaining={remainingUses} freeLimit={FREE_USES_PER_WEEK} />
      )}
      {children}
    </>
  );
};

export default GatedTool;
