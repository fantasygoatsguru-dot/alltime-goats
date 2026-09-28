import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Chip, Button, CircularProgress, Collapse, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { supabase, CURRENT_SEASON } from '../utils/supabase';
import { CATEGORIES, categoryByKey } from '../config/guides-content';
import RadarView from './RadarView';

const TEAM_COLOR = '#2f80ed';
const AVG_COLOR = '#8b93a1';
// A typical rostered team ≈ a 12-team, 13-man league's worth of players. The
// mean z across this pool is the reference an actual opponent looks like —
// far more useful than z = 0 (which is the average of everyone, scrubs included).
const AVG_POOL_SIZE = 156;

// Cumulated-stats layout (per-game team line). Counting cats are summed;
// FG%/FT% are aggregated from made/attempted.
const CUM_ROWS = [
  { key: 'pts', label: 'PTS', pct: false },
  { key: 'tpm', label: '3PM', pct: false },
  { key: 'reb', label: 'REB', pct: false },
  { key: 'ast', label: 'AST', pct: false },
  { key: 'stl', label: 'STL', pct: false },
  { key: 'blk', label: 'BLK', pct: false },
  { key: 'to', label: 'TO', pct: false },
  { key: 'fg', label: 'FG%', pct: true },
  { key: 'ft', label: 'FT%', pct: true },
];

const norm = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/**
 * Interactive per-round mock draft. The reader picks one candidate per round;
 * a live radar and written analysis respond to the selected roster using real
 * current-season z-scores.
 *
 * rounds: [{ round, candidates: [{ name, note, yahooAdp, yahooPreRank }] }]
 */
