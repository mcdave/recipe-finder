import { Recipe } from "../types/recipe";
import { useState } from "react";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (id: number) => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <article
      onClick={() => onClick(recipe.id)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-blue-500"
      tabIndex={0}
      role="button"
      aria-label={`View recipe for ${recipe.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(recipe.id);
        }
      }}
    >
      <div className="relative aspect-video">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        {imageError ? (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        ) : (
          <img
            src={recipe.image}
            alt={`${recipe.title} dish`}
            className={`w-full h-48 object-cover transition-opacity duration-200 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onError={handleImageError}
            onLoad={() => setImageLoading(false)}
            loading="lazy"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
          {recipe.title}
        </h3>
        <div className="flex justify-between text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span className="sr-only">Cooking time:</span>
            <span aria-hidden="true">🕒</span> {recipe.readyInMinutes} mins
          </span>
          <span className="flex items-center gap-1">
            <span className="sr-only">Servings:</span>
            <span aria-hidden="true">👥</span> {recipe.servings} servings
          </span>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
