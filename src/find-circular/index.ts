import { DEFAULT_REPLACE_TOKEN, type Configuration } from "./config";

type PathNode = { key: unknown; parent: PathNode } | undefined;
type Assign = (value: unknown) => void;

const NOT_A_LEAF = Symbol("not-a-leaf");
const typedArraySlice = Object.getPrototypeOf(Uint8Array.prototype).slice;

// Errors keep message/stack/cause as non-enumerable own properties
const ERROR_KEYS = ["message", "stack", "cause"];

export function findCircular<T>(obj: T, configuration: Configuration = {}): T {
  const { replaceToken = DEFAULT_REPLACE_TOKEN, replacer } = configuration;

  // Objects on the current path from the root. Only references back to these are
  // circular; shared (non-circular) references are deep-copied.
  const ancestors = new Set<object>();

  // Explicit work stack instead of recursion so deep structures don't overflow the call stack
  const stack: (() => void)[] = [];

  const visit = (value: unknown, path: PathNode, assign: Assign) => {
    if (value === null || typeof value !== "object") {
      assign(value);
      return;
    }

    if (ancestors.has(value)) {
      assign(replacer ? replacer(toArray(path), value) : replaceToken);
      return;
    }

    const leaf = cloneLeaf(value);
    if (leaf !== NOT_A_LEAF) {
      assign(leaf);
      return;
    }

    ancestors.add(value);
    // Pushed first so it runs after all children have been visited
    stack.push(() => ancestors.delete(value));

    if (value instanceof Map) {
      const target = new Map();
      assign(target);
      const entries = [...value];
      for (let i = entries.length - 1; i >= 0; i--) {
        const [key, val] = entries[i];
        const entry: [unknown, unknown] = [undefined, undefined];
        const childPath = { key, parent: path };
        stack.push(() => target.set(entry[0], entry[1]));
        stack.push(() => visit(val, childPath, (v) => (entry[1] = v)));
        stack.push(() => visit(key, childPath, (k) => (entry[0] = k)));
      }
      return;
    }

    if (value instanceof Set) {
      const target = new Set();
      assign(target);
      const items = [...value];
      for (let i = items.length - 1; i >= 0; i--) {
        const childPath = { key: i, parent: path };
        stack.push(() => visit(items[i], childPath, (v) => target.add(v)));
      }
      return;
    }

    const isArray = Array.isArray(value);
    const target: object = isArray
      ? new Array(value.length)
      : Object.create(Object.getPrototypeOf(value));
    assign(target);

    const keys: (string | symbol)[] = [
      ...Object.keys(value),
      ...Object.getOwnPropertySymbols(value),
    ];
    if (value instanceof Error) {
      for (const key of ERROR_KEYS) {
        if (Object.hasOwn(value, key) && !keys.includes(key)) keys.push(key);
      }
    }

    for (let i = keys.length - 1; i >= 0; i--) {
      const key = keys[i];
      // Define rather than assign so prototype setters/readonly accessors aren't triggered
      const enumerable = Object.prototype.propertyIsEnumerable.call(value, key);
      const pathKey = isArray && isIndex(key) ? Number(key) : key;
      stack.push(() =>
        visit(
          (value as Record<string | symbol, unknown>)[key],
          { key: pathKey, parent: path },
          (v) =>
            Object.defineProperty(target, key, {
              value: v,
              enumerable,
              writable: true,
              configurable: true,
            }),
        ),
      );
    }
  };

  let result: unknown;
  visit(obj, undefined, (v) => (result = v));
  while (stack.length > 0) {
    stack.pop()!();
  }

  return result as T;
}

// Copies objects that can't contain references (or that we can't traverse).
// Returns NOT_A_LEAF for objects whose properties need to be walked.
function cloneLeaf(value: object): unknown {
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) {
    const copy = new RegExp(value.source, value.flags);
    copy.lastIndex = value.lastIndex;
    return copy;
  }
  if (value instanceof ArrayBuffer) return value.slice(0);
  if (value instanceof DataView) {
    return new DataView(
      value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength),
    );
  }
  if (ArrayBuffer.isView(value)) return typedArraySlice.call(value);
  if (
    value instanceof WeakMap ||
    value instanceof WeakSet ||
    value instanceof WeakRef ||
    value instanceof Promise
  ) {
    return value;
  }
  return NOT_A_LEAF;
}

function isIndex(key: string | symbol): key is string {
  return typeof key === "string" && String(Number(key) >>> 0) === key;
}

function toArray(path: PathNode): unknown[] {
  const keys: unknown[] = [];
  for (let node = path; node; node = node.parent) {
    keys.push(node.key);
  }
  return keys.reverse();
}
