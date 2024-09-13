import { Box, styled } from "@mui/material";
import { useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { getColumnWidth, stickyColumnStyle } from "../utils";
import { STICKY_ROW_Z_INDEX } from "../constants";
import { GridHeaderStringCell } from "./grid-header-string-cell";
import { GridHeaderBaseCell } from "./grid-header-base-cell";
import { useDataGridContext } from "../context";

// fills the remaining table width in the case the number of columns don't fill the table width
const Spacer = styled(Box)({
  display: "flex",
  width: "100%"
});

export function GridHeader() {
  const globalTheme = useGlobalTheme();
  const { columns, pinnedColumns, columnLeftOffset } = useDataGridContext();
  const pinnedColIdx = columns.findIndex((col) => col.field === pinnedColumns?.field) + 1;

  return (
    <Box
      data-testid={"datagrid-header"}
      display={"flex"}
      position={"sticky"}
      top={0}
      zIndex={STICKY_ROW_Z_INDEX}
    >
      {columns.map((column, colIdx) => {
        return (
          <GridHeaderBaseCell
            key={`col-${column.headerName}-${colIdx}`}
            width={getColumnWidth(column)}
            justifyContent={column.justifyContent}
            {...stickyColumnStyle(colIdx, pinnedColIdx, columnLeftOffset[colIdx])}
          >
            {column.type === "custom" ? (
              column.renderHeader?.()
            ) : (
              <GridHeaderStringCell
                key={`col-${column.headerName}-${colIdx}`}
                column={column}
                {...stickyColumnStyle(colIdx, pinnedColIdx, columnLeftOffset[colIdx])}
                {...column.headerCellProps}
              />
            )}
          </GridHeaderBaseCell>
        );
      })}

      <Spacer bgcolor={globalTheme.colors.grey[50]} />
    </Box>
  );
}
