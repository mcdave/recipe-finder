import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import RecipeCard from "../../components/RecipeCard";
import { Recipe } from "../../types/recipe";

const meta: Meta<typeof RecipeCard> = {
  title: "Components/RecipeCard",
  component: RecipeCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    onFavoriteToggle: { action: "favorite toggled" },
  },
};

export default meta;
type Story = StoryObj<typeof RecipeCard>;

// Sample recipe data
const sampleRecipe: Recipe = {
  id: 1,
  title: "Spaghetti Carbonara",
  image: "https://spoonacular.com/recipeImages/715538-556x370.jpg",
  readyInMinutes: 30,
  servings: 4,
  summary:
    "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
  dishTypes: ["lunch", "main course", "dinner"],
  diets: [],
  cuisines: ["Italian"],
  healthScore: 85,
};

export const Default: Story = {
  args: {
    recipe: sampleRecipe,
    onClick: fn(),
  },
};

export const WithFavoriteButton: Story = {
  args: {
    recipe: sampleRecipe,
    onClick: fn(),
    isFavorite: false,
    onFavoriteToggle: fn(),
  },
};

export const Favorited: Story = {
  args: {
    recipe: sampleRecipe,
    onClick: fn(),
    isFavorite: true,
    onFavoriteToggle: fn(),
  },
};

export const LongTitle: Story = {
  args: {
    recipe: {
      ...sampleRecipe,
      title:
        "Super Delicious Spaghetti Carbonara with Crispy Pancetta and Freshly Ground Black Pepper",
    },
    onClick: fn(),
  },
};

export const NoImage: Story = {
  args: {
    recipe: {
      ...sampleRecipe,
      image: "https://invalid-image-url.jpg",
    },
    onClick: fn(),
  },
};
