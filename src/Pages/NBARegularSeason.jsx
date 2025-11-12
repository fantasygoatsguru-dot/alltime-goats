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

const NBARegularSeason = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [nbaTeamSchedule, setNbaTeamSchedule] = useState({});
  const [allWeeks, setAllWeeks] = useState([]);

  // ── SEO Structured Data ───────────────────────────────────────────
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "NBA Regular Season Schedule",
      "description": "View complete NBA regular season schedule by week. Track game counts for all NBA teams throughout the season.",
      "url": "https://fantasygoats.guru/nba-regular-season",
      "applicationCategory": "SportsApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "NBA regular season schedule",
        "Weekly game count tracking",
        "Team schedule comparison"
      ],
      "keywords": "NBA schedule, NBA regular season, basketball schedule, NBA games by week"
    };

    let scriptTag = document.getElementById('nba-regular-season-structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'nba-regular-season-structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      const tag = document.getElementById('nba-regular-season-structured-data');
      if (tag) tag.remove();
    };
  }, []);

  // ── Load static data ───────────────────────────────────────────
  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        const [scheduleRes, weeksRes] = await Promise.all([
          fetch("/data/schedule.json"),
          fetch("/data/weeks.json"),
        ]);
        const schedule = await scheduleRes.json();
        const weeksData = await weeksRes.json();

        setNbaTeamSchedule(schedule);
        
        // Generate all weeks from weeks data
        if (weeksData?.weeks) {
          const weeks = Object.entries(weeksData.weeks).map(([weekNum, weekData]) => ({
            number: parseInt(weekNum),
            ...weekData,
          })).sort((a, b) => a.number - b.number);
          setAllWeeks(weeks);
          
          // Set current week based on today's date
          const today = new Date();
          const currentWeek = weeks.find(w => {
            const start = new Date(w.start);
            const end = new Date(w.end);
            return today >= start && today <= end;
          });
          if (currentWeek) {
            setSelectedWeek(currentWeek.number);
          }
        }
      } catch (e) {
        console.error("Error loading schedule data:", e);
      }
    };
    loadScheduleData();
  }, []);

  // ── Current week data ─────────────────────────────────────────────
  const currentWeekData = useMemo(() => {
    const week = allWeeks.find(w => w.number === selectedWeek);
    if (!week || !nbaTeamSchedule) return null;

    const teams = {};
    Object.entries(nbaTeamSchedule).forEach(([dateStr, teamList]) => {
      const gameDate = new Date(dateStr);
      const weekStart = new Date(week.start);
      const weekEnd = new Date(week.end);
      
      if (gameDate >= weekStart && gameDate <= weekEnd) {
        teamList.forEach((abbr) => {
          if (!teams[abbr]) teams[abbr] = { team: abbr, games: 0 };
          teams[abbr].games++;
        });
      }
    });

    return {
      week,
      teams: Object.values(teams).sort((a, b) => b.games - a.games),
    };
  }, [selectedWeek, allWeeks, nbaTeamSchedule]);

  const handleWeekSelect = (e) => setSelectedWeek(+e.target.value);

  // Determine if selected week is current week
  const isCurrentWeek = useMemo(() => {
    if (!currentWeekData) return false;
    const today = new Date();
    const weekStart = new Date(currentWeekData.week.start);
    const weekEnd = new Date(currentWeekData.week.end);
    return today >= weekStart && today <= weekEnd;
  }, [currentWeekData]);

  // ── Loading guard ─────────────────────────────────────────────
  if (!nbaTeamSchedule || !allWeeks.length || !currentWeekData) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Loading schedule data…</Typography>
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
          NBA Regular Season Schedule
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
          <InputLabel>Week</InputLabel>
          <Select
            value={selectedWeek}
            label="Week"
            onChange={handleWeekSelect}
          >
            {allWeeks.map((w) => (
              <MenuItem key={w.number} value={w.number}>
                W{w.number} ({w.label})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Chip
          label={`${currentWeekData.week.label}${isCurrentWeek ? ' (Current Week)' : ''}`}
          color={isCurrentWeek ? "primary" : "default"}
          variant={isCurrentWeek ? "filled" : "outlined"}
          sx={{ fontWeight: isCurrentWeek ? 700 : 400 }}
        />
      </Box>

      {/* NBA Teams Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Games in Week {selectedWeek}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentWeekData.teams.map((t) => (
              <TableRow key={t.team} hover>
                <TableCell>
                  <Chip label={t.team} size="small" />
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    color: t.games >= 4 ? "success.main" : t.games <= 2 ? "error.main" : "text.primary",
                  }}
                >
                  {t.games}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Stats */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Chip
          label={`Total Teams: ${currentWeekData.teams.length}`}
          variant="outlined"
          color="info"
        />
        <Chip
          label={`Total Games: ${currentWeekData.teams.reduce((sum, t) => sum + t.games, 0)}`}
          variant="outlined"
          color="info"
        />
        <Chip
          label={`Avg Games/Team: ${(currentWeekData.teams.reduce((sum, t) => sum + t.games, 0) / currentWeekData.teams.length).toFixed(1)}`}
          variant="outlined"
          color="info"
        />
      </Box>
    </Box>
  );
};

export default NBARegularSeason;

