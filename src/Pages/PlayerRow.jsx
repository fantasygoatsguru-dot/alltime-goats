import React from "react";
import { TableRow, TableCell, Box, Avatar } from "@mui/material";

const PlayerRow = ({
  stat,
  index,
  displayRank,
  displayValue,
  puntedCategories,
  getColorForValue,
  getTextColor,
  formatNumber,
  formatPercentage,
  normalizeName,
}) => {
  const cellSx = (zScoreKey) => ({
    bgcolor: puntedCategories.includes(zScoreKey)
      ? "#f5f5f5"
      : getColorForValue(stat.stats?.[zScoreKey] || 0),
    color: puntedCategories.includes(zScoreKey)
      ? "#999"
      : getTextColor(getColorForValue(stat.stats?.[zScoreKey] || 0)),
    py: 0.75,
    px: 0.5,
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "0.75rem",
    borderBottom: "1px solid #eee",
  });

  return (
    <TableRow
      sx={{
        bgcolor: index % 2 === 0 ? "#fff" : "#f9f9f9",
        "&:hover": {
          bgcolor: "rgba(0, 0, 0, 0.03)",
        },
      }}
    >
      <TableCell
        align="center"
        sx={{
          color: "#0066cc",
          py: 0.75,
          px: 0.5,
          fontSize: "0.75rem",
          borderBottom: "1px solid #eee",
          fontWeight: 600,
        }}
      >
        {displayRank}
      </TableCell>
      <TableCell
        sx={{
          color: "#000",
          py: 0.75,
          px: 0.5,
          fontSize: "0.75rem",
          borderBottom: "1px solid #eee",
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
              "&:hover": {
                border: "1px solid #1976d2",
              },
            }}
          />
          {stat.playerName}
        </Box>
      </TableCell>
      <TableCell sx={{ color: "#000", py: 0.75, px: 0.5, fontSize: "0.75rem", borderBottom: "1px solid #eee" }}>
        {stat.season}
      </TableCell>
      <TableCell sx={{ color: "#000", py: 0.75, px: 0.5, fontSize: "0.75rem", borderBottom: "1px solid #eee" }}>
        {stat.position}
      </TableCell>
      <TableCell sx={{ color: "#000", py: 0.75, px: 0.5, fontSize: "0.75rem", borderBottom: "1px solid #eee" }}>
        {stat.teamName}
      </TableCell>
      <TableCell sx={{ color: "#000", py: 0.75, px: 0.5, fontSize: "0.75rem", borderBottom: "1px solid #eee" }}>
        {stat.nationality}
      </TableCell>
      <TableCell sx={{ color: "#000", py: 0.75, px: 0.5, fontSize: "0.75rem", borderBottom: "1px solid #eee" }}>
        {stat.height}
      </TableCell>
      <TableCell sx={{ color: "#000", py: 0.75, px: 0.5, fontSize: "0.75rem", borderBottom: "1px solid #eee" }}>
        {stat.seasonExperience}
      </TableCell>
      <TableCell align="right" sx={cellSx("points_z")}>
        {formatNumber(stat.stats?.points)}
      </TableCell>
      <TableCell align="right" sx={cellSx("rebounds_z")}>
        {formatNumber(stat.stats?.rebounds)}
      </TableCell>
      <TableCell align="right" sx={cellSx("assists_z")}>
        {formatNumber(stat.stats?.assists)}
      </TableCell>
      <TableCell align="right" sx={cellSx("steals_z")}>
        {formatNumber(stat.stats?.steals)}
      </TableCell>
      <TableCell align="right" sx={cellSx("blocks_z")}>
        {formatNumber(stat.stats?.blocks)}
      </TableCell>
      <TableCell align="right" sx={cellSx("field_goal_percentage_z")}>
        {formatPercentage(stat.stats?.field_goal_percentage)}
      </TableCell>
      <TableCell align="right" sx={cellSx("free_throw_percentage_z")}>
        {formatPercentage(stat.stats?.free_throw_percentage)}
      </TableCell>
      <TableCell align="right" sx={cellSx("three_pointers_z")}>
        {formatNumber(stat.stats?.three_pointers)}
      </TableCell>
      <TableCell align="right" sx={cellSx("points_z")}>
        {formatNumber(stat.stats?.points_z, 2)}
      </TableCell>
      <TableCell align="right" sx={cellSx("rebounds_z")}>
        {formatNumber(stat.stats?.rebounds_z, 2)}
      </TableCell>
      <TableCell align="right" sx={cellSx("assists_z")}>
        {formatNumber(stat.stats?.assists_z, 2)}
      </TableCell>
      <TableCell align="right" sx={cellSx("steals_z")}>
        {formatNumber(stat.stats?.steals_z, 2)}
      </TableCell>
      <TableCell align="right" sx={cellSx("blocks_z")}>
        {formatNumber(stat.stats?.blocks_z, 2)}
      </TableCell>
      <TableCell align="right" sx={cellSx("field_goal_percentage_z")}>
        {formatNumber(stat.stats?.field_goal_percentage_z, 2)}
      </TableCell>
      <TableCell align="right" sx={cellSx("free_throw_percentage_z")}>
        {formatNumber(stat.stats?.free_throw_percentage_z, 2)}
      </TableCell>
      <TableCell align="right" sx={cellSx("turnovers_z")}>
        {formatNumber(stat.stats?.turnovers)}
      </TableCell>
      <TableCell align="right" sx={cellSx("turnovers_z")}>
        {formatNumber(stat.stats?.turnovers_z, 2)}
      </TableCell>
      <TableCell align="right" sx={cellSx("three_pointers_z")}>
        {formatNumber(stat.stats?.three_pointers_z, 2)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          bgcolor: getColorForValue(displayValue),
          color: getTextColor(getColorForValue(displayValue)),
          py: 0.75,
          px: 0.5,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "0.75rem",
          borderBottom: "1px solid #eee",
        }}
      >
        {formatNumber(displayValue, 2)}
      </TableCell>
    </TableRow>
  );
};

export default PlayerRow;
