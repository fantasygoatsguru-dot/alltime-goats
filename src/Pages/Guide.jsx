import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container, Chip, Button, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import { guideBySlug, categoryByKey, guideAccess, isGuideUnlocked, ACCESS_BADGE, GATED_CLASS } from '../config/guides-content';
import CategoryStrip from '../components/CategoryStrip';
import RankingTable from '../components/RankingTable';
import ProjectionList from '../components/ProjectionList';
import PlayerNotes from '../components/PlayerNotes';
import { PRIOR_SEASON, YAHOO_MARKET_DATE } from '../config/top-150-2026-27';
import { SLEEPERS, BUSTS } from '../config/sleepers-busts-2026-27';
import TeamRadar from '../components/TeamRadar';
import DraftBuilder from '../components/DraftBuilder';
import { useEntitlements } from '../hooks/useEntitlements';
import { useAuth } from '../contexts/AuthContext';
import AdSlot from '../components/AdSlot';
import { AD_SLOTS } from '../config/ads';

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

// One in-article unit, plus the rule about where guide ads are allowed — kept
// in one place so the call sites below cannot drift apart. It is also handed to
// ProjectionList / PlayerNotes as their `renderInterstitial`, which is what
// spaces ads through the board: the board is most of a long guide's height, so
// ads placed only around it leave everything below the fold empty.
//
// Free guides only. On a premium guide a non-payer is looking at the locked
// teaser and an upsell, and an ad beside our own pass pitch competes with it —
// the same reason config/ads.js keeps ads off /pricing. A premium guide the
// reader HAS unlocked needs no check here: AdSlot already renders null for
// pass holders, and null while entitlements resolve, so nobody who paid ever
// sees a flash of ads.
function GuideAd({ guide, gateVisible }) {
  if (guide.isPremium || gateVisible) return null;
  return <AdSlot slot={AD_SLOTS.guideInArticle} layout="in-article" />;
}

