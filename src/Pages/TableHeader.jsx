import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";

const TABLE_COLUMNS = [
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
  { key: "points_z", label: "Points Z", align: "right", sortable: true },
  { key: "rebounds_z", label: "Reb Z", align: "right", sortable: true },
  { key: "assists_z", label: "Ast Z", align: "right", sortable: true },
  { key: "steals_z", label: "Stl Z", align: "right", sortable: true },
  { key: "blocks_z", label: "Blk Z", align: "right", sortable: true },
  { key: "field_goal_percentage_z", label: "FG% Z", align: "right", sortable: true },
  { key: "free_throw_percentage_z", label: "FT% Z", align: "right", sortable: true },
  { key: "turnovers", label: "TOV", align: "right", sortable: true },
  { key: "turnovers_z", label: "TOV Z", align: "right", sortable: true },
  { key: "three_pointers_z", label: "3PT Z", align: "right", sortable: true },
  { key: "total_value", label: "Total Val", align: "right", sortable: true },
];

const TableHeader = ({ sortColumn, sortDirection, onSort }) => {
  const headerCellSx = {
    bgcolor: "#003366",
    color: "#fff",
    fontWeight: 600,
    fontSize: "0.75rem",
    py: 1,
    px: 0.5,
    borderBottom: "1px solid #ddd",
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
        {TABLE_COLUMNS.map((col) => (
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
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
export { TABLE_COLUMNS };
