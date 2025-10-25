import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, CircularProgress } from '@mui/material';
import { getDatabaseStatus, initDatabase } from '../utils/database';

const DatabaseLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const status = getDatabaseStatus();
        if (status.isLoaded) {
          setIsLoading(false);
          return;
        }

        // Start loading the database with progress callback
        await initDatabase((progressValue) => {
          setProgress(progressValue);
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Database loading error:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadDatabase();
  }, []);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
          color: '#e0e0e0',
          padding: 3,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: '#ff6f61' }}>
          Error Loading Database
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
          color: '#e0e0e0',
          padding: 3,
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <img
            src="https://www.svgrepo.com/show/396571/goat.svg"
            alt="GOAT"
            style={{
              width: '80px',
              height: '80px',
              filter: 'invert(1)',
              marginBottom: '20px',
            }}
          />
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            Fantasy Goats Guru
          </Typography>
          <Typography variant="body2" sx={{ color: '#b0bec5' }}>
            Loading NBA Historical Database...
          </Typography>
        </Box>

        <Box sx={{ width: '100%', maxWidth: 400, mb: 2 }}>
          <LinearProgress
            variant={progress > 0 ? 'determinate' : 'indeterminate'}
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#333333',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: '#4a90e2',
              },
            }}
          />
        </Box>

        {progress > 0 && (
          <Typography variant="body2" sx={{ color: '#b0bec5' }}>
            {Math.round(progress)}% - Please wait while we load 435MB of data...
          </Typography>
        )}

        {progress === 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} sx={{ color: '#4a90e2' }} />
            <Typography variant="body2" sx={{ color: '#b0bec5' }}>
              This may take a moment on first load...
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  return children;
};

export default DatabaseLoader;

