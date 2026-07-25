import React from 'react';
import { Container, Grid, Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { PASSES, buildCheckoutUrl } from '../config/passes';

const ACCENT = '#4a90e2';

const Pricing = ({ onRequireSignIn }) => {
  const { authUser, isSignedIn } = useAuth();

  const handleBuy = (pass) => {
    if (!isSignedIn) {
      onRequireSignIn?.();
      return;
    }
    window.location.href = buildCheckoutUrl(pass.checkoutUrl, {
      authUserId: authUser.id,
      email: authUser.email,
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4"  component="h1" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary' }}>
          Passes
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Draft-day prep, in-season tools, or both — pick what fits your season.
        </Typography>
      </Box>

      <Grid container spacing={2.5} alignItems="stretch">
        {PASSES.map((pass) => (
          <Grid item xs={12} sm={4} key={pass.id}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                borderColor: pass.highlight ? ACCENT : 'divider',
                borderWidth: pass.highlight ? 2 : 1,
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {pass.highlight && (
                  <Chip label="Best Value" size="small" sx={{ bgcolor: ACCENT, color: 'white', fontWeight: 600, mb: 1.5 }} />
                )}
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{pass.name}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>{pass.tagline}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
                  ${pass.price}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {pass.description}
                </Typography>
                {pass.features.map((feature) => (
                  <Box key={feature} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.75 }}>
                    <CheckCircle sx={{ fontSize: 16, color: ACCENT, mt: 0.4, flexShrink: 0 }} />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant={pass.highlight ? 'contained' : 'outlined'}
                  onClick={() => handleBuy(pass)}
                  sx={{ borderRadius: 1.5, fontWeight: 600 }}
                >
                  Get {pass.name}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!isSignedIn && (
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
          You'll need to sign in first so we can attach your pass to your account.
        </Typography>
      )}
    </Container>
  );
};

export default Pricing;
