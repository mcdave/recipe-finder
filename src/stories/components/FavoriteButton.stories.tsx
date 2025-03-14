import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import FavoriteButton from "../../components/FavoriteButton";
import { Recipe } from "../../types/recipe";

const meta: Meta<typeof FavoriteButton> = {
  title: "Components/FavoriteButton",
  component: FavoriteButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onToggle: { action: "favorite toggled" },
  },
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
    onToggle: fn(),
  },
};

export const Favorited: Story = {
  args: {
    recipe: sampleRecipe,
    isFavorite: true,
    onToggle: fn(),
  },
};

export const WithCustomClass: Story = {
  args: {
    recipe: sampleRecipe,
    isFavorite: false,
    onToggle: fn(),
    className: "bg-gray-100 p-4",
  },
};
