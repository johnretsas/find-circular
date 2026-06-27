import { findCircular } from "./index";

describe("findCircular", () => {
  it("should return primitives unchanged", () => {
    expect(findCircular(42)).toBe(42);
    expect(findCircular("hello")).toBe("hello");
    expect(findCircular(null)).toBe(null);
  });

  it("should handle non-circular objects", () => {
    const obj = { a: 1, b: { c: 2 } };
    expect(findCircular(obj)).toEqual({ a: 1, b: { c: 2 } });
  });

  it('should replace circular references with "[Circular]"', () => {
    const obj: Record<any, any> = { a: 1 };
    obj.b = obj;
    expect(findCircular(obj)).toEqual({ a: 1, b: "[Circular]" });
  });

  it("should handle nested circular references", () => {
    const obj: any = { a: 1, b: { c: 2 } };
    obj.b.d = obj;
    expect(findCircular(obj)).toEqual({ a: 1, b: { c: 2, d: "[Circular]" } });
  });

  it("should handle arrays with circular references", () => {
    const arr: any[] = [1, 2];
    arr.push(arr);
    expect(findCircular(arr)).toEqual([1, 2, "[Circular]"]);
  });

  it("should handle duplicate references that are not circular", () => {
    const shared = { a: 1 };
    const obj = { b: shared, c: shared };
    expect(findCircular(obj)).toEqual({ b: { a: 1 }, c: { a: 1 } });
  });

  it("should handle complex nested structures with circular references", () => {
    const obj: any = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
          f: null,
        },
      },
    };
    obj.b.d.f = obj.b;
    expect(findCircular(obj)).toEqual({
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
          f: "[Circular]",
        },
      },
    });
  });

  it("should handle multiple circular references at different levels", () => {
    const obj: any = { a: 1, b: { c: 2 } };
    obj.b.d = obj;
    obj.e = obj.b;
    const result = findCircular(obj);

    expect(result).toEqual({
      a: 1,
      b: { c: 2, d: "[Circular]" },
      e: { c: 2, d: "[Circular]" },
    });
  });

  it("should handle multiple circular references", () => {
    const obj: any = { a: 1, b: { c: 2 } };
    obj.b.d = obj;
    obj.b.e = obj.b;
    obj.e = obj;

    const result = findCircular(obj);

    expect(result).toEqual({
      a: 1,
      b: { c: 2, d: "[Circular]", e: "[Circular]" },
      e: "[Circular]",
    });
  });

  it("should handle circular references in arrays within objects", () => {
    const obj: any = { a: [1, 2, 3] };
    obj.a.push(obj);
    expect(findCircular(obj)).toEqual({ a: [1, 2, 3, "[Circular]"] });
  });

  it("should handle nested circular references in arrays withing objects", () => {
    const obj: any = { a: [1, 2, 3], aaa: { aab: 1, aac: [1, 2, 3] } };
    const nestedCircular: any = { b: 4, c: 5 };
    nestedCircular.d = obj;

    obj.a.push(nestedCircular);
    obj.aaa.aac.push(obj.aaa);

    obj.aaa.aad = obj;

    const result = findCircular(obj);

    expect(result).toEqual({
      a: [1, 2, 3, { b: 4, c: 5, d: "[Circular]" }],
      aaa: { aab: 1, aac: [1, 2, 3, "[Circular]"], aad: "[Circular]" },
    });
  });

  it("should handle circular across", () => {
    const obj: any = {
      a: { a1: 1, a2: 2 },
      b: { b1: 1, b2: 1 },
      c: { c1: 1, c2: 2 },
    };

    // first circular in the A branch
    obj.a.a3 = obj;

    // second circular in the B branch pointing to the a that has the circular
    obj.b.b3 = obj.a.a3;

    // thrid circular in the C branch pointing to the b that has the circular to the a
    obj.c.c3 = obj.b.b3;

    const result = findCircular(obj);
    expect(result).toEqual({
      a: { a1: 1, a2: 2, a3: "[Circular]" },
      b: { b1: 1, b2: 1, b3: "[Circular]" },
      c: { c1: 1, c2: 2, c3: "[Circular]" },
    });
  });

  it("should handle circular references in objects within arrays", () => {
    const obj: any = { a: [{ b: 1 }, { c: 2 }] };
    obj.a[1].d = obj.a;
    expect(findCircular(obj)).toEqual({
      a: [{ b: 1 }, { c: 2, d: "[Circular]" }],
    });
  });

  it("should handle self-referencing objects", () => {
    const obj: any = {};
    obj.self = obj;
    expect(findCircular(obj)).toEqual({ self: "[Circular]" });
  });

  it("should handle deep nested circular references", () => {
    const obj: any = { a: { b: { c: { d: {} } } } };
    obj.a.b.c.d.e = obj.a.b;
    expect(findCircular(obj)).toEqual({
      a: {
        b: {
          c: {
            d: {
              e: "[Circular]",
            },
          },
        },
      },
    });
  });

  it("should handle objects with shared substructures containing circular references", () => {
    const shared: any = { x: 42 };
    shared.self = shared;
    const obj = { a: shared, b: shared };

    expect(findCircular(obj)).toEqual({
      a: { x: 42, self: "[Circular]" },
      b: { x: 42, self: "[Circular]" },
    });
  });

  it("should handle arrays with duplicate and circular references", () => {
    const arr: any[] = [1, 2];
    arr.push(arr); // Circular
    arr.push(arr[1]); // Duplicate

    expect(findCircular(arr)).toEqual([1, 2, "[Circular]", 2]);
  });

  it("should handle deeply nested arrays with circular references", () => {
    const arr: any[] = [[[[42]]]];
    arr[0][0][0].push(arr); // Circular

    expect(findCircular(arr)).toEqual([[[[42, "[Circular]"]]]]);
  });

  it("should handle complex cyclic graphs", () => {
    const obj: any = { a: { b: { c: {} } } };
    obj.a.b.c.d = obj.a.b; // Circular reference
    obj.a.b.c.e = obj.a; // Circular reference

    expect(findCircular(obj)).toEqual({
      a: {
        b: {
          c: {
            d: "[Circular]",
            e: "[Circular]",
          },
        },
      },
    });
  });

  it("should handle circular references in arrays of objects", () => {
    const arr: any[] = [{ x: 1 }, { y: 2 }];
    arr[1].z = arr; // Circular reference
    expect(findCircular(arr)).toEqual([{ x: 1 }, { y: 2, z: "[Circular]" }]);
  });

  it("should handle cross-referencing objects", () => {
    const obj: any = { a: {}, b: {} };
    obj.a.b = obj.b; // Cross-reference
    obj.b.a = obj.a; // Cross-reference
    expect(findCircular(obj)).toEqual({
      a: { b: { a: "[Circular]" } },
      b: { a: { b: "[Circular]" } },
    });
  });

  it("should handle objects with undefined values", () => {
    const obj = { a: undefined, b: 42 };
    expect(findCircular(obj)).toEqual({ a: undefined, b: 42 });
  });

  it("should handle empty objects and arrays", () => {
    expect(findCircular({})).toEqual({});
    expect(findCircular([])).toEqual([]);
  });

  it("should handle circular references with symbol keys", () => {
    const sym = Symbol("key");
    const obj: any = { [sym]: {} };
    obj[sym].self = obj[sym];
    expect(findCircular(obj)).toEqual({
      [sym]: { self: "[Circular]" },
    });
  });

  it("should handle deeply nested mixtures of objects and arrays with circular references", () => {
    const obj: any = {
      a: [{ b: { c: [{}] } }],
    };
    obj.a[0].b.c[0].d = obj.a[0]; // Circular reference
    expect(findCircular(obj)).toEqual({
      a: [{ b: { c: [{ d: "[Circular]" }] } }],
    });
  });

  it("should handle objects with functions", () => {
    const func = () => 42;
    const obj = { a: func, b: { c: func } };
    expect(findCircular(obj)).toEqual({ a: func, b: { c: func } });
  });

  it("should respect the replaceToken", () => {
    const obj: any = { a: 1, b: { c: 2 } };
    obj.b.d = obj;
    obj.b.e = obj.b;
    obj.e = obj;

    const result = findCircular(obj, { replaceToken: "found circular" });

    expect(result).toEqual({
      a: 1,
      b: { c: 2, d: "found circular", e: "found circular" },
      e: "found circular",
    });
  });
});
