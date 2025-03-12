import { useState, useEffect } from "react";
import { SearchFilters } from "../types/recipe";

const STORAGE_KEY = "recipe-finder-filters";

export const usePersistedFilters = () => {
  // Initialize state from localStorage or empty object
  const [filters, setFilters] = useState<SearchFilters>(() => {
    const savedFilters = localStorage.getItem(STORAGE_KEY);
    return savedFilters ? JSON.parse(savedFilters) : {};
  });

  // Save to localStorage whenever filters change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const updateFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const removeFilter = (type: keyof SearchFilters, value?: string) => {
    if (type === "intolerances" && value) {
      setFilters({
        ...filters,
        intolerances: filters.intolerances?.filter((i) => i !== value),
      });
    } else {
      const newFilters = { ...filters };
      delete newFilters[type];
      setFilters(newFilters);
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    filters,
    setFilters,
    updateFilters,
    removeFilter,
    clearFilters,
  };
};
