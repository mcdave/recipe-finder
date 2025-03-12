import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import Filters from "../components/Filters";
import FilterBadges from "../components/FilterBadges";
import Logo from "../components/Logo";
import { SearchFilters, Recipe } from "../types/recipe";
import { searchRecipes } from "../services/recipeService";
import { usePersistedFilters } from "../hooks/usePersistedFilters";
import { usePersistedSearchResults } from "../hooks/usePersistedSearchResults";
import {
  AdjustmentsHorizontalIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const {
    recipes,
    setRecipes,
    lastQuery,
    setLastQuery,
    loading,
    setLoading,
    error,
    setError,
  } = usePersistedSearchResults();
  const { filters, setFilters } = usePersistedFilters();
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleSearch = async (
    query: string,
    searchFilters: SearchFilters = filters
  ) => {
    setLoading(true);
    setError(null);
    setLastQuery(query);

    // Validate query before making API call
    if (!query.trim()) {
      setLoading(false);
      setError("Please enter valid ingredients or a recipe name");
      return;
    }

    try {
      const response = await searchRecipes(query, searchFilters);

      // Check if we got any results
      if (response.results.length === 0) {
        setError("No recipes found. Try different ingredients or keywords.");
      }

      setRecipes(response.results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while searching for recipes"
      );
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (lastQuery) {
      handleSearch(lastQuery, newFilters);
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    if (lastQuery) {
      handleSearch(lastQuery, {});
    }
  };

  const handleRemoveFilter = (type: keyof SearchFilters, value?: string) => {
    const newFilters = { ...filters };

    if (type === "intolerances" && value) {
      newFilters.intolerances = filters.intolerances?.filter(
        (i) => i !== value
      );
      if (newFilters.intolerances?.length === 0) {
        delete newFilters.intolerances;
      }
    } else {
      delete newFilters[type as keyof typeof newFilters];
    }

    setFilters(newFilters);
    if (lastQuery) {
      handleSearch(lastQuery, newFilters);
    }
  };

  const handleRecipeClick = (recipeId: number) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleFavoriteToggle = (recipe: Recipe) => {
    const currentFavorites = [...favorites];
    const isFavorite = currentFavorites.some((fav) => fav.id === recipe.id);

    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = currentFavorites.filter(
        (fav) => fav.id !== recipe.id
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } else {
      // Add to favorites
      const updatedFavorites = [...currentFavorites, recipe];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    }
  };

  const isRecipeFavorite = (recipeId: number): boolean => {
    return favorites.some((fav) => fav.id === recipeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-tomato-50 to-white">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <Logo className="mx-auto mb-6 sm:mb-8" />

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="w-full sm:flex-1">
                <SearchBar onSearch={handleSearch} />
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Link
                  to="/favorites"
                  className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-gray-50 transition-colors"
                  aria-label="View favorites"
                >
                  <HeartIcon className="w-6 h-6" />
                </Link>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-50"
                  aria-label="Toggle filters"
                >
                  <AdjustmentsHorizontalIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            {(filters.diet ||
              filters.cuisine ||
              filters.intolerances?.length) && (
              <div className="mt-4">
                <FilterBadges filters={filters} onRemove={handleRemoveFilter} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block lg:col-span-1`}
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-4">
                <Filters
                  filters={filters}
                  onChange={handleFiltersChange}
                  onClear={handleClearFilters}
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center h-48 sm:h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-brand-herb-300 border-t-brand-herb-600"></div>
                </div>
              ) : error ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="error-message w-full max-w-md animate-fadeIn mb-4">
                      <div className="text-red-600 font-medium">{error}</div>
                      <p className="text-gray-600 text-sm mt-1">
                        Try using different keywords or check your spelling.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setError(null);
                        setLastQuery("");
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : recipes.length > 0 ? (
                <div>
                  {lastQuery && (
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Showing results for "{lastQuery}"
                      </div>
                      <button
                        onClick={() => {
                          setRecipes([]);
                          setLastQuery("");
                          setError(null);
                        }}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Clear results
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={handleRecipeClick}
                        isFavorite={isRecipeFavorite(recipe.id)}
                        onFavoriteToggle={handleFavoriteToggle}
                      />
                    ))}
                  </div>
                </div>
              ) : lastQuery ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="text-gray-500 text-center">
                    No recipes found
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                    Welcome to Savory Circuits
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                    Start your culinary journey by searching for recipes. Use
                    filters to find the perfect dish for your dietary
                    preferences.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
