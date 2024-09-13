import { SxProps, Theme } from "@mui/material";

/**
 * https://mui.com/system/getting-started/the-sx-prop/#array-values
 * create an sx array where the second sx object will override values within the first one
 * unlike sx object spread, selector values will also be merged, instead of completely replaced
 */
export function mergeSx(first: SxProps<Theme>, second?: SxProps<Theme>): SxProps<Theme> {
  if (!second) return first;

  const firstArr = Array.isArray(first) ? first : [first];
  const secondArr = Array.isArray(second) ? second : [second];
  return [...firstArr, ...secondArr];
}
