import React from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import GameFilterControls from "./GameFilterControls";
import { GAME_PUNT_CATEGORIES } from "../constants/categories";

const GameFilterSection = ({
  puntedCategories,
  onPuntToggle,
  showAdvancedFilters,
  onToggleAdvanced,
  filterType,
  onFilterTypeChange,
  filterValue,
  onFilterValueChange,
  filterOperator,
  onFilterOperatorChange,
  filterNumericValue,
  onFilterNumericValueChange,
  filters,
  onAddFilter,
  onDeleteFilter,
  onClearFilters,
  filterTypes,
  filterValueSuggestions,
  operators,
}) => {
  return (
    <Box
      sx={{
        mb: 2,
        p: 1.5,
        bgcolor: "#fff",
        border: "1px solid #ddd",
        borderRadius: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: "#003366", minWidth: "100px" }}
        >
          Punt Categories:
        </Typography>
        {GAME_PUNT_CATEGORIES.map((cat) => (
          <FormControlLabel
            key={cat.key}
            control={
              <Checkbox
                checked={puntedCategories.includes(cat.key)}
                onChange={() => onPuntToggle(cat.key)}
                size="small"
                sx={{ "&.Mui-checked": { color: "#0066cc" } }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#000" }}>
                {cat.label}
              </Typography>
            }
            sx={{ m: 0 }}
          />
        ))}

        <Button
          variant="outlined"
          size="small"
          onClick={() => onToggleAdvanced(!showAdvancedFilters)}
          sx={{
            textTransform: "none",
            marginLeft: "auto",
            fontSize: "0.875rem",
            color: "#0066cc",
            borderColor: "#0066cc",
            "&:hover": {
              borderColor: "#0052a3",
              backgroundColor: "rgba(0, 102, 204, 0.04)",
            },
          }}
        >
          {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
        </Button>
      </Box>

      {puntedCategories.length > 0 && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            color: "#666",
            fontSize: "0.75rem",
          }}
        >
          Excluding: {GAME_PUNT_CATEGORIES.filter((c) => puntedCategories.includes(c.key))
            .map((c) => {
              if (c.includesCategories) {
                return `${c.label} (${c.includesCategories.map((cat) => cat.replace("_", " ").toUpperCase()).join(", ")})`;
              }
              return c.label;
            })
            .join(", ")}
        </Typography>
      )}

      {showAdvancedFilters && (
        <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #ddd" }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#003366", mb: 1 }}>
            Advanced Filters:
          </Typography>
          <GameFilterControls
            filterType={filterType}
            onFilterTypeChange={onFilterTypeChange}
            filterValue={filterValue}
            onFilterValueChange={onFilterValueChange}
            filterOperator={filterOperator}
            onFilterOperatorChange={onFilterOperatorChange}
            filterNumericValue={filterNumericValue}
            onFilterNumericValueChange={onFilterNumericValueChange}
            onAddFilter={onAddFilter}
            onClearFilters={onClearFilters}
            filterTypes={filterTypes}
            filterValueSuggestions={filterValueSuggestions}
            operators={operators}
          />

          {filters.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
              {filters.map((filter, index) => (
                <Chip
                  key={index}
                  label={filter.label}
                  onDelete={() => onDeleteFilter(index)}
                  size="small"
                  sx={{
                    backgroundColor: "#e3f2fd",
                    color: "#0066cc",
                    border: "1px solid #0066cc",
                    fontSize: "0.75rem",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default GameFilterSection;
