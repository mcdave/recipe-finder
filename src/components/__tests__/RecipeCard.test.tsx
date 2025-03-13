import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeCard from "../RecipeCard";
import { Recipe } from "../../types/recipe";
import * as favoriteUtils from "../../utils/favoriteUtils";

// Mock the favoriteUtils module
vi.mock("../../utils/favoriteUtils", () => ({
  isRecipeFavorite: vi.fn(),
}));

describe("RecipeCard", () => {
  const mockRecipe: Recipe = {
    id: 1,
    title: "Test Recipe",
    image: "https://example.com/image.jpg",
    readyInMinutes: 30,
    servings: 4,
    summary: "A delicious test recipe",
  };

  const mockOnClick = vi.fn();
  const mockOnFavoriteToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation
    vi.mocked(favoriteUtils.isRecipeFavorite).mockReturnValue(false);
  });

  it("renders recipe information correctly", () => {
    render(<RecipeCard recipe={mockRecipe} onClick={mockOnClick} />);

    // Check if title is rendered
    expect(screen.getByText("Test Recipe")).toBeInTheDocument();

    // Check if cooking time is rendered
    expect(screen.getByText(/30 mins/)).toBeInTheDocument();

    // Check if servings are rendered
    expect(screen.getByText(/4 servings/)).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    render(<RecipeCard recipe={mockRecipe} onClick={mockOnClick} />);

    fireEvent.click(
      screen.getByRole("button", { name: /View recipe for Test Recipe/i })
    );
    expect(mockOnClick).toHaveBeenCalledWith(mockRecipe.id);
  });

  it("calls onClick when Enter key is pressed", () => {
    render(<RecipeCard recipe={mockRecipe} onClick={mockOnClick} />);

    fireEvent.keyDown(
      screen.getByRole("button", { name: /View recipe for Test Recipe/i }),
      { key: "Enter" }
    );
    expect(mockOnClick).toHaveBeenCalledWith(mockRecipe.id);
  });

  it("shows favorite button when onFavoriteToggle is provided", () => {
    render(
      <RecipeCard
        recipe={mockRecipe}
        onClick={mockOnClick}
        onFavoriteToggle={mockOnFavoriteToggle}
      />
    );

    // FavoriteButton should be in the document
    // Note: This assumes FavoriteButton has a role or accessible name
    // You might need to adjust this based on your actual implementation
    const favoriteButton = document.querySelector('[aria-label*="favorite"]');
    expect(favoriteButton).toBeInTheDocument();
  });

  it("does not show favorite button when onFavoriteToggle is not provided", () => {
    render(<RecipeCard recipe={mockRecipe} onClick={mockOnClick} />);

    // FavoriteButton should not be in the document
    const favoriteButton = document.querySelector('[aria-label*="favorite"]');
    expect(favoriteButton).not.toBeInTheDocument();
  });

  it("handles image loading error", () => {
    render(<RecipeCard recipe={mockRecipe} onClick={mockOnClick} />);

    // Simulate image error
    fireEvent.error(screen.getByAltText(`${mockRecipe.title} dish`));

    // Check if fallback text is displayed
    expect(screen.getByText("No image available")).toBeInTheDocument();
  });
});
