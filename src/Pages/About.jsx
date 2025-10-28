import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, CardActions, Typography, Button, Box, Collapse, IconButton } from '@mui/material';
import { Email, Share, Coffee, ExpandMore } from '@mui/icons-material';
import YahooIcon from "../assets/yahoo.svg";
import { useNavigate } from 'react-router-dom';

const About = () => {
  const [copySuccess, setCopySuccess] = useState('');
  const [expanded, setExpanded] = useState(true );
  const navigate = useNavigate();

  // Function to handle copying the link
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
        py: 2,
        bgcolor: 'black', // Black background for the app
        fontFamily: '"Poppins", "Roboto", sans-serif', // Friendly font
      }}
    >

      {/* Collapsible Support Section */}
      <Box 
        sx={{ 
          textAlign: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.15)',
          }
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ 
              fontWeight: 600, 
              color: 'white',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Keep us going! 🐐✨
          </Typography>
          <IconButton 
            sx={{ 
              color: 'white',
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s ease'
            }}
          >
            <ExpandMore />
          </IconButton>
        </Box>
        
        <Collapse in={expanded}>
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ color: 'grey.300', maxWidth: '600px', mx: 'auto', mb: 4, fontWeight: 400 }}
            >
              Fantasy Goats Guru is an independently passion project. Your support keeps us going!
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              {/* Card 1: Send us a review (Blue) */}
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
                      Any feedback, bad good, possible new feature suggestions, or just want to say hi!
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

              {/* Card 2: Share with a friend (Green) */}
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

              {/* Card 3: Buy me a coffee (Yellow) */}
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
        </Collapse>
      </Box>
    </Container>
  );
};

export default About;