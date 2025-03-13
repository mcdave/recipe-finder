import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Filters from "../Filters";
import { SearchFilters } from "../../types/recipe";

describe("Filters", () => {
  const mockOnChange = vi.fn();
  const mockOnClear = vi.fn();
  const initialFilters: SearchFilters = {
    diet: undefined,
    intolerances: [],
    cuisine: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders filter sections", () => {
    render(
      <Filters
        filters={initialFilters}
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    // Check if filter sections are rendered
    expect(screen.getByText("Diet")).toBeInTheDocument();
    expect(screen.getByText("Intolerances")).toBeInTheDocument();
    expect(screen.getByText("Cuisine")).toBeInTheDocument();
  });

  it("toggles filter sections when clicked", async () => {
    const user = userEvent.setup();
    render(
      <Filters
        filters={initialFilters}
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    // Initially, diet options should not be visible
    const dietButton = screen.getByText("Diet").closest("button");
    expect(dietButton).toBeInTheDocument();

    // Click on Diet section to expand it
    if (dietButton) {
      await user.click(dietButton);
    }

    // Now diet options should be visible
    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();

    // Check if options are available
    const options = within(selectElement).getAllByRole("option");
    expect(options.length).toBeGreaterThan(1);
    expect(
      options.some((option) => option.textContent?.includes("Gluten Free"))
    ).toBeTruthy();
    expect(
      options.some((option) => option.textContent?.includes("Vegetarian"))
    ).toBeTruthy();
  });

  it("calls onChange when a diet is selected", async () => {
    const user = userEvent.setup();
    render(
      <Filters
        filters={initialFilters}
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    // Expand Diet section
    const dietButton = screen.getByText("Diet").closest("button");
    if (dietButton) {
      await user.click(dietButton);
    }

    // Select a diet using the select element
    const selectElement = screen.getByRole("combobox");
    await user.selectOptions(selectElement, "Vegetarian");

    // Check if onChange was called with the correct filters
    expect(mockOnChange).toHaveBeenCalledWith({
      ...initialFilters,
      diet: "Vegetarian",
    });
  });

  it("calls onChange when an intolerance is selected", async () => {
    const user = userEvent.setup();
    render(
      <Filters
        filters={initialFilters}
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    // Expand Intolerances section
    const intolerancesButton = screen
      .getByText("Intolerances")
      .closest("button");
    if (intolerancesButton) {
      await user.click(intolerancesButton);
    }

    // Find the checkbox for Dairy
    const dairyCheckbox = Array.from(screen.getAllByRole("checkbox")).find(
      (checkbox) => {
        const label = checkbox.closest("label");
        return label && label.textContent?.includes("Dairy");
      }
    );

    expect(dairyCheckbox).toBeInTheDocument();

    // Select the Dairy intolerance
    if (dairyCheckbox) {
      await user.click(dairyCheckbox);
    }

    // Check if onChange was called with the correct filters
    expect(mockOnChange).toHaveBeenCalledWith({
      ...initialFilters,
      intolerances: ["Dairy"],
    });
  });

  it("calls onChange when a cuisine is selected", async () => {
    const user = userEvent.setup();
    render(
      <Filters
        filters={initialFilters}
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    // Expand Cuisine section
    const cuisineButton = screen.getByText("Cuisine").closest("button");
    if (cuisineButton) {
      await user.click(cuisineButton);
    }

    // Select a cuisine using the select element
    const selectElement = screen.getByRole("combobox");
    await user.selectOptions(selectElement, "Italian");

    // Check if onChange was called with the correct filters
    expect(mockOnChange).toHaveBeenCalledWith({
      ...initialFilters,
      cuisine: "Italian",
    });
  });

  it("calls onClear when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Filters
        filters={{
          diet: "Vegetarian",
          intolerances: ["Dairy"],
          cuisine: "Italian",
        }}
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    // Find and click the clear button by its aria-label
    const clearButton = screen.getByLabelText("Clear all filters");
    await user.click(clearButton);

    // Check if onClear was called
    expect(mockOnClear).toHaveBeenCalled();
  });
});
