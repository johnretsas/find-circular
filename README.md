# find-circular

A utility to detect and handle circular references in objects. Replaces circular references with `"[Circular]"` and safely deep-copies shared (non-circular) references.

It works on arbitrarily deep structures (no recursion, so no stack overflow), preserves class prototypes, and copies `Map`, `Set`, `Date`, `RegExp`, `Error` and binary data (`ArrayBuffer`, typed arrays, `Buffer`) instead of flattening them.

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

### Locating circular references

Pass a `replacer` to compute the replacement yourself. It receives the path from the root to the circular reference and the ancestor object it points back to:

```typescript
const obj = { a: { b: [1] } };
obj.a.b.push(obj.a);

const paths = [];
findCircular(obj, {
  replacer: (path, target) => {
    paths.push(path);
    return `[Circular -> ${path.join(".")}]`;
  },
});
// paths: [["a", "b", 1]]
```

### Maps, Sets and other built-ins

```typescript
const map = new Map([["a", 1]]);
map.set("self", map);

findCircular(map);
// Map { "a" => 1, "self" => "[Circular]" }
```

Class instances keep their prototype (so methods and getters still work); `WeakMap`, `WeakSet`, `WeakRef` and `Promise` are returned as-is since they can't be copied.

## API

### `findCircular<T>(obj: T, configuration?): T`

| Parameter | Type | Description |
|-----------|------|-------------|
| `obj` | `unknown` | The object to process |
| `configuration` | `Configuration` | Optional. See options below. |

#### `Configuration`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `replaceToken` | `unknown` | `"[Circular]"` | Value substituted in place of each circular reference. |
| `replacer` | `(path: unknown[], target: object) => unknown` | — | Called for each circular reference; its return value is used as the replacement. Takes precedence over `replaceToken`. |

`Configuration`, `CircularReplacer` and `DEFAULT_REPLACE_TOKEN` are exported.

**Returns:** A deep copy of the object with circular references replaced. The return type is inferred from the input for convenience; note that the slots holding circular references contain the replacement value at runtime, not the original type.

## License

MIT

## Links

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/johnretsas/find-circular)
[![npm](https://img.shields.io/badge/npm-Package-red?logo=npm)](https://www.npmjs.com/package/find-circular)
