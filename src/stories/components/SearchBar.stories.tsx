import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import SearchBar from "../../components/SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onSearch: { action: "search submitted" },
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    onSearch: fn(),
  },
};

export const WithCallback: Story = {
  args: {
    onSearch: fn((query) => {
      alert(`You searched for: ${query}`);
      return query;
    }),
  },
  parameters: {
    docs: {
      description: {
        story:
          "This example shows how the SearchBar component handles the search callback.",
      },
    },
  },
};
