# Recipe Finder / Savory circuits

A modern web application that helps users discover recipes based on ingredients, dietary restrictions, and cuisine preferences. Built with React, TypeScript, and the Spoonacular API.

## Features

- Search recipes by ingredients or recipe name
- Filter recipes by:
  - Dietary restrictions (vegetarian, vegan, gluten-free, etc.)
  - Cuisine type
  - Food intolerances
- Save favorite recipes
- Detailed recipe view with ingredients and instructions
- Responsive design for all devices

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: TailwindCSS 4
- **Routing**: React Router DOM 7
- **Testing**:
  - Vitest for unit testing
  - React Testing Library for component testing
  - MSW for API mocking
- **Development Tools**:
  - ESLint for code linting
  - Storybook for component development and documentation
  - TypeScript for type safety

## API Integration

The application uses the [Spoonacular API](https://spoonacular.com/food-api/docs) for recipe data. To use the application:

1. Sign up for a Spoonacular API key at https://spoonacular.com/food-api/console#Dashboard
2. Create a `.env` file in the project root with your API key:
   ```
   VITE_SPOONACULAR_API_KEY=your_api_key_here
   ```

### API Limitations

This particular API has a limit for the free users of 150 points per day so if you test it a lot maybe it's going to reach the limit but you can see how the pages and components behave in the storybook section that mocks the api calls

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/recipe-finder.git
   cd recipe-finder
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file with your Spoonacular API key (see API Integration section)

4. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:5173`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm storybook` - Start Storybook development server
- `pnpm build-storybook` - Build Storybook for production

## Design Decisions

### Architecture

- **Component-Based Structure**: The application follows a modular component architecture for better maintainability and reusability
- **Type Safety**: TypeScript is used throughout the project to ensure type safety and better developer experience
- **State Management**: Local state and React hooks are used for state management, keeping the application simple and maintainable
- **API Layer**: Centralized API service layer with proper error handling and type definitions

### User Experience

- **Persistent State**: Search results and filters are persisted in localStorage for a better user experience
- **Responsive Design**: Mobile-first approach with TailwindCSS for consistent styling across devices
- **Loading States**: Proper loading states and error handling for API calls
- **Accessibility**: Semantic HTML and ARIA attributes for better accessibility

### Testing Strategy

- **Unit Tests**: Components and utilities are tested with Vitest and React Testing Library
- **Integration Tests**: API integration is tested with MSW for reliable and fast tests
- **Storybook**: Component documentation and visual testing through Storybook

### Project Structure

The project follows a modular and organized structure in the `src` directory:

```
src/
├── assets/          # Static assets like images, fonts, etc.
├── components/      # Reusable UI components
│   └── __tests__/  # Component-specific tests
├── hooks/          # Custom React hooks
├── mocks/          # Mock data for testing and development
├── pages/          # Page components (routes)
├── services/       # API and external service integrations
├── stories/        # Storybook stories for components
├── test/           # Test utilities and setup
├── types/          # TypeScript type definitions
├── utils/          # Utility functions and helpers
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
└── index.css       # Global styles
```

Each directory serves a specific purpose:

- `components/`: Contains reusable UI components like `RecipeCard`, `SearchBar`, etc.
- `pages/`: Contains the main page components (`Home`, `RecipeDetail`, `Favorites`)
- `services/`: Contains API integration code and external service calls
- `hooks/`: Contains custom React hooks for shared logic
- `types/`: Contains TypeScript interfaces and type definitions
- `utils/`: Contains helper functions and utilities
- `mocks/`: Contains mock data for testing and development
- `stories/`: Contains Storybook stories for component documentation
- `test/`: Contains test utilities and setup files
