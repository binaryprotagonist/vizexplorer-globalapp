/**
 * @param arr an array of some description
 * @param ascending optionally choose to sort ascending or descending
 * @param itereeFn optional function for sorting objects by specifying the key to sort by
 * For example, sort by users first name: (user: User) => user.firstName
 * @returns sorted array
 */
export function sortArray<T>(
  arr: T[],
  ascending = true,
  itereeFn?: (val: T) => any
): T[] {
  const copy = [...arr];

  return copy.sort((val1, val2) => {
    let compareValue = 0;

    if (itereeFn) {
      const val1Value = itereeFn(val1);
      const val2Value = itereeFn(val2);
      compareValue = compareValues(val1Value, val2Value);
    } else {
      compareValue = compareValues(val1, val2);
    }

    return (ascending ? 1 : -1) * compareValue;
  });
}

function compareValues<T>(valA: T, valB: T) {
  if (!valA || !valB) {
    if (valA && !valB) {
      return 1;
    }

    return valB && !valA ? -1 : 0;
  }

  if (typeof valA === "string" && typeof valB === "string") {
    return valA.localeCompare(valB, "en", { numeric: true });
  }

  if (valA > valB) {
    return 1;
  }

  return valB > valA ? -1 : 0;
}
