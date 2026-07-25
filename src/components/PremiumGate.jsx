import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ACCENT = '#4a90e2';

// Empty-state gate for tools that require a paid pass. Mirrors YahooConnect's
// "gate" variant styling so the app reads as one system, but sends the user
// to /pricing instead of the Yahoo OAuth flow.
//   reason="pass"  → default. No free-use quota system applies to this view.
//   reason="quota" → shown after the weekly free-use allowance is exhausted.
const PremiumGate = ({ toolName, reason = 'pass', freeLimit }) => {
  const navigate = useNavigate();
  const isQuota = reason === 'quota';

  return (
    <Box
      sx={{
        maxWidth: 440,
        mx: 'auto',
        my: { xs: 5, sm: 8 },
        px: 3,
        py: 4,
        textAlign: 'center',
        borderRadius: 2,
        bgcolor: '#fff',
        border: '1px solid #e6e6e6',
      }}
    >
      <ConfirmationNumberOutlined sx={{ color: 'rgba(74,144,226,0.7)', fontSize: 38, mb: 1 }} />
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 0.5, color: 'text.primary' }}>
        {isQuota
          ? `You've used your ${freeLimit ?? 5} free visits this week`
          : `Get a Season Pass to use ${toolName || 'this tool'}`}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        {isQuota
          ? `Your free look at ${toolName || 'this tool'} and the other premium tools resets Monday. Get a Season Pass for unlimited access the rest of the week.`
          : 'Season Pass unlocks weekly matchup projections, head-to-head breakdowns, category analysis, and team strength tools for the rest of the season.'}
      </Typography>
      <Button
        variant="outlined"
        onClick={() => navigate('/pricing')}
        startIcon={<ConfirmationNumberOutlined />}
        sx={{
          color: ACCENT,
          borderColor: ACCENT,
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
          px: { xs: 2.5, sm: 3 },
          py: 1,
          '&:hover': { borderColor: '#80deea', bgcolor: 'rgba(74,144,226,0.1)' },
        }}
      >
        See passes
      </Button>
    </Box>
  );
};

export default PremiumGate;
