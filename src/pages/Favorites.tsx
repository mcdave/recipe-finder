import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Recipe } from "../types/recipe";
import RecipeCard from "../components/RecipeCard";
import Logo from "../components/Logo";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const Favorites = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleRecipeClick = (recipeId: number) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleFavoriteToggle = (recipe: Recipe) => {
    // Remove from favorites (in Favorites page, we only need to handle removal)
    const updatedFavorites = favorites.filter((fav) => fav.id !== recipe.id);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-tomato-50 to-white">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <Logo className="mx-auto mb-6 sm:mb-8" />

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center mr-4 text-gray-600 hover:text-gray-900"
              aria-label="Go back to home"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-1" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={handleRecipeClick}
                  isFavorite={true}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No favorites yet
              </h2>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                Start adding recipes to your favorites by clicking the heart
                icon on any recipe.
              </p>
              <button
                onClick={handleGoBack}
                className="inline-flex items-center px-4 py-2 bg-brand-herb-100 text-brand-herb-700 rounded-lg hover:bg-brand-herb-200 transition-colors"
              >
                Find recipes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
