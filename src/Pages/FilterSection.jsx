import React from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import FilterControls from "./FilterControls";
import { PUNT_CATEGORIES } from "../constants/categories";

const FilterSection = ({
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
  seasons,
  filterTypes,
  filterValueSuggestions,
  operators,
  onPlayerSearch,
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          flexWrap: "wrap",
          mb: puntedCategories.length > 0 ? 1 : 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", flex: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#003366", minWidth: "100px" }}
          >
            Punt Categories:
          </Typography>
          {PUNT_CATEGORIES.map((cat) => (
            <FormControlLabel
              key={cat.key}
              control={
                <Checkbox
                  checked={puntedCategories.includes(cat.key)}
                  onChange={() => onPuntToggle(cat.key)}
                  size="small"
                  sx={{
                    "&.Mui-checked": {
                      color: "#0066cc",
                    },
                  }}
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
        </Box>

        <Button
          onClick={() => onToggleAdvanced(!showAdvancedFilters)}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "#003366",
            fontSize: "0.875rem",
            minWidth: "fit-content",
          }}
        >
          {showAdvancedFilters ? "▼" : "►"} Advanced Filters
        </Button>
      </Box>

      {puntedCategories.length > 0 && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: showAdvancedFilters ? 1 : 0,
            color: "#666",
            fontSize: "0.75rem",
          }}
        >
          Excluding: {PUNT_CATEGORIES.filter((c) => puntedCategories.includes(c.key))
            .map((c) => c.label)
            .join(", ")}
        </Typography>
      )}

      {showAdvancedFilters && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FilterControls
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
            onPlayerSearch={onPlayerSearch}
          />

          <Box sx={{ mt: 2 }}>
            {filters.map((filter, index) => (
              <Chip
                key={index}
                label={filter.label}
                onDelete={() => onDeleteFilter(index)}
                size="small"
                sx={{
                  mr: 1,
                  mb: 1,
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #ddd",
                  fontSize: "0.75rem",
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FilterSection;
