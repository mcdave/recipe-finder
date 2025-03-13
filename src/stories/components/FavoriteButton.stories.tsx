import type { Meta, StoryObj } from "@storybook/react";
import FavoriteButton from "../../components/FavoriteButton";
import { Recipe } from "../../types/recipe";

const meta: Meta<typeof FavoriteButton> = {
  title: "Components/FavoriteButton",
  component: FavoriteButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FavoriteButton>;

// Sample recipe data
const sampleRecipe: Recipe = {
  id: 1,
  title: "Spaghetti Carbonara",
  image: "https://spoonacular.com/recipeImages/715538-556x370.jpg",
  readyInMinutes: 30,
  servings: 4,
  summary:
    "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
};

export const NotFavorited: Story = {
  args: {
    recipe: sampleRecipe,
    isFavorite: false,
    onToggle: (recipe) => console.log(`Toggled favorite for: ${recipe.title}`),
  },
};

export const Favorited: Story = {
  args: {
    recipe: sampleRecipe,
    isFavorite: true,
    onToggle: (recipe) => console.log(`Toggled favorite for: ${recipe.title}`),
  },
};

export const WithCustomClass: Story = {
  args: {
    recipe: sampleRecipe,
    isFavorite: false,
    onToggle: (recipe) => console.log(`Toggled favorite for: ${recipe.title}`),
    className: "bg-gray-100 p-4",
  },
};
