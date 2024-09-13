import { Box } from "@mui/material";
import { Column, DataGridRecord } from "../types";
import { Tooltip } from "@vizexplorer/global-ui-v2";

type HeaderCellProps<T extends DataGridRecord> = {
  column: Column<T>;
};

export function GridHeaderStringCell<T extends DataGridRecord>({
  column
}: HeaderCellProps<T>) {
  return (
    <Tooltip
      title={column.headerName}
      enterDelay={500}
      enterNextDelay={500}
      placement={"top"}
    >
      <Box overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={"nowrap"}>
        {column.headerName}
      </Box>
    </Tooltip>
  );
}
