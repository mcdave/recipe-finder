import { Recipe, SearchResponse, SearchFilters } from "../types/recipe";

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com/recipes";

function isIngredient(str: string) {
  const normalizedStr = str.trim().toLowerCase();

  // Check for disallowed characters (adjust based on expected input)
  if (/[^\w\s\/.,-]/i.test(normalizedStr)) {
    return false;
  }

  // Common units (abbreviated and full)
  const units = [
    "tsp",
    "tbsp",
    "cup",
    "cups",
    "g",
    "kg",
    "ml",
    "l",
    "oz",
    "lb",
    "teaspoon",
    "tablespoon",
    "gram",
    "kilogram",
    "milliliter",
    "liter",
    "ounce",
    "pound",
  ];

  // Check for quantity (optional) and unit (optional)
  const quantityUnitRegex = new RegExp(
    `^\\s*((\\d+\\s*(\\/\\d+)?|\\.\\d+)\\s*)?(${units.join("|")})s?\\b\\.?\\s*`,
    "i"
  );
  const hasQuantityUnit = quantityUnitRegex.test(normalizedStr);

  // Extract the food part
  let foodPart = normalizedStr.replace(quantityUnitRegex, "").trim();
  if (!hasQuantityUnit) foodPart = normalizedStr;

  // Check food part validity
  const hasValidStructure = /^[a-z]+([-\s][a-z]+)*$/.test(foodPart);
  const hasVowels = /[aeiou]/i.test(foodPart);
  const minLength = foodPart.length >= 3;

  // Common ingredient keywords (expand as needed)
  const commonTerms = [
    "salt",
    "sugar",
    "flour",
    "oil",
    "water",
    "pepper",
    "herb",
    "spice",
    "garlic",
    "onion",
    "tomato",
    "milk",
    "butter",
    "egg",
    "vanilla",
  ];

  const hasCommonTerm = commonTerms.some((term) => foodPart.includes(term));

  return (hasValidStructure && hasVowels && minLength) || hasCommonTerm;
}

export const searchRecipes = async (
  query: string,
  filters?: SearchFilters
): Promise<SearchResponse> => {
  // Validate query
  if (!query || !query.trim()) {
    throw new Error("Please enter valid ingredients or a recipe name");
  }

  // Check if query is too short
  if (query.trim().length < 2) {
    throw new Error("Search term is too short");
  }

  // check if query does not look like an ingredient
  if (!isIngredient(query)) {
    throw new Error("Please enter valid ingredients or a recipe name");
  }

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

  try {
    const response = await fetch(`${BASE_URL}/complexSearch?${params}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (errorData?.message) {
        throw new Error(errorData.message);
      }
      throw new Error(`Failed to fetch recipes (Status: ${response.status})`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch recipes. Please try again later.");
  }
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
