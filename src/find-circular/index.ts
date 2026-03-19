export function findCircular(
  obj: unknown,
  seen = new WeakSet(),
  path = new Set<object>(),
): unknown {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (path.has(obj)) {
    return "[Circular]";
  }

  if (seen.has(obj)) {
    const result = (Array.isArray(obj) ? [] : {}) as Record<string | symbol, unknown>;
    path.add(obj);
    for (const key of [
      ...Object.keys(obj),
      ...Object.getOwnPropertySymbols(obj),
    ]) {
      result[key] = findCircular((obj as Record<string | symbol, unknown>)[key], new WeakSet(), path);
    }
    path.delete(obj);
    return result;
  }

  seen.add(obj);

  const result = (Array.isArray(obj) ? [] : {}) as Record<string | symbol, unknown>;
  path.add(obj);
  for (const key of [
    ...Object.keys(obj),
    ...Object.getOwnPropertySymbols(obj),
  ]) {
    result[key] = findCircular((obj as Record<string | symbol, unknown>)[key], seen, path);
  }
  path.delete(obj);

  return result;
}
