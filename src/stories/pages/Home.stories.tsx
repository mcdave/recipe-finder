import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../../pages/Home";
import { handlers } from "../../mocks/handlers";

// We'll use MSW for API mocking in Storybook
const meta: Meta<typeof Home> = {
  title: "Pages/Home",
  component: Home,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Home page with search functionality and recipe cards. API calls are mocked to avoid hitting rate limits.",
      },
    },
    msw: {
      handlers: handlers,
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
type Story = StoryObj<typeof Home>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The home page with search functionality. The API responses are mocked.",
      },
    },
  },
};
