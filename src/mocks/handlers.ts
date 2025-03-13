import { http, HttpResponse } from "msw";
import { mockRecipes, mockSearchResponse } from "./mockRecipes";

export const handlers = [
  // Handle search recipes
  http.get("https://api.spoonacular.com/recipes/complexSearch", () => {
    return HttpResponse.json(mockSearchResponse);
  }),

  // Handle get recipe by ID
  http.get(
    "https://api.spoonacular.com/recipes/:id/information*",
    ({ params }) => {
      const { id } = params;
      const recipe = mockRecipes.find((r) => r.id === Number(id));

      if (!recipe) {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json(recipe);
    }
  ),
];
