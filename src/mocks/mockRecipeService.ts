import { Recipe, SearchFilters, SearchResponse } from "../types/recipe";
import { mockRecipes } from "./mockRecipes";

// Mock implementation of searchRecipes
export const mockSearchRecipes = async (
  query: string,
  filters?: SearchFilters
): Promise<SearchResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Filter recipes based on search query and filters
  let filteredRecipes = [...mockRecipes];

  // Simple search by title (case insensitive)
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredRecipes = filteredRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(lowerQuery) ||
        recipe.summary.toLowerCase().includes(lowerQuery)
    );
  }

  // Apply diet filter
  if (filters?.diet) {
    const dietLower = filters.diet.toLowerCase();
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.diets?.includes(dietLower)
    );
  }

  // Apply cuisine filter
  if (filters?.cuisine) {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.cuisines?.some(
        (cuisine) => cuisine.toLowerCase() === filters.cuisine?.toLowerCase()
      )
    );
  }

  // Apply intolerances filter (exclude recipes with these ingredients)
  if (filters?.intolerances?.length) {
    const intolerancesLower = filters.intolerances.map((i) => i.toLowerCase());

    filteredRecipes = filteredRecipes.filter((recipe) => {
      // This is a simplified check - in a real app, you'd need more sophisticated allergen detection
      const ingredients =
        recipe.extendedIngredients?.map((ing) => ing.name.toLowerCase()) || [];
      return !intolerancesLower.some((intolerance) =>
        ingredients.includes(intolerance.toLowerCase())
      );
    });
  }

  return {
    results: filteredRecipes,
    offset: 0,
    number: filteredRecipes.length,
    totalResults: filteredRecipes.length,
  };
};

// Mock implementation of getRecipeById
export const mockGetRecipeById = async (id: number): Promise<Recipe> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const recipe = mockRecipes.find((recipe) => recipe.id === id);

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  return recipe;
};
