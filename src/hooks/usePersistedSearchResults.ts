import { useState, useEffect } from "react";
import { Recipe } from "../types/recipe";

export const usePersistedSearchResults = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    // Initialize from localStorage if available
    const savedRecipes = localStorage.getItem("searchResults");
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });

  const [lastQuery, setLastQuery] = useState<string>(() => {
    return localStorage.getItem("lastQuery") || "";
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(() => {
    const savedError = localStorage.getItem("searchError");
    return savedError || null;
  });

  // Save to localStorage whenever recipes or lastQuery changes
  useEffect(() => {
    localStorage.setItem("searchResults", JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem("lastQuery", lastQuery);
  }, [lastQuery]);

  useEffect(() => {
    if (error) {
      localStorage.setItem("searchError", error);
    } else {
      localStorage.removeItem("searchError");
    }
  }, [error]);

  return {
    recipes,
    setRecipes,
    lastQuery,
    setLastQuery,
    loading,
    setLoading,
    error,
    setError,
  };
};
