import { Diet, Intolerance, Cuisine, SearchFilters } from "../types/recipe";
import { useState } from "react";

interface FiltersProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onClear: () => void;
}

const DIETS: [Diet, string][] = [
  ["Gluten Free", "🌾"],
  ["Ketogenic", "🥑"],
  ["Vegetarian", "🥬"],
  ["Vegan", "🌱"],
  ["Pescetarian", "🐟"],
  ["Paleo", "🍖"],
  ["Primal", "🥩"],
  ["Low FODMAP", "🥗"],
  ["Whole30", "🥜"],
];

const INTOLERANCES: [Intolerance, string][] = [
  ["Dairy", "🥛"],
  ["Egg", "🥚"],
  ["Gluten", "🌾"],
  ["Grain", "🌾"],
  ["Peanut", "🥜"],
  ["Seafood", "🐟"],
  ["Sesame", "🌱"],
  ["Shellfish", "🦐"],
  ["Soy", "🫘"],
  ["Sulfite", "🧪"],
  ["Tree Nut", "🥥"],
  ["Wheat", "🌾"],
];

const CUISINES: [Cuisine, string][] = [
  ["African", "🌍"],
  ["American", "🇺🇸"],
  ["Asian", "🌏"],
  ["British", "🇬🇧"],
  ["Caribbean", "🌴"],
  ["Chinese", "🇨🇳"],
  ["European", "🇪🇺"],
  ["French", "🇫🇷"],
  ["German", "🇩🇪"],
  ["Greek", "🇬🇷"],
  ["Indian", "🇮🇳"],
  ["Italian", "🇮🇹"],
  ["Japanese", "🇯🇵"],
  ["Korean", "🇰🇷"],
  ["Mediterranean", "🫒"],
  ["Mexican", "🇲🇽"],
  ["Middle Eastern", "🕌"],
  ["Thai", "🇹🇭"],
  ["Vietnamese", "🇻🇳"],
];

const FilterSection = ({
  title,
  isOpen,
  onToggle,
  children,
  badge,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: number;
}) => (
  <div className="border border-gray-200 rounded-lg">
    <button
      onClick={onToggle}
      className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="flex items-center space-x-2">
        <span className="font-medium text-gray-900">{title}</span>
        {badge ? (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {badge}
          </span>
        ) : null}
      </div>
      <svg
        className={`w-5 h-5 transition-transform ${
          isOpen ? "transform rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
    {isOpen && <div className="p-4 border-t border-gray-200">{children}</div>}
  </div>
);

const Filters = ({ filters, onChange, onClear }: FiltersProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDietChange = (value: string) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters.diet = value as Diet;
    } else {
      delete newFilters.diet;
    }
    onChange(newFilters);
  };

  const handleIntoleranceChange = (intolerance: Intolerance) => {
    const currentIntolerances = filters.intolerances || [];
    const newIntolerances = currentIntolerances.includes(intolerance)
      ? currentIntolerances.filter((i) => i !== intolerance)
      : [...currentIntolerances, intolerance];

    const newFilters = { ...filters };
    if (newIntolerances.length > 0) {
      newFilters.intolerances = newIntolerances;
    } else {
      delete newFilters.intolerances;
    }
    onChange(newFilters);
  };

  const handleCuisineChange = (value: string) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters.cuisine = value as Cuisine;
    } else {
      delete newFilters.cuisine;
    }
    onChange(newFilters);
  };

  const hasActiveFilters =
    filters.diet ||
    filters.cuisine ||
    (filters.intolerances && filters.intolerances.length > 0);

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-2">
        <FilterSection
          title="Diet"
          isOpen={openSections.diet}
          onToggle={() => toggleSection("diet")}
          badge={filters.diet ? 1 : 0}
        >
          <select
            value={filters.diet || ""}
            onChange={(e) => handleDietChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-herb-500 focus:ring-brand-herb-500"
            role="select"
            aria-label="Diet"
          >
            <option role="option" value="">
              Any
            </option>
            {DIETS.map(([diet, emoji]) => (
              <option role="option" key={diet} value={diet}>
                {emoji} {diet}
              </option>
            ))}
          </select>
        </FilterSection>

        <FilterSection
          title="Intolerances"
          isOpen={openSections.intolerances}
          onToggle={() => toggleSection("intolerances")}
          badge={filters.intolerances?.length || 0}
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {INTOLERANCES.map(([intolerance, emoji]) => (
              <label
                key={intolerance}
                className="flex items-center space-x-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={(filters.intolerances || []).includes(intolerance)}
                  onChange={() => handleIntoleranceChange(intolerance)}
                  className="rounded border-gray-300 text-brand-herb-500 focus:ring-brand-herb-500"
                />
                <span className="truncate">
                  {emoji} {intolerance}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Cuisine"
          isOpen={openSections.cuisine}
          onToggle={() => toggleSection("cuisine")}
          badge={filters.cuisine ? 1 : 0}
        >
          <select
            value={filters.cuisine || ""}
            onChange={(e) => handleCuisineChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-herb-500 focus:ring-brand-herb-500"
            role="select"
            aria-label="Cuisine"
          >
            <option role="option" value="">
              Any
            </option>
            {CUISINES.map(([cuisine, emoji]) => (
              <option role="option" key={cuisine} value={cuisine}>
                {emoji} {cuisine}
              </option>
            ))}
          </select>
        </FilterSection>
      </div>
    </div>
  );
};

export default Filters;
