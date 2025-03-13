import type { Meta, StoryObj } from "@storybook/react";
import FilterBadges from "../../components/FilterBadges";

const meta: Meta<typeof FilterBadges> = {
  title: "Components/FilterBadges",
  component: FilterBadges,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FilterBadges>;

export const WithAllFilters: Story = {
  args: {
    filters: {
      diet: "Vegetarian",
      intolerances: ["Dairy", "Gluten"],
      cuisine: "Italian",
    },
    onRemove: (type, value) => console.log(`Removed ${type} ${value || ""}`),
  },
};

export const NoFilters: Story = {
  args: {
    filters: {
      diet: undefined,
      intolerances: [],
      cuisine: undefined,
    },
    onRemove: (type, value) => console.log(`Removed ${type} ${value || ""}`),
  },
};

export const WithDiet: Story = {
  args: {
    filters: {
      diet: "Vegetarian",
      intolerances: [],
      cuisine: undefined,
    },
    onRemove: (type, value) => console.log(`Removed ${type} ${value || ""}`),
  },
};

export const WithCuisine: Story = {
  args: {
    filters: {
      diet: undefined,
      intolerances: [],
      cuisine: "Italian",
    },
    onRemove: (type, value) => console.log(`Removed ${type} ${value || ""}`),
  },
};

export const WithIntolerances: Story = {
  args: {
    filters: {
      diet: undefined,
      intolerances: ["Dairy", "Gluten"],
      cuisine: undefined,
    },
    onRemove: (type, value) => console.log(`Removed ${type} ${value || ""}`),
  },
};
