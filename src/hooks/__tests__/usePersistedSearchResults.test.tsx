import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePersistedSearchResults } from "../usePersistedSearchResults";
import { Recipe } from "../../types/recipe";

describe("usePersistedSearchResults", () => {
  // Mock recipes for testing
  const mockRecipes: Recipe[] = [
    {
      id: 1,
      title: "Test Recipe",
      image: "https://example.com/image.jpg",
      readyInMinutes: 30,
      servings: 4,
      summary: "A delicious test recipe",
    },
    {
      id: 2,
      title: "Another Recipe",
      image: "https://example.com/image2.jpg",
      readyInMinutes: 45,
      servings: 2,
      summary: "Another delicious test recipe",
    },
  ];

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

  it("initializes with empty recipes when localStorage is empty", () => {
    // Mock localStorage.getItem to return null for all keys
    vi.mocked(localStorage.getItem).mockImplementation(() => {
      return null;
    });

    const { result } = renderHook(() => usePersistedSearchResults());

    expect(result.current.recipes).toEqual([]);
    expect(result.current.lastQuery).toBe("");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);

    expect(localStorage.getItem).toHaveBeenCalledWith("searchResults");
    expect(localStorage.getItem).toHaveBeenCalledWith("lastQuery");
    expect(localStorage.getItem).toHaveBeenCalledWith("searchError");
  });

  it("initializes with data from localStorage", () => {
    // Mock localStorage.getItem to return different values based on the key
    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === "searchResults") return JSON.stringify(mockRecipes);
      if (key === "lastQuery") return "pasta";
      if (key === "searchError") return "Some error";
      return null;
    });

    const { result } = renderHook(() => usePersistedSearchResults());

    expect(result.current.recipes).toEqual(mockRecipes);
    expect(result.current.lastQuery).toBe("pasta");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Some error");
  });

  it("updates recipes and saves to localStorage", () => {
    // Mock localStorage.getItem to return null
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => usePersistedSearchResults());

    act(() => {
      result.current.setRecipes(mockRecipes);
    });

    expect(result.current.recipes).toEqual(mockRecipes);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "searchResults",
      JSON.stringify(mockRecipes)
    );
  });

  it("updates lastQuery and saves to localStorage", () => {
    // Mock localStorage.getItem to return null
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => usePersistedSearchResults());

    act(() => {
      result.current.setLastQuery("pasta");
    });

    expect(result.current.lastQuery).toBe("pasta");
    expect(localStorage.setItem).toHaveBeenCalledWith("lastQuery", "pasta");
  });

  it("updates loading state", () => {
    // Mock localStorage.getItem to return null
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => usePersistedSearchResults());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.loading).toBe(true);

    // Loading state should not be saved to localStorage
    expect(localStorage.setItem).not.toHaveBeenCalledWith("loading", "true");
  });

  it("updates error and saves to localStorage", () => {
    // Mock localStorage.getItem to return null
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => usePersistedSearchResults());

    act(() => {
      result.current.setError("API error");
    });

    expect(result.current.error).toBe("API error");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "searchError",
      "API error"
    );
  });

  it("removes error from localStorage when set to null", () => {
    // Mock localStorage.getItem to return an error
    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === "searchError") return "Some error";
      return null;
    });

    const { result } = renderHook(() => usePersistedSearchResults());

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBe(null);
    expect(localStorage.removeItem).toHaveBeenCalledWith("searchError");
  });
});
