import { Box, styled } from "@mui/material";
import { GridCellBase, GridCellRenderer } from "./grid-cell";
import { stickyRowStyle } from "./utils";
import { useDataGridContext } from "./context";

// fills any space where the datagrid is wider than there are number of columns to fill the space
export const SpacerCell = styled(GridCellBase)({
  flexShrink: 1,
  padding: 0
});

export function GridBody() {
  const { columns, rows, pinnedRows, rowStyle } = useDataGridContext();

  return (
    <Box data-testid={"datagrid-body"} display={"flex"} flexDirection={"column"}>
      {rows.map((row, rowIdx) => {
        return (
          <Box
            key={`row-${rowIdx}`}
            data-testid={"datagrid-row"}
            display={"flex"}
            minWidth={"fit-content"}
            bgcolor={"#FFF"}
            {...stickyRowStyle(rowIdx, pinnedRows)}
            sx={rowStyle?.(row)}
          >
            {columns.map((column, colIdx) => {
              return (
                <GridCellRenderer
                  key={`col-${column.headerName}-${colIdx}`}
                  colIdx={colIdx}
                  column={column}
                  row={row}
                />
              );
            })}
            <SpacerCell
              data-testid={"data-grid-spacer-cell"}
              data-editable={"false"}
              width={"100%"}
            />
          </Box>
        );
      })}
    </Box>
  );
}
