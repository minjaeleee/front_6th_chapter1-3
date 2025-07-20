import { shallowEquals } from "./shallowEquals";

export const deepEquals = (a: unknown, b: unknown): boolean => {
  if (shallowEquals(a, b)) return true;

  // 배열인 경우 재귀 비교
  if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i])) return false;
    }
    return true;
  }

  // 순수 객체 재귀 비교
  const isObject = (val: unknown): val is Record<string, unknown> => {
    return typeof val === "object" && val !== null && !Array.isArray(val);
  };

  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a);

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEquals(a[key], b[key])) return false;
    }

    return true;
  }

  return false;
};