export default function DraftBuilder({ rounds = [], puntKey }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [picks, setPicks] = useState(() => new Set()); // selected player names (any number per round)
  const [rosterOpen, setRosterOpen] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('player_period_averages')
          .select('player_name, points_z, three_pointers_z, rebounds_z, assists_z, steals_z, blocks_z, fg_percentage_z, ft_percentage_z, turnovers_z, points_per_game, three_pointers_per_game, rebounds_per_game, assists_per_game, steals_per_game, blocks_per_game, turnovers_per_game, field_goals_per_game, field_goals_attempted_per_game, free_throws_per_game, free_throws_attempted_per_game')
          .eq('season', CURRENT_SEASON)
          .eq('period_type', 'season')
          .order('total_value', { ascending: false })
          .limit(600);
        if (error) throw error;
        if (active) setRows(data || []);
      } catch (e) {
        console.error('DraftBuilder fetch failed:', e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const byName = useMemo(() => {
    const m = new Map();
    rows.forEach((r) => m.set(norm(r.player_name), r));
    return m;
  }, [rows]);

  const pickedNames = useMemo(() => [...picks], [picks]);

  // Picked players with their live stat rows (for player-level narrative).
  const pickedRows = useMemo(
    () => pickedNames.map((n) => ({ name: n, row: byName.get(norm(n)) })).filter((p) => p.row),
    [pickedNames, byName],
  );

  // Average z per category across the picked roster.
  const teamValues = useMemo(() => {
    const values = {};
    CATEGORIES.forEach((c) => {
      const vals = pickedRows.map((p) => p.row[c.zKey]).filter((v) => v !== null && v !== undefined);
      values[c.key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });
    return { values, count: pickedRows.length };
  }, [pickedRows]);

  const analysis = useMemo(() => {
    if (teamValues.count === 0) return null;
    const entries = CATEGORIES.map((c) => ({ key: c.key, label: c.label, z: teamValues.values[c.key] }));
    const sorted = [...entries].sort((a, b) => b.z - a.z);
    const strengths = sorted.filter((e) => e.z >= 0.5).slice(0, 3);
    const weaknesses = [...sorted].reverse().filter((e) => e.z <= -0.2).slice(0, 3);
    const twoLowest = [...sorted].slice(-2).map((e) => e.key);
    const puntAligned = twoLowest.includes(puntKey);
    const puntZ = teamValues.values[puntKey];
    return { strengths, weaknesses, puntAligned, puntZ };
  }, [teamValues, puntKey]);

  // Cumulated team stat line (per game). Counting cats summed; FG%/FT% aggregated.
  const cumStats = useMemo(() => {
    if (!pickedRows.length) return null;
    const sum = (k) => pickedRows.reduce((a, p) => a + (p.row[k] || 0), 0);
    const fgm = sum('field_goals_per_game');
    const fga = sum('field_goals_attempted_per_game');
    const ftm = sum('free_throws_per_game');
    const fta = sum('free_throws_attempted_per_game');
    return {
      pts: sum('points_per_game'),
      tpm: sum('three_pointers_per_game'),
      reb: sum('rebounds_per_game'),
      ast: sum('assists_per_game'),
      stl: sum('steals_per_game'),
      blk: sum('blocks_per_game'),
      to: sum('turnovers_per_game'),
      fg: fga ? (fgm / fga) * 100 : 0,
      ft: fta ? (ftm / fta) * 100 : 0,
    };
  }, [pickedRows]);

  // Reference: the average per-category z of a typical rostered team (the top
  // AVG_POOL_SIZE players by value). This is what a real opponent looks like.
  const baselineValues = useMemo(() => {
    const pool = rows.slice(0, AVG_POOL_SIZE);
    const v = {};
    CATEGORIES.forEach((c) => {
      const vals = pool.map((p) => p[c.zKey]).filter((x) => x !== null && x !== undefined);
      v[c.key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });
    return v;
  }, [rows]);

  // Radar overlays your team on the typical-team reference.
  const radarSeries = useMemo(
    () => [
      { name: 'Average opponent', color: AVG_COLOR, values: baselineValues, fillOpacity: 0.08, strokeDasharray: '5 4' },
      { name: 'Your team', color: TEAM_COLOR, values: teamValues.values },
    ],
    [teamValues, baselineValues],
  );

  const togglePick = (name) => {
    setPicks((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={26} />
      </Box>
    );
  }

  const punt = categoryByKey[puntKey];
  const fmt = (z) => `${z > 0 ? '+' : ''}${z.toFixed(2)}`;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 340px' }, gap: { xs: 2, md: 3 } }}>
      {/* Rounds */}
      <Box sx={{ order: { xs: 2, md: 1 }, minWidth: 0 }}>
        {rounds.map((r) => {
          const pickedInRound = r.candidates.filter((c) => picks.has(c.name)).map((c) => c.name);
          return (
            <Box key={r.round} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25, flexWrap: 'wrap' }}>
                <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: '#0f2340', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                  {r.round}
                </Box>
                <Typography sx={{ fontWeight: 800, color: '#0f2340', fontSize: '1.05rem' }}>
                  Round {r.round}
                </Typography>
                {pickedInRound.map((nm) => (
                  <Chip key={nm} label={nm} size="small" onDelete={() => togglePick(nm)} sx={{ bgcolor: '#e8f0fe', color: '#1a4b8f', fontWeight: 700, fontSize: '0.72rem' }} />
                ))}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {r.candidates.map((c) => {
                  const selected = picks.has(c.name);
                  return (
                    <Box
                      key={c.name}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: selected ? '#f2f7ff' : '#fff',
                        border: '1px solid',
                        borderColor: selected ? TEAM_COLOR : '#e6e9ee',
                        borderLeft: `4px solid ${selected ? TEAM_COLOR : '#d7dde5'}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.75 }}>
                        <Button
                          onClick={() => togglePick(c.name)}
                          size="small"
                          disableElevation
                          variant={selected ? 'contained' : 'outlined'}
                          startIcon={selected ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <AddIcon sx={{ fontSize: 16 }} />}
                          sx={{
                            flexShrink: 0,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.76rem',
                            borderRadius: 2,
                            whiteSpace: 'nowrap',
                            ...(selected
                              ? { bgcolor: TEAM_COLOR, '&:hover': { bgcolor: '#256fd0' } }
                              : { color: TEAM_COLOR, borderColor: '#bcd0ea', '&:hover': { borderColor: TEAM_COLOR, bgcolor: 'rgba(47,128,237,0.06)' } }),
                          }}
                        >
                          {selected ? 'Added' : 'Add'}
                        </Button>
                        <Typography sx={{ fontWeight: 800, color: '#0f2340', fontSize: '1.02rem' }}>
                          {c.name}
                        </Typography>
                        {(Number.isFinite(c.yahooAdp) || Number.isFinite(c.yahooPreRank)) && (
                          <Typography sx={{ ml: 'auto', color: '#78828f', fontSize: '0.72rem', fontWeight: 700, textAlign: 'right' }}>
                            {Number.isFinite(c.yahooAdp) ? `Yahoo ADP ${c.yahooAdp.toFixed(1)}` : 'Yahoo ADP unavailable'}
                            {Number.isFinite(c.yahooPreRank) ? ` · pre-rank ${c.yahooPreRank}` : ''}
                          </Typography>
                        )}
                      </Box>
                      <Typography sx={{ color: '#3a4451', fontSize: '0.92rem', lineHeight: 1.6 }}>
                        {c.note}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* "Your team" — a sticky card in its own column, so it travels with you
          as you scroll but never overlaps the round content. */}
      <Box sx={{ order: { xs: 1, md: 2 } }}>
        <Box
          sx={{
            position: { md: 'sticky' },
            top: { md: 24 },
            bgcolor: '#ffffff',
            border: '1px solid #d9e0e8',
            borderRadius: 2.5,
            boxShadow: '0 8px 24px rgba(15,35,64,0.10)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              px: 2,
              py: 1.25,
              bgcolor: '#0f2340',
              color: '#fff',
            }}
          >
            <Typography sx={{ fontWeight: 900, fontSize: '0.95rem' }}>Your team</Typography>
            <Box sx={{ px: 1, py: 0.15, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.16)', fontSize: '0.72rem', fontWeight: 800 }}>
              {teamValues.count} {teamValues.count === 1 ? 'player' : 'players'}
            </Box>
          </Box>

          <Box sx={{ p: 1.5, maxHeight: { md: 'calc(100vh - 140px)' }, overflowY: { md: 'auto' } }}>
                {teamValues.count === 0 ? (
                  <Box sx={{ py: 3, textAlign: 'center', color: '#98a2b1' }}>
                    <Typography sx={{ fontSize: '0.83rem', lineHeight: 1.5 }}>
                      Add a player in any round to see your team’s strengths and weaknesses take shape.
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {/* Expandable roster — the players you've chosen. */}
                    <Box sx={{ mb: 1 }}>
                      <Box
                        onClick={() => setRosterOpen((o) => !o)}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', py: 0.25 }}
                      >
                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#0f2340', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Roster · {teamValues.count}
                        </Typography>
                        <IconButton size="small" sx={{ p: 0.25, color: '#7a8290' }} aria-label={rosterOpen ? 'Hide players' : 'Show players'}>
                          {rosterOpen ? <KeyboardArrowUpIcon sx={{ fontSize: 18 }} /> : <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </Box>
                      <Collapse in={rosterOpen}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pt: 0.5, pb: 0.25 }}>
                          {pickedNames.map((nm) => (
                            <Chip
                              key={nm}
                              label={nm}
                              size="small"
                              onDelete={() => togglePick(nm)}
                              sx={{ bgcolor: '#eef2f7', color: '#2c3440', fontWeight: 600, fontSize: '0.7rem', height: 22 }}
                            />
                          ))}
                        </Box>
                      </Collapse>
                    </Box>

                    <RadarView series={radarSeries} height={230} showLegend />

                    {cumStats && (
                      <Box sx={{ mt: 0.5, mb: 1.25 }}>
                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#0f2340', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
                          Team totals · per game
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.6 }}>
                          {CUM_ROWS.map((row) => (
                            <Box key={row.key} sx={{ bgcolor: '#f4f6f9', borderRadius: 1, px: 0.5, py: 0.6, textAlign: 'center' }}>
                              <Typography sx={{ fontSize: '0.58rem', fontWeight: 800, color: '#7a8290', letterSpacing: 0.3 }}>
                                {row.label}
                              </Typography>
                              <Typography sx={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f2340', fontVariantNumeric: 'tabular-nums' }}>
                                {row.pct ? `${cumStats[row.key].toFixed(1)}%` : cumStats[row.key].toFixed(1)}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {analysis && (
                      <Box sx={{ mt: 0.5 }}>
                        <Box
                          sx={{
                            p: 1,
                            mb: 1.25,
                            borderRadius: 1.5,
                            bgcolor: analysis.puntAligned ? '#e8f7ee' : '#fff4e5',
                            border: `1px solid ${analysis.puntAligned ? '#ade0c1' : '#ffd8a8'}`,
                          }}
                        >
                          <Typography sx={{ fontSize: '0.78rem', color: '#2c3440', lineHeight: 1.4 }}>
                            {analysis.puntAligned
                              ? `On-build: ${punt.label} is one of your lowest categories (z ${fmt(analysis.puntZ)}), exactly as a punt-${punt.name.toLowerCase()} team should look.`
                              : `Heads up: you're not really punting ${punt.label} yet — it's at z ${fmt(analysis.puntZ)}. Lean harder into non-${punt.label} value.`}
                          </Typography>
                        </Box>

                        {analysis.strengths.length > 0 && (
                          <Box sx={{ mb: 0.75 }}>
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#137a3a', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.4 }}>
                              Winning
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {analysis.strengths.map((s) => (
                                <Chip key={s.key} label={`${s.label} ${fmt(s.z)}`} size="small" sx={{ bgcolor: '#137a3a', color: '#fff', fontWeight: 700, fontSize: '0.66rem', height: 20 }} />
                              ))}
                            </Box>
                          </Box>
                        )}

                        {analysis.weaknesses.length > 0 && (
                          <Box sx={{ mb: 0.5 }}>
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#c0392b', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.4 }}>
                              Conceding
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {analysis.weaknesses.map((w) => (
                                <Chip key={w.key} label={`${w.label} ${fmt(w.z)}`} size="small" sx={{ bgcolor: '#d15048', color: '#fff', fontWeight: 700, fontSize: '0.66rem', height: 20 }} />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    )}

                    <Button
                      onClick={() => setPicks(new Set())}
                      size="small"
                      sx={{ mt: 0.5, textTransform: 'none', color: '#7a8290', fontSize: '0.76rem', '&:hover': { color: '#c0392b', bgcolor: 'transparent' } }}
                    >
                      Reset team
                    </Button>
                  </>
                )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
