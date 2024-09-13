import { useDataGridContext } from "../context";
import { Column, DataGridRecord } from "../types";
import { getColumnWidth, getRowId, stickyColumnStyle } from "../utils";
import { GridCellBase } from "./grid-cell-base";
import { GridStringCell } from "./grid-string-cell";

type Props<T extends DataGridRecord> = {
  colIdx: number;
  column: Column<T>;
  row: T;
};

export function GridCellRenderer<T extends DataGridRecord>({
  colIdx,
  column,
  row
}: Props<T>) {
  const {
    pinnedColumns,
    columns,
    editCell,
    columnLeftOffset,
    isCellEditable,
    cellStyle,
    updateEditCell,
    onCellValueChange
  } = useDataGridContext<T>();

  const canEditCell = isCellEditable?.({ column, row });
  const isEditingCell =
    editCell?.id === getRowId(row) && editCell?.field === column.field;
  const pinnedColIdx = columns.findIndex((col) => col.field === pinnedColumns?.field) + 1;

  function handleCellClick() {
    if (!canEditCell) return;
    updateEditCell({ id: getRowId(row), field: column.field });
  }

  function handleCellBlur() {
    updateEditCell(null);
  }

  return (
    <GridCellBase
      data-editable={`${canEditCell}`}
      width={getColumnWidth(column)}
      justifyContent={column.justifyContent}
      sx={cellStyle?.({ column, row })}
      onClick={handleCellClick}
      onBlur={handleCellBlur}
      {...stickyColumnStyle(colIdx, pinnedColIdx, columnLeftOffset[colIdx])}
    >
      {column.type === "custom" ? (
        column.renderCell?.({ row })
      ) : (
        <GridStringCell
          data-editable={`${canEditCell}`}
          mode={isEditingCell ? "edit" : "view"}
          column={column}
          row={row}
          onChange={onCellValueChange}
        />
      )}
    </GridCellBase>
  );
}
