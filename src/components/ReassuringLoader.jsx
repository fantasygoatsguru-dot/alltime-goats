import React, { useState, useEffect, useRef } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';

const REASSURING_MESSAGES = {
  page: {
    primary: 'Loading page...',
    secondary: 'Just a moment while we prepare everything for you',
  },
  leagues: {
    primary: 'Connecting to your leagues',
    secondary: 'Fetching your Yahoo Fantasy leagues and teams',
  },
  matchup: {
    primary: 'Loading matchup data',
    secondary: 'Gathering player stats and projections for your teams',
  },
  default: {
    primary: 'Loading...',
    secondary: 'Please wait while we fetch your data',
  },
};

const ReassuringLoader = ({ 
  type = 'default', 
  customMessage = null, 
  customSubtext = null,
  minHeight = '70vh' 
}) => {
  const getInitialPrimary = () => {
    return customMessage 
      ? customMessage
      : (REASSURING_MESSAGES[type] || REASSURING_MESSAGES.default).primary;
  };
  
  const getInitialSecondary = () => {
    return customSubtext 
      ? customSubtext
      : (REASSURING_MESSAGES[type] || REASSURING_MESSAGES.default).secondary;
  };
  
  const [primaryText, setPrimaryText] = useState(getInitialPrimary);
  const [secondaryText, setSecondaryText] = useState(getInitialSecondary);
  const [secondaryOpacity, setSecondaryOpacity] = useState(1);
  const isMountedRef = useRef(true);
  const previousSecondaryRef = useRef(getInitialSecondary());
  const timersRef = useRef({ fadeOut: null, fadeIn: null });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const newPrimary = customMessage 
      ? customMessage
      : (REASSURING_MESSAGES[type] || REASSURING_MESSAGES.default).primary;
    
    const newSecondary = customSubtext 
      ? customSubtext
      : (REASSURING_MESSAGES[type] || REASSURING_MESSAGES.default).secondary;
    
    // Update primary text immediately (no animation needed)
    if (newPrimary !== primaryText) {
      setPrimaryText(newPrimary);
    }
    
    // Only animate secondary text changes if it actually changed
    if (newSecondary !== previousSecondaryRef.current) {
      // Clear any existing timers
      const existingFadeOut = timersRef.current.fadeOut;
      const existingFadeIn = timersRef.current.fadeIn;
      
      if (existingFadeOut) {
        clearTimeout(existingFadeOut);
      }
      if (existingFadeIn) {
        clearTimeout(existingFadeIn);
      }
      
      // Fade out current text
      setSecondaryOpacity(0);
      
      // After fade out, update text and fade in
      const fadeOutTimer = setTimeout(() => {
        if (isMountedRef.current) {
          setSecondaryText(newSecondary);
          previousSecondaryRef.current = newSecondary;
          // Small delay before fade in for smoother transition
          const fadeInTimer = setTimeout(() => {
            if (isMountedRef.current) {
              setSecondaryOpacity(1);
            }
          }, 50);
          timersRef.current.fadeIn = fadeInTimer;
        }
      }, 200);
      
      timersRef.current.fadeOut = fadeOutTimer;
      
      return () => {
        clearTimeout(fadeOutTimer);
        // If fadeOut is cleared, fadeIn won't be set, so we only need to check
        // the ref if cleanup runs after fadeOut completes (rare edge case)
        // Using ref here is safe since we're storing timer IDs, not React nodes
        const currentTimers = timersRef.current;
        if (currentTimers.fadeIn) {
          clearTimeout(currentTimers.fadeIn);
        }
      };
    }
  }, [type, customMessage, customSubtext, primaryText]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: minHeight,
        background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
        padding: 4,
        gap: 3,
      }}
    >
      {/* Animated Basketball Icon - Never unmounts */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          size={80}
          thickness={4}
          sx={{
            color: '#4a90e2',
            position: 'absolute',
          }}
        />
        <Box
          sx={{
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                transform: 'scale(1)',
                opacity: 1,
              },
              '50%': {
                transform: 'scale(1.1)',
                opacity: 0.8,
              },
            },
          }}
        >
          <SportsBasketballIcon
            sx={{
              fontSize: 40,
              color: '#4a90e2',
            }}
          />
        </Box>
      </Box>

      {/* Messages - Primary text updates immediately, secondary fades */}
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minHeight: 80,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#212121',
            fontFamily: '"Roboto Mono", monospace',
          }}
        >
          {primaryText}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#757575',
            fontFamily: '"Roboto Mono", monospace',
            lineHeight: 1.6,
            opacity: secondaryOpacity,
            transition: 'opacity 0.2s ease-in-out',
            minHeight: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {secondaryText}
        </Typography>
      </Box>

      {/* Reassuring dots animation - Never unmounts */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          mt: 1,
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#4a90e2',
              animation: 'bounce 1.4s ease-in-out infinite',
              animationDelay: `${index * 0.2}s`,
              '@keyframes bounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0)',
                  opacity: 0.5,
                },
                '40%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ReassuringLoader;

