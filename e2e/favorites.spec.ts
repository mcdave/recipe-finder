import { test, expect } from "@playwright/test";
import { mockRecipes } from "../src/mocks/mockRecipes";

test.beforeEach(async ({ page }) => {
  // Set up route interception
  await page.route(
    "https://api.spoonacular.com/recipes/complexSearch*",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: mockRecipes.map(({ id, title, image }) => ({
            id,
            title,
            image,
          })),
          totalResults: mockRecipes.length,
        }),
      });
    }
  );

  await page.route(
    "https://api.spoonacular.com/recipes/*/information*",
    async (route) => {
      const url = route.request().url();
      const idMatch = url.match(/\/recipes\/(\d+)\/information/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        const recipe = mockRecipes.find((r) => r.id === id);

        if (recipe) {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(recipe),
          });
        } else {
          await route.fulfill({ status: 404 });
        }
      } else {
        await route.continue();
      }
    }
  );

  // Navigate to the homepage
  await page.goto("/");
});

test("favorites flow - add and remove favorites", async ({ page }) => {
  // Search for a recipe
  await page.getByPlaceholder("Search for recipes...").fill("burger");
  await page.getByRole("button", { name: "Search" }).click();

  // Wait for search results
  await expect(page.getByText("Classic Beef Burger")).toBeVisible();

  // Add recipe to favorites
  await page.getByTestId("favorite-button-3").click(); // Using ID 1 for Classic Beef Burger

  // Navigate to favorites page
  await page.getByRole("link", { name: "Favorites" }).click();

  // Verify recipe is in favorites
  await expect(page.getByText("Classic Beef Burger")).toBeVisible();

  // Remove from favorites
  await page.getByTestId("favorite-button-3").click();

  // Verify recipe is removed from favorites
  await expect(page.getByText("Classic Beef Burger")).not.toBeVisible();
  await expect(page.getByText("No favorites yet")).toBeVisible();
});

test("favorites flow - favorites persist after page reload", async ({
  page,
}) => {
  // Search for a recipe
  await page.getByPlaceholder("Search for recipes...").fill("spaghetti");
  await page.getByRole("button", { name: "Search" }).click();

  // Wait for search results
  await expect(page.getByText("Spaghetti Carbonara")).toBeVisible();

  // Add recipe to favorites
  await page.getByTestId("favorite-button-1").click();

  // Reload the page
  await page.reload();

  // Navigate to favorites page
  await page.getByRole("link", { name: "Favorites" }).click();

  // Verify recipe is still in favorites
  await expect(page.getByText("Spaghetti Carbonara")).toBeVisible();
});

test("favorites flow - navigate to recipe details from favorites", async ({
  page,
}) => {
  // Search for a recipe
  await page.getByPlaceholder("Search for recipes...").fill("spaghetti");
  await page.getByRole("button", { name: "Search" }).click();

  // Add recipe to favorites
  await page.getByTestId("favorite-button-1").click();

  // Navigate to favorites page
  await page.getByRole("link", { name: "Favorites" }).click();

  // Click on the recipe card
  await page.getByText("Spaghetti Carbonara").click();

  // Verify recipe details page
  await expect(
    page.getByRole("heading", { name: "Spaghetti Carbonara" })
  ).toBeVisible();
  await expect(page.getByText("30 minutes")).toBeVisible();
  await expect(page.getByText("4 servings")).toBeVisible();
});
