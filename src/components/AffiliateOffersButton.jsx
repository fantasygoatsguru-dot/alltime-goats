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
import { fetchAffiliateLinks } from '../api';

const ANCHOR_OFFSET = 24;

const AffiliateOffersButton = () => {
  const [links, setLinks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAffiliateLinks().then((data) => {
      if (!cancelled && data && data.length > 0) {
        setLinks(data);
      }
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (!loaded || links.length === 0) return null;

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
        <Tooltip title="Support Fantasy Goats ❤️" arrow placement="left">
          <IconButton
            aria-label="Affiliate offers"
            onClick={handleOpen}
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: 4,
              width: 56,
              height: 56,
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: 6,
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
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              p: 2,
              borderRadius: 2,
            },
          },
        }}
      >
        <Typography variant="h9" gutterBottom>
          Support Fantasy Goats by checking out these picks
        </Typography>
        <Divider sx={{ mb: 1.5 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {links.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              color="inherit"
              onClick={handleClose}
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
              {/* Thumbnail */}
              {item.thumbnail_url && (
                <Box
                  component="img"
                  src={item.thumbnail_url}
                  alt={item.label}
                  sx={{
                    width: 64,
                    height: 64,
                    objectFit: 'contain',
                    borderRadius: 1,
                    bgcolor: '#fff',
                    flexShrink: 0,
                  }}
                />
              )}

              {/* Text */}
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
