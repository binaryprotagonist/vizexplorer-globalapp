import { useState } from "react";
import { Column, DataGridRecord } from "./types";
import {
  DEFAULT_CELL_HEIGHT,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_HEADER_HEIGHT,
  SCROLLBAR_SIZE
} from "./constants";
import { Box } from "@mui/material";
import { useDataGridContext } from "./context";

type Props = {
  children: React.ReactNode;
};

export function GridContainer({ children, ...rest }: Props) {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const { columns, rows, maxRows } = useDataGridContext();

  // determine if table overflows horizontally so we can adjust padding to account accordingly
  const containerWidth = containerRef?.clientWidth ?? 0;
  const shouldLimitGridHeight = maxRows && maxRows < rows.length;

  return (
    <Box
      ref={setContainerRef}
      sx={{
        display: "flex",
        width: "100%",
        overflow: "hidden",
        ...(shouldLimitGridHeight && {
          height: heightFromMaxRows(maxRows, containerWidth, columns, rows)
        })
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

// limit the height of the container to cleanly display the number of `maxRows` specified with special handling for scrollbar visibility
function heightFromMaxRows<T extends DataGridRecord>(
  maxRows: number,
  containerWidth: number,
  columns: Column<T>[],
  rows: T[]
) {
  // when scrolled to the bottom of the list, we want the border of the second top item to be visible to divide the visible first and second items
  const borderWidth = 1;
  const tableWidth =
    columns.reduce((acc, column) => acc + (column.width ?? DEFAULT_COLUMN_WIDTH), 0) +
    (maxRows && rows.length > maxRows ? SCROLLBAR_SIZE : 0);

  return `${maxRows * DEFAULT_CELL_HEIGHT + DEFAULT_HEADER_HEIGHT + (containerWidth < tableWidth ? SCROLLBAR_SIZE : 0) + borderWidth}px`;
}
