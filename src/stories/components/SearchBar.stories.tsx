import type { Meta, StoryObj } from "@storybook/react";
import SearchBar from "../../components/SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    onSearch: (query) => console.log(`Searching for: ${query}`),
  },
};

export const WithCallback: Story = {
  args: {
    onSearch: (query) => {
      alert(`You searched for: ${query}`);
    },
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
