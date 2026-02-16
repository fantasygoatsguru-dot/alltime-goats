import React from "react";
import {
  Box,
  Button,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const GameFilterControls = ({
  filterType,
  onFilterTypeChange,
  filterValue,
  onFilterValueChange,
  filterOperator,
  onFilterOperatorChange,
  filterNumericValue,
  onFilterNumericValueChange,
  onAddFilter,
  onClearFilters,
  filterTypes,
  filterValueSuggestions,
  operators,
  onPlayerSearch,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center", flexWrap: "wrap" }}>
      <Autocomplete
        options={filterTypes}
        getOptionLabel={(option) => option?.label || "Select filter type"}
        value={filterType}
        onChange={onFilterTypeChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Filter Type"
            placeholder="Select filter type"
            variant="outlined"
            size="small"
            sx={{
              width: 180,
              backgroundColor: "#ffffff",
              "& .MuiInputBase-input": { fontSize: "0.875rem" },
            }}
          />
        )}
        sx={{ width: 180 }}
      />

      {filterType?.isNumeric || filterType?.isHeight ? (
        <>
          <FormControl size="small" sx={{ width: 90 }}>
            <InputLabel>Operator</InputLabel>
            <Select
              value={filterOperator}
              onChange={(e) => onFilterOperatorChange(e.target.value)}
              sx={{
                backgroundColor: "#ffffff",
                fontSize: "0.875rem",
              }}
            >
              {operators.map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  {op.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={filterType.key === "season" ? "Year" : filterType?.isHeight ? "Height (ft-in)" : "Value"}
            placeholder={
              filterType.key === "season" ? "e.g. 2020" : filterType?.isHeight ? "e.g. 6-10" : "Enter value"
            }
            value={filterNumericValue}
            onChange={(e) => onFilterNumericValueChange(e.target.value)}
            type={filterType?.isHeight ? "text" : "number"}
            variant="outlined"
            size="small"
            sx={{
              width: 150,
              backgroundColor: "#ffffff",
              "& .MuiInputBase-input": { fontSize: "0.875rem" },
            }}
          />
        </>
      ) : (
        <Autocomplete
          multiple={filterType?.isMulti}
          options={filterValueSuggestions[filterType?.key] || []}
          getOptionLabel={(option) => option?.label || "Select value"}
          value={filterValue}
          onChange={(event, newValue) => onFilterValueChange(newValue || [])}
          onInputChange={(event, value) => {
            // Call player search if this is the player filter
            if (filterType?.key === "playerNames" && onPlayerSearch) {
              onPlayerSearch(value);
            }
          }}
          disabled={!filterType}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter Value"
              placeholder={filterType ? "Select value" : "Select filter type first"}
              variant="outlined"
              size="small"
              sx={{
                width: 220,
                backgroundColor: "#ffffff",
                "& .MuiInputBase-input": { fontSize: "0.875rem" },
              }}
            />
          )}
          sx={{ width: 220 }}
        />
      )}

      <Button
        variant="contained"
        onClick={onAddFilter}
        disabled={!filterType || (!filterValue?.length && !filterNumericValue)}
        size="small"
        sx={{
          backgroundColor: "#0066cc",
          color: "#ffffff",
          "&:hover": { backgroundColor: "#0052a3" },
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
        }}
      >
        Add Filter
      </Button>

      <Button
        variant="outlined"
        onClick={onClearFilters}
        size="small"
        sx={{
          color: "#0066cc",
          borderColor: "#0066cc",
          "&:hover": { borderColor: "#0052a3", backgroundColor: "rgba(0, 102, 204, 0.04)" },
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
        }}
      >
        Clear All
      </Button>
    </Box>
  );
};

export default GameFilterControls;
