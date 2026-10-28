import { findCircular } from "./../index";
import { DEFAULT_REPLACE_TOKEN } from "../config";

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

  it("should replace circular references with DEFAULT_REPLACE_TOKEN", () => {
    const obj: Record<any, any> = { a: 1 };
    obj.b = obj;
    expect(findCircular(obj)).toEqual({ a: 1, b: DEFAULT_REPLACE_TOKEN });
  });

  it("should handle nested circular references", () => {
    const obj: any = { a: 1, b: { c: 2 } };
    obj.b.d = obj;
    expect(findCircular(obj)).toEqual({
      a: 1,
      b: { c: 2, d: DEFAULT_REPLACE_TOKEN },
    });
  });

  it("should handle arrays with circular references", () => {
    const arr: any[] = [1, 2];
    arr.push(arr);
    expect(findCircular(arr)).toEqual([1, 2, DEFAULT_REPLACE_TOKEN]);
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
          f: DEFAULT_REPLACE_TOKEN,
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
      b: { c: 2, d: DEFAULT_REPLACE_TOKEN },
      e: { c: 2, d: DEFAULT_REPLACE_TOKEN },
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
      b: { c: 2, d: DEFAULT_REPLACE_TOKEN, e: DEFAULT_REPLACE_TOKEN },
      e: DEFAULT_REPLACE_TOKEN,
    });
  });

  it("should handle circular references in arrays within objects", () => {
    const obj: any = { a: [1, 2, 3] };
    obj.a.push(obj);
    expect(findCircular(obj)).toEqual({ a: [1, 2, 3, DEFAULT_REPLACE_TOKEN] });
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
      a: [1, 2, 3, { b: 4, c: 5, d: DEFAULT_REPLACE_TOKEN }],
      aaa: {
        aab: 1,
        aac: [1, 2, 3, DEFAULT_REPLACE_TOKEN],
        aad: DEFAULT_REPLACE_TOKEN,
      },
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
      a: { a1: 1, a2: 2, a3: DEFAULT_REPLACE_TOKEN },
      b: { b1: 1, b2: 1, b3: DEFAULT_REPLACE_TOKEN },
      c: { c1: 1, c2: 2, c3: DEFAULT_REPLACE_TOKEN },
    });
  });

  it("should handle circular references in objects within arrays", () => {
    const obj: any = { a: [{ b: 1 }, { c: 2 }] };
    obj.a[1].d = obj.a;
    expect(findCircular(obj)).toEqual({
      a: [{ b: 1 }, { c: 2, d: DEFAULT_REPLACE_TOKEN }],
    });
  });

  it("should handle self-referencing objects", () => {
    const obj: any = {};
    obj.self = obj;
    expect(findCircular(obj)).toEqual({ self: DEFAULT_REPLACE_TOKEN });
  });

  it("should handle deep nested circular references", () => {
    const obj: any = { a: { b: { c: { d: {} } } } };
    obj.a.b.c.d.e = obj.a.b;
    expect(findCircular(obj)).toEqual({
      a: {
        b: {
          c: {
            d: {
              e: DEFAULT_REPLACE_TOKEN,
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
      a: { x: 42, self: DEFAULT_REPLACE_TOKEN },
      b: { x: 42, self: DEFAULT_REPLACE_TOKEN },
    });
  });

  it("should handle arrays with duplicate and circular references", () => {
    const arr: any[] = [1, 2];
    arr.push(arr); // Circular
    arr.push(arr[1]); // Duplicate

    expect(findCircular(arr)).toEqual([1, 2, DEFAULT_REPLACE_TOKEN, 2]);
  });

  it("should handle deeply nested arrays with circular references", () => {
    const arr: any[] = [[[[42]]]];
    arr[0][0][0].push(arr); // Circular

    expect(findCircular(arr)).toEqual([[[[42, DEFAULT_REPLACE_TOKEN]]]]);
  });

  it("should handle complex cyclic graphs", () => {
    const obj: any = { a: { b: { c: {} } } };
    obj.a.b.c.d = obj.a.b; // Circular reference
    obj.a.b.c.e = obj.a; // Circular reference

    expect(findCircular(obj)).toEqual({
      a: {
        b: {
          c: {
            d: DEFAULT_REPLACE_TOKEN,
            e: DEFAULT_REPLACE_TOKEN,
          },
        },
      },
    });
  });

  it("should handle circular references in arrays of objects", () => {
    const arr: any[] = [{ x: 1 }, { y: 2 }];
    arr[1].z = arr; // Circular reference
    expect(findCircular(arr)).toEqual([
      { x: 1 },
      { y: 2, z: DEFAULT_REPLACE_TOKEN },
    ]);
  });

  it("should handle cross-referencing objects", () => {
    const obj: any = { a: {}, b: {} };
    obj.a.b = obj.b; // Cross-reference
    obj.b.a = obj.a; // Cross-reference
    expect(findCircular(obj)).toEqual({
      a: { b: { a: DEFAULT_REPLACE_TOKEN } },
      b: { a: { b: DEFAULT_REPLACE_TOKEN } },
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
      [sym]: { self: DEFAULT_REPLACE_TOKEN },
    });
  });

  it("should handle deeply nested mixtures of objects and arrays with circular references", () => {
    const obj: any = {
      a: [{ b: { c: [{}] } }],
    };
    obj.a[0].b.c[0].d = obj.a[0]; // Circular reference
    expect(findCircular(obj)).toEqual({
      a: [{ b: { c: [{ d: DEFAULT_REPLACE_TOKEN }] } }],
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

  it("should fall back to the default token when the configuration is partial", () => {
    const obj: any = { a: 1 };
    obj.self = obj;
    expect(findCircular(obj, {})).toEqual({ a: 1, self: DEFAULT_REPLACE_TOKEN });
  });

  it("should accept non-string replace tokens", () => {
    const obj: any = { a: 1 };
    obj.self = obj;
    expect(findCircular(obj, { replaceToken: null })).toEqual({
      a: 1,
      self: null,
    });
  });

  it("should call the replacer with the path and target of each circular reference", () => {
    const obj: any = { a: { b: [1] } };
    obj.a.b.push(obj.a);
    obj.self = obj;
    const found: [unknown[], object][] = [];

    const result = findCircular(obj, {
      replacer: (path, target) => {
        found.push([path, target]);
        return `<${path.join(".")}>`;
      },
    });

    expect(result).toEqual({ a: { b: [1, "<a.b.1>"] }, self: "<self>" });
    expect(found).toEqual([
      [["a", "b", 1], obj.a],
      [["self"], obj],
    ]);
    expect(found[0][1]).toBe(obj.a);
  });

  it("should copy dates and regular expressions", () => {
    const date = new Date(0);
    const regex = /ab+c/gi;
    const result: any = findCircular({ date, regex });

    expect(result.date).toBeInstanceOf(Date);
    expect(result.date).not.toBe(date);
    expect(result.date.getTime()).toBe(0);
    expect(result.regex).toBeInstanceOf(RegExp);
    expect(result.regex).not.toBe(regex);
    expect(result.regex.source).toBe("ab+c");
    expect(result.regex.flags).toBe("gi");
  });

  it("should copy binary data", () => {
    const bytes = new Uint8Array([1, 2, 3]);
    const buffer = Buffer.from([4, 5]);
    const result: any = findCircular({ bytes, buffer });

    expect(result.bytes).toBeInstanceOf(Uint8Array);
    expect(result.bytes).not.toBe(bytes);
    expect([...result.bytes]).toEqual([1, 2, 3]);
    expect(Buffer.isBuffer(result.buffer)).toBe(true);
    result.buffer[0] = 0;
    expect(buffer[0]).toBe(4);
  });

  it("should copy Maps and replace circular references inside them", () => {
    const map = new Map<unknown, unknown>([["a", { x: 1 }]]);
    map.set("self", map);
    map.set(map, "key is circular");

    const result = findCircular(map);

    expect(result).toBeInstanceOf(Map);
    expect(result).not.toBe(map);
    expect([...result]).toEqual([
      ["a", { x: 1 }],
      ["self", DEFAULT_REPLACE_TOKEN],
      [DEFAULT_REPLACE_TOKEN, "key is circular"],
    ]);
  });

  it("should copy Sets and replace circular references inside them", () => {
    const set = new Set<unknown>([1, { y: 2 }]);
    set.add(set);

    const result = findCircular(set);

    expect(result).toBeInstanceOf(Set);
    expect([...result]).toEqual([1, { y: 2 }, DEFAULT_REPLACE_TOKEN]);
  });

  it("should preserve class prototypes and accessors", () => {
    class Point {
      constructor(
        public x: number,
        public parent?: Point,
      ) {}
      get double() {
        return this.x * 2;
      }
    }
    const point = new Point(2);
    point.parent = point;

    const result = findCircular(point);

    expect(result).toBeInstanceOf(Point);
    expect(result.double).toBe(4);
    expect(result.parent).toBe(DEFAULT_REPLACE_TOKEN);
    expect(Object.keys(result)).toEqual(["x", "parent"]);
  });

  it("should preserve null-prototype objects", () => {
    const obj = Object.assign(Object.create(null), { a: 1 });
    obj.self = obj;
    const result = findCircular(obj);
    expect(Object.getPrototypeOf(result)).toBe(null);
    expect({ ...result }).toEqual({ a: 1, self: DEFAULT_REPLACE_TOKEN });
  });

  it("should keep error messages and handle circular causes", () => {
    const error: any = new Error("boom");
    error.cause = error;
    error.code = "E_BOOM";

    const result: any = findCircular(error);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("boom");
    expect(result.stack).toBe(error.stack);
    expect(result.cause).toBe(DEFAULT_REPLACE_TOKEN);
    expect(result.code).toBe("E_BOOM");
    expect(Object.keys(result)).toEqual(Object.keys(error));
  });

  it("should preserve sparse arrays", () => {
    // eslint-disable-next-line no-sparse-arrays
    const result = findCircular([1, , 3, ,]);
    expect(result).toHaveLength(4);
    expect(1 in result).toBe(false);
  });

  it("should handle very deeply nested structures without overflowing the stack", () => {
    const root: any = {};
    let current = root;
    for (let i = 0; i < 100_000; i++) {
      current.next = {};
      current = current.next;
    }
    current.back = root;

    let result: any = findCircular(root);
    for (let i = 0; i < 100_000; i++) {
      result = result.next;
    }
    expect(result).toEqual({ back: DEFAULT_REPLACE_TOKEN });
  });

  it("should infer the return type from the input", () => {
    const result = findCircular({ a: 1 });
    const a: number = result.a;
    expect(a).toBe(1);
  });
});
