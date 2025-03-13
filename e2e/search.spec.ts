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

test("search flow - displays recipes and navigates to details", async ({
  page,
}) => {
  // Type in search query
  await page.getByPlaceholder("Search for recipes...").fill("burger");
  await page.getByRole("button", { name: "Search" }).click();

  // Wait for and verify search results
  await expect(page.getByText("Classic Beef Burger")).toBeVisible();

  // Click on a recipe card
  await page.getByText("Classic Beef Burger").click();

  // Verify recipe details page
  await expect(
    page.getByRole("heading", { name: "Classic Beef Burger" })
  ).toBeVisible();
  await expect(page.getByText("35 minutes")).toBeVisible();
  await expect(page.getByText("4 servings")).toBeVisible();

  // Verify ingredients are displayed - use more specific selectors
  await expect(page.getByText("500g ground beef")).toBeVisible();
  await expect(page.getByText("4 burger buns")).toBeVisible();
});

test("search flow - handles no results", async ({ page }) => {
  // Override the search route for this specific test
  await page.route(
    "https://api.spoonacular.com/recipes/complexSearch*",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [],
          totalResults: 0,
        }),
      });
    }
  );

  // Type in search query that will yield no results
  await page.getByPlaceholder("Search for recipes...").fill("xyz123");
  await page.getByRole("button", { name: "Search" }).click();

  // Verify no results message
  await expect(
    page.getByText("Please enter valid ingredients or a recipe name")
  ).toBeVisible();
});

test("search flow - empty search validation", async ({ page }) => {
  // Try to search with empty input
  await page.getByRole("button", { name: "Search" }).click();

  // Verify error message
  await expect(
    page.getByText("Please enter ingredients or a recipe name")
  ).toBeVisible();
});
