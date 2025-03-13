import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById } from "../services/recipeService";
import { Recipe } from "../types/recipe";
import Logo from "../components/Logo";
import FavoriteButton from "../components/FavoriteButton";
import {
  isRecipeFavorite,
  toggleFavorite as toggleFavoriteUtil,
} from "../utils/favoriteUtils";
import {
  ArrowLeftIcon,
  ClockIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      // Reset image states when loading a new recipe
      setImageError(false);
      setImageLoading(true);

      try {
        const recipeData = await getRecipeById(parseInt(id));
        setRecipe(recipeData);

        // Check if recipe is in favorites
        setIsFavorite(isRecipeFavorite(recipeData));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load recipe details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleToggleFavorite = (recipe: Recipe) => {
    const result = toggleFavoriteUtil(recipe);
    setIsFavorite(result.isFavorite);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-tomato-50 to-white">
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <Logo className="mx-auto mb-6 sm:mb-8" />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-herb-300 border-t-brand-herb-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-tomato-50 to-white">
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <Logo className="mx-auto mb-6 sm:mb-8" />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-4xl mx-auto">
            <div className="text-red-600 text-center">
              {error || "Recipe not found"}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={handleGoBack}
                className="inline-flex items-center px-4 py-2 bg-brand-herb-50 text-brand-herb-700 rounded-lg hover:bg-brand-herb-200 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to recipes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-tomato-50 to-white">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <Logo className="mx-auto mb-6 sm:mb-8" />

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header with image */}
            <div className="relative">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse h-64 sm:h-80" />
              )}
              {imageError ? (
                <div className="w-full h-64 sm:h-80 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              ) : (
                <img
                  src={recipe?.image}
                  alt={recipe?.title}
                  className={`w-full h-64 sm:h-80 object-cover transition-opacity duration-200 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onError={handleImageError}
                  onLoad={() => setImageLoading(false)}
                />
              )}
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <button
                  onClick={handleGoBack}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
                </button>
                {recipe && (
                  <FavoriteButton
                    recipe={recipe}
                    isFavorite={isFavorite}
                    onToggle={handleToggleFavorite}
                  />
                )}
              </div>
            </div>

            {/* Recipe content */}
            <div className="p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {recipe?.title}
              </h1>

              {/* Recipe meta info */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-1 text-brand-herb-500" />
                  <span>{recipe?.readyInMinutes} minutes</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="w-5 h-5 mr-1 text-brand-herb-500" />
                  <span>{recipe?.servings} servings</span>
                </div>
                {recipe?.healthScore && (
                  <div className="flex items-center">
                    <span className="mr-1">❤️</span>
                    <span>Health score: {recipe?.healthScore}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {((recipe?.diets && recipe.diets.length > 0) ||
                (recipe?.dishTypes && recipe.dishTypes.length > 0)) && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {recipe?.diets?.map((diet) => (
                      <span
                        key={diet}
                        className="px-2 py-1 bg-brand-herb-50 text-brand-herb-800 text-xs rounded-full"
                      >
                        {diet}
                      </span>
                    ))}
                    {recipe?.dishTypes?.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-1 bg-brand-golden-50 text-brand-golden-800 text-xs rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">
                  About
                </h2>
                <div
                  className="text-gray-600 prose prose-sm sm:prose"
                  dangerouslySetInnerHTML={{ __html: recipe?.summary || "" }}
                />
              </div>

              {/* Ingredients */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">
                  Ingredients
                </h2>
                {recipe?.extendedIngredients &&
                recipe.extendedIngredients.length > 0 ? (
                  <ul className="space-y-2">
                    {recipe.extendedIngredients.map((ingredient, index) => (
                      <li
                        key={`${ingredient.id}-${index}`}
                        className="flex items-start"
                      >
                        <span className="text-green-500 mr-2">•</span>
                        <span>{ingredient.original}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    No ingredients available.
                  </p>
                )}
              </div>

              {/* Instructions */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">
                  Instructions
                </h2>
                {recipe?.instructions ? (
                  <div
                    className="text-gray-600 prose prose-sm sm:prose"
                    dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                  />
                ) : (
                  <p className="text-gray-500 italic">
                    No instructions available.
                    {recipe?.sourceUrl && (
                      <span>
                        {" "}
                        Check the{" "}
                        <a
                          href={recipe.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-herb-600 hover:underline"
                        >
                          original recipe
                        </a>{" "}
                        for more details.
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Source */}
              {recipe?.sourceName && (
                <div className="text-sm text-gray-500">
                  Source:{" "}
                  {recipe.sourceUrl ? (
                    <a
                      href={recipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-herb-600 hover:underline"
                    >
                      {recipe.sourceName}
                    </a>
                  ) : (
                    recipe.sourceName
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
