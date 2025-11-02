import React, { useState, useEffect, useMemo } from 'react';
import { Box, Container, Typography, Tabs, Tab, CircularProgress, Link, IconButton, Menu, MenuItem, Avatar, FormControl, InputLabel, Select } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import Alltime from '../Pages/Alltime';
import AlltimeTable from '../Pages/AlltimeTable';
import AlltimeGames from '../Pages/AlltimeGames';
import Matchup from '../Pages/Matchup';
import Rankings from '../Pages/Rankings';
import About from '../Pages/About';
import UserProfile from '../Pages/UserProfile';
import { useAuth } from '../contexts/AuthContext';
import { LeagueProvider } from '../contexts/LeagueContext';
import { supabase } from '../utils/supabase';

const AlltimeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu
  const [profileAnchorEl, setProfileAnchorEl] = useState(null); // For profile menu
  const [userProfile, setUserProfile] = useState(null);
  const [userLeagues, setUserLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [leagueTeams, setLeagueTeams] = useState([]);
  
  // Fetch user profile to override OAuth data if it exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.userId) {
        setUserProfile(null);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('name, email, profile_picture')
          .eq('user_id', user.userId)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
          return;
        }
        
        if (data) {
          setUserProfile(data);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    
    fetchUserProfile();
  }, [user?.userId]);
  
  // Use profile data if available, otherwise fall back to OAuth data
  const displayName = userProfile?.name || user?.name || 'User';
  const displayEmail = userProfile?.email || user?.email || '';
  const displayPicture = userProfile?.profile_picture || user?.profilePicture;

  // Fetch user leagues if authenticated
  useEffect(() => {
    const fetchUserLeagues = async () => {
      if (!user?.userId) {
        setUserLeagues([]);
        return;
      }
      
      try {
        const { data, error } = await supabase.functions.invoke("yahoo-fantasy-api", {
          body: {
            action: "getUserLeagues",
            userId: user.userId,
          },
        });

        if (error) throw error;
        
        if (data?.leagues && data.leagues.length > 0) {
          setUserLeagues(data.leagues);
          if (!selectedLeague) {
            setSelectedLeague(data.leagues[0].leagueId);
          }
        }
      } catch (err) {
        console.error('Error fetching user leagues:', err);
      }
    };
    
    if (isAuthenticated) {
      fetchUserLeagues();
    }
  }, [user?.userId, isAuthenticated, selectedLeague]);

  // Fetch league teams when league is selected
  useEffect(() => {
    const fetchLeagueTeams = async () => {
      if (!selectedLeague || !user?.userId || !isAuthenticated) {
        setLeagueTeams([]);
        return;
      }
      
      try {
        const { data, error } = await supabase.functions.invoke("yahoo-fantasy-api", {
          body: {
            action: "getAllTeamsInLeague",
            userId: user.userId,
            leagueId: selectedLeague,
          },
        });

        if (error) throw error;
        
        if (data?.teams && data.teams.length > 0) {
          setLeagueTeams(data.teams);
        } else {
          setLeagueTeams([]);
        }
      } catch (err) {
        console.error('Error fetching league teams:', err);
        setLeagueTeams([]);
      }
    };
    
    fetchLeagueTeams();
  }, [selectedLeague, user?.userId, isAuthenticated]);

  // Calculate user team players from league teams
  const userTeamPlayers = useMemo(() => {
    if (!leagueTeams || leagueTeams.length === 0) return [];
    
    const userTeam = leagueTeams.find(team => team.is_owned_by_current_login === true);
    if (!userTeam || !userTeam.players) return [];
    
    return userTeam.players.map(p => ({
      nbaPlayerId: p.nbaPlayerId,
      yahooPlayerId: p.yahooPlayerId,
      name: p.name,
    }));
  }, [leagueTeams]);

  useEffect(() => {
    if (location.pathname === '/seasons' || location.pathname === '/table') {
      setTabValue(1);
    } else if (location.pathname === '/games') {
      setTabValue(2);
    } else if (location.pathname === '/matchup' || location.pathname === '/league' || location.pathname === '/rankings') {
      setTabValue(0); // No tab selected for these pages
    } else if (location.pathname === '/teams' || location.pathname === '/charts') {
      setTabValue(0);
    } else {
      setTabValue(1);
    }
  }, [location.pathname]);

  // Reset loading state when location changes
  useEffect(() => {
    setIsPageLoading(false);
  }, [location.pathname]);

  const handleTabChange = (_, newValue) => {
    setIsPageLoading(true);
    setTabValue(newValue);

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
    }, 300);
  };

  // Handle dropdown menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuSelect = (path) => {
    setIsPageLoading(true);
    setTabValue(path === '/matchup' ? 0 : 1); // Set to 0 for Matchup, 1 for Seasons (History)
    navigate(path);
    setTimeout(() => {
      setIsPageLoading(false);
    }, 300);
    handleMenuClose();
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/matchup');
  };

  const renderContent = () => {
    switch (location.pathname) {
      case '/seasons':
      case '/table':
        return <AlltimeTable />;
      case '/games':
        return <AlltimeGames />;
      case '/matchup':
        return <Matchup />;
      case '/rankings':
        return <Rankings />;
      case '/about':
        return <About />;
      case '/profile':
        return <UserProfile />;
      default:
        return <Alltime />;
    }
  };

  const isSpecialPage = location.pathname === '/matchup' || 
                       location.pathname === '/league' || 
                       location.pathname === '/rankings' || 
                       location.pathname === '/about' || 
                       location.pathname === '/profile';

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
          <IconButton
            onClick={handleMenuOpen}
            sx={{ p: 0 }}
            aria-label="Open navigation menu"
          >
            <img
              src="https://www.svgrepo.com/show/396571/goat.svg"
              alt="GOAT"
              style={{
                width: '40px',
                height: '40px',
                filter: 'invert(1)',
              }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
              },
            }}
          >
            <MenuItem
              onClick={() => handleMenuSelect('/matchup')}
              selected={location.pathname === '/matchup'}
            >
              Matchups
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuSelect('/rankings')}
              selected={location.pathname === '/rankings'}
            >
              Rankings
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuSelect('/seasons')}
              selected={location.pathname === '/seasons' || location.pathname === '/table'}
            >
              History
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuSelect('/about')}
              selected={location.pathname === '/about'}
            >
              About
            </MenuItem>
          </Menu>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated && userLeagues.length > 0 && (
            <FormControl
              size="small"
              sx={{
                minWidth: 120,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#1e1e1e",
                  color: "#e0e0e0",
                  fontFamily: '"Roboto Mono", monospace',
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4a90e2",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#80deea",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#80deea",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#b0bec5",
                  fontFamily: '"Roboto Mono", monospace',
                  fontSize: "0.75rem",
                  "&.Mui-focused": {
                    color: "#4a90e2",
                  },
                },
                "& .MuiSelect-icon": {
                  color: "#4a90e2",
                },
              }}
            >
              <InputLabel>League</InputLabel>
              <Select
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                label="League"
              >
                {userLeagues.map((league) => (
                  <MenuItem
                    key={league.leagueId}
                    value={league.leagueId}
                    sx={{
                      fontFamily: '"Roboto Mono", monospace',
                      fontSize: '0.875rem',
                      bgcolor: '#1e1e1e',
                      color: '#e0e0e0',
                      '&:hover': {
                        bgcolor: 'rgba(74, 144, 226, 0.1)',
                      },
                    }}
                  >
                    {league.name} {league.season ? `(${league.season})` : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {!isSpecialPage && (
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                minWidth: 'fit-content',
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
          )}
          {isAuthenticated && user && (
            <>
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ p: 0 }}
                aria-label="User profile menu"
              >
                <Avatar
                  src={displayPicture && displayPicture.toLowerCase().includes('default') 
                    ? 'https://www.svgrepo.com/show/513271/basketball.svg'
                    : displayPicture}
                  alt={displayName}
                  sx={{
                    width: 40,
                    height: 40,
                    border: '2px solid #4a90e2',
                    cursor: 'pointer',
                  }}
                >
                  {!displayPicture && displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: '#1e1e1e',
                    color: '#e0e0e0',
                    mt: 1,
                  },
                }}
              >
                <MenuItem disabled sx={{ opacity: 1, '&.Mui-disabled': { opacity: 1 } }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {displayName}
                    </Typography>
                    {displayEmail && (
                      <Typography variant="caption" sx={{ color: '#b0bec5' }}>
                        {displayEmail}
                      </Typography>
                    )}
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1, fontSize: '1.2rem' }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
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
          <LeagueProvider
            selectedLeague={selectedLeague}
            onLeagueChange={setSelectedLeague}
            userLeagues={userLeagues}
            leagueTeams={leagueTeams}
            userTeamPlayers={userTeamPlayers}
            setLeagueTeams={setLeagueTeams}
          >
            {renderContent()}
          </LeagueProvider>
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