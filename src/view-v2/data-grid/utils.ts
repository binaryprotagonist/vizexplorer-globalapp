import { BoxProps } from "@mui/material";
import { Column, DataGridRecord, GridColumnStickyStyle, PinnedRows } from "./types";
import {
  DEFAULT_CELL_HEIGHT,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_HEADER_HEIGHT,
  STICKY_COL_Z_INDEX,
  STICKY_ROW_Z_INDEX
} from "./constants";

export function stickyRowStyle(rowIdx: number, pinnedRows?: PinnedRows): BoxProps {
  if (!pinnedRows?.top || rowIdx >= pinnedRows.top) return {};

  return {
    position: "sticky",
    top: rowIdx * DEFAULT_CELL_HEIGHT + DEFAULT_HEADER_HEIGHT,
    zIndex: STICKY_ROW_Z_INDEX
  };
}

export function stickyColumnStyle(
  colIdx: number,
  pinIdx: number,
  colLeftOffset: number
): GridColumnStickyStyle | null {
  if (colIdx >= pinIdx) return null;

  return {
    position: "sticky",
    left: colLeftOffset,
    zIndex: STICKY_COL_Z_INDEX
  };
}

export function getRowId<T extends DataGridRecord>(row: T): string {
  if (!("id" in row) || typeof row.id !== "string") {
    throw Error("Row must have a string 'id' property");
  }

  return row.id;
}

export function getColumnWidth<T extends DataGridRecord>(column: Column<T>): number {
  return column.width ?? DEFAULT_COLUMN_WIDTH;
}

// Compute the left offset of each column based on the width of the columns. Used to position sticky columns
export function computeColumnLeftOffset<T extends DataGridRecord>(
  columns: Column<T>[]
): number[] {
  const offsets: number[] = [];
  let currentPos = 0;

  for (let i = 0; i < columns.length; i++) {
    offsets.push(currentPos);
    currentPos += getColumnWidth(columns[i]);
  }

  return offsets;
}
