import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RecipeDetail from "../../pages/RecipeDetail";
import { handlers } from "../../mocks/handlers";
import { mockRecipes } from "../../mocks/mockRecipes";
import { http, HttpResponse } from "msw";

// Create specific handlers for each story to ensure they work correctly
const getRecipeHandler = (id: number) => {
  return http.get(
    `https://api.spoonacular.com/recipes/${id}/information*`,
    () => {
      const recipe =
        mockRecipes.find((recipe) => recipe.id === id) || mockRecipes[0];
      return HttpResponse.json(recipe);
    }
  );
};

const meta: Meta<typeof RecipeDetail> = {
  title: "Pages/RecipeDetail",
  component: RecipeDetail,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Recipe detail page showing comprehensive information about a specific recipe.",
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Extract the ID from the story context
      const id = context.parameters.reactRouter?.routeParams?.id || "1";

      return (
        <MemoryRouter initialEntries={[`/recipe/${id}`]}>
          <Routes>
            <Route path="/recipe/:id" element={<Story />} />
          </Routes>
        </MemoryRouter>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof RecipeDetail>;

export const ItalianRecipe: Story = {
  parameters: {
    reactRouter: {
      routePath: "/recipe/:id",
      routeParams: { id: "1" },
    },
    msw: {
      handlers: [...handlers, getRecipeHandler(1)],
    },
    docs: {
      description: {
        story: "Viewing details of an Italian recipe (Spaghetti Carbonara).",
      },
    },
  },
};

export const VegetarianRecipe: Story = {
  parameters: {
    reactRouter: {
      routePath: "/recipe/:id",
      routeParams: { id: "2" },
    },
    msw: {
      handlers: [...handlers, getRecipeHandler(2)],
    },
    docs: {
      description: {
        story: "Viewing details of a vegetarian recipe (Buddha Bowl).",
      },
    },
  },
};
