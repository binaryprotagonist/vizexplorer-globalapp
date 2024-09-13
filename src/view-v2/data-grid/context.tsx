import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { DataGridProps, DataGridRecord, GridEditCell } from "./types";
import { GRID_CHECKBOX_SELECTION_COLUMN_DEF } from "./column-def";
import { computeColumnLeftOffset } from "./utils";

export type DataGridCtx<T extends DataGridRecord> = DataGridProps<T> & {
  columnLeftOffset: number[];
  editCell: GridEditCell | null;
  updateEditCell: (editCell: GridEditCell | null) => void;
};

export const DataGridContext = createContext<DataGridCtx<any> | null>(null);

type DataGridContextProviderProps<T extends DataGridRecord> = {
  props: DataGridProps<T>;
  children: ReactNode;
};

export function DataGridProvider<T extends DataGridRecord>({
  props,
  children
}: DataGridContextProviderProps<T>) {
  const [editCell, setEditCell] = useState<GridEditCell | null>(null);

  const computedColumns = useMemo(() => {
    if (props.checkboxSelection) {
      return [GRID_CHECKBOX_SELECTION_COLUMN_DEF, ...props.columns];
    }

    return props.columns;
  }, [props.columns, props.checkboxSelection]);

  const columnLeftOffset: number[] = useMemo(
    () => computeColumnLeftOffset(computedColumns),
    [computedColumns]
  );

  return (
    <DataGridContext.Provider
      value={{
        ...props,
        columns: computedColumns,
        columnLeftOffset,
        editCell,
        updateEditCell: setEditCell
      }}
    >
      {children}
    </DataGridContext.Provider>
  );
}

export function useDataGridContext<T extends DataGridRecord>() {
  const ctx = useContext(DataGridContext);

  if (!ctx) {
    throw new Error("missing DataGridProvider");
  }

  return ctx as DataGridCtx<T>;
}
