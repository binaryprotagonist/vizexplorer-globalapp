import MaterialTable, {
  Action,
  Column,
  Components,
  Localization,
  Options
} from "@material-table/core";
import { TablePagination } from "./table-pagination";
import { useMemo } from "react";
import { TableToolbar } from "./toolbar";
import { TableContainer } from "./table-container";
import { ITEMS_PER_PAGE, createDefaultOptions, mergeOptions } from "./utils";
import { TableCell } from "./table-cell";
import { TableAction } from "./table-action";
import TableActions from "./table-actions";
import { TableRow } from "./table-row";
import { useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { TableToolbarProps } from "./types";

type Props<T extends object> = {
  data: T[];
  columns: Column<T>[];
  actions?: (Action<T> | ((rowData: T) => Action<T>))[];
  loading?: boolean;
  options?: Options<T>;
  toolbar?: TableToolbarProps;
  onRowClick?: (event?: React.MouseEvent, rowData?: T) => void;
};

export function Table<T extends object>({
  data,
  columns,
  actions,
  options: providedOptions,
  loading = false,
  toolbar = { type: "default" },
  ...rest
}: Props<T>) {
  const theme = useGlobalTheme();

  const options = useMemo<Options<T>>(() => {
    const defaultOptions = createDefaultOptions(theme, data, loading);
    if (!providedOptions) return defaultOptions;
    return mergeOptions(defaultOptions, providedOptions);
  }, [providedOptions, data, loading, theme]);

  const components = useMemo<Components>(
    () => ({
      ...(toolbar.type === "default" && {
        Toolbar: (props) => <TableToolbar {...props} loading={loading} />,
        Container: TableContainer
      }),
      ...(toolbar.type === "custom" && {
        Toolbar: (props) => (
          <TableToolbar {...props} customToolbar={toolbar.component} loading={loading} />
        ),
        Container: TableContainer
      }),
      ...(toolbar.type === "external" && {
        Toolbar: () => null,
        Container: (props) => props.children
      }),
      Row: (props) => (
        <TableRow data-testid={"table-row"} paging={options.paging} {...props} />
      ),
      Cell: (props) => <TableCell {...props} loading={loading} />,
      Actions: TableActions,
      Action: TableAction,
      Pagination: (props) => (
        <TablePagination
          page={props.page}
          numPages={Math.ceil(props.count / props.rowsPerPage)}
          onPageChange={props.onPageChange}
          loading={loading}
        />
      )
    }),
    [toolbar.type, toolbar.component, loading, data, options.paging]
  );

  // TODO enhancement would be to build loading support directly into the table
  // quick hack as changing `data` causes console warnings
  if (loading) {
    return (
      <MaterialTable
        // key is necessary to force react to completely remount the table when loading is complete, otherwise render functions can be called with mocked loading data
        key={"material-table-loading"}
        // don't include columns without titles as they're typically spacers
        columns={columns.filter((c) => c.title)}
        data={mockLoadingData}
        options={options}
        actions={actions}
        components={components}
        localization={localization}
        {...rest}
      />
    );
  }

  return (
    <MaterialTable
      key={"material-table"}
      columns={columns}
      data={data}
      options={options}
      actions={actions}
      components={components}
      localization={localization}
      {...rest}
    />
  );
}

const localization: Localization = {
  header: {
    actions: ""
  },
  toolbar: {
    searchPlaceholder: "Search"
  }
};

const mockLoadingData: any[] = Array.from({ length: ITEMS_PER_PAGE }, (_, index) => ({
  // each row requires a unique ID
  id: index
}));
