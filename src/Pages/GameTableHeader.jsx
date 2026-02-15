import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";

const GAME_TABLE_COLUMNS = [
  { key: "#", label: "#", align: "center", width: 50, sortable: false },
  { key: "playerName", label: "Player", sortable: true },
  { key: "season", label: "Season", sortable: true },
  { key: "position", label: "Position", sortable: true },
  { key: "teamName", label: "Team", sortable: true },
  { key: "nationality", label: "Nationality", sortable: true },
  { key: "height", label: "Height", sortable: true },
  { key: "seasonExperience", label: "Exp", sortable: true },
  { key: "points", label: "Points", align: "right", sortable: true },
  { key: "rebounds", label: "Rebounds", align: "right", sortable: true },
  { key: "assists", label: "Assists", align: "right", sortable: true },
  { key: "steals", label: "Steals", align: "right", sortable: true },
  { key: "blocks", label: "Blocks", align: "right", sortable: true },
  { key: "field_goal_percentage", label: "FG%", align: "right", sortable: true },
  { key: "free_throw_percentage", label: "FT%", align: "right", sortable: true },
  { key: "three_pointers", label: "3PT", align: "right", sortable: true },
  { key: "turnovers", label: "TOV", align: "right", sortable: true },
];

const GameTableHeader = ({ sortColumn, sortDirection, onSort, puntedCategories }) => {
  const headerCellSx = {
    bgcolor: "#003366",
    color: "#fff",
    fontWeight: 600,
    fontSize: "0.75rem",
    py: 1,
    px: 0.5,
  };

  const sortLabelSx = {
    color: "#fff !important",
    "& .MuiTableSortLabel-icon": {
      color: "#fff !important",
    },
    "&:hover": { color: "#fff" },
    "&.Mui-active": { color: "#fff" },
  };

  return (
    <TableHead>
      <TableRow>
        {GAME_TABLE_COLUMNS.map((col) => (
          <TableCell
            key={col.key}
            align={col.align || "left"}
            sx={{
              ...headerCellSx,
              width: col.width,
            }}
          >
            {col.sortable ? (
              <TableSortLabel
                active={sortColumn === col.key}
                direction={sortColumn === col.key ? sortDirection : "asc"}
                onClick={() => onSort(col.key)}
                sx={sortLabelSx}
              >
                {col.label}
              </TableSortLabel>
            ) : (
              col.label
            )}
          </TableCell>
        ))}
        <TableCell
          align="right"
          sx={headerCellSx}
        >
          <TableSortLabel
            active={sortColumn === "fantasy_points"}
            direction={sortColumn === "fantasy_points" ? sortDirection : "asc"}
            onClick={() => onSort("fantasy_points")}
            sx={sortLabelSx}
          >
            {puntedCategories.length > 0 ? "Adj Fant Pts" : "Fantasy Pts"}
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default GameTableHeader;
export { GAME_TABLE_COLUMNS };
