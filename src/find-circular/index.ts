type Configuration = {
  replaceToken?: string;
};

export function findCircular(
  obj: unknown,
  seen = new WeakSet(),
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

  if (seen.has(obj)) {
    path.add(obj);

    for (const key of [
      ...Object.keys(obj),
      ...Object.getOwnPropertySymbols(obj),
    ]) {
      result[key] = findCircular(
        (obj as Record<string | symbol, unknown>)[key],
        new WeakSet(),
        path,
      );
    }

    path.delete(obj);

    return result;
  } else {
    seen.add(obj);
    path.add(obj);

    for (const key of [
      ...Object.keys(obj),
      ...Object.getOwnPropertySymbols(obj),
    ]) {
      result[key] = findCircular(
        (obj as Record<string | symbol, unknown>)[key],
        seen,
        path,
      );
    }

    path.delete(obj);

    return result;
  }
}

const testObj = {
  name: "John",
  email: "superEmail",
  address: { number: 10, street: "Armouries Way" },
} as any;

testObj.person = testObj;

console.log(findCircular(testObj));
