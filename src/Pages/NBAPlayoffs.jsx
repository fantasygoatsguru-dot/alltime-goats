import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
} from "@mui/material";

const NBAPlayoffs = () => {
  const [playoffStartWeek, setPlayoffStartWeek] = useState(19);
  const [nbaTeamSchedule, setNbaTeamSchedule] = useState({});
  const [playoffsData, setPlayoffsData] = useState(null);

  // ── SEO Structured Data ───────────────────────────────────────────
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "NBA Playoff Schedule Analyzer",
      "description": "Analyze NBA team playoff schedules. View game counts by week and plan your fantasy basketball strategy.",
      "url": "https://fantasygoats.guru/nba-playoffs",
      "applicationCategory": "SportsApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "NBA team playoff schedule analysis",
        "Weekly game count tracking",
        "Playoff schedule comparison"
      ],
      "keywords": "NBA playoff schedule, NBA playoffs, basketball playoff schedule"
    };

    let scriptTag = document.getElementById('nba-playoffs-structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'nba-playoffs-structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      const tag = document.getElementById('nba-playoffs-structured-data');
      if (tag) tag.remove();
    };
  }, []);

  // ── Load static data ───────────────────────────────────────────
  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        const [scheduleRes, playoffsRes] = await Promise.all([
          fetch("/data/schedule.json"),
          fetch("/data/playoffs.json"),
        ]);
        const schedule = await scheduleRes.json();
        const playoffs = await playoffsRes.json();

        setNbaTeamSchedule(schedule);
        setPlayoffsData(playoffs);
      } catch (e) {
        console.error("Error loading schedule data:", e);
      }
    };
    loadScheduleData();
  }, []);

  // ── Playoff weeks ───────────────────────────────────────────────
  const playoffWeeks = useMemo(() => {
    if (!playoffsData || typeof playoffStartWeek !== "number") return [];

    const weeks = [];
    for (let i = 0; i < 3; i++) {
      const weekNum = playoffStartWeek + i;
      const weekData = playoffsData.weeks?.[weekNum];

      if (
        weekData &&
        typeof weekData === "object" &&
        weekData.start &&
        weekData.end &&
        weekData.label
      ) {
        weeks.push({
          number: weekNum,
          ...weekData,
        });
      }
    }
    return weeks;
  }, [playoffsData, playoffStartWeek]);

  // ── Helper: Parse date in US Eastern Time ────────────────────────
  const parseEasternDate = (dateStr) => {
    // Parse date string and treat as US Eastern time
    const date = new Date(dateStr + 'T00:00:00-05:00'); // EST offset
    return date;
  };

  // ── NBA team games ─────────────────────────────────────────────
  const nbaTeamGames = useMemo(() => {
    if (!nbaTeamSchedule || !playoffWeeks.length) return [];

    const map = {};
    Object.entries(nbaTeamSchedule).forEach(([dateStr, teams]) => {
      const gameDate = parseEasternDate(dateStr);
      teams.forEach((abbr) => {
        if (!map[abbr]) map[abbr] = { team: abbr, weeks: {}, total: 0 };
        playoffWeeks.forEach((week) => {
          const s = parseEasternDate(week.start);
          const e = parseEasternDate(week.end);
          // Set to start of Monday and end of Sunday (inclusive)
          s.setHours(0, 0, 0, 0);
          e.setHours(23, 59, 59, 999);
          
          if (gameDate >= s && gameDate <= e) {
            map[abbr].weeks[week.number] = (map[abbr].weeks[week.number] || 0) + 1;
          }
        });
      });
    });
    Object.values(map).forEach((t) => {
      t.total = Object.values(t.weeks).reduce((a, b) => a + b, 0);
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [nbaTeamSchedule, playoffWeeks]);

  const handleWeekSelect = (e) => setPlayoffStartWeek(+e.target.value);

  // ── Loading guard ─────────────────────────────────────────────
  if (
    !playoffsData ||
    !nbaTeamSchedule ||
    !Array.isArray(playoffWeeks) ||
    playoffWeeks.length === 0
  ) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Loading playoff data…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 1,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          NBA Playoff Schedule
        </Typography>
      </Box>

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        <FormControl sx={{ minWidth: 210 }}>
          <InputLabel>Playoff Start Week</InputLabel>
          <Select
            value={playoffStartWeek}
            label="Playoff Start Week"
            onChange={handleWeekSelect}
          >
            {[19, 20, 21].map((n) => (
              <MenuItem key={n} value={n}>
                W{n} ({playoffsData.weeks?.[n]?.label ?? ""})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {playoffWeeks.map((w) => (
            <Chip
              key={w.number}
              label={`W${w.number}: ${w.label}`}
              color="default"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      {/* NBA Teams Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
              {playoffWeeks.map((w) => (
                <TableCell key={w.number} align="center" sx={{ fontWeight: 700 }}>
                  Week {w.number}
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{ fontWeight: 700, bgcolor: "info.light", color: "white" }}
              >
                TOTAL
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nbaTeamGames.map((t) => (
              <TableRow key={t.team} hover>
                <TableCell>
                  <Chip label={t.team} size="small" />
                </TableCell>
                {playoffWeeks.map((w) => (
                  <TableCell key={w.number} align="center">
                    {t.weeks[w.number] ?? 0}
                  </TableCell>
                ))}
                <TableCell
                  align="center"
                  sx={{ bgcolor: "info.light", color: "white", fontWeight: 700 }}
                >
                  {t.total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default NBAPlayoffs;

