import { Options } from "@material-table/core";
import { GlobalTheme } from "@vizexplorer/global-ui-v2";

export const ITEMS_PER_PAGE = 5;

export function createDefaultOptions<T extends object>(
  theme: GlobalTheme,
  data: T[],
  loading: boolean
): Options<T> {
  return {
    sorting: !loading,
    actionsColumnIndex: -1,
    paging: loading || data.length > ITEMS_PER_PAGE,
    grouping: false,
    draggable: false,
    headerStyle: {
      backgroundColor: theme.colors.grey[50],
      color: theme.colors.grey[600],
      fontSize: "12px",
      fontWeight: 600,
      fontFamily: theme.fontFamily
    }
  };
}

// Should be extended to merge nested objects as defined in `createDefaultOptions`
export function mergeOptions<T extends object>(
  options: Options<T>,
  other?: Options<T>
): Options<T> {
  return {
    ...options,
    ...other,
    headerStyle: {
      ...options.headerStyle,
      ...other?.headerStyle
    }
  };
}
