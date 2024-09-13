import { BoxProps } from "@mui/material";

export type GridRowId = string;
export type DataGridRecord = Record<string, any>;

export type Column<T extends DataGridRecord = any> = {
  // column identifier
  field: string;
  headerName?: string;
  width?: number;
  justifyContent?: GridColumnJustify;
  headerCellProps?: BoxProps;
  type?: ColumnValueType;
  valueGetter?: (params: { row: T }) => string;
  valuePlaceholder?: (params: { id: GridRowId }) => string | null;
  // run prior to onChange to validate & potentially alter user input
  valueParser?: (value: string) => string;
  renderCell?: (props: RenderCellProps<T>) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
};

export type ColumnValueType = "number" | "string" | "custom";

export type GridColumnJustify = "start" | "center" | "end";

export type GridColumnStickyStyle = {
  position: "sticky";
  left: number;
  zIndex: number;
};

export type RenderCellProps<T extends DataGridRecord> = {
  row: T;
};

export type RowStyle<T extends DataGridRecord> = (row: T) => React.CSSProperties;

export type CellStyleParams<T extends DataGridRecord> = {
  column: Column<T>;
  row: T;
};

// params is optional as we want the ability to style cells that exist outside the provided rows/cols (empty cells, for example)
export type CellStyle<T extends DataGridRecord> = (
  params?: CellStyleParams<T>
) => React.CSSProperties;

export type IsCellEditableParams<T extends DataGridRecord> = {
  column: Column<T>;
  row: T;
};

export type IsCellEditable<T extends DataGridRecord> = (
  params: IsCellEditableParams<T>
) => boolean;

export type CellValueChangeParams<T extends DataGridRecord> = {
  column: Column<T>;
  row: T;
  value: string;
};

export type CellValueChange<T extends DataGridRecord> = (
  params: CellValueChangeParams<T>
) => void;

export type PinnedColumns = {
  // all fields to the left of `field` will be pinned
  field?: string;
};

export type PinnedRows = {
  // number of rows pinned to the top
  top?: number;
};

export type CellMode = "view" | "edit";

export type DataGridProps<T extends DataGridRecord> = {
  columns: Column<T>[];
  rows: T[];
  maxRows?: number;
  pinnedColumns?: PinnedColumns;
  pinnedRows?: PinnedRows;
  checkboxSelection?: true;
  rowSelectionModel?: Set<string>;
  // TODO can't support disabling individual checkboxes as our design spec checkbox doesn't support partial selection display
  // We support none selected, or all selected. Need to support if > 0 but < all selected
  // https://mui.com/x/react-data-grid/row-selection/#disable-selection-on-certain-rows
  disableAllCheckboxSelection?: boolean;
  rowStyle?: RowStyle<T>;
  cellStyle?: CellStyle<T>;
  isCellEditable?: IsCellEditable<T>;
  onCellValueChange?: CellValueChange<T>;
  onRowSelectionModelChange?: (newSelection: Set<string>) => void;
};

export type GridEditCell = {
  id: GridRowId;
  field: string;
};
