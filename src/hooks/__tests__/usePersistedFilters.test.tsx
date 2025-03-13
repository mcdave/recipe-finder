import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePersistedFilters } from "../usePersistedFilters";
import { SearchFilters } from "../../types/recipe";

describe("usePersistedFilters", () => {
  const STORAGE_KEY = "recipe-finder-filters";

  // Setup and teardown
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  it("initializes with empty filters when localStorage is empty", () => {
    // Mock localStorage.getItem to return null
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => usePersistedFilters());

    expect(result.current.filters).toEqual({});
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it("initializes with filters from localStorage", () => {
    const savedFilters: SearchFilters = {
      diet: "Vegetarian",
      intolerances: ["Dairy"],
      cuisine: "Italian",
    };

    // Mock localStorage.getItem to return saved filters
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify(savedFilters)
    );

    const { result } = renderHook(() => usePersistedFilters());

    expect(result.current.filters).toEqual(savedFilters);
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it("updates filters and saves to localStorage", () => {
    // Mock localStorage.getItem to return null initially
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => usePersistedFilters());

    const newFilters: SearchFilters = {
      diet: "Vegetarian",
      intolerances: ["Dairy"],
      cuisine: "Italian",
    };

    act(() => {
      result.current.updateFilters(newFilters);
    });

    expect(result.current.filters).toEqual(newFilters);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify(newFilters)
    );
  });

  it("removes a diet filter", () => {
    const initialFilters: SearchFilters = {
      diet: "Vegetarian",
      intolerances: ["Dairy"],
      cuisine: "Italian",
    };

    // Mock localStorage.getItem to return initial filters
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify(initialFilters)
    );

    const { result } = renderHook(() => usePersistedFilters());

    act(() => {
      result.current.removeFilter("diet");
    });

    const expectedFilters = {
      intolerances: ["Dairy"],
      cuisine: "Italian",
    };

    expect(result.current.filters).toEqual(expectedFilters);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify(expectedFilters)
    );
  });

  it("removes a specific intolerance filter", () => {
    const initialFilters: SearchFilters = {
      diet: "Vegetarian",
      intolerances: ["Dairy", "Gluten"],
      cuisine: "Italian",
    };

    // Mock localStorage.getItem to return initial filters
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify(initialFilters)
    );

    const { result } = renderHook(() => usePersistedFilters());

    act(() => {
      result.current.removeFilter("intolerances", "Dairy");
    });

    const expectedFilters = {
      diet: "Vegetarian",
      intolerances: ["Gluten"],
      cuisine: "Italian",
    };

    expect(result.current.filters).toEqual(expectedFilters);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify(expectedFilters)
    );
  });

  it("clears all filters", () => {
    const initialFilters: SearchFilters = {
      diet: "Vegetarian",
      intolerances: ["Dairy"],
      cuisine: "Italian",
    };

    // Mock localStorage.getItem to return initial filters
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify(initialFilters)
    );

    const { result } = renderHook(() => usePersistedFilters());

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({});
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify({})
    );
  });

  it("directly sets filters with setFilters", () => {
    // Mock localStorage.getItem to return null initially
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => usePersistedFilters());

    const newFilters: SearchFilters = {
      diet: "Vegan",
      intolerances: ["Soy"],
      cuisine: "Thai",
    };

    act(() => {
      result.current.setFilters(newFilters);
    });

    expect(result.current.filters).toEqual(newFilters);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify(newFilters)
    );
  });
});
