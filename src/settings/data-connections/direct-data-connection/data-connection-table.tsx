import { MTableBodyRow } from "@material-table/core";
import { TableData } from "./types";
import {
  DataConnectorFieldsFragment,
  DataSourceFieldsFragment,
  GaUserFragment
} from "generated-graphql";
import {
  dataRefreshTime,
  sourceConnection,
  sourceProperty,
  vizOndemandProperty
} from "./columns";
import { BasicAction, BasicMaterialTable } from "../../../view/table";
import { TableContainer } from "../../common";
import { canUser } from "../../../view/user/utils";
import { UserActionType } from "../../../view/user/types";
import { toolbarClasses } from "@mui/material";

type Props = {
  currentUser: GaUserFragment;
  dataSources: DataSourceFieldsFragment[];
  dataConnectors: DataConnectorFieldsFragment[];
  onClickEdit: (source: DataSourceFieldsFragment) => void;
};

export function DataConnectionTable({
  currentUser,
  dataSources,
  dataConnectors,
  onClickEdit
}: Props) {
  return (
    <>
      <span data-testid={"data-connection-table"} />
      <BasicMaterialTable
        components={{
          Container: (props) => (
            <TableContainer
              {...props}
              elevation={0}
              sx={{
                [`& .${toolbarClasses.root}`]: {
                  minHeight: "0",
                  marginBottom: "8px"
                }
              }}
            />
          ),
          Action: BasicAction,
          Row: (props) => <MTableBodyRow data-testid="data-connection-row" {...props} />
        }}
        columns={[vizOndemandProperty, sourceConnection, sourceProperty, dataRefreshTime]}
        data={dataSources.map<TableData>((source) => {
          const connector = dataConnectors.find(
            (conn) => conn.id === source.connector?.id
          );

          return {
            id: `${source.app!.id}:${source.site!.id}`,
            sourceId: source.id!,
            vizSite: source.site!.name,
            connectionName: connector?.name,
            sourceSite: source.connectorParams?.siteId,
            dataRefreshTime: connector?.dataRefreshTime
          };
        })}
        actions={[
          (tableData) => {
            const source = dataSources.find(
              (source) => source.id === tableData.sourceId
            )!;
            const userCanManage = canUser(currentUser, {
              type: UserActionType.MANAGE_DATA_CONN,
              appId: source.app!.id,
              siteId: source.site!.id
            });

            return {
              icon: "Edit",
              onClick: () => onClickEdit(source),
              tooltip: !userCanManage
                ? "You don't have permission to edit this data connection. Please contact an Org Admin"
                : "",
              disabled: !userCanManage
            };
          }
        ]}
        options={{
          actionsColumnIndex: -1,
          emptyRowsWhenPaging: false,
          draggable: false,
          showTitle: false
        }}
        localization={{
          header: {
            actions: ""
          }
        }}
      />
    </>
  );
}
