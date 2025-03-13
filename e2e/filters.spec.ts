import { test, expect } from "@playwright/test";
import { mockRecipes } from "../src/mocks/mockRecipes";

test.beforeEach(async ({ page }) => {
  // Set up route interception for default search
  await page.route(
    "https://api.spoonacular.com/recipes/complexSearch*",
    async (route) => {
      const url = new URL(route.request().url());
      const diet = url.searchParams.get("diet");
      const intolerances = url.searchParams.get("intolerances");
      const cuisine = url.searchParams.get("cuisine");

      let filteredRecipes = [...mockRecipes];

      // Apply diet filter
      if (diet) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) => recipe.diets && recipe.diets.includes(diet.toLowerCase())
        );
      }

      // Apply intolerances filter
      if (intolerances) {
        const intolerancesList = intolerances.split(",");
        filteredRecipes = filteredRecipes.filter((recipe) =>
          intolerancesList.every((intolerance) =>
            recipe.diets?.includes(intolerance.toLowerCase())
          )
        );
      }

      // Apply cuisine filter
      if (cuisine) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) => recipe.cuisines && recipe.cuisines.includes(cuisine)
        );
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: filteredRecipes.map(({ id, title, image }) => ({
            id,
            title,
            image,
          })),
          totalResults: filteredRecipes.length,
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

// Helper function to ensure filters are visible on mobile
async function ensureFiltersVisible(page) {
  // Check if we're in mobile view (filters toggle button is visible)
  const toggleButton = page.getByRole("button", { name: "Toggle filters" });
  if (await toggleButton.isVisible()) {
    await toggleButton.click();
  }
}

test("filter sections expand and collapse correctly", async ({ page }) => {
  await ensureFiltersVisible(page);

  // Initially all sections should be collapsed
  await expect(page.getByRole("combobox", { name: "Diet" })).not.toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Cuisine" })
  ).not.toBeVisible();

  // Open diet section and verify select is visible
  await page.getByRole("button", { name: "Diet" }).click();
  await expect(page.getByRole("combobox", { name: "Diet" })).toBeVisible();

  // Select vegetarian diet
  await page.getByRole("combobox", { name: "Diet" }).selectOption("Vegetarian");

  // Verify the selection was made
  await expect(page.getByRole("combobox", { name: "Diet" })).toHaveValue(
    "Vegetarian"
  );

  // Open cuisine section
  await page.getByRole("button", { name: "Cuisine" }).click();
  await expect(page.getByRole("combobox", { name: "Cuisine" })).toBeVisible();

  // Close diet section
  await page.getByRole("button", { name: "Diet" }).click();
  await expect(page.getByRole("combobox", { name: "Diet" })).not.toBeVisible();
});

test("filter flow - dietary restrictions with badge", async ({ page }) => {
  await ensureFiltersVisible(page);

  // Open diet section
  await page.getByRole("button", { name: "Diet" }).click();

  // Select vegetarian diet
  await page.getByRole("combobox", { name: "Diet" }).selectOption("Vegetarian");

  // Verify the selection was made
  await expect(page.getByRole("combobox", { name: "Diet" })).toHaveValue(
    "Vegetarian"
  );

  // Verify filter badge appears
  const dietButton = page.getByRole("button", { name: "Diet" });
  await expect(dietButton.getByText("1")).toBeVisible();

  // Search for recipes
  await page.getByPlaceholder("Search for recipes...").fill("vegetarian");
  await page.getByRole("button", { name: "Search" }).click();

  // Verify filtered results
  await expect(page.getByText("Vegetarian Buddha Bowl")).toBeVisible();
  await expect(page.getByText("Classic Beef Burger")).not.toBeVisible();
});

test("filter flow - multiple intolerances with badge", async ({ page }) => {
  await ensureFiltersVisible(page);

  // Open intolerances section
  await page.getByRole("button", { name: "Intolerances" }).click();

  // Select multiple intolerances
  await page.getByLabel("Gluten").check();
  await page.getByLabel("Dairy").check();

  // Verify filter badge shows count of 2
  const intolerancesButton = page.getByRole("button", { name: "Intolerances" });
  await expect(intolerancesButton.getByText("2")).toBeVisible();

  // Verify active filters are displayed
  await expect(page.getByText("Active Filters")).toBeVisible();
  await expect(page.getByText("Gluten").first()).toBeVisible();
  await expect(page.getByText("Dairy").first()).toBeVisible();
});

test("filter flow - cuisine selection with badge", async ({ page }) => {
  await ensureFiltersVisible(page);

  // Open cuisine section
  await page.getByRole("button", { name: "Cuisine" }).click();

  // Select Italian cuisine
  await page.getByRole("combobox", { name: "Cuisine" }).selectOption("Italian");

  // Verify the selection was made
  await expect(page.getByRole("combobox", { name: "Cuisine" })).toHaveValue(
    "Italian"
  );

  // Verify filter badge appears
  const cuisineButton = page.getByRole("button", { name: "Cuisine" });
  await expect(cuisineButton.getByText("1")).toBeVisible();

  // Search for recipes
  await page.getByPlaceholder("Search for recipes...").fill("pasta");
  await page.getByRole("button", { name: "Search" }).click();

  // Verify filtered results
  await expect(page.getByText("Spaghetti Carbonara")).toBeVisible();
  await expect(page.getByText("Classic Beef Burger")).not.toBeVisible();
});

test("filter flow - clear all filters", async ({ page }) => {
  await ensureFiltersVisible(page);

  // Open filter sections
  await page.getByRole("button", { name: "Diet" }).click();
  await page.getByRole("button", { name: "Intolerances" }).click();
  await page.getByRole("button", { name: "Cuisine" }).click();

  // Apply multiple filters
  await page.getByRole("combobox", { name: "Diet" }).selectOption("Vegetarian");
  await page.getByLabel("Gluten").check();
  await page.getByRole("combobox", { name: "Cuisine" }).selectOption("Italian");

  // Verify selections were made
  await expect(page.getByRole("combobox", { name: "Diet" })).toHaveValue(
    "Vegetarian"
  );
  await expect(page.getByRole("combobox", { name: "Cuisine" })).toHaveValue(
    "Italian"
  );

  // Verify filter badges
  const dietButton = page.getByRole("button", { name: "Diet" });
  const intolerancesButton = page.getByRole("button", { name: "Intolerances" });
  const cuisineButton = page.getByRole("button", { name: "Cuisine" });

  await expect(dietButton.getByText("1")).toBeVisible();
  await expect(intolerancesButton.getByText("1")).toBeVisible();
  await expect(cuisineButton.getByText("1")).toBeVisible();

  // Clear all filters
  await page.getByRole("button", { name: "Clear All" }).click();

  // Verify all selections are cleared
  await expect(page.getByRole("combobox", { name: "Diet" })).toHaveValue("");
  await expect(page.getByRole("combobox", { name: "Cuisine" })).toHaveValue("");

  // Verify badges are removed
  await expect(dietButton.getByText("1")).not.toBeVisible();
  await expect(intolerancesButton.getByText("1")).not.toBeVisible();
  await expect(cuisineButton.getByText("1")).not.toBeVisible();

  // Active filters are removed
  await expect(page.getByText("Active Filters")).not.toBeVisible();
});
