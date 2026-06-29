# find-circular

A utility to detect and handle circular references in objects. Replaces circular references with `"[Circular]"` and safely deep-copies shared (non-circular) references.

## Installation

```bash
npm install find-circular
```

## Usage

```typescript
import { findCircular } from "find-circular";

// Circular reference
const obj = { a: 1 };
obj.self = obj;

console.log(findCircular(obj));
// { a: 1, self: "[Circular]" }
```

### Nested circular references

```typescript
const obj = { a: { b: { c: 1 } } };
obj.a.b.parent = obj;

console.log(findCircular(obj));
// { a: { b: { c: 1, parent: "[Circular]" } } }
```

### Shared (non-circular) references

Duplicate references that aren't circular are deep-copied, not replaced:

```typescript
const shared = { x: 42 };
const obj = { a: shared, b: shared };

console.log(findCircular(obj));
// { a: { x: 42 }, b: { x: 42 } }
```

### Arrays

```typescript
const arr = [1, 2, 3];
arr.push(arr);

console.log(findCircular(arr));
// [1, 2, 3, "[Circular]"]
```

### Custom replacement token

By default circular references are replaced with `"[Circular]"`. Pass a `replaceToken` to use a different value:

```typescript
const obj = { a: 1 };
obj.self = obj;

console.log(findCircular(obj, { replaceToken: "<cycle>" }));
// { a: 1, self: "<cycle>" }
```

## API

### `findCircular(obj, configuration?)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `obj` | `unknown` | The object to process |
| `configuration` | `Configuration` | Optional. See options below. Defaults to `{ replaceToken: "[Circular]" }`. |

#### `Configuration`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `replaceToken` | `string` | `"[Circular]"` | Value substituted in place of each circular reference. |

**Returns:** A deep copy of the object with circular references replaced by the configured `replaceToken`.

## License

MIT

## Links

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/johnretsas/find-circular)
[![npm](https://img.shields.io/badge/npm-Package-red?logo=npm)](https://www.npmjs.com/package/find-circular)
