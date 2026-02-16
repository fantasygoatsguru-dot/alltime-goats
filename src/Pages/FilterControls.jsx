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

const FilterControls = ({
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
    <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", marginTop: 2 }}>
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
              width: 200,
              backgroundColor: "#fff",
              "& .MuiInputBase-input": { color: "#000", fontSize: "0.875rem" },
              "& .MuiInputLabel-root": { color: "#666", fontSize: "0.875rem" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ddd" },
                "&:hover fieldset": { borderColor: "#0066cc" },
              },
            }}
          />
        )}
        sx={{ width: 200 }}
      />

      {filterType?.isNumeric || filterType?.isHeight ? (
        <>
          <FormControl size="small" sx={{ width: 100 }}>
            <InputLabel sx={{ color: "#666", fontSize: "0.875rem" }}>Operator</InputLabel>
            <Select
              value={filterOperator}
              onChange={(e) => onFilterOperatorChange(e.target.value)}
              sx={{
                backgroundColor: "#fff",
                color: "#000",
                fontSize: "0.875rem",
                "& .MuiSvgIcon-root": { color: "#666" },
                "& fieldset": { borderColor: "#ddd" },
                "&:hover fieldset": { borderColor: "#0066cc" },
              }}
            >
              {operators.map((op) => (
                <MenuItem key={op.value} value={op.value} sx={{ fontSize: "0.875rem" }}>
                  {op.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={
              filterType.key === "season" ? "Year" : filterType?.isHeight ? "Height (ft-in)" : "Value"
            }
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
              backgroundColor: "#fff",
              "& .MuiInputBase-input": { color: "#000", fontSize: "0.875rem" },
              "& .MuiInputLabel-root": { color: "#666", fontSize: "0.875rem" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ddd" },
                "&:hover fieldset": { borderColor: "#0066cc" },
              },
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
                width: 250,
                backgroundColor: "#fff",
                "& .MuiInputBase-input": { color: "#000", fontSize: "0.875rem" },
                "& .MuiInputLabel-root": { color: "#666", fontSize: "0.875rem" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ddd" },
                  "&:hover fieldset": { borderColor: "#0066cc" },
                },
              }}
            />
          )}
          sx={{ width: 250 }}
        />
      )}

      <Button
        variant="contained"
        size="small"
        onClick={onAddFilter}
        disabled={!filterType || (!filterValue?.length && !filterNumericValue)}
        sx={{
          backgroundColor: "#0066cc",
          color: "#fff",
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
        size="small"
        onClick={onClearFilters}
        sx={{
          color: "#666",
          borderColor: "#ddd",
          "&:hover": { borderColor: "#0066cc", backgroundColor: "rgba(0, 102, 204, 0.04)" },
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
        }}
      >
        Clear Filters
      </Button>
    </Box>
  );
};

export default FilterControls;
