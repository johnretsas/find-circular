# Node TS Boilerplate

A minimal Node.js boilerplate using TypeScript, Axios, ESLint, and other modern JavaScript tools for building scalable and maintainable applications.

## Features

- **TypeScript**: Latest ECMAScript features and type safety.
- **Axios**: For making HTTP requests.
- **ESLint**: Code linting with TypeScript support.
- **tsx**: For running TypeScript directly in development (`tsx watch` for hot reloading).
- **Build**: TypeScript compilation to JavaScript with type declarations.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/node-ts-boilerplate.git
   cd node-ts-boilerplate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Scripts

- **Build**: Compile TypeScript to JavaScript

  ```bash
  npm run build
  ```

- **Start**: Run the compiled application

  ```bash
  npm start
  ```

- **Dev**: Run the app in development mode with hot reloading

  ```bash
  npm run dev
  ```

- **Clean**: Clean the build artifacts

  ```bash
  npm run clean
  ```

- **Lint**: Lint your code with ESLint

  ```bash
  npm run lint
  ```

- **Type-check**: Perform TypeScript type checking without emitting files
  ```bash
  npm run type-check
  ```

## Configuration

- **TypeScript**: Configuration is in `tsconfig.json`. It uses `ESNext` module system for compatibility with modern JavaScript.
- **ESLint**: Configuration is in `.eslintrc.json`, enforcing best practices and TypeScript-specific linting rules.

## License

MIT License