import { Recipe } from "../types/recipe";

/**
 * Check if a recipe is in favorites
 */
export const isRecipeFavorite = (recipe: Recipe): boolean => {
  const favorites = getFavorites();
  return favorites.some((fav) => fav.id === recipe.id);
};

/**
 * Get all favorite recipes from localStorage
 */
export const getFavorites = (): Recipe[] => {
  try {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  } catch (error) {
    console.error("Error parsing favorites:", error);
    return [];
  }
};

/**
 * Add a recipe to favorites
 */
export const addToFavorites = (recipe: Recipe): Recipe[] => {
  const favorites = getFavorites();

  // Check if recipe is already in favorites
  if (!isRecipeFavorite(recipe)) {
    const updatedFavorites = [...favorites, recipe];
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    return updatedFavorites;
  }

  return favorites;
};

/**
 * Remove a recipe from favorites
 */
export const removeFromFavorites = (recipe: Recipe): Recipe[] => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter((fav) => fav.id !== recipe.id);
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  return updatedFavorites;
};

/**
 * Toggle a recipe's favorite status
 */
export const toggleFavorite = (
  recipe: Recipe
): { favorites: Recipe[]; isFavorite: boolean } => {
  const isFavorite = isRecipeFavorite(recipe);

  if (isFavorite) {
    const updatedFavorites = removeFromFavorites(recipe);
    return { favorites: updatedFavorites, isFavorite: false };
  } else {
    const updatedFavorites = addToFavorites(recipe);
    return { favorites: updatedFavorites, isFavorite: true };
  }
};
