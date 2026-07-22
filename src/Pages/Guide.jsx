import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container, Chip, Button, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import { guideBySlug, categoryByKey } from '../config/guides-content';
import CategoryStrip from '../components/CategoryStrip';
import PuntRankingTable from '../components/PuntRankingTable';
import TeamRadar from '../components/TeamRadar';
import DraftBuilder from '../components/DraftBuilder';

function SectionHeading({ id, children }) {
  return (
    <Typography
      id={id}
      variant="h2"
      sx={{
        scrollMarginTop: '90px',
        fontWeight: 900,
        fontSize: { xs: '1.5rem', md: '1.8rem' },
        letterSpacing: -0.6,
        color: '#0f2340',
        mt: 5,
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );
}

export default function Guide() {
  const { slug } = useParams();
  const guide = guideBySlug[slug];

  if (!guide) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f2340' }}>Guide not found</Typography>
        <Button component={RouterLink} to="/guides" sx={{ textTransform: 'none' }}>← Back to all guides</Button>
      </Box>
    );
  }

  const punt = categoryByKey[guide.puntKey];
  const sections = guide.sections || [];

  // Table of contents: authored sections + the fixed blocks we always render.
  const toc = [
    ...sections.map((s) => ({ id: s.id, label: s.heading })),
    { id: 'board', label: 'Live draft board' },
    ...(guide.roundTargets ? [{ id: 'mock-draft', label: 'Round-by-round draft' }] : []),
    ...(guide.buildingBlocks ? [{ id: 'blocks', label: 'Building blocks' }] : []),
    ...(guide.exampleTeams ? [{ id: 'examples', label: 'Example teams' }] : []),
    ...(guide.faqs ? [{ id: 'faq', label: 'FAQ' }] : []),
  ];

  return (
    <Box sx={{ bgcolor: '#f5f6f8', minHeight: '100vh', pb: 10 }}>
      {/* Hero */}
      <Box sx={{ bgcolor: '#0f2340', color: '#fff', px: 3, py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Button
            component={RouterLink}
            to="/guides"
            sx={{ color: '#8fb4ff', textTransform: 'none', px: 0, mb: 2, '&:hover': { bgcolor: 'transparent', color: '#fff' } }}
          >
            ← All guides
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Chip
              label={guide.season}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}
            />
            <Chip
              label={guide.difficulty}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}
            />
            <Chip
              label={guide.isPremium ? 'Premium' : 'Free'}
              size="small"
              icon={guide.isPremium ? <LockOutlinedIcon sx={{ fontSize: '0.85rem !important', color: '#fff !important' }} /> : undefined}
              sx={{ bgcolor: guide.isPremium ? '#c0392b' : '#27ae60', color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}
            />
          </Box>

          <Typography
            sx={{ fontWeight: 900, fontSize: { xs: '2.4rem', md: '3.4rem' }, letterSpacing: -2, lineHeight: 1, mb: 2 }}
          >
            {guide.title}
          </Typography>
          <Typography sx={{ color: '#b9c4d6', fontSize: { xs: '1rem', md: '1.15rem' }, maxWidth: 620, lineHeight: 1.5, mb: 3 }}>
            {guide.tagline}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-end' }}>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', letterSpacing: 1.5, textTransform: 'uppercase', color: '#8595ad', mb: 0.8 }}>
                Category profile
              </Typography>
              <CategoryStrip puntKey={guide.puntKey} strengths={guide.strengths} weaknesses={guide.weaknesses} size="md" />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2.5, color: '#8595ad', fontSize: '0.82rem' }}>
            <SportsBasketballIcon sx={{ fontSize: 16, color: '#d9534f' }} />
            <span>
              Punting <strong style={{ color: '#ff8a80', textDecoration: 'line-through' }}>{punt?.name}</strong> — everything below is re-ranked with it removed.
            </span>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '220px 1fr' }, gap: { xs: 0, md: 5 } }}>
          {/* Sticky TOC */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 90 }}>
              <Typography sx={{ fontSize: '0.7rem', letterSpacing: 1.5, textTransform: 'uppercase', color: '#98a2b1', fontWeight: 700, mb: 1.5 }}>
                On this page
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, borderLeft: '2px solid #e2e6ec', pl: 2 }}>
                {toc.map((t) => (
                  <Box
                    key={t.id}
                    component="a"
                    href={`#${t.id}`}
                    sx={{
                      textDecoration: 'none',
                      color: '#5a6472',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      py: 0.4,
                      '&:hover': { color: '#2f80ed' },
                    }}
                  >
                    {t.label}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Body */}
          <Box sx={{ maxWidth: 760 }}>
            {sections.map((s) => (
              <Box key={s.id}>
                <SectionHeading id={s.id}>{s.heading}</SectionHeading>
                {s.body.map((para, i) => (
                  <Typography key={i} sx={{ color: '#2c3440', fontSize: '1.02rem', lineHeight: 1.7, mb: 2 }}>
                    {para}
                  </Typography>
                ))}
              </Box>
            ))}

            {/* Live draft board */}
            <SectionHeading id="board">Live draft board</SectionHeading>
            <Typography sx={{ color: '#2c3440', fontSize: '1.02rem', lineHeight: 1.7, mb: 2.5 }}>
              Every player, re-ranked for this build. The{' '}
              <strong style={{ color: '#c0392b', textDecoration: 'line-through' }}>{punt?.label}</strong> column is struck out and
              pulled from the Value total — sort and draft straight off it.
            </Typography>
            <PuntRankingTable puntKey={guide.puntKey} />

            {/* Round-by-round mock draft */}
            {guide.roundTargets && (
              <>
                <SectionHeading id="mock-draft">Round-by-round draft</SectionHeading>
                <Typography sx={{ color: '#2c3440', fontSize: '1.02rem', lineHeight: 1.7, mb: 2.5 }}>
                  Draft your own punt-{punt?.name.toLowerCase()} team. Add any players you like — as many per
                  round as you want — and the floating panel tracks your team's radar (against an average
                  opponent), cumulated per-game totals and category analysis, live from this season's numbers.
                </Typography>
                <DraftBuilder rounds={guide.roundTargets} puntKey={guide.puntKey} />
              </>
            )}

            {/* Building blocks */}
            {guide.buildingBlocks && (
              <>
                <SectionHeading id="blocks">First-round building blocks</SectionHeading>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {guide.buildingBlocks.map((b, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2,
                        bgcolor: '#fff',
                        border: '1px solid #e6e9ee',
                        borderRadius: 2,
                        borderLeft: '4px solid #2f80ed',
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: '#0f2340', fontSize: '0.98rem' }}>{b.name}</Typography>
                        <Typography sx={{ color: '#5a6472', fontSize: '0.88rem', mt: 0.3 }}>{b.note}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {/* Example teams — premium teaser */}
            {guide.exampleTeams && (
              <>
                <SectionHeading id="examples">Example teams</SectionHeading>

                {guide.isPremium ? (
                  // Premium guides keep the roster blueprints gated.
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' }}>
                      {guide.exampleTeams.map((t, i) => (
                        <Box key={i} sx={{ p: 2.5, bgcolor: '#fff', border: '1px solid #e6e9ee', borderRadius: 2 }}>
                          <Typography sx={{ fontWeight: 800, color: '#0f2340' }}>{t.name}</Typography>
                          <Typography sx={{ color: '#5a6472', fontSize: '0.9rem', mt: 0.5 }}>{t.note}</Typography>
                        </Box>
                      ))}
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        background: 'linear-gradient(180deg, rgba(245,246,248,0.5) 0%, rgba(245,246,248,0.95) 70%)',
                        borderRadius: 2,
                      }}
                    >
                      <LockOutlinedIcon sx={{ color: '#0f2340', fontSize: 30 }} />
                      <Typography sx={{ fontWeight: 800, color: '#0f2340', fontSize: '1.05rem', textAlign: 'center' }}>
                        Championship-tested example rosters
                      </Typography>
                      <Typography sx={{ color: '#667', fontSize: '0.88rem', textAlign: 'center', maxWidth: 360 }}>
                        Full build blueprints — draft-slot by draft-slot — are part of Goats Premium.
                      </Typography>
                      <Button
                        sx={{ mt: 0.5, textTransform: 'none', fontWeight: 700, bgcolor: '#0f2340', color: '#fff', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#1b3a63' } }}
                      >
                        Unlock with Premium
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  // Free guides: full rosters + live strengths/weaknesses radar.
                  <>
                    <TeamRadar teams={guide.exampleTeams} />
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                        gap: 2,
                        mt: 2.5,
                      }}
                    >
                      {guide.exampleTeams.map((t, i) => (
                        <Box key={i} sx={{ p: 2.5, bgcolor: '#fff', border: '1px solid #e6e9ee', borderRadius: 2, borderTop: `4px solid ${t.color || '#2f80ed'}` }}>
                          <Typography sx={{ fontWeight: 800, color: '#0f2340', fontSize: '1.05rem' }}>{t.name}</Typography>
                          <Typography sx={{ color: '#5a6472', fontSize: '0.88rem', mt: 0.5, mb: 1.5 }}>{t.note}</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                            {(t.roster || []).map((p) => (
                              <Chip key={p} label={p} size="small" sx={{ bgcolor: '#f1f4f8', color: '#2c3440', fontWeight: 600, fontSize: '0.72rem' }} />
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </>
            )}

            {/* FAQ */}
            {guide.faqs && (
              <>
                <SectionHeading id="faq">FAQ</SectionHeading>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {guide.faqs.map((f, i) => (
                    <Box key={i}>
                      <Typography sx={{ fontWeight: 800, color: '#0f2340', fontSize: '1rem', mb: 0.6 }}>{f.q}</Typography>
                      <Typography sx={{ color: '#2c3440', fontSize: '0.96rem', lineHeight: 1.6 }}>{f.a}</Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}

            <Divider sx={{ my: 5 }} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button component={RouterLink} to="/rankings" sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#2f80ed', color: '#fff', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#256fd0' } }}>
                Build this in the Rankings tool →
              </Button>
              <Button component={RouterLink} to="/guides" sx={{ textTransform: 'none', fontWeight: 600, color: '#0f2340', borderRadius: 2, px: 3, border: '1px solid #cbd3de' }}>
                Browse more guides
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
