import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Filters from "../../components/Filters";
import { SearchFilters } from "../../types/recipe";
import { useState } from "react";

const meta: Meta<typeof Filters> = {
  title: "Components/Filters",
  component: Filters,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "filters changed" },
    onClear: { action: "filters cleared" },
  },
};

export default meta;
type Story = StoryObj<typeof Filters>;

// Interactive example with state
const FiltersWithState = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    diet: undefined,
    intolerances: [],
    cuisine: undefined,
  });

  return (
    <div className="w-80">
      <Filters
        filters={filters}
        onChange={setFilters}
        onClear={() =>
          setFilters({ diet: undefined, intolerances: [], cuisine: undefined })
        }
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <FiltersWithState />,
};

export const WithPreselectedFilters: Story = {
  args: {
    filters: {
      diet: "Vegetarian",
      intolerances: ["Dairy", "Gluten"],
      cuisine: "Italian",
    },
    onChange: fn(),
    onClear: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};
