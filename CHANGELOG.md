# Changelog

## [Unreleased]

### Fixed
- Fixed `main` field pointing to nonexistent `index.js` instead of `dist/index.cjs`
- Fixed build output using IIFE format instead of ESM — exports were inaccessible to Node.js consumers
- Added CJS build output (`dist/index.cjs`) for CommonJS consumers
- Added `exports` field for proper dual ESM/CJS support
- Added TypeScript declaration generation (`tsc --emitDeclarationOnly`) to build step

## [1.0.16] - 1.0.25

### Changed
- Version bumps only (no functional changes)

## [1.0.16]

### Fixed
- Removed accidentally published `.tgz` archives from package

## [1.0.15]

### Fixed
- Switched to esbuild for bundling

## [1.0.14] and earlier

### Added
- Initial implementation of `findCircular` utility
- Handles circular references by replacing them with `"[Circular]"`
- Handles duplicate (shared) non-circular references by deep copying
- Supports symbol keys, arrays, nested structures, and mixed object/array graphs
- Jest test suite with 20+ test cases
- esbuild-based build pipeline
- GitHub Actions release workflow
- npm publishing configuration
