/* --- ULTIMATE WINNER – WITH 👑 CROWN + 🤡 CLOWN BADGES --- */
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Button,
  Tooltip,
  Grid,
} from "@mui/material";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import { useAuth } from "../contexts/AuthContext";
import { useLeague } from "../contexts/LeagueContext";
import { supabase } from "../utils/supabase";

/* --------------------
   CATEGORY DEFINITIONS
-----------------------*/
const CATEGORIES = [
  { id: "12", name: "PTS", higherBetter: true },
  { id: "15", name: "REB", higherBetter: true },
  { id: "16", name: "AST", higherBetter: true },
  { id: "17", name: "STL", higherBetter: true },
  { id: "18", name: "BLK", higherBetter: true },
  { id: "19", name: "TO", higherBetter: false },
  { id: "10", name: "3PM", higherBetter: true },
  { id: "5", name: "FG%", higherBetter: true, isPercentage: true },
  { id: "8", name: "FT%", higherBetter: true, isPercentage: true },
];

/* --------------------
   COMPONENT
-----------------------*/
const UltimateWinner = () => {
  const { user, isAuthenticated } = useAuth();
  const { selectedLeague } = useLeague();

  const [selectedWeek, setSelectedWeek] = useState(7);
  const [allWeeks, setAllWeeks] = useState([]);
  const [scoreboardData, setScoreboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /* --------------------
       LOAD WEEKS
  -----------------------*/
  useEffect(() => {
    const loadWeeks = async () => {
      try {
        const res = await fetch("/data/weeks.json");
        const data = await res.json();
        if (data?.weeks) {
          const weeks = Object.entries(data.weeks)
            .map(([n, info]) => ({ number: +n, ...info }))
            .sort((a, b) => a.number - b.number);

          setAllWeeks(weeks);

          const today = new Date();
          const current = weeks.find(
            (w) => today >= new Date(w.start) && today <= new Date(w.end)
          );
          if (current) setSelectedWeek(current.number);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadWeeks();
  }, []);

  /* --------------------
       FETCH SCOREBOARD
  -----------------------*/
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !selectedLeague || !user?.userId || !selectedWeek) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: apiError } = await supabase.functions.invoke("yahoo-fantasy-api", {
          body: {
            action: "getScoreboard",
            userId: user.userId,
            leagueId: selectedLeague,
            week: selectedWeek,
          },
        });

        if (apiError) throw apiError;
        setScoreboardData(data);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, selectedLeague, user?.userId, selectedWeek]);

  /* --------------------
       STAT PARSING
  -----------------------*/
  const parseStatValue = (cat, raw) => {
    if (raw === undefined || raw === null) return null;
    let v = raw;

    if (typeof raw === "object" && raw !== null) {
      if (raw.stat?.value != null) v = raw.stat.value;
      else if (raw.value != null) v = raw.value;
      else {
        for (let k of Object.keys(raw)) {
          if (typeof raw[k] === "string" || typeof raw[k] === "number") {
            v = raw[k];
            break;
          }
        }
      }
    }

    if (typeof v === "string") {
      v = v.trim();
      if (v.includes("/")) {
        const [num, den] = v.split("/").map((s) => parseFloat(s.trim()));
        if (den && !isNaN(num) && !isNaN(den)) return num / den;
        return null;
      }
      const n = parseFloat(v);
      if (!isNaN(n)) return cat.isPercentage ? Math.max(0, Math.min(1, n)) : n;
      return null;
    }

    if (typeof v === "number") {
      return cat.isPercentage ? Math.max(0, Math.min(1, v)) : v;
    }
    return null;
  };

  const formatDisplayValue = (cat, numeric) => {
    if (numeric == null) return "—";
    if (cat.isPercentage) return `${(numeric * 100).toFixed(1)}%`;
    return Math.round(numeric);
  };

  /* --------------------
       MATRIX CALCULATION
  -----------------------*/
  const headToHeadMatrix = useMemo(() => {
    if (!scoreboardData?.matchups) return null;

    const teamMap = new Map();
    scoreboardData.matchups.forEach((m) => {
      [m.team1, m.team2].forEach((t) => {
        if (!teamMap.has(t.key)) {
          teamMap.set(t.key, {
            key: t.key,
            name: t.name,
            managerNickname: t.managerNickname,
            stats: t.stats,
          });
        }
      });
    });

    const teams = [...teamMap.values()].sort((a, b) => a.name.localeCompare(b.name));
    const cache = new Map();

    const compare = (home, away) => {
      const key = `${home.key}_${away.key}`;
      if (cache.has(key)) return cache.get(key);

      let wins = 0,
        losses = 0,
        ties = 0;
      const details = [];

      CATEGORIES.forEach((cat) => {
        const homeVal = parseStatValue(cat, home.stats?.[cat.id]);
        const awayVal = parseStatValue(cat, away.stats?.[cat.id]);
        if (homeVal == null || awayVal == null) return;

        let result = "tie";
        if (homeVal > awayVal) result = cat.higherBetter ? "win" : "loss";
        else if (homeVal < awayVal) result = cat.higherBetter ? "loss" : "win";

        if (result === "win") wins++;
        else if (result === "loss") losses++;
        else ties++;

        details.push({
          category: cat.name,
          homeValDisplay: formatDisplayValue(cat, homeVal),
          awayValDisplay: formatDisplayValue(cat, awayVal),
          result,
        });
      });

      const res = { wins, losses, ties, details };
      cache.set(key, res);
      return res;
    };

    return {
      teams,
      getResult: (hk, ak) => {
        const h = teams.find((t) => t.key === hk);
        const a = teams.find((t) => t.key === ak);
        return h && a ? compare(h, a) : null;
      },
    };
  }, [scoreboardData]);

  /* --------------------
       BADGES (👑 undefeated / 🤡 winless)
  -----------------------*/
  const teamBadges = useMemo(() => {
    if (!headToHeadMatrix) return {};

    const badges = {};
    const teams = headToHeadMatrix.teams;

    teams.forEach((t) => {
      let totalWins = 0;
      let totalLosses = 0;

      teams.forEach((opponent) => {
        if (opponent.key === t.key) return;
        const res = headToHeadMatrix.getResult(t.key, opponent.key);
        if (!res) return;
        totalWins += res.wins > res.losses ? 1 : 0;
        totalLosses += res.losses > res.wins ? 1 : 0;
      });

      if (totalWins === teams.length - 1) badges[t.key] = " 👑";
      else if (totalLosses === teams.length - 1) badges[t.key] = " 🤡";
      else badges[t.key] = "";
    });

    return badges;
  }, [headToHeadMatrix]);

  /* --------------------
       CELL COLORING
  -----------------------*/
  const getCellStyle = (wins, losses) => {
    if (wins > losses) {
      return { bg: "#c8f7c5", border: "2px solid #2e7d32", color: "#1b5e20" };
    }
    if (losses > wins) {
      return { bg: "#ffcdd2", border: "2px solid #c62828", color: "#8e0000" };
    }
    return { bg: "#eeeeee", border: "1px solid #999", color: "#333" };
  };

  const formatResult = (w, l, t) => (t ? `${w}-${l}-${t}` : `${w}-${l}`);

  const handleWeekSelect = (e) => setSelectedWeek(+e.target.value);

  const handleYahooConnect = async () => {
    try {
      sessionStorage.setItem("oauth_return_path", window.location.pathname);
      const isDev = location.hostname === "localhost";
      const { data } = await supabase.functions.invoke("yahoo-oauth", {
        body: { action: "authorize", isDev },
      });
      if (data?.authUrl) window.location.href = data.authUrl;
    } catch (e) {
      console.error(e);
    }
  };

  /* --------------------
       RENDER
  -----------------------*/
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Paper sx={{ p: 4, maxWidth: 500, mx: "auto", bgcolor: "primary.main", color: "white" }}>
          <Typography variant="h5" fontWeight={700}>Connect to Yahoo Fantasy Basketball</Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: "white", color: "primary.main", mt: 2 }}
            startIcon={<SportsBasketballIcon />}
            onClick={handleYahooConnect}
          >
            Connect Now
          </Button>
        </Paper>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading Week {selectedWeek} matchups…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" align="center" fontWeight={700} color="primary">
        Head-to-Head Matrix
      </Typography>

      {/* WEEK SELECTOR */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Week</InputLabel>
          <Select value={selectedWeek} label="Week" onChange={handleWeekSelect}>
            {allWeeks.map((w) => (
              <MenuItem key={w.number} value={w.number}>
                Week {w.number} – {w.label || `Week ${w.number}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Paper sx={{ p: 2, bgcolor: "error.light", color: "error.contrastText", mt: 2, textAlign: "center" }}>
          {error}
        </Paper>
      )}

      {/* MATRIX */}
      {headToHeadMatrix && (
        <Paper sx={{ mt: 4, p: 2 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `200px repeat(${headToHeadMatrix.teams.length}, 1fr)`,
                gap: 0.4,
              }}
            >
              {/* Header */}
              <Box />
              {headToHeadMatrix.teams.map((t) => (
                <Tooltip key={t.key} title={t.name}>
                  <Box sx={{ bgcolor: "primary.light", p: 1, textAlign: "center", fontWeight: 600, color: "white" }}>
                    {(t.name.length > 12 ? `${t.name.slice(0, 10)}…` : t.name) + teamBadges[t.key]}
                  </Box>
                </Tooltip>
              ))}

              {/* Rows */}
              {headToHeadMatrix.teams.map((home, r) => (
                <React.Fragment key={home.key}>
                  <Box sx={{ bgcolor: "primary.main", color: "white", p: 1, fontWeight: 600 }}>
                    {home.name + teamBadges[home.key]}
                  </Box>

                  {headToHeadMatrix.teams.map((away, c) => {
                    if (r === c) {
                      return <Box key={away.key} sx={{ bgcolor: "#fafafa", height: 48 }} />;
                    }

                    const res = headToHeadMatrix.getResult(home.key, away.key);
                    if (!res) return <Box key={away.key} />;

                    const { wins, losses, ties, details } = res;
                    const { bg, border, color } = getCellStyle(wins, losses);

                    return (
                      <Tooltip
                        key={away.key}
                        arrow
                        title={
                          <Box sx={{ p: 1, maxWidth: 300 }}>
                            <Typography fontWeight={700} sx={{ mb: 1 }}>
                              {home.name} vs {away.name}
                            </Typography>

                            <Grid container spacing={0.5}>
                              <Grid item xs={6}><strong>Category</strong></Grid>
                              <Grid item xs={3} sx={{ textAlign: "right" }}><strong>{home?.name?.slice(0, 8)}...</strong></Grid>
                              <Grid item xs={3} sx={{ textAlign: "right" }}><strong>{away?.name?.slice(0, 8)}...</strong></Grid>
                            </Grid>

                            {details.map((d, i) => (
                              <Grid container key={i} spacing={0.5} sx={{ mt: 0.2 }}>
                                <Grid item xs={6}>{d.category}</Grid>
                                <Grid
                                  item
                                  xs={3}
                                  sx={{
                                    textAlign: "right",
                                    fontWeight: d.result === "win" ? 700 : 400,
                                    color: d.result === "win" ? "success.main" : d.result === "loss" ? "error.main" : "text.secondary",
                                  }}
                                >
                                  {d.homeValDisplay}
                                </Grid>
                                <Grid
                                  item
                                  xs={3}
                                  sx={{
                                    textAlign: "right",
                                    fontWeight: d.result === "loss" ? 700 : 400,
                                    color: d.result === "loss" ? "success.main" : d.result === "win" ? "error.main" : "text.secondary",
                                  }}
                                >
                                  {d.awayValDisplay}
                                </Grid>
                              </Grid>
                            ))}

                            <Box sx={{ mt: 1, textAlign: "center", fontWeight: 700 }}>
                              Final: {formatResult(wins, losses, ties)}
                            </Box>
                          </Box>
                        }
                      >
                        <Box
                          sx={{
                            p: 1,
                            height: 48,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: bg,
                            border,
                            color,
                            fontWeight: 700,
                          }}
                        >
                          {formatResult(wins, losses, ties)}
                        </Box>
                      </Tooltip>
                    );
                  })}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default UltimateWinner;
