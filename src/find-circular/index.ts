import { DEFAULT_CONFIGURATION, type Configuration } from "./config";

export function findCircular(
  obj: unknown,
  configuration: Configuration = DEFAULT_CONFIGURATION,
) {
  return _findCircular(obj, configuration, new Set<object>());
}

function _findCircular(
  obj: unknown,
  configuration: Configuration,
  path = new Set<object>(),
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
    result[key] = _findCircular(
      (obj as Record<string | symbol, unknown>)[key],
      configuration,
      path,
    );
  }

  path.delete(obj);

  return result;
}
