import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with a search input and button", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(
      screen.getByRole("textbox", { name: /search recipes/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("updates input value when user types", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole("textbox", { name: /search recipes/i });
    await user.type(input, "pasta");

    expect(input).toHaveValue("pasta");
  });

  it("calls onSearch with trimmed query when form is submitted", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole("textbox", { name: /search recipes/i });
    await user.type(input, "  pasta  ");

    const button = screen.getByRole("button", { name: /search/i });
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith("pasta");
  });

  it("shows error when submitting empty query", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const button = screen.getByRole("button", { name: /search/i });
    await user.click(button);

    expect(
      screen.getByText("Please enter ingredients or a recipe name")
    ).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it("shows error when query is too short", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole("textbox", { name: /search recipes/i });
    await user.type(input, "a");

    const button = screen.getByRole("button", { name: /search/i });
    await user.click(button);

    expect(screen.getByText("Search term is too short")).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it("clears error when user starts typing again", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    // First trigger an error
    const button = screen.getByRole("button", { name: /search/i });
    await user.click(button);

    expect(
      screen.getByText("Please enter ingredients or a recipe name")
    ).toBeInTheDocument();

    // Then start typing
    const input = screen.getByRole("textbox", { name: /search recipes/i });
    await user.type(input, "p");

    // Error should be gone
    expect(
      screen.queryByText("Please enter ingredients or a recipe name")
    ).not.toBeInTheDocument();
  });

  it("submits form when Enter key is pressed in input", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole("textbox", { name: /search recipes/i });
    await user.type(input, "pasta{Enter}");

    expect(mockOnSearch).toHaveBeenCalledWith("pasta");
  });
});
