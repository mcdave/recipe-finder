import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isRecipeFavorite,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
} from "../favoriteUtils";
import { Recipe } from "../../types/recipe";

describe("favoriteUtils", () => {
  // Mock recipe for testing
  const mockRecipe: Recipe = {
    id: 1,
    title: "Test Recipe",
    image: "https://example.com/image.jpg",
    readyInMinutes: 30,
    servings: 4,
    summary: "A delicious test recipe",
  };

  const mockRecipe2: Recipe = {
    id: 2,
    title: "Another Recipe",
    image: "https://example.com/image2.jpg",
    readyInMinutes: 45,
    servings: 2,
    summary: "Another delicious test recipe",
  };

  // Setup and teardown
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    // Spy on console.error
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("getFavorites", () => {
    it("returns an empty array when no favorites exist", () => {
      // Mock localStorage.getItem to return null
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      const favorites = getFavorites();
      expect(favorites).toEqual([]);
      expect(localStorage.getItem).toHaveBeenCalledWith("favorites");
    });

    it("returns parsed favorites from localStorage", () => {
      // Mock localStorage.getItem to return a JSON string
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify([mockRecipe])
      );

      const favorites = getFavorites();
      expect(favorites).toEqual([mockRecipe]);
      expect(localStorage.getItem).toHaveBeenCalledWith("favorites");
    });

    it("returns empty array and logs error when JSON is invalid", () => {
      // Mock localStorage.getItem to return invalid JSON
      vi.mocked(localStorage.getItem).mockReturnValue("invalid-json");

      const favorites = getFavorites();
      expect(favorites).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("isRecipeFavorite", () => {
    it("returns false when recipe is not in favorites", () => {
      // Mock getFavorites to return an array with a different recipe
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify([mockRecipe2])
      );

      const result = isRecipeFavorite(mockRecipe);
      expect(result).toBe(false);
    });

    it("returns true when recipe is in favorites", () => {
      // Mock getFavorites to return an array with the recipe
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify([mockRecipe, mockRecipe2])
      );

      const result = isRecipeFavorite(mockRecipe);
      expect(result).toBe(true);
    });
  });

  describe("addToFavorites", () => {
    it("adds a recipe to favorites when not already present", () => {
      // Mock getFavorites to return an array with a different recipe
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify([mockRecipe2])
      );

      const updatedFavorites = addToFavorites(mockRecipe);
      expect(updatedFavorites).toEqual([mockRecipe2, mockRecipe]);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([mockRecipe2, mockRecipe])
      );
    });

    it("does not add a recipe when already in favorites", () => {
      // Mock getFavorites to return an array with the recipe
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify([mockRecipe])
      );

      const updatedFavorites = addToFavorites(mockRecipe);
      expect(updatedFavorites).toEqual([mockRecipe]);
      // localStorage.setItem should not be called with the same recipe again
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe("removeFromFavorites", () => {
    it("removes a recipe from favorites", () => {
      // Mock getFavorites to return an array with both recipes
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify([mockRecipe, mockRecipe2])
      );

      const updatedFavorites = removeFromFavorites(mockRecipe);
      expect(updatedFavorites).toEqual([mockRecipe2]);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([mockRecipe2])
      );
    });

    it("returns unchanged array when recipe is not in favorites", () => {
      // Mock getFavorites to return an array without the recipe
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify([mockRecipe2])
      );

      const updatedFavorites = removeFromFavorites(mockRecipe);
      expect(updatedFavorites).toEqual([mockRecipe2]);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([mockRecipe2])
      );
    });
  });

  describe("toggleFavorite", () => {
    it("adds recipe to favorites when not already present", () => {
      // Mock getFavorites to return an empty array
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify([]));

      const result = toggleFavorite(mockRecipe);
      expect(result).toEqual({
        favorites: [mockRecipe],
        isFavorite: true,
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([mockRecipe])
      );
    });

    it("removes recipe from favorites when already present", () => {
      // Mock getFavorites to return an array with both recipes
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify([mockRecipe, mockRecipe2])
      );

      const result = toggleFavorite(mockRecipe);
      expect(result).toEqual({
        favorites: [mockRecipe2],
        isFavorite: false,
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([mockRecipe2])
      );
    });
  });
});
