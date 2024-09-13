import { Action, Column, MTableBodyRow } from "@material-table/core";
import { Tooltip } from "@mui/material";
import { format, isAfter, parseISO } from "date-fns";
import { HeatMapInventoryFragment } from "generated-graphql";
import { useMemo, useState } from "react";
import { TableContainer } from "../../settings/common";
import { ActionProps, BasicAction, BasicMaterialTable } from "../../view/table";
import { filenameFromId, UPLOAD_DATE_FORMAT } from "./utils";

type Props = {
  data: HeatMapInventoryFragment[];
  search: string;
  onClickSelect: (heatmap: HeatMapInventoryFragment) => void;
  onSearchChange: (search: string) => void;
  loading: boolean;
};

export function AllHeatMapsTable({
  data,
  search,
  onClickSelect,
  onSearchChange,
  loading
}: Props) {
  // MUI Table doesn't support a controlled search component. We can just set the value once on mount
  const [initialSearch] = useState<string>(search);

  const columns = useMemo<Column<HeatMapInventoryFragment>[]>(
    () => [
      {
        title: "File Name",
        render: (data) => {
          return (
            <Tooltip title={data.id} placement={"bottom-start"}>
              <span>{filenameFromId(data.id)}</span>
            </Tooltip>
          );
        },
        customFilterAndSearch: () => true,
        customSort: (heatmapA, heatmapB) => {
          const filenameA = filenameFromId(heatmapA.id ?? "");
          const filenameB = filenameFromId(heatmapB.id ?? "");
          return new Intl.Collator().compare(filenameA, filenameB);
        },
        width: "30%"
      },
      {
        title: "Upload Date",
        render: (heatmap) => {
          return format(parseISO(heatmap.uploadedAt), UPLOAD_DATE_FORMAT);
        },
        customFilterAndSearch: () => true,
        customSort: (a, b) => {
          const dateA = parseISO(a.uploadedAt);
          const dateB = parseISO(b.uploadedAt);
          return isAfter(dateA, dateB) ? 1 : -1;
        },
        defaultSort: "desc"
      }
    ],
    []
  );

  const actions: ((
    heatmap: HeatMapInventoryFragment
  ) => Action<HeatMapInventoryFragment>)[] = [
    (heatmap) => ({
      icon: "Select",
      onClick: () => onClickSelect(heatmap)
    })
  ];

  return (
    <BasicMaterialTable
      components={{
        Container: (props: HeatMapInventoryFragment) => (
          <TableContainer {...props} data-testid={"all-heat-maps-table"} elevation={0} />
        ),
        Action: (props: ActionProps<HeatMapInventoryFragment>) => (
          <BasicAction {...props} />
        ),
        Row: (props) => <MTableBodyRow data-testid={"heatmap-row"} {...props} />
      }}
      columns={columns}
      data={data}
      actions={actions}
      options={{
        actionsColumnIndex: -1,
        emptyRowsWhenPaging: false,
        draggable: false,
        showTitle: false,
        idSynonym: "id",
        searchAutoFocus: true,
        debounceInterval: 300,
        searchText: initialSearch
      }}
      localization={{
        header: {
          actions: ""
        },
        body: {
          emptyDataSourceMessage: loading ? "" : "There are no files uploaded yet"
        }
      }}
      isLoading={loading}
      onSearchChange={onSearchChange}
    />
  );
}
