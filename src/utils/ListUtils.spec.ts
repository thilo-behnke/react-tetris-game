import { difference, groupBy, range, zip, zipRange } from "./ListUtils";

describe("ListUtils", () => {
  describe("ListUtils.range", () => {
    it("should return empty list for n = 0", () => {
      const res = range(0);
      expect(res).toEqual([]);
    });
    it("should return empty list for n < 0", () => {
      const res = range(-1);
      expect(res).toEqual([]);
    });
    it("should return list with list.length = n and list[i] = i", () => {
      const res = range(10);
      expect(res).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe("ListUtils.zip", () => {
    it("should return empty list for a = [] and b = []", () => {
      const res = zip([], []);
      expect(res).toEqual([]);
    });
    it("should return empty list when a is non-empty and b = []", () => {
      const res = zip([3, 5], []);
      expect(res).toEqual([]);
    });
    it("should return empty list when a = [] and b is non-empty", () => {
      const res = zip([], [4, 45]);
      expect(res).toEqual([]);
    });
    it("should return zipped list when a is non-empty and b is non-empty", () => {
      const res = zip([23, 55], [4, 45]);
      expect(res).toEqual([
        [23, 4],
        [23, 45],
        [55, 4],
        [55, 45],
      ]);
    });
  });

  describe("ListUtils.zipRange", () => {
    it("should return empty list for n = 0 and m = 0", () => {
      const res = zipRange(0, 0);
      expect(res).toEqual([]);
    });
    it("should return zipped range of n and m for n > 0 and m > 0", () => {
      const res = zipRange(4, 2);
      expect(res).toEqual([
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
        [2, 0],
        [2, 1],
        [3, 0],
        [3, 1],
      ]);
    });
  });

  describe("ListUtils.difference", () => {
    type ElemType = {
      a: number;
      b: string;
    };
    const equals = (elemA: ElemType, elemB: ElemType) => {
      return elemA.a === elemB.a && elemA.b === elemB.b;
    };
    it("should return empty list for a = [] and b = []", () => {
      const res = difference<ElemType>([], [], equals);
      expect(res).toEqual([]);
    });
    it("should return a if b = []", () => {
      const a = [{ a: 3, b: "test" }];
      const res = difference<ElemType>(a, [], equals);
      expect(res).toEqual(a);
    });
    it("should return difference of a and b", () => {
      const a = [
        { a: 3, b: "test" },
        { a: 44, b: "hello" },
      ];
      const b = [{ a: 3, b: "test" }];
      const res = difference<ElemType>(a, b, equals);
      expect(res).toEqual([{ a: 44, b: "hello" }]);
    });
  });

  describe("ListUtils.groupBy", () => {
    it("should return empty list for list = []", () => {
      const res = groupBy([], "a");
      expect(res).toEqual([]);
    });
    it("should group list by key", () => {
      const list = [
        { a: 10, b: "hello" },
        { a: 10, b: "world" },
        { a: 3, b: "oh no" },
      ];
      const res = groupBy(list, "a");
      const expected = [
        {
          key: 10,
          items: [
            { a: 10, b: "hello" },
            { a: 10, b: "world" },
          ],
        },
        { key: 3, items: [{ a: 3, b: "oh no" }] },
      ];
      expect(res).toEqual(expected);
    });
  });
});
