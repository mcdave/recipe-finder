import { useState } from "react";
import SearchBar from "./components/SearchBar";
import RecipeCard from "./components/RecipeCard";
import Filters from "./components/Filters";
import FilterBadges from "./components/FilterBadges";
import Logo from "./components/Logo";
import { Recipe, SearchFilters } from "./types/recipe";
import { searchRecipes } from "./services/recipeService";
import { usePersistedFilters } from "./hooks/usePersistedFilters";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

const App = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { filters, setFilters } = usePersistedFilters();
  const [lastQuery, setLastQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async (
    query: string,
    searchFilters: SearchFilters = filters
  ) => {
    setLoading(true);
    setError(null);
    setLastQuery(query);

    try {
      const response = await searchRecipes(query, searchFilters);
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

  const handleRecipeClick = (recipe: Recipe) => {
    // Handle recipe click - can be implemented later if needed
    console.log("Recipe clicked:", recipe);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-tomato-50 to-white">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <Logo className="mx-auto mb-6 sm:mb-8" />

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <SearchBar onSearch={handleSearch} />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-50"
                aria-label="Toggle filters"
              >
                <AdjustmentsHorizontalIcon className="w-6 h-6" />
              </button>
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
                  <div className="text-brand-tomato-600 text-center">
                    {error}
                  </div>
                </div>
              ) : recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={() => handleRecipeClick(recipe)}
                    />
                  ))}
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

export default App;
