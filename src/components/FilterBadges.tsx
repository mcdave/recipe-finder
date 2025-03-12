import { SearchFilters } from "../types/recipe";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface FilterBadgesProps {
  filters: SearchFilters;
  onRemove: (type: keyof SearchFilters, value?: string) => void;
}

const FilterBadge = ({
  text,
  type,
  onRemove,
}: {
  text: string;
  type: "diet" | "cuisine" | "intolerance";
  onRemove: () => void;
}) => {
  const colors = {
    diet: "bg-brand-herb-50 text-brand-herb-700 hover:bg-brand-herb-100",
    cuisine:
      "bg-brand-golden-50 text-brand-golden-700 hover:bg-brand-golden-100",
    intolerance:
      "bg-brand-tomato-50 text-brand-tomato-700 hover:bg-brand-tomato-100",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colors[type]}`}
    >
      {text}
      <button
        onClick={onRemove}
        className="group p-0.5 rounded-full hover:bg-black/5 transition-colors"
        aria-label={`Remove ${text} filter`}
      >
        <XMarkIcon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
      </button>
    </span>
  );
};

const FilterBadges = ({ filters, onRemove }: FilterBadgesProps) => {
  const activeFiltersCount =
    (filters.diet ? 1 : 0) +
    (filters.cuisine ? 1 : 0) +
    (filters.intolerances?.length || 0);

  if (activeFiltersCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-gray-500">Active Filters:</span>
      <div className="flex flex-wrap gap-2">
        {filters.diet && (
          <FilterBadge
            text={filters.diet}
            type="diet"
            onRemove={() => onRemove("diet")}
          />
        )}

        {filters.cuisine && (
          <FilterBadge
            text={filters.cuisine}
            type="cuisine"
            onRemove={() => onRemove("cuisine")}
          />
        )}

        {filters.intolerances?.map((intolerance) => (
          <FilterBadge
            key={intolerance}
            text={intolerance}
            type="intolerance"
            onRemove={() => onRemove("intolerances", intolerance)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterBadges;
