import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { Email, Share, Coffee } from '@mui/icons-material';
import YahooIcon from "../assets/yahoo.svg";
import { useNavigate } from 'react-router-dom';

const About = () => {
  const [copySuccess, setCopySuccess] = useState('');
  const navigate = useNavigate();

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText('http://fantasygoats.guru/')
      .then(() => {
        setCopySuccess('Link copied! 🎉');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(() => {
        setCopySuccess('Oops, failed to copy.');
      });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        py: 4,
        bgcolor: '#777C6D',
        fontFamily: '"Poppins", "Roboto", sans-serif',
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: 'white',
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          About Fantasy Goats Guru 🐐
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'grey.400',
            maxWidth: '800px',
            mx: 'auto',
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.8,
            mb: 3
          }}
        >
          Welcome to Fantasy Goats Guru – We're a passion project to help people win and research fantasy basketball.
        </Typography>

      </Box>

      {/* Support Section */}
      <Box
        sx={{
          textAlign: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          p: 4
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 600,
            color: 'white',
            mb: 2,
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          Keep us going! ✨
        </Typography>

        <Typography
          variant="h6"
          sx={{ color: 'grey.300', maxWidth: '600px', mx: 'auto', mb: 4, fontWeight: 400 }}
        >
          Fantasy Goats Guru is an independent passion project. Your support keeps us going!
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {/* Card 1: Send us a review */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                bgcolor: '#4FC3F7',
                borderRadius: 3,
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)' },
              }}
            >
              <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                <Email sx={{ fontSize: 50, mb: 2, color: 'white' }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Send Us a Review
                </Typography>
                <Typography variant="body1">
                  Any feedback, bad or good, possible new feature suggestions, or just want to say hi!
                  fantasygoatsguru@gmail.com
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'white',
                    color: '#4FC3F7',
                    '&:hover': { bgcolor: 'grey.100' },
                    borderRadius: 2,
                    px: 3,
                  }}
                  startIcon={<Email />}
                  href="mailto:fantasygoatsguru@gmail.com?subject=Love%20for%20Fantasy%20Goats%20Guru&body=Hey%20Team,%0D%0AJust%20wanted%20to%20share%20some%20thoughts%20about%20Fantasy%20Goats%20Guru:%0D%0A"
                  target="_blank"
                >
                  Share Feedback
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Card 2: Share with a friend */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                bgcolor: '#4CAF50',
                borderRadius: 3,
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)' },
              }}
            >
              <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                <Share sx={{ fontSize: 50, mb: 2, color: 'white' }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Share with a Friend
                </Typography>
                <Typography variant="body1">
                  Invite your friends to take a look!
                </Typography>
                {copySuccess && (
                  <Typography variant="caption" sx={{ color: 'white', mt: 1, fontStyle: 'italic' }}>
                    {copySuccess}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'white',
                    color: '#4CAF50',
                    '&:hover': { bgcolor: 'grey.100' },
                    borderRadius: 2,
                    px: 3,
                  }}
                  startIcon={<Share />}
                  onClick={handleCopyLink}
                >
                  Copy Link
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Card 3: Buy me a coffee */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                bgcolor: '#FFCA28',
                borderRadius: 3,
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)' },
              }}
            >
              <CardContent sx={{ textAlign: 'center', color: 'black' }}>
                <Coffee sx={{ fontSize: 50, mb: 2, color: 'black' }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Buy Me a Coffee
                </Typography>
                <Typography variant="body1">
                  Fuel our fantasy dreams! Your support keeps the goats galloping.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'black',
                    color: '#FFCA28',
                    '&:hover': { bgcolor: 'grey.900' },
                    borderRadius: 2,
                    px: 3,
                  }}
                  startIcon={<Coffee />}
                  href="https://buymeacoffee.com/fantasygoatsguru"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Treat Us
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>


        {/* Partnered with section */}
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: 'grey.400',
              fontWeight: 500,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontSize: '0.9rem'
            }}
          >
            Partnered with
          </Typography>

          <Button
            href="https://yahoo-fantasytoys.up.railway.app/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: 'white',
              textTransform: 'none',
              fontSize: '1.3rem',
              fontWeight: 600,
              py: 1.2,
              px: 4,
              borderRadius: 50,
              bgcolor: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.15)',
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              }
            }}
          >
            {YahooIcon && (
              <img
                src={YahooIcon}
                alt="Yahoo"
                style={{ height: '36px', width: 'auto' }}
              />
            )}
            Yahoo Fantasy Toys
          </Button>
        </Box>
    </Container>
  );
};

export default About;