// What a reader gets for the pass, stated plainly and counted off the guide's
// own config rather than hand-written per page — a list that drifts from what
// is actually behind it is worse than no list.
function Paywall({ guide, hiddenSections }) {
  const rounds = guide.roundTargets?.length || 0;
  const picks = (guide.roundTargets || []).reduce((n, r) => n + r.candidates.length, 0);

  const items = [
    hiddenSections > 0 && `${hiddenSections} more section${hiddenSections === 1 ? '' : 's'} of strategy`,
    rounds > 0 && `${rounds} rounds of draft targets — ${picks} players, with the case for each`,
    guide.buildingBlocks && 'The archetypes the build is assembled from',
    guide.exampleTeams && 'Two full example rosters, with the live category radar',
    'The complete re-ranked draft board',
  ].filter(Boolean);

  return (
    <Box
      className={GATED_CLASS}
      sx={{
        mt: 4,
        p: { xs: 2.5, md: 3.5 },
        bgcolor: '#fff',
        border: '1px solid #e6e9ee',
        borderRadius: 2.5,
        borderTop: '4px solid #2f80ed',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <LockOutlinedIcon sx={{ color: '#2f80ed', fontSize: 20 }} />
        <Typography sx={{ fontWeight: 900, color: '#0f2340', fontSize: '1.15rem' }}>
          The rest of this build
        </Typography>
      </Box>
      <Typography sx={{ color: '#5a6472', fontSize: '0.95rem', lineHeight: 1.6, mb: 2 }}>
        You have read the strategy. The part that wins the draft — who to take, and when — comes with a
        Draft Pass.
      </Typography>
      <Box component="ul" sx={{ m: 0, mb: 2.5, pl: 2.5, color: '#2c3440' }}>
        {items.map((t) => (
          <Typography component="li" key={t} sx={{ fontSize: '0.95rem', lineHeight: 1.9 }}>
            {t}
          </Typography>
        ))}
      </Box>
      <Button
        component={RouterLink}
        to="/pricing"
        sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0f2340', color: '#fff', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#1b3a63' } }}
      >
        Unlock with Draft Pass
      </Button>
    </Box>
  );
}

export default function Guide({ onRequireSignIn }) {
  const { slug } = useParams();
  const guide = guideBySlug[slug];
  const { hasPass } = useEntitlements();
  // ⚠️ isSignedIn is the Supabase account, NOT isAuthenticated (which means
  // "Yahoo is connected"). A login-gated guide must open for anyone with an
  // account, whether or not they have ever touched Yahoo.
  const { isSignedIn } = useAuth();
  // Which key opens this guide is decided in guides-content.js, so a tier and
  // its unlock condition cannot drift apart here.
  const unlocked = guide
    ? isGuideUnlocked(guide, { isSignedIn, hasDraftPass: hasPass('draft') })
    : false;

  if (!guide) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f2340' }}>Guide not found</Typography>
        <Button component={RouterLink} to="/guides" sx={{ textTransform: 'none' }}>← Back to all guides</Button>
      </Box>
    );
  }

  const punt = categoryByKey[guide.puntKey];
  const access = guideAccess(guide);
  const badge = ACCESS_BADGE[access];
  // A gate is on screen — either the sign-in ask or the pass pitch. Used to keep
  // ads away from it, on the same reasoning GuideAd already applies to premium.
  const gateVisible = access !== 'free' && !unlocked;
  const sections = guide.sections || [];
  const board = guide.board || {};

  // A premium guide shows its opening section(s) to everyone and holds the rest
  // back. Everything the reader is actually buying — the remaining prose, the
  // round-by-round targets, the building blocks and the example rosters — is
  // behind this flag; the board gates itself through board.freeLimit, and the
  // FAQs stay public on purpose because structured-data.js emits them as FAQ
  // JSON-LD, so hiding them while serving them to crawlers would be cloaking.
  const locked = Boolean(guide.isPremium) && !unlocked;
  const visibleSections = locked ? sections.slice(0, guide.freeSections ?? 1) : sections;
  const hiddenSections = sections.length - visibleSections.length;

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
            {/* Same derived badge as the hub cards — see guideAccess() in
                config/guides-content.js. "Free" means the whole page, not the
                part of it you can see before the ask. */}
            <Chip
              label={badge.label}
              size="small"
              icon={badge.locked ? <LockOutlinedIcon sx={{ fontSize: '0.85rem !important', color: '#fff !important' }} /> : undefined}
              sx={{ bgcolor: badge.color, color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}
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

          {access === 'premium' && !unlocked && (
            <Button
              component={RouterLink}
              to="/pricing"
              startIcon={<LockOutlinedIcon sx={{ fontSize: '1rem !important' }} />}
              sx={{ mb: 3, textTransform: 'none', fontWeight: 700, bgcolor: '#2f80ed', color: '#fff', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#256fd0' } }}
            >
              Unlock with Draft Pass
            </Button>
          )}

          {access === 'login' && !unlocked && (
            <Button
              onClick={() => onRequireSignIn?.()}
              startIcon={<LockOutlinedIcon sx={{ fontSize: '1rem !important' }} />}
              sx={{ mb: 3, textTransform: 'none', fontWeight: 700, bgcolor: '#16a085', color: '#fff', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#12856f' } }}
            >
              Sign in to read it all — free
            </Button>
          )}

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
            {punt ? (
              <span>
                Punting <strong style={{ color: '#ff8a80', textDecoration: 'line-through' }}>{punt.name}</strong> — everything below is re-ranked with it removed.
              </span>
            ) : (
              <span>
                Projected for {guide.season} —{' '}
                {guide.playerNotes ? (
                  <>
                    <strong style={{ color: '#8fb4ff' }}>value against draft price</strong>, scored across all nine
                    categories.
                  </>
                ) : guide.slug === 'top-150' ? (
                  <>
                    <strong style={{ color: '#8fb4ff' }}>nine-category draft value</strong>, with punt-dependent players priced for their best build.
                  </>
                ) : (
                  <>
                    no punt, all <strong style={{ color: '#8fb4ff' }}>nine categories</strong> weighted equally.
                  </>
                )}
              </span>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pt: { xs: 3, md: 5 } }}>
          {/* Body — full width now that the TOC is gone */}
          <Box>
            {visibleSections.map((s) => (
              <Box key={s.id}>
                <SectionHeading id={s.id}>{s.heading}</SectionHeading>
                {s.body.map((para, i) => (
                  <Typography key={i} sx={{ color: '#2c3440', fontSize: '1.02rem', lineHeight: 1.7, mb: 2 }}>
                    {para}
                  </Typography>
                ))}
              </Box>
            ))}

            {locked && <Paywall guide={guide} hiddenSections={hiddenSections} />}

            {/* First unit, at the seam between the prose and the board. Nothing
                is placed inside the prose: free guides run only 3-4 short
                sections, so an in-prose unit landed barely a screen above this
                one and both read as a single block of ads at the top. */}
            <GuideAd guide={guide} gateVisible={gateVisible} />

            {/* The board: an authored projection or write-up list for rankings
                guides, the live re-ranked z-score table for punt builds. */}
            {guide.playerNotes ? (
              <>
                <SectionHeading id="board">{guide.playerNotes.heading}</SectionHeading>
                <Typography sx={{ color: '#2c3440', fontSize: '1.02rem', lineHeight: 1.7, mb: 2.5 }}>
                  {guide.playerNotes.lead}
                </Typography>
                <PlayerNotes
                  renderInterstitial={() => <GuideAd guide={guide} gateVisible={gateVisible} />}
                  players={guide.playerNotes.source === 'busts' ? BUSTS : SLEEPERS}
                  accent={guide.playerNotes.accent}
                  freeLimit={guide.playerNotes.freeLimit}
                  previewRows={guide.playerNotes.previewRows}
                  lockedLabel={guide.playerNotes.source === 'busts' ? 'every bust case' : 'every sleeper'}
                  unlocked={unlocked}
                  unlockWith={access === 'login' ? 'login' : 'pass'}
                  onRequireSignIn={onRequireSignIn}
                />
              </>
            ) : guide.projection ? (
              <>
                <SectionHeading id="board">Projected Top 150 for {guide.season}</SectionHeading>
                <Typography sx={{ color: '#2c3440', fontSize: '1.02rem', lineHeight: 1.7, mb: 2.5 }}>
                  These 2026–27 ranks use corrected {PRIOR_SEASON} production, then account for role, team,
                  age and availability. The stat pills show actual {PRIOR_SEASON} results; ADP and pre-rank
                  are Yahoo draft-market snapshots from {YAHOO_MARKET_DATE}. Check the{' '}
                  <a href="https://basketball.fantasysports.yahoo.com/nba/draftanalysis" target="_blank" rel="noopener noreferrer">current Yahoo ADP</a>
                  {' '}and{' '}
                  <a href="https://basketball.fantasysports.yahoo.com/nba/public_prerank" target="_blank" rel="noopener noreferrer">public pre-rank</a>
                  {' '}before your draft. Team changes are checked against the{' '}
                  <a href="https://www.nba.com/news/nba-offseason-deals-2026" target="_blank" rel="noopener noreferrer">NBA offseason deals tracker</a>.
                </Typography>
                <ProjectionList
                  renderInterstitial={() => <GuideAd guide={guide} gateVisible={gateVisible} />}
                  freeLimit={guide.projection.freeLimit}
                  previewRows={guide.projection.previewRows}
                  unlocked={unlocked}
                />
              </>
            ) : (
              <>
                <SectionHeading id="board">Live draft board</SectionHeading>
                <Typography sx={{ color: '#2c3440', fontSize: '1.02rem', lineHeight: 1.7, mb: 2.5 }}>
                  Every player, re-ranked for this build. The{' '}
                  <strong style={{ color: '#c0392b', textDecoration: 'line-through' }}>{punt?.label}</strong> column is struck out
                  and pulled from the Value total — sort and draft straight off it.
                </Typography>
                <RankingTable
                  puntKey={guide.puntKey}
                  season={board.dataSeason}
                  limit={board.limit}
                  minGames={board.minGames}
                  freeLimit={board.freeLimit}
                  previewRows={board.previewRows}
                  unlocked={unlocked}
                />
              </>
            )}

            {/* Round-by-round mock draft — the core of a paid punt guide. */}
            {guide.roundTargets && !locked && (
              <>
                <GuideAd guide={guide} gateVisible={gateVisible} />
                <SectionHeading id="mock-draft">Round-by-round draft</SectionHeading>
                <Typography sx={{ color: '#2c3440', fontSize: '1.02rem', lineHeight: 1.7, mb: 2.5 }}>
                  Draft your own punt-{punt?.name.toLowerCase()} team. Add any players you like — as many per
                  round as you want — and the Your Team panel tracks your radar (against an average opponent),
                  cumulated per-game totals and category analysis, live from this season's numbers.
                </Typography>
                <DraftBuilder rounds={guide.roundTargets} puntKey={guide.puntKey} />
              </>
            )}

            {/* Building blocks */}
            {guide.buildingBlocks && !locked && (
              <>
                <SectionHeading id="blocks">{guide.buildingBlocksHeading || 'First-round building blocks'}</SectionHeading>
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
                <GuideAd guide={guide} gateVisible={gateVisible} />
                <SectionHeading id="examples">Example teams</SectionHeading>

                {guide.isPremium && !unlocked ? (
                  // Premium guides keep the roster blueprints gated until a Draft Pass is purchased.
                  <Box className={GATED_CLASS} sx={{ position: 'relative' }}>
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
                        component={RouterLink}
                        to="/pricing"
                        sx={{ mt: 0.5, textTransform: 'none', fontWeight: 700, bgcolor: '#0f2340', color: '#fff', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#1b3a63' } }}
                      >
                        Unlock with Draft Pass
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
                <GuideAd guide={guide} gateVisible={gateVisible} />
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
      </Container>
    </Box>
  );
}
