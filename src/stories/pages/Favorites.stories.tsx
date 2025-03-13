import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import Favorites from "../../pages/Favorites";
import { mockRecipes } from "../../mocks/mockRecipes";
import { useEffect, useState } from "react";

// Component to set up localStorage for the story
const FavoritesWithSetup = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Clean up first
    localStorage.removeItem("favorites");

    // Then set up mock favorites
    localStorage.setItem(
      "favorites",
      JSON.stringify([mockRecipes[0], mockRecipes[1], mockRecipes[5]])
    );

    setIsReady(true);

    // Clean up after the story
    return () => {
      localStorage.removeItem("favorites");
    };
  }, []);

  if (!isReady) return null;
  return <Favorites />;
};

// Component for empty favorites
const EmptyFavorites = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure favorites is empty
    localStorage.removeItem("favorites");
    setIsReady(true);

    return () => {
      localStorage.removeItem("favorites");
    };
  }, []);

  if (!isReady) return null;
  return <Favorites />;
};

const meta: Meta<typeof Favorites> = {
  title: "Pages/Favorites",
  component: Favorites,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Favorites page showing recipes that have been saved by the user.",
      },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Favorites>;

export const WithFavorites: Story = {
  render: () => <FavoritesWithSetup />,
  parameters: {
    docs: {
      description: {
        story: "Favorites page with some saved recipes.",
      },
    },
  },
};

export const Empty: Story = {
  render: () => <EmptyFavorites />,
  parameters: {
    docs: {
      description: {
        story: "Favorites page with no saved recipes.",
      },
    },
  },
};
