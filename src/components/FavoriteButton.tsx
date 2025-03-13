import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { Recipe } from "../types/recipe";

interface FavoriteButtonProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggle: (recipe: Recipe) => void;
  className?: string;
}

const FavoriteButton = ({
  recipe,
  isFavorite,
  onToggle,
  className = "",
}: FavoriteButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click events
    onToggle(recipe);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors group ${className}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <HeartIconSolid className="w-5 h-5 text-brand-tomato-500 group-hover:text-brand-tomato-600 transition-colors" />
      ) : (
        <HeartIconOutline className="w-5 h-5 text-gray-700 group-hover:text-brand-tomato-500 transition-colors" />
      )}
    </button>
  );
};

export default FavoriteButton;
