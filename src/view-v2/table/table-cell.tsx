import { MTableCell } from "@material-table/core";
import { Skeleton } from "@mui/material";
import { ColumnDef } from "./types";
import { useGlobalTheme } from "@vizexplorer/global-ui-v2";

type Props<T extends object> = {
  loading: boolean;
  rowData: T;
  value?: string;
  columnDef: ColumnDef<T>;
};

export function TableCell<T extends object>({
  loading,
  rowData,
  value,
  columnDef,
  ...rest
}: Props<T>) {
  const theme = useGlobalTheme();

  if (loading) {
    return (
      <MTableCell data-testid={"table-cell-loading"} {...rest} columnDef={columnDef}>
        <Skeleton variant={"rounded"} height={"22px"} />
      </MTableCell>
    );
  }

  const styledColumnDef = {
    ...columnDef,
    // only method found to override cell styles. Applying style via style, sx, etc doesn't get applied.
    cellStyle: { fontSize: "14px", ...columnDef.cellStyle, fontFamily: theme.fontFamily }
  };

  return (
    <MTableCell {...rest} rowData={rowData} value={value} columnDef={styledColumnDef} />
  );
}
