import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container, Chip } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { guideGroups, CURRENT_GUIDE_SEASON } from '../config/guides-content';
import CategoryStrip from '../components/CategoryStrip';

const difficultyColor = {
  Beginner: '#27ae60',
  Intermediate: '#e0a800',
  Advanced: '#c0392b',
};

function GuideCard({ guide }) {
  return (
    <Box
      component={RouterLink}
      to={`/guides/${guide.slug}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        p: 2.5,
        textDecoration: 'none',
        bgcolor: '#fff',
        border: '1px solid #e6e9ee',
        borderRadius: 2.5,
        transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 14px 30px rgba(15,35,64,0.12)',
          borderColor: '#c9d3e0',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography
          sx={{ fontWeight: 900, fontSize: '1.35rem', letterSpacing: -0.5, color: '#0f2340', lineHeight: 1.1 }}
        >
          {guide.title}
        </Typography>
        {guide.isPremium ? (
          <Chip
            icon={<LockOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />}
            label="Premium"
            size="small"
            sx={{ bgcolor: '#0f2340', color: '#fff', fontWeight: 700, fontSize: '0.68rem', height: 22 }}
          />
        ) : (
          <Chip
            label="Free"
            size="small"
            sx={{ bgcolor: '#27ae60', color: '#fff', fontWeight: 700, fontSize: '0.68rem', height: 22 }}
          />
        )}
      </Box>

      <Typography sx={{ color: '#5a6472', fontSize: '0.86rem', lineHeight: 1.45, minHeight: 38 }}>
        {guide.tagline}
      </Typography>

      <CategoryStrip puntKey={guide.puntKey} strengths={guide.strengths} weaknesses={guide.weaknesses} size="sm" />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: difficultyColor[guide.difficulty] || '#999',
          }}
        />
        <Typography sx={{ fontSize: '0.74rem', color: '#78828f', fontWeight: 600 }}>
          {guide.difficulty}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Guides() {
  return (
    <Box sx={{ bgcolor: '#f5f6f8', minHeight: '100vh', pb: 8 }}>
      {/* Hero */}
      <Box
        sx={{
          bgcolor: '#0f2340',
          color: '#fff',
          px: 3,
          py: { xs: 5, md: 7 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            sx={{
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#7fb0ff',
              mb: 1.5,
            }}
          >
            {CURRENT_GUIDE_SEASON} Strategy Guides
          </Typography>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.1rem', md: '3rem' },
              letterSpacing: -1.5,
              lineHeight: 1.05,
              mb: 2,
            }}
          >
            Build a winner one category at a time.
          </Typography>
          <Typography sx={{ color: '#b9c4d6', fontSize: '1rem', maxWidth: 560, mx: 'auto', lineHeight: 1.5 }}>
            Start from the unpunted top 150, then pick a build. Every guide is paired with a live
            draft board straight from the z-score engine.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 } }}>
        {guideGroups.map((group) => (
          <Box key={group.id} sx={{ mb: 6 }}>
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: -0.5, color: '#0f2340' }}>
                {group.title}
              </Typography>
              <Typography sx={{ color: '#5a6472', fontSize: '0.92rem', mt: 0.5 }}>
                {group.blurb}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 2.5,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
              }}
            >
              {group.guides.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </Box>
          </Box>
        ))}
      </Container>
    </Box>
  );
}
