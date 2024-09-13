export const MAX_RANGE_VALUE = 9_999_999_999;
export const MIN_RANGE_VALUE = -MAX_RANGE_VALUE;

export function getValidRangeValue(value: string): string {
  if (!value) return "";

  const validValue = Math.min(MAX_RANGE_VALUE, Math.max(MIN_RANGE_VALUE, Number(value)));
  return `${validValue}`;
}
