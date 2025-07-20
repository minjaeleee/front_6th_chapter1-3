export const deepEquals = (a: unknown, b: unknown): boolean => {
  // 1. 기본 값 비교
  if (a === b || (Number.isNaN(a) && Number.isNaN(b))) return true;

  // 2. 배열 비교
  if (Array.isArray(a) && Array.isArray(b)) {
    // 배열의 length로 비교
    if (a.length !== b.length) return false;

    // 재귀적으로 모든 depth의 요소를 비교
    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i])) return false;
    }

    return true;
  }

  // 배열이 아닌데 한쪽만 배열이면 false
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  // 3. 순수 객체 비교
  const isObject = (val: unknown): val is Record<string, unknown> => {
    return typeof val === "object" && val !== null && !Array.isArray(val);
  };

  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEquals(a[key], b[key])) return false;
    }

    return true;
  }

  // 기본 타입인데 === 실패했으면 false
  return false;
};
