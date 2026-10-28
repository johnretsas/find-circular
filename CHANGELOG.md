# Changelog

## [2.0.0] - 2026-10-28

### Breaking
- Class instances and null-prototype objects now keep their prototype instead of becoming plain objects
- `Date`, `RegExp`, `Map`, `Set`, `Error`, `ArrayBuffer`, typed arrays and `Buffer` are copied instead of being returned as `{}`
- `findCircular` is now generic (`findCircular<T>(obj: T): T`) instead of returning `unknown`

### Added
- `replacer(path, target)` option to locate circular references or compute custom replacements
- `replaceToken` accepts any value, not only strings
- `Configuration`, `CircularReplacer` and `DEFAULT_REPLACE_TOKEN` are exported
- Circular references inside `Map` and `Set` are detected and replaced

### Fixed
- A partial configuration (e.g. `{}`) now falls back to the default `"[Circular]"` token instead of `undefined`
- Very deeply nested objects no longer overflow the call stack

## [1.2.0] - 2026-06-29

### Added
- Optional `configuration` argument to `findCircular`, with a `replaceToken` option to customize the value that replaces circular references (defaults to `"[Circular]"`)

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
