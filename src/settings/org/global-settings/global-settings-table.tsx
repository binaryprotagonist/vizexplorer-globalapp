import { useMemo } from "react";
import { Action, Column, MTableBodyRow } from "@material-table/core";
import { ActionProps, BasicAction, BasicMaterialTable } from "../../../view/table";
import { TableContainer } from "../../common";
import { Box, Skeleton, Typography } from "@mui/material";
import { GlobalSetting } from "./types";
import { settingValueSearch, timePeriodLabel } from "./utils";
import { isOrgAdmin } from "../../../view/user/utils";
import { SettingHelp } from "./setting-help";
import { assetUnreachable } from "../../../view/utils";
import { GaUserFragment } from "generated-graphql";

type Props = {
  currentUser: GaUserFragment | null;
  settings: GlobalSetting[];
  loading: boolean;
  onEditClick: (setting: GlobalSetting) => void;
};

export function GlobalSettingsTable({
  currentUser,
  settings,
  loading,
  onEditClick
}: Props) {
  const actions: ((setting: GlobalSetting) => Action<GlobalSetting>)[] = [
    (setting) => {
      return {
        icon: "Edit",
        disabled: loading || !currentUser || !isOrgAdmin(currentUser.accessLevel),
        tooltip:
          currentUser && !isOrgAdmin(currentUser.accessLevel)
            ? "You don't have permission to Edit Settings. Please contact an Org Admin"
            : "",
        onClick: () => onEditClick(setting)
      };
    }
  ];

  const columns: Column<GlobalSetting>[] = useMemo(
    () => [
      {
        title: "Setting Name",
        field: "name",
        width: "320px",
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
        width: "400px",
        customFilterAndSearch: (search, setting) => {
          return setting.description.toLowerCase().includes(search.toLowerCase());
        }
      },
      {
        title: "Value",
        sorting: false,
        width: "400px",
        render: (setting) => <SettingValue setting={setting} />,
        customFilterAndSearch: settingValueSearch
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
      <span data-testid={"global-settings-table"} />
      <BasicMaterialTable
        components={{
          Container: TableContainer,
          Action: (props: ActionProps<GlobalSetting>) => <BasicAction {...props} />,
          Row: (props) => <MTableBodyRow data-testid={"global-settings-row"} {...props} />
        }}
        title={"Global Settings"}
        columns={columns}
        actions={actions}
        data={settings}
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
      <Box data-testid={"global-settings-loading"} padding={"12px"} marginTop={"12px"}>
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

function SettingValue({ setting }: { setting: GlobalSetting }) {
  if (setting.id === "worth-pct") {
    return <span>{setting.config.value}%</span>;
  }

  if (setting.id === "guest-time-periods" || setting.id === "host-time-periods") {
    return (
      <span>
        {setting.config.value
          .filter((p) => p.enabled)
          .map((p, idx) => (
            <Typography key={`time-period-row-${idx}`}>
              {timePeriodLabel(p)}
              {p.default && " (default)"}
            </Typography>
          ))}
      </span>
    );
  }

  assetUnreachable(setting);
}
