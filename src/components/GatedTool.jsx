import React, { useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useEntitlements } from '../hooks/useEntitlements';
import { useToolUsage, FREE_USES_PER_WEEK } from '../hooks/useToolUsage';
import YahooConnect from './YahooConnect';
import PremiumGate from './PremiumGate';
import UsageNudge from './UsageNudge';

// Wraps a premium tool page with all three access gates, in order:
//   1. Yahoo connection required (unchanged "gate" pattern)
//   2. Season Pass holders get unlimited access
//   3. Everyone else gets FREE_USES_PER_WEEK free visits (shared across all
//      gated tools), shown via a nudge banner, then hits PremiumGate.
const GatedTool = ({ toolId, toolName, children }) => {
  const { isAuthenticated } = useAuth();
  const { hasPass } = useEntitlements();
  const { hasQuota, remainingUses, loading: usageLoading, recordUse } = useToolUsage();
  const isPremium = hasPass('season');
  const recordedForRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || isPremium || usageLoading || !hasQuota) return;
    if (recordedForRef.current === toolId) return;
    recordedForRef.current = toolId;
    recordUse(toolId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isPremium, usageLoading, hasQuota, toolId]);

  if (!isAuthenticated) {
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
      {!isPremium && <UsageNudge remaining={remainingUses} freeLimit={FREE_USES_PER_WEEK} />}
      {children}
    </>
  );
};

export default GatedTool;
