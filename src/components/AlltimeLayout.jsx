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
  InputLabel,
  Select,
  Tooltip,
  Button,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
} from '@mui/material';
import { Logout, Login } from '@mui/icons-material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
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

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [historyAnchorEl, setHistoryAnchorEl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userLeagues, setUserLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [leagueTeams, setLeagueTeams] = useState([]);
  const [yahooConnecting, setYahooConnecting] = useState(false);

  // SVG Icons (unchanged)
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
    </svg>
  );

  const GamesIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 12h3v8h14v-8h3L12 2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const navItems = [
    { path: '/matchup', label: 'Matchups', icon: <MatchupIcon /> },
    { path: '/rankings', label: 'Rankings', icon: <RankingsIcon /> },
    { path: '/chat', label: 'AI Assistant', icon: <AIIcon /> },
    { path: '/playoffs', label: 'Playoffs', icon: <PlayoffIcon /> },
    { path: '/history', label: 'NBA History', icon: <HistoryIcon />, hasSubmenu: true },
    // { path: '/about', label: 'About', icon: <AboutIcon /> },
  ];

  const historySubmenu = [
    { path: '/teams', label: 'Teams', icon: <TeamsIcon /> },
    { path: '/seasons', label: 'Seasons', icon: <SeasonsIcon /> },
    { path: '/games', label: 'Games', icon: <GamesIcon /> },
  ];

  // Fetch profile, leagues, etc. (unchanged)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.userId) { setUserProfile(null); return; }
      try {
        const { data } = await supabase
          .from('user_profiles')
          .select('name, email, profile_picture')
          .eq('user_id', user.userId)
          .single();
        if (data) setUserProfile(data);
      } catch (err) { console.error(err); }
    };
    fetchUserProfile();
  }, [user?.userId]);

  const displayName = userProfile?.name || user?.name || 'User';
  const displayEmail = userProfile?.email || user?.email || '';
  const displayPicture = userProfile?.profile_picture || user?.profilePicture;

  // Leagues & teams (unchanged)
  useEffect(() => {
    const fetchUserLeagues = async () => {
      if (!isAuthenticated || !user?.userId) { setUserLeagues([]); return; }
      try {
        const { data } = await supabase.functions.invoke('yahoo-fantasy-api', {
          body: { action: 'getUserLeagues', userId: user.userId },
        });
        if (data?.leagues?.length > 0) {
          setUserLeagues(data.leagues);
          if (!selectedLeague) setSelectedLeague(data.leagues[0].leagueId);
        }
      } catch (err) { console.error(err); }
    };
    fetchUserLeagues();
  }, [user?.userId, isAuthenticated, selectedLeague]);

  useEffect(() => {
    const fetchLeagueTeams = async () => {
      if (!selectedLeague || !isAuthenticated) { setLeagueTeams([]); return; }
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

  const userTeamPlayers = useMemo(() => {
    if (!leagueTeams.length) return [];
    const userTeam = leagueTeams.find(t => t.is_owned_by_current_login);
    return userTeam?.players?.map(p => ({
      nbaPlayerId: p.nbaPlayerId,
      yahooPlayerId: p.yahooPlayerId,
      name: p.name,
    })) || [];
  }, [leagueTeams]);

  const handleNavClick = (path) => {
    setIsPageLoading(true);
    navigate(path);
    setTimeout(() => setIsPageLoading(false), 300);
  };

  const handleYahooConnect = async () => {
    setYahooConnecting(true);
    try {
      const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const { data, error } = await supabase.functions.invoke('yahoo-oauth', {
        body: {
          action: 'authorize',
          isDev: isDev,
        },
      });

      if (error) throw error;
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (err) {
      console.error('Failed to connect to Yahoo:', err);
      setYahooConnecting(false);
    }
  };

  const handleHistoryOpen = (e) => setHistoryAnchorEl(e.currentTarget);
  const handleHistoryClose = () => setHistoryAnchorEl(null);
  const handleProfileMenuOpen = (e) => setProfileAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);
  const handleLogout = () => { logout(); handleProfileMenuClose(); navigate('/matchup'); };

  const renderContent = () => {
    switch (location.pathname) {
      case '/': return <Matchup />;
      case '/teams': return <Alltime />;
      case '/seasons':
      case '/table': return <AlltimeTable />;
      case '/games': return <AlltimeGames />;
      case '/matchup': return <Matchup />;
      case '/rankings': return <Rankings />;
      case '/chat': return <FantasyChat />;
      case '/playoffs': return <LeaguePlayoffs />;
      case '/about': return <About />;
      case '/profile': return <UserProfile />;
      default: return <Matchup />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#EEEEEE' }}>
      {/* Header - SINGLE ROW, NO GAPS, NO STICKY TRANSPARENCY */}
      <Box sx={{
        bgcolor: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderBottom: '3px solid #4a90e2',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 1100,
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          py: 2,
          minHeight: 72,
          gap: 2,
        }}>
          {/* Left: Logo + Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.5 }, flexShrink: 0 }}>
            <Avatar
              src="https://www.svgrepo.com/show/396571/goat.svg"
              alt="GOAT"
              sx={{ width: { xs: 44, sm: 56 }, height: { xs: 44, sm: 56 }, border: '4px solid #4a90e2', cursor: 'pointer' }}
              onClick={() => navigate('/matchup')}
            />
            <Tooltip title="Fantasy Goats Guru">
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.6rem', md: '1.9rem' },
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #4A70A9 0%, #6a89cc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px',
                }}
              >
                Fantasy Goats Guru
              </Typography>
            </Tooltip>
          </Box>

          {/* Center: Navigation Buttons */}
          <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
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
                      px: 2.5,
                      py: 1,
                      fontSize: '0.925rem',
                      fontWeight: isHistoryActive ? 700 : 600,
                      color: isHistoryActive ? '#4a90e2' : '#424242',
                      bgcolor: isHistoryActive ? 'rgba(74,144,226,0.15)' : 'transparent',
                      borderRadius: 2,
                      textTransform: 'none',
                      whiteSpace: 'nowrap',
                      border: isHistoryActive ? '2px solid #4a90e2' : '2px solid transparent',
                      '&:hover': { bgcolor: 'rgba(74,144,226,0.1)', transform: 'translateY(-1px)' },
                    }}
                  >
                    {item.label}
                  </Button>

                  {/* HORIZONTAL Submenu */}
                  <Popper
                    open={Boolean(historyAnchorEl)}
                    anchorEl={historyAnchorEl}
                    transition
                    placement="bottom-start"
                    sx={{ zIndex: 1300 }}
                  >
                    {({ TransitionProps }) => (
                      <Grow {...TransitionProps} timeout={200}>
                        <Paper
                          elevation={12}
                          onMouseLeave={handleHistoryClose}
                          sx={{
                            mt: 1.5,
                            bgcolor: '#ffffff',
                            border: '2px solid #4a90e2',
                            borderRadius: 2,
                            overflow: 'hidden',
                            display: 'flex',
                            boxShadow: '0 8px 25px rgba(74,144,226,0.25)',
                          }}
                        >
                          <ClickAwayListener onClickAway={handleHistoryClose}>
                            <Box sx={{ display: 'flex' }}>
                              {historySubmenu.map((sub) => (
                                <MenuItem
                                  key={sub.path}
                                  onClick={() => { handleNavClick(sub.path); handleHistoryClose(); }}
                                  sx={{
                                    px: 3,
                                    py: 2,
                                    minWidth: 140,
                                    bgcolor: location.pathname === sub.path ? 'rgba(74,144,226,0.15)' : 'transparent',
                                    borderRight: '1px solid #e0e0e0',
                                    '&:last-child': { borderRight: 'none' },
                                    '&:hover': { bgcolor: 'rgba(74,144,226,0.2)' },
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                  }}
                                >
                                  {sub.icon}
                                  <Typography fontWeight={600}>{sub.label}</Typography>
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
                    px: 2.5,
                    py: 1,
                    fontSize: '0.925rem',
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? '#4a90e2' : '#424242',
                    bgcolor: isActive ? 'rgba(74,144,226,0.15)' : 'transparent',
                    borderRadius: 2,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    border: isActive ? '2px solid #4a90e2' : '2px solid transparent',
                    '&:hover': { bgcolor: 'rgba(74,144,226,0.1)', transform: 'translateY(-1px)' },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* Right: League + Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
            {isAuthenticated && userLeagues.length > 0 ? (
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel sx={{ color: '#424242' }}>League</InputLabel>
                <Select
                  value={selectedLeague}
                  onChange={(e) => { setSelectedLeague(e.target.value); setLeagueTeams([]); }}
                  label="League"
                  sx={{ bgcolor: '#fff', height: 40, borderRadius: 2 }}
                >
                  {userLeagues.map((l) => (
                    <MenuItem key={l.leagueId} value={l.leagueId}>
                      {l.name} {l.season && `(${l.season})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Button
                variant="outlined"
                startIcon={yahooConnecting ? <CircularProgress size={20} /> : <SportsBasketballIcon />}
                onClick={handleYahooConnect}
                disabled={yahooConnecting}
                sx={{
                  height: 40,
                  fontWeight: 600,
                  borderColor: '#4a90e2',
                  color: '#4a90e2',
                  fontFamily: '"Roboto Mono", monospace',
                  px: 3,
                  '&:hover': {
                    borderColor: '#80deea',
                    bgcolor: 'rgba(74, 144, 226, 0.1)',
                  },
                }}
              >
                {yahooConnecting ? 'Connecting...' : 'Connect to Yahoo'}
              </Button>
            )}

            {isAuthenticated && user && (
              <>
                <IconButton onClick={handleProfileMenuOpen}>
                  <Avatar
                    src={displayPicture?.includes('default') ? 'https://www.svgrepo.com/show/513271/basketball.svg' : displayPicture}
                    alt={displayName}
                    sx={{ width: 42, height: 42, border: '3px solid #4a90e2' }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={profileAnchorEl} open={Boolean(profileAnchorEl)} onClose={handleProfileMenuClose}>
                  <MenuItem disabled sx={{ opacity: 1, bgcolor: 'rgba(74,144,226,0.05)' }}>
                    <Box>
                      <Typography fontWeight={700}>{displayName}</Typography>
                      {displayEmail && <Typography variant="caption" color="text.secondary">{displayEmail}</Typography>}
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
                    <Logout sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', pb: 1 }}>
          <Button onClick={(e) => setAnchorEl(e.currentTarget)} variant="contained" sx={{ bgcolor: '#4a90e2' }}>
            Menu
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            {navItems.map((item) => !item.hasSubmenu ? (
              <MenuItem key={item.path} onClick={() => { handleNavClick(item.path); setAnchorEl(null); }}>
                {item.icon} {item.label}
              </MenuItem>
            ) : (
              <Box key={item.path}>
                <MenuItem onClick={() => { handleNavClick('/teams'); setAnchorEl(null); }}>
                  {item.icon} {item.label}
                </MenuItem>
                {historySubmenu.map((sub) => (
                  <MenuItem key={sub.path} onClick={() => { handleNavClick(sub.path); setAnchorEl(null); }} sx={{ pl: 6 }}>
                    {sub.icon} {sub.label}
                  </MenuItem>
                ))}
              </Box>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth={false} disableGutters sx={{ flexGrow: 1 }}>
        {isPageLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <CircularProgress size={70} sx={{ color: '#4a90e2' }} />
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
      <Box component="footer" sx={{ py: 3, textAlign: 'center', borderTop: '1px solid #e0e0e0', bgcolor: '#fff' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Fantasy Goats Guru ·{' '}
          <Link component={RouterLink} style={{ marginRight: '10px' }} to="/privacy-policy" color="primary">Privacy</Link>
          <Link component={RouterLink} to="/about" color="primary">About</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default AlltimeLayout;