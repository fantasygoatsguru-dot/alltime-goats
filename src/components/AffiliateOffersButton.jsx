import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Popover,
  Typography,
  Link,
  Divider,
  Tooltip
} from '@mui/material';
import SportsBasketball from '@mui/icons-material/SportsBasketball';
import { fetchAffiliateLinks, recordAffiliateClick } from '../api';

const ANCHOR_OFFSET = 24;
const SESSION_CLICK_KEY = 'affiliateClicked';

const AffiliateOffersButton = () => {
  const [links, setLinks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // pulse-related state
  const [pulse, setPulse] = useState(false);
  const [clickedItem, setClickedItem] = useState(false); // stop pulse only when clicked
  const [hideButton, setHideButton] = useState(false);

  // Check session storage on mount
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_CLICK_KEY)) {
      setHideButton(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchAffiliateLinks().then((data) => {
      if (!cancelled && data?.length) {
        setLinks(data);
      }
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, []);

  // double pulse every 5s until user clicks an item
  useEffect(() => {
    if (clickedItem || hideButton) return;

    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1500); // animation duration
    }, 5000);

    return () => clearInterval(interval);
  }, [clickedItem, hideButton]);

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);

    // GA event: menu opened
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "affiliate_menu_open",
    });
  };

  const handleLinkClick = (item) => {
    recordAffiliateClick(item.id);
    setAnchorEl(null);
    setHideButton(true);
    setClickedItem(true); // stop pulse now
    sessionStorage.setItem(SESSION_CLICK_KEY, 'true');

    // GA event: affiliate link clicked
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "affiliate_link_click",
      affiliate_id: item.id,
      affiliate_url: item.url,
      affiliate_label: item.label,
    });
  };

  const open = Boolean(anchorEl);
  if (!loaded || links.length === 0 || hideButton) return null;

  return (
    <>
      {/* Floating Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: ANCHOR_OFFSET,
          right: ANCHOR_OFFSET,
          zIndex: 1200,
        }}
      >
        <Tooltip title="Recommended basketball-related items" arrow placement="left">
          <IconButton
            onClick={handleOpen}
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: 5,
              width: 60,
              height: 60,
              animation: pulse ? 'doublePulse 1.5s ease-out' : 'none',

              '@keyframes doublePulse': {
                '0%': { transform: 'scale(1)' },
                '20%': { transform: 'scale(1.25)' },
                '40%': { transform: 'scale(1)' },
                '60%': { transform: 'scale(1.22)' },
                '80%': { transform: 'scale(1)' },
                '100%': { transform: 'scale(1)' },
              },

              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: 7,
              },
            }}
          >
            <SportsBasketball />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 380,
              p: 2.25,
              borderRadius: 2.5,
            },
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Recommended Gear
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Fantasy Goats is a self-funded project. If you’re already shopping on Amazon,
          starting from these links helps support us at no extra cost.
        </Typography>

        <Divider sx={{ mb: 1.5 }} />

        {/* Items */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {links.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              color="inherit"
              onClick={() => handleLinkClick(item)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1.5,
                borderRadius: 2,
                transition: 'background-color 0.15s ease',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              {item.thumbnail_url && (
                <Box
                  component="img"
                  src={item.thumbnail_url}
                  alt={item.label}
                  sx={{
                    width: 72,
                    height: 72,
                    objectFit: 'contain',
                    borderRadius: 1.5,
                    bgcolor: '#fff',
                    flexShrink: 0,
                  }}
                />
              )}

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {item.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  View on Amazon →
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 2 }}
        >
          As an Amazon Associate, we earn from qualifying purchases.
        </Typography>
      </Popover>
    </>
  );
};

export default AffiliateOffersButton;
