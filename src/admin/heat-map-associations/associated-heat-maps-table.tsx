import { Action, Column, MTableBodyRow, MTableToolbar } from "@material-table/core";
import { ToolbarProps, Tooltip } from "@mui/material";
import { format, isAfter, parseISO } from "date-fns";
import { OrgHeatMapFragment } from "generated-graphql";
import { useMemo, useState } from "react";
import { TableContainer } from "../../settings/common";
import { ActionProps, BasicAction, BasicMaterialTable } from "../../view/table";
import { HEATMAP_DATE_FORMAT, filenameFromId } from "./utils";

type Props = {
  data: OrgHeatMapFragment[];
  onClickDelete: (data: OrgHeatMapFragment) => void;
  loading: boolean;
  search: string;
  onSearchChange: (keyword: string) => void;
};

export function AssociatedHeatMapsTable({
  data,
  onClickDelete,
  loading,
  search,
  onSearchChange
}: Props) {
  const [initialSearch] = useState<string>(search);

  const columns = useMemo<Column<OrgHeatMapFragment>[]>(
    () => [
      {
        title: "File Name",
        render: (data) => {
          return (
            <Tooltip title={data.heatMapId ?? ""} placement={"bottom-start"}>
              <span>{filenameFromId(data.heatMapId ?? "")}</span>
            </Tooltip>
          );
        },
        customFilterAndSearch: (search, data) => {
          return (data.heatMapId ?? "").toLowerCase().includes(search.toLowerCase());
        },
        customSort: (heatmapA, heatmapB) => {
          const filenameA = filenameFromId(heatmapA.heatMapId ?? "");
          const filenameB = filenameFromId(heatmapB.heatMapId ?? "");
          return new Intl.Collator().compare(filenameA, filenameB);
        }
      },
      {
        title: "Effective Date",
        render: (heatmap) => format(parseISO(heatmap.effectiveFrom), HEATMAP_DATE_FORMAT),
        customFilterAndSearch: (search, heatmap) => {
          const date = format(parseISO(heatmap.effectiveFrom), HEATMAP_DATE_FORMAT);
          return date.toLowerCase().includes(search.toLowerCase());
        },
        customSort: (a, b) => {
          const dateA = parseISO(a.effectiveFrom);
          const dateB = parseISO(b.effectiveFrom);
          return isAfter(dateA, dateB) ? 1 : -1;
        },
        defaultSort: "desc"
      },
      {
        title: "Floor ID",
        field: "floorId"
      }
    ],
    []
  );

  const actions: ((association: OrgHeatMapFragment) => Action<OrgHeatMapFragment>)[] = [
    (association) => ({
      icon: "Delete",
      onClick: () => onClickDelete(association)
    })
  ];

  return (
    <BasicMaterialTable
      components={{
        Container: (props: OrgHeatMapFragment) => (
          <TableContainer
            {...props}
            data-testid={"associated-heat-maps-table"}
            elevation={0}
          />
        ),
        Action: (props: ActionProps<OrgHeatMapFragment>) => <BasicAction {...props} />,
        Row: (props) => (
          <MTableBodyRow data-testid={"associated-heat-map-row"} {...props} />
        ),
        Toolbar: (props: ToolbarProps) => <MTableToolbar {...props} />
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
        searchText: initialSearch
      }}
      localization={{
        header: {
          actions: ""
        }
      }}
      isLoading={loading}
      onSearchChange={onSearchChange}
    />
  );
}
