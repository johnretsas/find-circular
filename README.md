# find-circular

A utility to detect and handle circular references in objects.

## Installation

```bash
npm install find-circular
```

## Usage

```typescript
import { findCircular } from "find-circular";

const obj = { a: 1 };
obj.self = obj;

console.log(findCircular(obj));
// Output: { a: 1, self: "[Circular]" }

## GitHub Repository

You can find the source code and contribute to the project on GitHub:

[find-circular GitHub Repository](https://github.com/johnretsas/find-circular)
```
