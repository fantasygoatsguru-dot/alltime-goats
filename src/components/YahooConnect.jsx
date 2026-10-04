import React from 'react';
import { Box, Button, Typography, CircularProgress, Tooltip } from '@mui/material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import { useYahooConnect } from '../hooks/useYahooConnect';
import { YAHOO_ENABLED, YAHOO_PAUSED_NOTICE } from '../config/yahoo';

const ACCENT = '#4a90e2';

// Single, subtle, consistent Yahoo connect prompt used everywhere.
//   variant="button" → just the outlined button, dropped inline into an
//                      existing controls row of an open tool (rankings, top
//                      games, schedule grids…). The lightest treatment.
//   variant="nudge"  → slim standalone bar above a tool that works without Yahoo.
//   variant="gate"   → understated empty-state for tools that REQUIRE Yahoo.
// All share the same palette, icon and outlined button so the app reads as one.
// Shown in place of every connect prompt while YAHOO_ENABLED is false. Same
// three footprints as the prompt it replaces, so no layout shifts.
const YahooPausedNotice = ({ variant }) => {
  const icon = <SportsBasketballIcon sx={{ color: 'rgba(74,144,226,0.55)', fontSize: variant === 'gate' ? 38 : 20 }} />;

  if (variant === 'button') {
    return (
      <Tooltip title={`${YAHOO_PAUSED_NOTICE.title}. ${YAHOO_PAUSED_NOTICE.body}`} arrow>
        <Box tabIndex={0} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, color: 'text.secondary', cursor: 'help' }}>
          {icon}
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Yahoo sync paused</Typography>
        </Box>
      </Tooltip>
    );
  }

  if (variant === 'gate') {
    return (
      <Box
        sx={{
          maxWidth: 460, mx: 'auto', my: { xs: 5, sm: 8 }, px: 3, py: 4,
          textAlign: 'center', borderRadius: 2, bgcolor: '#fff', border: '1px solid #e6e6e6',
        }}
      >
        <Box sx={{ mb: 1 }}>{icon}</Box>
        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 0.5, color: 'text.primary' }}>
          {YAHOO_PAUSED_NOTICE.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">{YAHOO_PAUSED_NOTICE.body}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5, maxWidth: 1100, mx: 'auto', mb: 2,
        px: 1.75, py: 1, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e6e6e6',
      }}
    >
      {icon}
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{YAHOO_PAUSED_NOTICE.title}.</Box>{' '}
        {YAHOO_PAUSED_NOTICE.body}
      </Typography>
    </Box>
  );
};

const YahooConnect = (props) =>
  YAHOO_ENABLED ? <YahooConnectPrompt {...props} /> : <YahooPausedNotice variant={props.variant || 'gate'} />;

const YahooConnectPrompt = ({ variant = 'gate', toolName, heading: headingProp, description, label }) => {
  const { connect, connecting } = useYahooConnect();
  const isGate = variant === 'gate';

  const heading = headingProp || (isGate
    ? `Connect your Yahoo league to use ${toolName || 'this tool'}`
    : 'Connect your Yahoo league');

  const body = description || (isGate
    ? 'This tool reads your live league, roster and matchups from Yahoo Fantasy.'
    : 'Auto-load your roster. Optional — everything here works without connecting.');

  const buttonLabel = connecting ? 'Connecting…' : (label || 'Connect Yahoo');

  // Matches the inline connect button on the schedule pages (NBAPlayoffs).
  const button = (
    <Button
      variant="outlined"
      onClick={connect}
      disabled={connecting}
      startIcon={connecting
        ? <CircularProgress size={16} color="inherit" />
        : <SportsBasketballIcon />}
      sx={{
        color: ACCENT,
        borderColor: ACCENT,
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        whiteSpace: 'nowrap',
        px: { xs: 2.5, sm: 3 },
        py: 1,
        '&:hover': { borderColor: '#80deea', bgcolor: 'rgba(74,144,226,0.1)' },
      }}
    >
      {buttonLabel}
    </Button>
  );

  // Lightest treatment: just the button, sits inside an existing controls row.
  if (variant === 'button') {
    return button;
  }

  if (!isGate) {
    // Slim, quiet bar. Sits above a fully usable tool.
    return (
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
        <SportsBasketballIcon sx={{ color: 'rgba(74,144,226,0.7)', fontSize: 20 }} />
        <Typography variant="body2" sx={{ flex: 1, minWidth: 160, color: 'text.secondary' }}>
          <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{heading}.</Box>{' '}
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{body}</Box>
        </Typography>
        {button}
      </Box>
    );
  }

  // Quiet empty-state. Replaces the tool body when Yahoo is required.
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
      <SportsBasketballIcon sx={{ color: 'rgba(74,144,226,0.7)', fontSize: 38, mb: 1 }} />
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 0.5, color: 'text.primary' }}>
        {heading}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        {body}
      </Typography>
      {button}
    </Box>
  );
};

export default YahooConnect;
