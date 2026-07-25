import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PurchaseSuccess = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      <CheckCircle sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
        Thanks for your purchase!
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
        Your pass is being activated on your account — this usually takes just a few seconds.
        Head over to your tools to get started.
      </Typography>
      <Button variant="contained" size="large" onClick={() => navigate('/matchup')} sx={{ borderRadius: 2 }}>
        Go to My Tools
      </Button>
    </Container>
  );
};

export default PurchaseSuccess;
