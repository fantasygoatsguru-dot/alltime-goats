import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Slim bar shown above a gated tool while the user is spending one of their
// free weekly visits. Mirrors YahooConnect's non-gate "nudge" variant.
const UsageNudge = ({ remaining, freeLimit }) => (
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
      border: '1px solid #e6e6e6',
    }}
  >
    <ConfirmationNumberOutlined sx={{ color: 'rgba(74,144,226,0.7)', fontSize: 20 }} />
    <Typography variant="body2" sx={{ flex: 1, minWidth: 160, color: 'text.secondary' }}>
      <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
        {remaining} of {freeLimit} free {remaining === 1 ? 'visit' : 'visits'} left this week.
      </Box>{' '}
      <MuiLink component={RouterLink} to="/pricing" sx={{ fontWeight: 600 }}>
        Get a Season Pass for unlimited access
      </MuiLink>
    </Typography>
  </Box>
);

export default UsageNudge;
