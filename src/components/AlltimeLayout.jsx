import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Tabs, Tab, CircularProgress, Link } from '@mui/material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import Alltime from '../Pages/Alltime';
import AlltimeTable from '../Pages/AlltimeTable';
import AlltimeGames from '../Pages/AlltimeGames';
import EzoicAd from './EzoicAd';

const AlltimeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    if (location.pathname === '/seasons' || location.pathname === '/table') {
      setTabValue(1);
    } else if (location.pathname === '/games') {
      setTabValue(2);
    } else if (location.pathname === '/teams' || location.pathname === '/charts') {
      setTabValue(0);
    } else {
      setTabValue(1);
    }
  }, [location.pathname]);

  // Reset loading state when location changes (direct navigation)
  useEffect(() => {
    setIsPageLoading(false);
  }, [location.pathname]);

  const handleTabChange = (_, newValue) => {
    setIsPageLoading(true);
    setTabValue(newValue);

    // Simulate loading time for better UX
    setTimeout(() => {
      switch (newValue) {
        case 0:
          navigate('/teams');
          break;
        case 1:
          navigate('/seasons');
          break;
        case 2:
          navigate('/games');
          break;
        default:
          navigate('/teams');
      }
      setIsPageLoading(false);
    }, 300); // 300ms delay for smooth transition
  };

  const renderContent = () => {
    switch (tabValue) {
      case 1:
        return <AlltimeTable />;
      case 2:
        return <AlltimeGames />;
      default:
        return <Alltime />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
        color: '#e0e0e0',
        '@media (maxWidth: 600px)': {
          padding: '8px',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img
            src="https://www.svgrepo.com/show/396571/goat.svg"
            alt="GOAT"
            style={{
              width: '40px',
              height: '40px',
              filter: 'invert(1)',
            }}
          />
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.5rem' },
              fontWeight: 600,
              color: '#e0e0e0',
            }}
          >
            Fantasy Goats Guru
          </Typography>
        </Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="primary"
          sx={{
            minWidth: 'fit-content',
            marginLeft: 'auto',
            '& .MuiTab-root': {
              minWidth: { xs: 40, sm: 100 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '6px 8px', sm: '12px 16px' },
              color: '#e0e0e0',
              '&.Mui-selected': {
                color: '#4a90e2',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4a90e2',
            },
          }}
        >
          <Tab label="Teams" />
          <Tab label="Seasons" />
          <Tab label="Games" />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Container maxWidth={false} disableGutters>
        {isPageLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              backgroundColor: '#121212',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress
                size={60}
                sx={{
                  color: '#4a90e2',
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: '#e0e0e0',
                  fontFamily: '"Roboto Mono", monospace',
                }}
              >
                Loading...
              </Typography>
            </Box>
          </Box>
        ) : (
          renderContent()
        )}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 'auto',
          py: 2,
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#1e1e1e',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &copy; {new Date().getFullYear()} Fantasy Goats Guru. All rights reserved.
          {' | '}
          <Link
            component={RouterLink}
            to="/privacy-policy"
            sx={{ color: 'primary.main', textDecoration: 'underline' }}
          >
            Privacy Policy
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default AlltimeLayout;