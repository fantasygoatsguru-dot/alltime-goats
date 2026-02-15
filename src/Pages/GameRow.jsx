import React from "react";
import { TableRow, TableCell, Box, Avatar, Typography } from "@mui/material";

const GameRow = ({
  stat,
  index,
  displayFantasyPoints,
  puntedCategories,
  formatNumber,
  formatPercentage,
  normalizeName,
  pageRowsPerPage,
  page,
}) => {
  return (
    <TableRow
      sx={{
        "&:hover": { backgroundColor: "#f5f5f5" },
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <TableCell
        align="center"
        sx={{
          color: "#1976d2",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          p: 1,
          fontSize: "0.85rem",
          fontWeight: 700,
        }}
      >
        {page * pageRowsPerPage + index + 1}
      </TableCell>
      <TableCell
        sx={{
          color: "#212121",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          p: 1,
          fontSize: "0.85rem",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={`https://www.basketball-reference.com/req/202106291/images/headshots/${(() => {
              const [firstName, lastName] = stat.playerName.split(" ");
              const normalizedLastName = normalizeName(lastName);
              const normalizedFirstName = normalizeName(firstName);
              return `${normalizedLastName.substring(0, 5)}${normalizedFirstName.substring(0, 2)}01`;
            })()}.jpg`}
            onError={(e) => {
              e.target.src =
                "https://www.basketball-reference.com/req/202106291/images/headshots/default.jpg";
            }}
            sx={{
              width: 32,
              height: 32,
              border: "1px solid rgba(0, 0, 0, 0.12)",
              "&:hover": { border: "1px solid #1976d2" },
            }}
          />
          {stat.playerName}
        </Box>
      </TableCell>
      <TableCell sx={{ color: "#212121", borderRight: "1px solid rgba(0, 0, 0, 0.12)", p: 1, fontSize: "0.85rem" }}>
        {stat.season}
      </TableCell>
      <TableCell sx={{ color: "#212121", borderRight: "1px solid rgba(0, 0, 0, 0.12)", p: 1, fontSize: "0.85rem" }}>
        {stat.position}
      </TableCell>
      <TableCell sx={{ color: "#212121", borderRight: "1px solid rgba(0, 0, 0, 0.12)", p: 1, fontSize: "0.85rem" }}>
        {stat.teamName}
      </TableCell>
      <TableCell sx={{ color: "#212121", borderRight: "1px solid rgba(0, 0, 0, 0.12)", p: 1, fontSize: "0.85rem" }}>
        {stat.nationality}
      </TableCell>
      <TableCell sx={{ color: "#212121", borderRight: "1px solid rgba(0, 0, 0, 0.12)", p: 1, fontSize: "0.85rem" }}>
        {stat.height}
      </TableCell>
      <TableCell sx={{ color: "#212121", borderRight: "1px solid rgba(0, 0, 0, 0.12)", p: 1, fontSize: "0.85rem" }}>
        {stat.seasonExperience}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          color: "#212121",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          p: 1,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "0.85rem",
        }}
      >
        {formatNumber(stat.stats?.points, 0)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          color: "#212121",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          p: 1,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "0.85rem",
        }}
      >
        {formatNumber(stat.stats?.rebounds, 0)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          color: "#212121",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          p: 1,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "0.85rem",
        }}
      >
        {formatNumber(stat.stats?.assists, 0)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          color: "#212121",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          p: 1,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "0.85rem",
        }}
      >
        {formatNumber(stat.stats?.steals, 0)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          color: "#212121",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          p: 1,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "0.85rem",
        }}
      >
        {formatNumber(stat.stats?.blocks, 0)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          color: "#212121",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          p: 1,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "0.85rem",
        }}
      >
        {formatPercentage(stat.stats?.field_goal_percentage)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          color: "#212121",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          p: 1,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "0.85rem",
        }}
      >
        {formatPercentage(stat.stats?.free_throw_percentage)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          color: "#212121",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          p: 1,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "0.85rem",
        }}
      >
        {formatNumber(stat.stats?.three_pointers, 0)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          color: "#212121",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          p: 1,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "0.85rem",
        }}
      >
        {formatNumber(stat.stats?.turnovers, 0)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          color: "#212121",
          p: 1,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "0.85rem",
          fontWeight: 600,
          bgcolor: puntedCategories.length > 0 ? "#e3f2fd" : "transparent",
        }}
      >
        {formatNumber(displayFantasyPoints, 1)}
        {puntedCategories.length > 0 && (
          <Typography component="span" sx={{ fontSize: "0.65rem", color: "#666", ml: 0.5 }}>
            ({formatNumber(stat.stats?.fantasy_points, 1)})
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
};

export default GameRow;
