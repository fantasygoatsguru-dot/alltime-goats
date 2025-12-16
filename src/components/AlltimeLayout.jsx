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
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Logout, ExpandMore } from '@mui/icons-material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import Alltime from '../Pages/Alltime';
import AlltimeTable from '../Pages/AlltimeTable';
import AlltimeGames from '../Pages/AlltimeGames';
import SeasonGames from '../Pages/SeasonGames';
import Matchup from '../Pages/Matchup';
import MyTeam from '../Pages/MyTeam';
import MatchupProjection from '../Pages/MatchupProjection';
import Rankings from '../Pages/Rankings';
import FantasyChat from '../Pages/FantasyChat';
import LeaguePlayoffs from '../Pages/LeaguePlayoffs';
import NBAPlayoffs from '../Pages/NBAPlayoffs';
import MyLeaguePlayoffs from '../Pages/MyLeaguePlayoffs';
import NBARegularSeason from '../Pages/NBARegularSeason';
import MyLeagueRegularSeason from '../Pages/MyLeagueRegularSeason';
import UltimateWinner from '../Pages/UltimateWinner';
import About from '../Pages/About';
import UserProfile from '../Pages/UserProfile';
import PrivacyPolicy from '../Pages/PrivacyPolicy';
import { useAuth } from '../contexts/AuthContext';
import { LeagueProvider } from '../contexts/LeagueContext';
import { supabase } from '../utils/supabase';
import ReassuringLoader from './ReassuringLoader';

// === ICON WRAPPER FOR RESPONSIVE SIZING ===
const IconWrapper = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const size = isMobile ? 30 : 40;
  return React.cloneElement(children, {
    style: { width: size, height: size, ...children.props.style },
  });
};
const MyTeamIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
  </svg>
);

// === SUBMENU ICONS (unchanged - keep your favorites) ===
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



const ProjectionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18"/>
    <path d="M7 16l4-4 4 4 6-6"/>
    <circle cx="7" cy="16" r="2"/>
    <circle cx="11" cy="12" r="2"/>
    <circle cx="15" cy="16" r="2"/>
    <circle cx="21" cy="10" r="2"/>
  </svg>
);

const SeasonGamesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <path d="M3 9h18"/>
    <path d="M9 21V9"/>
    <circle cx="15" cy="15" r="3"/>
    <path d="M15 12v3l2 1"/>
  </svg>
);

const ScheduleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const UltimateWinnerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="21" x2="9" y2="9"/>
    <path d="M12 5l1.5 3 3.5 0.5-2.5 2.5 0.5 3.5-3-1.5-3 1.5 0.5-3.5-2.5-2.5 3.5-0.5z"/>
  </svg>
);
  
const AlltimeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [leagueAnchorEl, setLeagueAnchorEl] = useState(null);
  const [rankingsAnchorEl, setRankingsAnchorEl] = useState(null);
  const [scheduleAnchorEl, setScheduleAnchorEl] = useState(null);
  const [alltimeAnchorEl, setAlltimeAnchorEl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userLeagues, setUserLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [leagueTeams, setLeagueTeams] = useState([]);
  const [currentMatchup, setCurrentMatchup] = useState(null);
  const [yahooConnecting, setYahooConnecting] = useState(false);
  const [loadingLeagues, setLoadingLeagues] = useState(false);

  // === MAIN NAV ITEMS WITH NEW SVGs ===
  const navItems = [
    {
      path: '/league',
      label: 'League',
      icon: (
        <img
          src="https://fqrnmcnvrrujiutstkgb.supabase.co/storage/v1/object/public/avatars/menu/trophy.svg"
          alt="League"
        />
      ),
      hasSubmenu: true,
    },
    {
      path: '/rankings',
      label: 'Rankings',
      icon: (
        <img
          src="https://fqrnmcnvrrujiutstkgb.supabase.co/storage/v1/object/public/avatars/menu/rankings.svg"
          alt="Rankings"
        />
      ),
      hasSubmenu: true,
    },
    {
      path: '/chat',
      label: 'AI Helper',
      icon: (
        <img
          src="https://fqrnmcnvrrujiutstkgb.supabase.co/storage/v1/object/public/avatars/menu/brain.svg"
          alt="AI Helper"
        />
      ),
      requiresAuth: true,
      requiresPremium: true,
      tooltip: 'Connect to Yahoo to access AI Assistant',
      premiumTooltip: 'Consider supporting us for any amount to open premium features for the season.',
    },
    {
      path: '/schedule',
      label: 'Schedule',
      icon: (
        <img
          src="https://fqrnmcnvrrujiutstkgb.supabase.co/storage/v1/object/public/avatars/menu/calendar.svg"
          alt="Schedule"
        />
      ),
      hasSubmenu: true,
    },
    {
      path: '/alltime',
      label: 'Alltime',
      icon: (
        <img
          src="https://fqrnmcnvrrujiutstkgb.supabase.co/storage/v1/object/public/avatars/menu/wilt.svg"
          alt="Alltime"
        />
      ),
      hasSubmenu: true,
    },
  ];

  const leagueSubmenu = [
    { path: '/matchup', label: 'Matchup', icon: <ProjectionIcon />, requiresAuth: false },
    { path: '/my-team', label: 'My Team', icon: <MyTeamIcon />, requiresAuth: false },
    { 
      path: '/matchup-projection', 
      label: 'Matchup Projection', 
      icon: <MatchupIcon />, 
      requiresAuth: true, 
      requiresPremium: false,
      tooltip: 'Connect to Yahoo to view your matchups',
      premiumTooltip: 'Upgrade to premium to access matchup projections'
    },
    { 
      path: '/ultimate-winner', 
      label: 'Head-to-Head Matrix', 
      icon: <UltimateWinnerIcon />, 
      requiresAuth: true, 
      requiresPremium: false,
      tooltip: 'Connect to Yahoo to view head-to-head matrix',
      premiumTooltip: 'Upgrade to premium to access head-to-head matrix'
    },
  ];

  const rankingsSubmenu = [
    { path: '/rankings', label: 'Players', icon: <GamesIcon />, requiresAuth: false },
    { path: '/season-games', label: 'Games', icon: <SeasonGamesIcon />, requiresAuth: false },
  ];

  const scheduleSubmenu = [
    { 
      path: '/my-league-regular-season', 
      label: 'My Season', 
      icon: <MyTeamIcon />, 
      requiresAuth: true, 
      requiresPremium: true,
      tooltip: 'Connect to Yahoo to view your league schedule',
      premiumTooltip: 'Upgrade to premium to access your league schedule'
    },
    { path: '/nba-regular-season', label: 'NBA Season', icon: <ScheduleIcon />, requiresAuth: false },
    { 
      path: '/my-league-playoffs', 
      label: 'My Playoffs', 
      icon: <MyTeamIcon />, 
      requiresAuth: true, 
      requiresPremium: true,
      tooltip: 'Connect to Yahoo to view your playoff schedule',
      premiumTooltip: 'Upgrade to premium to access your playoff schedule'
    },
    { path: '/nba-playoffs', label: 'NBA Playoffs', icon: <PlayoffIcon />, requiresAuth: false },
  ];

  const alltimeSubmenu = [
    { path: '/games', label: 'Alltime Games', icon: <GamesIcon />, requiresAuth: false },
    { path: '/seasons', label: 'Alltime Seasons', icon: <SeasonsIcon />, requiresAuth: false },
    { path: '/teams', label: 'Alltime Teams', icon: <TeamsIcon />, requiresAuth: false },

  ];

  
  // === DATA FETCHING ===
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.userId) return;
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('name, email, send_weekly_projections, send_news, is_premium')
          .eq('user_id', user.userId)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }
        
        if (data) {
          console.log('User profile fetched successfully:', data);
          setUserProfile(data);
        } else {
          console.log('No user profile found for userId:', user.userId);
        }
      } catch (err) { 
        console.error('Exception fetching user profile:', err); 
      }
    };
    fetchUserProfile();
  }, [user?.userId]);

  const displayName = userProfile?.name || user?.name || 'User';
  const displayPicture = userProfile?.profile_picture || user?.profilePicture;
  const isPremium = userProfile?.is_premium ?? false;
  
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
          if (!selectedLeague) {
            const firstLeagueId = String(data.leagues[0].leagueId);
            setSelectedLeague(firstLeagueId);
          }
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
    setIsPageLoading(true);
    try {
      const currentPath = location.pathname;
      sessionStorage.setItem('oauth_return_path', currentPath);
      
      const isDev = window.location.hostname === 'localhost';
      const { data } = await supabase.functions.invoke('yahoo-oauth', { body: { action: 'authorize', isDev } });
      if (data?.authUrl) {
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
    
    if (code && !isAuthenticated) {
      const returnPath = sessionStorage.getItem('oauth_return_path') || '/matchup';
      sessionStorage.removeItem('oauth_return_path');
      
      window.history.replaceState({}, document.title, returnPath);
      
      const processCallback = async () => {
        setIsPageLoading(true);
        try {
          const isDev = window.location.hostname === 'localhost';
          const { data } = await supabase.functions.invoke('yahoo-oauth', {
            body: { action: 'callback', code, isDev }
          });
          
          if (data?.success) {
            login({
              userId: data.userId,
              email: data.email,
              name: data.name,
              profilePicture: data.profilePicture,
              expiresAt: data.expiresAt,
            });
            
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

  const closeAllMenus = () => {
    setLeagueAnchorEl(null);
    setRankingsAnchorEl(null);
    setScheduleAnchorEl(null);
    setAlltimeAnchorEl(null);
  };

  const handleLeagueOpen = (e) => {
    if (isMobile) return;
    closeAllMenus();
    setLeagueAnchorEl(e.currentTarget);
  };
  const handleLeagueClose = () => setLeagueAnchorEl(null);
  
  const handleRankingsOpen = (e) => {
    if (isMobile) return;
    closeAllMenus();
    setRankingsAnchorEl(e.currentTarget);
  };
  const handleRankingsClose = () => setRankingsAnchorEl(null);
  
  const handleScheduleOpen = (e) => {
    if (isMobile) return;
    closeAllMenus();
    setScheduleAnchorEl(e.currentTarget);
  };
  const handleScheduleClose = () => setScheduleAnchorEl(null);
  
  const handleAlltimeOpen = (e) => {
    if (isMobile) return;
    closeAllMenus();
    setAlltimeAnchorEl(e.currentTarget);
  };
  const handleAlltimeClose = () => setAlltimeAnchorEl(null);

  const renderContent = () => {
    const p = location.pathname;
    if (p === '/' || p === '/matchup') return <Matchup />;
    if (p === '/matchup-projection') return <MatchupProjection />;
    if (p === '/my-team') return <MyTeam />;
    if (p === '/ultimate-winner') return <UltimateWinner />;
    if (p === '/teams') return <Alltime />;
    if (p === '/seasons' || p === '/table') return <AlltimeTable />;
    if (p === '/games') return <AlltimeGames />;
    if (p === '/season-games') return <SeasonGames />;
    if (p === '/rankings') return <Rankings />;
    if (p === '/chat') return <FantasyChat />;
    if (p === '/playoffs') return <LeaguePlayoffs />;
    if (p === '/nba-playoffs') return <NBAPlayoffs />;
    if (p === '/my-league-playoffs') return <MyLeaguePlayoffs />;
    if (p === '/nba-regular-season') return <NBARegularSeason />;
    if (p === '/my-league-regular-season') return <MyLeagueRegularSeason />;
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
        zIndex: 1300,
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
                const submenuMap = { 
                  '/league': { submenu: leagueSubmenu, anchorEl: leagueAnchorEl, handleOpen: handleLeagueOpen, handleClose: handleLeagueClose, defaultPath: '/my-team' },
                  '/rankings': { submenu: rankingsSubmenu, anchorEl: rankingsAnchorEl, handleOpen: handleRankingsOpen, handleClose: handleRankingsClose, defaultPath: '/rankings' },
                  '/schedule': { submenu: scheduleSubmenu, anchorEl: scheduleAnchorEl, handleOpen: handleScheduleOpen, handleClose: handleScheduleClose, defaultPath: '/nba-regular-season' },
                  '/alltime': { submenu: alltimeSubmenu, anchorEl: alltimeAnchorEl, handleOpen: handleAlltimeOpen, handleClose: handleAlltimeClose, defaultPath: '/games' },
                };

                const config = submenuMap[item.path];
                const isActive = location.pathname === item.path || (item.path === '/matchup' && location.pathname === '/');
                const isSubmenuActive = config && config.submenu.some(s => s.path === location.pathname);

                return item.hasSubmenu ? (
                  <Box key={item.path} sx={{ position: 'relative' }}>
                    <Button
                      onMouseEnter={config.handleOpen}
                      onClick={() => handleNavClick(config.defaultPath)}
                      startIcon={<IconWrapper>{item.icon}</IconWrapper>}
                      sx={{
                        px: { xs: 2.5, md: 3.8 },
                        py: 1.5,
                        fontSize: '0.95rem',
                        fontWeight: isSubmenuActive ? 700 : 600,
                        color: isSubmenuActive ? '#4a90e2' : '#333',
                        bgcolor: isSubmenuActive ? 'rgba(74,144,226,0.18)' : 'transparent',
                        borderRadius: 2.5,
                        textTransform: 'none',
                        border: isSubmenuActive ? '2px solid #4a90e2' : '2px solid transparent',
                        '&:hover': { bgcolor: 'rgba(74,144,226,0.12)' },
                      }}
                    >
                      {item.label}
                    </Button>

                    <Popper
                      open={Boolean(config.anchorEl)}
                      anchorEl={config.anchorEl}
                      placement="bottom-start"
                      transition
                      sx={{ zIndex: 1400 }}
                      modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
                    >
                      {({ TransitionProps }) => (
                        <Grow {...TransitionProps}>
                          <Paper
                            elevation={20}
                            onMouseLeave={config.handleClose}
                            sx={{
                              bgcolor: '#fff',
                              border: '3px solid #4a90e2',
                              borderRadius: 3,
                              overflow: 'hidden',
                              minWidth: 220,
                              boxShadow: '0 8px 30px rgba(74,144,226,0.3)',
                            }}
                          >
                            <ClickAwayListener onClickAway={config.handleClose}>
                              <Box>
                                {config.submenu.map((sub) => {
                                  const isDisabled = (sub.requiresAuth && !isAuthenticated) || (sub.requiresPremium && !isPremium);
                                  const needsAuth = sub.requiresAuth && !isAuthenticated;
                                  const needsPremium = sub.requiresPremium && !isPremium;
                                  
                                  const tooltipContent = needsAuth && sub.tooltip 
                                    ? sub.tooltip 
                                    : needsPremium && sub.premiumTooltip 
                                    ? (
                                        <Box>
                                          {sub.premiumTooltip}{' '}
                                          <Link
                                            href="https://buymeacoffee.com/fantasygoatsguru"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ color: '#fff', textDecoration: 'underline', fontWeight: 600 }}
                                          >
                                            Support us here
                                          </Link>
                                        </Box>
                                      )
                                    : '';
                                  
                                  return (
                                    <Tooltip 
                                      key={sub.path} 
                                      title={tooltipContent} 
                                      placement="right"
                                      arrow
                                    >
                                      <span>
                                        <MenuItem
                                          onClick={() => { 
                                            if (!isDisabled) {
                                              handleNavClick(sub.path); 
                                              config.handleClose(); 
                                            }
                                          }}
                                          disabled={isDisabled}
                                          sx={{
                                            px: 3, py: 2,
                                            bgcolor: location.pathname === sub.path ? 'rgba(74,144,226,0.18)' : 'transparent',
                                            borderBottom: '1px solid #f0f0f0',
                                            '&:last-child': { borderBottom: 'none' },
                                            '&:hover': { bgcolor: isDisabled ? 'transparent' : 'rgba(74,144,226,0.12)' },
                                            opacity: isDisabled ? 0.5 : 1,
                                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                                            gap: 2,
                                          }}
                                        >
                                          {sub.icon}
                                          <Typography fontWeight={600} fontSize="0.95rem">{sub.label}</Typography>
                                        </MenuItem>
                                      </span>
                                    </Tooltip>
                                  );
                                })}
                              </Box>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </Box>
                ) : (
                  <Tooltip 
                    title={
                      item.requiresAuth && !isAuthenticated && item.tooltip
                        ? item.tooltip
                        : item.requiresPremium && !isPremium && item.premiumTooltip
                        ? (
                            <Box>
                              {item.premiumTooltip}{' '}
                              <Link
                                href="https://buymeacoffee.com/fantasygoatsguru"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: '#fff', textDecoration: 'underline', fontWeight: 600 }}
                              >
                                Support us here
                              </Link>
                            </Box>
                          )
                        : ''
                    } 
                    placement="bottom"
                    arrow
                  >
                    <span>
                      <Button
                        key={item.path}
                        onClick={() => {
                          const isDisabled = (item.requiresAuth && !isAuthenticated) || (item.requiresPremium && !isPremium);
                          if (!isDisabled) {
                            handleNavClick(item.path);
                          }
                        }}
                        disabled={(item.requiresAuth && !isAuthenticated) || (item.requiresPremium && !isPremium)}
                        startIcon={<IconWrapper>{item.icon}</IconWrapper>}
                        sx={{
                          px: { xs: 2.5, md: 3.8 },
                          py: 1.5,
                          fontSize: '0.95rem',
                          fontWeight: isActive ? 700 : 600,
                          color: isActive ? '#4a90e2' : '#333',
                          bgcolor: isActive ? 'rgba(74,144,226,0.18)' : 'transparent',
                          borderRadius: 2.5,
                          textTransform: 'none',
                          border: isActive ? '2px solid #4a90e2' : '2px solid transparent',
                          '&:hover': { bgcolor: 'rgba(74,144,226,0.12)' },
                          opacity: (item.requiresAuth && !isAuthenticated) || (item.requiresPremium && !isPremium) ? 0.5 : 1,
                          cursor: (item.requiresAuth && !isAuthenticated) || (item.requiresPremium && !isPremium) ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {item.label}
                      </Button>
                    </span>
                  </Tooltip>
                );
              })}
            </Box>
          )}

          {/* RIGHT: Connect to Yahoo + Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flexShrink: 0 }}>
            {isAuthenticated && userLeagues.length > 0 ? (
              <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 130 } }}>
                <Select
                  value={selectedLeague || ''}
                  onChange={(e) => {
                    const newLeagueId = e.target.value;
                    console.log('League change attempted:', { 
                      newLeagueId, 
                      isPremium, 
                      currentLeague: selectedLeague,
                      userProfile: userProfile,
                      is_premium_value: userProfile?.is_premium,
                      eventValue: e.target.value,
                      eventType: typeof e.target.value
                    });
                    
                    if (!newLeagueId) {
                      console.warn('⚠️ No league ID received in onChange');
                      return;
                    }
                    
                    if (isPremium) {
                      const leagueIdStr = String(newLeagueId);
                      console.log('✅ Premium user - allowing league switch to:', leagueIdStr);
                      setSelectedLeague(leagueIdStr);
                    } else {
                      console.warn('❌ Non-premium user - league switch blocked. isPremium:', isPremium);
                    }
                  }}
                  displayEmpty
                  renderValue={(value) => {
                    if (!value) return '';
                    const valueStr = String(value);
                    const selected = userLeagues.find(l => String(l.leagueId) === valueStr);
                    return selected ? selected.name.split(' ').slice(0, 2).join(' ') : '';
                  }}
                  sx={{
                    bgcolor: '#fff',
                    height: 36,
                    fontSize: '0.8rem',
                    '& .MuiSelect-select': { py: 1 },
                  }}
                >
                  {userLeagues.map((l) => {
                    const leagueIdStr = String(l.leagueId);
                    const selectedLeagueStr = String(selectedLeague || '');
                    const isDisabled = !isPremium && leagueIdStr !== selectedLeagueStr;
                    const menuItem = (
                      <MenuItem 
                        key={l.leagueId}
                        value={leagueIdStr}
                        disabled={isDisabled}
                        sx={{ 
                          fontSize: '0.85rem',
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                      >
                        {l.name.split(' ').slice(0, 2).join(' ')}
                      </MenuItem>
                    );
                    
                    if (isDisabled) {
                      return (
                        <Tooltip
                          key={l.leagueId}
                          title={
                            <Box>
                              Consider supporting us for any amount to open premium features for the season.{' '}
                              <Link
                                href="https://buymeacoffee.com/fantasygoatsguru"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: '#fff', textDecoration: 'underline', fontWeight: 600 }}
                              >
                                Support us here
                              </Link>
                            </Box>
                          }
                          placement="right"
                          arrow
                          enterDelay={500}
                        >
                          <span style={{ display: 'block' }}>
                            {menuItem}
                          </span>
                        </Tooltip>
                      );
                    }
                    
                    return menuItem;
                  })}
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
          onClose={() => {
            setMobileMenuAnchor(null);
            setMobileExpandedMenu(null);
          }}
          PaperProps={{ sx: { width: 280, mt: 1.5, maxHeight: '70vh' } }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {navItems.map((item) => {
            const submenuMap = {
              '/league': leagueSubmenu,
              '/rankings': rankingsSubmenu,
              '/schedule': scheduleSubmenu,
              '/alltime': alltimeSubmenu,
            };
            const submenu = submenuMap[item.path];
            const isExpanded = mobileExpandedMenu === item.path;

            return !item.hasSubmenu ? (
              <MenuItem 
                key={item.path} 
                onClick={() => {
                  const isDisabled = (item.requiresAuth && !isAuthenticated) || (item.requiresPremium && !isPremium);
                  if (!isDisabled) {
                    handleNavClick(item.path);
                  }
                }} 
                disabled={(item.requiresAuth && !isAuthenticated) || (item.requiresPremium && !isPremium)}
                sx={{ 
                  py: 2, 
                  px: 2.5,
                  gap: 2.5,
                  opacity: (item.requiresAuth && !isAuthenticated) || (item.requiresPremium && !isPremium) ? 0.5 : 1,
                }}
              >
                <Box sx={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconWrapper>{item.icon}</IconWrapper>
                </Box>
                <Typography fontWeight={600} fontSize="0.95rem">{item.label}</Typography>
                {((item.requiresAuth && !isAuthenticated) || (item.requiresPremium && !isPremium)) && (
                  <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary', fontSize: '0.7rem' }}>
                    Locked
                  </Typography>
                )}
              </MenuItem>
            ) : (
              <Box key={item.path}>
                <MenuItem 
                  onClick={() => setMobileExpandedMenu(isExpanded ? null : item.path)} 
                  sx={{ 
                    py: 2, 
                    px: 2.5,
                    gap: 2.5, 
                    fontWeight: 600,
                    bgcolor: isExpanded ? 'rgba(74,144,226,0.08)' : 'transparent',
                  }}
                >
                  <Box sx={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconWrapper>{item.icon}</IconWrapper>
                  </Box>
                  <Typography fontWeight={600} fontSize="0.95rem" sx={{ flex: 1 }}>
                    {item.label}
                  </Typography>
                  <ExpandMore 
                    sx={{ 
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                      fontSize: '1.5rem',
                    }} 
                  />
                </MenuItem>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                    {submenu.map((sub) => {
                      const isDisabled = (sub.requiresAuth && !isAuthenticated) || (sub.requiresPremium && !isPremium);
                      const isActive = location.pathname === sub.path;
                      const needsAuth = sub.requiresAuth && !isAuthenticated;
                      const needsPremium = sub.requiresPremium && !isPremium;
                      
                      return (
                        <MenuItem
                          key={sub.path}
                          onClick={() => !isDisabled && handleNavClick(sub.path)}
                          disabled={isDisabled}
                          sx={{ 
                            pl: 7, 
                            pr: 2.5,
                            py: 2, 
                            gap: 2.5,
                            bgcolor: isActive ? 'rgba(74,144,226,0.15)' : 'transparent',
                            borderLeft: isActive ? '3px solid #4a90e2' : '3px solid transparent',
                            opacity: isDisabled ? 0.5 : 1,
                            '&:hover': {
                              bgcolor: isDisabled ? 'transparent' : 'rgba(74,144,226,0.08)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem' }}>
                            {sub.icon}
                          </Box>
                          <Typography fontSize="0.9rem" fontWeight={isActive ? 600 : 400}>
                            {sub.label}
                          </Typography>
                          {isDisabled && (needsAuth ? sub.tooltip : needsPremium ? 'Premium' : '') && (
                            <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary', fontSize: '0.7rem' }}>
                              Locked
                            </Typography>
                          )}
                        </MenuItem>
                      );
                    })}
                  </Box>
                </Collapse>
              </Box>
            );
          })}
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