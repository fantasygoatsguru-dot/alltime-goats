/**
 * Parse filter query parameters and convert them to filter objects
 * Supports: season, teamNames, nationalities, positions, and numeric filters
 */
export const parseQueryFilters = (searchParams, filterTypes, filterValueSuggestions, operators) => {
  if (!searchParams) return [];

  const filters = [];

  // Handle season filter
  if (searchParams.has("season")) {
    const seasonValue = searchParams.get("season");
    const filterType = filterTypes.find(f => f.key === "season");
    if (filterType) {
      filters.push({
        key: "season",
        value: [seasonValue], // Keep as array for consistency
        operator: "=",
        isNumeric: true,
        label: `Season: = ${seasonValue}`,
      });
    }
  }

  // Handle multi-select filters (teamNames, nationalities, positions, playerNames)
  ["teamNames", "nationalities", "positions", "playerNames"].forEach(filterKey => {
    if (searchParams.has(filterKey)) {
      const values = searchParams.get(filterKey).split(",");
      const filterType = filterTypes.find(f => f.key === filterKey);
      if (filterType && filterValueSuggestions[filterKey]) {
        const selectedValues = values.filter(v => v.trim());
        if (selectedValues.length > 0) {
          filters.push({
            key: filterKey,
            value: selectedValues,
            isMulti: true,
            label: `${filterType.label}: ${selectedValues.map(v => {
              const suggestion = filterValueSuggestions[filterKey].find(s => s.value === v);
              return suggestion ? suggestion.label : v;
            }).join(", ")}`,
          });
        }
      }
    }
  });

  // Handle numeric filters
  const numericParams = ["points", "rebounds", "assists", "steals", "blocks", "three_pointers", "turnovers", "seasonExperience", "fgPercentage", "ftPercentage"];
  numericParams.forEach(paramKey => {
    if (searchParams.has(paramKey)) {
      const value = searchParams.get(paramKey);
      const operator = searchParams.get(`${paramKey}_op`) || "=";
      const filterType = filterTypes.find(f => f.key === paramKey);
      if (filterType && value) {
        filters.push({
          key: paramKey,
          value: value,
          operator: operator,
          isNumeric: true,
          label: `${filterType.label}: ${operator} ${value}${paramKey.includes("Percentage") ? "%" : ""}`,
        });
      }
    }
  });

  return filters;
};

/**
 * Convert current filters to query parameter string
 */
export const filtersToQueryParams = (filters) => {
  const params = new URLSearchParams();

  filters.forEach(filter => {
    if (filter.key === "season" && filter.value.length > 0) {
      params.set("season", filter.value[0]);
    } else if (filter.isMulti && filter.value.length > 0) {
      params.set(filter.key, filter.value.join(","));
    } else if (filter.isNumeric && filter.value) {
      params.set(filter.key, filter.value);
      if (filter.operator && filter.operator !== "=") {
        params.set(`${filter.key}_op`, filter.operator);
      }
    } else if (filter.isHeight && filter.value) {
      params.set(filter.key, filter.value);
      if (filter.operator && filter.operator !== "=") {
        params.set(`${filter.key}_op`, filter.operator);
      }
    }
  });

  return params;
};
