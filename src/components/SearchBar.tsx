import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const validateQuery = (query: string): boolean => {
    if (!query.trim()) {
      setInputError("Please enter ingredients or a recipe name");
      setIsShaking(true);
      return false;
    }

    // Check if query is too short or just random characters
    if (query.trim().length < 2) {
      setInputError("Search term is too short");
      setIsShaking(true);
      return false;
    }

    setInputError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateQuery(searchQuery)) {
      onSearch(searchQuery.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Clear error when user starts typing again
    if (inputError) {
      setInputError(null);
    }
  };

  // Reset shake animation after it completes
  useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 500); // Match the duration of the animation
      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2">
        <div className={`flex gap-2 ${isShaking ? "animate-shake" : ""}`}>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for recipes..."
            className={`flex-1 px-3 py-2 rounded-lg border ${
              inputError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            } focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base`}
            aria-label="Search recipes"
            aria-invalid={!!inputError}
            aria-describedby={inputError ? "search-error" : undefined}
          />
          <button
            type="submit"
            className="px-3 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap text-sm sm:text-base"
          >
            Search
          </button>
        </div>
        {inputError && (
          <div
            id="search-error"
            className="text-red-500 text-sm mt-1 animate-fadeIn error-message py-2 px-3"
            role="alert"
          >
            {inputError}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
