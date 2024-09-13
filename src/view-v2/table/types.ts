import { Action } from "@material-table/core";
import { CustomToolbarProps } from "./toolbar/table-toolbar";

export type ColumnDef<T extends object> = {
  title: string;
  cellStyle: React.CSSProperties;
  customFilterAndSearch: (term: string, rowData: T) => boolean;
  render: (rowData: T) => React.ReactNode;
  tableData: {
    id: number;
    additionalWidth: number;
    columnOrder: number;
    filterValue: any;
    groupOrder: any;
    groupSort: string;
    initialWidth: string;
    width: string;
    widthPx: number;
  };
};

export type TableActionDef<RowData extends object> =
  | {
      action: (data: RowData) => Action<RowData>;
    }
  | ((data: RowData) => Action<RowData>)
  | Action<RowData>;

/**
 * - Default renders table with built in search matching latest designs
 * - Custom allows for limited customization. Biggest known limitation is searching must still be within the table
 * - External allows for completely custom toolbar. Must be manually wrapped with a Table Container as the default isn't
 * applied automatically to allow for more flexibility
 */
export type TableToolbarProps =
  | {
      type: "default";
      component?: never;
    }
  | {
      type: "custom";
      component: (props: CustomToolbarProps) => React.ReactElement | null;
    }
  | {
      type: "external";
      component?: never;
    };
