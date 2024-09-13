import { memo } from "react";
import { Box } from "@mui/material";
import { GridContainer } from "./grid-container";
import { GridHeader } from "./grid-header";
import { GridBody } from "./grid-body";
import { DataGridProps, DataGridRecord } from "./types";
import { DataGridProvider } from "./context";

function RawDataGrid<T extends DataGridRecord = object>(props: DataGridProps<T>) {
  return (
    <DataGridProvider props={props}>
      <GridContainer data-testid={"datagrid"}>
        <Box overflow={"auto"} width={"100%"}>
          <GridHeader />
          <GridBody />
        </Box>
      </GridContainer>
    </DataGridProvider>
  );
}

type DataGridComponent = <T extends DataGridRecord = object>(
  props: DataGridProps<T>
) => JSX.Element;

export const DataGrid = memo(RawDataGrid) as DataGridComponent;
