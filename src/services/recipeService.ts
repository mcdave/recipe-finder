import { Recipe, SearchResponse, SearchFilters } from "../types/recipe";

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com/recipes";

export const searchRecipes = async (
  query: string,
  filters?: SearchFilters
): Promise<SearchResponse> => {
  const params = new URLSearchParams({
    apiKey: API_KEY,
    query,
    number: "12",
    addRecipeInformation: "true",
  });

  if (filters?.diet) {
    params.append("diet", filters.diet);
  }

  if (filters?.intolerances?.length) {
    params.append("intolerances", filters.intolerances.join(","));
  }

  if (filters?.cuisine) {
    params.append("cuisine", filters.cuisine);
  }

  const response = await fetch(`${BASE_URL}/complexSearch?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return response.json();
};

export const getRecipeById = async (id: number): Promise<Recipe> => {
  const params = new URLSearchParams({
    apiKey: API_KEY,
  });

  const response = await fetch(`${BASE_URL}/${id}/information?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch recipe details");
  }

  return response.json();
};
