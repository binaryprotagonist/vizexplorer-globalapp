import { useMemo } from "react";
import { Action, Column, MTableBodyRow } from "@material-table/core";
import { ActionProps, BasicAction, BasicMaterialTable } from "../../../view/table";
import { TableContainer } from "../../common";
import { Box, Skeleton } from "@mui/material";
import { PdreSetting } from "./types";
import { displaySettingValue } from "./utils";
import { isOrgAdmin } from "../../../view/user/utils";
import { SettingHelp } from "../../org/global-settings/setting-help";
import { GaUserFragment } from "generated-graphql";

type Props = {
  currentUser: GaUserFragment | null;
  settings: PdreSetting[];
  loading: boolean;
  onEditClick: (setting: PdreSetting) => void;
};

export function PdreSettingsTable({
  currentUser,
  settings,
  loading,
  onEditClick
}: Props) {
  const actions: ((setting: PdreSetting) => Action<PdreSetting>)[] = [
    (setting) => {
      return {
        icon: "Edit",
        onClick: () => onEditClick(setting),
        disabled: loading || !currentUser || !isOrgAdmin(currentUser.accessLevel),
        tooltip:
          currentUser && !isOrgAdmin(currentUser.accessLevel)
            ? "You don't have permission to Edit Settings. Please contact an Org Admin"
            : ""
      };
    }
  ];

  const columns: Column<PdreSetting>[] = useMemo(
    () => [
      {
        title: "Setting Name",
        field: "name",
        width: "25%",
        render: (setting) => {
          return (
            <>
              {setting.name}
              {setting.additionalInfo && (
                <SettingHelp settingInfo={setting.additionalInfo} />
              )}
            </>
          );
        },
        customFilterAndSearch: (search, setting) => {
          return setting.name.toLocaleLowerCase().includes(search.toLocaleLowerCase());
        },
        customSort: (settingA, settingB) => {
          return new Intl.Collator().compare(settingA.name, settingB.name);
        }
      },
      {
        title: "Description",
        field: "description",
        sorting: false,
        customFilterAndSearch: (search, setting) => {
          return setting.description.toLowerCase().includes(search.toLowerCase());
        },
        width: "40%"
      },
      {
        title: "Value",
        render: (setting) => displaySettingValue(setting),
        sorting: false,
        customFilterAndSearch: (search, setting) => {
          return displaySettingValue(setting)
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase());
        },
        cellStyle: { textAlign: "center" },
        headerStyle: { textAlign: "center" },
        width: "20%"
      },
      { sorting: false }
    ],
    []
  );

  if (loading) {
    return <LoadingTable />;
  }

  return (
    <>
      <span data-testid={"pdre-settings-table"} />
      <BasicMaterialTable
        components={{
          Container: TableContainer,
          Action: (props: ActionProps<PdreSetting>) => <BasicAction {...props} />,
          Row: (props) => <MTableBodyRow data-testid={"pdre-settings-row"} {...props} />
        }}
        title={"Player Recommendation Engine Settings"}
        columns={columns}
        data={settings}
        actions={actions}
        options={{
          actionsColumnIndex: -1,
          emptyRowsWhenPaging: false,
          draggable: false
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

function LoadingTable() {
  return (
    <TableContainer>
      <Box data-testid={"pdre-settings-loading"} padding={"12px"} marginTop={"12px"}>
        <Skeleton
          variant={"rectangular"}
          width={260}
          height={40}
          sx={{ margin: "0 18px 18px auto" }}
        />
        <Skeleton variant={"rectangular"} width={"100%"} height={200} />
      </Box>
    </TableContainer>
  );
}
