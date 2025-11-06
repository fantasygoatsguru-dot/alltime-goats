import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Link,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import Alltime from '../Pages/Alltime';
import AlltimeTable from '../Pages/AlltimeTable';
import AlltimeGames from '../Pages/AlltimeGames';
import Matchup from '../Pages/Matchup';
import Rankings from '../Pages/Rankings';
import FantasyChat from '../Pages/FantasyChat';
import LeaguePlayoffs from '../Pages/LeaguePlayoffs';
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

  // Track website visit when user is authenticated
  useEffect(() => {
    const trackVisit = async () => {
      if (!user?.userId || !isAuthenticated) return;

      try {
        // Check if user_usage record exists
        const { data: existingUsage, error: fetchError } = await supabase
          .from('user_usage')
          .select('website_visits_count, last_visit_at')
          .eq('user_id', user.userId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user usage:', fetchError);
          return;
        }

        const now = new Date();
        const lastVisit = existingUsage?.last_visit_at ? new Date(existingUsage.last_visit_at) : null;
        
        // Only count as a new visit if last visit was more than 30 minutes ago
        const shouldCountVisit = !lastVisit || (now.getTime() - lastVisit.getTime()) > 10 * 60 * 1000;

        if (!shouldCountVisit) return;

        if (existingUsage) {
          // Update existing record
          await supabase
            .from('user_usage')
            .update({
              website_visits_count: (existingUsage.website_visits_count || 0) + 1,
              last_visit_at: now.toISOString(),
            })
            .eq('user_id', user.userId);
        } else {
          // Insert new record
          await supabase
            .from('user_usage')
            .insert({
              user_id: user.userId,
              website_visits_count: 1,
              last_visit_at: now.toISOString(),
            });
        }
      } catch (err) {
        console.error('Error tracking visit:', err);
      }
    };

    trackVisit();
  }, [user?.userId, isAuthenticated]);

  // Fetch user leagues if authenticated
  useEffect(() => {
    const fetchUserLeagues = async () => {
      if (!user?.userId) {
        setUserLeagues([]);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('yahoo-fantasy-api', {
          body: {
            action: 'getUserLeagues',
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
        const { data, error } = await supabase.functions.invoke('yahoo-fantasy-api', {
          body: {
            action: 'getAllTeamsInLeague',
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

    const userTeam = leagueTeams.find((team) => team.is_owned_by_current_login === true);
    if (!userTeam || !userTeam.players) return [];

    return userTeam.players.map((p) => ({
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
    } else if (
      location.pathname === '/matchup' ||
      location.pathname === '/league' ||
      location.pathname === '/rankings'
    ) {
      setTabValue(0);
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

  const handleTabChange = (_any, newValue) => {
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
    setTabValue(path === '/matchup' ? 0 : 1);
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
      case '/':
        return <Matchup />;
      case '/seasons':
      case '/table':
        return <AlltimeTable />;
      case '/teams':
        return <Alltime />;
      case '/games':
        return <AlltimeGames />;
      case '/matchup':
        return <Matchup />;
      case '/rankings':
        return <Rankings />;
      case '/chat':
        return <FantasyChat />;
      case '/playoffs':
        return <LeaguePlayoffs />;
      case '/about':
        return <About />;
      case '/profile':
        return <UserProfile />;
      default:
        return <Matchup />;
    }
  };

  const isSpecialPage =
    location.pathname === '/matchup' ||
    location.pathname === '/' ||
    location.pathname === '/league' ||
    location.pathname === '/rankings' ||
    location.pathname === '/chat' ||
    location.pathname === '/playoffs' ||
    location.pathname === '/about' ||
    location.pathname === '/profile';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#EEEEEE',
        color: '#f5f5f5',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 1.5, sm: 3 },
          py: 1.5,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderBottom: '2px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
        }}
      >
        {/* LEFT: Logo + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexGrow: 1, minWidth: 0 }}>
          <IconButton
            onClick={handleMenuOpen}
            sx={{ p: 0, transition: 'transform 0.2s ease', '&:hover': { transform: 'scale(1.08)' }, flexShrink: 0 }}
          >
            <Avatar
              src="https://www.svgrepo.com/show/396571/goat.svg"
              alt="GOAT"
              sx={{
                width: { xs: 40, sm: 50 },
                height: { xs: 40, sm: 50 },
                border: '3px solid #4a90e2',
                bgcolor: 'transparent',
                p: 0.5,
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.3)',
              }}
            />
          </IconButton>

          <Typography
            variant="h6"
            component="h1"
            noWrap
            sx={{
              fontSize: { xs: '1rem', sm: '1.2rem' },
              fontWeight: 700,
              color: '#212121',
              display: { xs: 'block', sm: 'none' },
              minWidth: 0,
            }}
          >
            FG Guru
          </Typography>

          <Tooltip title="Fantasy Goats Guru" enterDelay={500}>
            <Typography
              variant="h5"
              component="h1"
              noWrap
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.5rem', md: '1.75rem' },
                fontWeight: 700,
                background: 'linear-gradient(90deg, #4A70A9 0%, #6a89cc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                display: { xs: 'none', sm: 'block' },
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              Fantasy Goats Guru
            </Typography>
          </Tooltip>
        </Box>

        {/* Navigation Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: '#ffffff',
              color: '#212121',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              borderRadius: 2,
              mt: 1,
              minWidth: 180,
            },
          }}
        >
          <MenuItem
            onClick={() => handleMenuSelect('/matchup')}
            selected={location.pathname === '/matchup' || location.pathname === '/'}
            sx={{
              py: 1.5,
              px: 2,
              fontWeight: 500,
              '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.1)' },
              '&.Mui-selected': {
                backgroundColor: 'rgba(74, 144, 226, 0.15)',
                '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.2)' },
              },
            }}
          >
            Matchups
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuSelect('/rankings')}
            selected={location.pathname === '/rankings'}
            sx={{
              py: 1.5,
              px: 2,
              fontWeight: 500,
              '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.1)' },
              '&.Mui-selected': {
                backgroundColor: 'rgba(74, 144, 226, 0.15)',
                '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.2)' },
              },
            }}
          >
            Rankings
          </MenuItem>
                      <MenuItem
              onClick={() => handleMenuSelect('/chat')}
              selected={location.pathname === '/chat'}
              sx={{
                py: 1.5,
                px: 2,
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(74, 144, 226, 0.1)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(74, 144, 226, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(74, 144, 226, 0.2)',
                  },
                },
              }}
            >
              AI Assistant
            </MenuItem>
          <MenuItem
            onClick={() => handleMenuSelect('/playoffs')}
            selected={location.pathname === '/playoffs'}
            sx={{
              py: 1.5,
              px: 2,
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(74, 144, 226, 0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(74, 144, 226, 0.2)',
                },
              },
            }}
          >
            Playoff Schedule
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuSelect('/seasons')}
            selected={location.pathname === '/seasons' || location.pathname === '/table'}
            sx={{
              py: 1.5,
              px: 2,
              fontWeight: 500,
              '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.1)' },
              '&.Mui-selected': {
                backgroundColor: 'rgba(74, 144, 226, 0.15)',
                '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.2)' },
              },
            }}
          >
            NBA History
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuSelect('/about')}
            selected={location.pathname === '/about'}
            sx={{
              py: 1.5,
              px: 2,
              fontWeight: 500,
              '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.1)' },
              '&.Mui-selected': {
                backgroundColor: 'rgba(74, 144, 226, 0.15)',
                '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.2)' },
              },
            }}
          >
            About Us
          </MenuItem>
        </Menu>

        {/* RIGHT: Compact League Dropdown + Tabs + Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.2 } }}>
          {isAuthenticated && userLeagues.length > 0 && (
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: 70, sm: 110 },
                maxWidth: { xs: 140, sm: 160 },
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#ffffff',
                  color: '#212121',
                  fontFamily: '"Roboto Mono", monospace',
                  fontSize: { xs: '0.65rem', sm: '0.78rem' },
                  borderRadius: 1.5,
                  height: { xs: 30, sm: 34 },
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0', borderWidth: 1.5 },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4a90e2' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4a90e2', borderWidth: 2 },
                },
                '& .MuiInputLabel-root': {
                  display: 'none', // Hide label completely on mobile to avoid overlap
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  display: 'block', // Show full label only when focused (optional)
                  color: '#4a90e2',
                  fontSize: '0.65rem',
                  transform: 'translate(8px, -9px) scale(0.75)',
                },
                '& .MuiSelect-icon': { color: '#4a90e2', fontSize: '1rem', right: 4 },
              }}
            >
              <InputLabel id="league-select-label">League</InputLabel>
              <Select
                labelId="league-select-label"
                value={selectedLeague}
                onChange={(e) => {
                  const newLeagueId = e.target.value;
                  setSelectedLeague(newLeagueId);
                  // Clear league teams immediately when switching leagues
                  setLeagueTeams([]);
                }}
                label="League"
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 280,
                      '& .MuiMenuItem-root': {
                        fontSize: '0.78rem',
                        py: 0.7,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      },
                    },
                  },
                }}
              >
                {userLeagues.map((league) => (
                  <MenuItem
                    key={league.leagueId}
                    value={league.leagueId}
                    title={`${league.name} ${league.season ? `(${league.season})` : ''}`}
                  >
                    <Typography noWrap sx={{ fontSize: 'inherit' }}>
                      {league.name} {league.season ? `(${league.season})` : ''}
                    </Typography>
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
                bgcolor: '#ffffff',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                '& .MuiTab-root': {
                  minWidth: { xs: 55, sm: 90 },
                  fontSize: { xs: '0.65rem', sm: '0.8rem' },
                  fontWeight: 600,
                  padding: { xs: '6px 10px', sm: '8px 16px' },
                  color: '#757575',
                  textTransform: 'none',
                  '&:hover': { color: '#4a90e2', backgroundColor: 'rgba(74, 144, 226, 0.05)' },
                  '&.Mui-selected': { color: '#4a90e2', fontWeight: 700 },
                },
                '& .MuiTabs-indicator': { backgroundColor: '#4a90e2', height: 3, borderRadius: '3px 3px 0 0' },
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
                sx={{
                  p: 0,
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.08)' },
                }}
              >
                <Avatar
                  src={
                    displayPicture && displayPicture.toLowerCase().includes('default')
                      ? 'https://www.svgrepo.com/show/513271/basketball.svg'
                      : displayPicture
                  }
                  alt={displayName}
                  sx={{
                    width: { xs: 34, sm: 40 },
                    height: { xs: 34, sm: 40 },
                    border: '2px solid #4a90e2',
                    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.3)',
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
                    backgroundColor: '#ffffff',
                    color: '#212121',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    borderRadius: 2,
                    mt: 1,
                    minWidth: 220,
                  },
                }}
              >
                <MenuItem
                  disabled
                  sx={{
                    opacity: 1,
                    '&.Mui-disabled': { opacity: 1, backgroundColor: 'rgba(74, 144, 226, 0.05)' },
                    py: 2,
                    px: 2.5,
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#212121' }}>
                      {displayName}
                    </Typography>
                    {displayEmail && (
                      <Typography variant="caption" sx={{ color: '#757575', mt: 0.5 }}>
                        {displayEmail}
                      </Typography>
                    )}
                  </Box>
                </MenuItem>
                <MenuItem
                  onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    fontWeight: 500,
                    '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.1)' },
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    fontWeight: 500,
                    color: '#d32f2f',
                    '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.1)' },
                  }}
                >
                  <Logout sx={{ mr: 1.5, fontSize: '1.2rem' }} />
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
              backgroundColor: '#f5f5f5',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={60} sx={{ color: '#4a90e2', mb: 2 }} />
              <Typography
                variant="h6"
                sx={{ color: '#212121', fontFamily: '"Roboto Mono", monospace' }}
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
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          © {new Date().getFullYear()} Fantasy Goats Guru. All rights reserved. |{' '}
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