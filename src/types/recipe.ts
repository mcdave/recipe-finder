export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions?: string;
  extendedIngredients?: Ingredient[];
  dishTypes?: string[];
  diets?: string[];
  cuisines?: string[];
  healthScore?: number;
  sourceUrl?: string;
  sourceName?: string;
}

export interface SearchResponse {
  results: Recipe[];
  offset: number;
  number: number;
  totalResults: number;
}

export type Diet =
  | "Gluten Free"
  | "Ketogenic"
  | "Vegetarian"
  | "Lacto-Vegetarian"
  | "Ovo-Vegetarian"
  | "Vegan"
  | "Pescetarian"
  | "Paleo"
  | "Primal"
  | "Low FODMAP"
  | "Whole30";

export type Intolerance =
  | "Dairy"
  | "Egg"
  | "Gluten"
  | "Grain"
  | "Peanut"
  | "Seafood"
  | "Sesame"
  | "Shellfish"
  | "Soy"
  | "Sulfite"
  | "Tree Nut"
  | "Wheat";

export type Cuisine =
  | "African"
  | "Asian"
  | "American"
  | "British"
  | "Cajun"
  | "Caribbean"
  | "Chinese"
  | "Eastern European"
  | "European"
  | "French"
  | "German"
  | "Greek"
  | "Indian"
  | "Irish"
  | "Italian"
  | "Japanese"
  | "Jewish"
  | "Korean"
  | "Latin American"
  | "Mediterranean"
  | "Mexican"
  | "Middle Eastern"
  | "Nordic"
  | "Southern"
  | "Spanish"
  | "Thai"
  | "Vietnamese";

export interface SearchFilters {
  diet?: Diet;
  intolerances?: Intolerance[];
  cuisine?: Cuisine;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original: string;
}
