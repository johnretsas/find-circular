export function findCircular(
  obj: any,
  seen = new WeakSet(),
  path: any[] = []
): any {
  if (obj === null || typeof obj !== "object") {
    return obj; // Base case: leave primitives unchanged
  }

  // Check for circular reference
  if (path.includes(obj)) {
    return "[Circular]";
  }

  // Check if object has been seen before
  if (seen.has(obj)) {
    // Duplicate reference: return a full copy (not [Circular])
    const result = Array.isArray(obj)
      ? ([] as { [key: string | symbol]: any })
      : {};
    for (const key of [
      ...Object.keys(obj), // Include string keys
      ...Object.getOwnPropertySymbols(obj), // Include symbol keys
    ]) {
      result[key] = findCircular(obj[key], new WeakSet(), [...path, obj]);
    }
    return result;
  }

  // Mark the current object as seen
  seen.add(obj);

  // Recursively process properties
  const result = Array.isArray(obj)
    ? ([] as { [key: string | symbol]: any })
    : {};
  for (const key of [
    ...Object.keys(obj), // Include string keys
    ...Object.getOwnPropertySymbols(obj), // Include symbol keys
  ]) {
    result[key] = findCircular(obj[key], seen, [...path, obj]);
  }

  return result;
}
