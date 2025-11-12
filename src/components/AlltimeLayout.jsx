import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Link,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  FormControl,
  Select,
  Tooltip,
  Button,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import Alltime from '../Pages/Alltime';
import AlltimeTable from '../Pages/AlltimeTable';
import AlltimeGames from '../Pages/AlltimeGames';
import Matchup from '../Pages/Matchup';
import MyTeam from '../Pages/MyTeam';
import Rankings from '../Pages/Rankings';
import FantasyChat from '../Pages/FantasyChat';
import LeaguePlayoffs from '../Pages/LeaguePlayoffs';
import About from '../Pages/About';
import UserProfile from '../Pages/UserProfile';
import PrivacyPolicy from '../Pages/PrivacyPolicy';
import { useAuth } from '../contexts/AuthContext';
import { LeagueProvider } from '../contexts/LeagueContext';
import { supabase } from '../utils/supabase';
import ReassuringLoader from './ReassuringLoader';

const AlltimeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [historyAnchorEl, setHistoryAnchorEl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userLeagues, setUserLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [leagueTeams, setLeagueTeams] = useState([]);
  const [currentMatchup, setCurrentMatchup] = useState(null);
  const [yahooConnecting, setYahooConnecting] = useState(false);
  const [loadingLeagues, setLoadingLeagues] = useState(false);

  // === ICONS (unchanged - using your favorites) ===
  const MatchupIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );

  const RankingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18"/>
      <path d="M18 17V9"/>
      <path d="M13 17V5"/>
      <path d="M8 17v-3"/>
    </svg>
  );

  const AIIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <circle cx="9" cy="10" r="1"/>
      <circle cx="15" cy="10" r="1"/>
      <path d="M9 15c.5.8 1.5 1.5 3 1.5s2.5-.7 3-1.5"/>
    </svg>
  );

  const PlayoffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  );

  const HistoryIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );

  const AboutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );

  const TeamsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );

  const SeasonsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <path d="M12 14l-1 3h2l-1-3z"/>
    </svg>
  );

  const GamesIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4z"/>
      <path d="M8 12l4-4 4 4"/>
      <circle cx="12" cy="15" r="2"/>
      <path d="M4 8l8-4 8 4"/>
    </svg>
  );

  const MyTeamIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
    </svg>
  );

  const navItems = [
    { path: '/matchup', label: 'Matchups', icon: <MatchupIcon /> },
    { path: '/my-team', label: 'My Team', icon: <MyTeamIcon /> },
    { path: '/rankings', label: 'Rankings', icon: <RankingsIcon /> },
    { path: '/chat', label: 'AI Assistant', icon: <AIIcon /> },
    { path: '/playoffs', label: 'Playoffs', icon: <PlayoffIcon /> },
    { path: '/history', label: 'NBA History', icon: <HistoryIcon />, hasSubmenu: true },
  ];

  const historySubmenu = [
    { path: '/teams', label: 'Teams', icon: <TeamsIcon /> },
    { path: '/seasons', label: 'Seasons', icon: <SeasonsIcon /> },
    { path: '/games', label: 'Games', icon: <GamesIcon /> },
  ];

  // === DATA FETCHING (unchanged) ===
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.userId) return;
      try {
        const { data } = await supabase.from('user_profiles').select('name, email, profile_picture').eq('user_id', user.userId).single();
        if (data) setUserProfile(data);
      } catch (err) { console.error(err); }
    };
    fetchUserProfile();
  }, [user?.userId]);

  const displayName = userProfile?.name || user?.name || 'User';
  const displayPicture = userProfile?.profile_picture || user?.profilePicture;

  useEffect(() => {
    const fetchUserLeagues = async () => {
      if (!isAuthenticated || !user?.userId) return;
      setLoadingLeagues(true);
      try {
        const { data } = await supabase.functions.invoke('yahoo-fantasy-api', {
          body: { action: 'getUserLeagues', userId: user.userId },
        });
        if (data?.leagues?.length > 0) {
          setUserLeagues(data.leagues);
          if (!selectedLeague) setSelectedLeague(data.leagues[0].leagueId);
        }
      } catch (err) { 
        console.error(err); 
      } finally {
        setLoadingLeagues(false);
      }
    };
    fetchUserLeagues();
  }, [user?.userId, isAuthenticated, selectedLeague]);

  useEffect(() => {
    const fetchLeagueTeams = async () => {
      if (!selectedLeague || !isAuthenticated) return;
      try {
        const { data } = await supabase.functions.invoke('yahoo-fantasy-api', {
          body: { action: 'getAllTeamsInLeague', userId: user.userId, leagueId: selectedLeague },
        });
        setLeagueTeams(data?.teams || []);
      } catch (err) {
        console.error('Error fetching league teams:', err);
        setLeagueTeams([]);
      }
    };
    fetchLeagueTeams();
  }, [selectedLeague, user?.userId, isAuthenticated]);

  useEffect(() => {
    const fetchCurrentMatchup = async () => {
      if (!selectedLeague || !isAuthenticated || !user?.userId) return;
      try {
        const { data, error } = await supabase.functions.invoke('yahoo-fantasy-api', {
          body: { 
            action: 'getCurrentMatchup', 
            userId: user.userId, 
            leagueId: selectedLeague 
          },
        });
        if (error) {
          console.error('Error fetching matchup:', error);
          setCurrentMatchup(null);
          return;
        }
        if (data?.matchup) {
          setCurrentMatchup(data.matchup);
        } else {
          setCurrentMatchup(null);
        }
      } catch (err) {
        console.error('Error fetching current matchup:', err);
        setCurrentMatchup(null);
      }
    };
    fetchCurrentMatchup();
  }, [selectedLeague, user?.userId, isAuthenticated]);

  const userTeamPlayers = useMemo(() => {
    if (!leagueTeams.length) return [];
    const userTeam = leagueTeams.find(t => t.is_owned_by_current_login);
    return userTeam?.players?.map(p => ({ nbaPlayerId: p.nbaPlayerId, yahooPlayerId: p.yahooPlayerId, name: p.name })) || [];
  }, [leagueTeams]);

  const handleNavClick = (path) => {
    setIsPageLoading(true);
    navigate(path);
    setMobileMenuAnchor(null);
    setTimeout(() => setIsPageLoading(false), 300);
  };

  const handleYahooConnect = async () => {
    setYahooConnecting(true);
    setIsPageLoading(true); // Show spinner immediately
    try {
      // Store current pathname to redirect back after OAuth
      const currentPath = location.pathname;
      sessionStorage.setItem('oauth_return_path', currentPath);
      
      const isDev = window.location.hostname === 'localhost';
      const { data } = await supabase.functions.invoke('yahoo-oauth', { body: { action: 'authorize', isDev } });
      if (data?.authUrl) {
        // Small delay to ensure spinner is visible before redirect
        setTimeout(() => {
          window.location.href = data.authUrl;
        }, 100);
      }
    } catch (err) {
      console.error(err);
      setYahooConnecting(false);
      setIsPageLoading(false);
    }
  };

  // Global OAuth callback handler
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    
    // Only handle if we have a code and user is not authenticated
    // Skip if we're on matchup page (it has its own handler, but we'll override redirect)
    if (code && !isAuthenticated) {
      const returnPath = sessionStorage.getItem('oauth_return_path') || '/matchup';
      sessionStorage.removeItem('oauth_return_path');
      
      // Remove code from URL immediately to prevent double-processing
      window.history.replaceState({}, document.title, returnPath);
      
      // Process OAuth callback
      const processCallback = async () => {
        setIsPageLoading(true); // Show spinner while processing callback
        try {
          const isDev = window.location.hostname === 'localhost';
          const { data } = await supabase.functions.invoke('yahoo-oauth', {
            body: { action: 'callback', code, isDev }
          });
          
          if (data?.success) {
            // Call login function from AuthContext
            login({
              userId: data.userId,
              email: data.email,
              name: data.name,
              profilePicture: data.profilePicture,
              expiresAt: data.expiresAt,
            });
            
            // Create or update user_profile
            try {
              const { data: existingProfile, error: profileError } = await supabase
                .from('user_profiles')
                .select('user_id, name, email')
                .eq('user_id', data.userId)
                .single();
              
              if (profileError && profileError.code !== 'PGRST116') {
                throw profileError;
              }
              
              if (existingProfile && !profileError) {
                const updateData = {};
                if (!existingProfile.name && data.name) updateData.name = data.name;
                if (!existingProfile.email && data.email) updateData.email = data.email;
                if (Object.keys(updateData).length > 0) {
                  await supabase.from('user_profiles').update(updateData).eq('user_id', data.userId);
                }
              } else {
                await supabase.from('user_profiles').insert({
                  user_id: data.userId,
                  name: data.name || '',
                  email: data.email || '',
                  send_weekly_projections: true,
                  send_news: true,
                });
              }
            } catch (profileErr) {
              console.error('Error updating user profile:', profileErr);
            }
            
            // Navigate to the return path
            navigate(returnPath);
          } else {
            setIsPageLoading(false);
          }
        } catch (err) {
          console.error('OAuth callback error:', err);
          setIsPageLoading(false);
        }
      };
      
      processCallback();
    }
  }, [isAuthenticated, navigate, login]);

  const handleHistoryOpen = (e) => !isMobile && setHistoryAnchorEl(e.currentTarget);
  const handleHistoryClose = () => setHistoryAnchorEl(null);

  const renderContent = () => {
    const p = location.pathname;
    if (p === '/' || p === '/matchup') return <Matchup />;
    if (p === '/my-team') return <MyTeam />;
    if (p === '/teams') return <Alltime />;
    if (p === '/seasons' || p === '/table') return <AlltimeTable />;
    if (p === '/games') return <AlltimeGames />;
    if (p === '/rankings') return <Rankings />;
    if (p === '/chat') return <FantasyChat />;
    if (p === '/playoffs') return <LeaguePlayoffs />;
    if (p === '/about') return <About />;
    if (p === '/profile') return <UserProfile />;
    if (p === '/privacy-policy') return <PrivacyPolicy />;
    return <Matchup />;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#EEEEEE' }}>
      {/* HEADER */}
      <Box sx={{
        bgcolor: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderBottom: '4px solid #4a90e2',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        position: 'relative',
        zIndex: 1300, // Higher than before
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          py: 2,
          minHeight: 76,
        }}>
          {/* LEFT: GOAT = MENU on mobile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 0 : 2 }}>
            <Avatar
              src="https://www.svgrepo.com/show/396571/goat.svg"
              alt="GOAT"
              onClick={(e) => isMobile ? setMobileMenuAnchor(e.currentTarget) : navigate('/matchup')}
              sx={{
                width: { xs: 50, sm: 56 },
                height: { xs: 50, sm: 56 },
                border: '4px solid #4a90e2',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:active': { transform: 'scale(0.95)' },
              }}
            />

            {!isMobile && (
              <Tooltip title="Fantasy Goats Guru">
                <Typography
                  variant="h5"
                  noWrap
                  sx={{
                    fontSize: { sm: '1.75rem', md: '1.9rem' },
                    fontWeight: 800,
                    background: 'linear-gradient(90deg, #4A70A9 0%, #6a89cc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Fantasy Goats Guru
                </Typography>
              </Tooltip>
            )}
          </Box>

          {/* DESKTOP NAV */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path === '/matchup' && location.pathname === '/');
                const isHistoryActive = item.hasSubmenu && historySubmenu.some(s => s.path === location.pathname);

                return item.hasSubmenu ? (
                  <Box key={item.path} sx={{ position: 'relative' }}>
                    <Button
                      onMouseEnter={handleHistoryOpen}
                      onClick={() => handleNavClick('/teams')}
                      startIcon={item.icon}
                      sx={{
                        px: 3, py: 1.2, fontSize: '0.95rem', fontWeight: isHistoryActive ? 700 : 600,
                        color: isHistoryActive ? '#4a90e2' : '#333',
                        bgcolor: isHistoryActive ? 'rgba(74,144,226,0.18)' : 'transparent',
                        borderRadius: 2.5, textTransform: 'none',
                        border: isHistoryActive ? '2px solid #4a90e2' : '2px solid transparent',
                        '&:hover': { bgcolor: 'rgba(74,144,226,0.12)' },
                      }}
                    >
                      {item.label}
                    </Button>

                    {/* SUBMENU NOW ABOVE THE LINE */}
                    <Popper
                      open={Boolean(historyAnchorEl)}
                      anchorEl={historyAnchorEl}
                      transition
                      sx={{ zIndex: 1400 }}
                      modifiers={[
                        {
                          name: 'offset',
                        },
                        {
                          name: 'flip',
                          enabled: false,
                        },
                        {
                          name: 'preventOverflow',
                          enabled: true,
                          options: { boundary: 'viewport' },
                        },
                      ]}
                    >
                      {({ TransitionProps }) => (
                        <Grow {...TransitionProps}>
                          <Paper
                            elevation={20}
                            onMouseLeave={handleHistoryClose}
                            sx={{
                              mb: 1.5,
                              bgcolor: '#fff',
                              border: '3px solid #4a90e2',
                              borderRadius: 3,
                              overflow: 'hidden',
                              display: 'flex',
                              boxShadow: '0 -8px 30px rgba(74,144,226,0.3)',
                            }}
                          >
                            <ClickAwayListener onClickAway={handleHistoryClose}>
                              <Box sx={{ display: 'flex' }}>
                                {historySubmenu.map((sub) => (
                                  <MenuItem
                                    key={sub.path}
                                    onClick={() => { handleNavClick(sub.path); handleHistoryClose(); }}
                                    sx={{
                                      px: 4, py: 2.4, minWidth: 170,
                                      bgcolor: location.pathname === sub.path ? 'rgba(74,144,226,0.18)' : 'transparent',
                                      borderRight: '1px solid #ddd',
                                      '&:last-child': { borderRight: 'none' },
                                      '&:hover': { bgcolor: 'rgba(74,144,226,0.25)' },
                                      gap: 2,
                                    }}
                                  >
                                    {sub.icon}
                                    <Typography fontWeight={600} fontSize="0.95rem">{sub.label}</Typography>
                                  </MenuItem>
                                ))}
                              </Box>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </Box>
                ) : (
                  <Button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    startIcon={item.icon}
                    sx={{
                      px: 3, py: 1.2, fontSize: '0.95rem', fontWeight: isActive ? 700 : 600,
                      color: isActive ? '#4a90e2' : '#333',
                      bgcolor: isActive ? 'rgba(74,144,226,0.18)' : 'transparent',
                      borderRadius: 2.5, textTransform: 'none',
                      border: isActive ? '2px solid #4a90e2' : '2px solid transparent',
                      '&:hover': { bgcolor: 'rgba(74,144,226,0.12)' },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* RIGHT: Connect to Yahoo + Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flexShrink: 0 }}>
            {/* CONNECT TO YAHOO BUTTON */}
            {isAuthenticated && userLeagues.length > 0 ? (
              <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 130 } }}>
                <Select
                  value={selectedLeague}
                  onChange={(e) => setSelectedLeague(e.target.value)}
                  displayEmpty
                  sx={{
                    bgcolor: '#fff',
                    height: 36,
                    fontSize: '0.8rem',
                    '& .MuiSelect-select': { py: 1 },
                  }}
                >
                  {userLeagues.map((l) => (
                    <MenuItem key={l.leagueId} value={l.leagueId} sx={{ fontSize: '0.85rem' }}>
                      {l.name.split(' ').slice(0, 2).join(' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Button
                variant="contained"
                startIcon={yahooConnecting ? <CircularProgress size={18} color="inherit" /> : <SportsBasketballIcon />}
                onClick={handleYahooConnect}
                disabled={yahooConnecting}
                sx={{
                  height: 38,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  bgcolor: '#4a90e2',
                  color: 'white',
                  borderRadius: 3,
                  px: 2,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(74,144,226,0.4)',
                  '&:hover': {
                    bgcolor: '#357abd',
                    boxShadow: '0 6px 16px rgba(74,144,226,0.5)',
                  },
                  '&:active': { transform: 'translateY(1px)' },
                }}
              >
                {yahooConnecting ? 'Connecting...' : 'Connect to Yahoo'}
              </Button>
            )}

            {/* Profile */}
            {isAuthenticated && user && (
              <IconButton onClick={(e) => setProfileAnchorEl(e.currentTarget)}>
                <Avatar
                  src={displayPicture?.includes('default') ? 'https://www.svgrepo.com/show/513271/basketball.svg' : displayPicture}
                  alt={displayName}
                  sx={{ width: 38, height: 38, border: '2px solid #4a90e2' }}
                >
                  {displayName[0]}
                </Avatar>
              </IconButton>
            )}
          </Box>
        </Box>

        {/* MOBILE MENU */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={() => setMobileMenuAnchor(null)}
          PaperProps={{ sx: { width: 260, mt: 1.5 } }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {navItems.map((item) => !item.hasSubmenu ? (
            <MenuItem key={item.path} onClick={() => handleNavClick(item.path)} sx={{ py: 2, gap: 2 }}>
              {item.icon}
              <Typography fontWeight={600}>{item.label}</Typography>
            </MenuItem>
          ) : (
            <Box key={item.path}>
              <MenuItem onClick={() => handleNavClick('/teams')} sx={{ py: 2, gap: 2, fontWeight: 600 }}>
                {item.icon} {item.label}
              </MenuItem>
              {historySubmenu.map((sub) => (
                <MenuItem
                  key={sub.path}
                  onClick={() => handleNavClick(sub.path)}
                  sx={{ pl: 7, py: 1.8, bgcolor: location.pathname === sub.path ? 'rgba(74,144,226,0.1)' : 'transparent' }}
                >
                  {sub.icon} {sub.label}
                </MenuItem>
              ))}
            </Box>
          ))}
        </Menu>
      </Box>

      {/* Profile Menu */}
      <Menu anchorEl={profileAnchorEl} open={Boolean(profileAnchorEl)} onClose={() => setProfileAnchorEl(null)}>
        <MenuItem disabled sx={{ opacity: 1 }}>
          <Box>
            <Typography fontWeight={700}>{displayName}</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => { setProfileAnchorEl(null); navigate('/profile'); }}>Profile</MenuItem>
        <MenuItem onClick={() => { setProfileAnchorEl(null); navigate('/about'); }}>About us</MenuItem>
        <MenuItem onClick={() => { logout(); setProfileAnchorEl(null); navigate('/matchup'); }} sx={{ color: '#d32f2f' }}>
          <Logout sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>

      {/* CONTENT & FOOTER */}
      <Container maxWidth={false} disableGutters sx={{ flexGrow: 1 }}>
        {isPageLoading || (loadingLeagues && isAuthenticated) ? (
          <ReassuringLoader 
            type={loadingLeagues && isAuthenticated ? 'leagues' : 'page'}
            minHeight="70vh"
          />
        ) : (
          <LeagueProvider
            selectedLeague={selectedLeague}
            onLeagueChange={setSelectedLeague}
            userLeagues={userLeagues}
            leagueTeams={leagueTeams}
            userTeamPlayers={userTeamPlayers}
            setLeagueTeams={setLeagueTeams}
            currentMatchup={currentMatchup}
            setCurrentMatchup={setCurrentMatchup}
          >
            {renderContent()}
          </LeagueProvider>
        )}
      </Container>

      <Box component="footer" sx={{ py: 3, textAlign: 'center', borderTop: '1px solid #e0e0e0', bgcolor: '#fff' }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Fantasy Goats Guru ·{' '}
          <Link component={RouterLink} to="/privacy-policy" color="primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Privacy Policy
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default AlltimeLayout;