type Configuration = {
  replaceToken?: string;
};

export function findCircular(
  obj: unknown,
  path = new Set<object>(),
  configuration: Configuration = { replaceToken: "[Circular]" },
): unknown {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (path.has(obj)) {
    return configuration.replaceToken;
  }

  const result = (Array.isArray(obj) ? [] : {}) as Record<
    string | symbol,
    unknown
  >;

  path.add(obj);

  for (const key of [
    ...Object.keys(obj),
    ...Object.getOwnPropertySymbols(obj),
  ]) {
    result[key] = findCircular(
      (obj as Record<string | symbol, unknown>)[key],
      path,
    );
  }

  path.delete(obj);

  return result;
}

console.log(findCircular(obj));
