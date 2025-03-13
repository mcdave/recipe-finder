import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FavoriteButton from "../FavoriteButton";
import { Recipe } from "../../types/recipe";

describe("FavoriteButton", () => {
  const mockRecipe: Recipe = {
    id: 1,
    title: "Test Recipe",
    image: "https://example.com/image.jpg",
    readyInMinutes: 30,
    servings: 4,
    summary: "A delicious test recipe",
  };

  const mockOnToggle = vi.fn();

  it('renders with "Add to favorites" label when not favorite', () => {
    render(
      <FavoriteButton
        recipe={mockRecipe}
        isFavorite={false}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });

  it('renders with "Remove from favorites" label when favorite', () => {
    render(
      <FavoriteButton
        recipe={mockRecipe}
        isFavorite={true}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByLabelText("Remove from favorites")).toBeInTheDocument();
  });

  it("calls onToggle with recipe when clicked", () => {
    render(
      <FavoriteButton
        recipe={mockRecipe}
        isFavorite={false}
        onToggle={mockOnToggle}
      />
    );

    const button = screen.getByLabelText("Add to favorites");
    fireEvent.click(button);

    expect(mockOnToggle).toHaveBeenCalledWith(mockRecipe);
  });

  it("prevents event propagation when clicked", () => {
    render(
      <FavoriteButton
        recipe={mockRecipe}
        isFavorite={false}
        onToggle={mockOnToggle}
      />
    );

    const button = screen.getByLabelText("Add to favorites");

    // Create a mock click handler for the parent
    const mockParentClickHandler = vi.fn();

    // Add a click event listener to the parent
    document.body.addEventListener("click", mockParentClickHandler);

    // Click the button
    fireEvent.click(button);

    // Check that onToggle was called
    expect(mockOnToggle).toHaveBeenCalledWith(mockRecipe);

    // Check that the parent click handler was not called
    // This verifies that stopPropagation was called
    expect(mockParentClickHandler).not.toHaveBeenCalled();

    // Clean up
    document.body.removeEventListener("click", mockParentClickHandler);
  });

  it("applies custom className when provided", () => {
    const customClass = "test-custom-class";

    render(
      <FavoriteButton
        recipe={mockRecipe}
        isFavorite={false}
        onToggle={mockOnToggle}
        className={customClass}
      />
    );

    const button = screen.getByLabelText("Add to favorites");
    expect(button.className).toContain(customClass);
  });
});
